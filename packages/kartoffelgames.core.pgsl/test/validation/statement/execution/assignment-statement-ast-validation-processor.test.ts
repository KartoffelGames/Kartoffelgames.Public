import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AssignmentStatementAst - Validation', async (pContext) => {
    await pContext.step('Storage expression target', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    5 = 10;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the storage expression requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Assignment statement must be applied to a storage expression.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 5;
                    testVariable = 10;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Variable target', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    const testConstant: ${PgslNumericType.typeName.float32} = 5.0;
                    testConstant = 10.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the variable requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Assignment statement must be applied to a variable.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 5.0;
                    testVariable = 10.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Writable target', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.float32};

                function testFunction(): void {
                    testUniform = 10.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the writable memory requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Assignment target must be writable memory.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                private testPrivate: ${PgslNumericType.typeName.float32} = 5.0;

                function testFunction(): void {
                    testPrivate = 10.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constructible target type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.ReadWrite)]
                storage testStorage: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    testStorage = testStorage;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constructible target type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Assignment target type must be constructible.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.ReadWrite)]
                storage testStorage: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    testStorage[0] = 10.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Compound arithmetic operand types', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    let testBoolean: ${PgslBooleanType.typeName.boolean} = true;
                    testInteger += testBoolean;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention both operand types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Arithmetic operation not supported for ${PgslNumericType.typeName.signedInteger} and ${PgslBooleanType.typeName.boolean}.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testInteger += testInteger;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Compound bit operand types', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testFloat: ${PgslNumericType.typeName.float32} = 1.0;
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testFloat |= testInteger;
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
                    testInteger |= testInteger;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Shift assignment amount type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testInteger <<= testInteger;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the unsigned shift amount.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Right side of a shift assignment must be an unsigned integer type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testInteger <<= 1u;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Negative constant shift assignment amount', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testInteger <<= -1;
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
                    testInteger <<= 1;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant shift assignment amount bit width', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testInteger <<= 32u;
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
                    testInteger <<= 31u;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Integer division assignment by constant zero', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testInteger /= 0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the division by zero.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Integer division by zero.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testInteger: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testInteger /= 2;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Assigned type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testVariable = 5.5;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the assigned type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Can't assign a different type to a variable.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 1i;
                    testVariable = 5;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant assigned value range', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = 1u;
                    testVariable = -1;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the value that does not fit into the variable type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Value -1 does not fit into '${PgslNumericType.typeName.unsignedInteger}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = 1u;
                    testVariable = 4294967295;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
