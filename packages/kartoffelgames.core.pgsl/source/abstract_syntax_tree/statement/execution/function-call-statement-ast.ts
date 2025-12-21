import { FunctionCallExpressionCst } from "../../../concrete_syntax_tree/expression.type.ts";
import type { FunctionCallStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL syntax tree of a function call statement with optional template list.
 */
export class FunctionCallStatementAst extends AbstractSyntaxTree<FunctionCallStatementCst, FunctionCallStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext): FunctionCallStatementAstData {
        // Build a function call expression cst.
        const lFunctionCallCst: FunctionCallExpressionCst = {
            type: 'FunctionCallExpression',
            functionName: this.cst.functionName,
            parameterList: this.cst.parameterList,
            genericList: this.cst.genericList,
            range: this.cst.range
        }

        // Build function call expression.
        const lFunctionExpression: IExpressionAst = ExpressionAstBuilder.build(lFunctionCallCst, pContext);

        return {
            // Statement data.
            functionExpression: lFunctionExpression
        };
    }
}

export type FunctionCallStatementAstData = {
    functionExpression: IExpressionAst;
} & StatementAstData;