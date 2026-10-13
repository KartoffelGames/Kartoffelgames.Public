import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBooleanType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslTextureType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableDeclarationAst - Validation', async (pContext) => {
    await pContext.step('Module scope declaration type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                let testVariable: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the declaration type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Declaration type "let" can not be used for module scope variable declarations.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Reserved WGSL keyword name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lVariableName: string = 'fn';
            const lCodeText: string = `
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved keyword.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lVariableName}" is a reserved WGSL keyword.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslNumericType.typeName.float32} = 1.0;
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
            const lVariableName: string = '__testVariable';
            const lCodeText: string = `
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved prefix.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lVariableName}" must not start with two underscores.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const test_variable: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Predeclared WGSL name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lVariableName: string = 'min';
            const lCodeText: string = `
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the shadowed predeclared name.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lVariableName}" shadows a predeclared WGSL name.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const minimum: ${PgslNumericType.typeName.float32} = 1.0;
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
            const lVariableName: string = 'test__GENERIC__Variable';
            const lCodeText: string = `
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved name part.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lVariableName}" must not contain the reserved name part "__GENERIC__".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const test_GENERIC_Variable: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Missing GroupBinding', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                storage testStorage: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the required attribute.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Declaration type "storage" requires attribute "${AttributeListAst.attributeNames.groupBinding}".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Attribute not allowed by declaration type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                const testVariable: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the attribute that is not allowed.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Declaration type "const" does not allow attribute "${AttributeListAst.attributeNames.groupBinding}".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.Read)]
                storage testStorage: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Initializer type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslNumericType.typeName.float32} = true;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the incompatible initializer.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Initializing value has incompatible type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslNumericType.typeName.float32} = 1;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant initializer range', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslNumericType.typeName.unsignedInteger} = -1;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the value that does not fit into the declared type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Value -1 does not fit into '${PgslNumericType.typeName.unsignedInteger}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslNumericType.typeName.unsignedInteger} = 4294967295;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Const constructible type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslSamplerType.typeName.sampler} = 5.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constructible requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "const" must be constructible.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Const initializer', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing initializer.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Declaration type "const" must have an initializer.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const testVariable: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Const constant initializer', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                private otherVariable: ${PgslNumericType.typeName.float32} = 3.0;
                const testVariable: ${PgslNumericType.typeName.float32} = otherVariable;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constant expression requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The expression of declaration type "const" must be a constant expression.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const otherVariable: ${PgslNumericType.typeName.float32} = 3.0;
                const testVariable: ${PgslNumericType.typeName.float32} = otherVariable;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storage initializer', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden initializer.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Declaration type "storage" must not have an initializer.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storage texture type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the storage texture requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "storage" must be a storage texture type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, AccessMode.Write>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storage host shareable type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslBooleanType.typeName.boolean};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the host shareable requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "storage" must be host shareable.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslNumericType.typeName.unsignedInteger};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storage write access mode', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.Write)]
                storage testStorage: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden write access mode.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Storage declarations with a type other than a texture can not use AccessMode "write".'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.ReadWrite)]
                storage testStorage: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storage param-sized Array', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                param testLength: ${PgslNumericType.typeName.unsignedInteger} = 4u;

                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, testLength>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the param-sized Array.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "storage" must not be an Array with a param-sized length.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                storage testStorage: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Uniform initializer', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden initializer.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Declaration type "uniform" must not have an initializer.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Uniform storage texture', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslTextureType.typeName.textureStorage2d}<TexelFormat.Rgba8unorm, AccessMode.Write>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden storage texture.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Storage textures are not allowed in uniform declarations.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Uniform constructible type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslArrayType.typeName.array}<${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constructible requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "uniform" must be constructible.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslArrayType.typeName.array}<${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Uniform host shareable type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslBooleanType.typeName.boolean};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the host shareable requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "uniform" must be host shareable.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.unsignedInteger};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Uniform address space layout', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the uniform layout.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "uniform" does not satisfy the uniform address space layout.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslArrayType.typeName.array}<${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Workgroup fixed footprint', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                workgroup testVariable: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the fixed footprint requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "workgroup" must have a fixed footprint.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                workgroup testVariable: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 4>;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Workgroup plain type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                workgroup testVariable: ${PgslSamplerType.typeName.sampler};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the plain type requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "workgroup" must be a plain type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                workgroup testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Workgroup initializer', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                workgroup testVariable: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the forbidden initializer.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Declaration type "workgroup" must not have an initializer.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                workgroup testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Private constructible type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                private testVariable: ${PgslSamplerType.typeName.sampler};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constructible requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "private" must be constructible.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                private testVariable: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Private initializer fixed state', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                private otherVariable: ${PgslNumericType.typeName.float32} = 1.0;
                private testVariable: ${PgslNumericType.typeName.float32} = otherVariable;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constant or param expression requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The expression of declaration type "private" must be a constant or param expression.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                param testParam: ${PgslNumericType.typeName.float32} = 1.0;
                private testVariable: ${PgslNumericType.typeName.float32} = testParam;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Param constructible type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                param testParam: ${PgslSamplerType.typeName.sampler} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constructible requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "param" must be constructible.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                param testParam: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Param scalar type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                param testParam: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the scalar requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The type of declaration type "param" must be a scalar type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                param testParam: ${PgslBooleanType.typeName.boolean} = true;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Param initializer', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                param testParam: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing initializer.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Declaration type "param" must have an initializer.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                param testParam: ${PgslNumericType.typeName.float32} = 1.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Param initializer fixed state', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                private otherVariable: ${PgslNumericType.typeName.float32} = 1.0;
                param testParam: ${PgslNumericType.typeName.float32} = otherVariable;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the constant or param expression requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The expression of declaration type "param" must be a constant or param expression.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                param otherParam: ${PgslNumericType.typeName.float32} = 1.0;
                param testParam: ${PgslNumericType.typeName.float32} = otherParam;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
