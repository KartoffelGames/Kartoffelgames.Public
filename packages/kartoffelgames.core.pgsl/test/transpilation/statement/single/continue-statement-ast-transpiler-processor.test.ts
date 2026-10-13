import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

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
                `loop{` +
                `if !(true){break;}` +
                `{continue;}` +
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
                `var i:i32=0;` +
                `loop{` +
                `if !(i<10){break;}` +
                `{continue;}` +
                `continuing{i++;}` +
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
                `{continue;}` +
                `if !(true){break;}` +
                `}` +
                `}`
            );
        });
    });
});
