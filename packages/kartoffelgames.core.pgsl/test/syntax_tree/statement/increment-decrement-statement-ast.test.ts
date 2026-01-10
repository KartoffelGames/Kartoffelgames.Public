import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { IncrementDecrementStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/increment-decrement-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('IncrementDecrementStatementAst - Parsing', async (pContext) => {
    await pContext.step('Variable increment', () => {
        // Setup.
        const lVariableName: string = 'counter';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 0;
                ${lVariableName}++;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lIncrementStatement: IncrementDecrementStatementAst = lFunctionDeclaration.block.data.statementList[1] as IncrementDecrementStatementAst;
        expect(lIncrementStatement).toBeInstanceOf(IncrementDecrementStatementAst);
    });

    await pContext.step('Variable decrement', () => {
        // Setup.
        const lVariableName: string = 'counter';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
                ${lVariableName}--;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lDecrementStatement: IncrementDecrementStatementAst = lFunctionDeclaration.block.data.statementList[1] as IncrementDecrementStatementAst;
        expect(lDecrementStatement).toBeInstanceOf(IncrementDecrementStatementAst);
    });
});

Deno.test('IncrementDecrementStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Variable increment', () => {
        // Setup.
        const lVariableName: string = 'counter';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 0;
                ${lVariableName}++;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:i32=0;` +
            `${lVariableName}++;` +
            `}`
        );
    });

    await pContext.step('Variable decrement', () => {
        // Setup.
        const lVariableName: string = 'counter';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
                ${lVariableName}--;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:i32=10;` +
            `${lVariableName}--;` +
            `}`
        );
    });
});

Deno.test('IncrementDecrementStatementAst - Error', async (pContext) => {
    await pContext.step('Increment on non-storage', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                5++;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention storage requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Increment or decrement expression must be applied to a storage expression')
        )).toBe(true);
    });

    await pContext.step('Increment on constant', () => {
        // Setup.
        const lVariableName: string = 'counter';
        const lCodeText: string = `
            function testFunction(): void {
                const ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
                ${lVariableName}++;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention variable requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Increment or decrement expression must be a variable')
        )).toBe(true);
    });
});
