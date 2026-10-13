import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionDeclarationAst - Validation', async (pContext) => {
    await pContext.step('Reserved WGSL keyword name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFunctionName: string = 'fn';
            const lCodeText: string = `
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved keyword.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lFunctionName}" is a reserved WGSL keyword.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {}
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
            const lFunctionName: string = '__testFunction';
            const lCodeText: string = `
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved prefix.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lFunctionName}" must not start with two underscores.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function test_function(): void {}
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
            const lFunctionName: string = 'vec3';
            const lCodeText: string = `
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the shadowed predeclared name.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lFunctionName}" shadows a predeclared WGSL name.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function vector3(): void {}
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
            const lFunctionName: string = 'test__GENERIC__Function';
            const lCodeText: string = `
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved name part.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lFunctionName}" must not contain the reserved name part "__GENERIC__".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function test_GENERIC_Function(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
