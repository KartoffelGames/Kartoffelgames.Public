import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslSamplerType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-sampler-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslVoidType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-void-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AddressOfExpressionAst - Validation', async (pContext) => {
    await pContext.step('Stored value target', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    const pointerVariable: *${PgslNumericType.typeName.float32} = &5.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the stored value requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Target of address needs to a stored value'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 5.0;
                    const pointerVariable: *${PgslNumericType.typeName.float32} = &testVariable;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Storable target', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVoidType.typeName.void};
                    const pointerVariable: *${PgslNumericType.typeName.float32} = &testVariable;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the storable requirement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Target of address needs to storable'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                    const pointerVariable: *${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = &testVariable;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Texture or sampler target', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testSampler: ${PgslSamplerType.typeName.sampler};

                function testFunction(): void {
                    const pointerVariable: *${PgslSamplerType.typeName.sampler} = &testSampler;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the texture or sampler restriction.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Target of address can not be a texture or sampler value'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                uniform testUniform: ${PgslNumericType.typeName.float32};

                function testFunction(): void {
                    const pointerVariable: *${PgslNumericType.typeName.float32} = &testUniform;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Vector component target', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                    const pointerVariable: *${PgslNumericType.typeName.float32} = &testVariable.x;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the vector component restriction.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Target of address can not be a vector component.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                    const pointerVariable: *${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = &testVariable;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
