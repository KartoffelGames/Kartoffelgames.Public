import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { BinaryExpressionAst } from '../../../../source/abstract_syntax_tree/expression/operation/binary-expression-ast.ts';
import { LiteralValueExpressionAst } from '../../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslOperator } from '../../../../source/enum/pgsl-operator.enum.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('BinaryExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Bitwise Operations', async (pContext) => {
        await pContext.step('Binary OR', () => {
            // Setup. Use string to ensure correct number insertion.
            const lLeftValue: string = '5';
            const lRightValue: string = '3';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLeftValue} | ${lRightValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryOr);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);

            // Evaluation. Correct left and right expressions.
            const lLeftExpression: LiteralValueExpressionAst = lExpressionNode.data.leftExpression as LiteralValueExpressionAst;
            const lRightExpression: LiteralValueExpressionAst = lExpressionNode.data.rightExpression as LiteralValueExpressionAst;
            expect(lLeftExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lLeftExpression.data.constantValue).toBe(parseFloat(lLeftValue));
            expect(lRightExpression).toBeInstanceOf(LiteralValueExpressionAst);
            expect(lRightExpression.data.constantValue).toBe(parseFloat(lRightValue));
        });

        await pContext.step('Binary AND', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 5 & 3;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryAnd);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
        });

        await pContext.step('Binary XOR', () => {
            // Setup. Use string to ensure correct number insertion.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 5 ^ 3;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryXor);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
        });

        await pContext.step('Chained binary AND', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = 5 & 3 & 1;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. First operation is grouped into the left side.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);
            expect(lExpressionNode.data.leftExpression).toBeInstanceOf(BinaryExpressionAst);
        });

        await pContext.step('Abstract integer with unsigned integer', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testValue: ${PgslNumericType.typeName.unsignedInteger} = 5u;
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = 3 | testValue;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Abstract integer converts to the unsigned integer.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
            expect(lResultType.numericTypeName).toBe(PgslNumericType.typeName.unsignedInteger);
        });
    });

    await pContext.step('Shift Operations', async (pContext) => {
        await pContext.step('Shift left', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let shiftVariable: ${PgslNumericType.typeName.signedInteger} = 5;
                    let result: ${PgslNumericType.typeName.signedInteger} = shiftVariable << 2;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct expression type.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.ShiftLeft);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Shift right', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let shiftVariable: ${PgslNumericType.typeName.unsignedInteger} = 20u;
                    let result: ${PgslNumericType.typeName.unsignedInteger} = shiftVariable >> 2u;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct expression type.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.ShiftRight);

            // Evaluation. Correct result type.
            const lResultType: PgslNumericType = lExpressionNode.data.resolveType as PgslNumericType;
            expect(lResultType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Vector Binary Operations', async (pContext) => {
        await pContext.step('Vector binary OR', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(5, 3, 7);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(2, 6, 4);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = vectorOne | vectorTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryOr);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
            expect(lResultType.innerType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Vector binary AND', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let vectorOne: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(5, 3, 7);
                    let vectorTwo: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = new ${PgslVectorType.typeName.vector3}(2, 6, 4);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.signedInteger}> = vectorOne & vectorTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: BinaryExpressionAst = lVariableDeclarationNode.data.expression as BinaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(BinaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.BinaryAnd);

            // Evaluation. Correct result type with dimension.
            const lResultType: PgslVectorType = lExpressionNode.data.resolveType as PgslVectorType;
            expect(lResultType).toBeInstanceOf(PgslVectorType);
            expect(lResultType.dimension).toBe(3);
        });
    });
});
