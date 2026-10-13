import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('EnumDeclarationAst - Validation', async (pContext) => {
    await pContext.step('Reserved name part in enum name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lEnumName: string = 'Test__GENERIC__Enum';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ValueOne = 1
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved name part.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lEnumName}" must not contain the reserved name part "__GENERIC__".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = 1
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Reserved name part in value name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lValueName: string = 'Value__GENERIC__One';
            const lCodeText: string = `
                enum TestEnum {
                    ${lValueName} = 1
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved name part.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lValueName}" must not contain the reserved name part "__GENERIC__".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    Value_GENERIC_One = 1
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Enum without values', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lCodeText: string = `
                enum ${lEnumName} {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing values.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Enum ${lEnumName} has no values`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = 1
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate value names', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lValueName: string = 'DuplicateValue';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lValueName} = 1,
                    ${lValueName} = 2
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate value.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Value "${lValueName}" was already added to enum "${lEnumName}"`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = 1,
                    ValueTwo = 2
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Value type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ValueOne = true
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the allowed value type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Enum "${lEnumName}" can only hold unsigned integer values.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = "TestString"
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Mixed value types', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ValueOne = 1,
                    ValueTwo = "TestString"
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the mixed value types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Enum "${lEnumName}" has mixed value types. Expected all values to be of the same type.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = "TestStringOne",
                    ValueTwo = "TestStringTwo"
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
