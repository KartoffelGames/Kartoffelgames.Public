import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ValueDecompositionExpressionAst - Validation', async (pContext) => {
    await pContext.step('Swizzle name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lSwizzleName: string = 'xq';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0);
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzleName};
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the invalid swizzle name.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Swizzle name "${lSwizzleName}" can't be used to access vector.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0);
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = testVector.xw;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Swizzle a or w on small vectors', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testVector.w;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the vector dimension of a and w.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Swizzle names with "a" or "w" can only be used for vectors of dimension 4 or higher.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testVector.z;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Swizzle b or z on small vectors', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testVector.z;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the vector dimension of b and z.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Swizzle names with "b" or "z" can only be used for vectors of dimension 3 or higher.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testVector.y;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Struct property', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lPropertyName: string = 'undefinedProperty';
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }

                function testFunction(): void {
                    let testStruct: TestStruct;
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName};
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the undefined property.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Struct has no defined property "${lPropertyName}"`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }

                function testFunction(): void {
                    let testStruct: TestStruct;
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.propertyOne;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Enum value', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lValueName: string = 'UndefinedValue';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ValueOne = 1
                }

                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = ${lEnumName}.${lValueName};
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the undefined enum value.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Enum "${lEnumName}" does not contain a value for property "${lValueName}".`
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

    await pContext.step('Compositeable value', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testValue: ${PgslNumericType.typeName.float32} = 1.0;
                    let testVariable: ${PgslNumericType.typeName.float32} = testValue.x;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the compositeable requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Value of a decomposition must be a compositeable type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testValue.x;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
