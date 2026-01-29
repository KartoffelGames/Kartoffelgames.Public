import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { ForStatementAst } from '../../../source/abstract_syntax_tree/statement/branch/for-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ForStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple for loop with all parts', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10; i++) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lForStatement: ForStatementAst = lFunctionDeclaration.block.data.statementList[0] as ForStatementAst;
        expect(lForStatement).toBeInstanceOf(ForStatementAst);
        expect(lForStatement.data.init).not.toBeNull();
        expect(lForStatement.data.expression).not.toBeNull();
        expect(lForStatement.data.update).not.toBeNull();
    });

    await pContext.step('For loop without init', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (; true;) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lForStatement: ForStatementAst = lFunctionDeclaration.block.data.statementList[0] as ForStatementAst;
        expect(lForStatement).toBeInstanceOf(ForStatementAst);
        expect(lForStatement.data.init).toBeNull();
        expect(lForStatement.data.expression).not.toBeNull();
        expect(lForStatement.data.update).toBeNull();
    });

    await pContext.step('For loop without expression', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0;;) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lForStatement: ForStatementAst = lFunctionDeclaration.block.data.statementList[0] as ForStatementAst;
        expect(lForStatement).toBeInstanceOf(ForStatementAst);
        expect(lForStatement.data.init).not.toBeNull();
        expect(lForStatement.data.expression).toBeNull();
        expect(lForStatement.data.update).toBeNull();
    });

    await pContext.step('For loop without update', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10;) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lForStatement: ForStatementAst = lFunctionDeclaration.block.data.statementList[0] as ForStatementAst;
        expect(lForStatement).toBeInstanceOf(ForStatementAst);
        expect(lForStatement.data.init).not.toBeNull();
        expect(lForStatement.data.expression).not.toBeNull();
        expect(lForStatement.data.update).toBeNull();
    });
});

Deno.test('ForStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Simple for loop with all parts', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10; i++) {
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
            `{}` +
            `continuing{i++;}` +
            `}` +
            `}`
        );
    });

    await pContext.step('For loop without init', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (; true;) {
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
            `{}` +
            `}` +
            `}`
        );
    });

    await pContext.step('For loop without expression', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0;;) {
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
            `{}` +
            `}` +
            `}`
        );
    });

    await pContext.step('For loop without update', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10;) {
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
            `{}` +
            `}` +
            `}`
        );
    });
});

Deno.test('ForStatementAst - Error', async (pContext) => {
    await pContext.step('Non-let init declaration', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (const i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10; i++) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention let requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Initial of for loops must be a let declaration.')
        )).toBe(true);
    });

    await pContext.step('Non-boolean condition', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i; i++) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention boolean requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Expression of for loops must resolve into a boolean.')
        )).toBe(true);
    });
});
