import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { VariableNameExpressionAst } from '../../../../source/abstract_syntax_tree/expression/storage/variable-name-expression-ast.ts';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableNameExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Variable References', async (pContext) => {
        await pContext.step('Let variable', () => {
            // Setup.
            const lVariableName: string = 'testLetVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lVariableName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);

            // Evaluation. Is storage value.
            expect(lExpressionNode.data.isStorage).toBe(true);
        });

        await pContext.step('Function const variable', () => {
            // Setup.
            const lVariableName: string = 'testConstVariable';
            const lCodeText: string = `
                function testFunction(): void {
                    const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lVariableName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Module const variable', () => {
            // Setup.
            const lVariableName: string = 'moduleVariable';
            const lCodeText: string = `
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                function testFunction(): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lVariableName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Parameter variable', () => {
            // Setup.
            const lParameterName: string = 'testParameter';
            const lCodeText: string = `
                function testFunction(${lParameterName}: ${PgslNumericType.typeName.float32}): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lParameterName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lParameterName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Uniform variable', () => {
            // Setup.
            const lVariableName: string = 'uniformVariable';
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                uniform ${lVariableName}: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let testResult: ${PgslNumericType.typeName.float32} = ${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: VariableNameExpressionAst = lVariableDeclarationNode.data.expression as VariableNameExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(VariableNameExpressionAst);

            // Evaluation. Correct variable name.
            expect(lExpressionNode.data.variableName).toBe(lVariableName);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });
});
