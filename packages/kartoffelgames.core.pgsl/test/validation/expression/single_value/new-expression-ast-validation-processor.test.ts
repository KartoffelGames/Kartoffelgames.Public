import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslMatrixType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('NewExpressionAst - Validation', async (pContext) => {
    await pContext.step('Type constructible with new', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }

                function testFunction(): void {
                    let testVariable: ${lStructName} = new ${lStructName}();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the type that can not be constructed.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Type '${lStructName}' cannot be constructed with 'new'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Generic count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}, ${PgslNumericType.typeName.signedInteger}>(1.0, 2.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the generic count.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Only one generic type is supported in 'new' expressions.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>(1.0, 2.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Generic on a non generic type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>(1.0, 2.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the type that takes no generic.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Type '${PgslArrayType.typeName.array}' can not be constructed with a generic type.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}(1.0, 2.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Generic type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.signedInteger}>(1, 2, 3, 4);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the invalid generic.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Generic type is not valid for constructed type '${PgslMatrixType.typeName.matrix22}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0, 4.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Generic without parameters', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing generic.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Type '${PgslVectorType.typeName.vector3}' needs a generic type when constructed without parameters.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constructible parameter', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testSampler: ${PgslSamplerType.typeName.sampler};

                function testFunction(): void {
                    let testVariable: ${PgslArrayType.typeName.array}<${PgslSamplerType.typeName.sampler}, 1> = new ${PgslArrayType.typeName.array}(testSampler);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constructible requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `New expression type must be constructible.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 1> = new ${PgslArrayType.typeName.array}(1.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Fixed length parameter', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>;

                function testFunction(): void {
                    let testVariable: ${PgslArrayType.typeName.array}<${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>, 1> = new ${PgslArrayType.typeName.array}(testStorage);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the fixed length requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `New expression type must be length fixed.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> = new ${PgslArrayType.typeName.array}(1.0, 2.0);
                    let testVariable: ${PgslArrayType.typeName.array}<${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2>, 1> = new ${PgslArrayType.typeName.array}(testArray);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Matching constructor', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing constructor.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `No matching constructor found for type '${PgslVectorType.typeName.vector3}' with 2 parameter(s).`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Parameter conversion', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>(true, 1.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the parameter that can not be converted.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Parameter of type 'bool' can not be converted into '${PgslNumericType.typeName.float32}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>(1, 1.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant abstract parameter range', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}>(5000000000, 1);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the value that does not fit into the item type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Value 5000000000 does not fit into '${PgslNumericType.typeName.signedInteger}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}>(2147483647, 1);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
