import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { IncrementDecrementStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/increment-decrement-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('IncrementDecrementStatementAst - Parsing', async (pContext) => {
    await pContext.step('Variable increment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let counter: ${PgslNumericType.typeName.signedInteger} = 0;
                counter++;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lIncrementStatement: IncrementDecrementStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as IncrementDecrementStatementAst;
        expect(lIncrementStatement).toBeInstanceOf(IncrementDecrementStatementAst);
    });

    await pContext.step('Variable decrement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let counter: ${PgslNumericType.typeName.signedInteger} = 10;
                counter--;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lDecrementStatement: IncrementDecrementStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as IncrementDecrementStatementAst;
        expect(lDecrementStatement).toBeInstanceOf(IncrementDecrementStatementAst);
    });
});
