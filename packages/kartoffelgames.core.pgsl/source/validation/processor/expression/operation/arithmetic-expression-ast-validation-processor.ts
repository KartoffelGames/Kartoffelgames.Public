import { ArithmeticExpressionAst, type ArithmeticExpressionAstData } from '../../../../abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts';
import { type BasePgslType, BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslMatrixType } from '../../../../abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslOperator } from '../../../../enum/pgsl-operator.enum.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ArithmeticExpressionAst.
 */
export class ArithmeticExpressionAstValidationProcessor extends PgslValidatorProcessor<ArithmeticExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ArithmeticExpressionAst {
        return ArithmeticExpressionAst;
    }

    /**
     * Validates the PGSL arithmetic expression syntax tree.
     *
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: ArithmeticExpressionAstData): void {
        // Validate the left and right expression.
        this.validateAst(pData.leftExpression);
        this.validateAst(pData.rightExpression);

        // Validate that the operator is one of +, -, *, / and %.
        const lArithmeticOperatorList: Array<PgslOperator> = [
            PgslOperator.Plus,
            PgslOperator.Minus,
            PgslOperator.Multiply,
            PgslOperator.Divide,
            PgslOperator.Modulo
        ];
        if (!lArithmeticOperatorList.includes(pData.operatorName)) {
            this.pushIncident(`Operator "${pData.operatorName}" can not used for arithmetic operations.`);
            return;
        }

        // Vectors and matrices are validated by their component type.
        const lLeftType: BasePgslType = pData.leftExpression.data.resolveType;
        const lRightType: BasePgslType = pData.rightExpression.data.resolveType;
        const lLeftItemType: BasePgslType = (lLeftType instanceof PgslVectorType || lLeftType instanceof PgslMatrixType) ? lLeftType.componentType : lLeftType;
        const lRightItemType: BasePgslType = (lRightType instanceof PgslVectorType || lRightType instanceof PgslMatrixType) ? lRightType.componentType : lRightType;

        // Validate that both expressions are numeric scalars, Vectors or Matrices.
        if (!lLeftItemType.isKind(BasePgslTypeKind.Numeric)) {
            this.pushIncident(`Arithmetic operations can only be applied to numeric types.`, pData.leftExpression);
        }
        if (!lRightItemType.isKind(BasePgslTypeKind.Numeric)) {
            this.pushIncident(`Arithmetic operations can only be applied to numeric types.`, pData.rightExpression);
        }

        // Validate that both component types are the same or that one converts implicitly into the other.
        if (lLeftItemType.conversionRankTo(lRightItemType) === Number.POSITIVE_INFINITY && lRightItemType.conversionRankTo(lLeftItemType) === Number.POSITIVE_INFINITY) {
            this.pushIncident('Left and right side of arithmetic expression must be the same type.');
        }

        // Validate that two Vectors have the same dimension.
        if (lLeftType instanceof PgslVectorType && lRightType instanceof PgslVectorType && lLeftType.dimension !== lRightType.dimension) {
            this.pushIncident('Left and right side of arithmetic expression must have the same dimension.');
        }

        // Validate operations between two Matrices.
        if (lLeftType instanceof PgslMatrixType && lRightType instanceof PgslMatrixType) {
            switch (pData.operatorName) {
                case PgslOperator.Plus:
                case PgslOperator.Minus: {
                    // Dimensions must match.
                    if (lLeftType.rowCount !== lRightType.rowCount || lLeftType.columnCount !== lRightType.columnCount) {
                        this.pushIncident('Left and right side of arithmetic expression must have the same dimensions.');
                    }
                    break;
                }
                case PgslOperator.Multiply: {
                    // The left columns must match the right rows.
                    if (lLeftType.columnCount !== lRightType.rowCount) {
                        this.pushIncident('When multiplying a matrix with another matrix, the left matrix columns must match the right matrix rows.');
                    }
                    break;
                }
                default: {
                    this.pushIncident('Only addition, subtraction and multiplication operations are allowed between matrix types.');
                }
            }
        }

        // Validate operations between a Matrix and a scalar or Vector.
        if ((lLeftType instanceof PgslMatrixType) !== (lRightType instanceof PgslMatrixType)) {
            // Only a multiplication is allowed.
            if (pData.operatorName !== PgslOperator.Multiply) {
                this.pushIncident('Only multiplication operation is allowed between matrix and scalar or vector types.');
            }

            // When its a matrix x vector operation, the matrix columns must match the vector dimension.
            if (lLeftType instanceof PgslMatrixType && lRightType instanceof PgslVectorType && lLeftType.columnCount !== lRightType.dimension) {
                this.pushIncident('When multiplying a matrix with a vector, the matrix columns must match the vector dimension.');
            }

            // When its a vector x matrix operation, the matrix rows must match the vector dimension.
            if (lLeftType instanceof PgslVectorType && lRightType instanceof PgslMatrixType && lRightType.rowCount !== lLeftType.dimension) {
                this.pushIncident('When multiplying a vector with a matrix, the matrix rows must match the vector dimension.');
            }
        }

        // Skip constant validations without any constants.
        if (typeof pData.leftExpression.data.constantValue !== 'number' && typeof pData.rightExpression.data.constantValue !== 'number') {
            return;
        }

        const lLeftConstantValue: number = typeof pData.leftExpression.data.constantValue === 'number' ? pData.leftExpression.data.constantValue : 0;
        const lRightConstantValue: number = typeof pData.rightExpression.data.constantValue === 'number' ? pData.rightExpression.data.constantValue : 0;

        // Left side constants.
        if (typeof pData.leftExpression.data.constantValue === 'number') {
            // Validate that an abstract constant fits into the concrete right side.
            if (lLeftItemType.isKind(BasePgslTypeKind.Abstract) && lRightItemType instanceof PgslNumericType && !lRightItemType.constantFits(lLeftItemType, lLeftConstantValue)) {
                this.pushIncident(`Value ${lLeftConstantValue} does not fit into '${lRightItemType.meta.typeName}'.`, pData.leftExpression);
            }
        }

        // Right side constants.
        if (typeof pData.rightExpression.data.constantValue === 'number') {
            // Validate that an abstract constant fits into the concrete left side.
            if (lRightItemType.isKind(BasePgslTypeKind.Abstract) && lLeftItemType instanceof PgslNumericType && !lLeftItemType.constantFits(lRightItemType, lRightConstantValue)) {
                this.pushIncident(`Value ${lRightConstantValue} does not fit into '${lLeftItemType.meta.typeName}'.`, pData.rightExpression);
            }

            // Validate division by zero.
            if ((pData.operatorName === PgslOperator.Divide || pData.operatorName === PgslOperator.Modulo) && lRightConstantValue === 0) {
                this.pushIncident('Division by zero.', pData.rightExpression);
                return;
            }
        }

        // Left and right side constants.
        if (typeof pData.leftExpression.data.constantValue === 'number' && typeof pData.rightExpression.data.constantValue === 'number') {
            // Validate that the lowest int value is not divided by -1, as the result does not fit into an int.
            if (pData.operatorName === PgslOperator.Divide || pData.operatorName === PgslOperator.Modulo) {
                // Result type must be a signed integer.
                if (pData.resolveType instanceof PgslNumericType && pData.resolveType.isKind(BasePgslTypeKind.SignedInteger)) {
                    // And must fit.
                    if (!pData.resolveType.constantFits(pData.leftExpression.data.resolveType, lLeftConstantValue / lRightConstantValue)) {
                        this.pushIncident(`Value ${lLeftConstantValue} can not be divided by ${lRightConstantValue}, as the result does not fit into '${pData.resolveType.meta.typeName}'.`);
                    }
                }
            }

            // Validate that the constant result of abstract ints and floats fits into its result type.
            const lResultType: BasePgslType = pData.resolveType;
            if (lResultType instanceof PgslNumericType && (lResultType.isKind(BasePgslTypeKind.Float) || lResultType.isKind(BasePgslTypeKind.Abstract))) {
                // Calculate the operation between the two constant values.
                const lConstantResult: number = (() => {
                    switch (pData.operatorName) {
                        case PgslOperator.Plus: return lLeftConstantValue + lRightConstantValue;
                        case PgslOperator.Minus: return lLeftConstantValue - lRightConstantValue;
                        case PgslOperator.Multiply: return lLeftConstantValue * lRightConstantValue;
                        case PgslOperator.Divide: return lResultType.isKind(BasePgslTypeKind.Integer) ? Math.trunc(lLeftConstantValue / lRightConstantValue) : lLeftConstantValue / lRightConstantValue;
                        case PgslOperator.Modulo: return lLeftConstantValue % lRightConstantValue;
                    }

                    // Fallback cant be calculated (invalid operation). 
                    return lLeftConstantValue;
                })();

                // And check if the calculated value fits into the result type.
                if (!lResultType.constantFits(lResultType, lConstantResult)) {
                    this.pushIncident(`Value ${lConstantResult} does not fit into '${lResultType.meta.typeName}'.`);
                }
            }
        }
    }
}
