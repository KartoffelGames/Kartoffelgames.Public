import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ReturnStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Return with value', async (pContext) => {
        await pContext.step('Return numeric value', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.float32} {
                    return 5.0;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction()->f32{` +
                `return 5.0;` +
                `}`
            );
        });

        await pContext.step('Return variable', () => {
            // Setup.
            const lVariableName: string = 'resultValue';
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.signedInteger} {
                    let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 42;
                    return ${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction()->i32{` +
                `var ${lVariableName}:i32=42;` +
                `return ${lVariableName};` +
                `}`
            );
        });
    });

    await pContext.step('Return without value', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                return;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `return;` +
            `}`
        );
    });
});
