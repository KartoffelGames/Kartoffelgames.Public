import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('LogicalExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Logical OR', async (pContext) => {
        await pContext.step('Boolean', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let boolOne: bool = true;
                    let boolTwo: bool = false;
                    let testVariable: bool = boolOne || boolTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var boolOne:bool=true;` +
                `var boolTwo:bool=false;` +
                `var testVariable:bool=boolOne||boolTwo;` +
                `}`
            );
        });
    });

    await pContext.step('Logical AND', async (pContext) => {
        await pContext.step('Boolean', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let boolOne: bool = true;
                    let boolTwo: bool = false;
                    let testVariable: bool = boolOne && boolTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var boolOne:bool=true;` +
                `var boolTwo:bool=false;` +
                `var testVariable:bool=boolOne&&boolTwo;` +
                `}`
            );
        });
    });
});
