import type { DiscardStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { BaseStatementAst, StatementAstControlFlow, type StatementAstData } from '../base-statement-ast.ts';

/**
 * PGSL structure holding a discard statement.
 */
export class DiscardStatementAst extends BaseStatementAst<DiscardStatementCst, DiscardStatementAstData> {
    /**
     * Validate data of current structure.
     * 
     * @param _pContext - Validation context.
     */
    protected onProcess(_pContext: AbstractSyntaxTreeContext): DiscardStatementAstData {
        // Static behaviour.
        return {
            controlFlow: [StatementAstControlFlow.Next]
        };
    }
}

export type DiscardStatementAstData = StatementAstData;