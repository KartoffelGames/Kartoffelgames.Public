import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { UnaryExpressionAst } from '../../../../source/abstract_syntax_tree/expression/unary/unary-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslBooleanType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslOperator } from '../../../../source/enum/pgsl-operator.enum.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('UnaryExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Bitwise Operations', async (pContext) => {
        await pContext.step('Binary negation', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ~5;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.BinaryNegate);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Arithmetic Operations', async (pContext) => {
        await pContext.step('Negation integer', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = -5;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Negation float', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = -5.0;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Negation vector', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVector: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}>(1.0, 2.0, 3.0);
                    let testVariable: ${PgslVectorType.typeName.vector3}<${PgslNumericType.typeName.float32}> = -testVector;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Minus);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslVectorType);
        });
    });

    await pContext.step('Logical Operations', async (pContext) => {
        await pContext.step('Boolean negation', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = !${true};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: UnaryExpressionAst = lVariableDeclarationNode.data.expression as UnaryExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(UnaryExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operator).toBe(PgslOperator.Not);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslBooleanType);
        });
    });
});
