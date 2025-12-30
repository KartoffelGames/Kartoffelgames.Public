import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from "../../../../source/parser/pgsl-parser.ts";
import { PgslNumericType } from "../../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { WgslTranspiler } from "../../../../source/transpilation/wgsl/wgsl-transpiler.ts";
import { PgslParserResult } from "../../../../source/parser_result/pgsl-parser-result.ts";


// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslNumericBuildInFunction-bitcast', async (pContext) => {
    await pContext.step('bitcast<float32>(float32)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.0;
                let resultValue: ${PgslNumericType.typeName.float32} = bitcast<${PgslNumericType.typeName.float32}>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.0;` +
            `let resultValue:f32=bitcast<f32>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<signedInteger>(float32)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.0;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = bitcast<${PgslNumericType.typeName.signedInteger}>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.0;` +
            `let resultValue:i32=bitcast<i32>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<unsignedInteger>(float32)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.0;
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = bitcast<${PgslNumericType.typeName.unsignedInteger}>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.0;` +
            `let resultValue:u32=bitcast<u32>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<float32>(signedInteger)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 1;
                let resultValue: ${PgslNumericType.typeName.float32} = bitcast<${PgslNumericType.typeName.float32}>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=1;` +
            `let resultValue:f32=bitcast<f32>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<signedInteger>(signedInteger)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 1;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = bitcast<${PgslNumericType.typeName.signedInteger}>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=1;` +
            `let resultValue:i32=bitcast<i32>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<unsignedInteger>(signedInteger)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 1;
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = bitcast<${PgslNumericType.typeName.unsignedInteger}>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=1;` +
            `let resultValue:u32=bitcast<u32>(inputValue);` +
            `}`
        );
    });

    // Numeric Vectors.
    await pContext.step('bitcast<Vector2<float32>>(Vector2<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = bitcast<Vector2<${PgslNumericType.typeName.float32}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.0,2.0);` +
            `let resultValue:vec2<f32>=bitcast<vec2<f32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector2<signedInteger>>(Vector2<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = bitcast<Vector2<${PgslNumericType.typeName.signedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.0,2.0);` +
            `let resultValue:vec2<i32>=bitcast<vec2<i32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector2<unsignedInteger>>(Vector2<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.unsignedInteger}> = bitcast<Vector2<${PgslNumericType.typeName.unsignedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.0,2.0);` +
            `let resultValue:vec2<u32>=bitcast<vec2<u32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector2<float32>>(Vector2<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(1, 2);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = bitcast<Vector2<${PgslNumericType.typeName.float32}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(1,2);` +
            `let resultValue:vec2<f32>=bitcast<vec2<f32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector2<signedInteger>>(Vector2<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(1, 2);
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = bitcast<Vector2<${PgslNumericType.typeName.signedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(1,2);` +
            `let resultValue:vec2<i32>=bitcast<vec2<i32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector2<unsignedInteger>>(Vector2<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(1, 2);
                let resultValue: Vector2<${PgslNumericType.typeName.unsignedInteger}> = bitcast<Vector2<${PgslNumericType.typeName.unsignedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(1,2);` +
            `let resultValue:vec2<u32>=bitcast<vec2<u32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector2<float32>>(Vector2<unsignedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.unsignedInteger}> = new Vector2(1, 2);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = bitcast<Vector2<${PgslNumericType.typeName.float32}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<u32>=vec2(1,2);` +
            `let resultValue:vec2<f32>=bitcast<vec2<f32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector2<signedInteger>>(Vector2<unsignedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.unsignedInteger}> = new Vector2(1, 2);
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = bitcast<Vector2<${PgslNumericType.typeName.signedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<u32>=vec2(1,2);` +
            `let resultValue:vec2<i32>=bitcast<vec2<i32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector2<unsignedInteger>>(Vector2<unsignedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.unsignedInteger}> = new Vector2(1, 2);
                let resultValue: Vector2<${PgslNumericType.typeName.unsignedInteger}> = bitcast<Vector2<${PgslNumericType.typeName.unsignedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<u32>=vec2(1,2);` +
            `let resultValue:vec2<u32>=bitcast<vec2<u32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector3<float32>>(Vector3<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector3<${PgslNumericType.typeName.float32}> = new Vector3(1.0, 2.0, 3.0);
                let resultValue: Vector3<${PgslNumericType.typeName.float32}> = bitcast<Vector3<${PgslNumericType.typeName.float32}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec3<f32>=vec3(1.0,2.0,3.0);` +
            `let resultValue:vec3<f32>=bitcast<vec3<f32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector3<signedInteger>>(Vector3<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector3<${PgslNumericType.typeName.float32}> = new Vector3(1.0, 2.0, 3.0);
                let resultValue: Vector3<${PgslNumericType.typeName.signedInteger}> = bitcast<Vector3<${PgslNumericType.typeName.signedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec3<f32>=vec3(1.0,2.0,3.0);` +
            `let resultValue:vec3<i32>=bitcast<vec3<i32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector3<unsignedInteger>>(Vector3<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector3<${PgslNumericType.typeName.float32}> = new Vector3(1.0, 2.0, 3.0);
                let resultValue: Vector3<${PgslNumericType.typeName.unsignedInteger}> = bitcast<Vector3<${PgslNumericType.typeName.unsignedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec3<f32>=vec3(1.0,2.0,3.0);` +
            `let resultValue:vec3<u32>=bitcast<vec3<u32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector3<float32>>(Vector3<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector3<${PgslNumericType.typeName.signedInteger}> = new Vector3(1, 2, 3);
                let resultValue: Vector3<${PgslNumericType.typeName.float32}> = bitcast<Vector3<${PgslNumericType.typeName.float32}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec3<i32>=vec3(1,2,3);` +
            `let resultValue:vec3<f32>=bitcast<vec3<f32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector3<signedInteger>>(Vector3<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector3<${PgslNumericType.typeName.signedInteger}> = new Vector3(1, 2, 3);
                let resultValue: Vector3<${PgslNumericType.typeName.signedInteger}> = bitcast<Vector3<${PgslNumericType.typeName.signedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec3<i32>=vec3(1,2,3);` +
            `let resultValue:vec3<i32>=bitcast<vec3<i32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector3<unsignedInteger>>(Vector3<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector3<${PgslNumericType.typeName.signedInteger}> = new Vector3(1, 2, 3);
                let resultValue: Vector3<${PgslNumericType.typeName.unsignedInteger}> = bitcast<Vector3<${PgslNumericType.typeName.unsignedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec3<i32>=vec3(1,2,3);` +
            `let resultValue:vec3<u32>=bitcast<vec3<u32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector3<float32>>(Vector3<unsignedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector3<${PgslNumericType.typeName.unsignedInteger}> = new Vector3(1, 2, 3);
                let resultValue: Vector3<${PgslNumericType.typeName.float32}> = bitcast<Vector3<${PgslNumericType.typeName.float32}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec3<u32>=vec3(1,2,3);` +
            `let resultValue:vec3<f32>=bitcast<vec3<f32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector3<signedInteger>>(Vector3<unsignedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector3<${PgslNumericType.typeName.unsignedInteger}> = new Vector3(1, 2, 3);
                let resultValue: Vector3<${PgslNumericType.typeName.signedInteger}> = bitcast<Vector3<${PgslNumericType.typeName.signedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec3<u32>=vec3(1,2,3);` +
            `let resultValue:vec3<i32>=bitcast<vec3<i32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector3<unsignedInteger>>(Vector3<unsignedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector3<${PgslNumericType.typeName.unsignedInteger}> = new Vector3(1, 2, 3);
                let resultValue: Vector3<${PgslNumericType.typeName.unsignedInteger}> = bitcast<Vector3<${PgslNumericType.typeName.unsignedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec3<u32>=vec3(1,2,3);` +
            `let resultValue:vec3<u32>=bitcast<vec3<u32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector4<float32>>(Vector4<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector4<${PgslNumericType.typeName.float32}> = new Vector4(1.0, 2.0, 3.0, 4.0);
                let resultValue: Vector4<${PgslNumericType.typeName.float32}> = bitcast<Vector4<${PgslNumericType.typeName.float32}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec4<f32>=vec4(1.0,2.0,3.0,4.0);` +
            `let resultValue:vec4<f32>=bitcast<vec4<f32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector4<signedInteger>>(Vector4<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector4<${PgslNumericType.typeName.float32}> = new Vector4(1.0, 2.0, 3.0, 4.0);
                let resultValue: Vector4<${PgslNumericType.typeName.signedInteger}> = bitcast<Vector4<${PgslNumericType.typeName.signedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec4<f32>=vec4(1.0,2.0,3.0,4.0);` +
            `let resultValue:vec4<i32>=bitcast<vec4<i32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector4<unsignedInteger>>(Vector4<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector4<${PgslNumericType.typeName.float32}> = new Vector4(1.0, 2.0, 3.0, 4.0);
                let resultValue: Vector4<${PgslNumericType.typeName.unsignedInteger}> = bitcast<Vector4<${PgslNumericType.typeName.unsignedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec4<f32>=vec4(1.0,2.0,3.0,4.0);` +
            `let resultValue:vec4<u32>=bitcast<vec4<u32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector4<float32>>(Vector4<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector4<${PgslNumericType.typeName.signedInteger}> = new Vector4(1, 2, 3, 4);
                let resultValue: Vector4<${PgslNumericType.typeName.float32}> = bitcast<Vector4<${PgslNumericType.typeName.float32}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec4<i32>=vec4(1,2,3,4);` +
            `let resultValue:vec4<f32>=bitcast<vec4<f32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector4<signedInteger>>(Vector4<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector4<${PgslNumericType.typeName.signedInteger}> = new Vector4(1, 2, 3, 4);
                let resultValue: Vector4<${PgslNumericType.typeName.signedInteger}> = bitcast<Vector4<${PgslNumericType.typeName.signedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec4<i32>=vec4(1,2,3,4);` +
            `let resultValue:vec4<i32>=bitcast<vec4<i32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector4<unsignedInteger>>(Vector4<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector4<${PgslNumericType.typeName.signedInteger}> = new Vector4(1, 2, 3, 4);
                let resultValue: Vector4<${PgslNumericType.typeName.unsignedInteger}> = bitcast<Vector4<${PgslNumericType.typeName.unsignedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec4<i32>=vec4(1,2,3,4);` +
            `let resultValue:vec4<u32>=bitcast<vec4<u32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector4<float32>>(Vector4<unsignedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector4<${PgslNumericType.typeName.unsignedInteger}> = new Vector4(1, 2, 3, 4);
                let resultValue: Vector4<${PgslNumericType.typeName.float32}> = bitcast<Vector4<${PgslNumericType.typeName.float32}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec4<u32>=vec4(1,2,3,4);` +
            `let resultValue:vec4<f32>=bitcast<vec4<f32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector4<signedInteger>>(Vector4<unsignedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector4<${PgslNumericType.typeName.unsignedInteger}> = new Vector4(1, 2, 3, 4);
                let resultValue: Vector4<${PgslNumericType.typeName.signedInteger}> = bitcast<Vector4<${PgslNumericType.typeName.signedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec4<u32>=vec4(1,2,3,4);` +
            `let resultValue:vec4<i32>=bitcast<vec4<i32>>(inputValue);` +
            `}`
        );
    });

    await pContext.step('bitcast<Vector4<unsignedInteger>>(Vector4<unsignedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector4<${PgslNumericType.typeName.unsignedInteger}> = new Vector4(1, 2, 3, 4);
                let resultValue: Vector4<${PgslNumericType.typeName.unsignedInteger}> = bitcast<Vector4<${PgslNumericType.typeName.unsignedInteger}>>(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec4<u32>=vec4(1,2,3,4);` +
            `let resultValue:vec4<u32>=bitcast<vec4<u32>>(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-abs', async (pContext) => {
    await pContext.step('abs(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = -1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = abs(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=-1.5;` +
            `let resultValue:f32=abs(inputValue);` +
            `}`
        );
    });

    await pContext.step('abs(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(-1.0, -2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = abs(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(-1.0,-2.0);` +
            `let resultValue:vec2<f32>=abs(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-acos', async (pContext) => {
    await pContext.step('acos(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.5;
                let resultValue: ${PgslNumericType.typeName.float32} = acos(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.5;` +
            `let resultValue:f32=acos(inputValue);` +
            `}`
        );
    });

    await pContext.step('acos(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 0.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = acos(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.5,0.0);` +
            `let resultValue:vec2<f32>=acos(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-acosh', async (pContext) => {
    await pContext.step('acosh(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = acosh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=acosh(inputValue);` +
            `}`
        );
    });

    await pContext.step('acosh(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = acosh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=acosh(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-asin', async (pContext) => {
    await pContext.step('asin(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.5;
                let resultValue: ${PgslNumericType.typeName.float32} = asin(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.5;` +
            `let resultValue:f32=asin(inputValue);` +
            `}`
        );
    });

    await pContext.step('asin(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 0.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = asin(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.5,0.0);` +
            `let resultValue:vec2<f32>=asin(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-asinh', async (pContext) => {
    await pContext.step('asinh(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.5;
                let resultValue: ${PgslNumericType.typeName.float32} = asinh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.5;` +
            `let resultValue:f32=asinh(inputValue);` +
            `}`
        );
    });

    await pContext.step('asinh(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 1.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = asinh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.5,1.0);` +
            `let resultValue:vec2<f32>=asinh(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-atan', async (pContext) => {
    await pContext.step('atan(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.0;
                let resultValue: ${PgslNumericType.typeName.float32} = atan(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.0;` +
            `let resultValue:f32=atan(inputValue);` +
            `}`
        );
    });

    await pContext.step('atan(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 0.5);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = atan(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.0,0.5);` +
            `let resultValue:vec2<f32>=atan(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-atan2', async (pContext) => {
    await pContext.step('atan2(numeric-float, numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let yValue: ${PgslNumericType.typeName.float32} = 1.0;
                let xValue: ${PgslNumericType.typeName.float32} = 1.0;
                let resultValue: ${PgslNumericType.typeName.float32} = atan2(yValue, xValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let yValue:f32=1.0;` +
            `let xValue:f32=1.0;` +
            `let resultValue:f32=atan2(yValue,xValue);` +
            `}`
        );
    });

    await pContext.step('atan2(Vector<numeric-float>, Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let yValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 0.5);
                let xValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 0.5);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = atan2(yValue, xValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let yValue:vec2<f32>=vec2(1.0,0.5);` +
            `let xValue:vec2<f32>=vec2(1.0,0.5);` +
            `let resultValue:vec2<f32>=atan2(yValue,xValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-atanh', async (pContext) => {
    await pContext.step('atanh(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.5;
                let resultValue: ${PgslNumericType.typeName.float32} = atanh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.5;` +
            `let resultValue:f32=atanh(inputValue);` +
            `}`
        );
    });

    await pContext.step('atanh(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 0.3);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = atanh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.5,0.3);` +
            `let resultValue:vec2<f32>=atanh(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-ceil', async (pContext) => {
    await pContext.step('ceil(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = ceil(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=ceil(inputValue);` +
            `}`
        );
    });

    await pContext.step('ceil(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.3);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = ceil(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.3);` +
            `let resultValue:vec2<f32>=ceil(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-clamp', async (pContext) => {
    await pContext.step('clamp(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 2.5;
                let lowValue: ${PgslNumericType.typeName.float32} = 1.0;
                let highValue: ${PgslNumericType.typeName.float32} = 3.0;
                let resultValue: ${PgslNumericType.typeName.float32} = clamp(inputValue, lowValue, highValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=2.5;` +
            `let lowValue:f32=1.0;` +
            `let highValue:f32=3.0;` +
            `let resultValue:f32=clamp(inputValue,lowValue,highValue);` +
            `}`
        );
    });

    await pContext.step('clamp(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(2.5, 0.5);
                let lowValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 0.0);
                let highValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 1.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = clamp(inputValue, lowValue, highValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(2.5,0.5);` +
            `let lowValue:vec2<f32>=vec2(1.0,0.0);` +
            `let highValue:vec2<f32>=vec2(3.0,1.0);` +
            `let resultValue:vec2<f32>=clamp(inputValue,lowValue,highValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-cos', async (pContext) => {
    await pContext.step('cos(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.0;
                let resultValue: ${PgslNumericType.typeName.float32} = cos(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.0;` +
            `let resultValue:f32=cos(inputValue);` +
            `}`
        );
    });

    await pContext.step('cos(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.0, 1.57);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = cos(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.0,1.57);` +
            `let resultValue:vec2<f32>=cos(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-cosh', async (pContext) => {
    await pContext.step('cosh(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.5;
                let resultValue: ${PgslNumericType.typeName.float32} = cosh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.5;` +
            `let resultValue:f32=cosh(inputValue);` +
            `}`
        );
    });

    await pContext.step('cosh(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 1.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = cosh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.5,1.0);` +
            `let resultValue:vec2<f32>=cosh(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-countLeadingZeros', async (pContext) => {
    await pContext.step('countLeadingZeros(numeric-integer)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 8;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = countLeadingZeros(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=8;` +
            `let resultValue:i32=countLeadingZeros(inputValue);` +
            `}`
        );
    });

    await pContext.step('countLeadingZeros(Vector<numeric-integer>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(8, 16);
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = countLeadingZeros(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(8,16);` +
            `let resultValue:vec2<i32>=countLeadingZeros(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-countOneBits', async (pContext) => {
    await pContext.step('countOneBits(numeric-integer)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 15;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = countOneBits(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=15;` +
            `let resultValue:i32=countOneBits(inputValue);` +
            `}`
        );
    });

    await pContext.step('countOneBits(Vector<numeric-integer>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(15, 7);
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = countOneBits(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(15,7);` +
            `let resultValue:vec2<i32>=countOneBits(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-countTrailingZeros', async (pContext) => {
    await pContext.step('countTrailingZeros(numeric-integer)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 8;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = countTrailingZeros(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=8;` +
            `let resultValue:i32=countTrailingZeros(inputValue);` +
            `}`
        );
    });

    await pContext.step('countTrailingZeros(Vector<numeric-integer>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(8, 16);
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = countTrailingZeros(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(8,16);` +
            `let resultValue:vec2<i32>=countTrailingZeros(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-cross', async (pContext) => {
    await pContext.step('cross(Vector3<float32>, Vector3<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let aValue: Vector3<${PgslNumericType.typeName.float32}> = new Vector3(1.0, 0.0, 0.0);
                let bValue: Vector3<${PgslNumericType.typeName.float32}> = new Vector3(0.0, 1.0, 0.0);
                let resultValue: Vector3<${PgslNumericType.typeName.float32}> = cross(aValue, bValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let aValue:vec3<f32>=vec3(1.0,0.0,0.0);` +
            `let bValue:vec3<f32>=vec3(0.0,1.0,0.0);` +
            `let resultValue:vec3<f32>=cross(aValue,bValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-degrees', async (pContext) => {
    await pContext.step('degrees(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 3.14159;
                let resultValue: ${PgslNumericType.typeName.float32} = degrees(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=3.14159;` +
            `let resultValue:f32=degrees(inputValue);` +
            `}`
        );
    });

    await pContext.step('degrees(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.14159, 1.5708);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = degrees(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(3.14159,1.5708);` +
            `let resultValue:vec2<f32>=degrees(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-determinant', async (pContext) => {
    await pContext.step('determinant(Matrix22<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Matrix22<${PgslNumericType.typeName.float32}> = new Matrix22(1.0, 2.0, 3.0, 4.0);
                let resultValue: ${PgslNumericType.typeName.float32} = determinant(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:mat2x2<f32>=mat2x2(1.0,2.0,3.0,4.0);` +
            `let resultValue:f32=determinant(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-distance', async (pContext) => {
    await pContext.step('distance(numeric-float, numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: ${PgslNumericType.typeName.float32} = 1.0;
                let value2: ${PgslNumericType.typeName.float32} = 4.0;
                let resultValue: ${PgslNumericType.typeName.float32} = distance(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:f32=1.0;` +
            `let value2:f32=4.0;` +
            `let resultValue:f32=distance(value1,value2);` +
            `}`
        );
    });

    await pContext.step('distance(Vector2<float32>, Vector2<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.0, 0.0);
                let value2: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 4.0);
                let resultValue: ${PgslNumericType.typeName.float32} = distance(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(0.0,0.0);` +
            `let value2:vec2<f32>=vec2(3.0,4.0);` +
            `let resultValue:f32=distance(value1,value2);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-dot', async (pContext) => {
    await pContext.step('dot(Vector2<signedInteger>, Vector2<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(1, 2);
                let value2: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(3, 4);
                let resultValue: ${PgslNumericType.typeName.signedInteger} = dot(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<i32>=vec2(1,2);` +
            `let value2:vec2<i32>=vec2(3,4);` +
            `let resultValue:i32=dot(value1,value2);` +
            `}`
        );
    });

    await pContext.step('dot(Vector2<float32>, Vector2<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 2.0);
                let value2: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 4.0);
                let resultValue: ${PgslNumericType.typeName.float32} = dot(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(1.0,2.0);` +
            `let value2:vec2<f32>=vec2(3.0,4.0);` +
            `let resultValue:f32=dot(value1,value2);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-dot4U8Packed', async (pContext) => {
    await pContext.step('dot4U8Packed(unsignedInteger, unsignedInteger)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: ${PgslNumericType.typeName.unsignedInteger} = 0u;
                let value2: ${PgslNumericType.typeName.unsignedInteger} = 0u;
                let resultValue: ${PgslNumericType.typeName.unsignedInteger} = dot4U8Packed(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:u32=0u;` +
            `let value2:u32=0u;` +
            `let resultValue:u32=dot4U8Packed(value1,value2);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-dot4I8Packed', async (pContext) => {
    await pContext.step('dot4I8Packed(unsignedInteger, unsignedInteger)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: ${PgslNumericType.typeName.unsignedInteger} = 0u;
                let value2: ${PgslNumericType.typeName.unsignedInteger} = 0u;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = dot4I8Packed(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:u32=0u;` +
            `let value2:u32=0u;` +
            `let resultValue:i32=dot4I8Packed(value1,value2);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-exp', async (pContext) => {
    await pContext.step('exp(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.0;
                let resultValue: ${PgslNumericType.typeName.float32} = exp(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.0;` +
            `let resultValue:f32=exp(inputValue);` +
            `}`
        );
    });

    await pContext.step('exp(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = exp(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.0,2.0);` +
            `let resultValue:vec2<f32>=exp(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-exp2', async (pContext) => {
    await pContext.step('exp2(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 3.0;
                let resultValue: ${PgslNumericType.typeName.float32} = exp2(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=3.0;` +
            `let resultValue:f32=exp2(inputValue);` +
            `}`
        );
    });

    await pContext.step('exp2(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 4.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = exp2(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(3.0,4.0);` +
            `let resultValue:vec2<f32>=exp2(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-extractBits', async (pContext) => {
    await pContext.step('extractBits(signedInteger)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 15;
                let offsetValue: ${PgslNumericType.typeName.unsignedInteger} = 0u;
                let countValue: ${PgslNumericType.typeName.unsignedInteger} = 4u;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = extractBits(inputValue, offsetValue, countValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=15;` +
            `let offsetValue:u32=0u;` +
            `let countValue:u32=4u;` +
            `let resultValue:i32=extractBits(inputValue,offsetValue,countValue);` +
            `}`
        );
    });

    await pContext.step('extractBits(Vector<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(15, 255);
                let offsetValue: ${PgslNumericType.typeName.unsignedInteger} = 0u;
                let countValue: ${PgslNumericType.typeName.unsignedInteger} = 4u;
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = extractBits(inputValue, offsetValue, countValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(15,255);` +
            `let offsetValue:u32=0u;` +
            `let countValue:u32=4u;` +
            `let resultValue:vec2<i32>=extractBits(inputValue,offsetValue,countValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-floor', async (pContext) => {
    await pContext.step('floor(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.9;
                let resultValue: ${PgslNumericType.typeName.float32} = floor(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.9;` +
            `let resultValue:f32=floor(inputValue);` +
            `}`
        );
    });

    await pContext.step('floor(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.9, 2.3);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = floor(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.9,2.3);` +
            `let resultValue:vec2<f32>=floor(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-fma', async (pContext) => {
    await pContext.step('fma(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: ${PgslNumericType.typeName.float32} = 2.0;
                let value2: ${PgslNumericType.typeName.float32} = 3.0;
                let value3: ${PgslNumericType.typeName.float32} = 4.0;
                let resultValue: ${PgslNumericType.typeName.float32} = fma(value1, value2, value3);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:f32=2.0;` +
            `let value2:f32=3.0;` +
            `let value3:f32=4.0;` +
            `let resultValue:f32=fma(value1,value2,value3);` +
            `}`
        );
    });

    await pContext.step('fma(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(2.0, 3.0);
                let value2: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 2.0);
                let value3: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(4.0, 5.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = fma(value1, value2, value3);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(2.0,3.0);` +
            `let value2:vec2<f32>=vec2(3.0,2.0);` +
            `let value3:vec2<f32>=vec2(4.0,5.0);` +
            `let resultValue:vec2<f32>=fma(value1,value2,value3);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-fract', async (pContext) => {
    await pContext.step('fract(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 3.7;
                let resultValue: ${PgslNumericType.typeName.float32} = fract(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=3.7;` +
            `let resultValue:f32=fract(inputValue);` +
            `}`
        );
    });

    await pContext.step('fract(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.7, 2.3);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = fract(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(3.7,2.3);` +
            `let resultValue:vec2<f32>=fract(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-inverseSqrt', async (pContext) => {
    await pContext.step('inverseSqrt(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 4.0;
                let resultValue: ${PgslNumericType.typeName.float32} = inverseSqrt(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=4.0;` +
            `let resultValue:f32=inverseSqrt(inputValue);` +
            `}`
        );
    });

    await pContext.step('inverseSqrt(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(4.0, 9.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = inverseSqrt(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(4.0,9.0);` +
            `let resultValue:vec2<f32>=inverseSqrt(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-length', async (pContext) => {
    await pContext.step('length(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 3.0;
                let resultValue: ${PgslNumericType.typeName.float32} = length(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=3.0;` +
            `let resultValue:f32=length(inputValue);` +
            `}`
        );
    });

    await pContext.step('length(Vector2<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 4.0);
                let resultValue: ${PgslNumericType.typeName.float32} = length(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(3.0,4.0);` +
            `let resultValue:f32=length(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-log', async (pContext) => {
    await pContext.step('log(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 2.718;
                let resultValue: ${PgslNumericType.typeName.float32} = log(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=2.718;` +
            `let resultValue:f32=log(inputValue);` +
            `}`
        );
    });

    await pContext.step('log(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(2.718, 10.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = log(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(2.718,10.0);` +
            `let resultValue:vec2<f32>=log(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-log2', async (pContext) => {
    await pContext.step('log2(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 8.0;
                let resultValue: ${PgslNumericType.typeName.float32} = log2(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=8.0;` +
            `let resultValue:f32=log2(inputValue);` +
            `}`
        );
    });

    await pContext.step('log2(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(8.0, 16.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = log2(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(8.0,16.0);` +
            `let resultValue:vec2<f32>=log2(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-max', async (pContext) => {
    await pContext.step('max(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: ${PgslNumericType.typeName.float32} = 5.0;
                let value2: ${PgslNumericType.typeName.float32} = 3.0;
                let resultValue: ${PgslNumericType.typeName.float32} = max(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:f32=5.0;` +
            `let value2:f32=3.0;` +
            `let resultValue:f32=max(value1,value2);` +
            `}`
        );
    });

    await pContext.step('max(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(5.0, 2.0);
                let value2: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 8.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = max(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(5.0,2.0);` +
            `let value2:vec2<f32>=vec2(3.0,8.0);` +
            `let resultValue:vec2<f32>=max(value1,value2);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-min', async (pContext) => {
    await pContext.step('min(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: ${PgslNumericType.typeName.float32} = 5.0;
                let value2: ${PgslNumericType.typeName.float32} = 3.0;
                let resultValue: ${PgslNumericType.typeName.float32} = min(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:f32=5.0;` +
            `let value2:f32=3.0;` +
            `let resultValue:f32=min(value1,value2);` +
            `}`
        );
    });

    await pContext.step('min(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(5.0, 2.0);
                let value2: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 8.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = min(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(5.0,2.0);` +
            `let value2:vec2<f32>=vec2(3.0,8.0);` +
            `let resultValue:vec2<f32>=min(value1,value2);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-pow', async (pContext) => {
    await pContext.step('pow(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let baseValue: ${PgslNumericType.typeName.float32} = 2.0;
                let expValue: ${PgslNumericType.typeName.float32} = 3.0;
                let resultValue: ${PgslNumericType.typeName.float32} = pow(baseValue, expValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let baseValue:f32=2.0;` +
            `let expValue:f32=3.0;` +
            `let resultValue:f32=pow(baseValue,expValue);` +
            `}`
        );
    });

    await pContext.step('pow(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let baseValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(2.0, 3.0);
                let expValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = pow(baseValue, expValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let baseValue:vec2<f32>=vec2(2.0,3.0);` +
            `let expValue:vec2<f32>=vec2(3.0,2.0);` +
            `let resultValue:vec2<f32>=pow(baseValue,expValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-radians', async (pContext) => {
    await pContext.step('radians(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 180.0;
                let resultValue: ${PgslNumericType.typeName.float32} = radians(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=180.0;` +
            `let resultValue:f32=radians(inputValue);` +
            `}`
        );
    });

    await pContext.step('radians(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(180.0, 90.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = radians(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(180.0,90.0);` +
            `let resultValue:vec2<f32>=radians(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-sign', async (pContext) => {
    await pContext.step('sign(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = -5.5;
                let resultValue: ${PgslNumericType.typeName.float32} = sign(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=-5.5;` +
            `let resultValue:f32=sign(inputValue);` +
            `}`
        );
    });

    await pContext.step('sign(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(-5.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = sign(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(-5.5,2.0);` +
            `let resultValue:vec2<f32>=sign(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-sin', async (pContext) => {
    await pContext.step('sin(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.0;
                let resultValue: ${PgslNumericType.typeName.float32} = sin(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.0;` +
            `let resultValue:f32=sin(inputValue);` +
            `}`
        );
    });

    await pContext.step('sin(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.0, 1.57);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = sin(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.0,1.57);` +
            `let resultValue:vec2<f32>=sin(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-sinh', async (pContext) => {
    await pContext.step('sinh(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.5;
                let resultValue: ${PgslNumericType.typeName.float32} = sinh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.5;` +
            `let resultValue:f32=sinh(inputValue);` +
            `}`
        );
    });

    await pContext.step('sinh(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 1.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = sinh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.5,1.0);` +
            `let resultValue:vec2<f32>=sinh(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-sqrt', async (pContext) => {
    await pContext.step('sqrt(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 9.0;
                let resultValue: ${PgslNumericType.typeName.float32} = sqrt(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=9.0;` +
            `let resultValue:f32=sqrt(inputValue);` +
            `}`
        );
    });

    await pContext.step('sqrt(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(9.0, 16.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = sqrt(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(9.0,16.0);` +
            `let resultValue:vec2<f32>=sqrt(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-step', async (pContext) => {
    await pContext.step('step(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let edgeValue: ${PgslNumericType.typeName.float32} = 0.5;
                let xValue: ${PgslNumericType.typeName.float32} = 0.7;
                let resultValue: ${PgslNumericType.typeName.float32} = step(edgeValue, xValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let edgeValue:f32=0.5;` +
            `let xValue:f32=0.7;` +
            `let resultValue:f32=step(edgeValue,xValue);` +
            `}`
        );
    });

    await pContext.step('step(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let edgeValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 0.3);
                let xValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.7, 0.2);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = step(edgeValue, xValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let edgeValue:vec2<f32>=vec2(0.5,0.3);` +
            `let xValue:vec2<f32>=vec2(0.7,0.2);` +
            `let resultValue:vec2<f32>=step(edgeValue,xValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-tan', async (pContext) => {
    await pContext.step('tan(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.785;
                let resultValue: ${PgslNumericType.typeName.float32} = tan(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.785;` +
            `let resultValue:f32=tan(inputValue);` +
            `}`
        );
    });

    await pContext.step('tan(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.785, 1.57);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = tan(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.785,1.57);` +
            `let resultValue:vec2<f32>=tan(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-tanh', async (pContext) => {
    await pContext.step('tanh(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 0.5;
                let resultValue: ${PgslNumericType.typeName.float32} = tanh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=0.5;` +
            `let resultValue:f32=tanh(inputValue);` +
            `}`
        );
    });

    await pContext.step('tanh(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 1.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = tanh(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(0.5,1.0);` +
            `let resultValue:vec2<f32>=tanh(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-trunc', async (pContext) => {
    await pContext.step('trunc(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 3.7;
                let resultValue: ${PgslNumericType.typeName.float32} = trunc(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=3.7;` +
            `let resultValue:f32=trunc(inputValue);` +
            `}`
        );
    });

    await pContext.step('trunc(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.7, 2.3);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = trunc(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(3.7,2.3);` +
            `let resultValue:vec2<f32>=trunc(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-faceForward', async (pContext) => {
    await pContext.step('faceForward(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 0.0);
                let value2: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.0, 1.0);
                let value3: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(-1.0, 0.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = faceForward(value1, value2, value3);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(1.0,0.0);` +
            `let value2:vec2<f32>=vec2(0.0,1.0);` +
            `let value3:vec2<f32>=vec2(-1.0,0.0);` +
            `let resultValue:vec2<f32>=faceForward(value1,value2,value3);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-firstLeadingBit', async (pContext) => {
    await pContext.step('firstLeadingBit(signedInteger)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 8;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = firstLeadingBit(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=8;` +
            `let resultValue:i32=firstLeadingBit(inputValue);` +
            `}`
        );
    });

    await pContext.step('firstLeadingBit(Vector<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(8, 16);
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = firstLeadingBit(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(8,16);` +
            `let resultValue:vec2<i32>=firstLeadingBit(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-firstTrailingBit', async (pContext) => {
    await pContext.step('firstTrailingBit(numeric-integer)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 8;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = firstTrailingBit(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=8;` +
            `let resultValue:i32=firstTrailingBit(inputValue);` +
            `}`
        );
    });

    await pContext.step('firstTrailingBit(Vector<numeric-integer>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(8, 16);
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = firstTrailingBit(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(8,16);` +
            `let resultValue:vec2<i32>=firstTrailingBit(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-insertBits', async (pContext) => {
    await pContext.step('insertBits(numeric-integer)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 0;
                let newbitsValue: ${PgslNumericType.typeName.signedInteger} = 15;
                let offsetValue: ${PgslNumericType.typeName.unsignedInteger} = 0u;
                let countValue: ${PgslNumericType.typeName.unsignedInteger} = 4u;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = insertBits(inputValue, newbitsValue, offsetValue, countValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=0;` +
            `let newbitsValue:i32=15;` +
            `let offsetValue:u32=0u;` +
            `let countValue:u32=4u;` +
            `let resultValue:i32=insertBits(inputValue,newbitsValue,offsetValue,countValue);` +
            `}`
        );
    });

    await pContext.step('insertBits(Vector<numeric-integer>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(0, 0);
                let newbitsValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(15, 7);
                let offsetValue: ${PgslNumericType.typeName.unsignedInteger} = 0u;
                let countValue: ${PgslNumericType.typeName.unsignedInteger} = 4u;
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = insertBits(inputValue, newbitsValue, offsetValue, countValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(0,0);` +
            `let newbitsValue:vec2<i32>=vec2(15,7);` +
            `let offsetValue:u32=0u;` +
            `let countValue:u32=4u;` +
            `let resultValue:vec2<i32>=insertBits(inputValue,newbitsValue,offsetValue,countValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-mix', async (pContext) => {
    await pContext.step('mix(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: ${PgslNumericType.typeName.float32} = 1.0;
                let value2: ${PgslNumericType.typeName.float32} = 2.0;
                let value3: ${PgslNumericType.typeName.float32} = 0.5;
                let resultValue: ${PgslNumericType.typeName.float32} = mix(value1, value2, value3);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:f32=1.0;` +
            `let value2:f32=2.0;` +
            `let value3:f32=0.5;` +
            `let resultValue:f32=mix(value1,value2,value3);` +
            `}`
        );
    });

    await pContext.step('mix(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 2.0);
                let value2: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 4.0);
                let value3: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 0.5);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = mix(value1, value2, value3);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(1.0,2.0);` +
            `let value2:vec2<f32>=vec2(3.0,4.0);` +
            `let value3:vec2<f32>=vec2(0.5,0.5);` +
            `let resultValue:vec2<f32>=mix(value1,value2,value3);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-normalize', async (pContext) => {
    await pContext.step('normalize(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.0, 4.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = normalize(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(3.0,4.0);` +
            `let resultValue:vec2<f32>=normalize(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-quantizeToF16', async (pContext) => {
    await pContext.step('quantizeToF16(float32)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = quantizeToF16(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=quantizeToF16(inputValue);` +
            `}`
        );
    });

    await pContext.step('quantizeToF16(Vector<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.5);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = quantizeToF16(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.5);` +
            `let resultValue:vec2<f32>=quantizeToF16(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-reflect', async (pContext) => {
    await pContext.step('reflect(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 1.0);
                let value2: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.0, -1.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = reflect(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(1.0,1.0);` +
            `let value2:vec2<f32>=vec2(0.0,-1.0);` +
            `let resultValue:vec2<f32>=reflect(value1,value2);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-reverseBits', async (pContext) => {
    await pContext.step('reverseBits(numeric-integer)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.signedInteger} = 5;
                let resultValue: ${PgslNumericType.typeName.signedInteger} = reverseBits(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:i32=5;` +
            `let resultValue:i32=reverseBits(inputValue);` +
            `}`
        );
    });

    await pContext.step('reverseBits(Vector<numeric-integer>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(5, 10);
                let resultValue: Vector2<${PgslNumericType.typeName.signedInteger}> = reverseBits(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<i32>=vec2(5,10);` +
            `let resultValue:vec2<i32>=reverseBits(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-round', async (pContext) => {
    await pContext.step('round(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 3.7;
                let resultValue: ${PgslNumericType.typeName.float32} = round(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=3.7;` +
            `let resultValue:f32=round(inputValue);` +
            `}`
        );
    });

    await pContext.step('round(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(3.7, 2.3);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = round(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(3.7,2.3);` +
            `let resultValue:vec2<f32>=round(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-saturate', async (pContext) => {
    await pContext.step('saturate(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = saturate(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=saturate(inputValue);` +
            `}`
        );
    });

    await pContext.step('saturate(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, -0.5);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = saturate(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,-0.5);` +
            `let resultValue:vec2<f32>=saturate(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-smoothstep', async (pContext) => {
    await pContext.step('smoothstep(numeric-float)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let edge0Value: ${PgslNumericType.typeName.float32} = 0.0;
                let edge1Value: ${PgslNumericType.typeName.float32} = 1.0;
                let xValue: ${PgslNumericType.typeName.float32} = 0.5;
                let resultValue: ${PgslNumericType.typeName.float32} = smoothstep(edge0Value, edge1Value, xValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let edge0Value:f32=0.0;` +
            `let edge1Value:f32=1.0;` +
            `let xValue:f32=0.5;` +
            `let resultValue:f32=smoothstep(edge0Value,edge1Value,xValue);` +
            `}`
        );
    });

    await pContext.step('smoothstep(Vector<numeric-float>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let edge0Value: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.0, 0.0);
                let edge1Value: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 1.0);
                let xValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.5, 0.3);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = smoothstep(edge0Value, edge1Value, xValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let edge0Value:vec2<f32>=vec2(0.0,0.0);` +
            `let edge1Value:vec2<f32>=vec2(1.0,1.0);` +
            `let xValue:vec2<f32>=vec2(0.5,0.3);` +
            `let resultValue:vec2<f32>=smoothstep(edge0Value,edge1Value,xValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-transpose', async (pContext) => {
    await pContext.step('transpose(Matrix22<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Matrix22<${PgslNumericType.typeName.float32}> = new Matrix22(1.0, 2.0, 3.0, 4.0);
                let resultValue: Matrix22<${PgslNumericType.typeName.float32}> = transpose(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:mat2x2<f32>=mat2x2(1.0,2.0,3.0,4.0);` +
            `let resultValue:mat2x2<f32>=transpose(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-ldexp', async (pContext) => {
    await pContext.step('ldexp(numeric-float, signedInteger)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: ${PgslNumericType.typeName.float32} = 1.0;
                let value2: ${PgslNumericType.typeName.signedInteger} = 3;
                let resultValue: ${PgslNumericType.typeName.float32} = ldexp(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:f32=1.0;` +
            `let value2:i32=3;` +
            `let resultValue:f32=ldexp(value1,value2);` +
            `}`
        );
    });

    await pContext.step('ldexp(Vector<numeric-float>, Vector<signedInteger>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 2.0);
                let value2: Vector2<${PgslNumericType.typeName.signedInteger}> = new Vector2(3, 2);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = ldexp(value1, value2);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(1.0,2.0);` +
            `let value2:vec2<i32>=vec2(3,2);` +
            `let resultValue:vec2<f32>=ldexp(value1,value2);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-refract', async (pContext) => {
    await pContext.step('refract(Vector2<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.0, 0.0);
                let value2: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(0.0, -1.0);
                let value3: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = refract(value1, value2, value3);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec2<f32>=vec2(1.0,0.0);` +
            `let value2:vec2<f32>=vec2(0.0,-1.0);` +
            `let value3:f32=1.5;` +
            `let resultValue:vec2<f32>=refract(value1,value2,value3);` +
            `}`
        );
    });

    await pContext.step('refract(Vector3<float32>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let value1: Vector3<${PgslNumericType.typeName.float32}> = new Vector3(1.0, 0.0, 0.0);
                let value2: Vector3<${PgslNumericType.typeName.float32}> = new Vector3(0.0, -1.0, 0.0);
                let value3: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: Vector3<${PgslNumericType.typeName.float32}> = refract(value1, value2, value3);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let value1:vec3<f32>=vec3(1.0,0.0,0.0);` +
            `let value2:vec3<f32>=vec3(0.0,-1.0,0.0);` +
            `let value3:f32=1.5;` +
            `let resultValue:vec3<f32>=refract(value1,value2,value3);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-all', async (pContext) => {
    await pContext.step('all(bool)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: bool = true;
                let resultValue: bool = all(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:bool=true;` +
            `let resultValue:bool=all(inputValue);` +
            `}`
        );
    });

    await pContext.step('all(Vector2<bool>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<bool> = new Vector2(true, false);
                let resultValue: bool = all(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<bool>=vec2(true,false);` +
            `let resultValue:bool=all(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-any', async (pContext) => {
    await pContext.step('any(bool)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: bool = false;
                let resultValue: bool = any(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:bool=false;` +
            `let resultValue:bool=any(inputValue);` +
            `}`
        );
    });

    await pContext.step('any(Vector2<bool>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<bool> = new Vector2(false, true);
                let resultValue: bool = any(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<bool>=vec2(false,true);` +
            `let resultValue:bool=any(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-frexp', async (pContext) => {
    await pContext.step('frexp(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: f32 = 1.5;
                let resultValue = frexp(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue=frexp(inputValue);` +
            `}`
        );
    });

    await pContext.step('frexp(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue = frexp(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue=frexp(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-modf', async (pContext) => {
    await pContext.step('modf(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: f32 = 1.5;
                let resultValue = modf(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue=modf(inputValue);` +
            `}`
        );
    });

    await pContext.step('modf(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue = modf(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue=modf(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-select', async (pContext) => {
    await pContext.step('select(numeric, numeric, bool)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let condition: bool = true;
                let valueA: ${PgslNumericType.typeName.float32} = 1.5;
                let valueB: ${PgslNumericType.typeName.float32} = 2.0;
                let resultValue: ${PgslNumericType.typeName.float32} = select(valueB, valueA, condition);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let condition:bool=true;` +
            `let valueA:f32=1.5;` +
            `let valueB:f32=2.0;` +
            `let resultValue:f32=select(valueB,valueA,condition);` +
            `}`
        );
    });

    await pContext.step('select(Vector<numeric>, Vector<numeric>, Vector<bool>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let condition: Vector2<bool> = new Vector2(true, false);
                let valueA: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let valueB: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(2.5, 3.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = select(valueB, valueA, condition);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let condition:vec2<bool>=vec2(true,false);` +
            `let valueA:vec2<f32>=vec2(1.5,2.0);` +
            `let valueB:vec2<f32>=vec2(2.5,3.0);` +
            `let resultValue:vec2<f32>=select(valueB,valueA,condition);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-arrayLength', async (pContext) => {
    await pContext.step('arrayLength(Pointer<Array>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let arrayValue: Array<${PgslNumericType.typeName.float32}, 2> = new Array(1.0, 2.0);
                let arrayLength: ${PgslNumericType.typeName.signedInteger} = arrayLength(&arrayValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let arrayValue:array<f32,2>=array(1.0,2.0);` +
            `let arrayLength:i32=arrayLength(&arrayValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-dpdx', async (pContext) => {
    await pContext.step('dpdx(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = dpdx(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=dpdx(inputValue);` +
            `}`
        );
    });

    await pContext.step('dpdx(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = dpdx(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=dpdx(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-dpdxCoarse', async (pContext) => {
    await pContext.step('dpdxCoarse(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = dpdxCoarse(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=dpdxCoarse(inputValue);` +
            `}`
        );
    });

    await pContext.step('dpdxCoarse(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = dpdxCoarse(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=dpdxCoarse(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-dpdxFine', async (pContext) => {
    await pContext.step('dpdxFine(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = dpdxFine(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=dpdxFine(inputValue);` +
            `}`
        );
    });

    await pContext.step('dpdxFine(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = dpdxFine(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=dpdxFine(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-dpdy', async (pContext) => {
    await pContext.step('dpdy(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = dpdy(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=dpdy(inputValue);` +
            `}`
        );
    });

    await pContext.step('dpdy(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = dpdy(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=dpdy(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-dpdyCoarse', async (pContext) => {
    await pContext.step('dpdyCoarse(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = dpdyCoarse(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=dpdyCoarse(inputValue);` +
            `}`
        );
    });

    await pContext.step('dpdyCoarse(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = dpdyCoarse(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=dpdyCoarse(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-dpdyFine', async (pContext) => {
    await pContext.step('dpdyFine(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = dpdyFine(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=dpdyFine(inputValue);` +
            `}`
        );
    });

    await pContext.step('dpdyFine(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = dpdyFine(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=dpdyFine(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-fwidth', async (pContext) => {
    await pContext.step('fwidth(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = fwidth(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=fwidth(inputValue);` +
            `}`
        );
    });

    await pContext.step('fwidth(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = fwidth(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=fwidth(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-fwidthCoarse', async (pContext) => {
    await pContext.step('fwidthCoarse(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = fwidthCoarse(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=fwidthCoarse(inputValue);` +
            `}`
        );
    });

    await pContext.step('fwidthCoarse(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = fwidthCoarse(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=fwidthCoarse(inputValue);` +
            `}`
        );
    });
});

Deno.test('PgslNumericBuildInFunction-fwidthFine', async (pContext) => {
    await pContext.step('fwidthFine(numeric)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let resultValue: ${PgslNumericType.typeName.float32} = fwidthFine(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:f32=1.5;` +
            `let resultValue:f32=fwidthFine(inputValue);` +
            `}`
        );
    });

    await pContext.step('fwidthFine(Vector<numeric>)', async () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: Vector2<${PgslNumericType.typeName.float32}> = new Vector2(1.5, 2.0);
                let resultValue: Vector2<${PgslNumericType.typeName.float32}> = fwidthFine(inputValue);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation.
        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `let resultValue:vec2<f32>=fwidthFine(inputValue);` +
            `}`
        );
    });
});