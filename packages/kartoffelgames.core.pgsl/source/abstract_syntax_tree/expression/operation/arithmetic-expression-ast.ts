import { EnumUtil } from '@kartoffelgames/core';
import type { ArithmeticExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslInvalidType } from '../../type/definition/pgsl-invalid-type.ts';
import { PgslMatrixType } from '../../type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../type/definition/pgsl-vector-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

export class ArithmeticExpressionAst extends AbstractSyntaxTree<ArithmeticExpressionCst, ArithmeticExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation trace.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: ArithmeticExpressionCst): ArithmeticExpressionAstData {
        // Create list of all arithmetic operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Plus,
            PgslOperator.Minus,
            PgslOperator.Multiply,
            PgslOperator.Divide,
            PgslOperator.Modulo
        ];

        // Try to convert operator.
        let lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, pCst.operator);
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pContext.pushIncident(`Operator "${pCst.operator}" can not used for arithmetic operations.`, this);

            lOperator = PgslOperator.Plus;
        }

        // Read left and right expression attachments.
        const lLeftExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.left).process(pContext);
        const lRightExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.right).process(pContext);

        // Determine result type based on left and right expression types.
        const lResultType: BasePgslType = (() => {
            // Get left and right type.
            const lLeftType: BasePgslType = lLeftExpression.data.resolveType;
            const lRightType: BasePgslType = lRightExpression.data.resolveType;

            // Define a more fast and abstract for type comparison.
            type ExpressionType = 'scalar' | 'vector' | 'matrix' | 'unknown';
            const lFindExpressionType = (pType: BasePgslType): ExpressionType => {
                if (pType instanceof PgslNumericType) {
                    return 'scalar';
                }
                if (pType instanceof PgslVectorType) {
                    return 'vector';
                }
                if (pType instanceof PgslMatrixType) {
                    return 'matrix';
                }

                return 'unknown';
            };

            // Find fast expression type.
            const lLeftExpressionType: ExpressionType = lFindExpressionType(lLeftType);
            const lRightExpressionType: ExpressionType = lFindExpressionType(lRightType);

            // Vectors and matrices are compared by their component type.
            const lLeftInnerType: BasePgslType = (lLeftType instanceof PgslVectorType || lLeftType instanceof PgslMatrixType) ? lLeftType.innerType : lLeftType;
            const lRightInnerType: BasePgslType = (lRightType instanceof PgslVectorType || lRightType instanceof PgslMatrixType) ? lRightType.innerType : lRightType;

            // Find the correct inner type based on the highest conversation rank.
            const lInnerType: BasePgslType = (() => {
                // Left and right need to be same type or implicitly castable.
                const lLeftToRightRank: number = lLeftInnerType.conversionRankTo(lRightInnerType);
                const lRightToLeftRank: number = lRightInnerType.conversionRankTo(lLeftInnerType);
                if (lLeftToRightRank === Number.POSITIVE_INFINITY && lRightToLeftRank === Number.POSITIVE_INFINITY) {
                    pContext.pushIncident('Left and right side of arithmetic expression must be the same type.', this);
                }

                // If left type has a cheaper type conversion, convert it to the right type.
                if (lLeftToRightRank < lRightToLeftRank) {
                    return lRightInnerType;
                }

                return lLeftInnerType;
            })();

            // Start right process based on type matching.
            if (lLeftExpressionType === 'scalar' && lRightExpressionType === 'scalar') {
                return lInnerType;
            }
            if ((lLeftExpressionType === 'scalar' && lRightExpressionType === 'vector') || (lLeftExpressionType === 'vector' && lRightExpressionType === 'scalar')) {
                return this.processScalarVectorOperation(lLeftType as PgslNumericType | PgslVectorType, lRightType as PgslNumericType | PgslVectorType, lInnerType);
            }
            if ((lLeftExpressionType === 'scalar' && lRightExpressionType === 'matrix') || (lLeftExpressionType === 'matrix' && lRightExpressionType === 'scalar')) {
                return this.processScalarMatrixOperation(lLeftType as PgslNumericType | PgslMatrixType, lRightType as PgslNumericType | PgslMatrixType, lInnerType, lOperator!, pContext);
            }
            if (lLeftExpressionType === 'vector' && lRightExpressionType === 'vector') {
                return this.processVectorOperation(lLeftType as PgslVectorType, lRightType as PgslVectorType, lInnerType, pContext);
            }
            if ((lLeftExpressionType === 'vector' && lRightExpressionType === 'matrix') || (lLeftExpressionType === 'matrix' && lRightExpressionType === 'vector')) {
                return this.processVectorMatrixOperation(lLeftType as PgslVectorType | PgslMatrixType, lRightType as PgslVectorType | PgslMatrixType, lInnerType, lOperator!, pContext);
            }
            if (lLeftExpressionType === 'matrix' && lRightExpressionType === 'matrix') {
                return this.processMatrixOperation(lLeftType as PgslMatrixType, lRightType as PgslMatrixType, lInnerType, lOperator!, pContext);
            }

            // Unhandled type combination.
            pContext.pushIncident(`Arithmetic operation not supported for used types.`, this);
            return new PgslInvalidType();
        })();

        return {
            // Expression data.
            leftExpression: lLeftExpression,
            operator: lOperator!,
            rightExpression: lRightExpression,

            // Expression meta data.
            fixedState: Math.min(lLeftExpression.data.fixedState, lRightExpression.data.fixedState),
            isStorage: false,
            resolveType: lResultType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }

    /**
     * Process and determine result type of a pure matrix operation.
     *
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pInnerType - Matix item type of the result.
     * @param pOperator - Operator of the expression.
     * @param pContext - Process context.
     *
     * @returns the result type of the operation.
     */
    private processMatrixOperation(pLeftType: PgslMatrixType, pRightType: PgslMatrixType, pInnerType: BasePgslType, pOperator: PgslOperator, pContext: AbstractSyntaxTreeContext): BasePgslType {
        // Get left and right inner types.
        const lLeftInnerType: BasePgslType = pLeftType.innerType;
        const lRightInnerType: BasePgslType = pRightType.innerType;

        // Validate left side type is numeric. Right ist the same type.
        if (!(lLeftInnerType instanceof PgslNumericType) || !(lRightInnerType instanceof PgslNumericType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be a numeric vector value', this);
        }

        // Only a multiplication, addition and subtraction operation is allowed.
        switch (pOperator) {
            case PgslOperator.Plus:
            case PgslOperator.Minus: {
                // Dimensions must match.
                if (pLeftType.rowCount !== pRightType.rowCount || pLeftType.columnCount !== pRightType.columnCount) {
                    pContext.pushIncident('Left and right side of arithmetic expression must have the same dimensions.', this);
                }

                return new PgslMatrixType(pLeftType.columnCount, pLeftType.rowCount, pInnerType);
            }
            case PgslOperator.Multiply: {
                // Dimentsion must match. The left columns must match the right rows.
                if (pLeftType.columnCount !== pRightType.rowCount) {
                    pContext.pushIncident('When multiplying a matrix with another matrix, the left matrix columns must match the right matrix rows.', this);
                }

                // Result has the right columns and the left rows.
                return new PgslMatrixType(pRightType.columnCount, pLeftType.rowCount, pInnerType);
            }
        }

        // Not a valid combination.
        return new PgslInvalidType();
    }

    /**
     * Process and determine result type of a scalar-matrix operation.
     * 
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pInnerType - Matrix item type of the result.
     * @param pOperator - Operator of the expression.
     * @param pContext - Process context.
     *
     * @returns the result type of the operation.
     */
    private processScalarMatrixOperation(pLeftType: PgslNumericType | PgslMatrixType, pRightType: PgslNumericType | PgslMatrixType, pInnerType: BasePgslType, pOperator: PgslOperator, pContext: AbstractSyntaxTreeContext): BasePgslType {
        // Get the matrix side.
        const lMatrixType: PgslMatrixType = (pLeftType instanceof PgslMatrixType) ? pLeftType : (pRightType as PgslMatrixType);

        // Only multiplication is allowed.
        if (pOperator !== PgslOperator.Multiply) {
            pContext.pushIncident('Only multiplication operation is allowed between scalar and matrix types.', this);
        }

        return new PgslMatrixType(lMatrixType.columnCount, lMatrixType.rowCount, pInnerType);
    }

    /**
     * Process and determine result type of a scalar-vector operation.
     *
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pInnerType - Vector item type of the result.
     *
     * @returns the result type of the operation.
     */
    private processScalarVectorOperation(pLeftType: PgslNumericType | PgslVectorType, pRightType: PgslNumericType | PgslVectorType, pInnerType: BasePgslType): BasePgslType {
        // Get the vector type of operation.
        const lVectorType: PgslVectorType = (pLeftType instanceof PgslVectorType) ? pLeftType : (pRightType as PgslVectorType);

        return new PgslVectorType(lVectorType.dimension, pInnerType);
    }

    /**
     * Process and determine result type of a vector-matrix operation.
     *
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pInnerType - Vector item type of the result.
     * @param pOperator - Operator of the expression.
     * @param pContext - Process context.
     *
     * @returns the result type of the operation.
     */
    private processVectorMatrixOperation(pLeftType: PgslVectorType | PgslMatrixType, pRightType: PgslVectorType | PgslMatrixType, pInnerType: BasePgslType, pOperator: PgslOperator, pContext: AbstractSyntaxTreeContext): BasePgslType {
        // Get left and right inner types.
        const lLeftInnerType: BasePgslType = pLeftType.innerType;
        const lRightInnerType: BasePgslType = pRightType.innerType;

        // Validate left side type is numeric. Right ist the same type.
        if (!(lLeftInnerType instanceof PgslNumericType) || !(lRightInnerType instanceof PgslNumericType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be a numeric vector value', this);
        }

        // Only a multiplication operation is allowed.
        if (pOperator !== PgslOperator.Multiply) {
            pContext.pushIncident('Only multiplication operation is allowed between vector and matrix types.', this);
        }

        // When its a matrix x vector operation, the matrix columns must match the vector dimension.
        if (pLeftType instanceof PgslMatrixType && pRightType instanceof PgslVectorType) {
            if (pLeftType.columnCount !== pRightType.dimension) {
                pContext.pushIncident('When multiplying a matrix with a vector, the matrix columns must match the vector dimension.', this);
            }

            return new PgslVectorType(pLeftType.rowCount, pInnerType);
        }

        // When its a vector x matrix operation, the matrix rows must match the vector dimension.
        if (pLeftType instanceof PgslVectorType && pRightType instanceof PgslMatrixType) {
            if (pRightType.rowCount !== pLeftType.dimension) {
                pContext.pushIncident('When multiplying a vector with a matrix, the matrix rows must match the vector dimension.', this);
            }

            return new PgslVectorType(pRightType.columnCount, pInnerType);
        }

        // Not a valid combination.
        return new PgslInvalidType();
    }

    /**
     * Process and determine result type of a pure vector operation.
     * 
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pInnerType - Vector item type of the result.
     * @param pContext - Process context.
     *
     * @returns the result type of the operation.
     */
    private processVectorOperation(pLeftType: PgslVectorType, pRightType: PgslVectorType, pInnerType: BasePgslType, pContext: AbstractSyntaxTreeContext): BasePgslType {
        // Validate left side type is numeric. Right ist the same type.
        const lInnerType: BasePgslType = pLeftType.innerType;
        if (!(lInnerType instanceof PgslNumericType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be a numeric vector value', this);
        }

        // Dimensions must match.
        if (pLeftType.dimension !== pRightType.dimension) {
            pContext.pushIncident('Left and right side of arithmetic expression must have the same dimension.', this);
        }

        return new PgslVectorType(pLeftType.dimension, pInnerType);
    }
}

export type ArithmeticExpressionAstData = {
    leftExpression: IExpressionAst;
    operator: PgslOperator;
    rightExpression: IExpressionAst;
} & ExpressionAstData;