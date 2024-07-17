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
            expect(lTokenList[2]).property('type').to.equal(PgslToken.TypeDelimiter);
            expect(lTokenList[3]).property('type').to.equal(PgslToken.Type);
            expect(lTokenList[4]).property('type').to.equal(PgslToken.Assignment);
            expect(lTokenList[5]).property('type').to.equal(PgslToken.LiteralFloat);
            expect(lTokenList[6]).property('type').to.equal(PgslToken.Semicolon);
        });
    });
});