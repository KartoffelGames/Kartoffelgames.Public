import type { PointerExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { PgslPointerType } from '../../type/pgsl-pointer-type.ts';
import type { PgslType } from '../../type/pgsl-type.ts';
import { ExpressionAstBuilder } from '../expression-ast-builder.ts';
import type { ExpressionAstData, IExpressionAst } from '../i-expression-ast.interface.ts';

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

        const lResolveType: PgslType = (() => {
            // Value needs to be a pointer.
            if (!(lExpression.data.resolveType instanceof PgslPointerType)) {
                pContext.pushIncident('Pointer of expression needs to be a pointer type.', this);
                return lExpression.data.resolveType;
            }

            return lExpression.data.resolveType.referencedType;
        })();

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