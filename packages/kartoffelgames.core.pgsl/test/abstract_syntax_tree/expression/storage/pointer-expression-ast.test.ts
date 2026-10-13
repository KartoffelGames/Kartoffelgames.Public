import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { PointerExpressionAst } from '../../../../source/abstract_syntax_tree/expression/storage/pointer-expression-ast.ts';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PointerExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Pointer type', async (pContext) => {
        await pContext.step('Function address space', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(pPointer: *${PgslNumericType.typeName.float32}): void {
                    let testValue: ${PgslNumericType.typeName.float32} = *pPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);

            // Evaluation. Is storage value.
            expect(lExpressionNode.data.isStorage).toBe(true);
        });

        await pContext.step('Module address space', () => {
            // Setup.
            const lCodeText: string = `
                private moduleVariable: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &moduleVariable;
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Workgroup address space', () => {
            // Setup.
            const lCodeText: string = `
                workgroup workgroupVariable: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &workgroupVariable;
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Uniform address space', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                uniform uniformVariable: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &uniformVariable;
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Storage address space', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                storage storageVariable: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let lPointer: *${PgslNumericType.typeName.float32} = &storageVariable;
                    let testValue: ${PgslNumericType.typeName.float32} = *lPointer;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: PointerExpressionAst = lVariableDeclarationNode.data.expression as PointerExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(PointerExpressionAst);

            // Evaluation. Correct result type.
            expect(lExpressionNode.data.resolveType).toBeInstanceOf(PgslNumericType);
        });
    });
});
