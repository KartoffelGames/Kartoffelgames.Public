import { expect } from '@kartoffelgames/core-test';
import { PgslArrayType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('IndexedValueExpressionAst - Validation', async (pContext) => {
    await pContext.step('Indexable value', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testValue: ${PgslNumericType.typeName.float32} = 1.0;
                    let testVariable: ${PgslNumericType.typeName.float32} = testValue[0];
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the indexable requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Value of index expression needs to be a indexable composite value.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testArray[0];
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Integer index', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testArray[1.0];
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the integer index requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Index needs to be a integer value.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testArray[1u];
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Negative constant index', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testArray[-1];
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the negative index.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Index needs to be a non negative integer value.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testArray[0];
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant index out of bounds', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testArray[2];
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the out of bounds index.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Index out of bounds.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testArray[1];
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
