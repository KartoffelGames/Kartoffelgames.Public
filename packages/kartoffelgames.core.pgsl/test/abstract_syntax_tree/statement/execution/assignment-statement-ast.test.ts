import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { FunctionOverloadDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import type { DocumentAst } from '../../../../source/abstract_syntax_tree/document-ast.ts';
import { AssignmentStatementAst } from '../../../../source/abstract_syntax_tree/statement/execution/assignment-statement-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslAssignment } from '../../../../source/enum/pgsl-assignment.enum.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AssignmentStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.float32};
                testValue ${PgslAssignment.Assignment} 5.0;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.Assignment);
    });

    await pContext.step('Add assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.signedInteger} = 10;
                testValue ${PgslAssignment.AssignmentPlus} 5;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentPlus);
    });

    await pContext.step('Subtract assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.signedInteger} = 10;
                testValue ${PgslAssignment.AssignmentMinus} 3;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentMinus);
    });

    await pContext.step('Multiply assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.float32} = 2.0;
                testValue ${PgslAssignment.AssignmentMultiply} 3.0;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentMultiply);
    });

    await pContext.step('Divide assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.float32} = 10.0;
                testValue ${PgslAssignment.AssignmentDivide} 2.0;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentDivide);
    });

    await pContext.step('Modulo assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.signedInteger} = 10;
                testValue ${PgslAssignment.AssignmentModulo} 3;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentModulo);
    });

    await pContext.step('Binary AND assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.unsignedInteger} = 12;
                testValue ${PgslAssignment.AssignmentBinaryAnd} 10;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentBinaryAnd);
    });

    await pContext.step('Binary OR assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.unsignedInteger} = 8;
                testValue ${PgslAssignment.AssignmentBinaryOr} 4;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentBinaryOr);
    });

    await pContext.step('Binary XOR assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.unsignedInteger} = 12;
                testValue ${PgslAssignment.AssignmentBinaryXor} 10;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentBinaryXor);
    });

    await pContext.step('Shift right assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.unsignedInteger} = 16;
                testValue ${PgslAssignment.AssignmentShiftRight} 2;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentShiftRight);
    });

    await pContext.step('Shift left assignment', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.unsignedInteger} = 4;
                testValue ${PgslAssignment.AssignmentShiftLeft} 2;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionOverloadDeclarationAst = lFunctionNode.data.overloads[0];
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.data.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentShiftLeft);
    });
});
