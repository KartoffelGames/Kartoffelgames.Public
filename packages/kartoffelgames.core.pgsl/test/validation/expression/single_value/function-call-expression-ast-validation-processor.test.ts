import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslValidatorResult } from '../../../../source/validation/pgsl-validator.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionCallExpressionAst - Validation', async (pContext) => {
    await pContext.step('Undefined function', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFunctionName: string = 'undefinedFunction';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the undefined function.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Function '${lFunctionName}' is not defined.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function definedFunction(): ${PgslNumericType.typeName.float32} {
                    return 1.0;
                }

                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = definedFunction();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('No matching overload', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFunctionName: string = 'calledFunction';
            const lCodeText: string = `
                function ${lFunctionName}(parameterOne: ${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                    return parameterOne;
                }

                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}(true);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the missing overload with the used parameter types.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `No matching function overload found for function '${lFunctionName}' with parameter types (bool).`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function calledFunction(parameterOne: ${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                    return parameterOne;
                }

                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = calledFunction(1.0);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Unresolved generic', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let inputValue: ${PgslNumericType.typeName.unsignedInteger} = 1u;
                    let testVariable: ${PgslNumericType.typeName.float32} = bitcast(inputValue);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the generic that must be written.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Generic 'TResult' of function 'bitcast' must be written explicitly.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let inputValue: ${PgslNumericType.typeName.unsignedInteger} = 1u;
                    let testVariable: ${PgslNumericType.typeName.float32} = bitcast<${PgslNumericType.typeName.float32}>(inputValue);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Entry point call', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lFunctionName: string = 'computeFunction';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.compute}(1, 1, 1)]
                function ${lFunctionName}(): void {}

                function testFunction(): void {
                    ${lFunctionName}();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the entry point call.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Entry point function '${lFunctionName}' can not be called.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function calledFunction(): void {}

                function testFunction(): void {
                    calledFunction();
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });

    await pContext.step('Constant abstract argument range', async (pContext) => {
        await pContext.step('Error', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = clamp(5000000000, 0, 1i);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have errors.
            expect(lValidationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention the value that does not fit into the parameter type.
            expect(lValidationResult.incidents.some(pIncident =>
                pIncident.message === `Value 5000000000 does not fit into '${PgslNumericType.typeName.signedInteger}'.`
            )).toBe(true);
        });

        await pContext.step('Success', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = clamp(5, 0, 10i);
                }
            `;

            // Process.
            const lValidationResult: PgslValidatorResult = gPgslParser.validate(lCodeText);

            // Evaluation. Should have no errors.
            expect(lValidationResult.incidents.length).toBe(0);
        });
    });
});
