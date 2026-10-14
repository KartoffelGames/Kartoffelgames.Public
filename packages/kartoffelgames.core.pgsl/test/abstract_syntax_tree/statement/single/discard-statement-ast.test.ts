import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { DiscardStatementAst } from '../../../../source/abstract_syntax_tree/statement/single/discard-statement-ast.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('DiscardStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple discard', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                discard;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lDiscardStatement: DiscardStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as DiscardStatementAst;
        expect(lDiscardStatement).toBeInstanceOf(DiscardStatementAst);
    });

    await pContext.step('Discard in block', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    discard;
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        expect(lFunctionDeclaration.data.block.data.statementList[0]).toBeInstanceOf(Object);
    });
});
