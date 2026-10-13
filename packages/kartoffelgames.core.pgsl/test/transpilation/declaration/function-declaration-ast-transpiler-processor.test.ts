import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBuildInType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-build-in-type.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResultComputeEntryPoint } from '../../../source/parser_result/entry_point/pgsl-parser-result-compute-entry-point.ts';
import type { PgslParserResultFragmentEntryPoint } from '../../../source/parser_result/entry_point/pgsl-parser-result-fragment-entry-point.ts';
import type { PgslParserResultVertexEntryPoint } from '../../../source/parser_result/entry_point/pgsl-parser-result-vertex-entry-point.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import type { PgslParserResultNumericType } from '../../../source/parser_result/type/pgsl-parser-result-numeric-type.ts';
import type { PgslParserResultVectorType } from '../../../source/parser_result/type/pgsl-parser-result-vector-type.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionDeclarationAst - Transpilation', async (pContext) => {
    await pContext.step('Result types', async (pContext) => {
        await pContext.step('Numeric', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): ${PgslNumericType.typeName.float32} { return 5.0; }`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}()->f32{return 5.0;}`
            );
        });

        await pContext.step('Array', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},3> { return new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0); }`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}()->array<f32,3>{return array(1.0,2.0,3.0);}`
            );
        });

        await pContext.step('Vector', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> { return new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0); }`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}()->vec3<f32>{return vec3(1.0,2.0,3.0);}`
            );
        });

        await pContext.step('Matrix', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> { return new ${PgslMatrixType.typeName.matrix22}(1.0, 2.0, 3.0, 4.0); }`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}()->mat2x2<f32>{return mat2x2(1.0,2.0,3.0,4.0);}`
            );
        });

        await pContext.step('Void', async (pContext) => {
            await pContext.step('No return', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lCodeText: string = `function ${lFunctionName}(): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(){}`
                );
            });

            await pContext.step('Empty return', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lCodeText: string = `function ${lFunctionName}(): void { return; }`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(){return;}`
                );
            });
        });
    });

    await pContext.step('Parameter', async (pContext) => {
        await pContext.step('No parameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `function ${lFunctionName}(): void {}`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}(){}`
            );
        });

        await pContext.step('Single parameter', async (pContext) => {
            await pContext.step('Numeric', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${PgslNumericType.typeName.float32}): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(${lParameterName}:f32){}`
                );
            });

            await pContext.step('Array', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},5>): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(${lParameterName}:array<f32,5>){}`
                );
            });

            await pContext.step('Vector', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(${lParameterName}:vec2<f32>){}`
                );
            });

            await pContext.step('Matrix', async () => {
                // Setup.
                const lFunctionName: string = 'testFunction';
                const lParameterName: string = 'paramOne';
                const lCodeText: string = `function ${lFunctionName}(${lParameterName}: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}>): void {}`;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation.
                expect(lTranspilationResult.incidents).toHaveLength(0);
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(${lParameterName}:mat3x3<f32>){}`
                );
            });

            await pContext.step('Pointer', async (pContext) => {
                await pContext.step('Numeric', async () => {
                    // Setup.
                    const lFunctionName: string = 'testFunction';
                    const lParameterName: string = 'paramOne';
                    const lCodeText: string = `function ${lFunctionName}(${lParameterName}: *${PgslNumericType.typeName.float32}): void {}`;

                    // Process.
                    const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                    // Evaluation.
                    expect(lTranspilationResult.incidents).toHaveLength(0);
                    expect(lTranspilationResult.source).toBe(
                        `fn ${lFunctionName}(${lParameterName}:ptr<function,f32>){}`
                    );
                });

                await pContext.step('Vector', async () => {
                    // Setup.
                    const lFunctionName: string = 'testFunction';
                    const lParameterName: string = 'paramOne';
                    const lCodeText: string = `function ${lFunctionName}(${lParameterName}: *${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>): void {}`;

                    // Process.
                    const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                    // Evaluation.
                    expect(lTranspilationResult.incidents).toHaveLength(0);
                    expect(lTranspilationResult.source).toBe(
                        `fn ${lFunctionName}(${lParameterName}:ptr<function,vec4<f32>>){}`
                    );
                });

                await pContext.step('Array', async () => {
                    // Setup.
                    const lFunctionName: string = 'testFunction';
                    const lParameterName: string = 'paramOne';
                    const lCodeText: string = `function ${lFunctionName}(${lParameterName}: *${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},7>): void {}`;

                    // Process.
                    const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                    // Evaluation.
                    expect(lTranspilationResult.incidents).toHaveLength(0);
                    expect(lTranspilationResult.source).toBe(
                        `fn ${lFunctionName}(${lParameterName}:ptr<function,array<f32,7>>){}`
                    );
                });
            });
        });

        await pContext.step('Multiparameter', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lParameterOneName: string = 'paramOne';
            const lParameterTwoName: string = 'paramTwo';
            const lCodeText: string = `function ${lFunctionName}(${lParameterOneName}: ${PgslNumericType.typeName.float32}, ${lParameterTwoName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>): void {}`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}(${lParameterOneName}:f32,${lParameterTwoName}:vec2<f32>){}`
            );
        });
    });

    await pContext.step('Attributes', async (pContext) => {
        await pContext.step('Vertex', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `struct VertexIn{@location(0)position:vec4<f32>}` +
                `struct VertexOut{@location(0)position:vec4<f32>}` +
                `@vertex fn ${lFunctionName}(in:VertexIn)->VertexOut{` +
                `var out:VertexOut;` +
                `return out;` +
                `}`
            );
        });

        await pContext.step('Fragment', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `struct FragmentIn{@location(0)position:vec4<f32>}` +
                `struct FragmentOut{@location(0)position:vec4<f32>}` +
                `@fragment fn ${lFunctionName}(in:FragmentIn)->FragmentOut{` +
                `var out:FragmentOut;` +
                `return out;` +
                `}`
            );
        });

        await pContext.step('Compute', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lWorkgroupX: number = 8;
            const lWorkgroupY: number = 8;
            const lWorkgroupZ: number = 1;
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(${lWorkgroupX}, ${lWorkgroupY}, ${lWorkgroupZ})]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@compute @workgroup_size(${lWorkgroupX},${lWorkgroupY},${lWorkgroupZ}) fn ${lFunctionName}(){}`
            );
        });
    });

    await pContext.step('Metadata', async (pContext) => {
        await pContext.step('Single metadata', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lMetaKey: string = 'TestMeta';
            const lMetaValue: string = 'TestValue';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("${lMetaKey}", "${lMetaValue}")]
                [${AttributeListAst.attributeNames.compute}(1, 2, 3)]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());
            const lComputeEntryPoint: PgslParserResultComputeEntryPoint | undefined = lTranspilationResult.entryPoints.compute.get(lFunctionName)!;

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lComputeEntryPoint.metaValues.size).toBe(1);
            expect(lComputeEntryPoint.metaValues.get(lMetaKey)).toBe(lMetaValue);
        });

        await pContext.step('Multiple metadata', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lMetaKeyOne: string = 'MetaOne';
            const lMetaValueOne: string = 'ValueOne';
            const lMetaKeyTwo: string = 'MetaTwo';
            const lMetaValueTwo: string = 'ValueTwo';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("${lMetaKeyOne}", "${lMetaValueOne}")]
                [${AttributeListAst.attributeNames.meta}("${lMetaKeyTwo}", "${lMetaValueTwo}")]
                [${AttributeListAst.attributeNames.compute}(1, 2, 3)]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());
            const lComputeEntryPoint: PgslParserResultComputeEntryPoint | undefined = lTranspilationResult.entryPoints.compute.get(lFunctionName)!;

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lComputeEntryPoint.metaValues.size).toBe(2);
            expect(lComputeEntryPoint.metaValues.get(lMetaKeyOne)).toBe(lMetaValueOne);
            expect(lComputeEntryPoint.metaValues.get(lMetaKeyTwo)).toBe(lMetaValueTwo);
        });

        await pContext.step('Override metadata', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lMetaKey: string = 'TestMeta';
            const lMetaValueOverride: string = 'OverrideValue';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("${lMetaKey}", "OriginalValue")]
                [${AttributeListAst.attributeNames.meta}("${lMetaKey}", "${lMetaValueOverride}")]
                [${AttributeListAst.attributeNames.compute}(1, 2, 3)]
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());
            const lComputeEntryPoint: PgslParserResultComputeEntryPoint | undefined = lTranspilationResult.entryPoints.compute.get(lFunctionName)!;

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lComputeEntryPoint.metaValues.size).toBe(1);
            expect(lComputeEntryPoint.metaValues.get(lMetaKey)).toBe(lMetaValueOverride);
        });
    });
});

