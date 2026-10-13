import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { LiteralValueExpressionAst } from '../../../../source/abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslBooleanType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-boolean-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

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

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: LiteralValueExpressionAst = lVariableDeclarationNode.data.expression as LiteralValueExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(LiteralValueExpressionAst);

            // Evaluation. Correct text value.
            expect(lExpressionNode.data.textValue).toBe(lLiteralValue);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Error: Invalid literal format', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testVariable: ${PgslNumericType.typeName.float32} = 10.5.3;
            }
        `;

        // Process.
        const lErrorFunction = () => {
            gPgslParser.parseAst(lCodeText);
        };

        // Evaluation. Should have errors.
        expect(lErrorFunction).toThrow('Unexpected token ".3". "Semicolon" expected');
    });
});
