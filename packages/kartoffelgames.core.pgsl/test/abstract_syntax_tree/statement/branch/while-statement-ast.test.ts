import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { WhileStatementAst } from '../../../../source/abstract_syntax_tree/statement/branch/while-statement-ast.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('WhileStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple while loop', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                while (true) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lWhileStatement: WhileStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as WhileStatementAst;
        expect(lWhileStatement).toBeInstanceOf(WhileStatementAst);
    });

    await pContext.step('While with variable condition', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let count: ${PgslNumericType.typeName.signedInteger} = 0;
                while (count < 10) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lWhileStatement: WhileStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as WhileStatementAst;
        expect(lWhileStatement).toBeInstanceOf(WhileStatementAst);
    });

    await pContext.step('While with complex condition', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                while (true && false) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lWhileStatement: WhileStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as WhileStatementAst;
        expect(lWhileStatement).toBeInstanceOf(WhileStatementAst);
    });
});
