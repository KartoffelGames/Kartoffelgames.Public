import type { ForStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { BaseStatementAst, StatementAstControlFlow, type StatementAstData } from '../base-statement-ast.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';
import { VariableDeclarationStatementAst } from '../execution/variable-declaration-statement-ast.ts';
import { StatementAstBuilder } from '../statement-ast-builder.ts';

/**
 * PGSL structure for a for statement.
 */
export class ForStatementAst extends BaseStatementAst<ForStatementCst, ForStatementAstData> {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext, pCst: ForStatementCst): ForStatementAstData {
        // Trace block in own loop scope and trace child trees.
        return pContext.pushScope('loop', () => {
            // Trace optional init declaration. Do it first to make variable available in expression and update traces.
            let lInit: VariableDeclarationStatementAst | null = null;
            if (pCst.init) {
                lInit = new VariableDeclarationStatementAst(pCst.init).process(pContext);

                // Variable must be a let
                if (lInit.data.declarationType !== PgslDeclarationType.Let) {
                    pContext.pushIncident('Initial of for loops must be a let declaration.', lInit);
                }
            }

            // Validate optional expression.
            let lExpression: IExpressionAst | null = null;
            if (pCst.expression) {
                lExpression = ExpressionAstBuilder.build(pCst.expression).process(pContext);

                // Expression must be a boolean.
                if (lExpression.data.resolveType.conversionRankTo(new PgslBooleanType()) === Number.POSITIVE_INFINITY) {
                    pContext.pushIncident('Expression of for loops must resolve into a boolean.', lExpression);
                }
            }

            // Validate optional update statement.
            let lUpdate: BaseStatementAst | null = null;
            if (pCst.update) {
                lUpdate = StatementAstBuilder.build(pCst.update).process(pContext);

                // Parse update statement type
                const lUpdateType = pCst.update.type;
                if (lUpdateType !== 'AssignmentStatement' && lUpdateType !== 'IncrementDecrementStatement' && lUpdateType !== 'FunctionCallStatement') {
                    pContext.pushIncident('For update statement must be either an assignment, increment or function statement.', lUpdate);
                }
            }

            // Trace block.
            const lBlock: BlockStatementAst = new BlockStatementAst(pCst.block).process(pContext);

            // Filter control flows of the loop block.
            const lControlFlows: Array<StatementAstControlFlow> = (() => {
                // Filter any control flow that only affects the loop itself like a break and continue.
                const lLoopControlFlow: Array<StatementAstControlFlow> = lBlock.data.controlFlow.filter((pControlFlow) => {
                    return pControlFlow !== StatementAstControlFlow.Break && pControlFlow !== StatementAstControlFlow.Continue && pControlFlow !== StatementAstControlFlow.Next;
                });

                // On "endless"-loops, the loop can only reaches the next statement if it has a break. 
                if (lExpression !== null || lBlock.data.controlFlow.includes(StatementAstControlFlow.Break)) {
                    lLoopControlFlow.push(StatementAstControlFlow.Next);
                }

                return lLoopControlFlow;
            })();

            return {
                init: lInit,
                expression: lExpression,
                update: lUpdate,
                block: lBlock,
                controlFlow: lControlFlows
            };
        }, this);
    }
}

export type ForStatementAstData = {
    init: VariableDeclarationStatementAst | null;
    expression: IExpressionAst | null;
    update: BaseStatementAst | null;
    block: BlockStatementAst;
} & StatementAstData;