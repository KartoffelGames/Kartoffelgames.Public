import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslTextureFunctionFeatureSetProcessor - Transpilation', async (pContext) => {
    await pContext.step('textureDimensions', async (pContext) => {
        await pContext.step('texture_1d', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let dimensions: ${PgslNumericType.typeName.unsignedInteger} = textureDimensions(testTexture);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
                `fn testFunction(){` +
                `var dimensions:u32=textureDimensions(testTexture);` +
                `}`
            );
        });

        await pContext.step('texture_2d', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let dimensions: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.unsignedInteger}> = textureDimensions(testTexture);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `fn testFunction(){` +
                `var dimensions:vec2<u32>=textureDimensions(testTexture);` +
                `}`
            );
        });

        await pContext.step('texture_3d', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let dimensions: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.unsignedInteger}> = textureDimensions(testTexture);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
                `fn testFunction(){` +
                `var dimensions:vec3<u32>=textureDimensions(testTexture);` +
                `}`
            );
        });

        await pContext.step('texture_1d with level', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                    let dimensions: ${PgslNumericType.typeName.unsignedInteger} = textureDimensions(testTexture, lLevel);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
                `fn testFunction(){` +
                `var lLevel:i32=0;` +
                `var dimensions:u32=textureDimensions(testTexture,lLevel);` +
                `}`
            );
        });

        await pContext.step('texture_2d with level', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                    let dimensions: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.unsignedInteger}> = textureDimensions(testTexture, lLevel);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `fn testFunction(){` +
                `var lLevel:i32=0;` +
                `var dimensions:vec2<u32>=textureDimensions(testTexture,lLevel);` +
                `}`
            );
        });

        await pContext.step('texture_3d with level', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                    let dimensions: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.unsignedInteger}> = textureDimensions(testTexture, lLevel);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
                `fn testFunction(){` +
                `var lLevel:i32=0;` +
                `var dimensions:vec3<u32>=textureDimensions(testTexture,lLevel);` +
                `}`
            );
        });
    });

    await pContext.step('textureGather', async (pContext) => {
        await pContext.step('texture_2d<f32> - component 0', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var result:vec4<f32>=textureGather(0,testTexture,testSampler,coords);` +
                `}`
            );
        });

        await pContext.step('texture_2d_array<f32> - with array index', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d_array<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var lArrayIndex:i32=1;` +
                `var result:vec4<f32>=textureGather(0,testTexture,testSampler,coords,lArrayIndex);` +
                `}`
            );
        });

        await pContext.step('texture_cube<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_cube<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var result:vec4<f32>=textureGather(0,testTexture,testSampler,coords);` +
                `}`
            );
        });

        await pContext.step('texture_depth_2d', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var result:vec4<f32>=textureGather(testTexture,testSampler,coords);` +
                `}`
            );
        });
    });

    await pContext.step('textureGatherCompare', async (pContext) => {
        await pContext.step('texture_depth_2d', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var depthRef:f32=0.5;` +
                `var result:vec4<f32>=textureGatherCompare(testTexture,testSampler,coords,depthRef);` +
                `}`
            );
        });

        await pContext.step('texture_depth_2d_array', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d_array;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var lArrayIndex:i32=1;` +
                `var depthRef:f32=0.5;` +
                `var result:vec4<f32>=textureGatherCompare(testTexture,testSampler,coords,lArrayIndex,depthRef);` +
                `}`
            );
        });

        await pContext.step('texture_depth_cube', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_cube;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var depthRef:f32=0.5;` +
                `var result:vec4<f32>=textureGatherCompare(testTexture,testSampler,coords,depthRef);` +
                `}`
            );
        });

        await pContext.step('texture_depth_cube_array', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_cube_array;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var lArrayIndex:i32=1;` +
                `var depthRef:f32=0.5;` +
                `var result:vec4<f32>=textureGatherCompare(testTexture,testSampler,coords,lArrayIndex,depthRef);` +
                `}`
            );
        });
    });

    await pContext.step('textureLoad', async (pContext) => {
        await pContext.step('texture_1d<f32>', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture1d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let coords: ${PgslNumericType.typeName.signedInteger} = 0;
                    let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                    let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureLoad(testTexture, coords, lLevel);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
                `fn testFunction(){` +
                `var coords:i32=0;` +
                `var lLevel:i32=0;` +
                `var result:vec4<f32>=textureLoad(testTexture,coords,lLevel);` +
                `}`
            );
        });

        await pContext.step('texture_2d<f32>', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(0, 0);
                    let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                    let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureLoad(testTexture, coords, lLevel);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `fn testFunction(){` +
                `var coords:vec2<i32>=vec2(0,0);` +
                `var lLevel:i32=0;` +
                `var result:vec4<f32>=textureLoad(testTexture,coords,lLevel);` +
                `}`
            );
        });

        await pContext.step('texture_3d<f32>', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture3d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(0, 0, 0);
                    let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                    let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureLoad(testTexture, coords, lLevel);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
                `fn testFunction(){` +
                `var coords:vec3<i32>=vec3(0,0,0);` +
                `var lLevel:i32=0;` +
                `var result:vec4<f32>=textureLoad(testTexture,coords,lLevel);` +
                `}`
            );
        });

        await pContext.step('texture_depth_2d', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.textureDepth2d};

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(0, 0);
                    let lLevel: ${PgslNumericType.typeName.signedInteger} = 0;
                    let result: ${PgslNumericType.typeName.float32} = textureLoad(testTexture, coords, lLevel);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
                `fn testFunction(){` +
                `var coords:vec2<i32>=vec2(0,0);` +
                `var lLevel:i32=0;` +
                `var result:f32=textureLoad(testTexture,coords,lLevel);` +
                `}`
            );
        });
    });

    await pContext.step('textureNumLayers', async (pContext) => {
        await pContext.step('texture_2d_array', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture2dArray}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let result: ${PgslNumericType.typeName.unsignedInteger} = textureNumLayers(testTexture);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d_array<f32>;` +
                `fn testFunction(){` +
                `var result:u32=textureNumLayers(testTexture);` +
                `}`
            );
        });
    });

    await pContext.step('textureNumLevels', async (pContext) => {
        await pContext.step('texture_2d', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let result: ${PgslNumericType.typeName.unsignedInteger} = textureNumLevels(testTexture);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `fn testFunction(){` +
                `var result:u32=textureNumLevels(testTexture);` +
                `}`
            );
        });
    });

    await pContext.step('textureNumSamples', async (pContext) => {
        await pContext.step('texture_multisampled_2d', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testTexture: ${PgslTextureType.typeName.textureMultisampled2d}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let result: ${PgslNumericType.typeName.unsignedInteger} = textureNumSamples(testTexture);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_multisampled_2d<f32>;` +
                `fn testFunction(){` +
                `var result:u32=textureNumSamples(testTexture);` +
                `}`
            );
        });
    });

    await pContext.step('textureSample', async (pContext) => {
        await pContext.step('texture_1d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:f32=0.5;` +
                `var result:vec4<f32>=textureSample(testTexture,testSampler,coords);` +
                `}`
            );
        });

        await pContext.step('texture_2d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var result:vec4<f32>=textureSample(testTexture,testSampler,coords);` +
                `}`
            );
        });

        await pContext.step('texture_3d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var result:vec4<f32>=textureSample(testTexture,testSampler,coords);` +
                `}`
            );
        });

        await pContext.step('texture_depth_2d', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var result:f32=textureSample(testTexture,testSampler,coords);` +
                `}`
            );
        });
    });

    await pContext.step('textureSampleBias', async (pContext) => {
        await pContext.step('texture_2d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var lBias:f32=1.0;` +
                `var result:vec4<f32>=textureSampleBias(testTexture,testSampler,coords,lBias);` +
                `}`
            );
        });

        await pContext.step('texture_3d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var lBias:f32=1.0;` +
                `var result:vec4<f32>=textureSampleBias(testTexture,testSampler,coords,lBias);` +
                `}`
            );
        });

        await pContext.step('texture_cube<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_cube<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var lBias:f32=1.0;` +
                `var result:vec4<f32>=textureSampleBias(testTexture,testSampler,coords,lBias);` +
                `}`
            );
        });
    });

    await pContext.step('textureSampleCompare', async (pContext) => {
        await pContext.step('texture_depth_2d', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var depthRef:f32=0.5;` +
                `var result:f32=textureSampleCompare(testTexture,testSampler,coords,depthRef);` +
                `}`
            );
        });

        await pContext.step('texture_depth_2d_array', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d_array;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var lArrayIndex:i32=1;` +
                `var depthRef:f32=0.5;` +
                `var result:f32=textureSampleCompare(testTexture,testSampler,coords,lArrayIndex,depthRef);` +
                `}`
            );
        });

        await pContext.step('texture_depth_cube', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_cube;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var depthRef:f32=0.5;` +
                `var result:f32=textureSampleCompare(testTexture,testSampler,coords,depthRef);` +
                `}`
            );
        });
    });

    await pContext.step('textureSampleCompareLevel', async (pContext) => {
        await pContext.step('texture_depth_2d', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var depthRef:f32=0.5;` +
                `var result:f32=textureSampleCompareLevel(testTexture,testSampler,coords,depthRef);` +
                `}`
            );
        });

        await pContext.step('texture_depth_2d_array', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d_array;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var lArrayIndex:i32=1;` +
                `var depthRef:f32=0.5;` +
                `var result:f32=textureSampleCompareLevel(testTexture,testSampler,coords,lArrayIndex,depthRef);` +
                `}`
            );
        });

        await pContext.step('texture_depth_cube', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_cube;` +
                `@group(0)@binding(1)var testSampler:sampler_comparison;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var depthRef:f32=0.5;` +
                `var result:f32=textureSampleCompareLevel(testTexture,testSampler,coords,depthRef);` +
                `}`
            );
        });
    });

    await pContext.step('textureSampleGrad', async (pContext) => {
        await pContext.step('texture_2d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var ddx:vec2<f32>=vec2(0.1,0.1);` +
                `var ddy:vec2<f32>=vec2(0.1,0.1);` +
                `var result:vec4<f32>=textureSampleGrad(testTexture,testSampler,coords,ddx,ddy);` +
                `}`
            );
        });

        await pContext.step('texture_3d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var ddx:vec3<f32>=vec3(0.1,0.1,0.1);` +
                `var ddy:vec3<f32>=vec3(0.1,0.1,0.1);` +
                `var result:vec4<f32>=textureSampleGrad(testTexture,testSampler,coords,ddx,ddy);` +
                `}`
            );
        });

        await pContext.step('texture_cube<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_cube<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var ddx:vec3<f32>=vec3(0.1,0.1,0.1);` +
                `var ddy:vec3<f32>=vec3(0.1,0.1,0.1);` +
                `var result:vec4<f32>=textureSampleGrad(testTexture,testSampler,coords,ddx,ddy);` +
                `}`
            );
        });
    });

    await pContext.step('textureSampleLevel', async (pContext) => {
        await pContext.step('texture_1d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_1d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:f32=0.5;` +
                `var lLevel:f32=0.0;` +
                `var result:vec4<f32>=textureSampleLevel(testTexture,testSampler,coords,lLevel);` +
                `}`
            );
        });

        await pContext.step('texture_2d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var lLevel:f32=0.0;` +
                `var result:vec4<f32>=textureSampleLevel(testTexture,testSampler,coords,lLevel);` +
                `}`
            );
        });

        await pContext.step('texture_3d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_3d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec3<f32>=vec3(0.5,0.5,0.5);` +
                `var lLevel:f32=0.0;` +
                `var result:vec4<f32>=textureSampleLevel(testTexture,testSampler,coords,lLevel);` +
                `}`
            );
        });

        await pContext.step('texture_depth_2d', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_depth_2d;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var lLevel:i32=0;` +
                `var result:f32=textureSampleLevel(testTexture,testSampler,coords,lLevel);` +
                `}`
            );
        });
    });

    await pContext.step('textureSampleBaseClampToEdge', async (pContext) => {
        await pContext.step('texture_2d<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var testTexture:texture_2d<f32>;` +
                `@group(0)@binding(1)var testSampler:sampler;` +
                `fn testFunction(){` +
                `var coords:vec2<f32>=vec2(0.5,0.5);` +
                `var result:vec4<f32>=textureSampleBaseClampToEdge(testTexture,testSampler,coords);` +
                `}`
            );
        });
    });

    await pContext.step('textureStore', async (pContext) => {
        await pContext.step('texture_storage_1d<f32>', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testTexture: ${PgslTextureType.typeName.textureStorage1d}<TexelFormat.Rgba8unorm, AccessMode.ReadWrite>;

                function testFunction(): void {
                    let coords: ${PgslNumericType.typeName.signedInteger} = 0;
                    let value: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 1.0, 1.0, 1.0);
                    textureStore(testTexture, coords, value);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toContain(`textureStore(testTexture,coords,value)`);
        });

        await pContext.step('texture_storage_2d<f32>', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testTexture: ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, AccessMode.ReadWrite>;

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(0, 0);
                    let value: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 1.0, 1.0, 1.0);
                    textureStore(testTexture, coords, value);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toContain(`textureStore(testTexture,coords,value)`);
        });

        await pContext.step('texture_storage_2d_array<f32>', async () => {
            // Setup.
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

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toContain(`textureStore(testTexture,coords,lArrayIndex,value)`);
        });

        await pContext.step('texture_storage_3d<f32>', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testTexture: ${PgslTextureType.typeName.textureStorage3d}<TexelFormat.Rgba8unorm, AccessMode.ReadWrite>;

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(0, 0, 0);
                    let value: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 1.0, 1.0, 1.0);
                    textureStore(testTexture, coords, value);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toContain(`textureStore(testTexture,coords,value)`);
        });
    });
});

