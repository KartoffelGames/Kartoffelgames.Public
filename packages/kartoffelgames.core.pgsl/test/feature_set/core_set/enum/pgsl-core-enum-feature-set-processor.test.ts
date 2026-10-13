import { expect } from '@kartoffelgames/core-test';
import { EnumDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/enum-declaration-ast.ts';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslTextureType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslCoreEnumFeatureSetProcessor } from '../../../../source/feature_set/core_set/enum/pgsl-core-enum-feature-set-processor.ts';
import { PgslCoreFeatureSet } from '../../../../source/feature_set/core_set/pgsl-core-feature-set.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslCoreEnumFeatureSetProcessor.declarations', async (pContext) => {
    await pContext.step('AccessMode', () => {
        // Setup.
        const lProcessor: PgslCoreEnumFeatureSetProcessor = new PgslCoreEnumFeatureSetProcessor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is an enum.
        const lDeclaration: EnumDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === 'AccessMode') as EnumDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(EnumDeclarationAst);

        // Evaluation. Every value with its WGSL name.
        expect([...lDeclaration.data.values].map(([pName, pValue]) => [pName, pValue.data.constantValue])).toBeDeepEqual([
            ['Read', 'read'],
            ['Write', 'write'],
            ['ReadWrite', 'read_write']
        ]);
    });

    await pContext.step('InterpolateSampling', () => {
        // Setup.
        const lProcessor: PgslCoreEnumFeatureSetProcessor = new PgslCoreEnumFeatureSetProcessor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is an enum.
        const lDeclaration: EnumDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === 'InterpolateSampling') as EnumDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(EnumDeclarationAst);

        // Evaluation. Every value with its WGSL name.
        expect([...lDeclaration.data.values].map(([pName, pValue]) => [pName, pValue.data.constantValue])).toBeDeepEqual([
            ['Center', 'center'],
            ['Centroid', 'centroid'],
            ['Sample', 'sample'],
            ['First', 'first'],
            ['Either', 'either']
        ]);
    });

    await pContext.step('InterpolateType', () => {
        // Setup.
        const lProcessor: PgslCoreEnumFeatureSetProcessor = new PgslCoreEnumFeatureSetProcessor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is an enum.
        const lDeclaration: EnumDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === 'InterpolateType') as EnumDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(EnumDeclarationAst);

        // Evaluation. Every value with its WGSL name.
        expect([...lDeclaration.data.values].map(([pName, pValue]) => [pName, pValue.data.constantValue])).toBeDeepEqual([
            ['Perspective', 'perspective'],
            ['Linear', 'linear'],
            ['Flat', 'flat']
        ]);
    });

    await pContext.step('TexelFormat', () => {
        // Setup.
        const lProcessor: PgslCoreEnumFeatureSetProcessor = new PgslCoreEnumFeatureSetProcessor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is an enum.
        const lDeclaration: EnumDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === 'TexelFormat') as EnumDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(EnumDeclarationAst);

        // Evaluation. Every value with its WGSL name.
        expect([...lDeclaration.data.values].map(([pName, pValue]) => [pName, pValue.data.constantValue])).toBeDeepEqual([
            ['Rgba8unorm', 'rgba8unorm'],
            ['Rgba8snorm', 'rgba8snorm'],
            ['Rgba8uint', 'rgba8uint'],
            ['Rgba8sint', 'rgba8sint'],
            ['Rgba16unorm', 'rgba16unorm'],
            ['Rgba16snorm', 'rgba16snorm'],
            ['Rgba16uint', 'rgba16uint'],
            ['Rgba16sint', 'rgba16sint'],
            ['Rgba16float', 'rgba16float'],
            ['Rg8unorm', 'rg8unorm'],
            ['Rg8snorm', 'rg8snorm'],
            ['Rg8uint', 'rg8uint'],
            ['Rg8sint', 'rg8sint'],
            ['Rg16unorm', 'rg16unorm'],
            ['Rg16snorm', 'rg16snorm'],
            ['Rg16uint', 'rg16uint'],
            ['Rg16sint', 'rg16sint'],
            ['Rg16float', 'rg16float'],
            ['R32uint', 'r32uint'],
            ['R32sint', 'r32sint'],
            ['R32float', 'r32float'],
            ['Rg32uint', 'rg32uint'],
            ['Rg32sint', 'rg32sint'],
            ['Rg32float', 'rg32float'],
            ['Rgba32uint', 'rgba32uint'],
            ['Rgba32sint', 'rgba32sint'],
            ['Rgba32float', 'rgba32float'],
            ['Bgra8unorm', 'bgra8unorm'],
            ['R8unorm', 'r8unorm'],
            ['R8snorm', 'r8snorm'],
            ['R8uint', 'r8uint'],
            ['R8sint', 'r8sint'],
            ['R16unorm', 'r16unorm'],
            ['R16snorm', 'r16snorm'],
            ['R16uint', 'r16uint'],
            ['R16sint', 'r16sint'],
            ['R16float', 'r16float'],
            ['Rgb10a2unorm', 'rgb10a2unorm'],
            ['Rgb10a2uint', 'rgb10a2uint'],
            ['Rg11b10ufloat', 'rg11b10ufloat']
        ]);
    });
});

Deno.test('PgslCoreEnumFeatureSetProcessor - Transpilation', async (pContext) => {
    await pContext.step('AccessMode', () => {
        // Setup.
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            [${AttributeListAst.attributeNames.accessMode}(AccessMode.ReadWrite)]
            storage testStorage: ${PgslNumericType.typeName.float32};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Access mode is written with its WGSL name.
        expect(lTranspilationResult.source).toBe(`@group(0)@binding(0)var<storage,read_write> testStorage:f32;`);
    });

    await pContext.step('InterpolateSampling', () => {
        // Setup.
        const lCodeText: string = `
            struct TestStruct {
                [${AttributeListAst.attributeNames.location}("test_location")]
                [${AttributeListAst.attributeNames.interpolate}(InterpolateType.Perspective, InterpolateSampling.Centroid)]
                testProperty: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Interpolate sampling is written with its WGSL name.
        expect(lTranspilationResult.source).toBe(`struct TestStruct{@location(0)@interpolate(perspective, centroid)testProperty:vec4<f32>}`);
    });

    await pContext.step('InterpolateType', () => {
        // Setup.
        const lCodeText: string = `
            struct TestStruct {
                [${AttributeListAst.attributeNames.location}("test_location")]
                [${AttributeListAst.attributeNames.interpolate}(InterpolateType.Linear, InterpolateSampling.Center)]
                testProperty: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Interpolate type is written with its WGSL name.
        expect(lTranspilationResult.source).toBe(`struct TestStruct{@location(0)@interpolate(linear, center)testProperty:vec4<f32>}`);
    });

    await pContext.step('TexelFormat', () => {
        // Setup.
        const lCodeText: string = `
            [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
            storage testTexture: ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.R32float, AccessMode.Read>;
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Texel format is written with its WGSL name.
        expect(lTranspilationResult.source).toBe(`@group(0)@binding(0)var testTexture:texture_storage_2d<r32float,read>;`);
    });
});
