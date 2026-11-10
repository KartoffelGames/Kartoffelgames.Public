import type { BreakStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { BaseStatementAst, StatementAstControlFlow, type StatementAstData } from '../base-statement-ast.ts';

/**
 * PGSL structure holding a break statement.
 */
export class BreakStatementAst extends BaseStatementAst<BreakStatementCst, BreakStatementAstData> {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext): BreakStatementAstData {
        // Only in Loops and switch.
        if (!pContext.hasScope('loop') && !pContext.hasScope('switch')) {
            pContext.pushIncident('Break statement can only be used within loops or switch statements.', this);
        }

        // Static behaviour.
        return {
            controlFlow: [StatementAstControlFlow.Break]
        };
    }
}

export type BreakStatementAstData = StatementAstData;