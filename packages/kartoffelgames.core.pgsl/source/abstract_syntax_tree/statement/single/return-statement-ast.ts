import type { ReturnStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { IType } from '../../type/i-type.interface.ts';
import { PgslVoidType } from '../../type/pgsl-void-type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import type { IStatementAst } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure holding a return statement with an optional expression.
 */
export class ReturnStatementAst extends AbstractSyntaxTree<ReturnStatementCst, ReturnStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): ReturnStatementAstData {
        // Build child expression.
        let lExpression: IExpressionAst | null = null;
        if (this.cst.expression) {
            lExpression = ExpressionAstBuilder.build(this.cst.expression, pContext);
        }

        return {
            returnType: lExpression?.data.resolveType ?? new PgslVoidType().process(pContext),
            expression: lExpression
        };
    }
}

export type ReturnStatementAstData = {
    returnType: IType;
    expression: IExpressionAst | null;
};