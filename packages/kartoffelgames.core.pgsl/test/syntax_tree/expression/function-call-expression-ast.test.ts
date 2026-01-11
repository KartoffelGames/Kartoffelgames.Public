import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { FunctionCallExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import { AttributeListAst } from '../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionCallExpressionAst - Parsing', async (pContext) => {
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
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: FunctionCallExpressionAst = lVariableDeclarationNode.data.expression as FunctionCallExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(FunctionCallExpressionAst);

            // Evaluation. Correct function name.
            expect(lExpressionNode.data.name).toBe(lFunctionName);

            // Evaluation. Correct parameter count.
            expect(lExpressionNode.data.parameters).toHaveLength(0);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
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
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: FunctionCallExpressionAst = lVariableDeclarationNode.data.expression as FunctionCallExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(FunctionCallExpressionAst);

            // Evaluation. Correct parameter count.
            expect(lExpressionNode.data.parameters).toHaveLength(1);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
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
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: FunctionCallExpressionAst = lVariableDeclarationNode.data.expression as FunctionCallExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(FunctionCallExpressionAst);

            // Evaluation. Correct parameter count.
            expect(lExpressionNode.data.parameters).toHaveLength(2);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Pointer parameter', () => {
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
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: FunctionCallExpressionAst = lVariableDeclarationNode.data.expression as FunctionCallExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(FunctionCallExpressionAst);


            // Evaluation. Correct parameter count.
            expect(lExpressionNode.data.parameters).toHaveLength(1);
        });
    });

    await pContext.step('BuildIn functions', async (pContext) => {
        await pContext.step('Function: bitcast<float>(integer)', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let intValue: ${PgslNumericType.typeName.signedInteger} = 42;
                    let testVariable: ${PgslNumericType.typeName.float32} = bitcast<${PgslNumericType.typeName.float32}>(intValue);
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: FunctionCallExpressionAst = lVariableDeclarationNode.data.expression as FunctionCallExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(FunctionCallExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Function: floor(number)', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = floor(5.7);
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: FunctionCallExpressionAst = lVariableDeclarationNode.data.expression as FunctionCallExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(FunctionCallExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });
});

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
            `x:f32;` +
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

Deno.test('FunctionCallExpressionAst - Error', async (pContext) => {
    await pContext.step('Undefined function', () => {
        // Setup.
        const lFunctionName: string = 'undefinedFunction';
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}();
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention undefined function.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Function '${lFunctionName}' is not defined`)
        )).toBe(true);
    });

    await pContext.step('Parameter count mismatch', () => {
        // Setup.
        const lFunctionName: string = 'testUserFunction';
        const lCodeText: string = `
            function ${lFunctionName}(pValue: ${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                return pValue;
            }
            function mainFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}();
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention no matching function header.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`No matching function header found for function '${lFunctionName}'`)
        )).toBe(true);
    });

    await pContext.step('Parameter type mismatch', () => {
        // Setup.
        const lFunctionName: string = 'testUserFunction';
        const lCodeText: string = `
            function ${lFunctionName}(pValue: ${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                return pValue;
            }
            function mainFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}(true);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention no matching function header.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`No matching function header found for function '${lFunctionName}'`)
        )).toBe(true);
    });

    await pContext.step('Generic count mismatch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = bitcast<${PgslNumericType.typeName.float32}, ${PgslNumericType.typeName.signedInteger}>(42);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention no matching function header.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`No matching function header found`)
        )).toBe(true);
    });
});
