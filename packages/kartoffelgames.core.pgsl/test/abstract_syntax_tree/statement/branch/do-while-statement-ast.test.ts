import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { DoWhileStatementAst } from '../../../../source/abstract_syntax_tree/statement/branch/do-while-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('DoWhileStatementAst - Parsing', async (pContext) => {
    await pContext.step('Empty do-while', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                do {
                } while (true);
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lDoWhileStatement: DoWhileStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as DoWhileStatementAst;
        expect(lDoWhileStatement).toBeInstanceOf(DoWhileStatementAst);
    });

    await pContext.step('Simple Do-while', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let count: ${PgslNumericType.typeName.signedInteger} = 0;
                do {
                } while (count < 10);
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lDoWhileStatement: DoWhileStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as DoWhileStatementAst;
        expect(lDoWhileStatement).toBeInstanceOf(DoWhileStatementAst);
    });

    await pContext.step('Complex Do-while', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                do {
                } while (true || false);
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lDoWhileStatement: DoWhileStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as DoWhileStatementAst;
        expect(lDoWhileStatement).toBeInstanceOf(DoWhileStatementAst);
    });
});
