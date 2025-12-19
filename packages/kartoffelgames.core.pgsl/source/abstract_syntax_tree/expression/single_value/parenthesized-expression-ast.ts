import { Exception } from '@kartoffelgames/core';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { ParenthesizedExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';

/**
 * PGSL structure holding a expression surrounded with parentheses.
 */
export class ParenthesizedExpressionAst extends AbstractSyntaxTree<ParenthesizedExpressionCst, ParenthesizedExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): ParenthesizedExpressionAstData {
        // Read attachment of inner expression.
        const lExpression: IExpressionAst  = ExpressionAstBuilder.build(this.cst.expression, pContext);

        return {
            // Expression data.
            expression: lExpression,

            // Expression meta data.
            fixedState: lExpression.data.fixedState,
            isStorage: lExpression.data.isStorage,
            resolveType: lExpression.data.resolveType,
            constantValue: lExpression.data.constantValue,
            storageAddressSpace: lExpression.data.storageAddressSpace
        };
    }
}

export type ParenthesizedExpressionAstData = {
    expression: IExpressionAst;
} & ExpressionAstData;