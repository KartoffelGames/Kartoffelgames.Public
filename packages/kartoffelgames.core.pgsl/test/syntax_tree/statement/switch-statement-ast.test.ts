import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { SwitchStatementAst } from '../../../source/abstract_syntax_tree/statement/branch/switch-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('SwitchStatementAst - Parsing', async (pContext) => {
    await pContext.step('Single case switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                    }
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.block.data.statementList[0] as SwitchStatementAst;
        expect(lSwitchStatement).toBeInstanceOf(SwitchStatementAst);
    });

    await pContext.step('Multiple cases switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                    }
                    case 2: {
                    }
                    case 3: {
                    }
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.block.data.statementList[0] as SwitchStatementAst;
        expect(lSwitchStatement).toBeInstanceOf(SwitchStatementAst);
    });

    await pContext.step('Switch with default case', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                    }
                    default: {
                    }
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.block.data.statementList[0] as SwitchStatementAst;
        expect(lSwitchStatement).toBeInstanceOf(SwitchStatementAst);
    });

    await pContext.step('Switch with multiple values per case', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1, 2: {
                    }
                }
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lSwitchStatement: SwitchStatementAst = lFunctionDeclaration.block.data.statementList[0] as SwitchStatementAst;
        expect(lSwitchStatement).toBeInstanceOf(SwitchStatementAst);
    });
});

Deno.test('SwitchStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Single case switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                    }
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `switch(5){` +
            `case 1:{` +
            `}` +
            `}` +
            `}`
        );
    });

    await pContext.step('Multiple cases switch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                    }
                    case 2: {
                    }
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `switch(5){` +
            `case 1:{` +
            `}` +
            `case 2:{` +
            `}` +
            `}` +
            `}`
        );
    });

    await pContext.step('Switch with default case', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                    }
                    default: {
                    }
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `switch(5){` +
            `case 1:{` +
            `}` +
            `default:{` +
            `}` +
            `}` +
            `}`
        );
    });

    await pContext.step('Switch with multiple values per case', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1, 2: {
                    }
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `switch(5){` +
            `case 1:` +
            `case 2:{` +
            `}` +
            `}` +
            `}`
        );
    });
});

Deno.test('SwitchStatementAst - Error', async (pContext) => {
    await pContext.step('Non-integer switch expression', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5.0) {
                    case 1: {
                    }
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention integer requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Switch expression must resolve into a unsigned integer.')
        )).toBe(true);
    });

    await pContext.step('Duplicate case values', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                switch (5) {
                    case 1: {
                    }
                    case 1: {
                    }
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention duplicate values.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Duplicate case value found.')
        )).toBe(true);
    });

    await pContext.step('Non-constant case expression', () => {
        // Setup.
        const lVariableName: string = 'caseValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 1;
                switch (5) {
                    case ${lVariableName}: {
                    }
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention constant requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Case expression must be a constant.')
        )).toBe(true);
    });
});
