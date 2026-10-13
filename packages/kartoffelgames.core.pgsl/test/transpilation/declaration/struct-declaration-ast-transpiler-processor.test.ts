import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslBuildInType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-build-in-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('StructDeclarationAst - Transpilation', async (pContext) => {
    await pContext.step('Types', async (pContext) => {
        await pContext.step('Numeric property', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'testProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(`struct ${lStructName}{${lPropertyName}:f32}`);
        });

        await pContext.step('Vector property', () => {
            // Setup.
            const lStructName: string = 'TestVectorStruct';
            const lVec3PropertyName: string = 'vec3Property';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lVec3PropertyName}: Vector3<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(`struct ${lStructName}{${lVec3PropertyName}:vec3<f32>}`);
        });

        await pContext.step('Array property', () => {
            // Setup.
            const lStructName: string = 'TestArrayStruct';
            const lArrayPropertyName: string = 'arrayProperty';
            const lArraySize: number = 10;
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lArrayPropertyName}: Array<${PgslNumericType.typeName.float32}, ${lArraySize}>
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `${lArrayPropertyName}:array<f32,${lArraySize}>` +
                `}`
            );
        });

        await pContext.step('Struct property', () => {
            // Setup.
            const lInnerStructName: string = 'TestInnerStruct';
            const lOuterStructName: string = 'TestOuterStruct';
            const lInnerPropertyName: string = 'innerProperty';
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct ${lInnerStructName} {
                    ${lInnerPropertyName}: ${PgslNumericType.typeName.float32}
                }
                struct ${lOuterStructName} {
                    ${lNestedPropertyName}: ${lInnerStructName}
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lInnerStructName}{` +
                `${lInnerPropertyName}:f32` +
                `}` +

                `struct ${lOuterStructName}{` +
                `${lNestedPropertyName}:${lInnerStructName}` +
                `}`
            );
        });

        await pContext.step('Alias property', () => {
            // Setup.
            const lStructName: string = 'TestStructAlias';
            const lPropertyName: string = 'testProperty';
            const lCodeText: string = `
                alias TestAlias = ${PgslNumericType.typeName.float32};
                struct ${lStructName} {
                    ${lPropertyName}: TestAlias
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses alias resolved type.
            expect(lTranspilationResult.source).toBe(`struct ${lStructName}{${lPropertyName}:f32}`);
        });

        await pContext.step('BuildIn', async (pContext) => {
            await pContext.step('VertexIndex', () => {
                // Setup.
                const lStructName: string = 'TestVertexIndexStruct';
                const lPropertyName: string = 'vertexIndexProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.vertexIndex}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(vertex_index)${lPropertyName}:u32}`);
            });

            await pContext.step('InstanceIndex', () => {
                // Setup.
                const lStructName: string = 'TestInstanceIndexStruct';
                const lPropertyName: string = 'instanceIndexProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.instanceIndex}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(instance_index)${lPropertyName}:u32}`);
            });

            await pContext.step('Position', () => {
                // Setup.
                const lStructName: string = 'TestPositionStruct';
                const lPropertyName: string = 'positionProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.position}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(position)${lPropertyName}:vec4<f32>}`);
            });

            await pContext.step('FrontFacing', () => {
                // Setup.
                const lStructName: string = 'TestFrontFacingStruct';
                const lPropertyName: string = 'frontFacingProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.frontFacing}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(front_facing)${lPropertyName}:bool}`);
            });

            await pContext.step('FragDepth', () => {
                // Setup.
                const lStructName: string = 'TestFragDepthStruct';
                const lPropertyName: string = 'fragDepthProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.fragDepth}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(frag_depth)${lPropertyName}:f32}`);
            });

            await pContext.step('SampleIndex', () => {
                // Setup.
                const lStructName: string = 'TestSampleIndexStruct';
                const lPropertyName: string = 'sampleIndexProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.sampleIndex}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(sample_index)${lPropertyName}:u32}`);
            });

            await pContext.step('SampleMask', () => {
                // Setup.
                const lStructName: string = 'TestSampleMaskStruct';
                const lPropertyName: string = 'sampleMaskProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.sampleMask}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(sample_mask)${lPropertyName}:u32}`);
            });

            await pContext.step('LocalInvocationId', () => {
                // Setup.
                const lStructName: string = 'TestLocalInvocationIdStruct';
                const lPropertyName: string = 'localInvocationIdProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.localInvocationId}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(local_invocation_id)${lPropertyName}:u32}`);
            });

            await pContext.step('LocalInvocationIndex', () => {
                // Setup.
                const lStructName: string = 'TestLocalInvocationIndexStruct';
                const lPropertyName: string = 'localInvocationIndexProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.localInvocationIndex}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(local_invocation_index)${lPropertyName}:u32}`);
            });

            await pContext.step('GlobalInvocationId', () => {
                // Setup.
                const lStructName: string = 'TestGlobalInvocationIdStruct';
                const lPropertyName: string = 'globalInvocationIdProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.globalInvocationId}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(global_invocation_id)${lPropertyName}:vec3<u32>}`);
            });

            await pContext.step('WorkgroupId', () => {
                // Setup.
                const lStructName: string = 'TestWorkgroupIdStruct';
                const lPropertyName: string = 'workgroupIdProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.workgroupId}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(workgroup_id)${lPropertyName}:vec3<u32>}`);
            });

            await pContext.step('NumWorkgroups', () => {
                // Setup.
                const lStructName: string = 'TestNumWorkgroupsStruct';
                const lPropertyName: string = 'numWorkgroupsProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.numWorkgroups}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(`struct ${lStructName}{@builtin(num_workgroups)${lPropertyName}:vec3<u32>}`);
            });

            await pContext.step('ClipDistances', () => {
                // Setup.
                const lStructName: string = 'TestClipDistancesStruct';
                const lPropertyName: string = 'clipDistancesProperty';
                const lArraySize: number = 5;
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.clipDistances}<${lArraySize}>
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(
                    `enable clip_distances;` +
                    `struct ${lStructName}{` +
                    `@builtin(clip_distances)${lPropertyName}:array<f32,${lArraySize}>` +
                    `}`
                );
            });

            await pContext.step('PrimitiveIndex', () => {
                // Setup.
                const lStructName: string = 'TestPrimitiveIndexStruct';
                const lPropertyName: string = 'primitiveIndexProperty';
                const lCodeText: string = `
                    struct ${lStructName} {
                        ${lPropertyName}: ${PgslBuildInType.typeName.primitiveIndex}
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Transpiled output.
                expect(lTranspilationResult.source).toBe(
                    `enable primitive_index;` +
                    `struct ${lStructName}{` +
                    `@builtin(primitive_index)${lPropertyName}:u32` +
                    `}`
                );
            });
        });
    });

    await pContext.step('Dynamic length', async (pContext) => {
        await pContext.step('Single dynamic Array property', () => {
            // Setup.
            const lStructName: string = 'TestDynamicStruct';
            const lDynamicPropertyName: string = 'dynamicProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lDynamicPropertyName}: Array<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `${lDynamicPropertyName}:array<f32>` +
                `}`
            );
        });

        await pContext.step('Last property as dynamic array', () => {
            // Setup.
            const lStructName: string = 'TestMixedStruct';
            const lRegularPropertyName: string = 'regularProperty';
            const lDynamicPropertyName: string = 'dynamicProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lRegularPropertyName}: ${PgslNumericType.typeName.float32},
                    ${lDynamicPropertyName}: Array<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `${lRegularPropertyName}:f32,` +
                `${lDynamicPropertyName}:array<f32>` +
                `}`
            );
        });

        await pContext.step('Valid dynamic array inside nested struct', () => {
            // Setup.
            const lInnerStructName: string = 'TestInnerStruct';
            const lOuterStructName: string = 'TestOuterStruct';
            const lDynamicPropertyName: string = 'dynamicProperty';
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct ${lInnerStructName} {
                    ${lDynamicPropertyName}: Array<${PgslNumericType.typeName.float32}>
                }
                struct ${lOuterStructName} {
                    ${lNestedPropertyName}: ${lInnerStructName}
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lInnerStructName}{` +
                `${lDynamicPropertyName}:array<f32>` +
                `}` +

                `struct ${lOuterStructName}{` +
                `${lNestedPropertyName}:${lInnerStructName}` +
                `}`
            );
        });
    });

    await pContext.step('Nested Structs', async (pContext) => {
        await pContext.step('Two level', () => {
            // Setup.
            const lInnerStructName: string = 'TestInnerStruct';
            const lOuterStructName: string = 'TestOuterStruct';
            const lInnerPropertyName: string = 'innerProperty';
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct ${lInnerStructName} {
                    ${lInnerPropertyName}: ${PgslNumericType.typeName.float32}
                }
                struct ${lOuterStructName} {
                    ${lNestedPropertyName}: ${lInnerStructName}
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lInnerStructName}{` +
                `${lInnerPropertyName}:f32` +
                `}` +

                `struct ${lOuterStructName}{` +
                `${lNestedPropertyName}:${lInnerStructName}` +
                `}`
            );
        });

        await pContext.step('Three level', () => {
            // Setup.
            const lFirstStructName: string = 'TestFirstStruct';
            const lSecondStructName: string = 'TestSecondStruct';
            const lThirdStructName: string = 'TestThirdStruct';
            const lFirstPropertyName: string = 'firstProperty';
            const lSecondPropertyName: string = 'secondProperty';
            const lThirdPropertyName: string = 'thirdProperty';
            const lCodeText: string = `
                struct ${lFirstStructName} {
                    ${lFirstPropertyName}: ${PgslNumericType.typeName.float32}
                }
                struct ${lSecondStructName} {
                    ${lSecondPropertyName}: ${lFirstStructName}
                }
                struct ${lThirdStructName} {
                    ${lThirdPropertyName}: ${lSecondStructName}
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lFirstStructName}{` +
                `${lFirstPropertyName}:f32` +
                `}` +

                `struct ${lSecondStructName}{` +
                `${lSecondPropertyName}:${lFirstStructName}` +
                `}` +

                `struct ${lThirdStructName}{` +
                `${lThirdPropertyName}:${lSecondStructName}` +
                `}`
            );
        });
    });

    await pContext.step('Attributes', async (pContext) => {
        await pContext.step('location', () => {
            // Setup.
            const lStructName: string = 'TestLocationStruct';
            const lPropertyName: string = 'locationProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.location}("OutputOne")]
                    ${lPropertyName}: Vector4<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `@location(0)${lPropertyName}:vec4<f32>` +
                `}`
            );
        });

        await pContext.step('blend source', () => {
            // Setup.
            const lStructName: string = 'TestBlendSourceStruct';
            const lPropertyName: string = 'blendProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.location}("TextureOne")]
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    ${lPropertyName}: Vector4<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `enable dual_source_blending;` +
                `struct ${lStructName}{` +
                `@blend_src(0)@location(0)${lPropertyName}:vec4<f32>` +
                `}`
            );
        });

        await pContext.step('interpolate', () => {
            // Setup.
            const lStructName: string = 'TestInterpolateStruct';
            const lPropertyName: string = 'interpolateProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.location}("OutputOne")]
                    [${AttributeListAst.attributeNames.interpolate}(InterpolateType.Perspective, InterpolateSampling.Center)]
                    ${lPropertyName}: Vector4<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `@location(0)@interpolate(perspective, center)${lPropertyName}:vec4<f32>` +
                `}`
            );
        });

        await pContext.step('size', () => {
            // Setup.
            const lStructName: string = 'TestSizeStruct';
            const lPropertyName: string = 'sizedProperty';
            const lSizeValue: number = 16;
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.size}(${lSizeValue})]
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `@size(${lSizeValue})${lPropertyName}:f32` +
                `}`
            );
        });

        await pContext.step('align', () => {
            // Setup.
            const lStructName: string = 'TestAlignStruct';
            const lPropertyName: string = 'alignedProperty';
            const lAlignValue: number = 8;
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.align}(${lAlignValue})]
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `@align(${lAlignValue})${lPropertyName}:f32` +
                `}`
            );
        });
    });
});
