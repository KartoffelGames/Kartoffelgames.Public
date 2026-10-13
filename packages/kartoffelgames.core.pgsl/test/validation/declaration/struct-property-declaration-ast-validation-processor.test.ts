import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('StructPropertyDeclarationAst - Validation', async (pContext) => {
    await pContext.step('Reserved WGSL keyword name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lPropertyName: string = 'fn';
            const lCodeText: string = `
                struct TestStruct {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved keyword.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lPropertyName}" is a reserved WGSL keyword.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    testProperty: ${PgslNumericType.typeName.float32}
                }
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
            const lPropertyName: string = '__testProperty';
            const lCodeText: string = `
                struct TestStruct {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved prefix.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lPropertyName}" must not start with two underscores.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    test_property: ${PgslNumericType.typeName.float32}
                }
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
            const lPropertyName: string = 'test__GENERIC__Property';
            const lCodeText: string = `
                struct TestStruct {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved name part.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lPropertyName}" must not contain the reserved name part "__GENERIC__".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    test_GENERIC_Property: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Plain type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    testProperty: ${PgslSamplerType.typeName.sampler}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the plain type requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Property type must be plain.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    testProperty: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Param-sized Array type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                param testLength: ${PgslNumericType.typeName.unsignedInteger} = 4u;

                struct TestStruct {
                    testProperty: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, testLength>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the param-sized Array.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Property type must not be an Array with a param-sized length.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    testProperty: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Struct without fixed footprint', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct InnerStruct {
                    values: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>
                }

                struct TestStruct {
                    testProperty: InnerStruct
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the struct without fixed footprint.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Property type must not be a struct without a fixed footprint.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct InnerStruct {
                    values: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4>
                }

                struct TestStruct {
                    testProperty: InnerStruct
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Location type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_location")] testProperty: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the allowed location types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Location attribute can only be applied to numeric scalar or numeric vector types.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_location")] testProperty: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Size positive integer', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.size}(0)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the positive size.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Size attribute parameter must be a positive integer.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.size}(16)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Size at least type size', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.size}(2)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the minimum size.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Size attribute parameter must be at least the byte size of the property type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.size}(4)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Size on runtime-sized Array', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.size}(16)]
                    testProperty: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the runtime-sized Array.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Size attribute can not be used on a runtime-sized Array.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.size}(16)]
                    testProperty: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Align positive integer', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(0)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the positive alignment.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Align attribute parameter must be a positive integer.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(16)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Align power of two', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(12)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the power of two.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Align attribute parameter must be a power of two.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(8)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Align multiple of type alignment', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(2)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the type alignment.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Align attribute parameter must be a multiple of the alignment of the property type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.align}(4)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('BlendSource without Location', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    testProperty: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the location requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Blend source attribute is only valid when location attribute is set.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_color")]
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    colorOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_blend")]
                    [${AttributeListAst.attributeNames.blendSource}(1)]
                    colorTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('BlendSource value', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_color")]
                    [${AttributeListAst.attributeNames.blendSource}(2)]
                    testProperty: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the allowed blend source values.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Blend source attribute parameter must be either zero or one.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_color")]
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    colorOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_blend")]
                    [${AttributeListAst.attributeNames.blendSource}(1)]
                    colorTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Interpolate without Location', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.interpolate}(InterpolateType.Flat, InterpolateSampling.First)]
                    testProperty: ${PgslNumericType.typeName.unsignedInteger}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the location requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Interpolate attribute is only valid when location attribute is set.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_location")]
                    [${AttributeListAst.attributeNames.interpolate}(InterpolateType.Flat, InterpolateSampling.First)]
                    testProperty: ${PgslNumericType.typeName.unsignedInteger}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Interpolate sampling of type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_location")]
                    [${AttributeListAst.attributeNames.interpolate}(InterpolateType.Flat, InterpolateSampling.Center)]
                    testProperty: ${PgslNumericType.typeName.unsignedInteger}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the sampling that does not fit the type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Interpolate sampling "center" can not be used with interpolate type "flat".'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    [${AttributeListAst.attributeNames.location}("test_location")]
                    [${AttributeListAst.attributeNames.interpolate}(InterpolateType.Perspective, InterpolateSampling.Center)]
                    testProperty: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
