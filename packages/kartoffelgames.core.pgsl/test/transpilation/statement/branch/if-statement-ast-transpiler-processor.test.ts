import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('IfStatementAst - Transpilation', async (pContext) => {
    await pContext.step('Simple if statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `if(true){` +
            `}` +
            `}`
        );
    });

    await pContext.step('If-else statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                } else {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `if(true){` +
            `}else{` +
            `}` +
            `}`
        );
    });

    await pContext.step('If-else-if statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                } else if (false) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `if(true){` +
            `}else if(false){` +
            `}` +
            `}`
        );
    });

    await pContext.step('If-else-if-else statement', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true) {
                } else if (false) {
                } else {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `if(true){` +
            `}else if(false){` +
            `}else{` +
            `}` +
            `}`
        );
    });

    await pContext.step('If with complex condition', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                if (true && false) {
                }
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Correct transpilation output.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `if(true&&false){` +
            `}` +
            `}`
        );
    });
});
