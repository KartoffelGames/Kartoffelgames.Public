import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { ParserException } from '../source/exception/parser-exception.ts';
import { LexerPattern } from '../source/lexer/lexer-token-pattern-reference.ts';
import type { LexerToken } from '../source/lexer/lexer-token.ts';
import { Lexer } from '../source/lexer/lexer.ts';

describe('Lexer', () => {
    enum TestTokenType {
        Word = 'word',
        Number = 'number',
        Braket = 'braket',
        Custom = 'Custom',
        Error = 'Error'
    }

    enum TestTokenMetas {
        Braket = 'braket',
        Number = 'number',
        Word = 'word',
        List = 'List'
    }

    // Init new lexer with all test node types set as token patterns.
    const lInitTestLexer = () => {
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.validWhitespaces = ' \n';

        // Add templates.
        const lWordPattern = lLexer.createTokenPattern({ pattern: { regex: /[a-zA-Z]+/, type: TestTokenType.Word }, meta: TestTokenMetas.Word });
        const lNumberPattern = lLexer.createTokenPattern({ pattern: { regex: /[0-9]+/, type: TestTokenType.Number }, meta: TestTokenMetas.Number });
        const lBraketPattern = lLexer.createTokenPattern({
            pattern: {
                start: { regex: /\(/, type: TestTokenType.Braket },
                end: { regex: /\)/, type: TestTokenType.Braket }
            },
            meta: [TestTokenMetas.Braket, TestTokenMetas.List]
        }, (pLexer: Lexer<TestTokenType>) => {
            pLexer.useTokenPattern(lWordPattern, 1);
        });


        lLexer.useTokenPattern(lBraketPattern, 1);
        lLexer.useTokenPattern(lWordPattern, 1);
        lLexer.useTokenPattern(lNumberPattern, 1);

        return lLexer;
    };

    // Init new text that contains at least one token of each token type.
    // 12 token
    // 51 characters
    // 41 non whitespace characters
    // 10 whitespaces including newline.
    const lInitTestText = () => {
        return 'A sentence with 1 or 10 words (Braket and \nnewline) end';
    };

    it('Property: errorType', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

        // Process.
        lLexer.errorType = TestTokenType.Error;

        // Evaluation.
        expect(lLexer.errorType).toBe(TestTokenType.Error);
    });

    describe('Property: trimWhitespace', () => {
        it('-- True', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.trimWhitespace = true;
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation.
            expect(lTokenList).toHaveLength(13);
        });

        it('-- False', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.trimWhitespace = false;

            const lErrorFunction = () => {
                return [...lLexer.tokenize(lInitTestText())];
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(ParserException);
        });

        it('-- Get default', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Evaluation.
            expect(lLexer.trimWhitespace).toBeTruthy();
        });

        it('-- Get altered', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.trimWhitespace = false;

            // Evaluation.
            expect(lLexer.trimWhitespace).toBeFalsy();
        });
    });

    describe('Property: validWhitespaces', () => {
        it('-- Set', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.trimWhitespace = true;
            lLexer.validWhitespaces = ' A\n'; // Space and uppercase A. Should trim out the first word.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation.
            expect(lTokenList).toHaveLength(12);
        });

        it('-- Get', () => {
            // Setup.
            const lValidWhitespaces: string = ' A\n';
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.validWhitespaces = lValidWhitespaces;

            // Evaluation.
            expect(lLexer.validWhitespaces).toBe(lValidWhitespaces);
        });
    });

    describe('Method: addTokenPattern', () => {
        it('-- Add valid', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            lLexer.validWhitespaces = ' \n';

            // Process.
            lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word } }), 0);
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation.
            expect(lTokenList).toHaveLength(44); // 44 characters without whitespace.
        });
    });

    describe('Method: createTokenPattern', () => {
        it('-- Add valid', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

            // Process.
            const lTokenPattern = lLexer.createTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word } });

            // Evaluation.
            expect(() => {
                lLexer.useTokenPattern(lTokenPattern, 0);
            }).not.toThrow();
        });

        it('-- Split token without inner token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

            // Process.
            const lErrorFunction = () => {
                lLexer.createTokenPattern({
                    pattern: {
                        start: { regex: /\(/, type: TestTokenType.Braket },
                        end: { regex: /\)/, type: TestTokenType.Braket }
                    },
                    meta: [TestTokenMetas.Braket, TestTokenMetas.List]
                });
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(`Split token with a start and end token, need inner token definitions.`);
        });

        it('-- Single token with inner token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

            // Process.
            const lErrorFunction = () => {
                lLexer.createTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word } }, () => {
                    // Possible something.
                });
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(`Pattern does not allow inner token pattern.`);
        });
    });

    describe('Method: tokenize', () => {
        it('-- Valid lines and columns', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'

            // A
            expect(lTokenList[0]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[0]).toHaveProperty('columnNumber', 1);

            // sentence
            expect(lTokenList[1]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[1]).toHaveProperty('columnNumber', 3);

            // with
            expect(lTokenList[2]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[2]).toHaveProperty('columnNumber', 12);

            // 1
            expect(lTokenList[3]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[3]).toHaveProperty('columnNumber', 17);

            // or
            expect(lTokenList[4]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[4]).toHaveProperty('columnNumber', 19);

            // 10
            expect(lTokenList[5]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[5]).toHaveProperty('columnNumber', 22);

            // words
            expect(lTokenList[6]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[6]).toHaveProperty('columnNumber', 25);

            // (
            expect(lTokenList[7]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[7]).toHaveProperty('columnNumber', 31);

            // Braket
            expect(lTokenList[8]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[8]).toHaveProperty('columnNumber', 32);

            // and
            expect(lTokenList[9]).toHaveProperty('lineNumber', 1);
            expect(lTokenList[9]).toHaveProperty('columnNumber', 39);

            // newline
            expect(lTokenList[10]).toHaveProperty('lineNumber', 2);
            expect(lTokenList[10]).toHaveProperty('columnNumber', 1);

            // )
            expect(lTokenList[11]).toHaveProperty('lineNumber', 2);
            expect(lTokenList[11]).toHaveProperty('columnNumber', 8);

            // end
            expect(lTokenList[12]).toHaveProperty('lineNumber', 2);
            expect(lTokenList[12]).toHaveProperty('columnNumber', 10);
        });

        it('-- Valid token types', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[0]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[1]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[2]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[3]).toHaveProperty('type', TestTokenType.Number);
            expect(lTokenList[4]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[5]).toHaveProperty('type', TestTokenType.Number);
            expect(lTokenList[6]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[7]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[8]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[9]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[10]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[11]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[12]).toHaveProperty('type', TestTokenType.Word);
        });

        it('-- Valid token values', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[0]).toHaveProperty('value', 'A');
            expect(lTokenList[1]).toHaveProperty('value', 'sentence');
            expect(lTokenList[2]).toHaveProperty('value', 'with');
            expect(lTokenList[3]).toHaveProperty('value', '1');
            expect(lTokenList[4]).toHaveProperty('value', 'or');
            expect(lTokenList[5]).toHaveProperty('value', '10');
            expect(lTokenList[6]).toHaveProperty('value', 'words');
            expect(lTokenList[7]).toHaveProperty('value', '(');
            expect(lTokenList[8]).toHaveProperty('value', 'Braket');
            expect(lTokenList[9]).toHaveProperty('value', 'and');
            expect(lTokenList[10]).toHaveProperty('value', 'newline');
            expect(lTokenList[11]).toHaveProperty('value', ')');
            expect(lTokenList[12]).toHaveProperty('value', 'end');
        });

        it('-- Valid token metas', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[0]).toHaveProperty('metas');
            expect((<any>lTokenList[0])['metas']).toBeDeepEqual([TestTokenMetas.Word]);

            expect(lTokenList[1]).toHaveProperty('metas');
            expect((<any>lTokenList[1])['metas']).toBeDeepEqual([TestTokenMetas.Word]);

            expect(lTokenList[2]).toHaveProperty('metas');
            expect((<any>lTokenList[2])['metas']).toBeDeepEqual([TestTokenMetas.Word]);

            expect(lTokenList[3]).toHaveProperty('metas');
            expect((<any>lTokenList[3])['metas']).toBeDeepEqual([TestTokenMetas.Number]);

            expect(lTokenList[4]).toHaveProperty('metas');
            expect((<any>lTokenList[4])['metas']).toBeDeepEqual([TestTokenMetas.Word]);

            expect(lTokenList[5]).toHaveProperty('metas');
            expect((<any>lTokenList[5])['metas']).toBeDeepEqual([TestTokenMetas.Number]);

            expect(lTokenList[6]).toHaveProperty('metas');
            expect((<any>lTokenList[6])['metas']).toBeDeepEqual([TestTokenMetas.Word]);

            expect(lTokenList[7]).toHaveProperty('metas');
            expect((<any>lTokenList[7])['metas']).toBeDeepEqual([TestTokenMetas.Braket, TestTokenMetas.List]);

            expect(lTokenList[8]).toHaveProperty('metas');
            expect((<any>lTokenList[8])['metas']).toBeDeepEqual([TestTokenMetas.Braket, TestTokenMetas.List, TestTokenMetas.Word]);

            expect(lTokenList[9]).toHaveProperty('metas');
            expect((<any>lTokenList[9])['metas']).toBeDeepEqual([TestTokenMetas.Braket, TestTokenMetas.List, TestTokenMetas.Word]);

            expect(lTokenList[10]).toHaveProperty('metas');
            expect((<any>lTokenList[10])['metas']).toBeDeepEqual([TestTokenMetas.Braket, TestTokenMetas.List, TestTokenMetas.Word]);

            expect(lTokenList[11]).toHaveProperty('metas');
            expect((<any>lTokenList[11])['metas']).toBeDeepEqual([TestTokenMetas.Braket, TestTokenMetas.List]);
        });

        it('-- Invalid token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            const lTestTextWithInvalidToken: string = 'A Invalid Token // is here';

            // Process.
            const lErrorFunction = () => {
                return [...lLexer.tokenize(lTestTextWithInvalidToken)];
            };

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lErrorFunction).toThrow(`Unable to parse next token. No valid pattern found for "// is here"`);
        });

        it('-- Tokenize newline', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /\(Braket and \nnewline\)/,
                    type: TestTokenType.Custom
                }
            }), 0);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[7]).toHaveProperty('value', '(Braket and \nnewline)');
            expect(lTokenList[7]).toHaveProperty('lineNumber', 1);
        });

        it('-- Priorize specification', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /with 1/,
                    type: TestTokenType.Custom
                }
            }), 0);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[2]).toHaveProperty('type', TestTokenType.Custom);
        });

        it('-- Split token with narrow self reference', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

            // Setup. Add nested templates.
            const lValuePattern = lLexer.createTokenPattern({ pattern: { regex: /a/, type: TestTokenType.Custom } });
            const lBraketPattern = lLexer.createTokenPattern({
                pattern: {
                    start: { regex: /\(/, type: TestTokenType.Braket },
                    end: { regex: /\)/, type: TestTokenType.Braket }
                },
            }, (pLexer: Lexer<TestTokenType>) => {
                pLexer.useTokenPattern(lBraketPattern, 1);
                pLexer.useTokenPattern(lValuePattern, 2);
            });
            lLexer.useTokenPattern(lBraketPattern, 1);

            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize('(a(a))')];

            expect(lTokenList[0]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[1]).toHaveProperty('type', TestTokenType.Custom);
            expect(lTokenList[2]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[3]).toHaveProperty('type', TestTokenType.Custom);
            expect(lTokenList[4]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[5]).toHaveProperty('type', TestTokenType.Braket);
        });

        it('-- Split token with narrow self reference second tokenize', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

            // Setup. Add nested templates.
            const lValuePattern = lLexer.createTokenPattern({ pattern: { regex: /a/, type: TestTokenType.Custom } });
            const lBraketPattern = lLexer.createTokenPattern({
                pattern: {
                    start: { regex: /\(/, type: TestTokenType.Braket },
                    end: { regex: /\)/, type: TestTokenType.Braket }
                },
            }, (pLexer: Lexer<TestTokenType>) => {
                pLexer.useTokenPattern(lBraketPattern, 1);
                pLexer.useTokenPattern(lValuePattern, 2);
            });
            lLexer.useTokenPattern(lBraketPattern, 1);

            // Process.
            const _ = [...lLexer.tokenize('(a(a))')];
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize('(a(a))')];

            expect(lTokenList[0]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[1]).toHaveProperty('type', TestTokenType.Custom);
            expect(lTokenList[2]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[3]).toHaveProperty('type', TestTokenType.Custom);
            expect(lTokenList[4]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[5]).toHaveProperty('type', TestTokenType.Braket);
        });

        it('-- Split token with wide self reference', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

            // Process.
            const lValuePattern = lLexer.createTokenPattern({ pattern: { regex: /a/, type: TestTokenType.Custom } });
            const lBraketOnePattern = lLexer.createTokenPattern({
                pattern: {
                    start: { regex: /\(/, type: TestTokenType.Word },
                    end: { regex: /\)/, type: TestTokenType.Word }
                },
            }, (pLexer: Lexer<TestTokenType>) => {
                pLexer.useTokenPattern(lBraketTwoPattern, 1);
                pLexer.useTokenPattern(lValuePattern, 2);
            });
            const lBraketTwoPattern = lLexer.createTokenPattern({
                pattern: {
                    start: { regex: /\[/, type: TestTokenType.Braket },
                    end: { regex: /\]/, type: TestTokenType.Braket }
                },
            }, (pLexer: Lexer<TestTokenType>) => {
                pLexer.useTokenPattern(lBraketOnePattern, 1);
                pLexer.useTokenPattern(lValuePattern, 2);
            });
            lLexer.useTokenPattern(lBraketOnePattern, 1);

            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize('(a[a()])')];

            expect(lTokenList[0]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[1]).toHaveProperty('type', TestTokenType.Custom);
            expect(lTokenList[2]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[3]).toHaveProperty('type', TestTokenType.Custom);
            expect(lTokenList[4]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[5]).toHaveProperty('type', TestTokenType.Word);
            expect(lTokenList[6]).toHaveProperty('type', TestTokenType.Braket);
            expect(lTokenList[7]).toHaveProperty('type', TestTokenType.Word);
        });

        describe('-- Error token', () => {
            it('-- Single token', () => {
                // Setup.
                const lLexer: Lexer<TestTokenType> = lInitTestLexer();
                lLexer.errorType = TestTokenType.Error;

                // Setup. Text.
                const lErrorText = 'This //// is an error';

                // Process.
                const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lErrorText)];

                // Evaluation
                expect(lTokenList).toHaveLength(5);

                // Error token ////
                expect(lTokenList[1]).toHaveProperty('value', '//// ');
                expect(lTokenList[1]).toHaveProperty('type', TestTokenType.Error);
                expect(lTokenList[1]).toHaveProperty('lineNumber', 1);
                expect(lTokenList[1]).toHaveProperty('columnNumber', 6);
                expect(lTokenList[1]).toHaveProperty('metas');
                expect(lTokenList[1]!.metas).toBeDeepEqual([]);
            });

            it('-- Nested', () => {
                // Setup.
                const lLexer: Lexer<TestTokenType> = lInitTestLexer();
                lLexer.errorType = TestTokenType.Error;

                // Setup. Text.
                const lErrorText = 'This ($%$%) is a error';

                // Process.
                const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lErrorText)];

                // Evaluation
                expect(lTokenList).toHaveLength(7);

                // Error token ////
                expect(lTokenList[2]).toHaveProperty('value', '$%$%');
                expect(lTokenList[2]).toHaveProperty('type', TestTokenType.Error);
                expect(lTokenList[2]).toHaveProperty('lineNumber', 1);
                expect(lTokenList[2]).toHaveProperty('columnNumber', 7);
                expect(lTokenList[2]).toHaveProperty('metas');
                expect(lTokenList[2]!.metas).toBeDeepEqual([TestTokenMetas.Braket, TestTokenMetas.List]);
            });

            it('-- Different lines', () => {
                // Setup.
                const lLexer: Lexer<TestTokenType> = lInitTestLexer();
                lLexer.errorType = TestTokenType.Error;

                // Setup. Text.
                const lErrorText = 'This //// and \nthis ($%$%) is a error';

                // Process.
                const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lErrorText)];

                // Evaluation
                expect(lTokenList).toHaveLength(10);

                // Error token ////
                expect(lTokenList[1]).toHaveProperty('value', '//// ');
                expect(lTokenList[1]).toHaveProperty('type', TestTokenType.Error);
                expect(lTokenList[1]).toHaveProperty('lineNumber', 1);
                expect(lTokenList[1]).toHaveProperty('columnNumber', 6);
                expect(lTokenList[1]).toHaveProperty('metas');
                expect(lTokenList[1]!.metas).toBeDeepEqual([]);

                // Error token ////
                expect(lTokenList[5]).toHaveProperty('value', '$%$%');
                expect(lTokenList[5]).toHaveProperty('type', TestTokenType.Error);
                expect(lTokenList[5]).toHaveProperty('lineNumber', 2);
                expect(lTokenList[5]).toHaveProperty('columnNumber', 7);
                expect(lTokenList[5]).toHaveProperty('metas');
                expect(lTokenList[5]!.metas).toBeDeepEqual([TestTokenMetas.Braket, TestTokenMetas.List]);
            });

            it('-- At end', () => {
                // Setup.
                const lLexer: Lexer<TestTokenType> = lInitTestLexer();
                lLexer.errorType = TestTokenType.Error;

                // Setup. Text.
                const lErrorText = 'An Error at end ////';

                // Process.
                const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lErrorText)];

                // Evaluation
                expect(lTokenList).toHaveLength(5);

                // Error token ////
                expect(lTokenList[4]).toHaveProperty('value', '////');
                expect(lTokenList[4]).toHaveProperty('type', TestTokenType.Error);
                expect(lTokenList[4]).toHaveProperty('lineNumber', 1);
                expect(lTokenList[4]).toHaveProperty('columnNumber', 17);
                expect(lTokenList[4]).toHaveProperty('metas');
                expect(lTokenList[4]!.metas).toBeDeepEqual([]);
            });
        });

        it('-- Combined types', () => {
            // Setup.
            const lLexer: Lexer<'aaa' | 'bbb'> = new Lexer<'aaa' | 'bbb'>();
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /(?<aaa>aaa)|(?<bbb>bbb)/,
                    type: {
                        aaa: 'aaa',
                        bbb: 'bbb',
                    }
                }
            }), 1);

            // Process.
            const lTokenList: Array<LexerToken<'aaa' | 'bbb'>> = [...lLexer.tokenize('bbbaaa')];

            // Evaluation.
            expect(lTokenList[0]).toHaveProperty('type', 'bbb');
            expect(lTokenList[1]).toHaveProperty('type', 'aaa');
        });

        it('-- Validate full matches', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /(?<aaa>aaa)bbb/,
                    type: {
                        aaa: TestTokenType.Custom
                    }
                }
            }), 1);

            // Process.
            const lErrorFunction = () => {
                return [...lLexer.tokenize('aaabbb')];
            };

            // Evaluation.
            expect(lErrorFunction).toThrow('A group of a token pattern must match the whole token.');
        });

        it('-- Invalid type group names.', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /(?<aaa>aaa)|(?<ccc>ccc)/,
                    type: {
                        bbb: TestTokenType.Custom
                    }
                }
            }), 1);

            // Process.
            const lErrorFunction = () => {
                return [...lLexer.tokenize('aaa')];
            };

            // Evaluation.
            expect(lErrorFunction).toThrow('No token type found for any defined pattern regex group. Full: "aaa", Matches: "token, aaa", Regex: "(?<token>(?<aaa>aaa)|(?<ccc>ccc))"');
        });

        it('-- Has meta check', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /1/,
                    type: TestTokenType.Number
                },
                meta: TestTokenMetas.Number
            }), 0);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize('1')];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[0].hasMeta(TestTokenMetas.Number)).toBeTruthy();
        });

        it('-- Nested token cant find closing token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            const lTestString: string = '(Start without end';

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

            // Evaluation.
            expect(lTokenList).toHaveLength(4);
            expect(lTokenList[3]).toHaveProperty('metas');
            expect(lTokenList[1]!.metas).toBeDeepEqual([TestTokenMetas.Braket, TestTokenMetas.List, TestTokenMetas.Word]);
        });

        it('-- Token regex with positive lookbehinds', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            const lTestString: string = 'aaabbb';

            // Setup. Add starting token template.
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /aaa/,
                    type: TestTokenType.Custom
                }
            }), 1);

            // Process. Add starting token template.
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /(?<=aaa)bbb/,
                    type: TestTokenType.Custom
                }
            }), 1);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

            // Evaluation.
            expect(lTokenList).toHaveLength(2);
        });

        it('-- Token regex with negative lookbehinds', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            const lTestString: string = 'aaabbb';

            // Setup. Add starting token template.
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /aaa/,
                    type: TestTokenType.Custom
                }
            }), 1);

            // Process. Add starting token template.
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /(?<!aaa)bbb/,
                    type: TestTokenType.Number
                }
            }), 1);
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /bbb/,
                    type: TestTokenType.Custom
                }
            }), 1);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

            // Evaluation.
            expect(lTokenList).toHaveLength(2);
            expect(lTokenList[1].type).toBe(TestTokenType.Custom);
        });

        it('-- Token regex with validator function', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            const lTestString: string = 'aaabaaac';

            // Setup. Add starting token template.
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /aaa/,
                    type: TestTokenType.Custom
                }
            }), 2);
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /b/,
                    type: TestTokenType.Custom
                }
            }), 2);
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /c/,
                    type: TestTokenType.Custom
                }
            }), 2);

            // Process. Add starting token template.
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /aaa/,
                    type: TestTokenType.Number,
                    validator: (pToken: LexerToken<TestTokenType>, pText: string, pIndex: number): boolean => {
                        const lNextCharIndex: number = pIndex + pToken.value.length;
                        const lNextChar: string = pText.substring(lNextCharIndex, lNextCharIndex + 1);

                        return lNextChar === 'c';
                    }
                }
            }), 1);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

            // Evaluation.
            expect(lTokenList).toHaveLength(4);
            expect(lTokenList[0].type).toBe(TestTokenType.Custom);
            expect(lTokenList[2].type).toBe(TestTokenType.Number);
        });

        it('-- Prefer longer token, added order from short to long', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            const lTestString: string = 'aaaaaa';

            // Setup. Add starting token template.
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /aaa/,
                    type: TestTokenType.Number
                }
            }), 1);
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /aaaaaa/,
                    type: TestTokenType.Custom
                }
            }), 1);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

            // Evaluation.
            expect(lTokenList).toHaveLength(1);
            expect(lTokenList[0].type).toBe(TestTokenType.Custom);
        });

        it('-- Prefer longer token, added order from long to short', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            const lTestString: string = 'aaaaaa';

            // Setup. Add starting token template.
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /aaaaaa/,
                    type: TestTokenType.Custom
                }
            }), 1);
            lLexer.useTokenPattern(lLexer.createTokenPattern({
                pattern: {
                    regex: /aaa/,
                    type: TestTokenType.Number
                }
            }), 1);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

            // Evaluation.
            expect(lTokenList).toHaveLength(1);
            expect(lTokenList[0].type).toBe(TestTokenType.Custom);
        });
    });

    describe('Method: useTokenPattern', () => {
        it('-- Use valid', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

            const lTokenPattern = lLexer.createTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word } });

            // Process.
            const lSuccessFunction = () => {
                lLexer.useTokenPattern(lTokenPattern, 0);
            };

            // Evaluation.
            expect(lSuccessFunction).not.toThrow();
        });

        it('-- Set specificity', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word } }), 1);

            // Setup. Add template
            const lTokenPattern = lLexer.createTokenPattern({ pattern: { regex: /aaa/, type: TestTokenType.Custom } });

            // Process.
            lLexer.useTokenPattern(lTokenPattern, 0);
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize('aaa')];

            // Evaluation.
            expect(lTokenList[0]).toHaveProperty('type', TestTokenType.Custom);
        });
    });
});