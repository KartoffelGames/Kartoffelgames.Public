import { expect } from 'chai';
import { PgslLexer } from '../../../source/pgsl/parser/pgsl-lexer';
import { PgslToken } from '../../../source/pgsl/parser/pgsl-token.enum';
import { LexerToken } from '@kartoffelgames/core.parser';

describe('PsglLexer', () => {
    const lPgslLexer: PgslLexer = new PgslLexer();

    describe('-- Literals', () => {
        describe('-- Float', () => {
            it('-- Decimal value without suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 1.0;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Decimal value with missing decimal value.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 01.;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Decimal value with missing integer value.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = .01;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Decimal value with f suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 1.0f;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Decimal value with h suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 1.0h;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Integer value with f suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 1f;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Integer value with h suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 1h;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Hex value with ending f value.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 0.e+4f;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Hex value with zero integer.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 1e-3;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });
        });

        describe('-- Integer', () => {
            it('-- Signed Integer value without suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: i32 = 1;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            });

            it('-- Signed Integer value with i suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: i32 = 1i;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            });

            it('-- Unsigned Integer value with u suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: u32 = 1u;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            });

            it('-- Hex value without suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: i32 = 0x123;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            });

            it('-- Hex value with u suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: u32 = 0x123u;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            });

            it('-- Hex value with ending f value.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: i32 = 0x3f;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            });
        });

        describe('-- Boolean', () => {
            it('-- true', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: bool = true;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralBoolean);
            });

            it('-- false', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: bool = false;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralBoolean);
            });
        });
    });

    describe('-- Template lists', () => {
        it('-- Identifier in list', () => {
            // Setup.
            const lCodeString = `
                const my_var_name: tem<val>;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.TemplateListEnd);
        });

        it('-- Literal in list', () => {
            // Setup.
            const lCodeString = `
                const my_var_name: tem<120>;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.TemplateListEnd);
        });

        it('-- Literal with prefix in list', () => {
            // Setup.
            const lCodeString = `
                const my_var_name: tem<120f>;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.TemplateListEnd);
        });

        it('-- Template list in list', () => {
            // Setup.
            const lCodeString = `
                const my_var_name: tem<tem<120>>;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[9]).property('type').to.equal(PgslToken.TemplateListEnd);
        });

        it('-- Expression in list', () => {
            // Setup.
            const lCodeString = `
                const my_var_name: tem<exp()>;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.ParenthesesStart);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.ParenthesesEnd);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.TemplateListEnd);
        });

        it('-- Expression with greather than in list', () => {
            // Setup.
            const lCodeString = `
                const my_var_name: tem<exp(a > b)>;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.ParenthesesStart);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.OperatorGreaterThan);
            expect(lTokenList[9]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[10]).property('type').to.equal(PgslToken.ParenthesesEnd);
            expect(lTokenList[11]).property('type').to.equal(PgslToken.TemplateListEnd);
        });

        it('-- Expression with lower than in list', () => {
            // Setup.
            const lCodeString = `
                const my_var_name: tem<exp(a < b)>;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.ParenthesesStart);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.OperatorLowerThan);
            expect(lTokenList[9]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[10]).property('type').to.equal(PgslToken.ParenthesesEnd);
            expect(lTokenList[11]).property('type').to.equal(PgslToken.TemplateListEnd);
        });

        it('-- Expression with comparison in list', () => {
            // Setup.
            const lCodeString = `
                const my_var_name: tem<exp(a == b)>;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.ParenthesesStart);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.OperatorEqual);
            expect(lTokenList[9]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[10]).property('type').to.equal(PgslToken.ParenthesesEnd);
            expect(lTokenList[11]).property('type').to.equal(PgslToken.TemplateListEnd);
        });

        it('-- Ignore short circuit lower and greater comparisons', () => {
            // Setup.
            const lCodeString = `a<b || b>c;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.OperatorLowerThan);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.OperatorShortCircuitOr);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.OperatorGreaterThan);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Value with binary or', () => {
            // Setup.
            const lCodeString = `a<b | c>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.OperatorBinaryOr);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Nested template list', () => {
            // Setup.
            const lCodeString = `a<b, c<d>>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Comma);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[9]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Nested template list with lower than compare combined with short circuit or', () => {
            // Setup.
            const lCodeString = `a<b, a<b || true>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Comma);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.OperatorLowerThan);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.OperatorShortCircuitOr);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.LiteralBoolean);
            expect(lTokenList[9]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[10]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Negated boolean value', () => {
            // Setup.
            const lCodeString = `a<!true>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.OperatorNot);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.LiteralBoolean);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Negated compare value', () => {
            // Setup.
            const lCodeString = `a<b != c>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.OperatorNotEqual);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Left shift operator in value', () => {
            // Setup.
            const lCodeString = `a<b << 1>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.OperatorShiftLeft);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Lower than operator in value', () => {
            // Setup.
            const lCodeString = `a<2 < 1>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.OperatorLowerThan);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Lower than equal operator in value', () => {
            // Setup.
            const lCodeString = `a<b <= 1>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.OperatorLowerThanEqual);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Value with Parentheses and short circuit or', () => {
            // Setup.
            const lCodeString = `a<(a || b)>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.ParenthesesStart);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.OperatorShortCircuitOr);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.ParenthesesEnd);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- List start after a ignored token.', () => {
            // Setup.
            const lCodeString = `a <1>;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.TemplateListStart);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.TemplateListEnd);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.Semicolon);
        });

        describe('-- Failing states', () => {
            it('-- Forbidden token', () => {
                // Setup.
                const lCodeString = `a<;>`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[0]).property('type').to.not.equal(PgslToken.TemplateListStart);
            });

            it('-- Forbidden assignment', () => {
                // Setup.
                const lCodeString = `a<c = 1>`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[0]).property('type').to.not.equal(PgslToken.TemplateListStart);
            });

            it('-- Greater than operator in value', () => {
                // Setup.
                const lCodeString = `a<2 > 1>;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[0]).property('type').to.not.equal(PgslToken.TemplateListStart);
            });

            it('-- Not closing', () => {
                // Setup.
                const lCodeString = `a<c, b`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[0]).property('type').to.not.equal(PgslToken.TemplateListStart);
            });

            it('-- Closed nesting without nesting', () => {
                // Setup.
                const lCodeString = `a<)>`;

                // Process.
                const lFailingFunction = () => {
                    [...lPgslLexer.tokenize(lCodeString)];
                };


                // Evaluation.
                expect(lFailingFunction).to.throw();
            });

            it('-- Closed nesting with wrong corresponding nesting, Square brackets', () => {
                // Setup.
                const lCodeString = `a<[)>`;

                // Process.
                const lFailingFunction = () => {
                    [...lPgslLexer.tokenize(lCodeString)];
                };

                // Evaluation.
                expect(lFailingFunction).to.throw();
            });

            it('-- Closed nesting with wrong corresponding nesting, Parentheses', () => {
                // Setup.
                const lCodeString = `a<(]>`;

                // Process.
                const lFailingFunction = () => {
                    [...lPgslLexer.tokenize(lCodeString)];
                };


                // Evaluation.
                expect(lFailingFunction).to.throw();
            });
        });
    });

    describe('-- Assignments', () => {
        it('-- Assignment', () => {
            // Setup.
            const lCodeString = `my_var_name = 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Assignment);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with plus', () => {
            // Setup.
            const lCodeString = `my_var_name += 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentPlus);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with minus', () => {
            // Setup.
            const lCodeString = `my_var_name -= 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentMinus);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with multiply', () => {
            // Setup.
            const lCodeString = `my_var_name *= 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentMultiply);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with divide', () => {
            // Setup.
            const lCodeString = `my_var_name /= 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentDivide);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with modulo', () => {
            // Setup.
            const lCodeString = `my_var_name %= 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentModulo);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with binary and', () => {
            // Setup.
            const lCodeString = `my_var_name &= 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentBinaryAnd);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with binary or', () => {
            // Setup.
            const lCodeString = `my_var_name |= 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentBinaryOr);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with binary xor', () => {
            // Setup.
            const lCodeString = `my_var_name ^= 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentBinaryXor);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with shift right', () => {
            // Setup.
            const lCodeString = `my_var_name >>= 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentShiftRight);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- Assignment with shift left', () => {
            // Setup.
            const lCodeString = `my_var_name <<= 1.0;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.AssignmentShiftLeft);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });

    });

    describe('-- Operations', () => {
        it('-- OperatorPlus', () => {
            // Setup.
            const lCodeString = `const a: i32 = 1 + 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorPlus);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorMinus', () => {
            // Setup.
            const lCodeString = `const a: i32 = 1 - 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorMinus);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorMultiply', () => {
            // Setup.
            const lCodeString = `const a: i32 = 1 * 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorMultiply);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorDivide', () => {
            // Setup.
            const lCodeString = `const a: i32 = 1 / 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorDivide);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorModulo', () => {
            // Setup.
            const lCodeString = `const a: i32 = 1 % 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorModulo);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorNot', () => {
            // Setup.
            const lCodeString = `const a: bool = !true;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.OperatorNot);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.LiteralBoolean);
        });

        it('-- OperatorShiftLeft', () => {
            // Setup.
            const lCodeString = `const a: i32 = 1 << 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorShiftLeft);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorShiftRight', () => {
            // Setup.
            const lCodeString = `const a: i32 = 1 >> 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorShiftRight);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorGreaterThan', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 > 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorGreaterThan);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorLowerThan', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 < 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorLowerThan);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorGreaterThanEqual', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 >= 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorGreaterThanEqual);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorLowerThanEqual', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 <= 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorLowerThanEqual);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorEqual', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 == 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorEqual);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorBinaryAnd', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 & 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorBinaryAnd);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorBinaryOr', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 | 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorBinaryOr);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorBinaryXor', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 ^ 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorBinaryXor);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorBinaryNegate', () => {
            // Setup.
            const lCodeString = `const a: bool = ~1`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.OperatorBinaryNegate);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorNotEqual', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 != 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorNotEqual);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorShortCircuitAnd', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 < 2 && 1 > 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorLowerThan);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.OperatorShortCircuitAnd);
            expect(lTokenList[9]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[10]).property('type').to.equal(PgslToken.OperatorGreaterThan);
            expect(lTokenList[11]).property('type').to.equal(PgslToken.LiteralInteger);
        });

        it('-- OperatorShortCircuitOr', () => {
            // Setup.
            const lCodeString = `const a: bool = 1 < 2 || 1 > 2;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.OperatorLowerThan);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[8]).property('type').to.equal(PgslToken.OperatorShortCircuitOr);
            expect(lTokenList[9]).property('type').to.equal(PgslToken.LiteralInteger);
            expect(lTokenList[10]).property('type').to.equal(PgslToken.OperatorGreaterThan);
            expect(lTokenList[11]).property('type').to.equal(PgslToken.LiteralInteger);
        });
    });

    describe('-- Keywords', () => {
        it('-- KeywordAlias', () => {
            // Setup.
            const lCodeString = `alias identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordAlias);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordBreak', () => {
            // Setup.
            const lCodeString = `break identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordBreak);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordCase', () => {
            // Setup.
            const lCodeString = `case identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordCase);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordConst', () => {
            // Setup.
            const lCodeString = `const identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordConst);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordConstAssert', () => {
            // Setup.
            const lCodeString = `const_assert identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordConstAssert);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordContinue', () => {
            // Setup.
            const lCodeString = `continue identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordContinue);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordContinuing', () => {
            // Setup.
            const lCodeString = `continuing identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordContinuing);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordDefault', () => {
            // Setup.
            const lCodeString = `default identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDefault);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordDiagnostic', () => {
            // Setup.
            const lCodeString = `diagnostic identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDiagnostic);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordDiscard', () => {
            // Setup.
            const lCodeString = `discard identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDiscard);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordElse', () => {
            // Setup.
            const lCodeString = `else identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordElse);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordEnable', () => {
            // Setup.
            const lCodeString = `enable identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordEnable);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordFunction', () => {
            // Setup.
            const lCodeString = `function identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordFunction);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordFor', () => {
            // Setup.
            const lCodeString = `for identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordFor);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordIf', () => {
            // Setup.
            const lCodeString = `if identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordIf);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordLoop', () => {
            // Setup.
            const lCodeString = `loop identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordLoop);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });


        it('-- KeywordRequires', () => {
            // Setup.
            const lCodeString = `requires identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordRequires);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordReturn', () => {
            // Setup.
            const lCodeString = `return identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordReturn);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordStruct', () => {
            // Setup.
            const lCodeString = `struct identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordStruct);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordSwitch', () => {
            // Setup.
            const lCodeString = `switch identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordSwitch);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordWhile', () => {
            // Setup.
            const lCodeString = `while identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordWhile);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        it('-- KeywordInclude', () => {
            // Setup.
            const lCodeString = `include identifier;`;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordInclude);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
        });

        describe('-- Declaration keywords', () => {
            it('-- KeywordDeclarationLet', () => {
                // Setup.
                const lCodeString = `let identifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDeclarationLet);
                expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
            });

            it('-- KeywordDeclarationVar', () => {
                // Setup.
                const lCodeString = `var identifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDeclarationVar);
                expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
            });

            it('-- KeywordDeclarationStorage', () => {
                // Setup.
                const lCodeString = `storage identifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDeclarationStorage);
                expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
            });

            it('-- KeywordDeclarationUniform', () => {
                // Setup.
                const lCodeString = `uniform identifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDeclarationUniform);
                expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
            });

            it('-- KeywordDeclarationWorkgroup', () => {
                // Setup.
                const lCodeString = `workgroup identifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDeclarationWorkgroup);
                expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
            });

            it('-- KeywordDeclarationPrivate', () => {
                // Setup.
                const lCodeString = `private identifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDeclarationPrivate);
                expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
            });

            it('-- KeywordDeclarationParam', () => {
                // Setup.
                const lCodeString = `param identifier;`;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordDeclarationParam);
                expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
                expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
            });
        });
    });

    it('-- Block', () => {
        // Setup.
        const lCodeString = `{identifier};`;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[0]).property('type').to.equal(PgslToken.BlockStart);
        expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[2]).property('type').to.equal(PgslToken.BlockEnd);
        expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
    });

    it('-- Parentheses', () => {
        // Setup.
        const lCodeString = `(identifier);`;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[0]).property('type').to.equal(PgslToken.ParenthesesStart);
        expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[2]).property('type').to.equal(PgslToken.ParenthesesEnd);
        expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
    });

    it('-- List', () => {
        // Setup.
        const lCodeString = `[identifier];`;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[0]).property('type').to.equal(PgslToken.ListStart);
        expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[2]).property('type').to.equal(PgslToken.ListEnd);
        expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
    });

    it('-- Identifier', () => {
        // Setup.
        const lCodeString = `identifier;`;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[1]).property('type').to.equal(PgslToken.Semicolon);
    });

    describe('-- Comment', () => {
        it('-- Single line', () => {
            // Setup.
            const lCodeString = `
                // identifier;
                const a;    
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Comment);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.KeywordConst);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });
        it('-- Single line', () => {
            // Setup.
            const lCodeString = `
                /* 
                    identifier;
                */
                const a;    
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.Comment);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.KeywordConst);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
        });
    });

    it('-- Comma', () => {
        // Setup.
        const lCodeString = `(a, b, c)`;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[2]).property('type').to.equal(PgslToken.Comma);
        expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[4]).property('type').to.equal(PgslToken.Comma);
        expect(lTokenList[5]).property('type').to.equal(PgslToken.Identifier);
    });

    it('-- MemberDelimiter', () => {
        // Setup.
        const lCodeString = `aaa.bbb;`;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[1]).property('type').to.equal(PgslToken.MemberDelimiter);
        expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[3]).property('type').to.equal(PgslToken.Semicolon);
    });

    it('-- Colon', () => {
        // Setup.
        const lCodeString = `
        {
            aaa: bbb,
        }
        `;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[2]).property('type').to.equal(PgslToken.Colon);
        expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
    });

    it('-- Semicolon', () => {
        // Setup.
        const lCodeString = `aaa;`;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[1]).property('type').to.equal(PgslToken.Semicolon);
    });

    it('-- AttributeIndicator', () => {
        // Setup.
        const lCodeString = `bbb @aaa()`;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[1]).property('type').to.equal(PgslToken.AttributeIndicator);
        expect(lTokenList[2]).property('type').to.equal(PgslToken.Identifier);
    });

    it('-- ReservedKeyword', () => {
        // Setup.
        const lCodeString = `aaa unsafe;`;

        // Process.
        const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

        // Evaluation.
        expect(lTokenList[0]).property('type').to.equal(PgslToken.Identifier);
        expect(lTokenList[1]).property('type').to.equal(PgslToken.ReservedKeyword);
        expect(lTokenList[2]).property('type').to.equal(PgslToken.Semicolon);
    });
});