import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../../source/abstract_syntax_tree/type/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../../../source/abstract_syntax_tree/type/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslTextureBuildInFunction.textureDimensions', async (pContext) => {
    await pContext.step('texture_1d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let dimensions: ${PgslNumericType.typeName.unsignedInteger} = textureDimensions(testTexture);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
            `fn testFunction(){` +
            `let dimensions:u32=textureDimensions(testTexture);` +
            `}`
        );
    });

    await pContext.step('texture_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let dimensions: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.unsignedInteger}> = textureDimensions(testTexture);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `fn testFunction(){` +
            `let dimensions:vec2<u32>=textureDimensions(testTexture);` +
            `}`
        );
    });

    await pContext.step('texture_3d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let dimensions: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.unsignedInteger}> = textureDimensions(testTexture);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
            `fn testFunction(){` +
            `let dimensions:vec3<u32>=textureDimensions(testTexture);` +
            `}`
        );
    });

    await pContext.step('texture_1d with level', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                let dimensions: ${PgslNumericType.typeName.unsignedInteger} = textureDimensions(testTexture, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
            `fn testFunction(){` +
            `let lLevel:i32=0;` +
            `let dimensions:u32=textureDimensions(testTexture,lLevel);` +
            `}`
        );
    });

    await pContext.step('texture_2d with level', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                let dimensions: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.unsignedInteger}> = textureDimensions(testTexture, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `fn testFunction(){` +
            `let lLevel:i32=0;` +
            `let dimensions:vec2<u32>=textureDimensions(testTexture,lLevel);` +
            `}`
        );
    });

    await pContext.step('texture_3d with level', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                let dimensions: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.unsignedInteger}> = textureDimensions(testTexture, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
            `fn testFunction(){` +
            `let lLevel:i32=0;` +
            `let dimensions:vec3<u32>=textureDimensions(testTexture,lLevel);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureGather', async (pContext) => {
    await pContext.step('texture_2d<f32> - component 0', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGather(0, testTexture, testSampler, coords);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let result:vec4<f32>=textureGather(0,testTexture,testSampler,coords);` +
            `}`
        );
    });

    await pContext.step('texture_2d_array<f32> - with array index', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let lArrayIndex: ${PgslNumericType.typeName.signedInteger} = 1;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGather(0, testTexture, testSampler, coords, lArrayIndex);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d_array<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let lArrayIndex:i32=1;` +
            `let result:vec4<f32>=textureGather(0,testTexture,testSampler,coords,lArrayIndex);` +
            `}`
        );
    });

    await pContext.step('texture_cube<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGather(0, testTexture, testSampler, coords);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_cube<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let result:vec4<f32>=textureGather(0,testTexture,testSampler,coords);` +
            `}`
        );
    });

    await pContext.step('texture_depth_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2d};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGather(testTexture, testSampler, coords);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let result:vec4<f32>=textureGather(testTexture,testSampler,coords);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureGatherCompare', async (pContext) => {
    await pContext.step('texture_depth_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2d};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGatherCompare(testTexture, testSampler, coords, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let depthRef:f32=0.5;` +
            `let result:vec4<f32>=textureGatherCompare(testTexture,testSampler,coords,depthRef);` +
            `}`
        );
    });

    await pContext.step('texture_depth_2d_array', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2dArray};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let lArrayIndex: ${PgslNumericType.typeName.signedInteger} = 1;
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGatherCompare(testTexture, testSampler, coords, lArrayIndex, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d_array;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let lArrayIndex:i32=1;` +
            `let depthRef:f32=0.5;` +
            `let result:vec4<f32>=textureGatherCompare(testTexture,testSampler,coords,lArrayIndex,depthRef);` +
            `}`
        );
    });

    await pContext.step('texture_depth_cube', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepthCube};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGatherCompare(testTexture, testSampler, coords, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_cube;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let depthRef:f32=0.5;` +
            `let result:vec4<f32>=textureGatherCompare(testTexture,testSampler,coords,depthRef);` +
            `}`
        );
    });

    await pContext.step('texture_depth_cube_array', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepthCubeArray};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let lArrayIndex: ${PgslNumericType.typeName.signedInteger} = 1;
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGatherCompare(testTexture, testSampler, coords, lArrayIndex, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_cube_array;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let lArrayIndex:i32=1;` +
            `let depthRef:f32=0.5;` +
            `let result:vec4<f32>=textureGatherCompare(testTexture,testSampler,coords,lArrayIndex,depthRef);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureLoad', async (pContext) => {
    await pContext.step('texture_1d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let coords: ${PgslNumericType.typeName.signedInteger} = 0;
                let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureLoad(testTexture, coords, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
            `fn testFunction(){` +
            `let coords:i32=0;` +
            `let lLevel:i32=0;` +
            `let result:vec4<f32>=textureLoad(testTexture,coords,lLevel);` +
            `}`
        );
    });

    await pContext.step('texture_2d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(0, 0);
                let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureLoad(testTexture, coords, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `fn testFunction(){` +
            `let coords:vec2<i32>=vec2(0,0);` +
            `let lLevel:i32=0;` +
            `let result:vec4<f32>=textureLoad(testTexture,coords,lLevel);` +
            `}`
        );
    });

    await pContext.step('texture_3d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(0, 0, 0);
                let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureLoad(testTexture, coords, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
            `fn testFunction(){` +
            `let coords:vec3<i32>=vec3(0,0,0);` +
            `let lLevel:i32=0;` +
            `let result:vec4<f32>=textureLoad(testTexture,coords,lLevel);` +
            `}`
        );
    });

    await pContext.step('texture_depth_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2d};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(0, 0);
                let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                let result: ${PgslNumericType.typeName.float32} = textureLoad(testTexture, coords, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
            `fn testFunction(){` +
            `let coords:vec2<i32>=vec2(0,0);` +
            `let lLevel:i32=0;` +
            `let result:f32=textureLoad(testTexture,coords,lLevel);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureNumLayers', async (pContext) => {
    await pContext.step('texture_2d_array', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let result: ${PgslNumericType.typeName.unsignedInteger} = textureNumLayers(testTexture);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d_array<f32>;` +
            `fn testFunction(){` +
            `let result:u32=textureNumLayers(testTexture);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureNumLevels', async (pContext) => {
    await pContext.step('texture_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let result: ${PgslNumericType.typeName.unsignedInteger} = textureNumLevels(testTexture);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `fn testFunction(){` +
            `let result:u32=textureNumLevels(testTexture);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureNumSamples', async (pContext) => {
    await pContext.step('texture_multisampled_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureMultisampled2d}<${PgslNumericType.typeName.float32}>;

            function testFunction(): void {
                let result: ${PgslNumericType.typeName.unsignedInteger} = textureNumSamples(testTexture);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_multisampled_2d<f32>;` +
            `fn testFunction(){` +
            `let result:u32=textureNumSamples(testTexture);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureSample', async (pContext) => {
    await pContext.step('texture_1d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSample(testTexture, testSampler, coords);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:f32=0.5;` +
            `let result:vec4<f32>=textureSample(testTexture,testSampler,coords);` +
            `}`
        );
    });

    await pContext.step('texture_2d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSample(testTexture, testSampler, coords);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let result:vec4<f32>=textureSample(testTexture,testSampler,coords);` +
            `}`
        );
    });

    await pContext.step('texture_3d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSample(testTexture, testSampler, coords);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let result:vec4<f32>=textureSample(testTexture,testSampler,coords);` +
            `}`
        );
    });

    await pContext.step('texture_depth_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2d};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let result: ${PgslNumericType.typeName.float32} = textureSample(testTexture, testSampler, coords);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let result:f32=textureSample(testTexture,testSampler,coords);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureSampleBias', async (pContext) => {
    await pContext.step('texture_2d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let lBias: ${PgslNumericType.typeName.float32} = 1.0;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleBias(testTexture, testSampler, coords, lBias);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let lBias:f32=1.0;` +
            `let result:vec4<f32>=textureSampleBias(testTexture,testSampler,coords,lBias);` +
            `}`
        );
    });

    await pContext.step('texture_3d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let lBias: ${PgslNumericType.typeName.float32} = 1.0;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleBias(testTexture, testSampler, coords, lBias);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let lBias:f32=1.0;` +
            `let result:vec4<f32>=textureSampleBias(testTexture,testSampler,coords,lBias);` +
            `}`
        );
    });

    await pContext.step('texture_cube<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let lBias: ${PgslNumericType.typeName.float32} = 1.0;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleBias(testTexture, testSampler, coords, lBias);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_cube<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let lBias:f32=1.0;` +
            `let result:vec4<f32>=textureSampleBias(testTexture,testSampler,coords,lBias);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureSampleCompare', async (pContext) => {
    await pContext.step('texture_depth_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2d};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslNumericType.typeName.float32} = textureSampleCompare(testTexture, testSampler, coords, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let depthRef:f32=0.5;` +
            `let result:f32=textureSampleCompare(testTexture,testSampler,coords,depthRef);` +
            `}`
        );
    });

    await pContext.step('texture_depth_2d_array', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2dArray};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let lArrayIndex: ${PgslNumericType.typeName.signedInteger} = 1;
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslNumericType.typeName.float32} = textureSampleCompare(testTexture, testSampler, coords, lArrayIndex, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d_array;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let lArrayIndex:i32=1;` +
            `let depthRef:f32=0.5;` +
            `let result:f32=textureSampleCompare(testTexture,testSampler,coords,lArrayIndex,depthRef);` +
            `}`
        );
    });

    await pContext.step('texture_depth_cube', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepthCube};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslNumericType.typeName.float32} = textureSampleCompare(testTexture, testSampler, coords, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_cube;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let depthRef:f32=0.5;` +
            `let result:f32=textureSampleCompare(testTexture,testSampler,coords,depthRef);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureSampleCompareLevel', async (pContext) => {
    await pContext.step('texture_depth_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2d};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslNumericType.typeName.float32} = textureSampleCompareLevel(testTexture, testSampler, coords, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let depthRef:f32=0.5;` +
            `let result:f32=textureSampleCompareLevel(testTexture,testSampler,coords,depthRef);` +
            `}`
        );
    });

    await pContext.step('texture_depth_2d_array', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2dArray};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let lArrayIndex: ${PgslNumericType.typeName.signedInteger} = 1;
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslNumericType.typeName.float32} = textureSampleCompareLevel(testTexture, testSampler, coords, lArrayIndex, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d_array;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let lArrayIndex:i32=1;` +
            `let depthRef:f32=0.5;` +
            `let result:f32=textureSampleCompareLevel(testTexture,testSampler,coords,lArrayIndex,depthRef);` +
            `}`
        );
    });

    await pContext.step('texture_depth_cube', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepthCube};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.samplerComparison};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let depthRef: ${PgslNumericType.typeName.float32} = 0.5;
                let result: ${PgslNumericType.typeName.float32} = textureSampleCompareLevel(testTexture, testSampler, coords, depthRef);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_cube;` +
            `@group(0)@binding(1)var testSampler:sampler_comparison;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let depthRef:f32=0.5;` +
            `let result:f32=textureSampleCompareLevel(testTexture,testSampler,coords,depthRef);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureSampleGrad', async (pContext) => {
    await pContext.step('texture_2d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let ddx: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.1, 0.1);
                let ddy: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.1, 0.1);
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleGrad(testTexture, testSampler, coords, ddx, ddy);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let ddx:vec2<f32>=vec2(0.1,0.1);` +
            `let ddy:vec2<f32>=vec2(0.1,0.1);` +
            `let result:vec4<f32>=textureSampleGrad(testTexture,testSampler,coords,ddx,ddy);` +
            `}`
        );
    });

    await pContext.step('texture_3d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let ddx: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.1, 0.1, 0.1);
                let ddy: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.1, 0.1, 0.1);
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleGrad(testTexture, testSampler, coords, ddx, ddy);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let ddx:vec3<f32>=vec3(0.1,0.1,0.1);` +
            `let ddy:vec3<f32>=vec3(0.1,0.1,0.1);` +
            `let result:vec4<f32>=textureSampleGrad(testTexture,testSampler,coords,ddx,ddy);` +
            `}`
        );
    });

    await pContext.step('texture_cube<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureCube}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let ddx: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.1, 0.1, 0.1);
                let ddy: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.1, 0.1, 0.1);
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleGrad(testTexture, testSampler, coords, ddx, ddy);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_cube<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let ddx:vec3<f32>=vec3(0.1,0.1,0.1);` +
            `let ddy:vec3<f32>=vec3(0.1,0.1,0.1);` +
            `let result:vec4<f32>=textureSampleGrad(testTexture,testSampler,coords,ddx,ddy);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureSampleLevel', async (pContext) => {
    await pContext.step('texture_1d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslNumericType.typeName.float32} = 0.5;
                let lLevel: ${PgslNumericType.typeName.float32} = 0.0;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleLevel(testTexture, testSampler, coords, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:f32=0.5;` +
            `let lLevel:f32=0.0;` +
            `let result:vec4<f32>=textureSampleLevel(testTexture,testSampler,coords,lLevel);` +
            `}`
        );
    });

    await pContext.step('texture_2d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let lLevel: ${PgslNumericType.typeName.float32} = 0.0;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleLevel(testTexture, testSampler, coords, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let lLevel:f32=0.0;` +
            `let result:vec4<f32>=textureSampleLevel(testTexture,testSampler,coords,lLevel);` +
            `}`
        );
    });

    await pContext.step('texture_3d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(0.5, 0.5, 0.5);
                let lLevel: ${PgslNumericType.typeName.float32} = 0.0;
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleLevel(testTexture, testSampler, coords, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
            `let lLevel:f32=0.0;` +
            `let result:vec4<f32>=textureSampleLevel(testTexture,testSampler,coords,lLevel);` +
            `}`
        );
    });

    await pContext.step('texture_depth_2d', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.textureDepth2d};

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                let result: ${PgslNumericType.typeName.float32} = textureSampleLevel(testTexture, testSampler, coords, lLevel);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let lLevel:i32=0;` +
            `let result:f32=textureSampleLevel(testTexture,testSampler,coords,lLevel);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureSampleBaseClampToEdge', async (pContext) => {
    await pContext.step('texture_2d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding2")]
            uniform testSampler: ${PgslSamplerType.typeName.sampler};

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSampleBaseClampToEdge(testTexture, testSampler, coords);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toBe(
            `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
            `@group(0)@binding(1)var testSampler:sampler;` +
            `fn testFunction(){` +
            `let coords:vec2<f32>=vec2(0.5,0.5);` +
            `let result:vec4<f32>=textureSampleBaseClampToEdge(testTexture,testSampler,coords);` +
            `}`
        );
    });
});

Deno.test('PgslTextureBuildInFunction.textureStore', async (pContext) => {
    await pContext.step('texture_storage_1d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            storage testTexture: ${PgslTextureType.typeName.textureStorage1d}<TexelFormat.Rgba8unorm, AccessMode.ReadWrite>;

            function testFunction(): void {
                let coords: ${PgslNumericType.typeName.signedInteger} = 0;
                let value: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 1.0, 1.0, 1.0);
                textureStore(testTexture, coords, value);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toContain(`textureStore(testTexture,coords,value)`);
    });

    await pContext.step('texture_storage_2d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            storage testTexture: ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, AccessMode.ReadWrite>;

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(0, 0);
                let value: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 1.0, 1.0, 1.0);
                textureStore(testTexture, coords, value);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toContain(`textureStore(testTexture,coords,value)`);
    });

    await pContext.step('texture_storage_2d_array<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            storage testTexture: ${PgslTextureType.typeName.textureStorage2dArray}<TexelFormat.Rgba8unorm, AccessMode.ReadWrite>;

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(0, 0);
                let lArrayIndex: ${PgslNumericType.typeName.signedInteger} = 0;
                let value: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 1.0, 1.0, 1.0);
                textureStore(testTexture, coords, lArrayIndex, value);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toContain(`textureStore(testTexture,coords,lArrayIndex,value)`);
    });

    await pContext.step('texture_storage_3d<f32>', async () => {
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            storage testTexture: ${PgslTextureType.typeName.textureStorage3d}<TexelFormat.Rgba8unorm, AccessMode.ReadWrite>;

            function testFunction(): void {
                let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(0, 0, 0);
                let value: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 1.0, 1.0, 1.0);
                textureStore(testTexture, coords, value);
            }
        `;

        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        expect(lTranspilationResult.incidents).toHaveLength(0);
        expect(lTranspilationResult.source).toContain(`textureStore(testTexture,coords,value)`);
    });
});


