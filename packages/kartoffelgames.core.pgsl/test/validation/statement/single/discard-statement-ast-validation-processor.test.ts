import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('DiscardStatementAst - Validation', async (pContext) => {
    await pContext.step('Discard outside of fragment entry point', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {
                    discard;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the fragment stage requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Discard statement can only be used in fragment entry points.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_in")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_out")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
                    discard;

                    let output: FragmentOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
