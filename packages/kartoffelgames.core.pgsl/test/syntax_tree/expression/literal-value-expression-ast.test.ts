import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { LiteralValueExpressionAst } from '../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslBooleanType } from '../../../source/abstract_syntax_tree/type/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('LiteralValueExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Boolean', async (pContext) => {
        await pContext.step('True', () => {
            // Setup.
            const lLiteralValue: string = 'true';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslBooleanType);
        });

        await pContext.step('False', () => {
            // Setup.
            const lLiteralValue: string = 'false';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslBooleanType);
        });
    });

    await pContext.step('Integer', async (pContext) => {
        await pContext.step('Decimal', () => {
            // Setup.
            const lLiteralValue: string = '42';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Decimal with i suffix', () => {
            // Setup.
            const lLiteralValue: string = '42i';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Decimal with u suffix', () => {
            // Setup.
            const lLiteralValue: string = '42u';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Hexadecimal without suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x2A';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Hexadecimal with i suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x2Ai';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Hexadecimal with u suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x2Au';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Float', async (pContext) => {
        await pContext.step('Decimal', () => {
            // Setup.
            const lLiteralValue: string = '3.14';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Decimal with f suffix', () => {
            // Setup.
            const lLiteralValue: string = '3.14f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Decimal with h suffix', () => {
            // Setup.
            const lLiteralValue: string = '3.14h';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Scientific notation', () => {
            // Setup.
            const lLiteralValue: string = '1.5e10';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Scientific notation with f suffix', () => {
            // Setup.
            const lLiteralValue: string = '1.5e10f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Scientific notation with h suffix', () => {
            // Setup.
            const lLiteralValue: string = '1.5e10h';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Hexadecimal', () => {
            // Setup.
            const lLiteralValue: string = '0x1.8p3';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Hexadecimal with f suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x1.8p3f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Hexadecimal with h suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x1.8p3h';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Process. Assume correct parsing.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });
});

Deno.test('LiteralValueExpressionAst - Transpilation', async (pContext) => {
    await pContext.step('Boolean', async (pContext) => {
        await pContext.step('True', () => {
            // Setup.
            const lLiteralValue: string = 'true';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:bool=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('False', () => {
            // Setup.
            const lLiteralValue: string = 'false';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslBooleanType.typeName.boolean} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:bool=${lLiteralValue};` +
                `}`
            );
        });
    });

    await pContext.step('Integer', async (pContext) => {
        await pContext.step('Decimal', () => {
            // Setup.
            const lLiteralValue: string = '42';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:i32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Decimal with i suffix', () => {
            // Setup.
            const lLiteralValue: string = '42i';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:i32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Decimal with u suffix', () => {
            // Setup.
            const lLiteralValue: string = '42u';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:u32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal', () => {
            // Setup.
            const lLiteralValue: string = '0x2A';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:i32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal with i suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x2Ai';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.signedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:i32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal with u suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x2Au';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.unsignedInteger} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:u32=${lLiteralValue};` +
                `}`
            );
        });
    });

    await pContext.step('Float', async (pContext) => {
        await pContext.step('Decimal', () => {
            // Setup.
            const lLiteralValue: string = '3.14';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Decimal with f suffix', () => {
            // Setup.
            const lLiteralValue: string = '3.14f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Decimal with h suffix', () => {
            // Setup.
            const lLiteralValue: string = '3.14h';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f16=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Scientific notation', () => {
            // Setup.
            const lLiteralValue: string = '1.5e10';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Scientific notation with f suffix', () => {
            // Setup.
            const lLiteralValue: string = '1.5e10f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Scientific notation with h suffix', () => {
            // Setup.
            const lLiteralValue: string = '1.5e10h';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f16=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal', () => {
            // Setup.
            const lLiteralValue: string = '0x1.8p3';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal float with f suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x1.8p3f';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f32=${lLiteralValue};` +
                `}`
            );
        });

        await pContext.step('Hexadecimal float with h suffix', () => {
            // Setup.
            const lLiteralValue: string = '0x1.8p3h';
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float16} = ${lLiteralValue};
                }
            `;

            // Process.
            const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

            // Evaluation. No errors.
            expect(lTranspilationResult.incidents).toHaveLength(0);

            // Evaluation. Correct transpilation output.
            expect(lTranspilationResult.source).toBe(
                `fn testFunction(){` +
                `let testVariable:f16=${lLiteralValue};` +
                `}`
            );
        });
    });
});

Deno.test('LiteralValueExpressionAst - Error', async (pContext) => {
    await pContext.step('Invalid literal format', () => {
        // Setup.
        const lLiteralValue: string = '10.5.3';
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = ${lLiteralValue};
            }
        `;

        // Process.
        const lErrorFunction = () => {
            gPgslParser.transpile(lCodeText, new WgslTranspiler());
        };

        // Evaluation. Should have errors.
        expect(lErrorFunction).toThrow(/^Unexpected token/);
    });
});
