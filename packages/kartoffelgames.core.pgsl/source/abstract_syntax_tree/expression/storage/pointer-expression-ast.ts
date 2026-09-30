import type { PointerExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslPointerType } from '../../type/definition/pgsl-pointer-type.ts';
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
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: PointerExpressionCst): PointerExpressionAstData {
        // Build expression.
        const lExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.expression).process(pContext);

        const lResolveType: BasePgslType = (() => {
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