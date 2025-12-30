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