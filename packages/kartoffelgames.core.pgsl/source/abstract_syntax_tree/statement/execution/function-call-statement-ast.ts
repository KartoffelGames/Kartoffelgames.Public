import type { FunctionCallExpressionCst } from '../../../concrete_syntax_tree/expression.type.ts';
import type { FunctionCallStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import type { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL syntax tree of a function call statement with optional template list.
 */
export class FunctionCallStatementAst extends AbstractSyntaxTree<FunctionCallStatementCst, FunctionCallStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext, pCst: FunctionCallStatementCst): FunctionCallStatementAstData {
        // Build a function call expression cst.
        const lFunctionCallCst: FunctionCallExpressionCst = {
            type: 'FunctionCallExpression',
            functionName: pCst.functionName,
            parameterList: pCst.parameterList,
            genericList: pCst.genericList,
            range: pCst.range
        };

        // Build function call expression.
        const lFunctionExpression: IExpressionAst = ExpressionAstBuilder.build(lFunctionCallCst).process(pContext);

        return {
            // Statement data.
            functionExpression: lFunctionExpression
        };
    }
}

export type FunctionCallStatementAstData = {
    functionExpression: IExpressionAst;
} & StatementAstData;