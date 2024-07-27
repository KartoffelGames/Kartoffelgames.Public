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

            it('-- Integer value with f suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: f32 = 1h;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            // TODO: const a = 0.e+4f;
            // TODO: const h = 1e-3;
            // TODO: const h = 1e-3;
            // TODO: const b = 01.;
            // TODO: const c = .01;
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
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Signed Integer value with i suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: i32 = 1i;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            it('-- Unsigned Integer value with u suffix.', () => {
                // Setup.
                const lCodeString = `
                    const my_var_name: u32 = 1u;
                `;

                // Process.
                const lTokenList: Array<LexerToken<PgslToken>> = [...lPgslLexer.tokenize(lCodeString)];

                // Evaluation.
                expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            });

            // TODO: Hex
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
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralInteger);
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
            expect(lTokenList[9]).property('type').to.equal(PgslToken.TemplateListEnd);
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
            expect(lTokenList[8]).property('type').to.equal(PgslToken.OperatorGreaterThan);
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