import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { ArithmeticExpressionAst } from '../../../../source/abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts';
import { ComparisonExpressionAst } from '../../../../source/abstract_syntax_tree/expression/operation/comparison-expression-ast.ts';
import { LiteralValueExpressionAst } from '../../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslBooleanType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslOperator } from '../../../../source/enum/pgsl-operator.enum.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ComparisonExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Equality Operations', async (pContext) => {
        await pContext.step('Equal comparison', async (pContext) => {
            await pContext.step('Boolean', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let boolOne: bool = true;
                        let boolTwo: bool = false;
                        let testVariable: bool = boolOne == boolTwo;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Equal);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
            });

            await pContext.step('Boolean vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne == vectorTwo;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Equal);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
            });
        });

        await pContext.step('Not equal comparison', async (pContext) => {
            await pContext.step('Boolean', () => {
                // Setup.
                const lLeftValue: number = 5.0;
                const lRightValue: number = 3.0;
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = ${lLeftValue} != ${lRightValue};
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.NotEqual);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);

                // Evaluation. Correct left and right expressions.
                const lLeftExpression: LiteralValueExpressionAst = lExpressionNode.data.leftExpression as LiteralValueExpressionAst;
                const lRightExpression: LiteralValueExpressionAst = lExpressionNode.data.rightExpression as LiteralValueExpressionAst;
                expect(lLeftExpression).toBeInstanceOf(LiteralValueExpressionAst);
                expect(lLeftExpression.data.constantValue).toBe(lLeftValue);
                expect(lRightExpression).toBeInstanceOf(LiteralValueExpressionAst);
                expect(lRightExpression.data.constantValue).toBe(lRightValue);
            });

            await pContext.step('Boolean vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne != vectorTwo;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.NotEqual);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
            });
        });
    });

    await pContext.step('Relational Operations', async (pContext) => {
        await pContext.step('Lower than', async (pContext) => {
            await pContext.step('Float', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = 3.0 < 5.0;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.LowerThan);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
            });

            await pContext.step('Float vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne < vectorTwo;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
            });
        });

        await pContext.step('Lower than or equal', async (pContext) => {
            await pContext.step('Float', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = 3.0 <= 5.0;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.LowerThanEqual);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
            });

            await pContext.step('Float vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne <= vectorTwo;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
            });
        });

        await pContext.step('Greater than', async (pContext) => {
            await pContext.step('Float', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = 5.0 > 3.0;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.GreaterThan);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
            });

            await pContext.step('Float vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne > vectorTwo;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
            });
        });

        await pContext.step('Greater than or equal', async (pContext) => {
            await pContext.step('Float', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let testVariable: bool = 5.0 >= 3.0;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct operator.
                expect(lExpressionNode.data.operatorName).toBe(PgslOperator.GreaterThanEqual);

                // Evaluation. Correct result type.
                const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
                expect(lResultType).toBeInstanceOf(PgslBooleanType);
            });

            await pContext.step('Float vector', () => {
                // Setup.
                const lCodeText: string = `
                    function testFunction(): void {
                        let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                        let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                        let testVariable: ${PgslVectorType.typeName.vector3}<bool> = vectorOne >= vectorTwo;
                    }
                `;

                // Process.
                const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

                // Evaluation. Read parsed nodes.
                const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
                const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0] as FunctionOverloadDeclarationAst;
                const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

                // Evaluation. Correct type of expression node.
                const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
                expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);

                // Evaluation. Correct result type with dimension.
                const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
                expect(lResultType).toBeInstanceOf(PgslVectorType);
                expect(lResultType.dimension).toBe(3);
                expect(lResultType.innerType).toBeInstanceOf(PgslBooleanType);
            });
        });
    });

    await pContext.step('Arithmetic operand', () => {
        // Setup. Use string to ensure correct number insertion.
        const lRightValue: string = '10';
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.signedInteger} = 5;
                let testVariable: bool = testValue + 1 < ${lRightValue};
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Read parsed nodes.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

        // Evaluation. Comparison is the outer expression.
        const lExpressionNode: ComparisonExpressionAst = lVariableDeclarationNode.data.expression as ComparisonExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(ComparisonExpressionAst);
        expect(lExpressionNode.data.operatorName).toBe(PgslOperator.LowerThan);

        // Evaluation. Addition is grouped into the left side.
        expect(lExpressionNode.data.leftExpression).toBeInstanceOf(ArithmeticExpressionAst);

        // Evaluation. Right side is the plain value.
        const lRightExpression: LiteralValueExpressionAst = lExpressionNode.data.rightExpression as LiteralValueExpressionAst;
        expect(lRightExpression).toBeInstanceOf(LiteralValueExpressionAst);
        expect(lRightExpression.data.constantValue).toBe(parseFloat(lRightValue));
    });
});
