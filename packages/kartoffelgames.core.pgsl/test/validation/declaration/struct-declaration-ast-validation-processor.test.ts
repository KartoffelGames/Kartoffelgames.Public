import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('StructDeclarationAst - Validation', async (pContext) => {
    await pContext.step('Reserved WGSL keyword name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'fn';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved keyword.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lStructName}" is a reserved WGSL keyword.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Double underscore name prefix', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = '__TestStruct';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved prefix.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lStructName}" must not start with two underscores.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct Test_Struct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Predeclared WGSL name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'vec3';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the shadowed predeclared name.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lStructName}" shadows a predeclared WGSL name.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct Vec3 {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Reserved name part', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'Test__GENERIC__Struct';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved name part.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lStructName}" must not contain the reserved name part "__GENERIC__".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct Test_GENERIC_Struct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Struct without properties', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing properties.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Struct must have at least one property.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate property names', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'testProperty';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32},
                    ${lPropertyName}: ${PgslNumericType.typeName.signedInteger}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate property.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Property name '${lPropertyName}' is already used in struct '${lStructName}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32},
                    propertyTwo: ${PgslNumericType.typeName.signedInteger}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Runtime-sized property not last', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>,
                    propertyTwo: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the runtime-sized property position.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Only the last property of a struct can have a variable length.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32},
                    propertyTwo: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate location names', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lLocationName: string = 'test_location';
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.location}("${lLocationName}")] propertyOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("${lLocationName}")] propertyTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate location.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Location name '${lLocationName}' is already used in struct '${lStructName}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_location_one")] propertyOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_location_two")] propertyTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('BlendSource location count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.location}("test_color")]
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    colorOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the two blend source locations.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Struct "${lStructName}" with a BlendSource property must have exactly two Location properties with BlendSource 0 and 1.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_color")]
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    colorOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_blend")]
                    [${AttributeListAst.attributeNames.blendSource}(1)]
                    colorTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('BlendSource location types', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lCodeText: string = `
                struct ${lStructName} {
                    [${AttributeListAst.attributeNames.location}("test_color")]
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    colorOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_blend")]
                    [${AttributeListAst.attributeNames.blendSource}(1)]
                    colorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the same blend source types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Both Location properties of struct "${lStructName}" with a BlendSource property must have the same type.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_color")]
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    colorOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_blend")]
                    [${AttributeListAst.attributeNames.blendSource}(1)]
                    colorTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
