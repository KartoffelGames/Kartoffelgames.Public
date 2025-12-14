import { ExpressionCst } from "../../concrete_syntax_tree/expression.type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { IExpressionAst } from "./i-expression-ast.interface.ts";

export class ExpressionAstBuilder {
    /**
     * Build a expression AST node from a concrete syntax tree node.
     * 
     * @param pCst - Concreate sytax tree.
     * @param pContext - Abstract syntax tree build context.
     * 
     * @returns Expression AST node or null if the type is not recognized.
     */
    public static build(pCst: ExpressionCst, _pContext: AbstractSyntaxTreeContext): IExpressionAst | null {
        switch (pCst.type) {
            default:
                return null;
        }
    }
}