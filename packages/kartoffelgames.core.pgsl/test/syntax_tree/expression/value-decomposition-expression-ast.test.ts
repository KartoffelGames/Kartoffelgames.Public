import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { ValueDecompositionExpressionAst } from '../../../source/abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ValueDecompositionExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Struct Property Access', async (pContext) => {
        await pContext.step('Simple property access', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'propertyOne';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
                function testFunction(): void {
                    let testStruct: ${lStructName};
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ValueDecompositionExpressionAst = lVariableDeclarationNode.data.expression as ValueDecompositionExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ValueDecompositionExpressionAst);

            // Evaluation. Correct property name.
            expect(lExpressionNode.data.property).toBe(lPropertyName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Nested property access', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lNestedStructName: string = 'NestedStruct';
            const lPropertyName: string = 'propertyOne';
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct ${lNestedStructName} {
                    ${lNestedPropertyName}: ${PgslNumericType.typeName.float32}
                }
                struct ${lStructName} {
                    ${lPropertyName}: ${lNestedStructName}
                }
                function testFunction(): void {
                    let testStruct: ${lStructName};
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName}.${lNestedPropertyName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[2] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ValueDecompositionExpressionAst = lVariableDeclarationNode.data.expression as ValueDecompositionExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ValueDecompositionExpressionAst);

            // Evaluation. Correct property name.
            expect(lExpressionNode.data.property).toBe(lNestedPropertyName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Enum Value Access', async (pContext) => {
        await pContext.step('Enum value by name', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lValueName: string = 'testValueOne';
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lValueName} = 1,
                    testValueTwo = 2
                }
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lEnumName}.${lValueName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ValueDecompositionExpressionAst = lVariableDeclarationNode.data.expression as ValueDecompositionExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ValueDecompositionExpressionAst);

            // Evaluation. Correct property name.
            expect(lExpressionNode.data.property).toBe(lValueName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Vector Swizzling', async (pContext) => {
        await pContext.step('Single component swizzle', async () => {
            // Setup.
            const lSwizzle: string = 'x';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ValueDecompositionExpressionAst = lVariableDeclarationNode.data.expression as ValueDecompositionExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ValueDecompositionExpressionAst);

            // Evaluation. Correct property name.
            expect(lExpressionNode.data.property).toBe(lSwizzle);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Multi component swizzle', async () => {
            // Setup.
            const lSwizzle: string = 'xy';
            const lCodeText: string = `
            function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ValueDecompositionExpressionAst = lVariableDeclarationNode.data.expression as ValueDecompositionExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ValueDecompositionExpressionAst);

            // Evaluation. Correct property name.
            expect(lExpressionNode.data.property).toBe(lSwizzle);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslVectorType);
        });

        await pContext.step('RGBA notation', async (pContext) => {
            await pContext.step('rgba', () => {
                // Setup.
                const lSwizzle: string = 'rgba';
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVector: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0, 4.0);
                        let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzle};
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ValueDecompositionExpressionAst = lVariableDeclarationNode.data.expression as ValueDecompositionExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ValueDecompositionExpressionAst);

                // Evaluation. Correct property name.
                expect(lExpressionNode.data.property).toBe(lSwizzle);

                // Evaluation. Correct result type.
                expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslVectorType);
            });
        });

        await pContext.step('XYZW notation', async (pContext) => {
            await pContext.step('rgba', () => {
                // Setup.
                const lSwizzle: string = 'xyzw';
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVector: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0, 4.0);
                        let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzle};
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Process. Assume correct parsing.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ValueDecompositionExpressionAst = lVariableDeclarationNode.data.expression as ValueDecompositionExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ValueDecompositionExpressionAst);

                // Evaluation. Correct property name.
                expect(lExpressionNode.data.property).toBe(lSwizzle);

                // Evaluation. Correct result type.
                expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslVectorType);
            });
        });
    });
});

Deno.test('ValueDecompositionExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Struct Property Access', async (pContext) => {
        await pContext.step('Simple property access', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lPropertyName: string = 'propertyOne';
            const lCodeText: string = `
                struct ${lStructName} {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
                function testFunction(): void {
                    let testStruct: ${lStructName};
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lStructName}{` +
                `${lPropertyName}:f32` +
                `}` +
                `fn testFunction(){` +
                `var testStruct:${lStructName};` +
                `var testVariable:f32=testStruct.${lPropertyName};` +
                `}`
            );
        });

        await pContext.step('Nested property access', () => {
            // Setup.
            const lStructName: string = 'TestStruct';
            const lNestedStructName: string = 'NestedStruct';
            const lPropertyName: string = 'propertyOne';
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct ${lNestedStructName} {
                    ${lNestedPropertyName}: ${PgslNumericType.typeName.float32}
                }
                struct ${lStructName} {
                    ${lPropertyName}: ${lNestedStructName}
                }
                function testFunction(): void {
                    let testStruct: ${lStructName};
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName}.${lNestedPropertyName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `struct ${lNestedStructName}{` +
                `${lNestedPropertyName}:f32` +
                `}` +
                `struct ${lStructName}{` +
                `${lPropertyName}:${lNestedStructName}` +
                `}` +
                `fn testFunction(){` +
                `var testStruct:${lStructName};` +
                `var testVariable:f32=testStruct.${lPropertyName}.${lNestedPropertyName};` +
                `}`
            );
        });
    });

    await pContext.step('Enum Value Access', async (pContext) => {
        await pContext.step('Enum value by name', () => {
            // Setup.
            const lEnumName: string = 'TestEnum';
            const lValueName: string = 'testValueOne';
            const lEnumValue: number = 1;
            const lCodeText: string = `
                enum ${lEnumName} {
                    ${lValueName} = ${lEnumValue},
                    testValueTwo = 2
                }
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lEnumName}.${lValueName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lEnumValue};` +
                `}`
            );
        });
    });

    await pContext.step('Vector Swizzling', async (pContext) => {
        await pContext.step('Single component swizzle', async () => {
            // Setup.
            const lSwizzle: string = 'x';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslNumericType.typeName.float32} = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVector:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var testVariable:f32=testVector.${lSwizzle};` +
                `}`
            );
        });

        await pContext.step('Multi component swizzle', async () => {
            // Setup.
            const lSwizzle: string = 'xy';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVector:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var testVariable:vec2<f32>=testVector.${lSwizzle};` +
                `}`
            );
        });

        await pContext.step('RGBA notation', async () => {
            // Setup.
            const lSwizzle: string = 'rgba';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0);
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVector:vec4<f32>=vec4(1.0,2.0,3.0,4.0);` +
                `var testVariable:vec4<f32>=testVector.${lSwizzle};` +
                `}`
            );
        });

        await pContext.step('XYZW notation', async () => {
            // Setup.
            const lSwizzle: string = 'xyzw';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector4}(1.0, 2.0, 3.0, 4.0);
                    let testVariable: ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> = testVector.${lSwizzle};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVector:vec4<f32>=vec4(1.0,2.0,3.0,4.0);` +
                `var testVariable:vec4<f32>=testVector.${lSwizzle};` +
                `}`
            );
        });
    });
});

Deno.test('ValueDecompositionExpressionAst - Error', async (pContext) => {
    await pContext.step('Non-composite type', () => {
        // Setup.
        const lVariableName: string = 'testVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName}.property;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention non-composite type.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`cannot decompose`) ||
            pIncident.message.includes(`Cannot decompose`) ||
            pIncident.message.includes(`is not a composite type`)
        )).toBe(true);
    });

    await pContext.step('Undefined struct property', () => {
        // Setup.
        const lStructName: string = 'TestStruct';
        const lPropertyName: string = 'undefinedProperty';
        const lCodeText: string = `
            struct ${lStructName} {
                propertyOne: ${PgslNumericType.typeName.float32}
            }
            function testFunction(): void {
                let testStruct: ${lStructName};
                let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention undefined property.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Struct has no defined property "${lPropertyName}"`)
        )).toBe(true);
    });

    await pContext.step('Undefined enum value', () => {
        // Setup.
        const lEnumName: string = 'TestEnum';
        const lValueName: string = 'undefinedValue';
        const lCodeText: string = `
            enum ${lEnumName} {
                testValueOne = 1,
                testValueTwo = 2
            }
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lEnumName}.${lValueName};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention undefined enum value.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Enum "${lEnumName}" does not contain a value for property "${lValueName}"`)
        )).toBe(true);
    });

    await pContext.step('Invalid swizzle name', () => {
        // Setup.
        const lSwizzle: string = 'invalidSwizzle';
        const lCodeText: string = `
            function testFunction(): void {
                let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0);
                let testVariable: ${PgslNumericType.typeName.float32} = testVector.${lSwizzle};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention invalid swizzle.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Swizzle name "${lSwizzle}" can't be used to access vector`)
        )).toBe(true);
    });

    await pContext.step('Struct type not found', () => {
        // Setup.
        const lStructName: string = 'UndefinedStruct';
        const lPropertyName: string = 'propertyOne';
        const lCodeText: string = `
            function testFunction(): void {
                let testStruct: ${lStructName};
                let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention struct type not found.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Typename "${lStructName}" not defined.`)
        )).toBe(true);
    });

    await pContext.step('Enum type not found', () => {
        // Setup.
        const lEnumName: string = 'UndefinedEnum';
        const lValueName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lEnumName}.${lValueName};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention enum type not found.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes(`Variable "${lEnumName}" not defined.`)
        )).toBe(true);
    });
});
