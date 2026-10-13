import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { AddressOfExpressionAst } from '../../../../source/abstract_syntax_tree/expression/single_value/address-of-expression-ast.ts';
import { AttributeListAst } from '../../../../source/abstract_syntax_tree/general/attribute-list-ast.ts';
import type { VariableDeclarationStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslArrayType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-array-type.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslPointerType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-pointer-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AddressOfExpressionAst - Parsing', async (pContext) => {
    await pContext.step('Variable Address', async (pContext) => {
        await pContext.step('Simple variable address', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let testVariable: ${PgslNumericType.typeName.float32} = 5.0;
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &testVariable;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
            expect(lResultType.referencedType).toBeInstanceOf(PgslNumericType);
        });

        await pContext.step('Struct property address', () => {
            // Setup.
            const lCodeText: string = `
                struct TestStruct {
                    propertyOne: ${PgslNumericType.typeName.float32}
                }
                function testFunction(): void {
                    let structVariable: TestStruct = new TestStruct();
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &structVariable.propertyOne;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
        });

        await pContext.step('Array element address', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let arrayVariable: ${PgslArrayType.typeName.array}<${PgslNumericType.typeName.float32}, 5> = new ${PgslArrayType.typeName.array}(1.0, 2.0, 3.0, 4.0, 5.0);
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &arrayVariable[2];
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
            expect(lResultType.referencedType).toBeInstanceOf(PgslNumericType);
        });
    });

    await pContext.step('Address Space Variations', async (pContext) => {
        await pContext.step('Function address space', () => {
            // Setup.
            const lCodeText: string = `
                function testFunction(): void {
                    let functionVariable: ${PgslNumericType.typeName.float32} = 5.0;
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &functionVariable;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
        });

        await pContext.step('Private address space', () => {
            // Setup.
            const lCodeText: string = `
                private privateVariable: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &privateVariable;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
        });

        await pContext.step('Storage address space', () => {
            // Setup.
            const lCodeText: string = `
                [${AttributeListAst.attributeNames.groupBinding}("groupOne", "groupTwo")]
                storage storageVariable: ${PgslNumericType.typeName.float32};
                function testFunction(): void {
                    let pointerVariable: *${PgslNumericType.typeName.float32} = &storageVariable;
                }
            `;

            // Process.
            const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

            // Evaluation. Read parsed nodes.
            const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[1] as FunctionDeclarationAst;
            const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.declarations[0];
            const lVariableDeclarationNode: VariableDeclarationStatementAst = lFunctionDeclaration.data.block.data.statementList[0] as VariableDeclarationStatementAst;

            // Evaluation. Correct type of expression node.
            const lExpressionNode: AddressOfExpressionAst = lVariableDeclarationNode.data.expression as AddressOfExpressionAst;
            expect(lExpressionNode).toBeInstanceOf(AddressOfExpressionAst);

            // Evaluation. Correct result type.
            const lResultType: PgslPointerType = lExpressionNode.data.resolveType as PgslPointerType;
            expect(lResultType).toBeInstanceOf(PgslPointerType);
        });
    });
});
