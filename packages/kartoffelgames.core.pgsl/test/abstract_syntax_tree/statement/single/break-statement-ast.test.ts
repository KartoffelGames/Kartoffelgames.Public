import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import type { DoWhileStatementAst } from '../../../../source/abstract_syntax_tree/statement/branch/do-while-statement-ast.ts';
import type { ForStatementAst } from '../../../../source/abstract_syntax_tree/statement/branch/for-statement-ast.ts';
import type { SwitchStatementAst, SwitchStatementAstSwitchCase } from '../../../../source/abstract_syntax_tree/statement/branch/switch-statement-ast.ts';
import type { WhileStatementAst } from '../../../../source/abstract_syntax_tree/statement/branch/while-statement-ast.ts';
import { BreakStatementAst } from '../../../../source/abstract_syntax_tree/statement/single/break-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('BreakStatementAst - Parsing', async (pContext) => {
    await pContext.step('Break in loop', async (pContext) => {
        await pContext.step('Break in while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    while (true) {
                        break;
                    }
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lWhileStatement: WhileStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as WhileStatementAst;
            const lBreakStatement: BreakStatementAst = lWhileStatement.data.block.data.statementList[0] as BreakStatementAst;
            expect(lBreakStatement).toBeInstanceOf(BreakStatementAst);
        });

        await pContext.step('Break in for loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    for (let i: ${PgslNumericType.typeName.signedInteger} = 0; i < 10; i++) {
                        break;
                    }
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lForStatement: ForStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as ForStatementAst;
            const lBreakStatement: BreakStatementAst = lForStatement.data.block.data.statementList[0] as BreakStatementAst;
            expect(lBreakStatement).toBeInstanceOf(BreakStatementAst);
        });

        await pContext.step('Break in do-while loop', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    do {
                        break;
                    } while (true);
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lDoWhileStatement: DoWhileStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as DoWhileStatementAst;
            const lBreakStatement: BreakStatementAst = lDoWhileStatement.data.block.data.statementList[0] as BreakStatementAst;
            expect(lBreakStatement).toBeInstanceOf(BreakStatementAst);
        });
    });

    await pContext.step('Break in switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                        break;
                    }
                    default: {}
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as SwitchStatementAst;
        const lCaseBlock: SwitchStatementAstSwitchCase = lSwitchStatement.data.cases[0];
        const lBreakStatement: BreakStatementAst = lCaseBlock.block.data.statementList[0] as BreakStatementAst;
        expect(lBreakStatement).toBeInstanceOf(BreakStatementAst);
    });
});
