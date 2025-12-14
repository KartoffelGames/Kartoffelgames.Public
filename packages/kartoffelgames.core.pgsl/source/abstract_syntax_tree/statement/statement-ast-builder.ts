import { BlockStatementCst, StatementCst } from "../../concrete_syntax_tree/statement.type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { BlockStatementAst } from "./execution/block-statement-ast.ts";
import { IStatementAst } from "./i-statement-ast.interface.ts";

export class StatementAstBuilder {
    /**
     * Build a statment AST node from a concrete syntax tree node.
     * 
     * @param pCst - Concreate sytax tree.
     * @param pContext - Abstract syntax tree build context.
     * 
     * @returns Statement AST node or null if the type is not recognized.
     */
    public static build(pCst: StatementCst, pContext: AbstractSyntaxTreeContext): IStatementAst | null {
        switch (pCst.type) {
            case 'BlockStatement':
                return new BlockStatementAst(pCst as BlockStatementCst, pContext);
            default:
                return null;
        }
    }
}