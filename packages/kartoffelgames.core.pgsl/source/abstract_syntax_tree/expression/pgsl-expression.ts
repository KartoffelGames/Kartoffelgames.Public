import { ExpressionCst } from "../../concrete_syntax_tree/expression.type.ts";
import { PgslValueAddressSpace } from "../../enum/pgsl-value-address-space.enum.ts";
import { PgslValueFixedState } from "../../enum/pgsl-value-fixed-state.ts";
import { PgslType } from "../../type/pgsl-type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

/**
 * PGSL base expression.
 */
export abstract class ExpressionAst<TCst extends ExpressionCst = ExpressionCst, TData extends ExpressionAstData = ExpressionAstData> extends AbstractSyntaxTree<TCst, TData> {
    public static build<TCst extends ExpressionCst>(pCst: TCst, pContext: AbstractSyntaxTreeContext): ExpressionAst<TCst, ExpressionAstData> | null {
        switch (pCst.type) {
            default:
                return null;
        }
    }

    /**
     * Constructor.
     * 
     * @param pCst - Concrete syntax tree node.
     * @param pContext - Syntax tree context.
     */
    public constructor(pCst: TCst, pContext: AbstractSyntaxTreeContext) {
        super(pCst, pContext);
    }
}

export type ExpressionAstData = {
    fixedState: PgslValueFixedState;
    isStorage: boolean;
    resolveType: PgslType;
    constantValue: number | string | null;
    storageAddressSpace: PgslValueAddressSpace;
};