import { expect } from '@kartoffelgames/core-test';
import { VariableDeclarationAst } from "../../../source/abstract_syntax_tree/declaration/variable-declaration-ast.ts";
import { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { LiteralValueExpressionAst } from "../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts";
import { NewExpressionAst } from "../../../source/abstract_syntax_tree/expression/single_value/new-expression-ast.ts";
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../../../source/abstract_syntax_tree/general/type-declaration-ast.ts';
import { PgslDeclarationType } from '../../../source/enum/pgsl-declaration-type.enum.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslParserResultBinding } from "../../../source/parser_result/pgsl-parser-result-binding.ts";
import { PgslParserResultParameter } from "../../../source/parser_result/pgsl-parser-result-parameter.ts";
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { PgslParserResultArrayType } from "../../../source/parser_result/type/pgsl-parser-result-array-type.ts";
import { PgslParserResultBooleanType } from "../../../source/parser_result/type/pgsl-parser-result-boolean-type.ts";
import { PgslParserResultMatrixType } from "../../../source/parser_result/type/pgsl-parser-result-matrix-type.ts";
import { PgslParserResultNumericType } from "../../../source/parser_result/type/pgsl-parser-result-numeric-type.ts";
import { PgslParserResultSamplerType } from "../../../source/parser_result/type/pgsl-parser-result-sampler-type.ts";
import { PgslParserResultStructProperty, PgslParserResultStructType } from "../../../source/parser_result/type/pgsl-parser-result-struct-type.ts";
import { PgslParserResultTextureType } from "../../../source/parser_result/type/pgsl-parser-result-texture-type.ts";
import { PgslParserResultVectorType } from "../../../source/parser_result/type/pgsl-parser-result-vector-type.ts";
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslArrayType } from '../../../source/type/pgsl-array-type.ts';
import { PgslBooleanType } from "../../../source/type/pgsl-boolean-type.ts";
import { PgslMatrixType } from '../../../source/type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../source/type/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../../source/type/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../source/type/pgsl-vector-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableDeclarationAst - Parsing', async (pContext) => {
    await pContext.step('Const', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lDeclarationType: string = 'const';
            const lVariableName: string = 'testVariable';
            const lVariableType: string = PgslNumericType.typeName.float32;
            const lVariableValue: string = '5.0';
            const lCodeText: string = `${lDeclarationType} ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Const);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeInstanceOf(LiteralValueExpressionAst);
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableType: string = `${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>`;
            const lVariableValue: string = `new ${PgslVectorType.typeName.vector2}(0, 0)`;
            const lCodeText: string = `const ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Const);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeInstanceOf(NewExpressionAst);
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableType: string = `${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>`;
            const lVariableValue: string = `new ${PgslMatrixType.typeName.matrix22}(0, 0, 0, 0)`;
            const lCodeText: string = `const ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Const);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeInstanceOf(NewExpressionAst);
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lVariableType: string = `${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},2>`;
            const lVariableValue: string = `new ${PgslArrayType.typeName.array}(0, 0)`;
            const lCodeText: string = `const ${lVariableName}: ${lVariableType} = ${lVariableValue};`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Const);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeInstanceOf(NewExpressionAst);
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

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Storage texture type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, AccessMode.ReadWrite>;
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('GroupBinding attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'myGroup';
            const lBindingName: string = 'myBinding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('AccessMode attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.Read)]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Storage);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
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

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Sampler type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslSamplerType.typeName.sampler};
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Texture type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('GroupBinding attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'myGroup';
            const lBindingName: string = 'myBinding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('AccessMode attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.Read)]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Uniform);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });
    });

    await pContext.step('Workgroup', async (pContext) => {
        await pContext.step('Numeric type without initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslNumericType.typeName.float32};`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Numeric type with initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeInstanceOf(LiteralValueExpressionAst);
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `workgroup ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Workgroup);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });
    });

    await pContext.step('Private', async (pContext) => {
        await pContext.step('Numeric type without initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslNumericType.typeName.float32};`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Numeric type with initializer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.data.expression).toBeInstanceOf(LiteralValueExpressionAst);
        });

        await pContext.step('Vector type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Matrix type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.expression).toBeNull();
        });

        await pContext.step('Array type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `private ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},10>;`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Private);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeNull();
        });
    });

    await pContext.step('Param', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lVariableValue: string = '2.0';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.float32} = ${lVariableValue};`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Param);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeInstanceOf(LiteralValueExpressionAst);
        });

        await pContext.step('Boolean type', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslBooleanType.typeName.boolean} = true;`;

            // Execute.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Validation.
            expect(lDocument.data.content).toHaveLength(1);
            const lDeclarationNode: VariableDeclarationAst = lDocument.data.content[0] as VariableDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(VariableDeclarationAst);
            expect(lDeclarationNode.data.declarationType).toBe(PgslDeclarationType.Param);
            expect(lDeclarationNode.data.name).toBe(lVariableName);
            expect(lDeclarationNode.data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.expression).toBeInstanceOf(LiteralValueExpressionAst);
        });
    });
});

