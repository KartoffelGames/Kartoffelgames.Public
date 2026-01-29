import { expect } from '@kartoffelgames/core-test';
import type { LexerToken } from '../source/lexer/lexer-token.ts';
import { Lexer } from '../source/lexer/lexer.ts';
import type { LexerPatternType, LexerPattern } from '../source/lexer/lexer-pattern.ts';
import { LexerException } from '../source/lexer/lexer-exception.ts';

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
const gInitTestLexer = () => {
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
    }, (pPattern: LexerPattern<TestTokenType, LexerPatternType>) => {
        pPattern.useChildPattern(lWordPattern);
    });

    lLexer.useRootTokenPattern(lBraketPattern);
    lLexer.useRootTokenPattern(lWordPattern);
    lLexer.useRootTokenPattern(lNumberPattern);

    return lLexer;
};

// Init new text that contains at least one token of each token type.
// 12 token
// 51 characters
// 41 non whitespace characters
// 10 whitespaces including newline.
const gInitTestText = () => {
    return 'A sentence with 1 or 10 words (Braket and \nnewline) end';
};

Deno.test('Lexer.errorType', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

        // Process.
        lLexer.errorType = TestTokenType.Error;

        // Evaluation.
        expect(lLexer.errorType).toBe(TestTokenType.Error);
    });
});

Deno.test('Lexer.trimWhitespace', async (pContext) => {
    await pContext.step('True', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Process.
        lLexer.trimWhitespace = true;
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(gInitTestText())];

        // Evaluation.
        expect(lTokenList).toHaveLength(13);
    });

    await pContext.step('False', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Process.
        lLexer.trimWhitespace = false;

        const lErrorFunction = () => {
            return [...lLexer.tokenize(gInitTestText())];
        };

        // Evaluation.
        expect(lErrorFunction).toThrow(LexerException);
    });

    await pContext.step('Get default', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Evaluation.
        expect(lLexer.trimWhitespace).toBeTruthy();
    });

    await pContext.step('Get altered', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Process.
        lLexer.trimWhitespace = false;

        // Evaluation.
        expect(lLexer.trimWhitespace).toBeFalsy();
    });
});

Deno.test('Lexer.validWhitespaces', async (pContext) => {
    await pContext.step('Set', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Process.
        lLexer.trimWhitespace = true;
        lLexer.validWhitespaces = ' A\n'; // Space and uppercase A. Should trim out the first word.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(gInitTestText())];

        // Evaluation.
        expect(lTokenList).toHaveLength(12);
    });

    await pContext.step('Get', () => {
        // Setup.
        const lValidWhitespaces: string = ' A\n';
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Process.
        lLexer.validWhitespaces = lValidWhitespaces;

        // Evaluation.
        expect(lLexer.validWhitespaces).toBe(lValidWhitespaces);
    });
});

Deno.test('Lexer.addTokenPattern()', async (pContext) => {
    await pContext.step('Add valid', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.validWhitespaces = ' \n';

        // Process.
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word } }));
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(gInitTestText())];

        // Evaluation.
        expect(lTokenList).toHaveLength(44); // 44 characters without whitespace.
    });
});

