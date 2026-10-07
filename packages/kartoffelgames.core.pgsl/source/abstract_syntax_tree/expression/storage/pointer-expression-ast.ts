import type { PointerExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import { PgslValueAddressSpace } from "../../../enum/pgsl-value-address-space.enum.ts";
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
     * Process data of current structure.
     * 
     * @param pContext - Build context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: PointerExpressionCst): PointerExpressionAstData {
        // Build expression.
        const lExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.expression).process(pContext);

        // Try to read the expressions pointer referenced type.
        const [lResolveType, lStorageAddressSpace] = ((): [BasePgslType, PgslValueAddressSpace] => {
            // Just skip type resolve when its not a pointer.
            if (!(lExpression.data.resolveType instanceof PgslPointerType)) {
                return [lExpression.data.resolveType, PgslValueAddressSpace.Inherit];
            }

            return [lExpression.data.resolveType.referencedType, lExpression.data.resolveType.assignedAddressSpace];
        })();

        return {
            // Expression data.
            expression: lExpression,

            // A pointer is always variable and therefore has no constant value.
            fixedState: PgslValueFixedState.Variable,
            constantValue: null,

            // Expression meta data.
            isStorage: true,
            resolveType: lResolveType,
            storageAddressSpace: lStorageAddressSpace
        };
    }
}

export type PointerExpressionAstData = {
    expression: IExpressionAst;
} & ExpressionAstData;