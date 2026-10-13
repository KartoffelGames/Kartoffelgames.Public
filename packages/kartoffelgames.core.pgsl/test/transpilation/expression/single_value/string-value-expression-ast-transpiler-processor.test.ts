import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('StringValueExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('String Literals', async (pContext) => {
        await pContext.step('Simple string', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    FirstValue = "TestString"
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. String and enum are not represented in WGSL.
            expect(lTranspilationResult.source).toBe('');
        });

        await pContext.step('Empty string', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    FirstValue = ""
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. String and enum are not represented in WGSL.
            expect(lTranspilationResult.source).toBe('');
        });
    });
});
