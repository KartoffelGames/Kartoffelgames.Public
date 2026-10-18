import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { ArithmeticExpressionAst } from '../../../../source/abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts';
import { LiteralValueExpressionAst } from '../../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslMatrixType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslOperator } from '../../../../source/enum/pgsl-operator.enum.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ArithmeticExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Addition', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup. Use string to ensure correct number insertion.
            const lLeftValue: string = '5.0';
            const lRightValue: string = '3.0';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} + ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Plus);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);

            // Evaluation. Correct left and right expressions.
            const lLeftExpression: LiteralValueExpressionAst = lExpressionNode.data.leftExpression as LiteralValueExpressionAst;
            const lRightExpression: LiteralValueExpressionAst = lExpressionNode.data.rightExpression as LiteralValueExpressionAst;
            expect(lLeftExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lLeftExpression.data.constantValue).toBe(parseFloat(lLeftValue));
            expect(lRightExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lRightExpression.data.constantValue).toBe(parseFloat(lRightValue));
        });

        await pContext.step('Integer', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 5 + 3;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Plus);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne + vectorTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Plus);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
            expect(lResultType.componentType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 5.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne + scalarValue;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });
    });

    await pContext.step('Subtraction', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 5.0 - 3.0;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Integer', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 5 - 3;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne - vectorTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 5.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne - scalarValue;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });
    });

    await pContext.step('Multiplication', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 5.0 * 3.0;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Multiply);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Integer', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 5 * 3;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Multiply);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(4.0, 5.0, 6.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne * vectorTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Multiply);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });

        await pContext.step('Matrix', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
                    let matrixTwo: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(2.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 2.0);
                    let testVariable: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = matrixOne * matrixTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Multiply);

            // Evaluation. Correct result type with dimensions.
            const lResultType: PgslMatrixType = lExpressionNode.data.resolveType as PgslMatrixType;
            expect(lResultType).toBeInstanceOf(PgslMatrixType);
            expect(lResultType.columnCount).toBe(3);
            expect(lResultType.rowCount).toBe(3);
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 5.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne * scalarValue;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });

        await pContext.step('Mixed matrix with vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix23}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0);
                    let vectorOne: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = matrixOne * vectorOne;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });

        await pContext.step('Mixed vector with matrix', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix23}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0);
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = vectorOne * matrixOne;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(2);
        });

        await pContext.step('Mixed multiple matrix with vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = matrixOne * matrixOne * matrixOne * vectorOne;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });
    });

    await pContext.step('Division', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 6.0 / 3.0;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Divide);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Integer', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 6 / 3;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Divide);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(6.0, 9.0, 12.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(2.0, 3.0, 4.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne / vectorTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Divide);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(6.0, 9.0, 12.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 3.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne / scalarValue;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });
    });

    await pContext.step('Modulo', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 7.0 % 3.0;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Modulo);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Integer', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 7 % 3;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Modulo);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
        });

        await pContext.step('Vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(7.0, 8.0, 9.0);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(3.0, 3.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne % vectorTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Modulo);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });

        await pContext.step('Mixed vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(7.0, 8.0, 9.0);
                    let scalarValue: ${PgslNumericType.typeName.float32} = 3.0;
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = vectorOne % scalarValue;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });
    });

    await pContext.step('Precedence', async (pContext) => {
        await pContext.step('Multiplication before addition', () => {
            // Setup. Use string to ensure correct number insertion.
            const lRightValue: string = '4';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 2 * 3 + ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Addition is the outer expression.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Plus);

            // Evaluation. Multiplication is grouped into the left side.
            const lLeftExpression: ArithmeticExpressionAst = lExpressionNode.data.leftExpression as ArithmeticExpressionAst;
            expect(lLeftExpression).toBeInstanceOf(ArithmeticExpressionAst);
            expect(lLeftExpression.data.operatorName).toBe(PgslOperator.Multiply);

            // Evaluation. Right side is the plain value.
            const lRightExpression: LiteralValueExpressionAst = lExpressionNode.data.rightExpression as LiteralValueExpressionAst;
            expect(lRightExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lRightExpression.data.constantValue).toBe(parseFloat(lRightValue));
        });

        await pContext.step('Same level from left to right', () => {
            // Setup. Use string to ensure correct number insertion.
            const lRightValue: string = '1';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 5 - 3 - ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Last subtraction is the outer expression.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.Minus);

            // Evaluation. First subtraction is grouped into the left side.
            const lLeftExpression: ArithmeticExpressionAst = lExpressionNode.data.leftExpression as ArithmeticExpressionAst;
            expect(lLeftExpression).toBeInstanceOf(ArithmeticExpressionAst);
            expect(lLeftExpression.data.operatorName).toBe(PgslOperator.Minus);

            // Evaluation. Right side is the plain value.
            const lRightExpression: LiteralValueExpressionAst = lExpressionNode.data.rightExpression as LiteralValueExpressionAst;
            expect(lRightExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lRightExpression.data.constantValue).toBe(parseFloat(lRightValue));
        });
    });

    await pContext.step('Result type', async (pContext) => {
        await pContext.step('Integer with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 1 + 2.0;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Integer converts to the float.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Abstract integer with concrete integer', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testValue: ${PgslNumericType.typeName.signedInteger} = 5;
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 1 + testValue;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Abstract integer converts to the concrete integer.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.signedInteger);
        });

        await pContext.step('Integer vector with float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1, 2, 3) * 2.0;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Vector components convert to the float.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
            expect((lResultType.componentType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Matrix with different dimensions', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix23}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0);
                    let matrixTwo: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(1.0, 0.0, 0.0, 1.0);
                    let testVariable: ${PgslMatrixType.typeName.matrix23}<${PgslNumericType.typeName.float32}> = matrixOne * matrixTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Result has the right columns and the left rows.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            const lResultType: PgslMatrixType = lExpressionNode.data.resolveType as PgslMatrixType;
            expect(lResultType).toBeInstanceOf(PgslMatrixType);
            expect(lResultType.columnCount).toBe(2);
            expect(lResultType.rowCount).toBe(3);
        });
    });
});
