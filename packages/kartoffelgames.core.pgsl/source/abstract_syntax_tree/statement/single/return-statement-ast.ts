import { ReturnStatementCst } from "../../../concrete_syntax_tree/statement.type.ts";
import type { PgslType } from '../../../type/pgsl-type.ts';
import { PgslVoidType } from '../../../type/pgsl-void-type.ts';
import { AbstractSyntaxTreeContext } from "../../abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from "../../abstract-syntax-tree.ts";
import { FunctionDeclarationAstDataDeclaration, FunctionDeclarationAst } from "../../declaration/pgsl-function-declaration.ts";
import { ExpressionAstBuilder } from "../../expression/expression-ast-builder.ts";
import { IExpressionAst } from "../../expression/i-expression-ast.interface.ts";
import { IStatementAst } from "../i-statement-ast.interface.ts";

/**
 * PGSL structure holding a return statement with an optional expression.
 */
export class ReturnStatementAst extends AbstractSyntaxTree<ReturnStatementCst, ReturnStatementAstData> implements IStatementAst {
    /**
     * Validate data of current structure.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): ReturnStatementAstData {
        // Build child expression.
        let lExpression: IExpressionAst | null = null;
        if (this.cst.expression) {
            lExpression = ExpressionAstBuilder.build(this.cst.expression, pContext);
        }

        const lFunctionAst: FunctionDeclarationAst | null = pContext.hasScope('function');

        // Check that this expression is inside a function declaration scope.
        (() => {
            if (!lFunctionAst) {
                pContext.pushIncident(`Return statement is not inside a function declaration.`, this);
                return;
            }

            // Skip validation if there are multiple return types.
            if (lFunctionAst.data.headers.length > 1) {
                return;
            }

            // Read the first function header return type, if it is null it is generic and can be anything.
            const lFunctionHeader: FunctionDeclarationAstDataDeclaration = lFunctionAst.data.headers[0];
            if (!lFunctionHeader.resultType) {
                return;
            }

            // Determine the return type of the return statement.
            const lReturnType: PgslType = lExpression?.data.resolveType ?? new PgslVoidType(pContext);

            // Validate that the return type matches the function declaration.
            if (!lReturnType.isImplicitCastableInto(lFunctionHeader.resultType?.data.type)) {
                pContext.pushIncident(`Return type does not match function declaration.`, this);
            }
        })();

        return {
            expression: lExpression
        };
    }
}

export type ReturnStatementAstData = {
    expression: IExpressionAst | null;
};