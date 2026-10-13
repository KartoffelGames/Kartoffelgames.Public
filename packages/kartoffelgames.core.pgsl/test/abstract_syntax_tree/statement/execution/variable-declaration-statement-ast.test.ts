import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslValueFixedState } from '../../../../source/enum/pgsl-value-fixed-state.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableDeclarationStatementAst - Parsing', async (pContext) => {
    await pContext.step('Let with initialization', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = 5.0;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lVariableDeclaration: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;
        expect(lVariableDeclaration).toBeInstanceOf(VariableDeclarationStatementAst);
        expect(lVariableDeclaration.data.fixedState).toBe(PgslValueFixedState.Variable);
    });

    await pContext.step('Let without initialization', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.signedInteger};
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lVariableDeclaration: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;
        expect(lVariableDeclaration).toBeInstanceOf(VariableDeclarationStatementAst);
        expect(lVariableDeclaration.data.fixedState).toBe(PgslValueFixedState.Variable);
    });

    await pContext.step('Const with variable initialization', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.float32} = 10.5;
                const testConstant: ${PgslNumericType.typeName.float32} = testValue;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lVariableDeclaration: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;
        expect(lVariableDeclaration).toBeInstanceOf(VariableDeclarationStatementAst);
        expect(lVariableDeclaration.data.fixedState).toBe(PgslValueFixedState.ScopeFixed);
    });

    await pContext.step('Const with constant initialization', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                const testConstant: ${PgslNumericType.typeName.float32} = 10.5;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
        const lVariableDeclaration: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;
        expect(lVariableDeclaration).toBeInstanceOf(VariableDeclarationStatementAst);
        expect(lVariableDeclaration.data.fixedState).toBe(PgslValueFixedState.Constant);
    });
});
