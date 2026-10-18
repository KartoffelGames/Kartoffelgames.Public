import { ComparisonExpressionAst, type ComparisonExpressionAstData } from '../../../../abstract_syntax_tree/expression/operation/comparison-expression-ast.ts';
import { type BasePgslType, BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslNumericType } from "../../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts";
import { PgslVectorType } from '../../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslOperator } from '../../../../enum/pgsl-operator.enum.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ComparisonExpressionAst.
 */
export class ComparisonExpressionAstValidationProcessor extends PgslValidatorProcessor<ComparisonExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ComparisonExpressionAst {
        return ComparisonExpressionAst;
    }

    /**
     * Validates the PGSL comparison expression syntax tree.
     *
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: ComparisonExpressionAstData): void {
        // Validate the left and right expression.
        this.validateAst(pData.leftExpression);
        this.validateAst(pData.rightExpression);

        // Create list of all comparisons a boolean can compare.
        const lBooleanComparisonList: Array<PgslOperator> = [
            PgslOperator.Equal,
            PgslOperator.NotEqual
        ];

        // Validate that the operator is ==, !=, <, <=, > and >=.
        const lComparisonList: Array<PgslOperator> = [
            ...lBooleanComparisonList,
            PgslOperator.LowerThan,
            PgslOperator.LowerThanEqual,
            PgslOperator.GreaterThan,
            PgslOperator.GreaterThanEqual
        ];
        if (!lComparisonList.includes(pData.operatorName)) {
            this.pushIncident(`Operator "${pData.operatorName}" can not be used for comparisons.`);
        }

        // Validate that none of the expressions is a comparison itself, as chaining comparisons requires parentheses.
        for (const lExpression of [pData.leftExpression, pData.rightExpression]) {
            if (lExpression instanceof ComparisonExpressionAst) {
                this.pushIncident(`Chaining comparisons requires parentheses.`);
            }
        }

        // Validate that both expressions can converts into each other.
        const lLeftType: BasePgslType = pData.leftExpression.data.resolveType;
        const lRightType: BasePgslType = pData.rightExpression.data.resolveType;
        if (lRightType.conversionRankTo(lLeftType) === Number.POSITIVE_INFINITY && lLeftType.conversionRankTo(lRightType) === Number.POSITIVE_INFINITY) {
            this.pushIncident(`Comparison can only be between values of the same type.`);
        }

        // Validate that the expressions are scalars or vectors of scalars.
        const lItemType: BasePgslType = (lLeftType instanceof PgslVectorType) ? lLeftType.componentType : lLeftType;
        if (!lItemType.isKind(BasePgslTypeKind.Scalar)) {
            this.pushIncident(`Comparison can only be between scalar values.`);
        }

        // Validate that boolean expressions and Vectors of bool are only compared with == and !=.
        if (lItemType.isKind(BasePgslTypeKind.Boolean) && !lBooleanComparisonList.includes(pData.operatorName)) {
            this.pushIncident(`Boolean can only be compared with "NotEqual" or "Equal".`);
        }

        // Validate if one type is abstract and the other is conrete, that the abstract number constant fits into the concrete type.
        if (lLeftType.isKind(BasePgslTypeKind.Abstract) !== lRightType.isKind(BasePgslTypeKind.Abstract)) {
            // Get the concrete type and the constant value.
            const [lConstantNumber, lConstantExpression, lConstantType, lConcreteType] = (() => {
                if (lLeftType.isKind(BasePgslTypeKind.Abstract)) {
                    return [pData.leftExpression.data.constantValue, pData.leftExpression, lLeftType, lRightType];
                }

                return [pData.rightExpression.data.constantValue, pData.rightExpression, lRightType, lLeftType];
            })();

            if (typeof lConstantNumber === 'number' && lConcreteType instanceof PgslNumericType) {
                if (!lConcreteType.constantFits(lConstantType, lConstantNumber)) {
                    this.pushIncident(`Value ${lConstantNumber} does not fit into '${lConcreteType.meta.typeName}'.`, lConstantExpression);
                }
            }
        }
    }
}
