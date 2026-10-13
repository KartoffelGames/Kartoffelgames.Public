import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBuildInType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-build-in-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslTextureType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-texture-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionOverloadDeclarationAst - Validation', async (pContext) => {
    await pContext.step('Duplicate parameter names', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lParameterName: string = 'testParameter';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}, ${lParameterName}: ${PgslNumericType.typeName.signedInteger}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate parameter.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Parameter "${lParameterName}" is already defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(parameterOne: ${PgslNumericType.typeName.float32}, parameterTwo: ${PgslNumericType.typeName.signedInteger}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Reserved WGSL keyword parameter name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lParameterName: string = 'fn';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved keyword.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lParameterName}" is a reserved WGSL keyword.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(testParameter: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Double underscore parameter name prefix', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lParameterName: string = '__testParameter';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved prefix.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lParameterName}" must not start with two underscores.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(test_parameter: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Predeclared WGSL parameter name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lParameterName: string = 'min';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the shadowed predeclared name.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lParameterName}" shadows a predeclared WGSL name.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(minimum: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Parameter name of a function or struct declaration', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }

                function testFunction(${lStructName}: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the shadowed declaration.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lStructName}" shadows a function or struct declaration.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }

                function testFunction(testParameter: TestStruct): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Reserved name part in parameter name', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lParameterName: string = 'test__GENERIC__Parameter';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the reserved name part.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lParameterName}" must not contain the reserved name part "__GENERIC__".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(test_GENERIC_Parameter: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Block variable named like a parameter', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lParameterName: string = 'testParameter';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {
                    let ${lParameterName}: ${PgslNumericType.typeName.float32} = 1.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the variable that shares the parameter name.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Variable "${lParameterName}" shares its name with a parameter.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(testParameter: ${PgslNumericType.typeName.float32}): void {
                    {
                        let testParameter: ${PgslNumericType.typeName.float32} = 1.0;
                    }
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Parameter type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(testParameter: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}>): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the allowed parameter types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Parameter type must be constructible, a pointer, a texture or a sampler.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(testParameter: ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}>): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Return type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): ${PgslTextureType.typeName.texture2d}<${PgslNumericType.typeName.float32}> {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the allowed return types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Return type must be void or constructible.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 2> {
                    return new ${PgslArrayType.typeName.array}(1.0, 2.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Return on every control flow path', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.float32} {
                    if (true) {
                        return 1.0;
                    }
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing return statement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Every control flow path of a function with a return type must end in a return statement.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.float32} {
                    if (true) {
                        return 1.0;
                    } else {
                        return 2.0;
                    }
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Multiple entry point attributes', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                [${AttributeListAst.attributeNames.vertex}()]
                function testFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the single entry point attribute.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Only one of the Vertex, Fragment and Compute attributes can be set.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function testFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Vertex parameter count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the single input parameter.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The vertex entry points must have exactly one parameter defining the vertex input structure.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Fragment parameter count', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_target")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(): FragmentOut {
                    let output: FragmentOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the single input parameter.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The fragment entry points must have exactly one parameter defining the fragment input structure.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_color")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_target")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
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

    await pContext.step('Vertex parameter type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: ${PgslNumericType.typeName.float32}): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the struct parameter.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The vertex entry point parameter must be a struct type defining the vertex input structure.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Fragment parameter type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_target")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: ${PgslNumericType.typeName.float32}): FragmentOut {
                    let output: FragmentOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the struct parameter.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The fragment entry point parameter must be a struct type defining the fragment input structure.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_color")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_target")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
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

    await pContext.step('Vertex return type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): ${PgslNumericType.typeName.float32} {
                    return 1.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the struct return type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The vertex entry point return type must be a struct type defining the vertex output structure.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Fragment return type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_color")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): ${PgslNumericType.typeName.float32} {
                    return 1.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the struct return type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The fragment entry point return type must be a struct type defining the fragment output structure.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_color")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_target")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
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

    await pContext.step('Entry point property without built-in type or location', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lPropertyName: string = 'position';
            const lCodeText: string = `
                struct VertexIn {
                    ${lPropertyName}: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the property without built-in type or location.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Property "${lPropertyName}" of an entry point struct must have either a built-in type or a Location attribute.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Entry point property with built-in type and location', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lPropertyName: string = 'clipPosition';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_clip_position")] ${lPropertyName}: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the property with built-in type and location.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Property "${lPropertyName}" of an entry point struct must have either a built-in type or a Location attribute.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Built-in type stage and direction', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentIn {
                    vertexIndex: ${PgslBuildInType.typeName.vertexIndex}
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_target")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
                    let output: FragmentOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the built-in type that does not fit the stage.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Built-in type "${PgslBuildInType.typeName.vertexIndex}" can not be used in the fragment input struct.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    vertexIndex: ${PgslBuildInType.typeName.vertexIndex}
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate built-in type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'VertexOut';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct ${lStructName} {
                    clipPositionOne: ${PgslBuildInType.typeName.position},
                    clipPositionTwo: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): ${lStructName} {
                    let output: ${lStructName};
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate built-in type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Built-in type "${PgslBuildInType.typeName.position}" is used more than once in struct "${lStructName}".`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position},
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Vertex output position', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing position property.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'The vertex entry point output struct needs a Position property.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position},
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Flat interpolation of integer locations', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lPropertyName: string = 'vertexId';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position},
                    [${AttributeListAst.attributeNames.location}("test_vertex_id")] ${lPropertyName}: ${PgslNumericType.typeName.unsignedInteger}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing flat interpolation.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Location property "${lPropertyName}" with an integer type needs a flat Interpolate attribute.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position},
                    [${AttributeListAst.attributeNames.location}("test_vertex_id")]
                    [${AttributeListAst.attributeNames.interpolate}(InterpolateType.Flat, InterpolateSampling.First)]
                    vertexId: ${PgslNumericType.typeName.unsignedInteger}
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('BlendSource outside of fragment output', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position},
                    [${AttributeListAst.attributeNames.location}("test_color")]
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    colorOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_blend")]
                    [${AttributeListAst.attributeNames.blendSource}(1)]
                    colorTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the fragment output restriction.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'BlendSource properties can only be used in the output struct of a fragment entry point.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_color")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_color")]
                    [${AttributeListAst.attributeNames.blendSource}(0)]
                    colorOne: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>,
                    [${AttributeListAst.attributeNames.location}("test_blend")]
                    [${AttributeListAst.attributeNames.blendSource}(1)]
                    colorTwo: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
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

    await pContext.step('Compute workgroup size greater than zero', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(0, 1, 1)]
                function computeFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the positive workgroup size.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'All compute attribute parameters need to be greater than zero.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(8, 4, 1)]
                function computeFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Compute parameters', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(testParameter: ${PgslNumericType.typeName.float32}): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the parameter restriction.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Compute entry points must not have parameters.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Compute return type', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): ${PgslNumericType.typeName.float32} {
                    return 1.0;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the return type restriction.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Compute entry points must not have a return type.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
