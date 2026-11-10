import type { WhileStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { BaseStatementAst, StatementAstControlFlow, type StatementAstData } from '../base-statement-ast.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';

/**
 * PGSL structure for a while statement.
 */
export class WhileStatementAst extends BaseStatementAst<WhileStatementCst, WhileStatementAstData> {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext, pCst: WhileStatementCst): WhileStatementAstData {
        // Trace expression.
        const lExpression: IExpressionAst | null = ExpressionAstBuilder.build(pCst.expression).process(pContext);
        if (!lExpression) {
            throw new Error('Expression could not be build.');
        }

        // Trace block in own loop scope.
        return pContext.pushScope('loop', () => {
            // Create block statement.
            const lBlock: BlockStatementAst = new BlockStatementAst(pCst.block).process(pContext);

            // Expression must be a boolean.
            if (lExpression.data.resolveType.conversionRankTo(new PgslBooleanType()) === Number.POSITIVE_INFINITY) {
                pContext.pushIncident('Expression of while loops must resolve into a boolean.', lExpression);
            }

            // Filter control flows of the loop block.
            const lControlFlows: Array<StatementAstControlFlow> = (() => {
                // Filter any control flow that only affects the loop itself like a break and continue.
                const lLoopControlFlow: Array<StatementAstControlFlow> = lBlock.data.controlFlow.filter((pControlFlow) => {
                    return pControlFlow !== StatementAstControlFlow.Break && pControlFlow !== StatementAstControlFlow.Continue && pControlFlow !== StatementAstControlFlow.Next;
                });

                // The loop can allways exit before the block even run when the condition is false.
                lLoopControlFlow.push(StatementAstControlFlow.Next);

                return lLoopControlFlow;
            })();

            return {
                expression: lExpression,
                block: lBlock,
                controlFlow: lControlFlows
            } satisfies WhileStatementAstData;
        }, this);
    }
}

export type WhileStatementAstData = {
    block: BlockStatementAst;
    expression: IExpressionAst;
} & StatementAstData;