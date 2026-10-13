import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

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