Deno.test('FunctionDeclarationAst - Parser Result', async (pContext) => {
    await pContext.step('Compute Entry Point', async () => {
        // Setup.
        const lFunctionName: string = 'testFunction';
        const lWorkgroupX: number = 8;
        const lWorkgroupY: number = 4;
        const lWorkgroupZ: number = 2;
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.compute}(${lWorkgroupX}, ${lWorkgroupY}, ${lWorkgroupZ})]
            function ${lFunctionName}(): void {}
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No incidents.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Check entry points count.
        expect(lTranspilationResult.entryPoints.compute.size).toBe(1);

        // Evaluation. Check entry point type and name.
        const lEntryPoint: PgslParserResultComputeEntryPoint = lTranspilationResult.entryPoints.compute.get(lFunctionName)!;
        expect(lEntryPoint).toBeDefined();
        expect(lEntryPoint.type).toBe('compute');
        expect(lEntryPoint.name).toBe(lFunctionName);

        // Evaluation. Check workgroup size.
        expect(lEntryPoint.workgroupSize).toBeDefined();
        expect(lEntryPoint.workgroupSize.x).toBe(lWorkgroupX);
        expect(lEntryPoint.workgroupSize.y).toBe(lWorkgroupY);
        expect(lEntryPoint.workgroupSize.z).toBe(lWorkgroupZ);
    });

    await pContext.step('Fragment Entry Point', async (pContext) => {
        await pContext.step('Only location output values', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_location_one")] positionOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_location_two")] positionTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_render_one")] renderOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_render_two")] renderTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No incidents.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Check entry points count.
            expect(lTranspilationResult.entryPoints.fragment.size).toBe(1);

            // Evaluation. Check entry point type and name.
            const lEntryPoint: PgslParserResultFragmentEntryPoint = lTranspilationResult.entryPoints.fragment.get(lFunctionName)!;
            expect(lEntryPoint).toBeDefined();
            expect(lEntryPoint.type).toBe('fragment');
            expect(lEntryPoint.name).toBe(lFunctionName);

            // Evaluation. Check render targets count.
            expect(lEntryPoint.renderTargets).toHaveLength(2);

            // Evaluation. Check first render target.
            const lRenderTargetOne = lEntryPoint.renderTargets[0];
            expect(lRenderTargetOne.name).toBe('renderOne');
            expect(lRenderTargetOne.location).toBe(0);
            expect(lRenderTargetOne.type.type).toBe('vector');

            // Evaluation. Check first render target element type.
            const lRenderTargetOneType = lRenderTargetOne.type as PgslParserResultVectorType;
            expect(lRenderTargetOneType.dimension).toBe(4);
            expect(lRenderTargetOneType.elementType.type).toBe('numeric');
            const lRenderTargetOneElementType = lRenderTargetOneType.elementType as PgslParserResultNumericType;
            expect(lRenderTargetOneElementType.numberType).toBe('float');
            expect(lRenderTargetOneElementType.alignmentType).toBe('packed');

            // Evaluation. Check second render target.
            const lRenderTargetTwo = lEntryPoint.renderTargets[1];
            expect(lRenderTargetTwo.name).toBe('renderTwo');
            expect(lRenderTargetTwo.location).toBe(1);
            expect(lRenderTargetTwo.type.type).toBe('vector');

            // Evaluation. Check second render target element type.
            const lRenderTargetTwoType = lRenderTargetTwo.type as PgslParserResultVectorType;
            expect(lRenderTargetTwoType.dimension).toBe(4);
            expect(lRenderTargetTwoType.elementType.type).toBe('numeric');
            const lRenderTargetTwoElementType = lRenderTargetTwoType.elementType as PgslParserResultNumericType;
            expect(lRenderTargetTwoElementType.numberType).toBe('float');
            expect(lRenderTargetTwoElementType.alignmentType).toBe('packed');
        });

        await pContext.step('With buildin position value', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_location_one")] renderOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    builtInPosition: ${PgslBuildInType.typeName.position}
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_render_one")] outputOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function ${lFunctionName}(in: FragmentIn): FragmentOut {
                    let out: FragmentOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No incidents.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Check entry points count.
            expect(lTranspilationResult.entryPoints.fragment.size).toBe(1);

            // Evaluation. Check entry point type and name.
            const lEntryPoint: PgslParserResultFragmentEntryPoint = lTranspilationResult.entryPoints.fragment.get(lFunctionName)!;
            expect(lEntryPoint).toBeDefined();
            expect(lEntryPoint.type).toBe('fragment');
            expect(lEntryPoint.name).toBe(lFunctionName);

            // Evaluation. Check render targets count (should only include location properties, not built-in values).
            expect(lEntryPoint.renderTargets).toHaveLength(1);

            // Evaluation. Check the single render target.
            const lRenderTargetOne = lEntryPoint.renderTargets[0];
            expect(lRenderTargetOne.name).toBe('outputOne');
            expect(lRenderTargetOne.location).toBe(0);
            expect(lRenderTargetOne.type.type).toBe('vector');

            // Evaluation. Check first render target element type.
            const lRenderTargetOneType = lRenderTargetOne.type as PgslParserResultVectorType;
            expect(lRenderTargetOneType.dimension).toBe(4);
            expect(lRenderTargetOneType.elementType.type).toBe('numeric');
            const lRenderTargetOneElementType = lRenderTargetOneType.elementType as PgslParserResultNumericType;
            expect(lRenderTargetOneElementType.numberType).toBe('float');
            expect(lRenderTargetOneElementType.alignmentType).toBe('packed');
        });
    });

    await pContext.step('Vertex Entry Point', async (pContext) => {
        await pContext.step('Only location input values', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_normal")] normal: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_output_pos")] outputPos: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_output_norm")] outputNorm: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No incidents.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Check entry points count.
            expect(lTranspilationResult.entryPoints.vertex.size).toBe(1);

            // Evaluation. Check entry point type and name.
            const lEntryPoint: PgslParserResultVertexEntryPoint = lTranspilationResult.entryPoints.vertex.get(lFunctionName)!;
            expect(lEntryPoint).toBeDefined();
            expect(lEntryPoint.type).toBe('vertex');
            expect(lEntryPoint.name).toBe(lFunctionName);

            // Evaluation. Check parameters count.
            expect(lEntryPoint.parameters).toHaveLength(2);

            // Evaluation. Check first parameter.
            const lParameterOne = lEntryPoint.parameters[0];
            expect(lParameterOne.name).toBe('position');
            expect(lParameterOne.location).toBe(0);
            expect(lParameterOne.type.type).toBe('vector');

            // Evaluation. Check first parameter element type.
            const lParameterOneType = lParameterOne.type as PgslParserResultVectorType;
            expect(lParameterOneType.dimension).toBe(3);
            expect(lParameterOneType.elementType.type).toBe('numeric');
            const lParameterOneElementType = lParameterOneType.elementType as PgslParserResultNumericType;
            expect(lParameterOneElementType.numberType).toBe('float');
            expect(lParameterOneElementType.alignmentType).toBe('packed');

            // Evaluation. Check second parameter.
            const lParameterTwo = lEntryPoint.parameters[1];
            expect(lParameterTwo.name).toBe('normal');
            expect(lParameterTwo.location).toBe(1);
            expect(lParameterTwo.type.type).toBe('vector');

            // Evaluation. Check second parameter element type.
            const lParameterTwoType = lParameterTwo.type as PgslParserResultVectorType;
            expect(lParameterTwoType.dimension).toBe(3);
            expect(lParameterTwoType.elementType.type).toBe('numeric');
            const lParameterTwoElementType = lParameterTwoType.elementType as PgslParserResultNumericType;
            expect(lParameterTwoElementType.numberType).toBe('float');
            expect(lParameterTwoElementType.alignmentType).toBe('packed');
        });

        await pContext.step('With buildin vertexIndex value', async () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>,
                    vertexIndexValue: ${PgslBuildInType.typeName.vertexIndex}
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_output_pos")] outputPos: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function ${lFunctionName}(in: VertexIn): VertexOut {
                    let out: VertexOut;
                    return out;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No incidents.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Check entry points count.
            expect(lTranspilationResult.entryPoints.vertex.size).toBe(1);

            // Evaluation. Check entry point type and name.
            const lEntryPoint: PgslParserResultVertexEntryPoint = lTranspilationResult.entryPoints.vertex.get(lFunctionName)!;
            expect(lEntryPoint).toBeDefined();
            expect(lEntryPoint.type).toBe('vertex');
            expect(lEntryPoint.name).toBe(lFunctionName);

            // Evaluation. Check parameters count (should only include location properties, not built-in values).
            expect(lEntryPoint.parameters).toHaveLength(1);

            // Evaluation. Check the single parameter.
            const lParameterOne = lEntryPoint.parameters[0];
            expect(lParameterOne.name).toBe('position');
            expect(lParameterOne.location).toBe(0);
            expect(lParameterOne.type.type).toBe('vector');

            // Evaluation. Check first parameter element type.
            const lParameterOneType = lParameterOne.type as PgslParserResultVectorType;
            expect(lParameterOneType.dimension).toBe(3);
            expect(lParameterOneType.elementType.type).toBe('numeric');
            const lParameterOneElementType = lParameterOneType.elementType as PgslParserResultNumericType;
            expect(lParameterOneElementType.numberType).toBe('float');
            expect(lParameterOneElementType.alignmentType).toBe('packed');
        });
    });
});
