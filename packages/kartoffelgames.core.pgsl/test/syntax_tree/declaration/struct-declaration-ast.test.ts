import { expect } from '@kartoffelgames/core-test';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { StructDeclarationAst } from '../../../source/abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { DocumentAst } from "../../../source/abstract_syntax_tree/document-ast.ts";
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { TypeDeclarationAst } from "../../../source/abstract_syntax_tree/general/type-declaration-ast.ts";
import { StructPropertyDeclarationAst } from "../../../source/abstract_syntax_tree/declaration/struct-property-declaration-ast.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('StructDeclarationAst - Parsing', async (pContext) => {
    await pContext.step('Types', async (pContext) => {
        await pContext.step('Numeric property', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'testProperty';
            const lPropertyType: string = PgslNumericType.typeName.signedInteger;
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${lPropertyType}
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
            const lArraySize: number = 10;
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lArrayPropertyName}: Array<${PgslNumericType.typeName.float32}, ${lArraySize}>
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
            const lAliasName: string = 'TestAlias';
            const lStructName: string = 'TestStructAlias';
            const lPropertyName: string = 'testProperty';
            const lCodeText: string = `
                alias ${lAliasName} = ${PgslNumericType.typeName.float32};
                struct ${lStructName} {
                    ${lPropertyName}: ${lAliasName}
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
            const lArraySize: number = 5;
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lStaticArrayPropertyName}: Array<${PgslNumericType.typeName.signedInteger}, ${lArraySize}>,
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
            const lAliasName: string = 'TestAlias';
            const lStructName: string = 'TestStructAlias';
            const lPropertyName: string = 'testProperty';
            const lCodeText: string = `
                alias ${lAliasName} = ${PgslNumericType.typeName.float32};
                struct ${lStructName} {
                    ${lPropertyName}: ${lAliasName}
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Transpiled output uses alias resolved type.
            expect(lTranspilationResult.source).toBe(`struct ${lStructName}{${lPropertyName}:f32}`);
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
            const lLocationName: string = 'OutputOne';
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.location}("${lLocationName}")]
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
            const lBlendSourceValue: number = 0;
            const lBlendSourceLocation: string = 'TextureOne';
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.location}("${lBlendSourceLocation}")]
                    [${AttributeListAst.attributeNames.blendSource}(${lBlendSourceValue})]
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
                `@blend_src(0)@location(0)${lPropertyName}:vec4<f32>` +
                `}`
            );
        });

        await pContext.step('interpolate', () => {
            // Setup.
            const lStructName: string = 'TestInterpolateStruct';
            const lPropertyName: string = 'interpolateProperty';
            const lInterpolateLocationName: string = 'OutputOne';
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.location}("${lInterpolateLocationName}")]
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

Deno.test('StructDeclarationAst - Error Cases', async (pContext) => {
    await pContext.step('Duplicate struct names', () => {
        // Setup.
        const lStructName: string = 'TestDuplicateStruct';
        const lFirstPropertyName: string = 'firstProperty';
        const lSecondPropertyName: string = 'secondProperty';
        const lCodeText: string = `
            struct ${lStructName} {
                ${lFirstPropertyName}: ${PgslNumericType.typeName.float32}
            }
            struct ${lStructName} {
                ${lSecondPropertyName}: ${PgslNumericType.typeName.signedInteger}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention duplicate struct.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Struct "${lStructName}" is already defined.`)
        )).toBe(true);
    });

    await pContext.step('Duplicate property names', () => {
        // Setup.
        const lStructName: string = 'TestDuplicatePropertyStruct';
        const lDuplicatePropertyName: string = 'duplicateProperty';
        const lCodeText: string = `
            struct ${lStructName} {
                ${lDuplicatePropertyName}: ${PgslNumericType.typeName.float32},
                ${lDuplicatePropertyName}: ${PgslNumericType.typeName.signedInteger}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention duplicate property.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Property name '${lDuplicatePropertyName}' is already used in struct '${lStructName}'.`)
        )).toBe(true);
    });

    await pContext.step('Empty struct', () => {
        // Setup.
        const lStructName: string = 'TestEmptyStruct';
        const lCodeText: string = `
            struct ${lStructName} {}
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention empty struct.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Struct must have at least one property.`)
        )).toBe(true);
    });

    await pContext.step('Invalid property type', () => {
        // Setup.
        const lStructName: string = 'TestInvalidTypeStruct';
        const lPropertyName: string = 'invalidProperty';
        const lInvalidTypeName: string = 'UndefinedType';
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${lInvalidTypeName}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention undefined type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Typename "${lInvalidTypeName}" not defined.`)
        )).toBe(true);
    });

    await pContext.step('Dynamic array not as last property', () => {
        // Setup.
        const lStructName: string = 'TestInvalidDynamicStruct';
        const lDynamicPropertyName: string = 'dynamicProperty';
        const lRegularPropertyName: string = 'regularProperty';
        const lCodeText: string = `
            struct ${lStructName} {
                ${lDynamicPropertyName}: Array<${PgslNumericType.typeName.float32}>,
                ${lRegularPropertyName}: ${PgslNumericType.typeName.float32}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention dynamic array position.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Only the last property of a struct can have a variable length.')
        )).toBe(true);
    });
});
