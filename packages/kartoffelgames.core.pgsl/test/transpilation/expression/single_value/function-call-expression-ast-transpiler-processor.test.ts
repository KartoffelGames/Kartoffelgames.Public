import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionCallExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('User functions', async (pContext) => {
        await pContext.step('No parameters', () => {
            // Setup.
            const lFunctionName: string = 'testUserFunction';
            const lCodeText: string = `
                function ${lFunctionName}(): ${PgslNumericType.typeName.float32} {
                    return 42.0;
                }
                function mainFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}();
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}()->f32{` +
                `return 42.0;` +
                `}` +
                `fn mainFunction(){` +
                `var testVariable:f32=${lFunctionName}();` +
                `}`
            );
        });

        await pContext.step('Single parameter', () => {
            // Setup.
            const lFunctionName: string = 'testUserFunction';
            const lParameterValue: number = 5.0;
            const lCodeText: string = `
                function ${lFunctionName}(pValue: ${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                    return pValue;
                }
                function mainFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}(${lParameterValue});
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}(pValue:f32)->f32{` +
                `return pValue;` +
                `}` +
                `fn mainFunction(){` +
                `var testVariable:f32=${lFunctionName}(${lParameterValue});` +
                `}`
            );
        });

        await pContext.step('Multiple parameters', () => {
            // Setup.
            const lFunctionName: string = 'testUserFunction';
            const lCodeText: string = `
                function ${lFunctionName}(pValueOne: ${PgslNumericType.typeName.float32}, pValueTwo: ${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                    return pValueOne + pValueTwo;
                }
                function mainFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}(5.0, 3.0);
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn ${lFunctionName}(pValueOne:f32,pValueTwo:f32)->f32{` +
                `return pValueOne+pValueTwo;` +
                `}` +
                `fn mainFunction(){` +
                `var testVariable:f32=${lFunctionName}(5.0,3.0);` +
                `}`
            );
        });

        await pContext.step('Pointer parameter', async (pContext) => {
            await pContext.step('Function address space', () => {
                // Setup.
                const lFunctionName: string = 'testUserFunction';
                const lCodeText: string = `
                    function ${lFunctionName}(pPointer: *${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                        return 1.0;
                    }
                    function mainFunction(): void {
                        let testValue: ${PgslNumericType.typeName.float32} = 5.0;
                        let resultValue: ${PgslNumericType.typeName.float32} = ${lFunctionName}(&testValue);
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `fn ${lFunctionName}(pPointer:ptr<function,f32>)->f32{` +
                    `return 1.0;` +
                    `}` +
                    `fn mainFunction(){` +
                    `var testValue:f32=5.0;` +
                    `var resultValue:f32=${lFunctionName}(&testValue);` +
                    `}`
                );
            });

            await pContext.step('Module address space', () => {
                // Setup.
                const lFunctionName: string = 'testUserFunction';
                const lVariableName: string = 'moduleVariable';
                const lCodeText: string = `
                    private ${lVariableName}: ${PgslNumericType.typeName.float32};
                    function ${lFunctionName}(pPointer: *${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                        return 1.0;
                    }
                    function mainFunction(): void {
                        let resultValue: ${PgslNumericType.typeName.float32} =${lFunctionName}(&${lVariableName});
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `var<private> ${lVariableName}:f32;` +
                    `fn ${lFunctionName}(pPointer:ptr<private,f32>)->f32{` +
                    `return 1.0;` +
                    `}` +
                    `fn mainFunction(){` +
                    `var resultValue:f32=${lFunctionName}(&${lVariableName});` +
                    `}`
                );
            });

            await pContext.step('Workgroup address space', () => {
                // Setup.
                const lFunctionName: string = 'testUserFunction';
                const lVariableName: string = 'workgroupVariable';
                const lCodeText: string = `
                    workgroup ${lVariableName}: ${PgslNumericType.typeName.float32};
                    function ${lFunctionName}(pPointer: *${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                        return 1.0;
                    }
                    function mainFunction(): void {
                        let resultValue: ${PgslNumericType.typeName.float32} = ${lFunctionName}(&${lVariableName});
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `var<workgroup> ${lVariableName}:f32;` +
                    `fn ${lFunctionName}(pPointer:ptr<workgroup,f32>)->f32{` +
                    `return 1.0;` +
                    `}` +
                    `fn mainFunction(){` +
                    `var resultValue:f32=${lFunctionName}(&${lVariableName});` +
                    `}`
                );
            });

            await pContext.step('Uniform address space', () => {
                // Setup.
                const lFunctionName: string = 'testUserFunction';
                const lVariableName: string = 'uniformVariable';
                const lCodeText: string = `
                    [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                    uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
                    function ${lFunctionName}(pPointer: *${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                        return 1.0;
                    }
                    function mainFunction(): void {
                        let resultValue: ${PgslNumericType.typeName.float32} = ${lFunctionName}(&${lVariableName});
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `@group(0)@binding(0)var<uniform> ${lVariableName}:f32;` +
                    `fn ${lFunctionName}(pPointer:ptr<uniform,f32>)->f32{` +
                    `return 1.0;` +
                    `}` +
                    `fn mainFunction(){` +
                    `var resultValue:f32=${lFunctionName}(&${lVariableName});` +
                    `}`
                );
            });

            await pContext.step('Storage address space', () => {
                // Setup.
                const lFunctionName: string = 'testUserFunction';
                const lVariableName: string = 'storageVariable';
                const lCodeText: string = `
                    [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                    storage ${lVariableName}: ${PgslNumericType.typeName.float32};
                    function ${lFunctionName}(pPointer: *${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                        return 1.0;
                    }
                    function mainFunction(): void {
                        let resultValue: ${PgslNumericType.typeName.float32} = ${lFunctionName}(&${lVariableName});
                    }
                `;

                // Process.
                const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

                // Evaluation. No errors.
                expect(lTranspilationResult.incidents).toHaveLength(0);

                // Evaluation. Correct transpilation output.
                expect(lTranspilationResult.source).toBe(
                    `@group(0)@binding(0)var<storage,read> ${lVariableName}:f32;` +
                    `fn ${lFunctionName}(pPointer:ptr<storage,f32>)->f32{` +
                    `return 1.0;` +
                    `}` +
                    `fn mainFunction(){` +
                    `var resultValue:f32=${lFunctionName}(&${lVariableName});` +
                    `}`
                );
            });
        });
    });

    await pContext.step('BuildIn functions', async () => {
        // Setup.
        const lFunctionName: string = 'testUserFunction';
        const lCodeText: string = `
            struct Point {
                x: float
            }
            function ${lFunctionName}(pValue: ${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                return pValue;
            }
            function mainFunction(): void {
                let point: Point;
                let resultValue: ${PgslNumericType.typeName.float32} = ${lFunctionName}(point.x - 10.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `struct Point{` +
            `x:f32` +
            `}` +
            `fn ${lFunctionName}(pValue:f32)->f32{` +
            `return pValue;` +
            `}` +
            `fn mainFunction(){` +
            `var point:Point;` +
            `var resultValue:f32=${lFunctionName}(point.x-10.0);` +
            `}`
        );
    });
});
