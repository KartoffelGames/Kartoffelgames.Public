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

            it('-- Positive hex value with f suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 0.e+4f;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Negative hex value with f suffix.', () => {
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
            expect(lTokenList[3]).property('type').to.equal(PgslToken.ShortCircuitOr);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.OperatorGreaterThan);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[7]).property('type').to.equal(PgslToken.Semicolon);
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

    describe('-- Declarations', () => {
        it('-- Global const declaration with literal assignment.', () => {
            // Setup.
            const lCodeString = `
                const my_var_name: f32 = 1.0;
            `;

            // Process.
            const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(PgslToken.KeywordConst);
            expect(lTokenList[1]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[2]).property('type').to.equal(PgslToken.Colon);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Identifier);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.Assignment);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Semicolon);
        });
    });
});