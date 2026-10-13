import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('LiteralValueExpressionAst - Validation', async (pContext) => {
    await pContext.step('Value range', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lLiteralValue: string = '3000000000i';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the literal that does not fit into its type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Literal "${lLiteralValue}" does not fit into '${PgslNumericType.typeName.signedInteger}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 2147483647i;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Hexadecimal exactness', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lLiteralValue: string = '0x1.000001p0f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the inexact hexadecimal literal.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Hexadecimal literal "${lLiteralValue}" is not exactly representable in '${PgslNumericType.typeName.float32}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 0x1.000002p0f;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
