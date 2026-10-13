import { expect } from '@kartoffelgames/core-test';
import { PgslMatrixType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ArithmeticExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Addition', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 5.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} + ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}+${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} + ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}+${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne + vectorTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                `var testVariable:vec3<f32>=vectorOne+vectorTwo;` +
                `}`
            );
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 5.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne + scalarValue;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var scalarValue:f32=5.0;` +
                `var testVariable:vec3<f32>=vectorOne+scalarValue;` +
                `}`
            );
        });
    });

    await pContext.step('Subtraction', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 5.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} - ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}-${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} - ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}-${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne - vectorTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(4.0,5.0,6.0);` +
                `var vectorTwo:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var testVariable:vec3<f32>=vectorOne-vectorTwo;` +
                `}`
            );
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 5.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne - scalarValue;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var scalarValue:f32=5.0;` +
                `var testVariable:vec3<f32>=vectorOne-scalarValue;` +
                `}`
            );
        });
    });

    await pContext.step('Multiplication', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 5.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} * ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}*${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} * ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}*${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne * vectorTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                `var testVariable:vec3<f32>=vectorOne*vectorTwo;` +
                `}`
            );
        });

        await pContext.step('Matrix', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
                    let matrixTwo: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(2.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 2.0);
                    let testVariable: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = matrixOne * matrixTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var matrixOne:mat3x3<f32>=mat3x3(1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0);` +
                `var matrixTwo:mat3x3<f32>=mat3x3(2.0,0.0,0.0,0.0,2.0,0.0,0.0,0.0,2.0);` +
                `var testVariable:mat3x3<f32>=matrixOne*matrixTwo;` +
                `}`
            );
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 5.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne * scalarValue;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var scalarValue:f32=5.0;` +
                `var testVariable:vec3<f32>=vectorOne*scalarValue;` +
                `}`
            );
        });

        await pContext.step('Mixed matrix with vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix23}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0);
                    let vectorOne: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = matrixOne * vectorOne;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var matrixOne:mat2x3<f32>=mat2x3(1.0,0.0,0.0,0.0,1.0,0.0);` +
                `var vectorOne:vec2<f32>=vec2(1.0,2.0);` +
                `var testVariable:vec3<f32>=matrixOne*vectorOne;` +
                `}`
            );
        });

        await pContext.step('Mixed vector with matrix', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix23}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0);
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = vectorOne * matrixOne;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var matrixOne:mat2x3<f32>=mat2x3(1.0,0.0,0.0,0.0,1.0,0.0);` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var testVariable:vec2<f32>=vectorOne*matrixOne;` +
                `}`
            );
        });

        await pContext.step('Mixed multiple matrix with vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = matrixOne * matrixOne * matrixOne * vectorOne;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var matrixOne:mat3x3<f32>=mat3x3(1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0);` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var testVariable:vec3<f32>=matrixOne*matrixOne*matrixOne*vectorOne;` +
                `}`
            );
        });
    });

    await pContext.step('Division', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 6.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} / ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}/${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 6;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} / ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}/${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(6.0, 9.0, 12.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(2.0, 3.0, 4.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne / vectorTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(6.0,9.0,12.0);` +
                `var vectorTwo:vec3<f32>=vec3(2.0,3.0,4.0);` +
                `var testVariable:vec3<f32>=vectorOne/vectorTwo;` +
                `}`
            );
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(6.0, 9.0, 12.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 3.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne / scalarValue;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(6.0,9.0,12.0);` +
                `var scalarValue:f32=3.0;` +
                `var testVariable:vec3<f32>=vectorOne/scalarValue;` +
                `}`
            );
        });
    });

    await pContext.step('Modulo', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 7.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} % ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}%${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 7;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} % ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}%${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(7.0, 8.0, 9.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(3.0, 3.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne % vectorTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(7.0,8.0,9.0);` +
                `var vectorTwo:vec3<f32>=vec3(3.0,3.0,3.0);` +
                `var testVariable:vec3<f32>=vectorOne%vectorTwo;` +
                `}`
            );
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(7.0, 8.0, 9.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 3.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne % scalarValue;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(7.0,8.0,9.0);` +
                `var scalarValue:f32=3.0;` +
                `var testVariable:vec3<f32>=vectorOne%scalarValue;` +
                `}`
            );
        });
    });
});
