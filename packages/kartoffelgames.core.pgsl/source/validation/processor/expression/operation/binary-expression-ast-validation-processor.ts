import { ArithmeticExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts';
import { BinaryExpressionAst, type BinaryExpressionAstData } from '../../../../abstract_syntax_tree/expression/operation/binary-expression-ast.ts';
import { ComparisonExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/comparison-expression-ast.ts';
import { LogicalExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/logical-expression-ast.ts';
import { type BasePgslType, BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslNumericType } from '../../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslOperator } from '../../../../enum/pgsl-operator.enum.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of BinaryExpressionAst.
 */
export class BinaryExpressionAstValidationProcessor extends PgslValidatorProcessor<BinaryExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BinaryExpressionAst {
        return BinaryExpressionAst;
    }

    /**
     * Validates the PGSL binary expression syntax tree.
     *
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: BinaryExpressionAstData): void {
        // Validate the left and right expression.
        this.validateAst(pData.leftExpression);
        this.validateAst(pData.rightExpression);

        // Validate that the operator is one of |, &, ^, << or >>.
        const lBitOperatorList: Array<PgslOperator> = [
            PgslOperator.BinaryOr,
            PgslOperator.BinaryAnd,
            PgslOperator.BinaryXor,
            PgslOperator.ShiftLeft,
            PgslOperator.ShiftRight
        ];
        if (!lBitOperatorList.includes(pData.operatorName)) {
            this.pushIncident(`Operator "${pData.operatorName}" can not used for bit operations.`);
            return;
        }

        // Validate that expressions with an operator use the same operator. Only &, | and ^ can be chained with themselves, any other require parentheses.
        const lIsShiftOperation: boolean = pData.operatorName === PgslOperator.ShiftLeft || pData.operatorName === PgslOperator.ShiftRight;
        for (const lExpression of [pData.leftExpression, pData.rightExpression]) {
            // All types with "operatorName" data.
            const lExpressionTypes: Array<Function> = [
                BinaryExpressionAst, ComparisonExpressionAst, LogicalExpressionAst, ArithmeticExpressionAst
            ];

            // Read possible operator of arithmetic or binaray expressions.
            const lExpressionOperator: PgslOperator | null = (() => {
                // Hard to read but... Iterate all ast types with a operator name and if the expression is one of the types, return its operator name.
                for (const lExpressionType of lExpressionTypes) {
                    if (lExpression instanceof lExpressionType) {
                        return (<BinaryExpressionAst | ComparisonExpressionAst | LogicalExpressionAst | ArithmeticExpressionAst>lExpression).data.operatorName;
                    }
                }

                return null;
            })();

            // Not a operator expression.
            if (!lExpressionOperator) {
                continue;
            }

            // If its the same operator as this expression or the current expression is a shift operation, it allways requires parentheses.
            if (lExpressionOperator !== pData.operatorName || lIsShiftOperation) {
                this.pushIncident(`Mixing operator "${lExpressionOperator}" with "${pData.operatorName}" requires parentheses.`);
            }
        }

        // Vectors are validated with their inner type.
        const lLeftType: BasePgslType = pData.leftExpression.data.resolveType;
        const lRightType: BasePgslType = pData.rightExpression.data.resolveType;
        const lLeftItemType: BasePgslType = (lLeftType instanceof PgslVectorType) ? lLeftType.innerType : lLeftType;
        const lRightItemType: BasePgslType = (lRightType instanceof PgslVectorType) ? lRightType.innerType : lRightType;

        // Both types must be an integer or integer vector.
        if (!lLeftItemType.isKind(BasePgslTypeKind.Integer) || !lRightItemType.isKind(BasePgslTypeKind.Integer)) {
            // Scope this message to the correct ast.
            if (!lLeftItemType.isKind(BasePgslTypeKind.Integer)) {
                this.pushIncident(`Bit operations can only be applied to integer types.`, pData.leftExpression);
            }
            if (!lRightItemType.isKind(BasePgslTypeKind.Integer)) {
                this.pushIncident(`Bit operations can only be applied to integer types.`, pData.rightExpression);
            }

            // Other validations dont make sense without an int so we can skip them.
            return;
        }

        // Read constant values. If they not a number just treat them as zero as zero doesnt trigger any validations.
        let lLeftConstantValue: number = 0;
        if (typeof pData.leftExpression.data.constantValue === 'number') {
            lLeftConstantValue = pData.leftExpression.data.constantValue;
        }
        let lRightConstantValue: number = 0;
        if (typeof pData.rightExpression.data.constantValue === 'number') {
            lRightConstantValue = pData.rightExpression.data.constantValue;
        }

        // The right expression of a shift does not decide the result type and is validated on its own.
        if (lIsShiftOperation) {
            // Create a unsigned integer type, or a vector of it when the expresion type is a vector.
            const lUnsignedIntegerType: BasePgslType = (() => {
                const lType: BasePgslType = this.types.create(PgslNumericType, PgslNumericType.typeName.unsignedInteger);
                if (lLeftType instanceof PgslVectorType) {
                    return this.types.create(PgslVectorType, lLeftType.dimension, lType);
                }

                return lType;
            })();

            // Validate that the right expression converts to uint or a vector of it.
            if (lRightType.conversionRankTo(lUnsignedIntegerType) === Number.POSITIVE_INFINITY) {
                this.pushIncident(`Right expression of a shift operation must be of type ${lUnsignedIntegerType.meta.typeName}.`, pData.rightExpression);
            }

            // Validate that a constant right expression is not negative.
            if (lRightConstantValue < 0) {
                this.pushIncident(`Right expression of a shift operation must not be negative.`, pData.rightExpression);
            }

            // Validate that a constant right expression is less than 32, the bit width of int, uint and abstract int.
            if (lRightConstantValue >= 32) {
                this.pushIncident(`Right expression of a shift operation must be less than 32.`, pData.rightExpression);
            }

            // Get the shift result value if both expressions are constants.
            const lConstantShiftResult: number = (() => {
                // Clamp down shift value to limit bit overflow.
                const lShiftValue: number = Math.min(Math.max(lRightConstantValue, 0), 32);

                switch (pData.operatorName) {
                    case PgslOperator.ShiftLeft: return lLeftConstantValue << lShiftValue;
                    case PgslOperator.ShiftRight: return lLeftConstantValue >> lShiftValue;
                }

                return lLeftConstantValue;
            })();

            // Validate if shifted constant value fits into this expressions result type.
            if (pData.resolveType instanceof PgslNumericType && !pData.resolveType.constantFits(pData.resolveType, lConstantShiftResult)) {
                this.pushIncident(`Value ${lConstantShiftResult} does not fit into '${pData.resolveType.meta.typeName}'.`);
            }
        } else {
            // Validate that both expressions have the same type or that one converts implicitly into the other.
            if (lLeftType.conversionRankTo(lRightType) === Number.POSITIVE_INFINITY && lRightType.conversionRankTo(lLeftType) === Number.POSITIVE_INFINITY) {
                this.pushIncident(`Left and right side of bit expression must be the same type.`);
                return;
            }

            // Validate that a constant expression fits into the type of the other expression.
            if (lRightType instanceof PgslNumericType && !lRightType.constantFits(lLeftType, lLeftConstantValue)) {
                this.pushIncident(`Value ${lLeftConstantValue} does not fit into '${lRightType.meta.typeName}'.`, pData.leftExpression);
            }
            if (lLeftType instanceof PgslNumericType && !lLeftType.constantFits(lRightType, lRightConstantValue)) {
                this.pushIncident(`Value ${lRightConstantValue} does not fit into '${lLeftType.meta.typeName}'.`, pData.rightExpression);
            }
        }
    }
}
