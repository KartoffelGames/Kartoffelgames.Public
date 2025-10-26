import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from '../../source/parser/pgsl-parser.ts';
import type { PgslDocument } from '../../source/syntax_tree/pgsl-document.ts';

const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslParser.parse()', async (pContext) => {
    await pContext.step('Template list', async (pContext) => {
        await pContext.step('Single', () => {
            // Setup.
            const lSourceCode: string = `
                private testVariable: Array<Integer>;
            `;

            // Process.
            const lResult: PgslDocument = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('List', () => {
            // Setup.
            const lSourceCode: string = `
                const testVariable: Array<Integer, 3>;
            `;

            // Process.
            const lResult: PgslDocument = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });

        await pContext.step('Nested', () => {
            // Setup.
            const lSourceCode: string = `
                const testVariable: Array<Vector2<Integer>, 2>;
            `;

            // Process.
            const lResult: PgslDocument = gPgslParser.parse(lSourceCode);

            // Evaluation.
            expect(lResult).toBeTruthy();
        });
    });

    await pContext.step('Expression', async (pContext) => {
        await pContext.step('Variable expression', async (pContext) => {
            await pContext.step('Variable name', () => {
                // Setup.
                const lSourceCode: string = `
                    const testVariable: Integer = 10;

                    function test(): void {
                        let value: Integer = testVariable;
                    }
                `;

                // Process.
                const lResult: PgslDocument = gPgslParser.parse(lSourceCode);

                // Evaluation.
                expect(lResult).toBeTruthy();
            });

            await pContext.step('Index value', () => {
                // Setup.
                const lSourceCode: string = `
                    function test(): void {
                        let testVariable: Array<Integer, 3> = new Array<Integer, 3>(1, 2, 3);

                        let value: Integer = testVariable[10];
                    }
                `;

                // Process.
                const lResult: PgslDocument = gPgslParser.parse(lSourceCode);

                // Evaluation.
                expect(lResult).toBeTruthy();
            });

            await pContext.step('Composite value', () => {
                // Setup.
                const lSourceCode: string = `
                    struct TestStruct {
                        prop: Integer
                    }

                    function test(): void {
                        let testVariable: TestStruct;

                        let value: Integer = testVariable.prop;
                    }
                `;

                // Process.
                const lResult: PgslDocument = gPgslParser.parse(lSourceCode);

                // Evaluation.
                expect(lResult).toBeTruthy();
            });
        });
    });
});