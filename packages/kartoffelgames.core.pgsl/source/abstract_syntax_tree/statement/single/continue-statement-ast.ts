import type { ContinueStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { BaseStatementAst, StatementAstControlFlow, type StatementAstData } from '../base-statement-ast.ts';

/**
 * PGSL structure holding a continue statement.
 */
export class ContinueStatementAst extends BaseStatementAst<ContinueStatementCst, ContinueStatementAstData> {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext): ContinueStatementAstData {
        // Only in Loops
        if (!pContext.hasScope('loop')) {
            pContext.pushIncident('Continue statement can only be used within loops.', this);
        }

        // Static behaviour.
        return {
            controlFlow: [StatementAstControlFlow.Continue]
        };
    }
}

export type ContinueStatementAstData = StatementAstData;