Deno.test('Lexer.createTokenPattern()', async (pContext) => {
    await pContext.step('Add valid', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

        // Process.
        const lTokenPattern = lLexer.createTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word } });

        // Evaluation.
        expect(() => {
            lLexer.useRootTokenPattern(lTokenPattern);
        }).not.toThrow();
    });

    await pContext.step('Split token without inner token', () => {
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

    await pContext.step('Single token with inner token', () => {
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

Deno.test('Lexer.tokenize()', async (pContext) => {
    await pContext.step('Valid lines and columns', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(gInitTestText())];

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

    await pContext.step('Valid token types', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(gInitTestText())];

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

    await pContext.step('Valid token values', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(gInitTestText())];

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

    await pContext.step('Valid token metas', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(gInitTestText())];

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

    await pContext.step('Invalid token', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();
        const lTestTextWithInvalidToken: string = 'A Invalid Token // is here';

        // Process.
        const lErrorFunction = () => {
            return [...lLexer.tokenize(lTestTextWithInvalidToken)];
        };

        // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
        expect(lErrorFunction).toThrow(`Unable to parse next token. No valid pattern found for "// is here"`);
    });

    await pContext.step('Tokenize newline', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.validWhitespaces = ' \n';

        // Add templates.
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /\(Braket and \nnewline\)/,
                type: TestTokenType.Custom
            }
        }));
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[a-zA-Z]+/, type: TestTokenType.Word }, meta: TestTokenMetas.Word }));
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[0-9]+/, type: TestTokenType.Number }, meta: TestTokenMetas.Number }));

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(gInitTestText())];

        // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
        expect(lTokenList[7]).toHaveProperty('value', '(Braket and \nnewline)');
        expect(lTokenList[7]).toHaveProperty('lineNumber', 1);
    });

    await pContext.step('Split token with narrow self reference', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

        // Setup. Add nested templates.
        const lValuePattern = lLexer.createTokenPattern({ pattern: { regex: /a/, type: TestTokenType.Custom } });
        const lBraketPattern = lLexer.createTokenPattern({
            pattern: {
                start: { regex: /\(/, type: TestTokenType.Braket },
                end: { regex: /\)/, type: TestTokenType.Braket }
            },
        }, (pPattern: LexerPattern<TestTokenType, LexerPatternType>) => {
            pPattern.useChildPattern(lBraketPattern);
            pPattern.useChildPattern(lValuePattern);
        });
        lLexer.useRootTokenPattern(lBraketPattern);

        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize('(a(a))')];

        expect(lTokenList[0]).toHaveProperty('type', TestTokenType.Braket);
        expect(lTokenList[1]).toHaveProperty('type', TestTokenType.Custom);
        expect(lTokenList[2]).toHaveProperty('type', TestTokenType.Braket);
        expect(lTokenList[3]).toHaveProperty('type', TestTokenType.Custom);
        expect(lTokenList[4]).toHaveProperty('type', TestTokenType.Braket);
        expect(lTokenList[5]).toHaveProperty('type', TestTokenType.Braket);
    });

    await pContext.step('Split token with narrow self reference second tokenize', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

        // Setup. Add nested templates.
        const lValuePattern = lLexer.createTokenPattern({ pattern: { regex: /a/, type: TestTokenType.Custom } });
        const lBraketPattern = lLexer.createTokenPattern({
            pattern: {
                start: { regex: /\(/, type: TestTokenType.Braket },
                end: { regex: /\)/, type: TestTokenType.Braket }
            },
        }, (pPattern: LexerPattern<TestTokenType, LexerPatternType>) => {
            pPattern.useChildPattern(lBraketPattern);
            pPattern.useChildPattern(lValuePattern);
        });
        lLexer.useRootTokenPattern(lBraketPattern);

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

    await pContext.step('Split token with wide self reference', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

        // Process.
        const lValuePattern = lLexer.createTokenPattern({ pattern: { regex: /a/, type: TestTokenType.Custom } });
        const lBraketOnePattern = lLexer.createTokenPattern({
            pattern: {
                start: { regex: /\(/, type: TestTokenType.Word },
                end: { regex: /\)/, type: TestTokenType.Word }
            },
        }, (pPattern: LexerPattern<TestTokenType, LexerPatternType>) => {
            pPattern.useChildPattern(lBraketTwoPattern);
            pPattern.useChildPattern(lValuePattern);
        });
        const lBraketTwoPattern = lLexer.createTokenPattern({
            pattern: {
                start: { regex: /\[/, type: TestTokenType.Braket },
                end: { regex: /\]/, type: TestTokenType.Braket }
            },
        }, (pPattern: LexerPattern<TestTokenType, LexerPatternType>) => {
            pPattern.useChildPattern(lBraketOnePattern);
            pPattern.useChildPattern(lValuePattern);
        });
        lLexer.useRootTokenPattern(lBraketOnePattern);

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

    await pContext.step('Error token', async (pContext) => {
        await pContext.step('Single token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = gInitTestLexer();
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

        await pContext.step('Nested', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = gInitTestLexer();
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

        await pContext.step('Different lines', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = gInitTestLexer();
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

        await pContext.step('At end', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = gInitTestLexer();
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

    await pContext.step('Combined types', () => {
        // Setup.
        const lLexer: Lexer<'aaa' | 'bbb'> = new Lexer<'aaa' | 'bbb'>();
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /(?<aaa>aaa)|(?<bbb>bbb)/,
                type: {
                    aaa: 'aaa',
                    bbb: 'bbb',
                }
            }
        }));

        // Process.
        const lTokenList: Array<LexerToken<'aaa' | 'bbb'>> = [...lLexer.tokenize('bbbaaa')];

        // Evaluation.
        expect(lTokenList[0]).toHaveProperty('type', 'bbb');
        expect(lTokenList[1]).toHaveProperty('type', 'aaa');
    });

    await pContext.step('Validate full matches', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /(?<aaa>aaa)bbb/,
                type: {
                    aaa: TestTokenType.Custom
                }
            }
        }));

        // Process.
        const lErrorFunction = () => {
            return [...lLexer.tokenize('aaabbb')];
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('A group of a token pattern must match the whole token.');
    });

    await pContext.step('Invalid type group names.', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /(?<aaa>aaa)|(?<ccc>ccc)/,
                type: {
                    bbb: TestTokenType.Custom
                }
            }
        }));

        // Process.
        const lErrorFunction = () => {
            return [...lLexer.tokenize('aaa')];
        };

        // Evaluation.
        expect(lErrorFunction).toThrow('No token type found for any defined pattern regex group. Full: "aaa", Matches: "token, aaa", Available: "bbb", Regex: "^(?<token>(?<aaa>aaa)|(?<ccc>ccc))"');
    });

    await pContext.step('Has meta check', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /1/,
                type: TestTokenType.Number
            },
            meta: TestTokenMetas.Number
        }));

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize('1')];

        // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
        expect(lTokenList[0].hasMeta(TestTokenMetas.Number)).toBeTruthy();
    });

    await pContext.step('Nested token cant find closing token', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();
        const lTestString: string = '(Start without end';

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

        // Evaluation.
        expect(lTokenList).toHaveLength(4);
        expect(lTokenList[3]).toHaveProperty('metas');
        expect(lTokenList[1]!.metas).toBeDeepEqual([TestTokenMetas.Braket, TestTokenMetas.List, TestTokenMetas.Word]);
    });

    await pContext.step('Token regex with validator function', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        const lTestString: string = 'aaabaaac';

        // Setup. Add starting token template.
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /aaa/,
                type: TestTokenType.Number,
                validator: (_pToken: LexerToken<TestTokenType>, pText: string, _pIndex: number): boolean => {
                    const lNextChar: string = pText.charAt(0);
                    return lNextChar === 'c';
                }
            }
        }));

        // Setup. Add starting token template.
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /aaa/,
                type: TestTokenType.Custom
            }
        }));
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /b/,
                type: TestTokenType.Custom
            }
        }));
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /c/,
                type: TestTokenType.Custom
            }
        }));

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

        // Evaluation.
        expect(lTokenList).toHaveLength(4);
        expect(lTokenList[0].type).toBe(TestTokenType.Custom);
        expect(lTokenList[2].type).toBe(TestTokenType.Number);
    });

    await pContext.step('Prefer order over token length', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        const lTestString: string = 'aaaaaa';

        // Setup. Add starting token template.
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /aaaaaa/,
                type: TestTokenType.Custom
            }
        }));
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /aaa/,
                type: TestTokenType.Number
            }
        }));

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

        // Evaluation.
        expect(lTokenList).toHaveLength(1);
        expect(lTokenList[0].type).toBe(TestTokenType.Custom);
    });

    await pContext.step('Prefer token of pattern added first', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        const lTestString: string = 'aaaaaa';

        // Setup. Add starting token template.
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /aaaaaa/,
                type: TestTokenType.Custom
            }
        }));
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /aaa/,
                type: TestTokenType.Number
            }
        }));

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

        // Evaluation.
        expect(lTokenList).toHaveLength(1);
        expect(lTokenList[0].type).toBe(TestTokenType.Custom);
    });

    await pContext.step('Unicode functions in regex', ()=>{
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.validWhitespaces = ' ';
        lLexer.trimWhitespace = true;

        const lTestString: string = 'test test';

        // Setup. Add starting token template.
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /[\p{XID_Start}]+/u,
                type: TestTokenType.Custom
            }
        }));
        lLexer.useRootTokenPattern(lLexer.createTokenPattern({
            pattern: {
                regex: /[^\s]*/,
                type: TestTokenType.Word
            }
        }));

        // Process.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

        // Evaluation.
        expect(lTokenList).toHaveLength(2);
        expect(lTokenList[0].type).toBe(TestTokenType.Custom);
        expect(lTokenList[1].type).toBe(TestTokenType.Custom);
    });
});

