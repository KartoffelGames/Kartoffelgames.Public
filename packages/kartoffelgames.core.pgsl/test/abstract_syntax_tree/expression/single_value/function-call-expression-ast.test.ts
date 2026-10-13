import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { FunctionCallExpressionAst } from '../../../../source/abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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
            const lCodeText: string = `
                function testUserFunction(pValue: ${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                    return pValue;
                }
                function mainFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = testUserFunction(5.0);
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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
            const lCodeText: string = `
                function testUserFunction(pValueOne: ${PgslNumericType.typeName.float32}, pValueTwo: ${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                    return pValueOne + pValueTwo;
                }
                function mainFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = testUserFunction(5.0, 3.0);
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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
            const lCodeText: string = `
                function testUserFunction(pPointer: *${PgslNumericType.typeName.float32}): ${PgslNumericType.typeName.float32} {
                    return 1.0;
                }
                function mainFunction(): void {
                    let testValue: ${PgslNumericType.typeName.float32} = 5.0;
                    let resultValue: ${PgslNumericType.typeName.float32} = testUserFunction(&testValue);
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: FunctionCallExpressionAst = lVariableDeclarationNode.data.expression as FunctionCallExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(FunctionCallExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });
});
