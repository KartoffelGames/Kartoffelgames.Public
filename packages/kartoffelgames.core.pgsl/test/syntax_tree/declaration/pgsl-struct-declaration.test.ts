import { expect } from '@kartoffelgames/core-test';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslStructDeclaration } from '../../../source/abstract_syntax_tree/declaration/pgsl-struct-declaration.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { PgslDocument } from "../../../source/abstract_syntax_tree/pgsl-document.ts";
import { PgslAttributeList } from '../../../source/abstract_syntax_tree/general/pgsl-attribute-list.ts';
import { PgslTypeDeclaration } from "../../../source/abstract_syntax_tree/general/pgsl-type-declaration.ts";
import { PgslStructPropertyDeclaration } from "../../../source/abstract_syntax_tree/declaration/pgsl-struct-property-declaration.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslStructDeclaration - Parsing', async (pContext) => {
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.childNodes).toHaveLength(1);

            // Evaluation. Correct type of child node.
            const lDeclarationNode: PgslStructDeclaration = lDocument.childNodes[0] as PgslStructDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);

            // Evaluation. Correct structure.
            expect(lDeclarationNode.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.properties).toHaveLength(1);
            expect(lDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[0].name).toBe(lPropertyName);
            expect(lDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslStructDeclaration = lDocument.childNodes[0] as PgslStructDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lDeclarationNode.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.properties).toHaveLength(3);
            expect(lDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[0].name).toBe(lVec2PropertyName);
            expect(lDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.properties[1]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[1].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[1].name).toBe(lVec3PropertyName);
            expect(lDeclarationNode.properties[1].type).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.properties[2]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[2].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[2].name).toBe(lVec4PropertyName);
            expect(lDeclarationNode.properties[2].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslStructDeclaration = lDocument.childNodes[0] as PgslStructDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lDeclarationNode.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.properties).toHaveLength(1);
            expect(lDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[0].name).toBe(lArrayPropertyName);
            expect(lDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.childNodes).toHaveLength(2);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslStructDeclaration = lDocument.childNodes[1] as PgslStructDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lDeclarationNode.name).toBe(lOuterStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.properties).toHaveLength(1);
            expect(lDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[0].name).toBe(lNestedPropertyName);
            expect(lDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslStructDeclaration = lDocument.childNodes[1] as PgslStructDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lDeclarationNode.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.properties).toHaveLength(1);
            expect(lDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[0].name).toBe(lPropertyName);
            expect(lDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslStructDeclaration = lDocument.childNodes[0] as PgslStructDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lDeclarationNode.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.properties).toHaveLength(1);
            expect(lDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[0].name).toBe(lDynamicPropertyName);
            expect(lDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslStructDeclaration = lDocument.childNodes[0] as PgslStructDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lDeclarationNode.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.properties).toHaveLength(2);
            expect(lDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[0].name).toBe(lRegularPropertyName);
            expect(lDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.properties[1]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[1].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[1].name).toBe(lDynamicPropertyName);
            expect(lDeclarationNode.properties[1].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            const lDeclarationNode: PgslStructDeclaration = lDocument.childNodes[0] as PgslStructDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lDeclarationNode.name).toBe(lStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.properties).toHaveLength(2);
            expect(lDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[0].name).toBe(lStaticArrayPropertyName);
            expect(lDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
            expect(lDeclarationNode.properties[1]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[1].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[1].name).toBe(lDynamicArrayPropertyName);
            expect(lDeclarationNode.properties[1].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct structure.
            expect(lDocument.childNodes).toHaveLength(2);
            const lDeclarationNode: PgslStructDeclaration = lDocument.childNodes[1] as PgslStructDeclaration;
            expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lDeclarationNode.name).toBe(lOuterStructName);

            // Evaluation. Correct properties.
            expect(lDeclarationNode.properties).toHaveLength(1);
            expect(lDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lDeclarationNode.properties[0].struct).toBe(lDeclarationNode);
            expect(lDeclarationNode.properties[0].name).toBe(lNestedPropertyName);
            expect(lDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.childNodes).toHaveLength(2);

            // Evaluation. Both declarations are correct type.
            const lInnerDeclarationNode: PgslStructDeclaration = lDocument.childNodes[0] as PgslStructDeclaration;
            const lOuterDeclarationNode: PgslStructDeclaration = lDocument.childNodes[1] as PgslStructDeclaration;
            expect(lInnerDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lOuterDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
            expect(lInnerDeclarationNode.name).toBe(lInnerStructName);
            expect(lOuterDeclarationNode.name).toBe(lOuterStructName);

            // Evaluation. Inner struct properties.
            expect(lInnerDeclarationNode.properties).toHaveLength(1);
            expect(lInnerDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lInnerDeclarationNode.properties[0].struct).toBe(lInnerDeclarationNode);
            expect(lInnerDeclarationNode.properties[0].name).toBe(lInnerPropertyName);
            expect(lInnerDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);

            // Evaluation. Outer struct properties.
            expect(lOuterDeclarationNode.properties).toHaveLength(1);
            expect(lOuterDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lOuterDeclarationNode.properties[0].struct).toBe(lOuterDeclarationNode);
            expect(lOuterDeclarationNode.properties[0].name).toBe(lNestedPropertyName);
            expect(lOuterDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
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
            const lDocument: PgslDocument = gPgslParser.parse(lCodeText);

            // Evaluation. Correct number of child nodes.
            expect(lDocument.childNodes).toHaveLength(3);

            // Evaluation. All declarations are correct type.
            const lFirstDeclarationNode: PgslStructDeclaration = lDocument.childNodes[0] as PgslStructDeclaration;
            const lSecondDeclarationNode: PgslStructDeclaration = lDocument.childNodes[1] as PgslStructDeclaration;
            const lThirdDeclarationNode: PgslStructDeclaration = lDocument.childNodes[2] as PgslStructDeclaration;
            expect(lFirstDeclarationNode.name).toBe(lFirstStructName);
            expect(lSecondDeclarationNode.name).toBe(lSecondStructName);
            expect(lThirdDeclarationNode.name).toBe(lThirdStructName);

            // Evaluation. First struct properties.
            expect(lFirstDeclarationNode.properties).toHaveLength(1);
            expect(lFirstDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lFirstDeclarationNode.properties[0].struct).toBe(lFirstDeclarationNode);
            expect(lFirstDeclarationNode.properties[0].name).toBe(lFirstPropertyName);
            expect(lFirstDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);

            // Evaluation. Second struct properties.
            expect(lSecondDeclarationNode.properties).toHaveLength(1);
            expect(lSecondDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lSecondDeclarationNode.properties[0].struct).toBe(lSecondDeclarationNode);
            expect(lSecondDeclarationNode.properties[0].name).toBe(lSecondPropertyName);
            expect(lSecondDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);

            // Evaluation. Third struct properties.
            expect(lThirdDeclarationNode.properties).toHaveLength(1);
            expect(lThirdDeclarationNode.properties[0]).toBeInstanceOf(PgslStructPropertyDeclaration);
            expect(lThirdDeclarationNode.properties[0].struct).toBe(lThirdDeclarationNode);
            expect(lThirdDeclarationNode.properties[0].name).toBe(lThirdPropertyName);
            expect(lThirdDeclarationNode.properties[0].type).toBeInstanceOf(PgslTypeDeclaration);
        });
    });
});

Deno.test('PgslStructDeclaration - Transpilation', async (pContext) => {
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
                    [${PgslAttributeList.attributeNames.location}("${lLocationName}")]
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
                    [${PgslAttributeList.attributeNames.location}("${lBlendSourceLocation}")]
                    [${PgslAttributeList.attributeNames.blendSource}(${lBlendSourceValue})]
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
                    [${PgslAttributeList.attributeNames.location}("${lInterpolateLocationName}")]
                    [${PgslAttributeList.attributeNames.interpolate}(InterpolateType.Perspective, InterpolateSampling.Center)]
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
                    [${PgslAttributeList.attributeNames.size}(${lSizeValue})]
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
                    [${PgslAttributeList.attributeNames.align}(${lAlignValue})]
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

Deno.test('PgslStructDeclaration - Error Cases', async (pContext) => {
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
