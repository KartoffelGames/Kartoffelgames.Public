import { expect } from '@kartoffelgames/core-test';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import { PgslStructDeclaration } from '../../../source/syntax_tree/declaration/pgsl-struct-declaration.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/type/pgsl-numeric-type.ts';
import { PgslAttributeList } from '../../../source/syntax_tree/general/pgsl-attribute-list.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslStructDeclaration - Basic Types', async (pContext) => {
    await pContext.step('Default - Simple struct with int property', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestStruct';
        const lPropertyName: string = 'testProperty';
        const lPropertyType: string = PgslNumericType.typeName.signedInteger;

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${lPropertyType}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct number of child nodes.
        expect(lTranspilationResult.document.childNodes).toHaveLength(1);

        // Evaluation. Correct type of child node.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode).toBeInstanceOf(PgslStructDeclaration);

        // Evaluation. Correct structure.
        expect(lDeclarationNode.name).toBe(lStructName);
    });

    await pContext.step('Multiple properties - Different numeric types', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestMultipleStruct';
        const lIntPropertyName: string = 'intProperty';
        const lUintPropertyName: string = 'uintProperty';
        const lFloatPropertyName: string = 'floatProperty';
        const lFloat16PropertyName: string = 'float16Property';

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lIntPropertyName}: ${PgslNumericType.typeName.signedInteger},
                ${lUintPropertyName}: ${PgslNumericType.typeName.unsignedInteger},
                ${lFloatPropertyName}: ${PgslNumericType.typeName.float32},
                ${lFloat16PropertyName}: ${PgslNumericType.typeName.float16}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });

    await pContext.step('Vector properties', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestVectorStruct';
        const lVec2PropertyName: string = 'vec2Property';
        const lVec3PropertyName: string = 'vec3Property';
        const lVec4PropertyName: string = 'vec4Property';

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lVec2PropertyName}: Vector2<${PgslNumericType.typeName.float32}>,
                ${lVec3PropertyName}: Vector3<${PgslNumericType.typeName.float32}>,
                ${lVec4PropertyName}: Vector4<${PgslNumericType.typeName.float32}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });

    await pContext.step('Array properties', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestArrayStruct';
        const lArrayPropertyName: string = 'arrayProperty';
        const lArraySize: number = 10;

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lArrayPropertyName}: Array<${PgslNumericType.typeName.float32}, ${lArraySize}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });
});

Deno.test('PgslStructDeclaration - Dynamic length', async (pContext) => {
    await pContext.step('Last property as dynamic array', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestDynamicStruct';
        const lRegularPropertyName: string = 'regularProperty';
        const lDynamicPropertyName: string = 'dynamicProperty';

        // Setup. Code text.
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

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });

    await pContext.step('Error - Dynamic array not as last property', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestInvalidDynamicStruct';
        const lDynamicPropertyName: string = 'dynamicProperty';
        const lRegularPropertyName: string = 'regularProperty';

        // Setup. Code text.
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

    await pContext.step('Multiple static arrays with dynamic as last', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestMixedArrayStruct';
        const lStaticArrayPropertyName: string = 'staticArrayProperty';
        const lDynamicArrayPropertyName: string = 'dynamicArrayProperty';
        const lArraySize: number = 5;

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lStaticArrayPropertyName}: Array<${PgslNumericType.typeName.signedInteger}, ${lArraySize}>,
                ${lDynamicArrayPropertyName}: Array<${PgslNumericType.typeName.float32}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });

    await pContext.step('Error - Multiple dynamic arrays', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestMultipleDynamicStruct';
        const lFirstDynamicPropertyName: string = 'firstDynamicProperty';
        const lSecondDynamicPropertyName: string = 'secondDynamicProperty';

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lFirstDynamicPropertyName}: Array<${PgslNumericType.typeName.float32}>,
                ${lSecondDynamicPropertyName}: Array<${PgslNumericType.typeName.signedInteger}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention multiple dynamic arrays.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Only the last property of a struct can have a variable length.')
        )).toBe(true);
    });

    await pContext.step('Dynamic array inside nested struct as last property', async () => {
        // Setup. Code blocks.
        const lInnerStructName: string = 'TestInnerStruct';
        const lOuterStructName: string = 'TestOuterStruct';
        const lDynamicPropertyName: string = 'dynamicProperty';
        const lNestedPropertyName: string = 'nestedProperty';

        // Setup. Code text.
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

        // Evaluation. Should have no errors.
        expect(lTranspilationResult.incidents.length).toBe(0);
    });
});