Deno.test('PgslTextureFunctionFeatureSetProcessor - Validation', async (pContext) => {
    await pContext.step('Constant offset', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_texture")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_sampler")]
                uniform testSampler: ${PgslSamplerType.typeName.sampler};

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                    let offset: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(1i, 1i);
                    let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSample(testTexture, testSampler, coords, offset);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constant offset.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Offset of textureSample must be a constant.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_texture")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_sampler")]
                uniform testSampler: ${PgslSamplerType.typeName.sampler};

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                    let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureSample(testTexture, testSampler, coords, new ${PgslVectorType.typeName.vector2}(1i, 1i));
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant textureGather component', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_texture")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_sampler")]
                uniform testSampler: ${PgslSamplerType.typeName.sampler};

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                    let component: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGather(component, testTexture, testSampler, coords);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constant component.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Component of textureGather must be a constant.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_texture")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_sampler")]
                uniform testSampler: ${PgslSamplerType.typeName.sampler};

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                    let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGather(1, testTexture, testSampler, coords);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('textureGather component range', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_texture")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_sampler")]
                uniform testSampler: ${PgslSamplerType.typeName.sampler};

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                    let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGather(4, testTexture, testSampler, coords);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the component range.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Component of textureGather must be between 0 and 3.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_texture")]
                uniform testTexture: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_sampler")]
                uniform testSampler: ${PgslSamplerType.typeName.sampler};

                function testFunction(): void {
                    let coords: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0.5, 0.5);
                    let result: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = textureGather(3, testTexture, testSampler, coords);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
