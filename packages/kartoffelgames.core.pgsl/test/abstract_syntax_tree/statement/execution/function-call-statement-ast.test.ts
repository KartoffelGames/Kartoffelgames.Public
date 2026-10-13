import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { FunctionCallExpressionAst } from '../../../../source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import { FunctionCallStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/function-call-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionCallStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple function call', () => {
        // Setup.
        const lCodeText: string = `
            function calledFunction(): void {}
            function testFunction(): void {
                calledFunction();
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lFunctionCallStatement: FunctionCallStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as FunctionCallStatementAst;
        expect(lFunctionCallStatement).toBeInstanceOf(FunctionCallStatementAst);
        expect(lFunctionCallStatement.data.functionExpression).toBeInstanceOf(FunctionCallExpressionAst);
    });

    await pContext.step('Function call with parameters', () => {
        // Setup.
        const lCodeText: string = `
            function calledFunction(pValue: ${PgslNumericType.typeName.float32}): void {
            }
            function testFunction(): void {
                calledFunction(5.0);
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lFunctionCallStatement: FunctionCallStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as FunctionCallStatementAst;
        expect(lFunctionCallStatement).toBeInstanceOf(FunctionCallStatementAst);
        expect(lFunctionCallStatement.data.functionExpression).toBeInstanceOf(FunctionCallExpressionAst);
    });
});
