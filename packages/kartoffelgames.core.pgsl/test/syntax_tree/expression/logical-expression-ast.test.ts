import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { LogicalExpressionAst } from '../../../source/abstract_syntax_tree/expression/operation/logical-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslBooleanType } from '../../../source/abstract_syntax_tree/type/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslOperator } from '../../../source/enum/pgsl-operator.enum.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('LogicalExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Logical OR', async (pContext) => {
        await pContext.step('Boolean', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let boolOne: bool = true;
                    let boolTwo: bool = false;
                    let testVariable: bool = boolOne || boolTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LogicalExpressionAst = lVariableDeclarationNode.data.expression as LogicalExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LogicalExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.ShortCircuitOr);

            // Evaluation. Correct result type.
            const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
            expect(lResultType).toBeInstanceOf(PgslBooleanType);
        });
    });

    await pContext.step('Logical AND', async (pContext) => {
        await pContext.step('Boolean', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let boolOne: bool = true;
                    let boolTwo: bool = false;
                    let testVariable: bool = boolOne && boolTwo;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[2] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LogicalExpressionAst = lVariableDeclarationNode.data.expression as LogicalExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LogicalExpressionAst);

            // Evaluation. Correct operator.
            expect(lExpressionNode.data.operatorName).toBe(PgslOperator.ShortCircuitAnd);

            // Evaluation. Correct result type.
            const lResultType: PgslBooleanType = lExpressionNode.data.resolveType as PgslBooleanType;
            expect(lResultType).toBeInstanceOf(PgslBooleanType);
        });
    });
});

Deno.test('LogicalExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Logical OR', async (pContext) => {
        await pContext.step('Boolean', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let boolOne: bool = true;
                    let boolTwo: bool = false;
                    let testVariable: bool = boolOne || boolTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var boolOne:bool=true;` +
                `var boolTwo:bool=false;` +
                `var testVariable:bool=boolOne||boolTwo;` +
                `}`
            );
        });
    });

    await pContext.step('Logical AND', async (pContext) => {
        await pContext.step('Boolean', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let boolOne: bool = true;
                    let boolTwo: bool = false;
                    let testVariable: bool = boolOne && boolTwo;
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `var boolOne:bool=true;` +
                `var boolTwo:bool=false;` +
                `var testVariable:bool=boolOne&&boolTwo;` +
                `}`
            );
        });
    });
});

Deno.test('LogicalExpressionAst - Error', async (pContext) => {
    await pContext.step('Invalid operator for logical expression', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let boolOne: bool = true;
                let boolTwo: bool = false;
                let testVariable: bool = boolOne + boolTwo;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);
    });

    await pContext.step('Non-boolean left side', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let floatValue: ${PgslNumericType.typeName.float32} = 5.0;
                let boolValue: bool = true;
                let testVariable: bool = floatValue || boolValue;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention boolean requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Left side of logical expression needs to be a boolean')
        )).toBe(true);
    });

    await pContext.step('Non-boolean right side', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let boolValue: bool = true;
                let floatValue: ${PgslNumericType.typeName.float32} = 5.0;
                let testVariable: bool = boolValue && floatValue;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention boolean requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Right side of logical expression needs to be a boolean')
        )).toBe(true);
    });
});