Deno.test('PgslStructDeclaration - Property Attributes', async (pContext) => {
    await pContext.step('Property with Size attribute', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestSizeStruct';
        const lPropertyName: string = 'sizedProperty';
        const lSizeValue: number = 16;

        // Setup. Code text.
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

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });

    await pContext.step('Property with Align attribute', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestAlignStruct';
        const lPropertyName: string = 'alignedProperty';
        const lAlignValue: number = 8;

        // Setup. Code text.
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

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });

    await pContext.step('Property with Location attribute', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestLocationStruct';
        const lPropertyName: string = 'locationProperty';
        const lLocationName: string = 'OutputOne';

        // Setup. Code text.
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

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });

    await pContext.step('Property with Interpolate attribute', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestInterpolateStruct';
        const lPropertyName: string = 'interpolateProperty';
        const lInterpolateLocationName: string = 'OutputOne';

        // Setup. Code text.
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

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });

    await pContext.step('Property with BlendSource attribute', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestBlendSourceStruct';
        const lPropertyName: string = 'blendSourceProperty';
        const lBlendSourceValue: number = 0;
        const lBlendSourceLocation: string = 'TextureOne';

        // Setup. Code text.
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

        // Evaluation. Correct structure.
        const lDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        expect(lDeclarationNode.name).toBe(lStructName);
    });
});

