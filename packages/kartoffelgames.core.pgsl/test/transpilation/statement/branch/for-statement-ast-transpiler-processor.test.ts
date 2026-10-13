import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

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
