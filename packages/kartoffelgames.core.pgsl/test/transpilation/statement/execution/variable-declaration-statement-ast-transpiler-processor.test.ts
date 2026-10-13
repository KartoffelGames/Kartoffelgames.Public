import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('VariableDeclarationStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Let with initialization', () => {
        // Setup.
        const lVariableName: string = 'testVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.float32} = 5.0;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var ${lVariableName}:f32=5.0;` +
            `}`
        );
    });

    await pContext.step('Let without initialization', () => {
        // Setup.
        const lVariableName: string = 'testVariable';
        const lCodeText: string = `
            function testFunction(): void {
                let ${lVariableName}: ${PgslNumericType.typeName.signedInteger};
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var ${lVariableName}:i32;` +
            `}`
        );
    });

    await pContext.step('Const with variable initialization', () => {
        // Setup.
        const lVariableName: string = 'testConstant';
        const lCodeText: string = `
            function testFunction(): void {
                let testValue: ${PgslNumericType.typeName.float32} = 10.5;
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = testValue;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var testValue:f32=10.5;` +
            `let ${lVariableName}:f32=testValue;` +
            `}`
        );
    });

    await pContext.step('Const with constant initialization', () => {
        // Setup.
        const lVariableName: string = 'testConstant';
        const lCodeText: string = `
            function testFunction(): void {
                const ${lVariableName}: ${PgslNumericType.typeName.float32} = 10.5;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `const ${lVariableName}:f32=10.5;` +
            `}`
        );
    });
});
