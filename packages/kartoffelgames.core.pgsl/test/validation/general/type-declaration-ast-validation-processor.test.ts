import { expect } from '@kartoffelgames/core-test';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslBuildInType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-build-in-type.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslStringType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-string-type.ts';
import { PgslTextureType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslVoidType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-void-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('TypeDeclarationAst - Validation', async (pContext) => {
    await pContext.step('Undefined type name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lTypeName: string = 'UndefinedType';
            const lCodeText: string = `
                alias TestAlias = ${lTypeName};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the undefined type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Typename "${lTypeName}" not defined.`
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

    await pContext.step('Void template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslVoidType.typeName.void}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden template arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Void type can't have template parameters.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslVoidType.typeName.void};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Boolean template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBooleanType.typeName.boolean}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden template arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Boolean can't have templates values.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBooleanType.typeName.boolean};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Numeric template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslNumericType.typeName.float32}<${PgslNumericType.typeName.signedInteger}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden template arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Numeric can't have templates values.`
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

    await pContext.step('Sampler template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslSamplerType.typeName.sampler}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden template arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Sampler type can't have template parameters.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslSamplerType.typeName.samplerComparison};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Struct template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }

                alias TestAlias = TestStruct<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden template arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Structs can't have templates values.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }

                alias TestAlias = TestStruct;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Enum template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = 1
                }

                alias TestAlias = TestEnum<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden template arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Enum can't have templates values.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = 1
                }

                alias TestAlias = TestEnum;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Alias template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias OtherAlias = ${PgslNumericType.typeName.float32};
                alias TestAlias = OtherAlias<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden template arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Alias can't have templates values.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias OtherAlias = ${PgslNumericType.typeName.float32};
                alias TestAlias = OtherAlias;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Explicit string type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslStringType.typeName.string};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the explicit string type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `String type can't be explicit defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = "TestString"
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Array without template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing template arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Arrays need at least one template parameter'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Array with too many template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the template argument limit.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Arrays supports only two template parameter.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Array element type is a type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<4, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the type requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'First array template parameter must be a type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Array element type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslSamplerType.typeName.sampler}, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the allowed element types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Array element type must be a scalar, vector, matrix, constant length Array or fixed footprint struct.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Array length is an expression', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the expression requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Array length template must be a expression.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2 + 2>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Array length type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 1.5>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the integer length.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Array length expression must be of unsigned integer type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4u>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Array length fixed state', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                private testLength: ${PgslNumericType.typeName.unsignedInteger} = 4u;
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, testLength>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constant length.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Array length expression must be a constant expression.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                param testLength: ${PgslNumericType.typeName.unsignedInteger} = 4u;
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, testLength>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Array length greater than zero', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 0>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the positive length.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Array length must be greater than zero.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 1>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Vector template count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}, ${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the single template type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Vector types need a single template type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Vector template is a type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslVectorType.typeName.vector2}<4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the type requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Vector template parameter needs to be a type definition.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Vector component type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslVectorType.typeName.vector2}<${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the scalar component type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Vector component type must be a scalar type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslVectorType.typeName.vector2}<${PgslBooleanType.typeName.boolean}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Matrix template count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}, ${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the single template type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Matrix types need a single template type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Matrix template is a type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslMatrixType.typeName.matrix22}<4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the type requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Matrix template parameter needs to be a type definition.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float16}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Matrix component type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.signedInteger}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the floating point component type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Matrix component type must be a floating point type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Pointer storable type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = *${PgslVoidType.typeName.void};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the storable requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Referenced types of pointers need to be storable'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = *${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Pointer to pointer, texture or sampler', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = *${PgslSamplerType.typeName.sampler};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden referenced types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Referenced types of pointers can not be a pointer, texture or sampler.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = *${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Build-in template count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<4, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the single template value.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Build-in type supports only a single template value.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Build-in template is an expression', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the expression requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Build-in type template must be a expression.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<2 + 2>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Build-in template on other build-in types', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.position}<4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden template.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Build-in type "${PgslBuildInType.typeName.position}" can't have template parameters.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.position};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('ClipDistances template value', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing template value.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Clip distance built-in template value must have a value expression.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('ClipDistances constant template value', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                param testCount: ${PgslNumericType.typeName.unsignedInteger} = 4u;
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<testCount>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constant template value.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Clip distance built-in template value must be a constant.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const testCount: ${PgslNumericType.typeName.unsignedInteger} = 4u;
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<testCount>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('ClipDistances template value type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<1.5>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the integer template value.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Clip distance built-in template value must be an unsigned integer.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<4u>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('ClipDistances template value range', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<9>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the template value range.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Clip distance built-in template value must be between 1 and 8.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslBuildInType.typeName.clipDistances}<8>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Sampled texture template count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}, ${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the single template type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Texture type "${PgslTextureType.typeName.texture2d}" needs a single template type.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Sampled texture template is a type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.texture2d}<4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the type requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Texture template parameter needs to be a type definition.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.signedInteger}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Sampled texture type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.texture2d}<${PgslBooleanType.typeName.boolean}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the allowed sampled types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Texture sampled type must be a float, int or uint type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.unsignedInteger}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storage texture template count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the texel format and access mode templates.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Texture type "${PgslTextureType.typeName.textureStorage2d}" needs a texel format and an access mode template.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, AccessMode.Write>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storage texture constant string templates', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.textureStorage2d}<5, AccessMode.Write>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the string value expression.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Texture template parameter 1 must be a string value expression.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.R32float, AccessMode.Read>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storage texture texel format', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFormatName: string = 'unknown_format';
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = "${lFormatName}"
                }

                alias TestAlias = ${PgslTextureType.typeName.textureStorage2d}<TestEnum.ValueOne, AccessMode.Write>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the unknown texel format.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Unknown texel format: "${lFormatName}".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = "rgba8unorm"
                }

                alias TestAlias = ${PgslTextureType.typeName.textureStorage2d}<TestEnum.ValueOne, AccessMode.Write>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storage texture access mode', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lAccessName: string = 'unknown_access';
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = "${lAccessName}"
                }

                alias TestAlias = ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, TestEnum.ValueOne>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the unknown access mode.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Unknown access mode: "${lAccessName}".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnum {
                    ValueOne = "read_write"
                }

                alias TestAlias = ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, TestEnum.ValueOne>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Depth and external texture template arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.textureDepth2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden template arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Texture type "${PgslTextureType.typeName.textureDepth2d}" can't have template parameters.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAlias = ${PgslTextureType.typeName.textureDepth2d};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
