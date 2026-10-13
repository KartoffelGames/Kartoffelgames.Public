import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResultBinding } from '../../../source/parser_result/pgsl-parser-result-binding.ts';
import type { PgslParserResultParameter } from '../../../source/parser_result/pgsl-parser-result-parameter.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { PgslParserResultArrayType } from '../../../source/parser_result/type/pgsl-parser-result-array-type.ts';
import { PgslParserResultBooleanType } from '../../../source/parser_result/type/pgsl-parser-result-boolean-type.ts';
import { PgslParserResultMatrixType } from '../../../source/parser_result/type/pgsl-parser-result-matrix-type.ts';
import { PgslParserResultNumericType } from '../../../source/parser_result/type/pgsl-parser-result-numeric-type.ts';
import { PgslParserResultSamplerType } from '../../../source/parser_result/type/pgsl-parser-result-sampler-type.ts';
import { type PgslParserResultStructProperty, PgslParserResultStructType } from '../../../source/parser_result/type/pgsl-parser-result-struct-type.ts';
import { PgslParserResultTextureType } from '../../../source/parser_result/type/pgsl-parser-result-texture-type.ts';
import { PgslParserResultVectorType } from '../../../source/parser_result/type/pgsl-parser-result-vector-type.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableDeclarationAst - Transpilation', async (pContext) => {
    await pContext.step('Const', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = '5.0';
            const lCodeText: string = `const ${lVariableName}: ${PgslNumericType.typeName.float32} = ${lVariableValue};`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:f32=${lVariableValue};`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `const ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0, 0);`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:vec2<f32>=vec2(0,0);`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `const ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(0, 0, 0, 0);`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:mat2x2<f32>=mat2x2(0,0,0,0);`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `const ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},2> = new Array(0, 0);`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:array<f32,2>=array(0,0);`
            );
        });
    });

    await pContext.step('Storage', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:f32;`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:vec2<f32>;`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:mat2x2<f32>;`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:array<f32,10>;`
            );
        });

        await pContext.step('Storage texture type', async () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testVariable: ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, AccessMode.Write>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
        });

        await pContext.step('GroupBinding attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("2", "3")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:f32;`
            );
        });

        await pContext.step('AccessMode attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.ReadWrite)]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read_write> ${lVariableName}:f32;`
            );
        });
    });

    await pContext.step('Uniform', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:f32;`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:vec2<f32>;`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:mat2x2<f32>;`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:array<f32,10>;`
            );
        });

        await pContext.step('Sampler type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslSamplerType.typeName.sampler};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var ${lVariableName}:sampler;`
            );
        });

        await pContext.step('Texture type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var ${lVariableName}:texture_2d<f32>;`
            );
        });

        await pContext.step('GroupBinding attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("2", "3")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:f32;`
            );
        });

        await pContext.step('AccessMode attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.Read)]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:f32;`
            );
        });
    });

    await pContext.step('Workgroup', async (pContext) => {
        await pContext.step('Numeric type without initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslNumericType.typeName.float32};`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:f32;`
            );
        });

        await pContext.step('Numeric type with initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:f32=5.0;`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:vec2<f32>;`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:mat2x2<f32>;`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:array<f32,10>;`
            );
        });
    });

    await pContext.step('Private', async (pContext) => {
        await pContext.step('Numeric type without initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslNumericType.typeName.float32};`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:f32;`
            );
        });

        await pContext.step('Numeric type with initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:f32=5.0;`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:vec2<f32>;`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:mat2x2<f32>;`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:array<f32,10>;`
            );
        });
    });

    await pContext.step('Param', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lCodeText: string = `param testParam: ${PgslNumericType.typeName.float32} = 2.0;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
        });

        await pContext.step('Boolean type', async () => {
            // Setup.
            const lCodeText: string = `param testParam: ${PgslBooleanType.typeName.boolean} = true;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
        });
    });

    await pContext.step('Metadata', async (pContext) => {
        await pContext.step('Parameter single metadata', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lMetaKey: string = 'TestMeta';
            const lMetaValue: string = 'TestValue';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("${lMetaKey}", "${lMetaValue}")]
                param ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());
            const lParameter: PgslParserResultParameter | undefined = lTranspilationResult.parameters.find(p => p.name === lVariableName);

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lParameter!.metaValues.size).toBe(1);
            expect(lParameter!.metaValues.get(lMetaKey)).toBe(lMetaValue);
        });

        await pContext.step('Parameter multiple metadata', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lMetaKeyOne: string = 'MetaOne';
            const lMetaValueOne: string = 'ValueOne';
            const lMetaKeyTwo: string = 'MetaTwo';
            const lMetaValueTwo: string = 'ValueTwo';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("${lMetaKeyOne}", "${lMetaValueOne}")]
                [${AttributeListAst.attributeNames.meta}("${lMetaKeyTwo}", "${lMetaValueTwo}")]
                param ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());
            const lParameter: PgslParserResultParameter | undefined = lTranspilationResult.parameters.find(p => p.name === lVariableName);

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lParameter!.metaValues.size).toBe(2);
            expect(lParameter!.metaValues.get(lMetaKeyOne)).toBe(lMetaValueOne);
            expect(lParameter!.metaValues.get(lMetaKeyTwo)).toBe(lMetaValueTwo);
        });

        await pContext.step('Parameter override metadata', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lMetaKey: string = 'TestMeta';
            const lMetaValueOverride: string = 'OverrideValue';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("${lMetaKey}", "OriginalValue")]
                [${AttributeListAst.attributeNames.meta}("${lMetaKey}", "${lMetaValueOverride}")]
                param ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());
            const lParameter: PgslParserResultParameter | undefined = lTranspilationResult.parameters.find(p => p.name === lVariableName);

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lParameter!.metaValues.size).toBe(1);
            expect(lParameter!.metaValues.get(lMetaKey)).toBe(lMetaValueOverride);
        });

        await pContext.step('Binding single metadata', async () => {
            // Setup.
            const lMetaKey: string = 'TestMeta';
            const lMetaValue: string = 'TestValue';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("${lMetaKey}", "${lMetaValue}")]
                [${AttributeListAst.attributeNames.groupBinding}("Group", "Binding")]
                uniform testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());
            const lUniform: PgslParserResultBinding  | undefined = lTranspilationResult.bindings.find(p => p.bindLocationName === 'Binding');

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lUniform!.metaValues.size).toBe(1);
            expect(lUniform!.metaValues.get(lMetaKey)).toBe(lMetaValue);
        });

        await pContext.step('Binding multiple metadata', async () => {
            // Setup.
            const lMetaKeyOne: string = 'MetaOne';
            const lMetaValueOne: string = 'ValueOne';
            const lMetaKeyTwo: string = 'MetaTwo';
            const lMetaValueTwo: string = 'ValueTwo';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("${lMetaKeyOne}", "${lMetaValueOne}")]
                [${AttributeListAst.attributeNames.meta}("${lMetaKeyTwo}", "${lMetaValueTwo}")]
                [${AttributeListAst.attributeNames.groupBinding}("Group", "Binding")]
                uniform testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());
            const lUniform: PgslParserResultBinding  | undefined = lTranspilationResult.bindings.find(p => p.bindLocationName === 'Binding');

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lUniform!.metaValues.size).toBe(2);
            expect(lUniform!.metaValues.get(lMetaKeyOne)).toBe(lMetaValueOne);
            expect(lUniform!.metaValues.get(lMetaKeyTwo)).toBe(lMetaValueTwo);
        });

        await pContext.step('Binding override metadata', async () => {
            // Setup.
            const lMetaKey: string = 'TestMeta';
            const lMetaValueOverride: string = 'OverrideValue';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("${lMetaKey}", "OriginalValue")]
                [${AttributeListAst.attributeNames.meta}("${lMetaKey}", "${lMetaValueOverride}")]
                [${AttributeListAst.attributeNames.groupBinding}("Group", "Binding")]
                uniform testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());
            const lUniform: PgslParserResultBinding  | undefined = lTranspilationResult.bindings.find(p => p.bindLocationName === 'Binding');

            // Evaluation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lUniform!.metaValues.size).toBe(1);
            expect(lUniform!.metaValues.get(lMetaKey)).toBe(lMetaValueOverride);
        });
    });
});

