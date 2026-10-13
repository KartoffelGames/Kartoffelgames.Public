import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableNameExpressionAst - Validation', async (pContext) => {
    await pContext.step('Undefined variable', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lVariableName: string = 'undefinedVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the undefined variable.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Variable "${lVariableName}" not defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let definedVariable: ${PgslNumericType.typeName.float32} = 1.0;
                    let testVariable: ${PgslNumericType.typeName.float32} = definedVariable;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Enum used as value', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ValueOne = 1
                }

                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = ${lEnumName};
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the enum that is used as a value.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Enum "${lEnumName}" can only be used as value.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = 1
                }

                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = TestEnum.ValueOne;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
