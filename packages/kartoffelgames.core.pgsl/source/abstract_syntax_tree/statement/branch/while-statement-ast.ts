import type { WhileStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslBooleanType } from '../../type/definition/pgsl-boolean-type.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';
import type { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure for a while statement.
 */
export class WhileStatementAst extends AbstractSyntaxTree<WhileStatementCst, WhileStatementAstData> implements IStatementAst {
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

            return {
                expression: lExpression,
                block: lBlock
            } satisfies WhileStatementAstData;
        }, this);
    }
}

export type WhileStatementAstData = {
    block: BlockStatementAst;
    expression: IExpressionAst;
} & StatementAstData;