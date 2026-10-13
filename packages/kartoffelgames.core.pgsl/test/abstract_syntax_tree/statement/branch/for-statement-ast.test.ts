import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { ForStatementAst } from '../../../../source/abstract_syntax_tree/statement/branch/for-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ForStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple for loop with all parts', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10; i++) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lForStatement: ForStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as ForStatementAst;
        expect(lForStatement).toBeInstanceOf(ForStatementAst);
        expect(lForStatement.data.init).not.toBeNull();
        expect(lForStatement.data.expression).not.toBeNull();
        expect(lForStatement.data.update).not.toBeNull();
    });

    await pContext.step('For loop without init', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (; true;) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lForStatement: ForStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as ForStatementAst;
        expect(lForStatement).toBeInstanceOf(ForStatementAst);
        expect(lForStatement.data.init).toBeNull();
        expect(lForStatement.data.expression).not.toBeNull();
        expect(lForStatement.data.update).toBeNull();
    });

    await pContext.step('For loop without expression', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0;;) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lForStatement: ForStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as ForStatementAst;
        expect(lForStatement).toBeInstanceOf(ForStatementAst);
        expect(lForStatement.data.init).not.toBeNull();
        expect(lForStatement.data.expression).toBeNull();
        expect(lForStatement.data.update).toBeNull();
    });

    await pContext.step('For loop without update', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10;) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lForStatement: ForStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as ForStatementAst;
        expect(lForStatement).toBeInstanceOf(ForStatementAst);
        expect(lForStatement.data.init).not.toBeNull();
        expect(lForStatement.data.expression).not.toBeNull();
        expect(lForStatement.data.update).toBeNull();
    });
});
