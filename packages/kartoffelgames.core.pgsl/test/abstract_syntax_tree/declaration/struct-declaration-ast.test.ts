import { expect } from '@kartoffelgames/core-test';
import { StructDeclarationAst } from '../../../source/abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import { StructPropertyDeclarationAst } from '../../../source/abstract_syntax_tree/declaration/struct-property-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { TypeDeclarationAst } from '../../../source/abstract_syntax_tree/general/type-declaration-ast.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('StructDeclarationAst - Parsing', async (pContext) => {
    await pContext.step('Types', async (pContext) => {
        await pContext.step('Numeric property', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'testProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslNumericType.typeName.signedInteger}
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.data.content).toHaveLength(1);

            // Evaluation. Correct type of child node.
            const lDeclarationNode: StructDeclarationAst = lDocument.data.content[0] as StructDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(StructDeclarationAst);

            // Evaluation. Correct structure.
            expect(lDeclarationNode.data.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.data.properties).toHaveLength(1);
            expect(lDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[0].data.name).toBe(lPropertyName);
            expect(lDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
        });

        await pContext.step('Vector property', () => {
            // Setup.
            const lStructName: string = 'TestVectorStruct';
            const lVec2PropertyName: string = 'vec2Property';
            const lVec3PropertyName: string = 'vec3Property';
            const lVec4PropertyName: string = 'vec4Property';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lVec2PropertyName}: Vector2<${PgslNumericType.typeName.float32}>,
                    ${lVec3PropertyName}: Vector3<${PgslNumericType.typeName.float32}>,
                    ${lVec4PropertyName}: Vector4<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: StructDeclarationAst = lDocument.data.content[0] as StructDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.data.properties).toHaveLength(3);
            expect(lDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[0].data.name).toBe(lVec2PropertyName);
            expect(lDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.properties[1]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[1].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[1].data.name).toBe(lVec3PropertyName);
            expect(lDeclarationNode.data.properties[1].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.properties[2]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[2].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[2].data.name).toBe(lVec4PropertyName);
            expect(lDeclarationNode.data.properties[2].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
        });

        await pContext.step('Array property', () => {
            // Setup.
            const lStructName: string = 'TestArrayStruct';
            const lArrayPropertyName: string = 'arrayProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lArrayPropertyName}: Array<${PgslNumericType.typeName.float32}, 10>
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: StructDeclarationAst = lDocument.data.content[0] as StructDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.data.properties).toHaveLength(1);
            expect(lDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[0].data.name).toBe(lArrayPropertyName);
            expect(lDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
        });

        await pContext.step('Struct property', () => {
            // Setup.
            const lOuterStructName: string = 'TestOuterStruct';
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct TestInnerStruct {
                    innerProperty: ${PgslNumericType.typeName.float32}
                }
                struct ${lOuterStructName} {
                    ${lNestedPropertyName}: TestInnerStruct
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.data.content).toHaveLength(2);

            // Evaluation. Correct structure.
            const lDeclarationNode: StructDeclarationAst = lDocument.data.content[1] as StructDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lOuterStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.data.properties).toHaveLength(1);
            expect(lDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[0].data.name).toBe(lNestedPropertyName);
            expect(lDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
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
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: StructDeclarationAst = lDocument.data.content[1] as StructDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.data.properties).toHaveLength(1);
            expect(lDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[0].data.name).toBe(lPropertyName);
            expect(lDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
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
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: StructDeclarationAst = lDocument.data.content[0] as StructDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.data.properties).toHaveLength(1);
            expect(lDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[0].data.name).toBe(lDynamicPropertyName);
            expect(lDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
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
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: StructDeclarationAst = lDocument.data.content[0] as StructDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.data.properties).toHaveLength(2);
            expect(lDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[0].data.name).toBe(lRegularPropertyName);
            expect(lDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.properties[1]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[1].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[1].data.name).toBe(lDynamicPropertyName);
            expect(lDeclarationNode.data.properties[1].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
        });

        await pContext.step('Multiple static arrays with ending dynamic Array property', () => {
            // Setup.
            const lStructName: string = 'TestMixedArrayStruct';
            const lStaticArrayPropertyName: string = 'staticArrayProperty';
            const lDynamicArrayPropertyName: string = 'dynamicArrayProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lStaticArrayPropertyName}: Array<${PgslNumericType.typeName.signedInteger}, 5>,
                    ${lDynamicArrayPropertyName}: Array<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: StructDeclarationAst = lDocument.data.content[0] as StructDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.data.properties).toHaveLength(2);
            expect(lDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[0].data.name).toBe(lStaticArrayPropertyName);
            expect(lDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
            expect(lDeclarationNode.data.properties[1]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[1].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[1].data.name).toBe(lDynamicArrayPropertyName);
            expect(lDeclarationNode.data.properties[1].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
        });

        await pContext.step('Valid dynamic array inside nested struct', () => {
            // Setup.
            const lOuterStructName: string = 'TestOuterStruct';
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct TestInnerStruct {
                    dynamicProperty: Array<${PgslNumericType.typeName.float32}>
                }
                struct ${lOuterStructName} {
                    ${lNestedPropertyName}: TestInnerStruct
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct structure.
            expect(lDocument.data.content).toHaveLength(2);
            const lDeclarationNode: StructDeclarationAst = lDocument.data.content[1] as StructDeclarationAst;
            expect(lDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lDeclarationNode.data.name).toBe(lOuterStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.data.properties).toHaveLength(1);
            expect(lDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lDeclarationNode.data.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.data.properties[0].data.name).toBe(lNestedPropertyName);
            expect(lDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
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
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.data.content).toHaveLength(2);

            // Evaluation. Both declarations are correct type.
            const lInnerDeclarationNode: StructDeclarationAst = lDocument.data.content[0] as StructDeclarationAst;
            const lOuterDeclarationNode: StructDeclarationAst = lDocument.data.content[1] as StructDeclarationAst;
            expect(lInnerDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lOuterDeclarationNode).toBeInstanceOf(StructDeclarationAst);
            expect(lInnerDeclarationNode.data.name).toBe(lInnerStructName);
            expect(lOuterDeclarationNode.data.name).toBe(lOuterStructName);

            // Evaluation. Inner struct properties.
            expect(lInnerDeclarationNode.data.properties).toHaveLength(1);
            expect(lInnerDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lInnerDeclarationNode.data.properties[0].struct).toBe(lInnerDeclarationNode);
            expect(lInnerDeclarationNode.data.properties[0].data.name).toBe(lInnerPropertyName);
            expect(lInnerDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);

            // Evaluation. Outer struct properties.
            expect(lOuterDeclarationNode.data.properties).toHaveLength(1);
            expect(lOuterDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lOuterDeclarationNode.data.properties[0].struct).toBe(lOuterDeclarationNode);
            expect(lOuterDeclarationNode.data.properties[0].data.name).toBe(lNestedPropertyName);
            expect(lOuterDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
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
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.data.content).toHaveLength(3);

            // Evaluation. All declarations are correct type.
            const lFirstDeclarationNode: StructDeclarationAst = lDocument.data.content[0] as StructDeclarationAst;
            const lSecondDeclarationNode: StructDeclarationAst = lDocument.data.content[1] as StructDeclarationAst;
            const lThirdDeclarationNode: StructDeclarationAst = lDocument.data.content[2] as StructDeclarationAst;
            expect(lFirstDeclarationNode.data.name).toBe(lFirstStructName);
            expect(lSecondDeclarationNode.data.name).toBe(lSecondStructName);
            expect(lThirdDeclarationNode.data.name).toBe(lThirdStructName);

            // Evaluation. First struct properties.
            expect(lFirstDeclarationNode.data.properties).toHaveLength(1);
            expect(lFirstDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lFirstDeclarationNode.data.properties[0].struct).toBe(lFirstDeclarationNode);
            expect(lFirstDeclarationNode.data.properties[0].data.name).toBe(lFirstPropertyName);
            expect(lFirstDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);

            // Evaluation. Second struct properties.
            expect(lSecondDeclarationNode.data.properties).toHaveLength(1);
            expect(lSecondDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lSecondDeclarationNode.data.properties[0].struct).toBe(lSecondDeclarationNode);
            expect(lSecondDeclarationNode.data.properties[0].data.name).toBe(lSecondPropertyName);
            expect(lSecondDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);

            // Evaluation. Third struct properties.
            expect(lThirdDeclarationNode.data.properties).toHaveLength(1);
            expect(lThirdDeclarationNode.data.properties[0]).toBeInstanceOf(StructPropertyDeclarationAst);
            expect(lThirdDeclarationNode.data.properties[0].struct).toBe(lThirdDeclarationNode);
            expect(lThirdDeclarationNode.data.properties[0].data.name).toBe(lThirdPropertyName);
            expect(lThirdDeclarationNode.data.properties[0].data.typeDeclaration).toBeInstanceOf(TypeDeclarationAst);
        });
    });
});
