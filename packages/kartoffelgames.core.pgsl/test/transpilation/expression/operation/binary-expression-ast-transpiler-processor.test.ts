import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('BinaryExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Bitwise Operations', async (pContext) => {
        await pContext.step('Binary OR', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} | ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}|${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Binary AND', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} & ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}&${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Binary XOR', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} ^ ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}^${lRightValue};` +
                `}`
            );
        });
    });

    await pContext.step('Shift Operations', async (pContext) => {
        await pContext.step('Shift left', () => {
            // Setup.
            const lVariableName: string = 'shiftVariable';
            const lShiftAmount: number = 2;
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 5;
                    let result: ${PgslNumericType.typeName.signedInteger} = ${lVariableName} << ${lShiftAmount};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var ${lVariableName}:i32=5;` +
                `var result:i32=${lVariableName}<<${lShiftAmount};` +
                `}`
            );
        });

        await pContext.step('Shift right', () => {
            // Setup.
            const lVariableName: string = 'shiftVariable';
            const lShiftAmount: number = 2;
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 20u;
                    let result: ${PgslNumericType.typeName.unsignedInteger} = ${lVariableName} >> ${lShiftAmount}u;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var ${lVariableName}:u32=20u;` +
                `var result:u32=${lVariableName}>>${lShiftAmount}u;` +
                `}`
            );
        });
    });

    await pContext.step('Vector Binary Operations', async (pContext) => {
        await pContext.step('Vector binary OR', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(5, 3, 7);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(2, 6, 4);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = vectorOne | vectorTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<i32>=vec3(5,3,7);` +
                `var vectorTwo:vec3<i32>=vec3(2,6,4);` +
                `var testVariable:vec3<i32>=vectorOne|vectorTwo;` +
                `}`
            );
        });

        await pContext.step('Vector binary AND', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(5, 3, 7);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(2, 6, 4);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = vectorOne & vectorTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<i32>=vec3(5,3,7);` +
                `var vectorTwo:vec3<i32>=vec3(2,6,4);` +
                `var testVariable:vec3<i32>=vectorOne&vectorTwo;` +
                `}`
            );
        });
    });
});
