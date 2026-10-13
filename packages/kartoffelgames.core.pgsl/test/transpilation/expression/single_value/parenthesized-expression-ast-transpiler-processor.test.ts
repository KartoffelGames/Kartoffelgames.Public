import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ParenthesizedExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Simple Expressions', async (pContext) => {
        await pContext.step('Single value', () => {
            // Setup.
            const lValueOne: number = 42.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = (${lValueOne});
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=(${lValueOne});` +
                `}`
            );
        });

        await pContext.step('Arithmetic expression', () => {
            // Setup.
            const lValueOne: number = 5.0;
            const lValueTwo: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = (${lValueOne} + ${lValueTwo});
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=(${lValueOne}+${lValueTwo});` +
                `}`
            );
        });

        await pContext.step('Comparison expression', () => {
            // Setup.
            const lValueOne: number = 5.0;
            const lValueTwo: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: bool = (${lValueOne} > ${lValueTwo});
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:bool=(${lValueOne}>${lValueTwo});` +
                `}`
            );
        });
    });

    await pContext.step('Nested Parentheses', () => {
        // Setup.
        const lValueOne: number = 5.0;
        const lValueTwo: number = 3.0;
        const lValueThree: number = 2.0;
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = ((${lValueOne} + ${lValueTwo}) * ${lValueThree});
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var testVariable:f32=((${lValueOne}+${lValueTwo})*${lValueThree});` +
            `}`
        );
    });
});
