import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { FunctionCallStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/function-call-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { FunctionCallExpressionAst } from "../../../source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionCallStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple function call', () => {
        // Setup.
        const lFunctionName: string = 'testFunction';
        const lCalleeName: string = 'myFunction';
        const lCodeText: string = `
            function ${lCalleeName}(): void {}
            function ${lFunctionName}(): void {
                ${lCalleeName}();
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lFunctionCallStatement: FunctionCallStatementAst = lFunctionDeclaration.block.data.statementList[0] as FunctionCallStatementAst;
        expect(lFunctionCallStatement).toBeInstanceOf(FunctionCallStatementAst);
        expect(lFunctionCallStatement.data.functionExpression).toBeInstanceOf(FunctionCallExpressionAst);
    });

    await pContext.step('Function call with parameters', () => {
        // Setup.
        const lFunctionName: string = 'testFunction';
        const lCalleeName: string = 'myFunction';
        const lCodeText: string = `
            function ${lCalleeName}(pValue: ${PgslNumericType.typeName.float32}): void {
            }
            function ${lFunctionName}(): void {
                ${lCalleeName}(5.0);
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lFunctionCallStatement: FunctionCallStatementAst = lFunctionDeclaration.block.data.statementList[0] as FunctionCallStatementAst;
        expect(lFunctionCallStatement).toBeInstanceOf(FunctionCallStatementAst);
        expect(lFunctionCallStatement.data.functionExpression).toBeInstanceOf(FunctionCallExpressionAst);
    });
});

Deno.test('FunctionCallStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Simple function call', () => {
        // Setup.
        const lFunctionName: string = 'testFunction';
        const lCalleeName: string = 'myFunction';
        const lCodeText: string = `
            function ${lCalleeName}(): void {
            }
            function ${lFunctionName}(): void {
                ${lCalleeName}();
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn ${lCalleeName}(){` +
            `}` +
            `fn ${lFunctionName}(){` +
            `${lCalleeName}();` +
            `}`
        );
    });

    await pContext.step('Function call with parameters', () => {
        // Setup.
        const lFunctionName: string = 'testFunction';
        const lCalleeName: string = 'myFunction';
        const lCodeText: string = `
            function ${lCalleeName}(pValue: ${PgslNumericType.typeName.float32}): void {
            }
            function ${lFunctionName}(): void {
                ${lCalleeName}(5.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn ${lCalleeName}(pValue:f32){` +
            `}` +
            `fn ${lFunctionName}(){` +
            `${lCalleeName}(5.0);` +
            `}`
        );
    });
});

Deno.test('FunctionCallStatementAst - Error', async (pContext) => {
    await pContext.step('Undefined function call', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                undefinedFunction();
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Error should mention variable not defined.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Function 'undefinedFunction' is not defined.`)
        )).toBe(true);
    });

    await pContext.step('Function call with wrong parameter types', () => {
        // Setup.
        const lCalleeName: string = 'myFunction';
        const lCodeText: string = `
            function ${lCalleeName}(pValue: ${PgslNumericType.typeName.float32}): void {
            }
            function testFunction(): void {
                ${lCalleeName}(true);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Error should mention variable not defined.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`No matching function header found for function '${lCalleeName}'.`)
        )).toBe(true);
    });
});
