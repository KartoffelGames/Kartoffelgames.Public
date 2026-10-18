import { EnumUtil } from '@kartoffelgames/core';
import type { ArithmeticExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { type BasePgslType } from '../../type/definition/base-pgsl-type.ts';
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
        // Convert operator.
        const lOperator: PgslOperator = EnumUtil.cast<PgslOperator>(PgslOperator, pCst.operator, PgslOperator.None);

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
            const lLeftComponentType: BasePgslType = (lLeftType instanceof PgslVectorType || lLeftType instanceof PgslMatrixType) ? lLeftType.componentType : lLeftType;
            const lRightComponentType: BasePgslType = (lRightType instanceof PgslVectorType || lRightType instanceof PgslMatrixType) ? lRightType.componentType : lRightType;

            // Find the correct component type based on the highest conversation rank.
            const lComponentType: BasePgslType = (() => {
                // Rank the conversion in both directions.
                const lLeftToRightRank: number = lLeftComponentType.conversionRankTo(lRightComponentType);
                const lRightToLeftRank: number = lRightComponentType.conversionRankTo(lLeftComponentType);

                // If left type has a cheaper type conversion, convert it to the right type.
                if (lLeftToRightRank < lRightToLeftRank) {
                    return lRightComponentType;
                }

                return lLeftComponentType;
            })();

            // Start right process based on type matching.
            if (lLeftExpressionType === 'scalar' && lRightExpressionType === 'scalar') {
                return lComponentType;
            }
            if ((lLeftExpressionType === 'scalar' && lRightExpressionType === 'vector') || (lLeftExpressionType === 'vector' && lRightExpressionType === 'scalar')) {
                return this.processScalarVectorOperation(lLeftType as PgslNumericType | PgslVectorType, lRightType as PgslNumericType | PgslVectorType, lComponentType, pContext);
            }
            if ((lLeftExpressionType === 'scalar' && lRightExpressionType === 'matrix') || (lLeftExpressionType === 'matrix' && lRightExpressionType === 'scalar')) {
                return this.processScalarMatrixOperation(lLeftType as PgslNumericType | PgslMatrixType, lRightType as PgslNumericType | PgslMatrixType, lComponentType, pContext);
            }
            if (lLeftExpressionType === 'vector' && lRightExpressionType === 'vector') {
                return this.processVectorOperation(lLeftType as PgslVectorType, lComponentType, pContext);
            }
            if ((lLeftExpressionType === 'vector' && lRightExpressionType === 'matrix') || (lLeftExpressionType === 'matrix' && lRightExpressionType === 'vector')) {
                return this.processVectorMatrixOperation(lLeftType as PgslVectorType | PgslMatrixType, lRightType as PgslVectorType | PgslMatrixType, lComponentType, pContext);
            }
            if (lLeftExpressionType === 'matrix' && lRightExpressionType === 'matrix') {
                return this.processMatrixOperation(lLeftType as PgslMatrixType, lRightType as PgslMatrixType, lComponentType, lOperator, pContext);
            }

            // Expressions without a scalar, vector or matrix shape have no result shape.
            return pContext.types.create(PgslInvalidType);
        })();

        return {
            // Expression data.
            leftExpression: lLeftExpression,
            operatorName: lOperator,
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
     * @param pComponentType - Matix item type of the result.
     * @param pOperator - Operator of the expression.
     * @param pContext - Process context.
     *
     * @returns the result type of the operation.
     */
    private processMatrixOperation(pLeftType: PgslMatrixType, pRightType: PgslMatrixType, pComponentType: BasePgslType, pOperator: PgslOperator, pContext: AbstractSyntaxTreeContext): BasePgslType {
        // A multiplication result has the right columns and the left rows.
        if (pOperator === PgslOperator.Multiply) {
            return pContext.types.create(PgslMatrixType, pRightType.columnCount, pLeftType.rowCount, pComponentType);
        }

        // Any other operation is component wise and keeps the left dimensions.
        return pContext.types.create(PgslMatrixType, pLeftType.columnCount, pLeftType.rowCount, pComponentType);
    }

    /**
     * Process and determine result type of a scalar-matrix operation.
     * 
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pComponentType - Matrix item type of the result.
     * @param pContext - Process context.
     *
     * @returns the result type of the operation.
     */
    private processScalarMatrixOperation(pLeftType: PgslNumericType | PgslMatrixType, pRightType: PgslNumericType | PgslMatrixType, pComponentType: BasePgslType, pContext: AbstractSyntaxTreeContext): BasePgslType {
        // Get the matrix side.
        const lMatrixType: PgslMatrixType = (pLeftType instanceof PgslMatrixType) ? pLeftType : (pRightType as PgslMatrixType);

        return pContext.types.create(PgslMatrixType, lMatrixType.columnCount, lMatrixType.rowCount, pComponentType);
    }

    /**
     * Process and determine result type of a scalar-vector operation.
     *
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pComponentType - Vector item type of the result.
     * @param pContext - Process context.
     *
     * @returns the result type of the operation.
     */
    private processScalarVectorOperation(pLeftType: PgslNumericType | PgslVectorType, pRightType: PgslNumericType | PgslVectorType, pComponentType: BasePgslType, pContext: AbstractSyntaxTreeContext): BasePgslType {
        // Get the vector type of operation.
        const lVectorType: PgslVectorType = (pLeftType instanceof PgslVectorType) ? pLeftType : (pRightType as PgslVectorType);

        return pContext.types.create(PgslVectorType, lVectorType.dimension, pComponentType);
    }

    /**
     * Process and determine result type of a vector-matrix operation.
     *
     * @param pLeftType - Type of left side expression.
     * @param pRightType - Type of right side expression.
     * @param pComponentType - Vector item type of the result.
     * @param pContext - Process context.
     *
     * @returns the result type of the operation.
     */
    private processVectorMatrixOperation(pLeftType: PgslVectorType | PgslMatrixType, pRightType: PgslVectorType | PgslMatrixType, pComponentType: BasePgslType, pContext: AbstractSyntaxTreeContext): BasePgslType {
        // A matrix x vector operation results in a vector of the matrix rows.
        if (pLeftType instanceof PgslMatrixType) {
            return pContext.types.create(PgslVectorType, pLeftType.rowCount, pComponentType);
        }

        // A vector x matrix operation results in a vector of the matrix columns.
        return pContext.types.create(PgslVectorType, (pRightType as PgslMatrixType).columnCount, pComponentType);
    }

    /**
     * Process and determine result type of a pure vector operation.
     *
     * @param pLeftType - Type of left side expression.
     * @param pComponentType - Vector item type of the result.
     * @param pContext - Process context.
     *
     * @returns the result type of the operation.
     */
    private processVectorOperation(pLeftType: PgslVectorType, pComponentType: BasePgslType, pContext: AbstractSyntaxTreeContext): BasePgslType {
        // A component wise operation keeps the left dimension.
        return pContext.types.create(PgslVectorType, pLeftType.dimension, pComponentType);
    }
}

export type ArithmeticExpressionAstData = {
    leftExpression: IExpressionAst;
    operatorName: PgslOperator;
    rightExpression: IExpressionAst;
} & ExpressionAstData;