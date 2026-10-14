import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import type { ReturnStatementAstData } from '../../../../source/abstract_syntax_tree/statement/single/return-statement-ast.ts';
import { ReturnStatementAst } from '../../../../source/abstract_syntax_tree/statement/single/return-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ReturnStatementAst - Parsing', async (pContext) => {
    await pContext.step('Return with value', async (pContext) => {
        await pContext.step('Return numeric value', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.float32} {
                    return 5.0;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lReturnStatement: ReturnStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as ReturnStatementAst;
            expect(lReturnStatement).toBeInstanceOf(ReturnStatementAst);

            // Evaluation. Return statement has expression.
            const lReturnData: ReturnStatementAstData = lReturnStatement.data;
            expect(lReturnData.expression).not.toBeNull();
        });

        await pContext.step('Return variable', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.signedInteger} {
                    let resultValue: ${PgslNumericType.typeName.signedInteger} = 42;
                    return resultValue;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
            const lReturnStatement: ReturnStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as ReturnStatementAst;
            expect(lReturnStatement).toBeInstanceOf(ReturnStatementAst);

            // Evaluation. Return statement has expression.
            const lReturnData: ReturnStatementAstData = lReturnStatement.data;
            expect(lReturnData.expression).not.toBeNull();
        });
    });

    await pContext.step('Return without value', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                return;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lReturnStatement: ReturnStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as ReturnStatementAst;
        expect(lReturnStatement).toBeInstanceOf(ReturnStatementAst);

        // Evaluation. Return statement has no expression.
        const lReturnData: ReturnStatementAstData = lReturnStatement.data;
        expect(lReturnData.expression).toBeNull();
    });
});
