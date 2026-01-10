import { expect } from '@kartoffelgames/core-test';
import type { FunctionDeclarationAst, FunctionDeclarationAstDataDeclaration } from '../../../source/abstract_syntax_tree/declaration/function-declaration-ast.ts';
import type { DocumentAst } from '../../../source/abstract_syntax_tree/document-ast.ts';
import { AssignmentStatementAst } from '../../../source/abstract_syntax_tree/statement/execution/assignment-statement-ast.ts';
import { PgslNumericType } from '../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts';
import { PgslParser } from '../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../source/transpilation/wgsl/wgsl-transpiler.ts';
import { PgslAssignment } from "../../../source/enum/pgsl-assignment.enum.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('AssignmentStatementAst - Parsing', async (pContext) => {
    await pContext.step('Simple assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32};
                ${lVariableName} ${PgslAssignment.Assignment} 5.0;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.Assignment);
    });

    await pContext.step('Add assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
                ${lVariableName} ${PgslAssignment.AssignmentPlus} 5;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentPlus);
    });

    await pContext.step('Subtract assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
                ${lVariableName} ${PgslAssignment.AssignmentMinus} 3;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentMinus);
    });

    await pContext.step('Multiply assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32} = 2.0;
                ${lVariableName} ${PgslAssignment.AssignmentMultiply} 3.0;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentMultiply);
    });

    await pContext.step('Divide assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32} = 10.0;
                ${lVariableName} ${PgslAssignment.AssignmentDivide} 2.0;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        /// Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentDivide);
    });

    await pContext.step('Modulo assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
                ${lVariableName} ${PgslAssignment.AssignmentModulo} 3;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentModulo);
    });

    await pContext.step('Binary AND assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 12;
                ${lVariableName} ${PgslAssignment.AssignmentBinaryAnd} 10;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentBinaryAnd);
    });

    await pContext.step('Binary OR assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 8;
                ${lVariableName} ${PgslAssignment.AssignmentBinaryOr} 4;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentBinaryOr);
    });

    await pContext.step('Binary XOR assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 12;
                ${lVariableName} ${PgslAssignment.AssignmentBinaryXor} 10;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentBinaryXor);
    });

    await pContext.step('Shift right assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 16;
                ${lVariableName} ${PgslAssignment.AssignmentShiftRight} 2;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentShiftRight);
    });

    await pContext.step('Shift left assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 4;
                ${lVariableName} ${PgslAssignment.AssignmentShiftLeft} 2;
            }
        `;

        // Process.
        const lDocument: DocumentAst = gPgslParser.parseAst(lCodeText);

        // Evaluation. Correct type of statement node.
        const lFunctionNode: FunctionDeclarationAst = lDocument.data.content[0] as FunctionDeclarationAst;
        const lFunctionDeclaration: FunctionDeclarationAstDataDeclaration = lFunctionNode.data.declarations[0] as FunctionDeclarationAstDataDeclaration;
        const lAssignmentStatement: AssignmentStatementAst = lFunctionDeclaration.block.data.statementList[1] as AssignmentStatementAst;
        expect(lAssignmentStatement).toBeInstanceOf(AssignmentStatementAst);
        expect(lAssignmentStatement.data.assignment).toBe(PgslAssignment.AssignmentShiftLeft);
    });
});

Deno.test('AssignmentStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Simple assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32};
                ${lVariableName} ${PgslAssignment.Assignment} 5.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:f32;` +
            `${lVariableName}=5.0;` +
            `}`
        );
    });

    await pContext.step('Add assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
                ${lVariableName} ${PgslAssignment.AssignmentPlus} 5;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:i32=10;` +
            `${lVariableName}+=5;` +
            `}`
        );
    });

    await pContext.step('Subtract assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
                ${lVariableName} ${PgslAssignment.AssignmentMinus} 3;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:i32=10;` +
            `${lVariableName}-=3;` +
            `}`
        );
    });

    await pContext.step('Multiply assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32} = 2.0;
                ${lVariableName} ${PgslAssignment.AssignmentMultiply} 3.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:f32=2.0;` +
            `${lVariableName}*=3.0;` +
            `}`
        );
    });

    await pContext.step('Divide assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32} = 10.0;
                ${lVariableName} ${PgslAssignment.AssignmentDivide} 2.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:f32=10.0;` +
            `${lVariableName}/=2.0;` +
            `}`
        );
    });

    await pContext.step('Modulo assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger} = 10;
                ${lVariableName} ${PgslAssignment.AssignmentModulo} 3;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:i32=10;` +
            `${lVariableName}%=3;` +
            `}`
        );
    });

    await pContext.step('Binary AND assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 12;
                ${lVariableName} ${PgslAssignment.AssignmentBinaryAnd} 10;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:u32=12;` +
            `${lVariableName}&=10;` +
            `}`
        );
    });

    await pContext.step('Binary OR assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 8;
                ${lVariableName} ${PgslAssignment.AssignmentBinaryOr} 4;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:u32=8;` +
            `${lVariableName}|=4;` +
            `}`
        );
    });

    await pContext.step('Binary XOR assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 12;
                ${lVariableName} ${PgslAssignment.AssignmentBinaryXor} 10;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:u32=12;` +
            `${lVariableName}^=10;` +
            `}`
        );
    });

    await pContext.step('Shift right assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 16;
                ${lVariableName} ${PgslAssignment.AssignmentShiftRight} 2;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:u32=16;` +
            `${lVariableName}>>=2;` +
            `}`
        );
    });

    await pContext.step('Shift left assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.unsignedInteger} = 4;
                ${lVariableName} ${PgslAssignment.AssignmentShiftLeft} 2;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `let ${lVariableName}:u32=4;` +
            `${lVariableName}<<=2;` +
            `}`
        );
    });
});

Deno.test('AssignmentStatementAst - Error', async (pContext) => {
    await pContext.step('Assignment to non-storage', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                5 ${PgslAssignment.Assignment} 10;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention storage requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Assignment statement must be applied to a storage expression.')
        )).toBe(true);
    });

    await pContext.step('Assignment to constant', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
                ${lVariableName} ${PgslAssignment.Assignment} 10.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention variable requirement.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Assignment statement must be applied to a variable.')
        )).toBe(true);
    });

    await pContext.step('Type mismatch in assignment', () => {
        // Setup.
        const lVariableName: string = 'testValue';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger};
                ${lVariableName} ${PgslAssignment.Assignment} 5.5;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. Should have errors.
        expect(lTranspilationResult.incidents.length).toBeGreaterThan(0);

        // Evaluation. Error should mention type mismatch.
        expect(lTranspilationResult.incidents.some(pIncident =>
            pIncident.message.includes('Can\'t assign a different type to a variable.')
        )).toBe(true);
    });
});
