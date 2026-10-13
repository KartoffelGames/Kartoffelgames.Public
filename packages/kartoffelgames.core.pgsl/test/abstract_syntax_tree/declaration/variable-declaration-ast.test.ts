import { expect } from '@kartoffelgames/core-test';
import { VariableDeclarationAst } from '../../../source/abstract_syntax_tree/declaration/variable-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { LiteralValueExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import { NewExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/new-expression-ast.ts';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { TypeDeclarationAst } from '../../../source/abstract_syntax_tree/general/type-declaration-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslDeclarationType } from '../../../source/enum/pgsl-declaration-type.enum.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableDeclarationAst - Parsing', async (pContext) => {
    await pContext.step('Const', async (pContext) => {
        await pContext.step('Numeric type', async () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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
            const lCodeText: string = `const ${lVariableName}: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(0, 0);`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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
            const lCodeText: string = `const ${lVariableName}: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(0, 0, 0, 0);`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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
            const lCodeText: string = `const ${lVariableName}: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32},2> = new ${PgslArrayType.typeName.array}(0, 0);`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("testGroup", "testBinding")]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("testGroup", "testBinding")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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
            const lCodeText: string = `private testVariable: ${PgslNumericType.typeName.float32} = 5.0;`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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
            const lCodeText: string = `param ${lVariableName}: ${PgslNumericType.typeName.float32} = 2.0;`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation.
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
