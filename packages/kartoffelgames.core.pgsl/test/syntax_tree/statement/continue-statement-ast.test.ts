import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { ContinueStatementAst } from '../../../source/abstract_syntax_tree/statement/single/continue-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ContinueStatementAst - Parsing', async (pContext) => {
    await pContext.step('Continue in loop', async (pContext) => {
        await pContext.step('Continue in while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    while (true) {
                        continue;
                    }
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lContinueStatement: ContinueStatementAst = lFunctionDeclaration.block.data.statementList[0] as ContinueStatementAst;
            expect(lContinueStatement).toBeInstanceOf(ContinueStatementAst);
        });

        await pContext.step('Continue in for loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10; i++) {
                        continue;
                    }
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lContinueStatement: ContinueStatementAst = lFunctionDeclaration.block.data.statementList[0] as ContinueStatementAst;
            expect(lContinueStatement).toBeInstanceOf(ContinueStatementAst);
        });

        await pContext.step('Continue in do-while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    do {
                        continue;
                    } while (true);
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lContinueStatement: ContinueStatementAst = lFunctionDeclaration.block.data.statementList[0] as ContinueStatementAst;
            expect(lContinueStatement).toBeInstanceOf(ContinueStatementAst);
        });
    });
});

Deno.test('ContinueStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Continue in loop', async (pContext) => {
        await pContext.step('Continue in while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    while (true) {
                        continue;
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
                `continuing;` +
                `}` +
                `}`
            );
        });

        await pContext.step('Continue in for loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10; i++) {
                        continue;
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
                `for(var i:i32=0;i<10;i++){` +
                `continuing;` +
                `}` +
                `}`
            );
        });

        await pContext.step('Continue in do-while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    do {
                        continue;
                    } while (true);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `loop{` +
                `continuing;` +
                `if(!true){break;}` +
                `}` +
                `}`
            );
        });
    });
});

Deno.test('ContinueStatementAst - Error', async (pContext) => {
    await pContext.step('Continue outside loop', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                continue;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention loop requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Continue statement can only be used within loops.')
        )).toBe(true);
    });

    await pContext.step('Continue in switch (not allowed)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                        continue;
                    }
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention loop requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Continue statement can only be used within loops.')
        )).toBe(true);
    });
});
