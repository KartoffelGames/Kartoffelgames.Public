import { Exception } from '@kartoffelgames/core';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import { PgslPointerType } from '../../../type/pgsl-pointer-type.ts';
import type { PgslType } from '../../../type/pgsl-type.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';
import type { PointerExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';

/**
 * PGSL structure holding a pointer to a value (*pointer).
 */
export class PointerExpressionAst extends AbstractSyntaxTree<PointerExpressionCst, PointerExpressionAstData> implements IExpressionAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): PointerExpressionAstData {
        // Build expression.
        const lExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.expression, pContext);

        // Value needs to be a pointer.
        if (!(lExpression.data.resolveType instanceof PgslPointerType)) {
            throw new Exception('Pointer of expression needs to be a pointer type.', this);
        }

        const lResolveType: PgslType = lExpression.data.resolveType.referencedType;

        return {
            // Expression data.
            expression: lExpression,

            // Expression meta data.
            fixedState: PgslValueFixedState.Variable,
            isStorage: true,
            resolveType: lResolveType,
            constantValue: lExpression.data.constantValue,
            storageAddressSpace: lExpression.data.storageAddressSpace
        };
    }
}

export type PointerExpressionAstData = {
    expression: IExpressionAst;
} & ExpressionAstData;