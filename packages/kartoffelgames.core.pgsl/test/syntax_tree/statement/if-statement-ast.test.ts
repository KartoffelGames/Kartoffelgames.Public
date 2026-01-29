import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { IfStatementAst } from '../../../source/abstract_syntax_tree/statement/branch/if-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

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
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lIfStatement: IfStatementAst = lFunctionDeclaration.block.data.statementList[0] as IfStatementAst;
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
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lIfStatement: IfStatementAst = lFunctionDeclaration.block.data.statementList[0] as IfStatementAst;
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
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lIfStatement: IfStatementAst = lFunctionDeclaration.block.data.statementList[0] as IfStatementAst;
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
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lIfStatement: IfStatementAst = lFunctionDeclaration.block.data.statementList[0] as IfStatementAst;
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
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lIfStatement: IfStatementAst = lFunctionDeclaration.block.data.statementList[0] as IfStatementAst;
        expect(lIfStatement).toBeInstanceOf(IfStatementAst);
        expect(lIfStatement.data.else).toBeNull();
    });
});

Deno.test('IfStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Simple if statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
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
            `if(true){` +
            `}` +
            `}`
        );
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
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `if(true){` +
            `}else{` +
            `}` +
            `}`
        );
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
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `if(true){` +
            `}else if(false){` +
            `}` +
            `}`
        );
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
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `if(true){` +
            `}else if(false){` +
            `}else{` +
            `}` +
            `}`
        );
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
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `if(true&&false){` +
            `}` +
            `}`
        );
    });
});

Deno.test('IfStatementAst - Error', async (pContext) => {
    await pContext.step('Non-boolean condition', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (5) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention boolean requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Expression of if must resolve into a boolean.')
        )).toBe(true);
    });

    await pContext.step('Single else not being the last', () => {
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
            gPgslParser.transpile(lCodeText, new WgslTranspiler());
        };

        // Evaluation. Should have errors.
        expect(lErrorFunction).toThrow('Unexpected token "else". "BlockEnd" expected');
    });
});
