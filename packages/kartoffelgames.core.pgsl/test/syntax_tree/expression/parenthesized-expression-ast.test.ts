import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { ParenthesizedExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/parenthesized-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ParenthesizedExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Simple Expressions', async (pContext) => {
        await pContext.step('Single value', () => {
            // Setup.
            const lValueOne: number = 42.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = (${lValueOne});
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ParenthesizedExpressionAst = lVariableDeclarationNode.data.expression as ParenthesizedExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ParenthesizedExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Arithmetic expression', () => {
            // Setup.
            const lValueOne: number = 5.0;
            const lValueTwo: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = (${lValueOne} + ${lValueTwo});
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ParenthesizedExpressionAst = lVariableDeclarationNode.data.expression as ParenthesizedExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ParenthesizedExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Comparison expression', () => {
            // Setup.
            const lValueOne: number = 5.0;
            const lValueTwo: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: bool = (${lValueOne} > ${lValueTwo});
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: ParenthesizedExpressionAst = lVariableDeclarationNode.data.expression as ParenthesizedExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(ParenthesizedExpressionAst);
        });
    });

    await pContext.step('Nested Parentheses', () => {
        // Setup.
        const lValueOne: number = 5.0;
        const lValueTwo: number = 3.0;
        const lValueThree: number = 2.0;
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = ((${lValueOne} + ${lValueTwo}) * ${lValueThree});
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Process. Assume correct parsing.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

        // Evaluation. Correct type of expression node.
        const lExpressionNode: ParenthesizedExpressionAst = lVariableDeclarationNode.data.expression as ParenthesizedExpressionAst;
        expect(lExpressionNode).toBeInstanceOf(ParenthesizedExpressionAst);

        // Evaluation. Correct result type.
        expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
    });
});

Deno.test('ParenthesizedExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Simple Expressions', async (pContext) => {
        await pContext.step('Single value', () => {
            // Setup.
            const lValueOne: number = 42.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = (${lValueOne});
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=(${lValueOne});` +
                `}`
            );
        });

        await pContext.step('Arithmetic expression', () => {
            // Setup.
            const lValueOne: number = 5.0;
            const lValueTwo: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = (${lValueOne} + ${lValueTwo});
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:f32=(${lValueOne}+${lValueTwo});` +
                `}`
            );
        });

        await pContext.step('Comparison expression', () => {
            // Setup.
            const lValueOne: number = 5.0;
            const lValueTwo: number = 3.0;
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: bool = (${lValueOne} > ${lValueTwo});
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var testVariable:bool=(${lValueOne}>${lValueTwo});` +
                `}`
            );
        });
    });

    await pContext.step('Nested Parentheses', () => {
        // Setup.
        const lValueOne: number = 5.0;
        const lValueTwo: number = 3.0;
        const lValueThree: number = 2.0;
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = ((${lValueOne} + ${lValueTwo}) * ${lValueThree});
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var testVariable:f32=((${lValueOne}+${lValueTwo})*${lValueThree});` +
            `}`
        );
    });
});

