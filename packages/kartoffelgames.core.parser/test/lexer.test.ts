import { expect } from 'chai';
import { Lexer, LexerToken } from '../source/lexer';
import { ParserException } from '../source/parser-exception';
import { Exception } from '@kartoffelgames/core.data';

describe('Lexer', () => {
    enum TestTokenType {
        Word = 'word',
        Number = 'number',
        Braket = 'braket',
        Custom = 'Custom'
    }

    // Init new lexer with all test node types set as token patterns.
    const lInitTestLexer = () => {
        const lWordBreaker: RegExp = /[a-zA-Z]+/;
        const lNumberBreaker: RegExp = /[0-9]+/;
        const lBracketBreaker: RegExp = /(?<token>\(.*?\))and+/;

        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.validWhitespaces = ' \n';

        lLexer.addTokenPattern(lWordBreaker, TestTokenType.Word, 1);
        lLexer.addTokenPattern(lNumberBreaker, TestTokenType.Number, 1);
        lLexer.addTokenPattern(lBracketBreaker, TestTokenType.Braket, 1);

        return lLexer;
    };

    // Init new text that contains 10 word and 53 characters with at least one token of each token type 
    const lInitTestText = () => {
        return 'A sentence with 1 or 10 words (Ending with)and \nnewline';
    };

    describe('Property: trimWhitespace', () => {
        it('-- True', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.trimWhitespace = true;
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation.
            expect(lTokenList).has.lengthOf(10);
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
            expect(lTokenList).has.lengthOf(9);
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
            lLexer.addTokenPattern(/./, TestTokenType.Word, 0);
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation.
            expect(lTokenList).has.lengthOf(45); // 55 characters with 10 trimmed whitespaces. 
        });

        it('-- Add valid', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            lLexer.addTokenPattern(/./, TestTokenType.Word, 0);

            // Process. Dublicate token type
            const lErrorFunction = () => {
                lLexer.addTokenPattern(/A/, TestTokenType.Word, 0);
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception);
        });
    });

    describe('Method: tokenize', () => {
        it('-- Valid lines and columns', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lTokenList[0]).property('lineNumber').to.equal(1);
            expect(lTokenList[0]).property('columnNumber').to.equal(1);

            expect(lTokenList[1]).property('lineNumber').to.equal(1);
            expect(lTokenList[1]).property('columnNumber').to.equal(3);

            expect(lTokenList[2]).property('lineNumber').to.equal(1);
            expect(lTokenList[2]).property('columnNumber').to.equal(12);

            expect(lTokenList[3]).property('lineNumber').to.equal(1);
            expect(lTokenList[3]).property('columnNumber').to.equal(17);

            expect(lTokenList[4]).property('lineNumber').to.equal(1);
            expect(lTokenList[4]).property('columnNumber').to.equal(19);

            expect(lTokenList[5]).property('lineNumber').to.equal(1);
            expect(lTokenList[5]).property('columnNumber').to.equal(22);

            expect(lTokenList[6]).property('lineNumber').to.equal(1);
            expect(lTokenList[6]).property('columnNumber').to.equal(25);

            expect(lTokenList[7]).property('lineNumber').to.equal(1);
            expect(lTokenList[7]).property('columnNumber').to.equal(31);

            expect(lTokenList[8]).property('lineNumber').to.equal(1);
            expect(lTokenList[8]).property('columnNumber').to.equal(44);

            expect(lTokenList[9]).property('lineNumber').to.equal(2);
            expect(lTokenList[9]).property('columnNumber').to.equal(1);
        });

        it('-- Valid token types', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
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
        });

        it('-- Valid token values', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lTokenList[0]).property('value').to.equal('A');
            expect(lTokenList[1]).property('value').to.equal('sentence');
            expect(lTokenList[2]).property('value').to.equal('with');
            expect(lTokenList[3]).property('value').to.equal('1');
            expect(lTokenList[4]).property('value').to.equal('or');
            expect(lTokenList[5]).property('value').to.equal('10');
            expect(lTokenList[6]).property('value').to.equal('words');
            expect(lTokenList[7]).property('value').to.equal('(Ending with)');
            expect(lTokenList[8]).property('value').to.equal('and');
            expect(lTokenList[9]).property('value').to.equal('newline');
        });

        it('-- Invalid token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            const lTestTextWithInvalidToken: string = 'A Invalid Token // is here';

            // Process.
            const lErrorFunction = () => {
                [...lLexer.tokenize(lTestTextWithInvalidToken)];
            };

            // Evaluation. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lErrorFunction).to.throw(ParserException, `Invalid token. Can't tokenize "// is here"`);
        });

        it('-- Tokenize newline', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.addTokenPattern(/and \nnewlin/, TestTokenType.Custom, 1);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lTokenList[8]).property('value').to.equal('and \nnewlin');
            expect(lTokenList[8]).property('lineNumber').to.equal(1);

            expect(lTokenList[9]).property('value').to.equal('e');
            expect(lTokenList[9]).property('lineNumber').to.equal(2);
        });

        it('-- Priorize specification', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.addTokenPattern(/(?<token>\(.*?\))and+/, TestTokenType.Custom, 0);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lTokenList[7]).property('type').to.equal(TestTokenType.Custom);
        });

        it('-- Priorize longer token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.addTokenPattern(/and \nnewlin/, TestTokenType.Custom, 1);

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lTokenList[8]).property('type').to.equal(TestTokenType.Custom);
        });
    });
});