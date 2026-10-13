import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ContinueStatementAst - Validation', async (pContext) => {
    await pContext.step('Continue outside of loop', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    switch (5) {
                        case 1: {
                            continue;
                        }
                        default: {}
                    }
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the loop requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Continue statement can only be used within loops.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    while (false) {
                        switch (5) {
                            case 1: {
                                continue;
                            }
                            default: {}
                        }
                    }
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
