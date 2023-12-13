import { expect } from 'chai';
import { Lexer } from '../../source/lexer/lexer';
import { LexerToken } from '../../source/lexer/lexer-token';
import { ParserException } from '../../source/parser-exception';

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
        lLexer.addTokenTemplate('word', { pattern: { regex: /[a-zA-Z]+/, type: TestTokenType.Word }, specificity: 1, meta: TestTokenMetas.Word });
        lLexer.addTokenTemplate('number', { pattern: { regex: /[0-9]+/, type: TestTokenType.Number }, specificity: 1, meta: TestTokenMetas.Number });

        lLexer.useTokenTemplate('word');
        lLexer.useTokenTemplate('number');
        lLexer.addTokenPattern({
            pattern: {
                start: { regex: /\(/, type: TestTokenType.Braket },
                end: { regex: /\)/, type: TestTokenType.Braket }
            },
            specificity: 1,
            meta: [TestTokenMetas.Braket, TestTokenMetas.List]
        }, (pLexer: Lexer<TestTokenType>) => {
            pLexer.useTokenTemplate('word');
        });

        return lLexer;
    };

    // Init new text that contains at least one token of each token type.
    // 12 token
    // 51 characters
    // 41 non whitespace characters
    // 10 whitespaces including newline.
    const lInitTestText = () => {
        return 'A sentence with 1 or 10 words (Braket and \nnewline)';
    };

    describe('Property: trimWhitespace', () => {
        it('-- True', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.trimWhitespace = true;
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation.
            expect(lTokenList).has.lengthOf(12);
        });

        it('-- False', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.trimWhitespace = false;

            const lErrorFunction = () => {
                [...lLexer.tokenize(lInitTestText())];
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(ParserException);
        });

        it('-- Get default', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Evaluation.
            expect(lLexer.trimWhitespace).to.be.true;
        });

        it('-- Get altered', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.trimWhitespace = false;

            // Evaluation.
            expect(lLexer.trimWhitespace).to.be.false;
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
            expect(lTokenList).has.lengthOf(11);
        });

        it('-- Get', () => {
            // Setup.
            const lValidWhitespaces: string = ' A\n';
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.validWhitespaces = lValidWhitespaces;

            // Evaluation.
            expect(lLexer.validWhitespaces).to.equal(lValidWhitespaces);
        });
    });

    describe('Method: addTokenPattern', () => {
        it('-- Add valid', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            lLexer.validWhitespaces = ' \n';

            // Process.
            lLexer.addTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word }, specificity: 0 });
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation.
            expect(lTokenList).has.lengthOf(41); // 41 characters without whitespace.
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
            expect(lTokenList[0]).property('lineNumber').to.equal(1);
            expect(lTokenList[0]).property('columnNumber').to.equal(1);

            // sentence
            expect(lTokenList[1]).property('lineNumber').to.equal(1);
            expect(lTokenList[1]).property('columnNumber').to.equal(3);

            // with
            expect(lTokenList[2]).property('lineNumber').to.equal(1);
            expect(lTokenList[2]).property('columnNumber').to.equal(12);

            // 1
            expect(lTokenList[3]).property('lineNumber').to.equal(1);
            expect(lTokenList[3]).property('columnNumber').to.equal(17);

            // or
            expect(lTokenList[4]).property('lineNumber').to.equal(1);
            expect(lTokenList[4]).property('columnNumber').to.equal(19);

            // 10
            expect(lTokenList[5]).property('lineNumber').to.equal(1);
            expect(lTokenList[5]).property('columnNumber').to.equal(22);

            // words
            expect(lTokenList[6]).property('lineNumber').to.equal(1);
            expect(lTokenList[6]).property('columnNumber').to.equal(25);

            // (
            expect(lTokenList[7]).property('lineNumber').to.equal(1);
            expect(lTokenList[7]).property('columnNumber').to.equal(31);

            // Braket
            expect(lTokenList[8]).property('lineNumber').to.equal(1);
            expect(lTokenList[8]).property('columnNumber').to.equal(32);

            // and
            expect(lTokenList[9]).property('lineNumber').to.equal(1);
            expect(lTokenList[9]).property('columnNumber').to.equal(39);

            // newline
            expect(lTokenList[10]).property('lineNumber').to.equal(2);
            expect(lTokenList[10]).property('columnNumber').to.equal(1);

            // )
            expect(lTokenList[11]).property('lineNumber').to.equal(2);
            expect(lTokenList[11]).property('columnNumber').to.equal(8);
        });

        it('-- Valid token types', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[0]).property('type').to.equal(TestTokenType.Word);
            expect(lTokenList[1]).property('type').to.equal(TestTokenType.Word);
            expect(lTokenList[2]).property('type').to.equal(TestTokenType.Word);
            expect(lTokenList[3]).property('type').to.equal(TestTokenType.Number);
            expect(lTokenList[4]).property('type').to.equal(TestTokenType.Word);
            expect(lTokenList[5]).property('type').to.equal(TestTokenType.Number);
            expect(lTokenList[6]).property('type').to.equal(TestTokenType.Word);
            expect(lTokenList[7]).property('type').to.equal(TestTokenType.Braket);
            expect(lTokenList[8]).property('type').to.equal(TestTokenType.Word);
            expect(lTokenList[9]).property('type').to.equal(TestTokenType.Word);
            expect(lTokenList[10]).property('type').to.equal(TestTokenType.Word);
            expect(lTokenList[11]).property('type').to.equal(TestTokenType.Braket);
        });

        it('-- Valid token values', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[0]).property('value').to.equal('A');
            expect(lTokenList[1]).property('value').to.equal('sentence');
            expect(lTokenList[2]).property('value').to.equal('with');
            expect(lTokenList[3]).property('value').to.equal('1');
            expect(lTokenList[4]).property('value').to.equal('or');
            expect(lTokenList[5]).property('value').to.equal('10');
            expect(lTokenList[6]).property('value').to.equal('words');
            expect(lTokenList[7]).property('value').to.equal('(');
            expect(lTokenList[8]).property('value').to.equal('Braket');
            expect(lTokenList[9]).property('value').to.equal('and');
            expect(lTokenList[10]).property('value').to.equal('newline');
            expect(lTokenList[11]).property('value').to.equal(')');
        });

        it('-- Valid token metas', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[0]).property('metas').to.deep.equal([TestTokenMetas.Word]);
            expect(lTokenList[1]).property('metas').to.deep.equal([TestTokenMetas.Word]);
            expect(lTokenList[2]).property('metas').to.deep.equal([TestTokenMetas.Word]);
            expect(lTokenList[3]).property('metas').to.deep.equal([TestTokenMetas.Number]);
            expect(lTokenList[4]).property('metas').to.deep.equal([TestTokenMetas.Word]);
            expect(lTokenList[5]).property('metas').to.deep.equal([TestTokenMetas.Number]);
            expect(lTokenList[6]).property('metas').to.deep.equal([TestTokenMetas.Word]);
            expect(lTokenList[7]).property('metas').to.deep.equal([TestTokenMetas.Braket, TestTokenMetas.List]);
            expect(lTokenList[8]).property('metas').to.deep.equal([TestTokenMetas.Braket, TestTokenMetas.List, TestTokenMetas.Word]);
            expect(lTokenList[9]).property('metas').to.deep.equal([TestTokenMetas.Braket, TestTokenMetas.List, TestTokenMetas.Word]);
            expect(lTokenList[10]).property('metas').to.deep.equal([TestTokenMetas.Braket, TestTokenMetas.List, TestTokenMetas.Word]);
            expect(lTokenList[11]).property('metas').to.deep.equal([TestTokenMetas.Braket, TestTokenMetas.List]);
        });

        it('-- Invalid token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            const lTestTextWithInvalidToken: string = 'A Invalid Token // is here';

            // Process.
            const lErrorFunction = () => {
                [...lLexer.tokenize(lTestTextWithInvalidToken)];
            };

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lErrorFunction).to.throw(ParserException, `Unable to parse next token. No valid pattern found for "// is here"`);
        });

        it('-- Tokenize newline', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.addTokenPattern({ pattern: { regex: /\(Braket and \nnewline\)/, type: TestTokenType.Custom }, specificity: 0 });

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[7]).property('value').to.equal('(Braket and \nnewline)');
            expect(lTokenList[7]).property('lineNumber').to.equal(1);
        });

        it('-- Priorize specification', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.addTokenPattern({ pattern: { regex: /with 1/, type: TestTokenType.Custom }, specificity: 0 });

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[2]).property('type').to.equal(TestTokenType.Custom);
        });

        it('-- Error token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.errorType = TestTokenType.Error;

            // Setup. Text.
            const lErrorText = 'This //// and \nthis ($%$%) is a error';

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lErrorText)];

            // Evaluation
            expect(lTokenList).has.lengthOf(10);

            // Error token ////
            expect(lTokenList[1]).property('value').to.equal('//// ');
            expect(lTokenList[1]).property('type').to.equal(TestTokenType.Error);
            expect(lTokenList[1]).property('lineNumber').to.equal(1);
            expect(lTokenList[1]).property('columnNumber').to.equal(6);
            expect(lTokenList[1]).property('metas').to.deep.equal([]);

            // Error token ////
            expect(lTokenList[5]).property('value').to.equal('$%$%');
            expect(lTokenList[5]).property('type').to.equal(TestTokenType.Error);
            expect(lTokenList[5]).property('lineNumber').to.equal(2);
            expect(lTokenList[5]).property('columnNumber').to.equal(7);
            expect(lTokenList[5]).property('metas').to.deep.equal([TestTokenMetas.Braket, TestTokenMetas.List]);

        });
    });
});