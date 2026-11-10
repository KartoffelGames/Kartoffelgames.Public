import type { BlockStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { BaseStatementAst, StatementAstControlFlow, type StatementAstData } from '../base-statement-ast.ts';
import { StatementAstBuilder } from '../statement-ast-builder.ts';

/**
 * PGSL structure holding a list of statements. Handles scoped values.
 */
export class BlockStatementAst extends BaseStatementAst<BlockStatementCst, BlockStatementAstData> {
    /**
     * Build tree of current structure.
     * 
     * @param pContext - Context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: BlockStatementCst): BlockStatementAstData {
        // Create new scope and validate all statements.
        return pContext.pushScope('inherit', () => {
            // Prepare data containers.
            const lStatementList: Array<BaseStatementAst> = new Array<BaseStatementAst>();

            // When the statement list is empty, the control flow just contains next.
            const lControlFlows: Set<StatementAstControlFlow> = new Set<StatementAstControlFlow>();
            lControlFlows.add(StatementAstControlFlow.Next);

            // Build all statements ASTs and find their control flows.
            for (const lStatement of pCst.statements) {
                // Build statement and push to statement list.
                const lStatementAst: BaseStatementAst = StatementAstBuilder.build(lStatement).process(pContext);
                lStatementList.push(lStatementAst);

                // A statement is only reached when the statements before it continue with the next statement. Its behaviors replace that next behavior.
                // A statement can only add its control flow when it even can be reached.
                if (lControlFlows.has(StatementAstControlFlow.Next)) {
                    lControlFlows.delete(StatementAstControlFlow.Next);

                    // Merge statements control flows.
                    for (const lStatementControlFlow of lStatementAst.data.controlFlow) {
                        lControlFlows.add(lStatementControlFlow);
                    }
                }
            }

            return {
                statementList: lStatementList,
                controlFlow: [...lControlFlows]
            } satisfies BlockStatementAstData;
        }, this);
    }
}

export type BlockStatementAstData = {
    statementList: ReadonlyArray<BaseStatementAst>;
} & StatementAstData;