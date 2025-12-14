import type { WhileStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { PgslBooleanType } from '../../../type/pgsl-boolean-type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';
import { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure for a while statement.
 */
export class WhileStatementAst extends AbstractSyntaxTree<WhileStatementCst, WhileStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected process(pContext: AbstractSyntaxTreeContext): WhileStatementAstData {
        // Trace expression.
        const lExpression: IExpressionAst | null = ExpressionAstBuilder.build(this.cst.expression, pContext);
        if (!lExpression) {
            throw new Error('Expression could not be build.');
        }

        // Trace block in own loop scope.
        return pContext.pushScope('loop', () => {
            // Create block statement.
            const lBlock: BlockStatementAst = new BlockStatementAst(this.cst.block, pContext);

            // Expression must be a boolean.
            if (!lExpression.data.returnType.isImplicitCastableInto(new PgslBooleanType(pContext))) {
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