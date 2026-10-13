import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AliasDeclarationAst - Validation', async (pContext) => {
    await pContext.step('Reserved name part', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lAliasName: string = 'Test__GENERIC__Alias';
            const lCodeText: string = `
                alias ${lAliasName} = ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved name part.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lAliasName}" must not contain the reserved name part "__GENERIC__".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
