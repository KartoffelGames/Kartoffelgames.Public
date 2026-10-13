import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { ComparisonExpressionAst } from '../../../../source/abstract_syntax_tree/expression/operation/comparison-expression-ast.ts';
import { LogicalExpressionAst } from '../../../../source/abstract_syntax_tree/expression/operation/logical-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslBooleanType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslOperator } from '../../../../source/enum/pgsl-operator.enum.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('LogicalExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Logical OR', async (pContext) => {
        await pContext.step('Boolean', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let boolOne: bool = true;
                    let boolTwo: bool = false;
                    let testVariable: bool = boolOne || boolTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LogicalExpressionAst = lVariableDeclarationNode.data.expression as LogicalExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LogicalExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.ShortCircuitOr);

            // Evaluation. Correct result type.
            const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
            expect(lResultType).toBeInstanceOf(PgslBooleanType);
        });
    });

    await pContext.step('Logical AND', async (pContext) => {
        await pContext.step('Boolean', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let boolOne: bool = true;
                    let boolTwo: bool = false;
                    let testVariable: bool = boolOne && boolTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LogicalExpressionAst = lVariableDeclarationNode.data.expression as LogicalExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LogicalExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.ShortCircuitAnd);

            // Evaluation. Correct result type.
            const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
            expect(lResultType).toBeInstanceOf(PgslBooleanType);
        });
    });

    await pContext.step('Comparison operands', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.signedInteger} = 5;
                let testVariable: bool = testValue < 10 && testValue > 1;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Read parsed nodes.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

        // Evaluation. Logical expression is the outer expression.
        const lExpressionNode: LogicalExpressionAst = lVariableDeclarationNode.data.expression as LogicalExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(LogicalExpressionAst);
        expect(lExpressionNode.data.operatorName).toBe(PgslOperator.ShortCircuitAnd);

        // Evaluation. Both comparisons are grouped into the sides.
        expect(lExpressionNode.data.leftExpression).toBeInstanceOf(ComparisonExpressionAst);
        expect(lExpressionNode.data.rightExpression).toBeInstanceOf(ComparisonExpressionAst);
    });
});
