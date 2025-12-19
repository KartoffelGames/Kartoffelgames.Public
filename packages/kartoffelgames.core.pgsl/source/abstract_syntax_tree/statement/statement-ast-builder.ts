import { AssignmentStatementCst, BlockStatementCst, BreakStatementCst, ContinueStatementCst, DiscardStatementCst, DoWhileStatementCst, ForStatementCst, FunctionCallStatementCst, IfStatementCst, IncrementDecrementStatementCst, StatementCst, SwitchStatementCst, VariableDeclarationStatementCst, WhileStatementCst } from "../../concrete_syntax_tree/statement.type.ts";
import { AbstractSyntaxTreeContext } from "../abstract-syntax-tree-context.ts";
import { BlockStatementAst } from "./execution/block-statement-ast.ts";
import { AssignmentStatementAst } from "./execution/pgsl-assignment-statement.ts";
import { FunctionCallStatementAst } from "./execution/pgsl-function-call-statement.ts";
import { IncrementDecrementStatementAst } from "./execution/pgsl-increment-decrement-statement.ts";
import { VariableDeclarationStatementAst } from "./execution/pgsl-variable-declaration-statement.ts";
import { BreakStatementAst } from "./single/pgsl-break-statement.ts";
import { ContinueStatementAst } from "./single/pgsl-continue-statement.ts";
import { DiscardStatementAst } from "./single/pgsl-discard-statement.ts";
import { DoWhileStatementAst } from "./branch/pgsl-do-while-statement.ts";
import { ForStatementAst } from "./branch/pgsl-for-statement.ts";
import { IfStatementAst } from "./branch/pgsl-if-statement.ts";
import { SwitchStatementAst } from "./branch/pgsl-switch-statement.ts";
import { WhileStatementAst } from "./branch/pgsl-while-statement.ts";
import { IStatementAst } from "./i-statement-ast.interface.ts";
import { Exception } from "@kartoffelgames/core";

export class StatementAstBuilder {
    /**
     * Build a statment AST node from a concrete syntax tree node.
     * 
     * @param pCst - Concreate sytax tree.
     * @param pContext - Abstract syntax tree build context.
     * 
     * @returns Statement AST node or null if the type is not recognized.
     */
    public static build(pCst: StatementCst, pContext: AbstractSyntaxTreeContext): IStatementAst {
        switch (pCst.type) {
            case 'BlockStatement':
                return new BlockStatementAst(pCst as BlockStatementCst).process(pContext);
            case 'AssignmentStatement':
                return new AssignmentStatementAst(pCst as AssignmentStatementCst).process(pContext);
            case 'FunctionCallStatement':
                return new FunctionCallStatementAst(pCst as FunctionCallStatementCst).process(pContext);
            case 'IncrementDecrementStatement':
                return new IncrementDecrementStatementAst(pCst as IncrementDecrementStatementCst).process(pContext);
            case 'VariableDeclarationStatement':
                return new VariableDeclarationStatementAst(pCst as VariableDeclarationStatementCst).process(pContext);
            case 'BreakStatement':
                return new BreakStatementAst(pCst as BreakStatementCst).process(pContext);
            case 'ContinueStatement':
                return new ContinueStatementAst(pCst as ContinueStatementCst).process(pContext);
            case 'DiscardStatement':
                return new DiscardStatementAst(pCst as DiscardStatementCst).process(pContext);
            case 'DoWhileStatement':
                return new DoWhileStatementAst(pCst as DoWhileStatementCst).process(pContext);
            case 'ForStatement':
                return new ForStatementAst(pCst as ForStatementCst).process(pContext);
            case 'IfStatement':
                return new IfStatementAst(pCst as IfStatementCst).process(pContext);
            case 'SwitchStatement':
                return new SwitchStatementAst(pCst as SwitchStatementCst).process(pContext);
            case 'WhileStatement':
                return new WhileStatementAst(pCst as WhileStatementCst).process(pContext);
        }

        throw new Exception(`Statement type '${pCst.type}' is not recognized in AST builder.`, StatementAstBuilder);
    }
}