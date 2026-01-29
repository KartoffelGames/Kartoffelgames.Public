import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { BreakStatementAst } from '../../../source/abstract_syntax_tree/statement/single/break-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import type { WhileStatementAst } from '../../../source/abstract_syntax_tree/statement/branch/while-statement-ast.ts';
import type { ForStatementAst } from '../../../source/abstract_syntax_tree/statement/branch/for-statement-ast.ts';
import type { DoWhileStatementAst } from '../../../source/abstract_syntax_tree/statement/branch/do-while-statement-ast.ts';
import type { SwitchStatementAst, SwitchStatementAstSwitchCase } from '../../../source/abstract_syntax_tree/statement/branch/switch-statement-ast.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('BreakStatementAst - Parsing', async (pContext) => {
    await pContext.step('Break in loop', async (pContext) => {
        await pContext.step('Break in while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    while (true) {
                        break;
                    }
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lWhileStatement: WhileStatementAst = lFunctionDeclaration.block.data.statementList[0] as WhileStatementAst;
            const lBreakStatement: BreakStatementAst = lWhileStatement.data.block.data.statementList[0] as BreakStatementAst;
            expect(lBreakStatement).toBeInstanceOf(BreakStatementAst);
        });

        await pContext.step('Break in for loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10; i++) {
                        break;
                    }
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lForStatement: ForStatementAst = lFunctionDeclaration.block.data.statementList[0] as ForStatementAst;
            const lBreakStatement: BreakStatementAst = lForStatement.data.block.data.statementList[0] as BreakStatementAst;
            expect(lBreakStatement).toBeInstanceOf(BreakStatementAst);
        });

        await pContext.step('Break in do-while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    do {
                        break;
                    } while (true);
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lDoWhileStatement: DoWhileStatementAst = lFunctionDeclaration.block.data.statementList[0] as DoWhileStatementAst;
            const lBreakStatement: BreakStatementAst = lDoWhileStatement.data.block.data.statementList[0] as BreakStatementAst;
            expect(lBreakStatement).toBeInstanceOf(BreakStatementAst);
        });
    });

    await pContext.step('Break in switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                        break;
                    }
                    default: {}
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.block.data.statementList[0] as SwitchStatementAst;
        const lCaseBlock: SwitchStatementAstSwitchCase = lSwitchStatement.data.cases[0];
        const lBreakStatement: BreakStatementAst = lCaseBlock.block.data.statementList[0] as BreakStatementAst;
        expect(lBreakStatement).toBeInstanceOf(BreakStatementAst);
    });
});

Deno.test('BreakStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Break in loop', async (pContext) => {
        await pContext.step('Break in while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    while (true) {
                        break;
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
                `loop{` +
                `if !(true){break;}` +
                `{break;}` +
                `}` +
                `}`
            );
        });

        await pContext.step('Break in for loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10; i++) {
                        break;
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
                `var i:i32=0;` +
                `loop{` +
                `if !(i<10){break;}` +
                `{break;}` +
                `continuing{i++;}` +
                `}` +
                `}`
            );
        });

        await pContext.step('Break in do-while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    do {
                        break;
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
                `{break;}` +
                `if !(true){break;}` +
                `}` +
                `}`
            );
        });
    });

    await pContext.step('Break in switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                        break;
                    }
                    default: {}
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
            `switch(5){` +
            `case 1:{` +
            `break;` +
            `}` +
            `default:{}` +
            `}` +
            `}`
        );
    });
});

Deno.test('BreakStatementAst - Error', async (pContext) => {
    await pContext.step('Break outside loop or switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                break;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention loop or switch requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Break statement can only be used within loops or switch statements.')
        )).toBe(true);
    });
});
