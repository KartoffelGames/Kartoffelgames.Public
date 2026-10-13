import { expect } from '@kartoffelgames/core-test';
import { PgslArrayType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ValueDecompositionExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Struct Property Access', async (pContext) => {
        await pContext.step('Simple property access', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'propertyOne';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
                function testFunction(): void {
                    let testStruct: ${lStructName};
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `${lPropertyName}:f32` +
                `}` +
                `fn testFunction(){` +
                `var testStruct:${lStructName};` +
                `var testVariable:f32=testStruct.${lPropertyName};` +
                `}`
            );
        });

        await pContext.step('Nested property access', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lNestedStructName: string = 'NestedStruct';
            const lPropertyName: string = 'propertyOne';
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct ${lNestedStructName} {
                    ${lNestedPropertyName}: ${PgslNumericType.typeName.float32}
                }
                struct ${lStructName} {
                    ${lPropertyName}: ${lNestedStructName}
                }
                function testFunction(): void {
                    let testStruct: ${lStructName};
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName}.${lNestedPropertyName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lNestedStructName}{` +
                `${lNestedPropertyName}:f32` +
                `}` +
                `struct ${lStructName}{` +
                `${lPropertyName}:${lNestedStructName}` +
                `}` +
                `fn testFunction(){` +
                `var testStruct:${lStructName};` +
                `var testVariable:f32=testStruct.${lPropertyName}.${lNestedPropertyName};` +
                `}`
            );
        });
    });

    await pContext.step('Enum Value Access', async (pContext) => {
        await pContext.step('Enum value by name', () => {
            // Setup.
            const lEnumValue: number = 1;
            const lCodeText: string = `
                enum TestEnum {
                    testValueOne = ${lEnumValue},
                    testValueTwo = 2
                }
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = TestEnum.testValueOne;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lEnumValue};` +
                `}`
            );
        });
    });

    await pContext.step('Vector Swizzling', async (pContext) => {
        await pContext.step('Single component swizzle', async () => {
            // Setup.
            const lSwizzle: string = 'x';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVector:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var testVariable:f32=testVector.${lSwizzle};` +
                `}`
            );
        });

        await pContext.step('Multi component swizzle', async () => {
            // Setup.
            const lSwizzle: string = 'xy';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVector:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var testVariable:vec2<f32>=testVector.${lSwizzle};` +
                `}`
            );
        });

        await pContext.step('RGBA notation', async () => {
            // Setup.
            const lSwizzle: string = 'rgba';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0);
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVector:vec4<f32>=vec4(1.0,2.0,3.0,4.0);` +
                `var testVariable:vec4<f32>=testVector.${lSwizzle};` +
                `}`
            );
        });

        await pContext.step('XYZW notation', async () => {
            // Setup.
            const lSwizzle: string = 'xyzw';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0);
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVector:vec4<f32>=vec4(1.0,2.0,3.0,4.0);` +
                `var testVariable:vec4<f32>=testVector.${lSwizzle};` +
                `}`
            );
        });
    });

    await pContext.step('Decomposing a chained value', async () => {
        // Setup.
        const lFunctionName: string = 'createVector';
        const lCodeText: string = `
            function ${lFunctionName}(): ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> {
                return new ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0, 4.0);
            }
            function testFunction(): void {
                let vectorArray: ${PgslArrayType.typeName.array}<${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>, 2>;
                let afterIndex: ${PgslNumericType.typeName.float32} = vectorArray[0].x;
                let afterCall: ${PgslNumericType.typeName.float32} = ${lFunctionName}().x;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Chains are emitted in source order.
        expect(lTranspilationResult.source).toBe(
            `fn ${lFunctionName}()->vec4<f32>{return vec4<f32>(1.0,2.0,3.0,4.0);}` +
            `fn testFunction(){` +
            `var vectorArray:array<vec4<f32>,2>;` +
            `var afterIndex:f32=vectorArray[0].x;` +
            `var afterCall:f32=${lFunctionName}().x;` +
            `}`
        );
    });
});
