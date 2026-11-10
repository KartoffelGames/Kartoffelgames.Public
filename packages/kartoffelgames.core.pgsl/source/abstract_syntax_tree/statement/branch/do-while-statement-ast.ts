import type { DoWhileStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { BaseStatementAst, StatementAstControlFlow, type StatementAstData } from '../base-statement-ast.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';

/**
 * PGSL structure for a do while statement.
 */
export class DoWhileStatementAst extends BaseStatementAst<DoWhileStatementCst, DoWhileStatementAstData> {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation trace.
     * @param pCst - Cst data.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext, pCst: DoWhileStatementCst): DoWhileStatementAstData {
        // Trace block in own loop scope.
        return pContext.pushScope('loop', () => {
            // Read attachments of expression.
            const lExpression: IExpressionAst = ExpressionAstBuilder.build(pCst.expression).process(pContext);

            // Expression must be a boolean.
            if (lExpression.data.resolveType.conversionRankTo(new PgslBooleanType()) === Number.POSITIVE_INFINITY) {
                pContext.pushIncident('Expression of do-while loops must resolve into a boolean.', lExpression);
            }

            // Create block statement.
            const lBlock: BlockStatementAst = new BlockStatementAst(pCst.block).process(pContext);

            // Filter control flows of the loop block.
            const lControlFlows: Array<StatementAstControlFlow> = (() => {
                // Filter any control flow that only affects the loop itself like a break and continue.
                const lLoopControlFlow: Array<StatementAstControlFlow> = lBlock.data.controlFlow.filter((pControlFlow) => {
                    return pControlFlow !== StatementAstControlFlow.Break && pControlFlow !== StatementAstControlFlow.Continue && pControlFlow !== StatementAstControlFlow.Next;
                });

                // The block can be endless, as the condition is executed AFTER it runs.
                // So we need to check if the block if it can even reach the condition once.
                if (lBlock.data.controlFlow.includes(StatementAstControlFlow.Next) || lBlock.data.controlFlow.includes(StatementAstControlFlow.Break)) {
                    lLoopControlFlow.push(StatementAstControlFlow.Next);
                }

                return lLoopControlFlow;
            })();

            return {
                expression: lExpression,
                block: lBlock,
                controlFlow: lControlFlows
            } satisfies DoWhileStatementAstData;
        }, this);
    }
}

export type DoWhileStatementAstData = {
    block: BlockStatementAst;
    expression: IExpressionAst;
} & StatementAstData;