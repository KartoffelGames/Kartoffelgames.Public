import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { WhileStatementAst } from '../../../source/abstract_syntax_tree/statement/branch/while-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('WhileStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple while loop', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                while (true) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lWhileStatement: WhileStatementAst = lFunctionDeclaration.block.data.statementList[0] as WhileStatementAst;
        expect(lWhileStatement).toBeInstanceOf(WhileStatementAst);
    });

    await pContext.step('While with variable condition', () => {
        // Setup.
        const lVariableName: string = 'count';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 0;
                while (${lVariableName} < 10) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lWhileStatement: WhileStatementAst = lFunctionDeclaration.block.data.statementList[1] as WhileStatementAst;
        expect(lWhileStatement).toBeInstanceOf(WhileStatementAst);
    });

    await pContext.step('While with complex condition', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                while (true && false) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lWhileStatement: WhileStatementAst = lFunctionDeclaration.block.data.statementList[0] as WhileStatementAst;
        expect(lWhileStatement).toBeInstanceOf(WhileStatementAst);
    });
});

Deno.test('WhileStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Simple while loop', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                while (true) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `while(true){` +
            `}` +
            `}`
        );
    });

    await pContext.step('While with variable condition', () => {
        // Setup.
        const lVariableName: string = 'count';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 0;
                while (${lVariableName} < 10) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var ${lVariableName}:i32=0;` +
            `while(${lVariableName}<10){` +
            `}` +
            `}`
        );
    });

    await pContext.step('While with complex condition', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                while (true && false) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `while(true&&false){` +
            `}` +
            `}`
        );
    });
});

Deno.test('WhileStatementAst - Error', async (pContext) => {
    await pContext.step('Non-boolean condition', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                while (5) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention boolean requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Expression of while loops must resolve into a boolean.')
        )).toBe(true);
    });
});
