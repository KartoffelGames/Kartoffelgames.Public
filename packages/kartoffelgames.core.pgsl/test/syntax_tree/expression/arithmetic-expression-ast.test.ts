import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { ArithmeticExpressionAst } from '../../../source/abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts';
import { LiteralValueExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslMatrixType } from '../../../source/abstract_syntax_tree/type/pgsl-matrix-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../source/abstract_syntax_tree/type/pgsl-vector-type.ts';
import { PgslOperator } from '../../../source/enum/pgsl-operator.enum.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Plus);

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
            const lLeftValue: string = '5';
            const lRightValue: string = '3';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} + ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Plus);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Plus);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
            expect(lResultType.innerType).toBeInstanceOf(PgslNumericType);
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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

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
            const lLeftValue: string = '5.0';
            const lRightValue: string = '3.0';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} - ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Integer', () => {
            // Setup. Use string to ensure correct number insertion.
            const lLeftValue: string = '5';
            const lRightValue: string = '3';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} - ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Minus);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Minus);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

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
            const lLeftValue: string = '5.0';
            const lRightValue: string = '3.0';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} * ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Multiply);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Integer', () => {
            // Setup. Use string to ensure correct number insertion.
            const lLeftValue: string = '5';
            const lRightValue: string = '3';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} * ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Multiply);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Multiply);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Multiply);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

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
                    let matrixOne: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = matrixOne * vectorOne;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

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
            const lLeftValue: string = '6.0';
            const lRightValue: string = '3.0';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} / ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Divide);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Integer', () => {
            // Setup. Use string to ensure correct number insertion.
            const lLeftValue: string = '6';
            const lRightValue: string = '3';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} / ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Divide);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Divide);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

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
            const lLeftValue: string = '7.0';
            const lRightValue: string = '3.0';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} % ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Modulo);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);
        });

        await pContext.step('Integer', () => {
            // Setup. Use string to ensure correct number insertion.
            const lLeftValue: string = '7';
            const lRightValue: string = '3';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} % ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Modulo);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Modulo);

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

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ArithmeticExpressionAst = lVariableDeclarationNode.data.expression as ArithmeticExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ArithmeticExpressionAst);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });
    });
});

Deno.test('ArithmeticExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Addition', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 5.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} + ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}+${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} + ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}+${lRightValue};` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                `var testVariable:vec3<f32>=vectorOne+vectorTwo;` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var scalarValue:f32=5.0;` +
                `var testVariable:vec3<f32>=vectorOne+scalarValue;` +
                `}`
            );
        });
    });

    await pContext.step('Subtraction', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 5.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} - ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}-${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} - ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}-${lRightValue};` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(4.0,5.0,6.0);` +
                `var vectorTwo:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var testVariable:vec3<f32>=vectorOne-vectorTwo;` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var scalarValue:f32=5.0;` +
                `var testVariable:vec3<f32>=vectorOne-scalarValue;` +
                `}`
            );
        });
    });

    await pContext.step('Multiplication', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 5.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} * ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}*${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 5;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} * ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}*${lRightValue};` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var vectorTwo:vec3<f32>=vec3(4.0,5.0,6.0);` +
                `var testVariable:vec3<f32>=vectorOne*vectorTwo;` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var matrixOne:mat3x3<f32>=mat3x3(1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0);` +
                `var matrixTwo:mat3x3<f32>=mat3x3(2.0,0.0,0.0,0.0,2.0,0.0,0.0,0.0,2.0);` +
                `var testVariable:mat3x3<f32>=matrixOne*matrixTwo;` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var scalarValue:f32=5.0;` +
                `var testVariable:vec3<f32>=vectorOne*scalarValue;` +
                `}`
            );
        });

        await pContext.step('Mixed matrix with vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = matrixOne * vectorOne;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var matrixOne:mat3x3<f32>=mat3x3(1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0);` +
                `var vectorOne:vec3<f32>=vec3(1.0,2.0,3.0);` +
                `var testVariable:vec3<f32>=matrixOne*vectorOne;` +
                `}`
            );
        });
    });

    await pContext.step('Division', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 6.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} / ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}/${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 6;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} / ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}/${lRightValue};` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(6.0,9.0,12.0);` +
                `var vectorTwo:vec3<f32>=vec3(2.0,3.0,4.0);` +
                `var testVariable:vec3<f32>=vectorOne/vectorTwo;` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(6.0,9.0,12.0);` +
                `var scalarValue:f32=3.0;` +
                `var testVariable:vec3<f32>=vectorOne/scalarValue;` +
                `}`
            );
        });
    });

    await pContext.step('Modulo', async (pContext) => {
        await pContext.step('Float', () => {
            // Setup.
            const lLeftValue: number = 7.0;
            const lRightValue: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLeftValue} % ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=${lLeftValue}%${lRightValue};` +
                `}`
            );
        });

        await pContext.step('Integer', () => {
            // Setup.
            const lLeftValue: number = 7;
            const lRightValue: number = 3;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} % ${lRightValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:i32=${lLeftValue}%${lRightValue};` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(7.0,8.0,9.0);` +
                `var vectorTwo:vec3<f32>=vec3(3.0,3.0,3.0);` +
                `var testVariable:vec3<f32>=vectorOne%vectorTwo;` +
                `}`
            );
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
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var vectorOne:vec3<f32>=vec3(7.0,8.0,9.0);` +
                `var scalarValue:f32=3.0;` +
                `var testVariable:vec3<f32>=vectorOne%scalarValue;` +
                `}`
            );
        });
    });
});

Deno.test('ArithmeticExpressionAst - Error', async (pContext) => {
    await pContext.step('Non-numeric types in arithmetic', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let boolOne: bool = true;
                let boolTwo: bool = false;
                let testVariable: bool = boolOne + boolTwo;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention numeric value requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Arithmetic operation not supported for used types.')
        )).toBe(true);
    });

    await pContext.step('Vector dimension mismatch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let vectorTwo: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.0, 2.0);
                let vectorThree: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}(1.0, 2.0, 3.0);
                let testVariable: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = vectorTwo + vectorThree;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention type mismatch.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Left and right side of arithmetic expression must be the same type')
        )).toBe(true);
    });

    await pContext.step('Matrix dimension mismatch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let matrixTwo: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix22}(1.0, 0.0, 0.0, 1.0);
                let matrixThree: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
                let testVariable: ${PgslMatrixType.typeName.matrix22}<${PgslNumericType.typeName.float32}> = matrixTwo + matrixThree;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention type mismatch.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Left and right side of arithmetic expression must have the same dimensions.')
        )).toBe(true);
    });

    await pContext.step('Wrong types', async (pContext) => {
        await pContext.step('Matrix Division', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let matrixOne: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
                    let matrixTwo: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = new ${PgslMatrixType.typeName.matrix33}(2.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 2.0);
                    let testVariable: ${PgslMatrixType.typeName.matrix33}<${PgslNumericType.typeName.float32}> = matrixOne / matrixTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. Should have errors.
            expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

            // Evaluation. Error should mention numeric value or vector requirement.
            expect(lTranspilationResult.incidents.some(pIncident =>
                pIncident.message.includes('Left and right side of arithmetic expression must be a numeric') ||
                pIncident.message.includes('type')
            )).toBe(true);
        });
    });
});
