import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslPackingBuildInFunction-pack4x8snorm', async (pContext) => {
    await pContext.step('pack4x8snorm(Vector4<float32>)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(0.5, 0.5, 0.5, 0.5);
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = pack4x8snorm(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:vec4<f32>=vec4(0.5,0.5,0.5,0.5);` +
            `var resultValue:u32=pack4x8snorm(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-pack4x8unorm', async (pContext) => {
    await pContext.step('pack4x8unorm(Vector4<float32>)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(0.5, 0.5, 0.5, 0.5);
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = pack4x8unorm(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:vec4<f32>=vec4(0.5,0.5,0.5,0.5);` +
            `var resultValue:u32=pack4x8unorm(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-pack4xI8', async (pContext) => {
    await pContext.step('pack4xI8(Vector4<signedInteger>)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector4}(10i, 20i, 30i, 40i);
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = pack4xI8(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:vec4<i32>=vec4<i32>(10i,20i,30i,40i);` +
            `var resultValue:u32=pack4xI8(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-pack4xU8', async (pContext) => {
    await pContext.step('pack4xU8(Vector4<unsignedInteger>)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.unsignedInteger}> = new ${PgslVectorType.typeName.vector4}(10u, 20u, 30u, 40u);
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = pack4xU8(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:vec4<u32>=vec4<u32>(10u,20u,30u,40u);` +
            `var resultValue:u32=pack4xU8(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-pack4xI8Clamp', async (pContext) => {
    await pContext.step('pack4xI8Clamp(Vector4<signedInteger>)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector4}(10i, 20i, 30i, 40i);
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = pack4xI8Clamp(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:vec4<i32>=vec4<i32>(10i,20i,30i,40i);` +
            `var resultValue:u32=pack4xI8Clamp(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-pack4xU8Clamp', async (pContext) => {
    await pContext.step('pack4xU8Clamp(Vector4<unsignedInteger>)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.unsignedInteger}> = new ${PgslVectorType.typeName.vector4}(10u, 20u, 30u, 40u);
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = pack4xU8Clamp(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:vec4<u32>=vec4<u32>(10u,20u,30u,40u);` +
            `var resultValue:u32=pack4xU8Clamp(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-pack2x16snorm', async (pContext) => {
    await pContext.step('pack2x16snorm(Vector2<float32>)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = pack2x16snorm(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:vec2<f32>=vec2(0.5,0.5);` +
            `var resultValue:u32=pack2x16snorm(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-pack2x16unorm', async (pContext) => {
    await pContext.step('pack2x16unorm(Vector2<float32>)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = pack2x16unorm(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:vec2<f32>=vec2(0.5,0.5);` +
            `var resultValue:u32=pack2x16unorm(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-pack2x16float', async (pContext) => {
    await pContext.step('pack2x16float(Vector2<float32>)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = pack2x16float(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:vec2<f32>=vec2(1.0,2.0);` +
            `var resultValue:u32=pack2x16float(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-unpack4x8snorm', async (pContext) => {
    await pContext.step('unpack4x8snorm(unsignedInteger)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslNumericType.typeName.unsignedInteger} = 123456u;
                let resultValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = unpack4x8snorm(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:u32=123456u;` +
            `var resultValue:vec4<f32>=unpack4x8snorm(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-unpack4x8unorm', async (pContext) => {
    await pContext.step('unpack4x8unorm(unsignedInteger)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslNumericType.typeName.unsignedInteger} = 123456u;
                let resultValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = unpack4x8unorm(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:u32=123456u;` +
            `var resultValue:vec4<f32>=unpack4x8unorm(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-unpack4xI8', async (pContext) => {
    await pContext.step('unpack4xI8(unsignedInteger)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslNumericType.typeName.unsignedInteger} = 123456u;
                let resultValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.signedInteger}> = unpack4xI8(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:u32=123456u;` +
            `var resultValue:vec4<i32>=unpack4xI8(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-unpack4xU8', async (pContext) => {
    await pContext.step('unpack4xU8(unsignedInteger)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslNumericType.typeName.unsignedInteger} = 123456u;
                let resultValue: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.unsignedInteger}> = unpack4xU8(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:u32=123456u;` +
            `var resultValue:vec4<u32>=unpack4xU8(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-unpack2x16snorm', async (pContext) => {
    await pContext.step('unpack2x16snorm(unsignedInteger)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslNumericType.typeName.unsignedInteger} = 123456u;
                let resultValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = unpack2x16snorm(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:u32=123456u;` +
            `var resultValue:vec2<f32>=unpack2x16snorm(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-unpack2x16unorm', async (pContext) => {
    await pContext.step('unpack2x16unorm(unsignedInteger)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslNumericType.typeName.unsignedInteger} = 123456u;
                let resultValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = unpack2x16unorm(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:u32=123456u;` +
            `var resultValue:vec2<f32>=unpack2x16unorm(eValue);` +
            `}`
        );
    });
});

Deno.test('PgslPackingBuildInFunction-unpack2x16float', async (pContext) => {
    await pContext.step('unpack2x16float(unsignedInteger)', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let eValue: ${PgslNumericType.typeName.unsignedInteger} = 123456u;
                let resultValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = unpack2x16float(eValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var eValue:u32=123456u;` +
            `var resultValue:vec2<f32>=unpack2x16float(eValue);` +
            `}`
        );
    });
});