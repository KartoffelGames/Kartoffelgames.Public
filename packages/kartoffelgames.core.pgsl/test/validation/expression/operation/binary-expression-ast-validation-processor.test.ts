import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('BinaryExpressionAst - Validation', async (pContext) => {
    await pContext.step('Mixed operators without parentheses', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = testInteger & testInteger | testInteger;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the mixed operators.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Mixing operator "&" with "|" requires parentheses.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = (testInteger & testInteger) | testInteger;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Unsupported operand types', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testFloat: ${PgslNumericType.typeName.float32} = 1.0;
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = testFloat | testInteger;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention both operand types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Bit operation not supported for ${PgslNumericType.typeName.float32} and ${PgslNumericType.typeName.signedInteger}.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = testInteger | testInteger;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant abstract operand range', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testUnsigned: ${PgslNumericType.typeName.unsignedInteger} = 1u;
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = testUnsigned | -1;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the value that does not fit into the operand type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Value -1 does not fit into '${PgslNumericType.typeName.unsignedInteger}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testUnsigned: ${PgslNumericType.typeName.unsignedInteger} = 1u;
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = testUnsigned | 1;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Shift amount type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = testInteger << testInteger;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the unsigned shift amount.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Right expression of a shift operation must be an unsigned integer type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = testInteger << 2u;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Shift amount vector dimension', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(1i, 2i);
                    let testAmount: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.unsignedInteger}> = new ${PgslVectorType.typeName.vector3}(1u, 2u, 3u);
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = testVector << testAmount;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the vector size.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Left and right side of bit expression must be of the same vector size.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}(1i, 2i);
                    let testAmount: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.unsignedInteger}> = new ${PgslVectorType.typeName.vector2}(1u, 2u);
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = testVector << testAmount;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Negative constant shift amount', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = testInteger << -1;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the negative shift amount.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Shift amount must not be negative.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = testInteger << 1;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant shift amount bit width', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = testInteger << 32u;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the shift amount limit.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Shift amount must be less than 32.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = testInteger << 31u;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant left shift overflow', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 1i << 31u;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the overflowing shift.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Left shift of a constant value overflows.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 1i << 30u;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