Deno.test('VariableDeclarationAst - Transpilation', async (pContext) => {
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage ${lVariableName}: ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, AccessMode.Write>;
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
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.ReadWrite)]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform ${lVariableName}: ${PgslSamplerType.typeName.sampler};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
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

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.source).toBe(
                `@group(0)@binding(0)var ${lVariableName}:texture_2d<f32>;`
            );
        });

        await pContext.step('GroupBinding attribute', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = '2';
            const lBindingName: string = '3';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.Read)]
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

Deno.test('VariableDeclarationAst - Parser Result', async (pContext) => {
    await pContext.step('Param', async (pContext) => {
        await pContext.step('Numeric float', async () => {
            // Setup.
            const lVariableName: string = 'testParam';
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.float32} = 2.0;`;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of parameters.
            expect(lTranspilationResult.incidents).toHaveLength(0);
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
            expect(lTranspilationResult.incidents).toHaveLength(0);
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
            expect(lTranspilationResult.incidents).toHaveLength(0);
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
            expect(lTranspilationResult.incidents).toHaveLength(0);
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
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
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

        await pContext.step('Numeric signed integer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.signedInteger};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
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
            expect(lUniformType.numberType).toBe('integer');
        });

        await pContext.step('Numeric unsigned integer', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
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
            expect(lUniformType.numberType).toBe('unsigned-integer');
        });

        await pContext.step('Vector', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultVectorType);

            // Validation. Check type details.
            const lUniformType: PgslParserResultVectorType = lBinding.type as PgslParserResultVectorType;
            expect(lUniformType.type).toBe('vector');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.dimension).toBe(3);
            expect(lUniformType.elementType).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check element type details.
            const lElementType: PgslParserResultNumericType = lUniformType.elementType as PgslParserResultNumericType;
            expect(lElementType.type).toBe('numeric');
            expect(lElementType.alignmentType).toBe('uniform');
            expect(lElementType.numberType).toBe('float');
        });

        await pContext.step('Matrix', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslMatrixType.typeName.matrix32}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultMatrixType);

            // Validation. Check type details.
            const lUniformType: PgslParserResultMatrixType = lBinding.type as PgslParserResultMatrixType;
            expect(lUniformType.type).toBe('matrix');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.columns).toBe(3);
            expect(lUniformType.rows).toBe(2);
            expect(lUniformType.elementType).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check element type details.
            const lElementType: PgslParserResultNumericType = lUniformType.elementType as PgslParserResultNumericType;
            expect(lElementType.type).toBe('numeric');
            expect(lElementType.alignmentType).toBe('uniform');
            expect(lElementType.numberType).toBe('float');
        });

        await pContext.step('Array', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 10>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultArrayType);

            // Validation. Check type details.
            const lUniformType: PgslParserResultArrayType = lBinding.type as PgslParserResultArrayType;
            expect(lUniformType.type).toBe('array');
            expect(lUniformType.alignmentType).toBe('uniform');
            expect(lUniformType.length).toBe(10);
            expect(lUniformType.elementType).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check element type details.
            const lElementType: PgslParserResultNumericType = lUniformType.elementType as PgslParserResultNumericType;
            expect(lElementType.type).toBe('numeric');
            expect(lElementType.alignmentType).toBe('uniform');
            expect(lElementType.numberType).toBe('float');
        });

        await pContext.step('Texture', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultTextureType);

            // Validation. Check type details.
            const lUniformType: PgslParserResultTextureType = lBinding.type as PgslParserResultTextureType;
            expect(lUniformType.type).toBe('texture');
            expect(lUniformType.alignmentType).toBe('packed'); // Textures are always 'packed' aligned.
            expect(lUniformType.dimension).toBe('2d');
            expect(lUniformType.sampledType).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check sampled type details.
            const lSampledType: PgslParserResultNumericType = lUniformType.sampledType;
            expect(lSampledType.type).toBe('numeric');
            expect(lSampledType.alignmentType).toBe('packed');
            expect(lSampledType.numberType).toBe('float');
        });

        await pContext.step('Sampler none comparison', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslSamplerType.typeName.sampler};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultSamplerType);

            // Validation. Check type details.
            const lUniformType: PgslParserResultSamplerType = lBinding.type as PgslParserResultSamplerType;
            expect(lUniformType.type).toBe('sampler');
            expect(lUniformType.alignmentType).toBe('packed'); // Samplers are always 'packed' aligned.
            expect(lUniformType.isComparison).toBeFalsy();
        });

        await pContext.step('Sampler comparison', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${PgslSamplerType.typeName.samplerComparison};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultSamplerType);

            // Validation. Check type details.
            const lUniformType: PgslParserResultSamplerType = lBinding.type as PgslParserResultSamplerType;
            expect(lUniformType.type).toBe('sampler');
            expect(lUniformType.alignmentType).toBe('packed'); // Samplers are always 'packed' aligned.
            expect(lUniformType.isComparison).toBeTruthy();
        });

        await pContext.step('Structure', async () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                struct ${lStructName} {
                    property1: ${PgslNumericType.typeName.float32},
                    property2: ${PgslNumericType.typeName.signedInteger}
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${lStructName};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Validation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(2);

            // Validation. Check first property details.
            const lProperty1: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lProperty1.name).toBe('property1');
            expect(lProperty1.sizeOverride).toBeUndefined();
            expect(lProperty1.alignmentOverride).toBeUndefined();
            expect(lProperty1.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check first property type details.
            const lProperty1Type: PgslParserResultNumericType = lProperty1.type as PgslParserResultNumericType;
            expect(lProperty1Type.type).toBe('numeric');
            expect(lProperty1Type.alignmentType).toBe('uniform');
            expect(lProperty1Type.numberType).toBe('float');

            // Validation. Check second property details.
            const lProperty2: PgslParserResultStructProperty = lStructType.properties[1];
            expect(lProperty2.name).toBe('property2');
            expect(lProperty2.sizeOverride).toBeUndefined();
            expect(lProperty2.alignmentOverride).toBeUndefined();
            expect(lProperty2.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check second property type details.
            const lProperty2Type: PgslParserResultNumericType = lProperty2.type as PgslParserResultNumericType;
            expect(lProperty2Type.type).toBe('numeric');
            expect(lProperty2Type.alignmentType).toBe('uniform');
            expect(lProperty2Type.numberType).toBe('integer');
        });

        await pContext.step('Structure with size attribute', async () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lSizeValue: number = 256;
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.size}(${lSizeValue})]
                    property1: ${PgslNumericType.typeName.float32}
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${lStructName};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Validation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(1);

            // Validation. Check first property details.
            const lProperty1: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lProperty1.name).toBe('property1');
            expect(lProperty1.sizeOverride).toBe(lSizeValue);
            expect(lProperty1.alignmentOverride).toBeUndefined();
            expect(lProperty1.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check first property type details.
            const lProperty1Type: PgslParserResultNumericType = lProperty1.type as PgslParserResultNumericType;
            expect(lProperty1Type.type).toBe('numeric');
            expect(lProperty1Type.alignmentType).toBe('uniform');
            expect(lProperty1Type.numberType).toBe('float');

        });

        await pContext.step('Structure with align attribute', async () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lAlignValue: number = 16;
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.align}(${lAlignValue})]
                    property1: ${PgslNumericType.typeName.float32}
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${lStructName};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Validation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(1);

            // Validation. Check first property details.
            const lProperty1: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lProperty1.name).toBe('property1');
            expect(lProperty1.sizeOverride).toBeUndefined();
            expect(lProperty1.alignmentOverride).toBe(lAlignValue);
            expect(lProperty1.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check first property type details.
            const lProperty1Type: PgslParserResultNumericType = lProperty1.type as PgslParserResultNumericType;
            expect(lProperty1Type.type).toBe('numeric');
            expect(lProperty1Type.alignmentType).toBe('uniform');
            expect(lProperty1Type.numberType).toBe('float');
        });

        await pContext.step('Structure with size and align attribute', async () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lSizeValue: number = 256;
            const lAlignValue: number = 16;
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.size}(${lSizeValue})]
                    [${AttributeListAst.attributeNames.align}(${lAlignValue})]
                    property1: ${PgslNumericType.typeName.float32}
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${lStructName};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Validation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(1);

            // Validation. Check first property details.
            const lProperty1: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lProperty1.name).toBe('property1');
            expect(lProperty1.sizeOverride).toBe(lSizeValue);
            expect(lProperty1.alignmentOverride).toBe(lAlignValue);
            expect(lProperty1.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check first property type details.
            const lProperty1Type: PgslParserResultNumericType = lProperty1.type as PgslParserResultNumericType;
            expect(lProperty1Type.type).toBe('numeric');
            expect(lProperty1Type.alignmentType).toBe('uniform');
            expect(lProperty1Type.numberType).toBe('float');
        });

        await pContext.step('Structure nested', async () => {
            // Setup.
            const lInnerStructName: string = 'InnerStruct';
            const lOuterStructName: string = 'OuterStruct';
            const lVariableName: string = 'testVariable';
            const lGroupName: string = 'test_group';
            const lLocationName: string = 'test_binding';
            const lCodeText: string = `
                struct ${lInnerStructName} {
                    property2: ${PgslNumericType.typeName.float32}
                }
                struct ${lOuterStructName} {
                    property1: ${lInnerStructName}
                }
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lLocationName}")]
                uniform ${lVariableName}: ${lOuterStructName};
            `;

            // Execute.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Validation. Count of bindings.
            expect(lTranspilationResult.incidents).toHaveLength(0);
            expect(lTranspilationResult.bindings).toHaveLength(1);

            // Validation. Check binding details.
            const lBinding: PgslParserResultBinding = lTranspilationResult.bindings[0];
            expect(lBinding.bindGroupName).toBe(lGroupName);
            expect(lBinding.bindGroupIndex).toBe(0);
            expect(lBinding.bindLocationName).toBe(lLocationName);
            expect(lBinding.bindLocationIndex).toBe(0);
            expect(lBinding.bindingType).toBe('uniform');
            expect(lBinding.type).toBeInstanceOf(PgslParserResultStructType);

            // Validation. Check structure type details.
            const lStructType: PgslParserResultStructType = lBinding.type as PgslParserResultStructType;
            expect(lStructType.type).toBe('struct');
            expect(lStructType.alignmentType).toBe('uniform');
            expect(lStructType.properties).toHaveLength(1);

            // Validation. Check first property details.
            const lLevel1Property: PgslParserResultStructProperty = lStructType.properties[0];
            expect(lLevel1Property.name).toBe('property1');
            expect(lLevel1Property.sizeOverride).toBeUndefined();
            expect(lLevel1Property.alignmentOverride).toBeUndefined();
            expect(lLevel1Property.type).toBeInstanceOf(PgslParserResultStructType);

            // Validation. Check first property type details.
            const lLevel1PropertyType: PgslParserResultStructType = lLevel1Property.type as PgslParserResultStructType;
            expect(lLevel1PropertyType.type).toBe('struct');
            expect(lLevel1PropertyType.alignmentType).toBe('uniform');
            expect(lLevel1PropertyType.properties).toHaveLength(1);

            // Validation. Check inner property details.
            const lLevel2Property: PgslParserResultStructProperty = lLevel1PropertyType.properties[0];
            expect(lLevel2Property.name).toBe('property2');
            expect(lLevel2Property.sizeOverride).toBeUndefined();
            expect(lLevel2Property.alignmentOverride).toBeUndefined();
            expect(lLevel2Property.type).toBeInstanceOf(PgslParserResultNumericType);

            // Validation. Check inner property type details.
            const lLevel2PropertyType: PgslParserResultNumericType = lLevel2Property.type as PgslParserResultNumericType;
            expect(lLevel2PropertyType.type).toBe('numeric');
            expect(lLevel2PropertyType.alignmentType).toBe('uniform');
            expect(lLevel2PropertyType.numberType).toBe('float');
        });
    });

    await pContext.step('Storage', async () => { });
});

Deno.test('VariableDeclarationAst - Error Cases', async (pContext) => {
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
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.Read)]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.vertex}()]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
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
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.vertex}()]
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
