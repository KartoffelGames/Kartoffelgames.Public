import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { BlockStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/block-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('BlockStatementAst - Parsing', async (pContext) => {
    await pContext.step('Empty block', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lBlockStatement: BlockStatementAst = lFunctionDeclaration.block.data.statementList[0] as BlockStatementAst;
        expect(lBlockStatement).toBeInstanceOf(BlockStatementAst);
    });

    await pContext.step('Block with single statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    let x: ${PgslNumericType.typeName.float32} = 5.0;
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lBlockStatement: BlockStatementAst = lFunctionDeclaration.block.data.statementList[0] as BlockStatementAst;
        expect(lBlockStatement).toBeInstanceOf(BlockStatementAst);
    });

    await pContext.step('Block with multiple statements', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    let x: ${PgslNumericType.typeName.float32} = 5.0;
                    let y: ${PgslNumericType.typeName.signedInteger} = 10;
                    x = 2.0;
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lBlockStatement: BlockStatementAst = lFunctionDeclaration.block.data.statementList[0] as BlockStatementAst;
        expect(lBlockStatement).toBeInstanceOf(BlockStatementAst);
    });

    await pContext.step('Nested blocks', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    {
                        let x: ${PgslNumericType.typeName.float32} = 5.0;
                    }
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lBlockStatement: BlockStatementAst = lFunctionDeclaration.block.data.statementList[0] as BlockStatementAst;
        expect(lBlockStatement).toBeInstanceOf(BlockStatementAst);
    });
});

Deno.test('BlockStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Empty block', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
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
            `{` +
            `}` +
            `}`
        );
    });

    await pContext.step('Block with single statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    let x: ${PgslNumericType.typeName.float32} = 5.0;
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
            `{` +
            `let x:f32=5.0;` +
            `}` +
            `}`
        );
    });

    await pContext.step('Block with multiple statements', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    let x: ${PgslNumericType.typeName.float32} = 5.0;
                    let y: ${PgslNumericType.typeName.signedInteger} = 10;
                    x = 2.0;
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
            `{` +
            `let x:f32=5.0;` +
            `let y:i32=10;` +
            `x=2.0;` +
            `}` +
            `}`
        );
    });

    await pContext.step('Nested blocks', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    {
                        let x: ${PgslNumericType.typeName.float32} = 5.0;
                    }
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
            `{` +
            `{` +
            `let x:f32=5.0;` +
            `}` +
            `}` +
            `}`
        );
    });
});

Deno.test('BlockStatementAst - Error', async (pContext) => {
    await pContext.step('Block with valid statements has no errors', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    let x: ${PgslNumericType.typeName.float32} = 5.0;
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors expected for valid block.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Error should mention variable not defined.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`TODO`)
        )).toBe(true);
    });

    await pContext.step('Variable defined in block not accessible outside', () => {
        // Setup.
        const lBlockVariableName: string = 'blockVariable';
        const lCodeText: string = `
            function testFunction(): void {
                {
                    let ${lBlockVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                }
                ${lBlockVariableName} = 10.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention variable not defined.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Variable "${lBlockVariableName}" not defined.`)
        )).toBe(true);
    });
});
