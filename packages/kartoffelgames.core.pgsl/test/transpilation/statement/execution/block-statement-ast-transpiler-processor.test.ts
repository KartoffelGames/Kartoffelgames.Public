import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

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
            `var x:f32=5.0;` +
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
            `var x:f32=5.0;` +
            `var y:i32=10;` +
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
            `var x:f32=5.0;` +
            `}` +
            `}` +
            `}`
        );
    });
});
