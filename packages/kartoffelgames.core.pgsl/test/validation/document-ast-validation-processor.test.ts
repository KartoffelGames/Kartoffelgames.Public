import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslArrayType } from '../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslBuildInType } from '../../source/abstract_syntax_tree/type/definition/pgsl-build-in-type.ts';
import { PgslNumericType } from '../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('DocumentAst - Validation', async (pContext) => {
    await pContext.step('Duplicate alias names', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lAliasName: string = 'TestAlias';
            const lCodeText: string = `
                alias ${lAliasName} = ${PgslNumericType.typeName.float32};
                alias ${lAliasName} = ${PgslNumericType.typeName.signedInteger};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate alias.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Alias with name "${lAliasName}" already defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                alias TestAliasOne = ${PgslNumericType.typeName.float32};
                alias TestAliasTwo = ${PgslNumericType.typeName.signedInteger};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate enum names', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ValueOne = 1
                }
                enum ${lEnumName} {
                    ValueTwo = 2
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate enum.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Enum "${lEnumName}" is already defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestEnumOne {
                    ValueOne = 1
                }
                enum TestEnumTwo {
                    ValueTwo = 2
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Enum name of a feature set enum', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lEnumName: string = 'AccessMode';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ValueOne = 1
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the enum that is already declared by a feature set.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Enum "${lEnumName}" is already defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                enum TestAccessMode {
                    ValueOne = 1
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate function names', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFunctionName: string = 'testFunction';
            const lCodeText: string = `
                function ${lFunctionName}(): void {}
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate function.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Function "${lFunctionName}" is already defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunctionOne(): void {}
                function testFunctionTwo(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Function name of a build-in function', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFunctionName: string = 'clamp';
            const lCodeText: string = `
                function ${lFunctionName}(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the function that is already declared by a feature set.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Function "${lFunctionName}" is already defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function clampValue(): void {}
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate struct names', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
                struct ${lStructName} {
                    propertyTwo: ${PgslNumericType.typeName.signedInteger}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate struct.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Struct "${lStructName}" is already defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStructOne {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
                struct TestStructTwo {
                    propertyTwo: ${PgslNumericType.typeName.signedInteger}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Struct name of a feature set struct', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lStructName: string = '__frexp_result_f32';
            const lCodeText: string = `
                struct ${lStructName} {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the struct that is already declared by a feature set.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Struct "${lStructName}" is already defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                struct FrexpResult {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate module scope variable names', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lVariableName: string = 'testVariable';
            const lCodeText: string = `
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate variable.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Variable with name "${lVariableName}" already defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                const testVariableOne: ${PgslNumericType.typeName.float32} = 5.0;
                const testVariableTwo: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Name shared by different declaration kinds', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lName: string = 'testName';
            const lCodeText: string = `
                function ${lName}(): void {}
                const ${lName}: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the shared name.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Name "${lName}" is already used by another module scope declaration.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {}
                const testVariable: ${PgslNumericType.typeName.float32} = 5.0;
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Duplicate binding name in a group', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lGroupName: string = 'test_group';
            const lBindingName: string = 'test_binding';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
                uniform testUniformOne: ${PgslNumericType.typeName.float32};
                [${AttributeListAst.attributeNames.groupBinding}("${lGroupName}", "${lBindingName}")]
                uniform testUniformTwo: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the duplicate binding.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Binding name "${lBindingName}" in group "${lGroupName}" is already used.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding_one")]
                uniform testUniformOne: ${PgslNumericType.typeName.float32};
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding_two")]
                uniform testUniformTwo: ${PgslNumericType.typeName.float32};
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Discard reachable from a vertex or compute entry point', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFunctionName: string = 'discardFunction';
            const lCodeText: string = `
                function ${lFunctionName}(): void {
                    discard;
                }

                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {
                    ${lFunctionName}();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the function with the discard statement.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Function "${lFunctionName}" contains a discard statement and can not be called from a vertex or compute entry point.`
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

                function discardFunction(): void {
                    discard;
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
                    discardFunction();

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

    await pContext.step('Workgroup variable reachable from a vertex or fragment entry point', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lVariableName: string = 'testWorkgroup';
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_color")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_target")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                workgroup ${lVariableName}: ${PgslNumericType.typeName.float32};

                function helperFunction(): void {
                    ${lVariableName} = 1.0;
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
                    helperFunction();

                    let output: FragmentOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the workgroup variable.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Workgroup variable "${lVariableName}" can only be used from compute entry points.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                workgroup testWorkgroup: ${PgslNumericType.typeName.float32};

                function helperFunction(): void {
                    testWorkgroup = 1.0;
                }

                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {
                    helperFunction();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Fragment only build-in reachable from a vertex or compute entry point', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function helperFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = dpdx(1.0);
                }

                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {
                    helperFunction();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the fragment only function.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Function "dpdx" can only be called from fragment entry points.'
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

                function helperFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = dpdx(1.0);
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
                    helperFunction();

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

    await pContext.step('Compute only build-in reachable from a vertex or fragment entry point', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                struct FragmentIn {
                    [${AttributeListAst.attributeNames.location}("test_color")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct FragmentOut {
                    [${AttributeListAst.attributeNames.location}("test_target")] color: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }

                function helperFunction(): void {
                    workgroupBarrier();
                }

                [${AttributeListAst.attributeNames.fragment}()]
                function fragmentFunction(input: FragmentIn): FragmentOut {
                    helperFunction();

                    let output: FragmentOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the compute only function.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Function "workgroupBarrier" can only be called from compute entry points.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function helperFunction(): void {
                    workgroupBarrier();
                }

                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {
                    helperFunction();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Writable storage reachable from a vertex entry point', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lVariableName: string = 'testStorage';
            const lCodeText: string = `
                struct VertexIn {
                    [${AttributeListAst.attributeNames.location}("test_position")] position: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>
                }
                struct VertexOut {
                    clipPosition: ${PgslBuildInType.typeName.position}
                }

                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.ReadWrite)]
                storage ${lVariableName}: ${PgslNumericType.typeName.float32};

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let testValue: ${PgslNumericType.typeName.float32} = ${lVariableName};

                    let output: VertexOut;
                    return output;
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the writable storage variable.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Storage variable "${lVariableName}" with write access can not be used from vertex entry points.`
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

                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.Read)]
                storage testStorage: ${PgslNumericType.typeName.float32};

                [${AttributeListAst.attributeNames.vertex}()]
                function vertexFunction(input: VertexIn): VertexOut {
                    let testValue: ${PgslNumericType.typeName.float32} = testStorage;

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

    await pContext.step('Uniform control flow of build-in calls', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.ReadWrite)]
                storage testStorage: ${PgslNumericType.typeName.unsignedInteger};

                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {
                    if (testStorage > 0u) {
                        workgroupBarrier();
                    }
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the uniform control flow.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Function "workgroupBarrier" must be called in uniform control flow.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {
                    workgroupBarrier();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Uniform pointer of workgroupUniformLoad', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("test_group", "test_binding")]
                [${AttributeListAst.attributeNames.accessMode}(AccessMode.ReadWrite)]
                storage testIndex: ${PgslNumericType.typeName.unsignedInteger};

                workgroup testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.unsignedInteger}, 4>;

                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {
                    let testValue: ${PgslNumericType.typeName.unsignedInteger} = workgroupUniformLoad(&testArray[testIndex]);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the uniform pointer.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === 'Pointer argument of workgroupUniformLoad must be a uniform value.'
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                workgroup testArray: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.unsignedInteger}, 4>;

                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function computeFunction(): void {
                    let testValue: ${PgslNumericType.typeName.unsignedInteger} = workgroupUniformLoad(&testArray[0]);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Aliased pointer arguments', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFunctionName: string = 'writeFunction';
            const lCodeText: string = `
                function ${lFunctionName}(targetOne: *${PgslNumericType.typeName.float32}, targetTwo: *${PgslNumericType.typeName.float32}): void {
                    *targetOne = 1.0;
                }

                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 0.0;
                    ${lFunctionName}(&testVariable, &testVariable);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the aliased pointer arguments.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Pointer arguments of function "${lFunctionName}" must not reference the same root variable.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function writeFunction(targetOne: *${PgslNumericType.typeName.float32}, targetTwo: *${PgslNumericType.typeName.float32}): void {
                    *targetOne = 1.0;
                }

                function testFunction(): void {
                    let testVariableOne: ${PgslNumericType.typeName.float32} = 0.0;
                    let testVariableTwo: ${PgslNumericType.typeName.float32} = 0.0;
                    writeFunction(&testVariableOne, &testVariableTwo);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Pointer argument aliasing a used module scope variable', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFunctionName: string = 'writeFunction';
            const lVariableName: string = 'testPrivate';
            const lCodeText: string = `
                private ${lVariableName}: ${PgslNumericType.typeName.float32} = 0.0;

                function ${lFunctionName}(targetValue: *${PgslNumericType.typeName.float32}): void {
                    *targetValue = ${lVariableName};
                }

                function testFunction(): void {
                    ${lFunctionName}(&${lVariableName});
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the aliased module scope variable.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Pointer argument of function "${lFunctionName}" must not reference the module scope variable "${lVariableName}" the function uses.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                private testPrivate: ${PgslNumericType.typeName.float32} = 0.0;

                function writeFunction(targetValue: *${PgslNumericType.typeName.float32}): void {
                    *targetValue = testPrivate;
                }

                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 0.0;
                    writeFunction(&testVariable);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
