import { EnumUtil, Exception } from '@kartoffelgames/core';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslNumericType } from '../../type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../type/pgsl-vector-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { ArithmeticExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { PgslMatrixType } from '../../type/pgsl-matrix-type.ts';
import { PgslInvalidType } from '../../type/pgsl-invalid-type.ts';

export class ArithmeticExpressionAst extends AbstractSyntaxTree<ArithmeticExpressionCst, ArithmeticExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation trace.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): ArithmeticExpressionAstData {
        // Create list of all arithmetic operations.
        const lComparisonList: Array<PgslOperator> = [
            PgslOperator.Plus,
            PgslOperator.Minus,
            PgslOperator.Multiply,
            PgslOperator.Divide,
            PgslOperator.Modulo
        ];

        // Try to convert operator.
        let lOperator: PgslOperator | undefined = EnumUtil.cast(PgslOperator, this.cst.operator);
        if (!lComparisonList.includes(lOperator as PgslOperator)) {
            pContext.pushIncident(`Operator "${this.cst.operator}" can not used for arithmetic operations.`, this);

            lOperator = PgslOperator.Plus;
        }

        // Read left and right expression attachments.
        const lLeftExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.left, pContext);
        const lRightExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.right, pContext);

        // Determine result type based on left and right expression types.
        const lResultType: PgslType = (() => {
            // Get left and right type.
            const lLeftType: PgslType = lLeftExpression.data.resolveType;
            const lRightType: PgslType = lRightExpression.data.resolveType;

            // Define a more fast and abstract for type comparison.
            type ExpressionType = 'scalar' | 'vector' | 'matrix' | 'unknown';
            const findExpressionType = (pType: PgslType): ExpressionType => {
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
            const lLeftExpressionType: ExpressionType = findExpressionType(lLeftType);
            const lRightExpressionType: ExpressionType = findExpressionType(lRightType);

            // Start right process based on type matching.
            if (lLeftExpressionType === 'scalar' && lRightExpressionType === 'scalar') {
                return this.processScalarOperation(lLeftType as PgslNumericType, lRightType as PgslNumericType, pContext);
            }
            if ((lLeftExpressionType === 'scalar' && lRightExpressionType === 'vector') || (lLeftExpressionType === 'vector' && lRightExpressionType === 'scalar')) {
                return this.processScalarVectorOperation(lLeftType as PgslNumericType | PgslVectorType, lRightType as PgslNumericType | PgslVectorType, pContext);
            }
            if ((lLeftExpressionType === 'scalar' && lRightExpressionType === 'matrix') || (lLeftExpressionType === 'matrix' && lRightExpressionType === 'scalar')) {
                return this.processScalarMatrixOperation(lLeftType as PgslNumericType | PgslMatrixType, lRightType as PgslNumericType | PgslMatrixType, lOperator!, pContext);
            }
            if (lLeftExpressionType === 'vector' && lRightExpressionType === 'vector') {
                return this.processVectorOperation(lLeftType as PgslVectorType, lRightType as PgslVectorType, pContext);
            }
            if ((lLeftExpressionType === 'vector' && lRightExpressionType === 'matrix') || (lLeftExpressionType === 'matrix' && lRightExpressionType === 'vector')) {
                return this.processVectorMatrixOperation(lLeftType as PgslVectorType | PgslMatrixType, lRightType as PgslVectorType | PgslMatrixType, lOperator!, pContext);
            }
            if (lLeftExpressionType === 'matrix' && lRightExpressionType === 'matrix') {
                return this.processMatrixOperation(lLeftType as PgslMatrixType, lRightType as PgslMatrixType, lOperator!, pContext);
            }

            // Unhandled type combination.
            pContext.pushIncident(`Arithmetic operation not supported for used types.`, this);
            return new PgslInvalidType().process(pContext);
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
     * Process and determine result type of a pure scalar operation.
     * 
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pContext - Process context.
     * 
     * @returns the result type of the operation. 
     */
    private processScalarOperation(pLeftType: PgslNumericType, pRightType: PgslNumericType, pContext: AbstractSyntaxTreeContext): PgslType {
        // Left and right need to be same type or implicitly castable.
        if (!pRightType.isImplicitCastableInto(pLeftType) && !pLeftType.isImplicitCastableInto(pRightType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be the same type.', this);
        }

        // Validate left side type. Right ist the same type.
        if (!(pLeftType instanceof PgslNumericType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be a numeric value', this);
        }

        return pLeftType;
    }

    /**
     * Process and determine result type of a scalar-vector operation.
     * 
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pContext - Process context.
     * 
     * @returns the result type of the operation.
     */
    private processScalarVectorOperation(pLeftType: PgslNumericType | PgslVectorType, pRightType: PgslNumericType | PgslVectorType, pContext: AbstractSyntaxTreeContext): PgslType {
        // Get both inner types.
        const lScalarType: PgslNumericType = (pLeftType instanceof PgslNumericType) ? pLeftType : (pRightType as PgslNumericType);
        const lVectorType: PgslVectorType = (pLeftType instanceof PgslVectorType) ? pLeftType : (pRightType as PgslVectorType);

        // Left and right need to be same type or implicitly castable.
        if (!lScalarType.isImplicitCastableInto(lVectorType.innerType) && !lVectorType.innerType.isImplicitCastableInto(lScalarType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be the same type.', this);
        }

        return lVectorType;
    }

    /**
     * Process and determine result type of a pure vector operation.
     * 
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pContext - Process context.
     * 
     * @returns the result type of the operation.
     */
    private processVectorOperation(pLeftType: PgslVectorType, pRightType: PgslVectorType, pContext: AbstractSyntaxTreeContext): PgslType {
        // Left and right need to be same type or implicitly castable.
        if (!pRightType.isImplicitCastableInto(pLeftType) && !pLeftType.isImplicitCastableInto(pRightType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be the same type.', this);
        }

        // Validate left side type is numeric. Right ist the same type.
        const lInnerType: PgslType = pLeftType.innerType;
        if (!(lInnerType instanceof PgslNumericType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be a numeric vector value', this);
        }

        // Dimensions must match.
        if (pLeftType.dimension !== pRightType.dimension) {
            pContext.pushIncident('Left and right side of arithmetic expression must have the same dimension.', this);
        }

        return pLeftType;
    }

    /**
     * Process and determine result type of a vector-matrix operation.
     * 
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pOperator - Operator of the expression.
     * @param pContext - Process context.
     * 
     * @returns the result type of the operation. 
     */
    private processVectorMatrixOperation(pLeftType: PgslVectorType | PgslMatrixType, pRightType: PgslVectorType | PgslMatrixType, pOperator: PgslOperator, pContext: AbstractSyntaxTreeContext): PgslType {
        // Get left and right inner types.
        const lLeftInnerType: PgslType = pLeftType.innerType;
        const lRightInnerType: PgslType = pRightType.innerType;

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

            return new PgslVectorType(pLeftType.rowCount, lLeftInnerType as PgslNumericType).process(pContext);
        }

        // When its a vector x matrix operation, the matrix rows must match the vector dimension.
        if (pLeftType instanceof PgslVectorType && pRightType instanceof PgslMatrixType) {
            if (pRightType.rowCount !== pLeftType.dimension) {
                pContext.pushIncident('When multiplying a vector with a matrix, the matrix rows must match the vector dimension.', this);
            }

            return new PgslVectorType(pRightType.columnCount, lLeftInnerType as PgslNumericType).process(pContext);
        }

        // Not a valid combination.
        return new PgslInvalidType().process(pContext);
    }

    private processScalarMatrixOperation(pLeftType: PgslNumericType | PgslMatrixType, pRightType: PgslNumericType | PgslMatrixType, pOperator: PgslOperator, pContext: AbstractSyntaxTreeContext): PgslType {
        // Get both inner types.
        const lScalarType: PgslNumericType = (pLeftType instanceof PgslNumericType) ? pLeftType : (pRightType as PgslNumericType);
        const lMatrixType: PgslMatrixType = (pLeftType instanceof PgslMatrixType) ? pLeftType : (pRightType as PgslMatrixType);

        // Left and right need to be same type or implicitly castable.
        if (!lScalarType.isImplicitCastableInto(lMatrixType.innerType) && !lMatrixType.innerType.isImplicitCastableInto(lScalarType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be the same type.', this);
        }

        // Only multiplication is allowed.
        if (pOperator !== PgslOperator.Multiply) {
            pContext.pushIncident('Only multiplication operation is allowed between scalar and matrix types.', this);
        }

        return lMatrixType;
    }

    /**
     * Process and determine result type of a pure matrix operation.
     * 
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pOperator - Operator of the expression.
     * @param pContext - Process context.
     * 
     * @returns the result type of the operation. 
     */
    private processMatrixOperation(pLeftType: PgslMatrixType, pRightType: PgslMatrixType, pOperator: PgslOperator, pContext: AbstractSyntaxTreeContext): PgslType {
        // Get left and right inner types.
        const lLeftInnerType: PgslType = pLeftType.innerType;
        const lRightInnerType: PgslType = pRightType.innerType;

        // Validate left side type is numeric. Right ist the same type.
        if (!(lLeftInnerType instanceof PgslNumericType) || !(lRightInnerType instanceof PgslNumericType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be a numeric vector value', this);
        }

        // Left and right inner type must be implicit castable.
        if (!lRightInnerType.isImplicitCastableInto(lLeftInnerType) && !lLeftInnerType.isImplicitCastableInto(lRightInnerType)) {
            pContext.pushIncident('Left and right side of arithmetic expression must be the same type.', this);
        }

        // Only a multiplication, addition and subtraction operation is allowed.
        switch (pOperator) {
            case PgslOperator.Plus:
            case PgslOperator.Minus: {
                // Dimensions must match.
                if (pLeftType.rowCount !== pRightType.rowCount || pLeftType.columnCount !== pRightType.columnCount) {
                    pContext.pushIncident('Left and right side of arithmetic expression must have the same dimensions.', this);
                }

                return pLeftType;
            }
            case PgslOperator.Multiply: {
                // Dimentsion must match. The left columns must match the right rows.
                if (pLeftType.columnCount !== pRightType.rowCount) {
                    pContext.pushIncident('When multiplying a matrix with another matrix, the left matrix columns must match the right matrix rows.', this);
                }

                return new PgslMatrixType(pLeftType.rowCount, pRightType.columnCount, lLeftInnerType as PgslNumericType).process(pContext);
            }
        }

        // Not a valid combination.
        return new PgslInvalidType().process(pContext);
    }
}

export type ArithmeticExpressionAstData = {
    leftExpression: IExpressionAst;
    operator: PgslOperator;
    rightExpression: IExpressionAst;
} & ExpressionAstData;