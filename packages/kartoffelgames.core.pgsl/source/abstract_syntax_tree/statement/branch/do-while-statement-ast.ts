import { DoWhileStatementCst } from "../../../concrete_syntax_tree/statement.type.ts";
import { PgslBooleanType } from '../../type/pgsl-boolean-type.ts';
import { AbstractSyntaxTreeContext } from "../../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from "../../expression/expression-ast-builder.ts";
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { BlockStatementAst } from '../execution/block-statement-ast.ts';
import { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure for a do while statement.
 */
export class DoWhileStatementAst extends AbstractSyntaxTree<DoWhileStatementCst, DoWhileStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation trace.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext): DoWhileStatementAstData {
        // Trace block in own loop scope.
        return pContext.pushScope('loop', () => {
            // Read attachments of expression.
            const lExpression: IExpressionAst = ExpressionAstBuilder.build(this.cst.expression, pContext);

            // Expression must be a boolean.
            if (!lExpression.data.resolveType.isImplicitCastableInto(new PgslBooleanType().process(pContext))) {
                pContext.pushIncident('Expression of do-while loops must resolve into a boolean.', lExpression);
            }

            // Create block statement.
            const lBlock: BlockStatementAst = new BlockStatementAst(this.cst.block).process(pContext);

            return {
                expression: lExpression,
                block: lBlock
            } satisfies DoWhileStatementAstData;
        }, this);
    }
}

export type DoWhileStatementAstData = {
    block: BlockStatementAst;
    expression: IExpressionAst;
} & StatementAstData;