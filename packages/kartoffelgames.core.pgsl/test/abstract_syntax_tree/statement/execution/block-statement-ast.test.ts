import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { BlockStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/block-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('BlockStatementAst - Parsing', async (pContext) => {
    await pContext.step('Empty block', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lBlockStatement: BlockStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as BlockStatementAst;
        expect(lBlockStatement).toBeInstanceOf(BlockStatementAst);
    });

    await pContext.step('Block with single statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    let x: ${PgslNumericType.typeName.float32} = 5.0;
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lBlockStatement: BlockStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as BlockStatementAst;
        expect(lBlockStatement).toBeInstanceOf(BlockStatementAst);
        expect(lBlockStatement.data.statementList).toHaveLength(1);
    });

    await pContext.step('Block with multiple statements', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    let x: ${PgslNumericType.typeName.float32} = 5.0;
                    let y: ${PgslNumericType.typeName.signedInteger} = 10;
                    x = 2.0;
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lBlockStatement: BlockStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as BlockStatementAst;
        expect(lBlockStatement).toBeInstanceOf(BlockStatementAst);
        expect(lBlockStatement.data.statementList).toHaveLength(3);
    });

    await pContext.step('Nested blocks', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                {
                    {
                        let x: ${PgslNumericType.typeName.float32} = 5.0;
                    }
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lBlockStatement: BlockStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as BlockStatementAst;
        expect(lBlockStatement).toBeInstanceOf(BlockStatementAst);
        expect(lBlockStatement.data.statementList).toHaveLength(1);

        const lNestedBlockStatement: BlockStatementAst = lBlockStatement.data.statementList[0] as BlockStatementAst;
        expect(lNestedBlockStatement).toBeInstanceOf(BlockStatementAst);
        expect(lNestedBlockStatement.data.statementList).toHaveLength(1);
    });
});
