import { expect } from '@kartoffelgames/core-test';
import { PgslDeclarationType } from '../../../source/enum/pgsl-declaration-type.enum.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslVariableDeclaration } from '../../../source/syntax_tree/declaration/pgsl-variable-declaration.ts';
import { PgslExpression } from '../../../source/syntax_tree/expression/pgsl-expression.ts';
import { PgslTypeDeclaration } from '../../../source/syntax_tree/general/pgsl-type-declaration.ts';
import { PgslAttributeList } from '../../../source/syntax_tree/general/pgsl-attribute-list.ts';
import { PgslDocument } from '../../../source/syntax_tree/pgsl-document.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/type/pgsl-vector-type.ts';
import { PgslMatrixType } from '../../../source/type/pgsl-matrix-type.ts';
import { PgslArrayType } from '../../../source/type/pgsl-array-type.ts';
import { PgslTextureType } from '../../../source/type/pgsl-texture-type.ts';
import { PgslSamplerType } from '../../../source/type/pgsl-sampler-type.ts';
import { PgslBooleanType } from "../../../source/type/pgsl-boolean-type.ts";
import { PgslParserResultParameter } from "../../../source/parser_result/pgsl-parser-result-parameter.ts";
import { PgslParserResultNumericType } from "../../../source/parser_result/type/pgsl-parser-result-numeric-type.ts";
import { PgslParserResultBooleanType } from "../../../source/parser_result/type/pgsl-parser-result-boolean-type.ts";
import { PgslParserResultBinding } from "../../../source/parser_result/pgsl-parser-result-binding.ts";

// TODO: Check PgslParserResult for registered bindings.

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslVariableDeclaration - Parsing', async (pContext) => {
    await pContext.step('Const', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lDeclarationType: string = 'const';
            const lVariableName: string = 'testVariable';
            const lVariableType: string = PgslNumericType.typeName.float32;
            const lVariableValue: string = '5.0';
            const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Const);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeInstanceOf(PgslExpression as any);
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableType: string = `${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>`;
            const lVariableValue: string = `new ${PgslVectorType.typeName.vector2}(0, 0)`;
            const lCodeText: string = `const ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Const);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeInstanceOf(PgslExpression as any);
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableType: string = `${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>`;
            const lVariableValue: string = `new ${PgslMatrixType.typeName.matrix22}(0, 0, 0, 0)`;
            const lCodeText: string = `const ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Const);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeInstanceOf(PgslExpression as any);
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableType: string = `${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},2>`;
            const lVariableValue: string = `new ${PgslArrayType.typeName.array}(0, 0)`;
            const lCodeText: string = `const ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Const);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeInstanceOf(PgslExpression as any);
        });
    });

    await pContext.step('Storage', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Storage texture type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslTextureType.typeName.textureStorage2d}<AccessMode.ReadWrite, TexelFormat.Rgba8unorm>;
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('GroupBinding attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'myGroup';
            const lBindingName: string = 'myBinding';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('AccessMode attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                [${PgslAttributeList.attributeNames.accessMode}(AccessMode.Read)]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });
    });

    await pContext.step('Uniform', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Sampler type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslSamplerType.typeName.sampler};
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Texture type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('GroupBinding attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'myGroup';
            const lBindingName: string = 'myBinding';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('AccessMode attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                [${PgslAttributeList.attributeNames.accessMode}(AccessMode.Read)]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });
    });

    await pContext.step('Workgroup', async (pContext) => {
        await pContext.step('Numeric type without initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslNumericType.typeName.float32};`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Numeric type with initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeInstanceOf(PgslExpression as any);
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });
    });

    await pContext.step('Private', async (pContext) => {
        await pContext.step('Numeric type without initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslNumericType.typeName.float32};`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Numeric type with initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.expression).toBeInstanceOf(PgslExpression as any);
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.expression).toBeNull();
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeNull();
        });
    });

    await pContext.step('Param', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lVariableValue: string = '2.0';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.float32} = ${lVariableValue};`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Param);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeInstanceOf(PgslExpression as any);
        });

        await pContext.step('Boolean type', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslBooleanType.typeName.boolean} = true;`;

            // Execute.
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Validation.
            expect(lDocument.childNodes).toHaveLength(1);
            const lDeclarationNode: PgslVariableDeclaration = lDocument.childNodes[0] as PgslVariableDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslVariableDeclaration);
            expect(lDeclarationNode.declarationType).toBe(PgslDeclarationType.Param);
            expect(lDeclarationNode.name).toBe(lVariableName);
            expect(lDeclarationNode.typeDeclaration).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.expression).toBeInstanceOf(PgslExpression as any);
        });
    });
});

