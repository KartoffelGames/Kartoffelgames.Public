import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { IfStatementAst } from '../../../../source/abstract_syntax_tree/statement/branch/if-statement-ast.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('IfStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple if statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lIfStatement: IfStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as IfStatementAst;
        expect(lIfStatement).toBeInstanceOf(IfStatementAst);
        expect(lIfStatement.data.else).toBeNull();
    });

    await pContext.step('If-else statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                } else {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lIfStatement: IfStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as IfStatementAst;
        expect(lIfStatement).toBeInstanceOf(IfStatementAst);
        expect(lIfStatement.data.else).not.toBeNull();
    });

    await pContext.step('If-else-if statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                } else if (false) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lIfStatement: IfStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as IfStatementAst;
        expect(lIfStatement).toBeInstanceOf(IfStatementAst);
        expect(lIfStatement.data.else).not.toBeNull();
    });

    await pContext.step('If-else-if-else statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                } else if (false) {
                } else {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lIfStatement: IfStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as IfStatementAst;
        expect(lIfStatement).toBeInstanceOf(IfStatementAst);
        expect(lIfStatement.data.else).not.toBeNull();
        expect(lIfStatement.data.else).toBeInstanceOf(IfStatementAst);
        expect((<IfStatementAst>lIfStatement.data.else!).data.else).not.toBeNull();
    });

    await pContext.step('If with complex condition', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true && false) {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lIfStatement: IfStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as IfStatementAst;
        expect(lIfStatement).toBeInstanceOf(IfStatementAst);
        expect(lIfStatement.data.else).toBeNull();
    });

    await pContext.step('Error: Single else not being the last', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                } else {
                } else if (false) {
                }
            }
        `;

        // Process.
        const lErrorFunction = () => {
            gPgslParser.parseAst(lCodeText);
        };

        // Evaluation. Should have errors.
        expect(lErrorFunction).toThrow('Unexpected token "else". "BlockEnd" expected');
    });
});
