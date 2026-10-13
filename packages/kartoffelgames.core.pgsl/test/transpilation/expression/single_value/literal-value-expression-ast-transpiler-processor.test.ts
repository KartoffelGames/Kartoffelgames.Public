import { expect } from '@kartoffelgames/core-test';
import { PgslBooleanType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('LiteralValueExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Boolean', async (pContext) => {
        await pContext.step('True', () => {
            // Setup.
            const lLiteralValue: string = 'true';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:bool=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('False', () => {
            // Setup.
            const lLiteralValue: string = 'false';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:bool=${lLiteralValue};` +
                `}`
            );
        });
    });

    await pContext.step('Integer', async (pContext) => {
        await pContext.step('Decimal', () => {
            // Setup.
            const lLiteralValue: string = '42';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Decimal with i suffix', () => {
            // Setup.
            const lLiteralValue: string = '42i';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Decimal with u suffix', () => {
            // Setup.
            const lLiteralValue: string = '42u';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:u32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal', () => {
            // Setup.
            const lLiteralValue: string = '0x2A';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal with i suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x2Ai';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal with u suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x2Au';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:u32=${lLiteralValue};` +
                `}`
            );
        });
    });

    await pContext.step('Float', async (pContext) => {
        await pContext.step('Decimal', () => {
            // Setup.
            const lLiteralValue: string = '3.14';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Decimal with f suffix', () => {
            // Setup.
            const lLiteralValue: string = '3.14f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Decimal with h suffix', () => {
            // Setup.
            const lLiteralValue: string = '3.14h';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `enable f16;` +
                `fn testFunction(){` +
                `var testVariable:f16=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Scientific notation', () => {
            // Setup.
            const lLiteralValue: string = '1.5e10';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Scientific notation with f suffix', () => {
            // Setup.
            const lLiteralValue: string = '1.5e10f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Scientific notation with h suffix', () => {
            // Setup.
            const lLiteralValue: string = '1.5e10h';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `enable f16;` +
                `fn testFunction(){` +
                `var testVariable:f16=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal', () => {
            // Setup.
            const lLiteralValue: string = '0x1.8p3';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal float with f suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x1.8p3f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal float with h suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x1.8p3h';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `enable f16;` +
                `fn testFunction(){` +
                `var testVariable:f16=${lLiteralValue};` +
                `}`
            );
        });
    });
});