Deno.test('VariableDeclarationAst - Parser Result', async (pContext) => {
    await pContext.step('Param', async (pContext) => {
        await pContext.step('Numeric float', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.float32} = 2.0;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of parameters.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.parameters).toHaveLength(1);

            // Evaluation. Check parameter details.
            const lParameter: PgslParserResultParameter = lTranspilationResult.parameters[0];
            expect(lParameter.name).toBe(lVariableName);
            expect(lParameter.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check numeric type details.
            const lParameterType: PgslParserResultNumericType = lParameter.type as PgslParserResultNumericType;
            expect(lParameterType.type).toBe('numeric');
            expect(lParameterType.alignmentType).toBe('packed');
            expect(lParameterType.numberType).toBe('float');
        });

        await pContext.step('Numeric signed integer', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 5;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of parameters.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.parameters).toHaveLength(1);

            // Evaluation. Check parameter details.
            const lParameter: PgslParserResultParameter = lTranspilationResult.parameters[0];
            expect(lParameter.name).toBe(lVariableName);
            expect(lParameter.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check numeric type details.
            const lParameterType: PgslParserResultNumericType = lParameter.type as PgslParserResultNumericType;
            expect(lParameterType.type).toBe('numeric');
            expect(lParameterType.alignmentType).toBe('packed');
            expect(lParameterType.numberType).toBe('integer');
        });

        await pContext.step('Numeric unsigned integer', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 10u;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of parameters.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.parameters).toHaveLength(1);

            // Evaluation. Check parameter details.
            const lParameter: PgslParserResultParameter = lTranspilationResult.parameters[0];
            expect(lParameter.name).toBe(lVariableName);
            expect(lParameter.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check numeric type details.
            const lParameterType: PgslParserResultNumericType = lParameter.type as PgslParserResultNumericType;
            expect(lParameterType.type).toBe('numeric');
            expect(lParameterType.alignmentType).toBe('packed');
            expect(lParameterType.numberType).toBe('unsigned-integer');
        });

        await pContext.step('Boolean', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslBooleanType.typeName.boolean} = true;`;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of parameters.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.parameters).toHaveLength(1);

            // Evaluation. Check parameter details.
            const lParameter: PgslParserResultParameter = lTranspilationResult.parameters[0];
            expect(lParameter.name).toBe(lVariableName);
            expect(lParameter.type).toBeInstanceOf(PgslParserResultBooleanType);

            // Evaluation. Check numeric type details.
            const lParameterType: PgslParserResultBooleanType = lParameter.type as PgslParserResultBooleanType;
            expect(lParameterType.type).toBe('boolean');
            expect(lParameterType.alignmentType).toBe('packed');
        });
    });

    await pContext.step('Uniform', async (pContext) => {
        await pContext.step('Numeric float', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check type details.
            const lUniformType: PgslParserResultNumericType = lBinding.type as PgslParserResultNumericType;
            expect(lUniformType.type).toBe('numeric');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.numberType).toBe('float');
        });

        await pContext.step('Numeric signed integer', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: ${PgslNumericType.typeName.signedInteger};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check type details.
            const lUniformType: PgslParserResultNumericType = lBinding.type as PgslParserResultNumericType;
            expect(lUniformType.type).toBe('numeric');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.numberType).toBe('integer');
        });

        await pContext.step('Numeric unsigned integer', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: ${PgslNumericType.typeName.unsignedInteger};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check type details.
            const lUniformType: PgslParserResultNumericType = lBinding.type as PgslParserResultNumericType;
            expect(lUniformType.type).toBe('numeric');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.numberType).toBe('unsigned-integer');
        });

        await pContext.step('Vector', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultVectorType);

            // Evaluation. Check type details.
            const lUniformType: PgslParserResultVectorType = lBinding.type as PgslParserResultVectorType;
            expect(lUniformType.type).toBe('vector');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.dimension).toBe(3);
            expect(lUniformType.elementType).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check element type details.
            const lElementType: PgslParserResultNumericType = lUniformType.elementType as PgslParserResultNumericType;
            expect(lElementType.type).toBe('numeric');
            expect(lElementType.alignmentType).toBe('uniform');
            expect(lElementType.numberType).toBe('float');
        });

        await pContext.step('Matrix', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: ${PgslMatrixType.typeName.matrix32}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultMatrixType);

            // Evaluation. Check type details.
            const lUniformType: PgslParserResultMatrixType = lBinding.type as PgslParserResultMatrixType;
            expect(lUniformType.type).toBe('matrix');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.columns).toBe(3);
            expect(lUniformType.rows).toBe(2);
            expect(lUniformType.elementType).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check element type details.
            const lElementType: PgslParserResultNumericType = lUniformType.elementType as PgslParserResultNumericType;
            expect(lElementType.type).toBe('numeric');
            expect(lElementType.alignmentType).toBe('uniform');
            expect(lElementType.numberType).toBe('float');
        });

        await pContext.step('Array', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 10>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultArrayType);

            // Evaluation. Check type details.
            const lUniformType: PgslParserResultArrayType = lBinding.type as PgslParserResultArrayType;
            expect(lUniformType.type).toBe('array');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.length).toBe(10);
            expect(lUniformType.elementType).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check element type details.
            const lElementType: PgslParserResultNumericType = lUniformType.elementType as PgslParserResultNumericType;
            expect(lElementType.type).toBe('numeric');
            expect(lElementType.alignmentType).toBe('uniform');
            expect(lElementType.numberType).toBe('float');
        });

        await pContext.step('Texture', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultTextureType);

            // Evaluation. Check type details.
            const lUniformType: PgslParserResultTextureType = lBinding.type as PgslParserResultTextureType;
            expect(lUniformType.type).toBe('texture');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.dimension).toBe('2d');
            expect(lUniformType.sampledType).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check sampled type details.
            const lSampledType: PgslParserResultNumericType = lUniformType.sampledType;
            expect(lSampledType.type).toBe('numeric');
            expect(lSampledType.alignmentType).toBe('packed');
            expect(lSampledType.numberType).toBe('float');
        });

        await pContext.step('Sampler none comparison', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: ${PgslSamplerType.typeName.sampler};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultSamplerType);

            // Evaluation. Check type details.
            const lUniformType: PgslParserResultSamplerType = lBinding.type as PgslParserResultSamplerType;
            expect(lUniformType.type).toBe('sampler');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.isComparison).toBeFalsy();
        });

        await pContext.step('Sampler comparison', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: ${PgslSamplerType.typeName.samplerComparison};
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultSamplerType);

            // Evaluation. Check type details.
            const lUniformType: PgslParserResultSamplerType = lBinding.type as PgslParserResultSamplerType;
            expect(lUniformType.type).toBe('sampler');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.isComparison).toBeTruthy();
        });

        await pContext.step('Structure', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                struct TestStruct {
                    property1: ${PgslNumericType.typeName.float32},
                    property2: ${PgslNumericType.typeName.signedInteger}
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: TestStruct;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Evaluation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(2);

            // Evaluation. Check first property details.
            const lProperty1: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lProperty1.name).toBe('property1');
            expect(lProperty1.sizeOverride).toBeUndefined();
            expect(lProperty1.alignmentOverride).toBeUndefined();
            expect(lProperty1.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check first property type details.
            const lProperty1Type: PgslParserResultNumericType = lProperty1.type as PgslParserResultNumericType;
            expect(lProperty1Type.type).toBe('numeric');
            expect(lProperty1Type.alignmentType).toBe('uniform');
            expect(lProperty1Type.numberType).toBe('float');

            // Evaluation. Check second property details.
            const lProperty2: PgslParserResultStructProperty = lStructType.properties[1];
            expect(lProperty2.name).toBe('property2');
            expect(lProperty2.sizeOverride).toBeUndefined();
            expect(lProperty2.alignmentOverride).toBeUndefined();
            expect(lProperty2.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check second property type details.
            const lProperty2Type: PgslParserResultNumericType = lProperty2.type as PgslParserResultNumericType;
            expect(lProperty2Type.type).toBe('numeric');
            expect(lProperty2Type.alignmentType).toBe('uniform');
            expect(lProperty2Type.numberType).toBe('integer');
        });

        await pContext.step('Structure with size attribute', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lSizeValue: number = 256;
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.size}(${lSizeValue})]
                    property1: ${PgslNumericType.typeName.float32}
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: TestStruct;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Evaluation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(1);

            // Evaluation. Check first property details.
            const lProperty1: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lProperty1.name).toBe('property1');
            expect(lProperty1.sizeOverride).toBe(lSizeValue);
            expect(lProperty1.alignmentOverride).toBeUndefined();
            expect(lProperty1.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check first property type details.
            const lProperty1Type: PgslParserResultNumericType = lProperty1.type as PgslParserResultNumericType;
            expect(lProperty1Type.type).toBe('numeric');
            expect(lProperty1Type.alignmentType).toBe('uniform');
            expect(lProperty1Type.numberType).toBe('float');

        });

        await pContext.step('Structure with align attribute', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lAlignValue: number = 16;
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(${lAlignValue})]
                    property1: ${PgslNumericType.typeName.float32}
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: TestStruct;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Evaluation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(1);

            // Evaluation. Check first property details.
            const lProperty1: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lProperty1.name).toBe('property1');
            expect(lProperty1.sizeOverride).toBeUndefined();
            expect(lProperty1.alignmentOverride).toBe(lAlignValue);
            expect(lProperty1.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check first property type details.
            const lProperty1Type: PgslParserResultNumericType = lProperty1.type as PgslParserResultNumericType;
            expect(lProperty1Type.type).toBe('numeric');
            expect(lProperty1Type.alignmentType).toBe('uniform');
            expect(lProperty1Type.numberType).toBe('float');
        });

        await pContext.step('Structure with size and align attribute', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lSizeValue: number = 256;
            const lAlignValue: number = 16;
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.size}(${lSizeValue})]
                    [${AttributeListAst.attributeNames.align}(${lAlignValue})]
                    property1: ${PgslNumericType.typeName.float32}
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: TestStruct;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Evaluation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(1);

            // Evaluation. Check first property details.
            const lProperty1: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lProperty1.name).toBe('property1');
            expect(lProperty1.sizeOverride).toBe(lSizeValue);
            expect(lProperty1.alignmentOverride).toBe(lAlignValue);
            expect(lProperty1.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check first property type details.
            const lProperty1Type: PgslParserResultNumericType = lProperty1.type as PgslParserResultNumericType;
            expect(lProperty1Type.type).toBe('numeric');
            expect(lProperty1Type.alignmentType).toBe('uniform');
            expect(lProperty1Type.numberType).toBe('float');
        });

        await pContext.step('Structure nested', async () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                struct InnerStruct {
                    property2: ${PgslNumericType.typeName.float32}
                }
                struct OuterStruct {
                    property1: InnerStruct
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform testVariable: OuterStruct;
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Evaluation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Evaluation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(1);

            // Evaluation. Check first property details.
            const lLevel1Property: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lLevel1Property.name).toBe('property1');
            expect(lLevel1Property.sizeOverride).toBeUndefined();
            expect(lLevel1Property.alignmentOverride).toBeUndefined();
            expect(lLevel1Property.type).toBeInstanceOf(PgslParserResultStructType);

            // Evaluation. Check first property type details.
            const lLevel1PropertyType: PgslParserResultStructType = lLevel1Property.type as PgslParserResultStructType;
            expect(lLevel1PropertyType.type).toBe('struct');
            expect(lLevel1PropertyType.alignmentType).toBe('uniform');
            expect(lLevel1PropertyType.properties).toHaveLength(1);

            // Evaluation. Check inner property details.
            const lLevel2Property: PgslParserResultStructProperty = lLevel1PropertyType.properties[0];
            expect(lLevel2Property.name).toBe('property2');
            expect(lLevel2Property.sizeOverride).toBeUndefined();
            expect(lLevel2Property.alignmentOverride).toBeUndefined();
            expect(lLevel2Property.type).toBeInstanceOf(PgslParserResultNumericType);

            // Evaluation. Check inner property type details.
            const lLevel2PropertyType: PgslParserResultNumericType = lLevel2Property.type as PgslParserResultNumericType;
            expect(lLevel2PropertyType.type).toBe('numeric');
            expect(lLevel2PropertyType.alignmentType).toBe('uniform');
            expect(lLevel2PropertyType.numberType).toBe('float');
        });
    });

    await pContext.step('Storage', async () => { });
});