Deno.test('PgslVariableDeclaration - Transpilation', async (pContext) => {
    await pContext.step('Const', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = '5.0';
            const lCodeText: string = `const ${lVariableName}: ${PgslNumericType.typeName.float32} = ${lVariableValue};`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:f32=${lVariableValue};`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = `new ${PgslVectorType.typeName.vector2}(0, 0)`;
            const lCodeText: string = `const ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = ${lVariableValue};`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:vec2<f32>=vec2(0,0);`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = `new ${PgslMatrixType.typeName.matrix22}(0, 0, 0, 0)`;
            const lCodeText: string = `const ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = ${lVariableValue};`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:mat2x2<f32>=mat2x2(0,0,0,0);`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableValue: string = `new Array(0, 0)`;
            const lCodeText: string = `const ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},2> = ${lVariableValue};`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `const ${lVariableName}:array<f32,2>=array(${lVariableValue},${lVariableValue});`
            );
        });
    });

    await pContext.step('Storage', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:f32;`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:vec2<f32>;`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:mat2x2<f32>;`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:array<f32,10>;`
            );
        });

        await pContext.step('Storage texture type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslTextureType.typeName.textureStorage2d}<AccessMode.Write, TexelFormat.Rgba8unorm>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
        });

        await pContext.step('GroupBinding attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = '2';
            const lBindingName: string = '3';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<storage,read> ${lVariableName}:f32;`
            );
        });

        await pContext.step('AccessMode attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                [${PgslAttributeList.attributeNames.accessMode}(AccessMode.ReadWrite)]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
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
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:f32;`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:vec2<f32>;`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:mat2x2<f32>;`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:array<f32,10>;`
            );
        });

        await pContext.step('Sampler type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslSamplerType.typeName.sampler};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:sampler;`
            );
        });

        await pContext.step('Texture type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:texture_2d<f32>;`
            );
        });

        await pContext.step('GroupBinding attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = '2';
            const lBindingName: string = '3';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var<uniform> ${lVariableName}:f32;`
            );
        });

        await pContext.step('AccessMode attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                [${PgslAttributeList.attributeNames.accessMode}(AccessMode.Read)]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
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

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:f32;`
            );
        });

        await pContext.step('Numeric type with initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:f32=5.0;`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:vec2<f32>;`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<workgroup> ${lVariableName}:mat2x2<f32>;`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
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

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:f32;`
            );
        });

        await pContext.step('Numeric type with initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:f32=5.0;`
            );
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:vec2<f32>;`
            );
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:mat2x2<f32>;`
            );
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `var<private> ${lVariableName}:array<f32,10>;`
            );
        });
    });

    await pContext.step('Param', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lVariableValue: string = '2.0';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.float32} = ${lVariableValue};`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
        });

        await pContext.step('Boolean type', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslBooleanType.typeName.boolean} = true;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
        });
    });
});

Deno.test('PgslVariableDeclaration - Parser Result', async (pContext) => {
    await pContext.step('Param', async (pContext) => {
        await pContext.step('Numeric float', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.float32} = 2.0;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of parameters.
            expect(lTranspilationResult.parameters).toHaveLength(1);

            // Validation. Check parameter details.
            const lParameter: PgslParserResultParameter = lTranspilationResult.parameters[0];
            expect(lParameter.name).toBe(lVariableName);
            expect(lParameter.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check numeric type details.
            const lParameterType: PgslParserResultNumericType = lParameter.type as PgslParserResultNumericType;
            expect(lParameterType.type).toBe('numeric');
            expect(lParameterType.alignmentType).toBe('packed');
            expect(lParameterType.numberType).toBe('float');
        });

        await pContext.step('Numeric signed integer', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 5;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of parameters.
            expect(lTranspilationResult.parameters).toHaveLength(1);

            // Validation. Check parameter details.
            const lParameter: PgslParserResultParameter = lTranspilationResult.parameters[0];
            expect(lParameter.name).toBe(lVariableName);
            expect(lParameter.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check numeric type details.
            const lParameterType: PgslParserResultNumericType = lParameter.type as PgslParserResultNumericType;
            expect(lParameterType.type).toBe('numeric');
            expect(lParameterType.alignmentType).toBe('packed');
            expect(lParameterType.numberType).toBe('integer');
        });

        await pContext.step('Numeric unsigned integer', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 10u;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of parameters.
            expect(lTranspilationResult.parameters).toHaveLength(1);

            // Validation. Check parameter details.
            const lParameter: PgslParserResultParameter = lTranspilationResult.parameters[0];
            expect(lParameter.name).toBe(lVariableName);
            expect(lParameter.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check numeric type details.
            const lParameterType: PgslParserResultNumericType = lParameter.type as PgslParserResultNumericType;
            expect(lParameterType.type).toBe('numeric');
            expect(lParameterType.alignmentType).toBe('packed');
            expect(lParameterType.numberType).toBe('unsigned-integer');
        });

        await pContext.step('Boolean', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslBooleanType.typeName.boolean} = true;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of parameters.
            expect(lTranspilationResult.parameters).toHaveLength(1);

            // Validation. Check parameter details.
            const lParameter: PgslParserResultParameter = lTranspilationResult.parameters[0];
            expect(lParameter.name).toBe(lVariableName);
            expect(lParameter.type).toBeInstanceOf(PgslParserResultBooleanType);

            // Validation. Check numeric type details.
            const lParameterType: PgslParserResultBooleanType = lParameter.type as PgslParserResultBooleanType;
            expect(lParameterType.type).toBe('boolean');
            expect(lParameterType.alignmentType).toBe('packed');
        });
    });

    await pContext.step('Uniform', async (pContext) => {
        await pContext.step('Numeric float', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check type details.
            const lUniformType: PgslParserResultNumericType = lBinding.type as PgslParserResultNumericType;
            expect(lUniformType.type).toBe('numeric');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.numberType).toBe('float');
        });
    });

    await pContext.step('Storage', async () => {});
});

Deno.test('PgslVariableDeclaration - Error Cases', async (pContext) => {
    await pContext.step('Const', async (pContext) => {
        await pContext.step('Texture type', async () => {
            // Setup.
            const lCodeText: string = `const testVariable: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}> = 5.0;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "const" must be constructible.')
            )).toBe(true);
        });

        await pContext.step('Sampler type', async () => {
            // Setup.
            const lCodeText: string = `const testVariable: ${PgslSamplerType.typeName.sampler} = 5.0;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "const" must be constructible.')
            )).toBe(true);
        });

        await pContext.step('No initializer', async () => {
            // Setup.
            const lCodeText: string = `const testVariable: ${PgslNumericType.typeName.float32};`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Declaration type "const" must have an initializer.')
            )).toBe(true);
        });

        await pContext.step('Expression not constant', async () => {
            // Setup.
            const lCodeText: string = `
                private otherVariable: ${PgslNumericType.typeName.float32} = 3.0;
                const testVariable: ${PgslNumericType.typeName.float32} = otherVariable;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The expression of declaration type "const" must be a constant expression.')
            )).toBe(true);
        });

        await pContext.step('Invalid Attribute', async () => {
            // Setup.
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.accessMode}(AccessMode.Read)]
                const testVariable: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Declaration type "const" does not allow attribute "AccessMode".')
            )).toBe(true);
        });
    });

    await pContext.step('Storage', async (pContext) => {
        await pContext.step('With initializer', async () => {
            // Setup.
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testVariable: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Declaration type "storage" must not have an initializer.')
            )).toBe(true);
        });

        await pContext.step('Sampler type', async () => {
            // Setup.
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testVariable: ${PgslSamplerType.typeName.sampler};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "storage" must be host shareable.')
            )).toBe(true);
        });

        await pContext.step('Invalid Attribute', async () => {
            // Setup.
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                [${PgslAttributeList.attributeNames.vertex}()]
                storage testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Declaration type "storage" does not allow attribute "Vertex".')
            )).toBe(true);
        });
    });

    await pContext.step('Uniform', async (pContext) => {
        await pContext.step('With initializer', async () => {
            // Setup.
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testVariable: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Declaration type "uniform" must not have an initializer.')
            )).toBe(true);
        });

        await pContext.step('Invalid Attribute', async () => {
            // Setup.
            const lCodeText: string = `
                [${PgslAttributeList.attributeNames.groupBinding}("test_group", "test_binding")]
                [${PgslAttributeList.attributeNames.vertex}()]
                uniform testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Declaration type "uniform" does not allow attribute "Vertex".')
            )).toBe(true);
        });
    });

    await pContext.step('Workgroup', async (pContext) => {
        await pContext.step('Texture type', async () => {
            // Setup.
            const lCodeText: string = `workgroup testVariable: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "workgroup" must have a fixed footprint.')
            )).toBe(true);
        });

        await pContext.step('Sampler type', async () => {
            // Setup.
            const lCodeText: string = `workgroup testVariable: ${PgslSamplerType.typeName.sampler};`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "workgroup" must be a plain type.')
            )).toBe(true);
        });
    });

    await pContext.step('Private', async (pContext) => {
        await pContext.step('Texture type', async () => {
            // Setup.
            const lCodeText: string = `private testVariable: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "private" must be constructible.')
            )).toBe(true);
        });

        await pContext.step('Sampler type', async () => {
            // Setup.
            const lCodeText: string = `private testVariable: ${PgslSamplerType.typeName.sampler};`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "private" must be constructible.')
            )).toBe(true);
        });
    });

    await pContext.step('Param', async (pContext) => {
        await pContext.step('Texture type', async () => {
            // Setup.
            const lCodeText: string = `param testParam: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}> = testValue;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "param" must be constructible.')
            )).toBe(true);
        });

        await pContext.step('Sampler type', async () => {
            // Setup.
            const lCodeText: string = `param testParam: ${PgslSamplerType.typeName.sampler} = testValue;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "param" must be constructible.')
            )).toBe(true);
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lCodeText: string = `param testParam: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10> = testValue;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('The type of declaration type "param" must be a scalar type.')
            )).toBe(true);
        });
    });

    await pContext.step('General', async (pContext) => {
        await pContext.step('Expression type not matching variable type', async () => {
            // Setup.
            const lCodeText: string = `const testVariable: ${PgslNumericType.typeName.float32} = true;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Initializing value has incompatible type.')
            )).toBe(true);
        });

        await pContext.step('Duplicate variable names', async () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslNumericType.typeName.float32} = 5.0;
                const testVariable: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Variable with name "testVariable" already defined.')
            )).toBe(true);
        });
    });
});
