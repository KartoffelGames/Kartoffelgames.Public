import type { DiscardStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure holding a discard statement.
 */
export class DiscardStatementAst extends AbstractSyntaxTree<DiscardStatementCst, DiscardStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param _pContext - Validation context.
     */
    protected onProcess(_pContext: AbstractSyntaxTreeContext): DiscardStatementAstData {
        // Nothing really to validate.
        return {};
    }
}

export type DiscardStatementAstData = Record<string, never> & StatementAstData;