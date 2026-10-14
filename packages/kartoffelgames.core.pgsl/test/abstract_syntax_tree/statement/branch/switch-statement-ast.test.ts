import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { SwitchStatementAst } from '../../../../source/abstract_syntax_tree/statement/branch/switch-statement-ast.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('SwitchStatementAst - Parsing', async (pContext) => {
    await pContext.step('Single case switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {}
                    default: {}
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as SwitchStatementAst;
        expect(lSwitchStatement).toBeInstanceOf(SwitchStatementAst);
        expect(lSwitchStatement.data.cases).toHaveLength(1);
        expect(lSwitchStatement.data.cases[0].cases).toHaveLength(1);
    });

    await pContext.step('Multiple cases switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {}
                    case 2: {}
                    case 3: {}
                    default: {}
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as SwitchStatementAst;
        expect(lSwitchStatement).toBeInstanceOf(SwitchStatementAst);
        expect(lSwitchStatement.data.cases).toHaveLength(3);
        expect(lSwitchStatement.data.cases[0].cases).toHaveLength(1);
        expect(lSwitchStatement.data.cases[1].cases).toHaveLength(1);
        expect(lSwitchStatement.data.cases[2].cases).toHaveLength(1);
    });

    await pContext.step('Switch with default case', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {}
                    default: {}
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as SwitchStatementAst;
        expect(lSwitchStatement).toBeInstanceOf(SwitchStatementAst);
        expect(lSwitchStatement.data.cases).toHaveLength(1);
        expect(lSwitchStatement.data.cases[0].cases).toHaveLength(1);
    });

    await pContext.step('Switch with multiple values per case', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1, 2: {}
                    default: {}
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as SwitchStatementAst;
        expect(lSwitchStatement).toBeInstanceOf(SwitchStatementAst);
        expect(lSwitchStatement.data.cases).toHaveLength(1);
        expect(lSwitchStatement.data.cases[0].cases).toHaveLength(2);
    });

    await pContext.step('Error: Missing default case', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {}
                }
            }
        `;

        // Process.
        const lErrorFunction = () => {
            gPgslParser.parseAst(lCodeText);
        };

        // Evaluation. Should have errors.
        expect(lErrorFunction).toThrow('Unexpected token "}". "KeywordDefault" expected');
    });
});
