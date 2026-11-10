import type { IfStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { BaseStatementAst, StatementAstControlFlow, type StatementAstData } from '../base-statement-ast.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class IfStatementAst extends BaseStatementAst<IfStatementCst, IfStatementAstData> {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext, pCst: IfStatementCst): IfStatementAstData {
        // Validate expression.
        const lExpression: IExpressionAst | null = ExpressionAstBuilder.build(pCst.expression).process(pContext);
        if (!lExpression) {
            throw new Error('Expression could not be build.');
        }

        // Validate block.
        const lBlock: BlockStatementAst = new BlockStatementAst(pCst.block).process(pContext);

        // Validate else block.
        let lElse: BlockStatementAst | IfStatementAst | null = null;
        if (pCst.else) {
            // Check if else is another if statement or a block
            if (pCst.else.type === 'IfStatement') {
                lElse = new IfStatementAst(pCst.else as any).process(pContext);
            } else {
                lElse = new BlockStatementAst(pCst.else as any).process(pContext);
            }
        }

        // Expression must be a boolean.
        if (lExpression.data.resolveType.conversionRankTo(new PgslBooleanType()) === Number.POSITIVE_INFINITY) {
            pContext.pushIncident('Expression of if must resolve into a boolean.', lExpression);
        }

        // Behaviors of both branches.
        const lControlFlows: Array<StatementAstControlFlow> = (() => {
            // Copy control flows of else.
            const lIfElseControlFlows: Set<StatementAstControlFlow> = new Set<StatementAstControlFlow>(lElse?.data.controlFlow);

            // When no else branch is defined, the "if" can potentially reach the next statement.
            if(!lElse) {
                lIfElseControlFlows.add(StatementAstControlFlow.Next);
            }

            // Merge if block control flows.
            for(const lIfControlFlow of lBlock.data.controlFlow){
                lIfElseControlFlows.add(lIfControlFlow);
            }

            return [...lIfElseControlFlows];
        })();

        return {
            expression: lExpression,
            block: lBlock,
            else: lElse,
            controlFlow: lControlFlows
        };
    }
}

export type IfStatementAstData = {
    expression: IExpressionAst;
    block: BlockStatementAst;
    else: BlockStatementAst | IfStatementAst | null;
} & StatementAstData;