Deno.test('Lexer.useTokenPattern()', async (pContext) => {
    await pContext.step('Use valid', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

        const lTokenPattern = lLexer.createTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word } });

        // Process.
        const lSuccessFunction = () => {
            lLexer.useRootTokenPattern(lTokenPattern);
        };

        // Evaluation.
        expect(lSuccessFunction).not.toThrow();
    });

    await pContext.step('Different lexer', () => {
        // Setup.
        const lLexerOne: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        const lLexerTwo: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        const lTokenPatternTwo = lLexerTwo.createTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word } });

        // Process.
        const lSuccessFunction = () => {
            lLexerOne.useRootTokenPattern(lTokenPatternTwo);
        };

        // Evaluation.
        expect(lSuccessFunction).toThrow('Token pattern must be created by this lexer.');
    });
});

Deno.test('Lexer--Functionality: Progress tracker', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = gInitTestLexer();
        const lText: string = 'aaa aa';

        // Setup. Progress tracker.
        const lProgressList: Array<[number, number, number]> = new Array<[number, number, number]>();
        const lProcessTracker = (pPosition: number, pLine: number, pColumn: number) => {
            lProgressList.push([pPosition, pLine, pColumn]);
        };

        // Process.
        const _ = [...lLexer.tokenize(lText, lProcessTracker)];

        // Evaluation.
        expect(lProgressList).toHaveLength(3);
        expect(lProgressList[0]).toBeDeepEqual([3, 1, 4]);
        expect(lProgressList[1]).toBeDeepEqual([4, 1, 5]);
        expect(lProgressList[2]).toBeDeepEqual([6, 1, 7]);
    });
});