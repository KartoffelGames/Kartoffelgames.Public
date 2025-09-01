import { expect } from '@kartoffelgames/core-test';
import type { LexerToken } from '@kartoffelgames/core-parser';
import { PgslLexer } from "../source/parser/pgsl-lexer.ts";
import { PgslToken } from "../source/parser/pgsl-token.enum.ts";

const gPgslLexer: PgslLexer = new PgslLexer();

Deno.test('PgslLexer.tokenize()', async (pContext) => {
    await pContext.step('Literals', async (pContext) => {
        await pContext.step('Float', async (pContext) => {
            await pContext.step('Decimal variations', async (pContext) => {
                await pContext.step('Decimal value without suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: f32 = 1.0;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                });

                await pContext.step('Decimal value with missing decimal value', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: f32 = 01.;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                });

                await pContext.step('Decimal value with missing integer value', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: f32 = .01;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                });
            });

            await pContext.step('Float suffix variations', async (pContext) => {
                await pContext.step('Decimal value with f suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: f32 = 1.0f;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                });

                await pContext.step('Decimal value with h suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: f32 = 1.0h;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                });

                await pContext.step('Integer value with f suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: f32 = 1f;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                });

                await pContext.step('Integer value with h suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: f32 = 1h;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                });
            });

            await pContext.step('Hexadecimal float variations', async (pContext) => {
                await pContext.step('Hex value with ending f value', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: f32 = 0x1P+4f;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                });

                await pContext.step('Hex value with zero integer', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: f32 = 0X.3;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                });
            });
        });

        await pContext.step('Integer', async (pContext) => {
            await pContext.step('Basic integer variations', async (pContext) => {
                await pContext.step('Signed Integer value without suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: i32 = 1;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                });

                await pContext.step('Signed Integer value with i suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: i32 = 1i;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                });

                await pContext.step('Unsigned Integer value with u suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: u32 = 1u;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                });
            });

            await pContext.step('Hexadecimal integer variations', async (pContext) => {
                await pContext.step('Hex value without suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: i32 = 0x123;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                });

                await pContext.step('Hex value with u suffix', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: u32 = 0x123u;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                });

                await pContext.step('Hex value with ending f value', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: i32 = 0x3f;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                });
            });
        });

        await pContext.step('Boolean', async (pContext) => {
            await pContext.step('Boolean value variations', async (pContext) => {
                await pContext.step('true', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: bool = true;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralBoolean);
                });

                await pContext.step('false', () => {
                    // Setup.
                    const lCodeString = `
                        const testVariableName: bool = false;
                    `;

                    // Process.
                    const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                    // Evaluation.
                    expect(lTokenList[5].type).toBe(PgslToken.LiteralBoolean);
                });
            });
        });
    });

    await pContext.step('Template lists', async (pContext) => {
        await pContext.step('Basic template list cases', async (pContext) => {
            await pContext.step('Identifier in list', () => {
                // Setup.
                const lCodeString = `
                    const testVariableName: testTemplate<testValue>;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[5].type).toBe(PgslToken.Identifier);
                expect(lTokenList[6].type).toBe(PgslToken.TemplateListEnd);
            });

            await pContext.step('Literal in list', () => {
                // Setup.
                const lCodeString = `
                    const testVariableName: testTemplate<120>;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.TemplateListEnd);
            });

            await pContext.step('Literal with prefix in list', () => {
                // Setup.
                const lCodeString = `
                    const testVariableName: testTemplate<120f>;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[5].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[6].type).toBe(PgslToken.TemplateListEnd);
            });

            await pContext.step('Template list in list', () => {
                // Setup.
                const lCodeString = `
                    const testVariableName: testTemplate<nestedTemplate<120>>;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[5].type).toBe(PgslToken.Identifier);
                expect(lTokenList[6].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[8].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[9].type).toBe(PgslToken.TemplateListEnd);
            });
        });

        await pContext.step('Expression cases in template lists', async (pContext) => {
            await pContext.step('Expression in list', () => {
                // Setup.
                const lCodeString = `
                    const testVariableName: testTemplate<testExpression()>;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[5].type).toBe(PgslToken.Identifier);
                expect(lTokenList[6].type).toBe(PgslToken.ParenthesesStart);
                expect(lTokenList[7].type).toBe(PgslToken.ParenthesesEnd);
                expect(lTokenList[8].type).toBe(PgslToken.TemplateListEnd);
            });

            await pContext.step('Expression with greater than in list', () => {
                // Setup.
                const lCodeString = `
                    const testVariableName: testTemplate<testExpression(testA > testB)>;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[5].type).toBe(PgslToken.Identifier);
                expect(lTokenList[6].type).toBe(PgslToken.ParenthesesStart);
                expect(lTokenList[7].type).toBe(PgslToken.Identifier);
                expect(lTokenList[8].type).toBe(PgslToken.OperatorGreaterThan);
                expect(lTokenList[9].type).toBe(PgslToken.Identifier);
                expect(lTokenList[10].type).toBe(PgslToken.ParenthesesEnd);
                expect(lTokenList[11].type).toBe(PgslToken.TemplateListEnd);
            });

            await pContext.step('Expression with lower than in list', () => {
                // Setup.
                const lCodeString = `
                    const testVariableName: testTemplate<testExpression(testA < testB)>;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[5].type).toBe(PgslToken.Identifier);
                expect(lTokenList[6].type).toBe(PgslToken.ParenthesesStart);
                expect(lTokenList[7].type).toBe(PgslToken.Identifier);
                expect(lTokenList[8].type).toBe(PgslToken.OperatorLowerThan);
                expect(lTokenList[9].type).toBe(PgslToken.Identifier);
                expect(lTokenList[10].type).toBe(PgslToken.ParenthesesEnd);
                expect(lTokenList[11].type).toBe(PgslToken.TemplateListEnd);
            });

            await pContext.step('Expression with comparison in list', () => {
                // Setup.
                const lCodeString = `
                    const testVariableName: testTemplate<testExpression(testA == testB)>;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[5].type).toBe(PgslToken.Identifier);
                expect(lTokenList[6].type).toBe(PgslToken.ParenthesesStart);
                expect(lTokenList[7].type).toBe(PgslToken.Identifier);
                expect(lTokenList[8].type).toBe(PgslToken.OperatorEqual);
                expect(lTokenList[9].type).toBe(PgslToken.Identifier);
                expect(lTokenList[10].type).toBe(PgslToken.ParenthesesEnd);
                expect(lTokenList[11].type).toBe(PgslToken.TemplateListEnd);
            });
        });

        await pContext.step('Complex template list cases', async (pContext) => {
            await pContext.step('Ignore short circuit lower and greater comparisons', () => {
                // Setup.
                const lCodeString = `testA<testB || testB>testC;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.OperatorLowerThan);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.OperatorShortCircuitOr);
                expect(lTokenList[4].type).toBe(PgslToken.Identifier);
                expect(lTokenList[5].type).toBe(PgslToken.OperatorGreaterThan);
                expect(lTokenList[6].type).toBe(PgslToken.Identifier);
                expect(lTokenList[7].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Value with binary or', () => {
                // Setup.
                const lCodeString = `testA<testB | testC>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.OperatorBinaryOr);
                expect(lTokenList[4].type).toBe(PgslToken.Identifier);
                expect(lTokenList[5].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[6].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Nested template list', () => {
                // Setup.
                const lCodeString = `testA<testB, testC<testD>>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.Comma);
                expect(lTokenList[4].type).toBe(PgslToken.Identifier);
                expect(lTokenList[5].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[6].type).toBe(PgslToken.Identifier);
                expect(lTokenList[7].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[8].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[9].type).toBe(PgslToken.Semicolon);
            });
        });

        await pContext.step('Additional template list edge cases', async (pContext) => {
            await pContext.step('Nested template list with lower than compare combined with short circuit or', () => {
                // Setup.
                const lCodeString = `testA<testB, testA<testB || true>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.Comma);
                expect(lTokenList[4].type).toBe(PgslToken.Identifier);
                expect(lTokenList[5].type).toBe(PgslToken.OperatorLowerThan);
                expect(lTokenList[6].type).toBe(PgslToken.Identifier);
                expect(lTokenList[7].type).toBe(PgslToken.OperatorShortCircuitOr);
                expect(lTokenList[8].type).toBe(PgslToken.LiteralBoolean);
                expect(lTokenList[9].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[10].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Negated boolean value', () => {
                // Setup.
                const lCodeString = `testA<!true>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.OperatorNot);
                expect(lTokenList[3].type).toBe(PgslToken.LiteralBoolean);
                expect(lTokenList[4].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[5].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Negated compare value', () => {
                // Setup.
                const lCodeString = `testA<testB != testC>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.OperatorNotEqual);
                expect(lTokenList[4].type).toBe(PgslToken.Identifier);
                expect(lTokenList[5].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[6].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Left shift operator in value', () => {
                // Setup.
                const lCodeString = `testA<testB << 1>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.OperatorShiftLeft);
                expect(lTokenList[4].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[5].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[6].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Lower than operator in value', () => {
                // Setup.
                const lCodeString = `testA<(2 < 1)>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList).toHaveLength(9);
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.ParenthesesStart);
                expect(lTokenList[3].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[4].type).toBe(PgslToken.OperatorLowerThan);
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.ParenthesesEnd);
                expect(lTokenList[7].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[8].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Lower than equal operator in value', () => {
                // Setup.
                const lCodeString = `testA<testB <= 1>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.OperatorLowerThanEqual);
                expect(lTokenList[4].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[5].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[6].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Value with Parentheses and short circuit or', () => {
                // Setup.
                const lCodeString = `testA<(testA || testB)>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.ParenthesesStart);
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.OperatorShortCircuitOr);
                expect(lTokenList[5].type).toBe(PgslToken.Identifier);
                expect(lTokenList[6].type).toBe(PgslToken.ParenthesesEnd);
                expect(lTokenList[7].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[8].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('List start after a ignored token', () => {
                // Setup.
                const lCodeString = `testA <1>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.TemplateListStart);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[3].type).toBe(PgslToken.TemplateListEnd);
                expect(lTokenList[4].type).toBe(PgslToken.Semicolon);
            });
        });

        await pContext.step('Failing states', async (pContext) => {
            await pContext.step('Forbidden token', () => {
                // Setup.
                const lCodeString = `testA<;>`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[0].type).not.toBe(PgslToken.TemplateListStart);
            });

            await pContext.step('Forbidden assignment', () => {
                // Setup.
                const lCodeString = `testA<testC = 1>`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[0].type).not.toBe(PgslToken.TemplateListStart);
            });

            await pContext.step('Greater than operator in value', () => {
                // Setup.
                const lCodeString = `testA<2 > 1>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[0].type).not.toBe(PgslToken.TemplateListStart);
            });

            await pContext.step('Not closing', () => {
                // Setup.
                const lCodeString = `testA<testC, testB`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[0].type).not.toBe(PgslToken.TemplateListStart);
            });

            await pContext.step('Error: Closed nesting without nesting', () => {
                // Setup.
                const lCodeString = `testA<)>`;

                // Process.
                const lFailingFunction = () => {
                    [...gPgslLexer.tokenize(lCodeString)];
                };

                // Evaluation.
                expect(lFailingFunction).toThrow();
            });

            await pContext.step('Error: Closed nesting with wrong corresponding nesting - Square brackets', () => {
                // Setup.
                const lCodeString = `testA<[)>`;

                // Process.
                const lFailingFunction = () => {
                    [...gPgslLexer.tokenize(lCodeString)];
                };

                // Evaluation.
                expect(lFailingFunction).toThrow();
            });

            await pContext.step('Error: Closed nesting with wrong corresponding nesting - Parentheses', () => {
                // Setup.
                const lCodeString = `testA<(]>`;

                // Process.
                const lFailingFunction = () => {
                    [...gPgslLexer.tokenize(lCodeString)];
                };

                // Evaluation.
                expect(lFailingFunction).toThrow();
            });
        });
    });

    await pContext.step('Assignments', async (pContext) => {
        await pContext.step('Basic assignment operators', async (pContext) => {
            await pContext.step('Assignment', () => {
                // Setup.
                const lCodeString = `testVariableName = 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.Assignment);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });
        });

        await pContext.step('Arithmetic assignment operators', async (pContext) => {
            await pContext.step('Assignment with plus', () => {
                // Setup.
                const lCodeString = `testVariableName += 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentPlus);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Assignment with minus', () => {
                // Setup.
                const lCodeString = `testVariableName -= 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentMinus);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Assignment with multiply', () => {
                // Setup.
                const lCodeString = `testVariableName *= 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentMultiply);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Assignment with divide', () => {
                // Setup.
                const lCodeString = `testVariableName /= 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentDivide);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Assignment with modulo', () => {
                // Setup.
                const lCodeString = `testVariableName %= 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentModulo);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });
        });

        await pContext.step('Bitwise assignment operators', async (pContext) => {
            await pContext.step('Assignment with binary and', () => {
                // Setup.
                const lCodeString = `testVariableName &= 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentBinaryAnd);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Assignment with binary or', () => {
                // Setup.
                const lCodeString = `testVariableName |= 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentBinaryOr);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Assignment with binary xor', () => {
                // Setup.
                const lCodeString = `testVariableName ^= 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentBinaryXor);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });
        });

        await pContext.step('Shift assignment operators', async (pContext) => {
            await pContext.step('Assignment with shift right', () => {
                // Setup.
                const lCodeString = `testVariableName >>= 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentShiftRight);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Assignment with shift left', () => {
                // Setup.
                const lCodeString = `testVariableName <<= 1.0;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.AssignmentShiftLeft);
                expect(lTokenList[2].type).toBe(PgslToken.LiteralFloat);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });
        });
    });

    await pContext.step('Operations', async (pContext) => {
        await pContext.step('Basic arithmetic operators', async (pContext) => {
            await pContext.step('OperatorPlus', () => {
                // Setup.
                const lCodeString = `const testA: i32 = 1 + 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorPlus);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorMinus', () => {
                // Setup.
                const lCodeString = `const testA: i32 = 1 - 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorMinus);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorMultiply', () => {
                // Setup.
                const lCodeString = `const testA: i32 = 1 * 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorMultiply);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorDivide', () => {
                // Setup.
                const lCodeString = `const testA: i32 = 1 / 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorDivide);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorModulo', () => {
                // Setup.
                const lCodeString = `const testA: i32 = 1 % 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorModulo);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });
        });

        await pContext.step('Unary operators', async (pContext) => {
            await pContext.step('OperatorNot', () => {
                // Setup.
                const lCodeString = `const testA: bool = !true;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.OperatorNot);
                expect(lTokenList[6].type).toBe(PgslToken.LiteralBoolean);
            });

            await pContext.step('OperatorBinaryNegate', () => {
                // Setup.
                const lCodeString = `const testA: bool = ~1`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.OperatorBinaryNegate);
                expect(lTokenList[6].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorIncrement', () => {
                // Setup.
                const lCodeString = `testName++`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.OperatorIncrement);
            });

            await pContext.step('OperatorDecrement', () => {
                // Setup.
                const lCodeString = `testName--`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.OperatorDecrement);
            });
        });

        await pContext.step('Shift operators', async (pContext) => {
            await pContext.step('OperatorShiftLeft', () => {
                // Setup.
                const lCodeString = `const testA: i32 = 1 << 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorShiftLeft);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorShiftRight', () => {
                // Setup.
                const lCodeString = `const testA: i32 = 1 >> 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorShiftRight);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });
        });

        await pContext.step('Comparison operators', async (pContext) => {
            await pContext.step('OperatorGreaterThan', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 > 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorGreaterThan);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorLowerThan', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 < 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorLowerThan);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorGreaterThanEqual', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 >= 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorGreaterThanEqual);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorLowerThanEqual', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 <= 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorLowerThanEqual);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorEqual', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 == 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorEqual);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorNotEqual', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 != 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorNotEqual);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });
        });

        await pContext.step('Binary operators', async (pContext) => {
            await pContext.step('OperatorBinaryAnd', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 & 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorBinaryAnd);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorBinaryOr', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 | 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorBinaryOr);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorBinaryXor', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 ^ 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorBinaryXor);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
            });
        });

        await pContext.step('Short circuit operators', async (pContext) => {
            await pContext.step('OperatorShortCircuitAnd', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 < 2 && 1 > 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorLowerThan);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[8].type).toBe(PgslToken.OperatorShortCircuitAnd);
                expect(lTokenList[9].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[10].type).toBe(PgslToken.OperatorGreaterThan);
                expect(lTokenList[11].type).toBe(PgslToken.LiteralInteger);
            });

            await pContext.step('OperatorShortCircuitOr', () => {
                // Setup.
                const lCodeString = `const testA: bool = 1 < 2 || 1 > 2;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[6].type).toBe(PgslToken.OperatorLowerThan);
                expect(lTokenList[7].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[8].type).toBe(PgslToken.OperatorShortCircuitOr);
                expect(lTokenList[9].type).toBe(PgslToken.LiteralInteger);
                expect(lTokenList[10].type).toBe(PgslToken.OperatorGreaterThan);
                expect(lTokenList[11].type).toBe(PgslToken.LiteralInteger);
            });
        });
    });

    await pContext.step('Keywords', async (pContext) => {
        await pContext.step('Basic keywords', async (pContext) => {
            await pContext.step('KeywordAlias', () => {
                // Setup.
                const lCodeString = `alias testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordAlias);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordBreak', () => {
                // Setup.
                const lCodeString = `break testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordBreak);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordCase', () => {
                // Setup.
                const lCodeString = `case testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordCase);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordConst', () => {
                // Setup.
                const lCodeString = `const testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDeclarationConst);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordConstAssert', () => {
                // Setup.
                const lCodeString = `const_assert testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordConstAssert);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordContinue', () => {
                // Setup.
                const lCodeString = `continue testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordContinue);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordContinuing', () => {
                // Setup.
                const lCodeString = `continuing testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordContinuing);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDefault', () => {
                // Setup.
                const lCodeString = `default testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDefault);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDiagnostic', () => {
                // Setup.
                const lCodeString = `diagnostic testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDiagnostic);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDiscard', () => {
                // Setup.
                const lCodeString = `discard testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDiscard);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordElse', () => {
                // Setup.
                const lCodeString = `else testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordElse);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordEnable', () => {
                // Setup.
                const lCodeString = `enable testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordEnable);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordFunction', () => {
                // Setup.
                const lCodeString = `function testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordFunction);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordFor', () => {
                // Setup.
                const lCodeString = `for testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordFor);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordIf', () => {
                // Setup.
                const lCodeString = `if testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordIf);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordLoop', () => {
                // Setup.
                const lCodeString = `loop testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordLoop);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordRequires', () => {
                // Setup.
                const lCodeString = `requires testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordRequires);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordReturn', () => {
                // Setup.
                const lCodeString = `return testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordReturn);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordStruct', () => {
                // Setup.
                const lCodeString = `struct testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordStruct);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordSwitch', () => {
                // Setup.
                const lCodeString = `switch testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordSwitch);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordWhile', () => {
                // Setup.
                const lCodeString = `while testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordWhile);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordEnum', () => {
                // Setup.
                const lCodeString = `enum testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordEnum);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDo', () => {
                // Setup.
                const lCodeString = `do {} testIdentifier`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDo);
            });
        });

        await pContext.step('Declaration keywords', async (pContext) => {
            await pContext.step('KeywordDeclarationLet', () => {
                // Setup.
                const lCodeString = `let testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDeclarationLet);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDeclarationVar', () => {
                // Setup.
                const lCodeString = `var testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDeclarationVar);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDeclarationStorage', () => {
                // Setup.
                const lCodeString = `storage testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDeclarationStorage);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDeclarationUniform', () => {
                // Setup.
                const lCodeString = `uniform testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDeclarationUniform);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDeclarationWorkgroup', () => {
                // Setup.
                const lCodeString = `workgroup testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDeclarationWorkgroup);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDeclarationPrivate', () => {
                // Setup.
                const lCodeString = `private testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDeclarationPrivate);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordDeclarationParam', () => {
                // Setup.
                const lCodeString = `param testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordDeclarationParam);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('KeywordNew', () => {
                // Setup.
                const lCodeString = `new testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.KeywordNew);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });
        });
    });

    await pContext.step('Basic tokens', async (pContext) => {
        await pContext.step('Container tokens', async (pContext) => {
            await pContext.step('Block', () => {
                // Setup.
                const lCodeString = `{testIdentifier};`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.BlockStart);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.BlockEnd);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Parentheses', () => {
                // Setup.
                const lCodeString = `(testIdentifier);`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.ParenthesesStart);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.ParenthesesEnd);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('List', () => {
                // Setup.
                const lCodeString = `[testIdentifier];`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.ListStart);
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.ListEnd);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });
        });

        await pContext.step('Identifier and separators', async (pContext) => {
            await pContext.step('Identifier', () => {
                // Setup.
                const lCodeString = `testIdentifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Comma', () => {
                // Setup.
                const lCodeString = `(testA, testB, testC)`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Comma);
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
                expect(lTokenList[4].type).toBe(PgslToken.Comma);
                expect(lTokenList[5].type).toBe(PgslToken.Identifier);
            });

            await pContext.step('MemberDelimiter', () => {
                // Setup.
                const lCodeString = `testAAA.testBBB;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.MemberDelimiter);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Colon', () => {
                // Setup.
                const lCodeString = `
            {
                testAAA: testBBB,
            }
            `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[1].type).toBe(PgslToken.Identifier);
                expect(lTokenList[2].type).toBe(PgslToken.Colon);
                expect(lTokenList[3].type).toBe(PgslToken.Identifier);
            });

            await pContext.step('Semicolon', () => {
                // Setup.
                const lCodeString = `testAAA;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.Semicolon);
            });
        });

        await pContext.step('Special tokens', async (pContext) => {
            await pContext.step('ReservedKeyword', () => {
                // Setup.
                const lCodeString = `testAAA unsafe;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Identifier);
                expect(lTokenList[1].type).toBe(PgslToken.ReservedKeyword);
                expect(lTokenList[2].type).toBe(PgslToken.Semicolon);
            });
        });
    });
    
    await pContext.step('Comments', async (pContext) => {
        await pContext.step('Comment types', async (pContext) => {
            await pContext.step('Single line', () => {
                // Setup.
                const lCodeString = `
                    // testIdentifier;
                    const testA;    
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Comment);
                expect(lTokenList[1].type).toBe(PgslToken.KeywordDeclarationConst);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });

            await pContext.step('Multi line', () => {
                // Setup.
                const lCodeString = `
                    /* 
                        testIdentifier;
                    */
                    const testA;    
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...gPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0].type).toBe(PgslToken.Comment);
                expect(lTokenList[1].type).toBe(PgslToken.KeywordDeclarationConst);
                expect(lTokenList[2].type).toBe(PgslToken.Identifier);
                expect(lTokenList[3].type).toBe(PgslToken.Semicolon);
            });
        });
    });
});