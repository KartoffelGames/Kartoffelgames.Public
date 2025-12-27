import type { BreakStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import type { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure holding a break statement.
 */
export class BreakStatementAst extends AbstractSyntaxTree<BreakStatementCst, BreakStatementAstData> implements IStatementAst {
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

        return {};
    }
}

export type BreakStatementAstData = Record<string, never> & StatementAstData;