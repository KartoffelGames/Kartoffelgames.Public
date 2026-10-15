import { EnumUtil } from '@kartoffelgames/core';
import type { ComparisonExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslOperator } from '../../../enum/pgsl-operator.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { PgslVectorType } from '../../type/definition/pgsl-vector-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

/**
 * PGSL structure for a comparison expression between two values.
 */
export class ComparisonExpressionAst extends AbstractSyntaxTree<ComparisonExpressionCst, ComparisonExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: ComparisonExpressionCst): ComparisonExpressionAstData {
        // Convert operator.
        const lOperator: PgslOperator = EnumUtil.cast<PgslOperator>(PgslOperator, pCst.operator, PgslOperator.None);

        // Read left and right expression attachments.
        const lLeftExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.left).process(pContext);
        const lRightExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.right).process(pContext);

        // Any value is converted into a boolean type.
        const lResolveType: BasePgslType = (() => {
            const lBooleanDefinition: PgslBooleanType = pContext.types.create(PgslBooleanType);

            // Wrap boolean into a vector when it is a vector expression.
            if (lLeftExpression.data.resolveType instanceof PgslVectorType) {
                return pContext.types.create(PgslVectorType, lLeftExpression.data.resolveType.dimension, lBooleanDefinition);
            }

            return lBooleanDefinition;
        })();

        return {
            // Expression data.
            leftExpression: lLeftExpression,
            operatorName: lOperator,
            rightExpression: lRightExpression,

            // Expression meta data.
            fixedState: Math.min(lLeftExpression.data.fixedState, lRightExpression.data.fixedState),
            isStorage: false,
            resolveType: lResolveType,
            constantValue: null,
            storageAddressSpace: PgslValueAddressSpace.Inherit
        };
    }
}

export type ComparisonExpressionAstData = {
    leftExpression: IExpressionAst;
    operatorName: PgslOperator;
    rightExpression: IExpressionAst;
} & ExpressionAstData;