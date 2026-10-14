import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { FunctionCallExpressionAst } from '../../../../source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import { IndexedValueExpressionAst } from '../../../../source/abstract_syntax_tree/expression/storage/indexed-value-expression-ast.ts';
import { ValueDecompositionExpressionAst } from '../../../../source/abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts';
import { VariableNameExpressionAst } from '../../../../source/abstract_syntax_tree/expression/storage/variable-name-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslArrayType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ValueDecompositionExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Struct Property Access', async (pContext) => {
        await pContext.step('Simple property access', () => {
            // Setup.
            const lPropertyName: string = 'propertyOne';
            const lCodeText: string = `
                struct TestStruct {
                    ${lPropertyName}: ${PgslNumericType.typeName.float32}
                }
                function testFunction(): void {
                    let testStruct: TestStruct;
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.${lPropertyName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

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
            const lNestedPropertyName: string = 'nestedProperty';
            const lCodeText: string = `
                struct NestedStruct {
                    ${lNestedPropertyName}: ${PgslNumericType.typeName.float32}
                }
                struct TestStruct {
                    propertyOne: NestedStruct
                }
                function testFunction(): void {
                    let testStruct: TestStruct;
                    let testVariable: ${PgslNumericType.typeName.float32} = testStruct.propertyOne.${lNestedPropertyName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[2] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

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
            const lValueName: string = 'testValueOne';
            const lCodeText: string = `
                enum TestEnum {
                    ${lValueName} = 1,
                    testValueTwo = 2
                }
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = TestEnum.${lValueName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

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

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

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

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

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

    await pContext.step('Decomposing a chained value', async (pContext) => {
        await pContext.step('After an index', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorArray: ${PgslArrayType.typeName.array}<${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>, 2>;
                    let testVariable: ${PgslNumericType.typeName.float32} = vectorArray[0].x;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. The property access wraps the index, not the other way around.
            const lExpressionNode: ValueDecompositionExpressionAst = lVariableDeclarationNode.data.expression as ValueDecompositionExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ValueDecompositionExpressionAst);
            expect(lExpressionNode.data.property).toBe('x');

            const lIndexExpression: IndexedValueExpressionAst = lExpressionNode.data.expressionValue as IndexedValueExpressionAst;
            expect(lIndexExpression).toBeInstanceOf(IndexedValueExpressionAst);
            expect(lIndexExpression.data.value).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('After a function call', () => {
            // Setup.
            const lFunctionName: string = 'createVector';
            const lCodeText: string = `
                function ${lFunctionName}(): ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}> {
                    return new ${PgslVectorType.typeName.vector4}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0, 4.0);
                }
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lFunctionName}().x;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. A call result can be decomposed directly.
            const lExpressionNode: ValueDecompositionExpressionAst = lVariableDeclarationNode.data.expression as ValueDecompositionExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ValueDecompositionExpressionAst);
            expect(lExpressionNode.data.property).toBe('x');

            const lCallExpression: FunctionCallExpressionAst = lExpressionNode.data.expressionValue as FunctionCallExpressionAst;
            expect(lCallExpression).toBeInstanceOf(FunctionCallExpressionAst);
            expect(lCallExpression.data.name).toBe(lFunctionName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });
});
