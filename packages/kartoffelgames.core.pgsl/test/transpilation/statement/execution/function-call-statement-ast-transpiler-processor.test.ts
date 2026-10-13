import { expect } from '@kartoffelgames/core-test';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('FunctionCallStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Simple function call', () => {
        // Setup.
        const lFunctionName: string = 'testFunction';
        const lCalleeName: string = 'calledFunction';
        const lCodeText: string = `
            function ${lCalleeName}(): void {
            }
            function ${lFunctionName}(): void {
                ${lCalleeName}();
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn ${lCalleeName}(){` +
            `}` +
            `fn ${lFunctionName}(){` +
            `${lCalleeName}();` +
            `}`
        );
    });

    await pContext.step('Function call with parameters', () => {
        // Setup.
        const lFunctionName: string = 'testFunction';
        const lCalleeName: string = 'calledFunction';
        const lCodeText: string = `
            function ${lCalleeName}(pValue: ${PgslNumericType.typeName.float32}): void {
            }
            function ${lFunctionName}(): void {
                ${lCalleeName}(5.0);
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn ${lCalleeName}(pValue:f32){` +
            `}` +
            `fn ${lFunctionName}(){` +
            `${lCalleeName}(5.0);` +
            `}`
        );
    });
});
