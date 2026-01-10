import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslValueFixedState } from "../../../source/enum/pgsl-value-fixed-state.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableDeclarationStatementAst - Parsing', async (pContext) => {
    await pContext.step('Let with initialization', () => {
        // Setup.
        const lVariableName: string = 'myVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclaration: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;
        expect(lVariableDeclaration).toBeInstanceOf(VariableDeclarationStatementAst);
        expect(lVariableDeclaration.data.fixedState).toBe(PgslValueFixedState.Variable);
    });

    await pContext.step('Let without initialization', () => {
        // Setup.
        const lVariableName: string = 'myVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger};
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclaration: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;
        expect(lVariableDeclaration).toBeInstanceOf(VariableDeclarationStatementAst);
        expect(lVariableDeclaration.data.fixedState).toBe(PgslValueFixedState.Variable);
    });

    await pContext.step('Const with variable initialization', () => {
        // Setup.
        const lVariableName: string = 'myConstant';
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.float32} = 10.5;
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = testValue;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclaration: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[1] as VariableDeclarationStatementAst;
        expect(lVariableDeclaration).toBeInstanceOf(VariableDeclarationStatementAst);
        expect(lVariableDeclaration.data.fixedState).toBe(PgslValueFixedState.ScopeFixed);
    });

    await pContext.step('Const with constant initialization', () => {
        // Setup.
        const lVariableName: string = 'myConstant';
        const lCodeText: string = `
            function testFunction(): void {
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 10.5;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclaration: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;
        expect(lVariableDeclaration).toBeInstanceOf(VariableDeclarationStatementAst);
        expect(lVariableDeclaration.data.fixedState).toBe(PgslValueFixedState.Constant);
    });
});

Deno.test('VariableDeclarationStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Let with initialization', () => {
        // Setup.
        const lVariableName: string = 'myVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var ${lVariableName}:f32=5.0;` +
            `}`
        );
    });

    await pContext.step('Let without initialization', () => {
        // Setup.
        const lVariableName: string = 'myVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var ${lVariableName}:i32;` +
            `}`
        );
    });

    await pContext.step('Const with variable initialization', () => {
        // Setup.
        const lVariableName: string = 'myConstant';
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.float32} = 10.5;
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = testValue;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var testValue:f32=10.5;` +
            `let ${lVariableName}:f32=testValue;` +
            `}`
        );
    });

    await pContext.step('Const with constant initialization', () => {
        // Setup.
        const lVariableName: string = 'myConstant';
        const lCodeText: string = `
            function testFunction(): void {
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 10.5;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `const ${lVariableName}:f32=10.5;` +
            `}`
        );
    });
});

Deno.test('VariableDeclarationStatementAst - Error', async (pContext) => {
    await pContext.step('Type mismatch in initialization', () => {
        // Setup.
        const lVariableName: string = 'myVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 5.5;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention type conversion.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('can\'t be converted to variables type')
        )).toBe(true);
    });

    await pContext.step('Const without initialization', () => {
        // Setup.
        const lVariableName: string = 'myConstant';
        const lCodeText: string = `
            function testFunction(): void {
                const ${lVariableName}: ${PgslNumericType.typeName.float32};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention initializer requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Constants need a initializer value.')
        )).toBe(true);
    });

    await pContext.step('Duplicate variable declaration', () => {
        // Setup.
        const lVariableName: string = 'myVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention duplicate variable.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('already defined')
        )).toBe(true);
    });
});
