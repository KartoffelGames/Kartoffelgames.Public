import type { ReturnStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import type { BasePgslType } from '../../type/definition/base-pgsl-type.ts';
import { PgslVoidType } from '../../type/definition/pgsl-void-type.ts';
import { BaseStatementAst, StatementAstControlFlow, type StatementAstData } from '../base-statement-ast.ts';

/**
 * PGSL structure holding a return statement with an optional expression.
 */
export class ReturnStatementAst extends BaseStatementAst<ReturnStatementCst, ReturnStatementAstData> {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: ReturnStatementCst): ReturnStatementAstData {
        // Build child expression.
        let lExpression: IExpressionAst | null = null;
        if (pCst.expression) {
            lExpression = ExpressionAstBuilder.build(pCst.expression).process(pContext);
        }

        return {
            returnType: lExpression?.data.resolveType ?? new PgslVoidType(),
            expression: lExpression,

            // Static behaviour.
            controlFlow: [StatementAstControlFlow.Return]
        };
    }
}

export type ReturnStatementAstData = {
    returnType: BasePgslType;
    expression: IExpressionAst | null;
} & StatementAstData;