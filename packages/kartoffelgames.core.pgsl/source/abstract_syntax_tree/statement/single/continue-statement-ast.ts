import type { ContinueStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure holding a continue statement.
 */
export class ContinueStatementAst extends AbstractSyntaxTree<ContinueStatementCst, ContinueStatementAstData> implements IStatementAst {
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

        return {};
    }
}

export type ContinueStatementAstData = Record<string, never> & StatementAstData;