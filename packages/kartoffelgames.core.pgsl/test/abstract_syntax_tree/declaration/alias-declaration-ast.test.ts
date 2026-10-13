import { expect } from '@kartoffelgames/core-test';
import { AliasDeclarationAst } from '../../../source/abstract_syntax_tree/declaration/alias-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslStructType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-struct-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AliasDeclarationAst - Parsing', async (pContext) => {
    await pContext.step('Scalar Types', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lAliasName: string = 'TestFloatAlias';
            const lCodeText: string = `alias ${lAliasName} = ${PgslNumericType.typeName.float32};`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.data.content).toHaveLength(1);

            // Evaluation. Correct type of child node.
            const lDeclarationNode: AliasDeclarationAst = lDocument.data.content[0] as AliasDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(AliasDeclarationAst);

            // Evaluation. Correct structure.
            expect(lDeclarationNode.data.aliasName).toBe(lAliasName);
            expect(lDeclarationNode.data.underlyingType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lAliasName: string = 'TestIntegerAlias';
            const lCodeText: string = `alias ${lAliasName} = ${PgslNumericType.typeName.signedInteger};`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: AliasDeclarationAst = lDocument.data.content[0] as AliasDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(AliasDeclarationAst);
            expect(lDeclarationNode.data.aliasName).toBe(lAliasName);
            expect(lDeclarationNode.data.underlyingType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Boolean', () => {
            // Setup.
            const lAliasName: string = 'TestBooleanAlias';
            const lCodeText: string = `alias ${lAliasName} = bool;`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: AliasDeclarationAst = lDocument.data.content[0] as AliasDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(AliasDeclarationAst);
            expect(lDeclarationNode.data.aliasName).toBe(lAliasName);
            expect(lDeclarationNode.data.underlyingType).toBeInstanceOf(PgslBooleanType);
        });
    });

    await pContext.step('Templated Types', async (pContext) => {
        await pContext.step('Array', () => {
            // Setup.
            const lAliasName: string = 'TestArrayAlias';
            const lCodeText: string = `alias ${lAliasName} = Array<${PgslNumericType.typeName.float32}, 10>;`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: AliasDeclarationAst = lDocument.data.content[0] as AliasDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(AliasDeclarationAst);
            expect(lDeclarationNode.data.aliasName).toBe(lAliasName);
            expect(lDeclarationNode.data.underlyingType).toBeInstanceOf(PgslArrayType);
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lAliasName: string = 'TestVectorAlias';
            const lCodeText: string = `alias ${lAliasName} = Vector3<${PgslNumericType.typeName.float32}>;`;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: AliasDeclarationAst = lDocument.data.content[0] as AliasDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(AliasDeclarationAst);
            expect(lDeclarationNode.data.aliasName).toBe(lAliasName);
            expect(lDeclarationNode.data.underlyingType).toBeInstanceOf(PgslVectorType);
        });
    });

    await pContext.step('Complex Types', async (pContext) => {
        await pContext.step('Struct', () => {
            // Setup.
            const lAliasName: string = 'TestStructAlias';
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
                alias ${lAliasName} = TestStruct;
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.data.content).toHaveLength(2);

            // Evaluation. Correct structure.
            const lDeclarationNode: AliasDeclarationAst = lDocument.data.content[1] as AliasDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(AliasDeclarationAst);
            expect(lDeclarationNode.data.aliasName).toBe(lAliasName);
            expect(lDeclarationNode.data.underlyingType).toBeInstanceOf(PgslStructType);
        });

        await pContext.step('Alias', () => {
            // Setup.
            const lFirstAliasName: string = 'TestFloatAlias';
            const lSecondAliasName: string = 'TestAliasedAlias';
            const lCodeText: string = `
                alias ${lFirstAliasName} = ${PgslNumericType.typeName.float32};
                alias ${lSecondAliasName} = ${lFirstAliasName};
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.data.content).toHaveLength(2);

            // Evaluation. Both declarations are correct type.
            const lFirstDeclarationNode: AliasDeclarationAst = lDocument.data.content[0] as AliasDeclarationAst;
            const lSecondDeclarationNode: AliasDeclarationAst = lDocument.data.content[1] as AliasDeclarationAst;
            expect(lFirstDeclarationNode).toBeInstanceOf(AliasDeclarationAst);
            expect(lSecondDeclarationNode).toBeInstanceOf(AliasDeclarationAst);
            expect(lFirstDeclarationNode.data.aliasName).toBe(lFirstAliasName);
            expect(lFirstDeclarationNode.data.underlyingType).toBeInstanceOf(PgslNumericType);
            expect(lSecondDeclarationNode.data.aliasName).toBe(lSecondAliasName);
            expect(lSecondDeclarationNode.data.underlyingType).toBeInstanceOf(PgslNumericType);
        });
    });
});
