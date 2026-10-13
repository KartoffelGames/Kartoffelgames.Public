import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslBuildInType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-build-in-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AttributeListAst - Validation', async (pContext) => {
    await pContext.step('Unknown attribute', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lAttributeName: string = 'UnknownAttribute';
            const lCodeText: string = `
                [${lAttributeName}()]
                function testFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the unknown attribute.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${lAttributeName}" is not a valid attribute.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function testFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Attribute parent type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.location}("test_location")]
                function testFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the invalid parent type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.location}" is not attached to a valid parent type.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_location")] testProperty: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Parameter count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group")]
                uniform testUniform: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the parameter count.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.groupBinding}" has invalid number of parameters.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Parameters of attributes without parameters', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.invariant}(1)] clipPosition: ${PgslBuildInType.typeName.position}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden parameters.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.invariant}" can not have parameters.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.invariant}()] clipPosition: ${PgslBuildInType.typeName.position}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant string parameter', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                param testParam: ${PgslNumericType.typeName.unsignedInteger} = 1u;

                [${AttributeListAst.attributeNames.groupBinding}(testParam, "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constant expression requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.groupBinding}" parameter 0 must be a constant expression.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    GroupName = "test_group"
                }

                [${AttributeListAst.attributeNames.groupBinding}(TestEnum.GroupName, "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('String parameter type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}(1, "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the string requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.groupBinding}" parameter 0 must be a string.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('String parameter value list', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}("unknown_access")]
                storage testStorage: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the invalid value.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.accessMode}" parameter 0 has an invalid value.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.Read)]
                storage testStorage: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Numeric parameter', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}("test_align")]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the number requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.align}" parameter 0 must be a number.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(16)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Numeric parameter type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(16.5)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the expected parameter type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.align}" parameter 0 must be of type ${PgslNumericType.typeName.unsignedInteger}.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(16u)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Numeric parameter fixed state', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                param testAlign: ${PgslNumericType.typeName.unsignedInteger} = 16u;

                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(testAlign)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the fixed state.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.align}" parameter 0 has the wrong fixed state.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const testAlign: ${PgslNumericType.typeName.unsignedInteger} = 16u;

                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(testAlign)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate attribute', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_location_one")]
                    [${AttributeListAst.attributeNames.location}("test_location_two")]
                    testProperty: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate attribute.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Attribute "${AttributeListAst.attributeNames.location}" can only be used once.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.meta}("test_key_one", "test_value_one")]
                [${AttributeListAst.attributeNames.meta}("test_key_two", "test_value_two")]
                function testFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
