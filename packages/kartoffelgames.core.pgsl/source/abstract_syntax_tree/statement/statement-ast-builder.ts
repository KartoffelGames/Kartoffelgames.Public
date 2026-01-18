import { Exception } from '@kartoffelgames/core';
import type { AssignmentStatementCst, BlockStatementCst, BreakStatementCst, ContinueStatementCst, DiscardStatementCst, DoWhileStatementCst, ForStatementCst, FunctionCallStatementCst, IfStatementCst, IncrementDecrementStatementCst, ReturnStatementCst, StatementCst, SwitchStatementCst, VariableDeclarationStatementCst, WhileStatementCst } from '../../concrete_syntax_tree/statement.type.ts';
import { DoWhileStatementAst } from './branch/do-while-statement-ast.ts';
import { ForStatementAst } from './branch/for-statement-ast.ts';
import { IfStatementAst } from './branch/if-statement-ast.ts';
import { SwitchStatementAst } from './branch/switch-statement-ast.ts';
import { WhileStatementAst } from './branch/while-statement-ast.ts';
import { AssignmentStatementAst } from './execution/assignment-statement-ast.ts';
import { BlockStatementAst } from './execution/block-statement-ast.ts';
import { FunctionCallStatementAst } from './execution/function-call-statement-ast.ts';
import { IncrementDecrementStatementAst } from './execution/increment-decrement-statement-ast.ts';
import { VariableDeclarationStatementAst } from './execution/variable-declaration-statement-ast.ts';
import type { IStatementAst } from './i-statement-ast.interface.ts';
import { BreakStatementAst } from './single/break-statement-ast.ts';
import { ContinueStatementAst } from './single/continue-statement-ast.ts';
import { DiscardStatementAst } from './single/discard-statement-ast.ts';
import { ReturnStatementAst } from './single/return-statement-ast.ts';

export class StatementAstBuilder {
    /**
     * Build a statment AST node from a concrete syntax tree node.
     * 
     * @param pCst - Concreate sytax tree.
     * 
     * @returns Statement AST node or null if the type is not recognized.
     */
    public static build(pCst: StatementCst): IStatementAst {
        switch (pCst.type) {
            case 'BlockStatement':
                return new BlockStatementAst(pCst as BlockStatementCst);
            case 'AssignmentStatement':
                return new AssignmentStatementAst(pCst as AssignmentStatementCst);
            case 'FunctionCallStatement':
                return new FunctionCallStatementAst(pCst as FunctionCallStatementCst);
            case 'IncrementDecrementStatement':
                return new IncrementDecrementStatementAst(pCst as IncrementDecrementStatementCst);
            case 'VariableDeclarationStatement':
                return new VariableDeclarationStatementAst(pCst as VariableDeclarationStatementCst);
            case 'BreakStatement':
                return new BreakStatementAst(pCst as BreakStatementCst);
            case 'ContinueStatement':
                return new ContinueStatementAst(pCst as ContinueStatementCst);
            case 'DiscardStatement':
                return new DiscardStatementAst(pCst as DiscardStatementCst);
            case 'DoWhileStatement':
                return new DoWhileStatementAst(pCst as DoWhileStatementCst);
            case 'ForStatement':
                return new ForStatementAst(pCst as ForStatementCst);
            case 'IfStatement':
                return new IfStatementAst(pCst as IfStatementCst);
            case 'SwitchStatement':
                return new SwitchStatementAst(pCst as SwitchStatementCst);
            case 'WhileStatement':
                return new WhileStatementAst(pCst as WhileStatementCst);
            case 'ReturnStatement':
                return new ReturnStatementAst(pCst as ReturnStatementCst);
        }

        throw new Exception(`Statement type '${pCst.type}' is not recognized in AST builder.`, StatementAstBuilder);
    }
}