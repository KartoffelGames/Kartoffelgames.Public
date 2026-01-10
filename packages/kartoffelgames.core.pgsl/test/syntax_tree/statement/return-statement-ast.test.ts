import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { ReturnStatementAst } from '../../../source/abstract_syntax_tree/statement/single/return-statement-ast.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import type { ReturnStatementAstData } from '../../../source/abstract_syntax_tree/statement/single/return-statement-ast.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('ReturnStatementAst - Parsing', async (pContext) => {
    await pContext.step('Return with value', async (pContext) => {
        await pContext.step('Return numeric value', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.float32} {
                    return 5.0;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lReturnStatement: ReturnStatementAst = lFunctionDeclaration.block.data.statementList[0] as ReturnStatementAst;
            expect(lReturnStatement).toBeInstanceOf(ReturnStatementAst);

            // Evaluation. Return statement has expression.
            const lReturnData: ReturnStatementAstData = lReturnStatement.data;
            expect(lReturnData.expression).not.toBeNull();
        });

        await pContext.step('Return variable', () => {
            // Setup.
            const lVariableName: string = 'resultValue';
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.signedInteger} {
                    let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 42;
                    return ${lVariableName};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Correct type of statement node.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lReturnStatement: ReturnStatementAst = lFunctionDeclaration.block.data.statementList[1] as ReturnStatementAst;
            expect(lReturnStatement).toBeInstanceOf(ReturnStatementAst);

            // Evaluation. Return statement has expression.
            const lReturnData: ReturnStatementAstData = lReturnStatement.data;
            expect(lReturnData.expression).not.toBeNull();
        });
    });

    await pContext.step('Return without value', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                return;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lReturnStatement: ReturnStatementAst = lFunctionDeclaration.block.data.statementList[0] as ReturnStatementAst;
        expect(lReturnStatement).toBeInstanceOf(ReturnStatementAst);

        // Evaluation. Return statement has no expression.
        const lReturnData: ReturnStatementAstData = lReturnStatement.data;
        expect(lReturnData.expression).toBeNull();
    });
});

Deno.test('ReturnStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Return with value', async (pContext) => {
        await pContext.step('Return numeric value', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.float32} {
                    return 5.0;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction()->f32{` +
                `return 5.0;` +
                `}`
            );
        });

        await pContext.step('Return variable', () => {
            // Setup.
            const lVariableName: string = 'resultValue';
            const lCodeText: string = `
                function testFunction(): ${PgslNumericType.typeName.signedInteger} {
                    let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 42;
                    return ${lVariableName};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction()->i32{` +
                `var ${lVariableName}:i32=42;` +
                `return ${lVariableName};` +
                `}`
            );
        });
    });

    await pContext.step('Return without value', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                return;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `return;` +
            `}`
        );
    });
});

Deno.test('ReturnStatementAst - Error', async (pContext) => {
    await pContext.step('Return type mismatch', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): ${PgslNumericType.typeName.signedInteger} {
                return 5.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors or warnings about type mismatch.
        // Note: Depending on implicit casting rules, this might be allowed or rejected.
        // We'll just verify the transpilation completes.
        expect(lTranspilationResult.source).toBeDefined();

        // Evaluation. Error should mention variable not defined.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Function block return type does not match the declared return type.')
        )).toBe(true);
    });

    await pContext.step('Return void where value expected', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): ${PgslNumericType.typeName.float32} {
                return;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention return type mismatch.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Function block return type does not match the declared return type.')
        )).toBe(true);
    });
});