Deno.test('PgslStructDeclaration - Error Cases', async (pContext) => {
    await pContext.step('Error - Duplicate struct names', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestDuplicateStruct';
        const lFirstPropertyName: string = 'firstProperty';
        const lSecondPropertyName: string = 'secondProperty';

        // Setup. Code text.
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

    await pContext.step('Error - Duplicate property names', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestDuplicatePropertyStruct';
        const lDuplicatePropertyName: string = 'duplicateProperty';

        // Setup. Code text.
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

    await pContext.step('Error - Empty struct', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestEmptyStruct';

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
            }
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

    await pContext.step('Error - Invalid property type', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestInvalidTypeStruct';
        const lPropertyName: string = 'invalidProperty';
        const lInvalidTypeName: string = 'UndefinedType';

        // Setup. Code text.
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
});

Deno.test('PgslStructDeclaration - Nested Structs', async (pContext) => {
    await pContext.step('Struct with nested struct property', async () => {
        // Setup. Code blocks.
        const lInnerStructName: string = 'TestInnerStruct';
        const lOuterStructName: string = 'TestOuterStruct';
        const lInnerPropertyName: string = 'innerProperty';
        const lNestedPropertyName: string = 'nestedProperty';

        // Setup. Code text.
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

        // Evaluation. Correct number of structs.
        expect(lTranspilationResult.document.childNodes).toHaveLength(2);

        // Evaluation. Both declarations are correct type.
        const lInnerDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[0] as PgslStructDeclaration;
        const lOuterDeclarationNode: PgslStructDeclaration = lTranspilationResult.document.childNodes[1] as PgslStructDeclaration;
        expect(lInnerDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
        expect(lOuterDeclarationNode).toBeInstanceOf(PgslStructDeclaration);
        expect(lInnerDeclarationNode.name).toBe(lInnerStructName);
        expect(lOuterDeclarationNode.name).toBe(lOuterStructName);
    });
});

Deno.test('PgslStructDeclaration - Structs usages', async (pContext) => {
    await pContext.step('Struct in fixed size array', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestArrayElementStruct';
        const lPropertyName: string = 'testProperty';
        const lVariableName: string = 'testVariable';
        const lArraySize: number = 5;

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${PgslNumericType.typeName.float32}
            }
            private ${lVariableName}: Array<${lStructName}, ${lArraySize}>;
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses struct in array.
        expect(lTranspilationResult.source).toContain(`var<private> ${lVariableName}: array<${lStructName}, ${lArraySize}>;`);
    });

    await pContext.step('Struct with dynamic array in fixed array', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestDynamicInFixedStruct';
        const lDynamicPropertyName: string = 'dynamicProperty';
        const lVariableName: string = 'testVariable';
        const lArraySize: number = 3;

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lDynamicPropertyName}: Array<${PgslNumericType.typeName.float32}>
            }

            [${PgslAttributeList.attributeNames.groupBinding}("somewhat", "another")]
            storage ${lVariableName}: Array<${lStructName}, ${lArraySize}>;
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should work as fixed arrays have known size.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention undefined type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Array inner type must have a fixed footprint.`)
        )).toBe(true);
    });
});

Deno.test('PgslStructDeclaration - Transpilation', async (pContext) => {
    await pContext.step('Simple struct transpilation', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestStruct';
        const lPropertyName: string = 'testProperty';

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${PgslNumericType.typeName.float32}
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output contains struct.
        expect(lTranspilationResult.source).toContain(`struct ${lStructName}`);
        expect(lTranspilationResult.source).toContain(`${lPropertyName}: f32`);
    });

    await pContext.step('Struct with multiple properties transpilation', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestMultiStruct';
        const lFloatPropertyName: string = 'floatProperty';
        const lIntPropertyName: string = 'intProperty';
        const lVectorPropertyName: string = 'vectorProperty';

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lFloatPropertyName}: ${PgslNumericType.typeName.float32},
                ${lIntPropertyName}: ${PgslNumericType.typeName.signedInteger},
                ${lVectorPropertyName}: Vector3<${PgslNumericType.typeName.float32}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output contains all properties.
        expect(lTranspilationResult.source).toContain(`struct ${lStructName}`);
        expect(lTranspilationResult.source).toContain(`${lFloatPropertyName}: f32`);
        expect(lTranspilationResult.source).toContain(`${lIntPropertyName}: i32`);
        expect(lTranspilationResult.source).toContain(`${lVectorPropertyName}: vec3<f32>`);
    });

    await pContext.step('Struct with attributes transpilation', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestAttributeStruct';
        const lPropertyName: string = 'attributeProperty';
        const lLocationName: string = 'OutputOne';

        // Setup. Code text.
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

        // Evaluation. Transpiled output contains attribute.
        expect(lTranspilationResult.source).toContain(`@location(0) ${lPropertyName}: vec4<f32>`);
    });

    await pContext.step('Struct with dynamic array transpilation', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestDynamicStruct';
        const lStaticPropertyName: string = 'staticProperty';
        const lDynamicPropertyName: string = 'dynamicProperty';

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lStaticPropertyName}: ${PgslNumericType.typeName.float32},
                ${lDynamicPropertyName}: Array<${PgslNumericType.typeName.signedInteger}>
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output contains dynamic array.
        expect(lTranspilationResult.source).toContain(`struct ${lStructName}`);
        expect(lTranspilationResult.source).toContain(`${lStaticPropertyName}: f32`);
        expect(lTranspilationResult.source).toContain(`${lDynamicPropertyName}: array<i32>`);
    });

    await pContext.step('Struct usage in variable declaration', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestUsageStruct';
        const lPropertyName: string = 'testProperty';
        const lVariableName: string = 'testVariable';

        // Setup. Code text.
        const lCodeText: string = `
            struct ${lStructName} {
                ${lPropertyName}: ${PgslNumericType.typeName.float32}
            }
            private ${lVariableName}: ${lStructName};
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Transpiled output uses struct type.
        expect(lTranspilationResult.source).toContain(`var<private> ${lVariableName}: ${lStructName};`);
    });

    await pContext.step('Struct with interpolate attribute transpilation', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestInterpolateStruct';
        const lPropertyName: string = 'interpolateProperty';
        const lInterpolateLocationName: string = 'OutputOne';

        // Setup. Code text.
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

        // Evaluation. Transpiled output contains interpolate attribute.
        expect(lTranspilationResult.source).toContain(`@location(0) @interpolate(perspective, center) ${lPropertyName}: vec4<f32>`);
    });

    await pContext.step('Struct with blend source attribute transpilation', async () => {
        // Setup. Code blocks.
        const lStructName: string = 'TestBlendSourceStruct';
        const lPropertyName: string = 'blendProperty';
        const lBlendSourceValue: number = 0;
        const lBlendSourceLocation: string = 'TextureOne';

        // Setup. Code text.
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

        // Evaluation. Transpiled output contains blend source attribute.
        expect(lTranspilationResult.source).toContain(`@blend_src(0)`);
        expect(lTranspilationResult.source).toContain(`${lPropertyName}: vec4<f32>`);
    });
});
