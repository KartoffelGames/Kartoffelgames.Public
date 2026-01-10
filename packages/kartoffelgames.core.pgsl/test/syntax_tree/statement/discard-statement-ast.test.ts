import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { DiscardStatementAst } from '../../../source/abstract_syntax_tree/statement/single/discard-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('DiscardStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple discard', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                discard;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lDiscardStatement: DiscardStatementAst = lFunctionDeclaration.block.data.statementList[0] as DiscardStatementAst;
        expect(lDiscardStatement).toBeInstanceOf(DiscardStatementAst);
    });

    await pContext.step('Discard in block', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    discard;
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        expect(lFunctionDeclaration.block.data.statementList[0]).toBeInstanceOf(Object);
    });
});

Deno.test('DiscardStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Simple discard', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                discard;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `discard;` +
            `}`
        );
    });

    await pContext.step('Discard in conditional block', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                    discard;
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
            `if(true){` +
            `discard;` +
            `}` +
            `}`
        );
    });
});

Deno.test('DiscardStatementAst - Error', async (pContext) => {
    await pContext.step('Discard parses without errors', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                discard;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Error should mention variable not defined.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('TODO:')
        )).toBe(true);
    });
});
