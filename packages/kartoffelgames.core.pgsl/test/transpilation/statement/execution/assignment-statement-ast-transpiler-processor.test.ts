import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslAssignment } from '../../../../source/enum/pgsl-assignment.enum.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

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
            `var ${lVariableName}:f32;` +
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
            `var ${lVariableName}:i32=10;` +
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
            `var ${lVariableName}:i32=10;` +
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
            `var ${lVariableName}:f32=2.0;` +
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
            `var ${lVariableName}:f32=10.0;` +
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
            `var ${lVariableName}:i32=10;` +
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
            `var ${lVariableName}:u32=12;` +
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
            `var ${lVariableName}:u32=8;` +
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
            `var ${lVariableName}:u32=12;` +
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
            `var ${lVariableName}:u32=16;` +
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
            `var ${lVariableName}:u32=4;` +
            `${lVariableName}<<=2;` +
            `}`
        );
    });
});
