import { expect } from 'chai';
import { Lexer, LexerToken } from '../source/lexer';
import { ParserException } from '../source/parser-exception';

describe('Lexer', () => {
    enum TestTokenType {
        Word = 'word',
        Number = 'number',
        Braket = 'braket'
    }

    // Init new lexer with all test node types set as token patterns.
    const lInitTestLexer = () => {
        const lWordBreaker: RegExp = /[a-z]+/;
        const lNumberBreaker: RegExp = /[0-9]+/;
        const lBracketBreaker: RegExp = /(?<token>\(.*?\))and+/;

        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.validWhitespaces = ' \n';

        lLexer.addTokenPattern(lWordBreaker, TestTokenType.Word, 0);
        lLexer.addTokenPattern(lNumberBreaker, TestTokenType.Number, 0);
        lLexer.addTokenPattern(lBracketBreaker, TestTokenType.Braket, 0);

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
            lLexer.trimWhitespace = true;

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

    it('Property: validWhitespaces', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = lInitTestLexer();

        // Process.
        lLexer.trimWhitespace = true;
        lLexer.validWhitespaces = ' A'; // Space and uppercase A. Should trim out the first word.
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

        // Evaluation.
        expect(lTokenList).has.lengthOf(9);
    });

    it('Method: addTokenPattern', () => {
        // Setup.
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.validWhitespaces = ' \n';

        // Process.
        lLexer.addTokenPattern(/./, TestTokenType.Word, 0);
        const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

        // Evaluation.
        expect(lTokenList).has.lengthOf(44); // 53 characters with 9 trimmed whitespaces. 
    });

    describe('Property: tokenize', () => {
        it('-- Valid lines and columns', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Process. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lTokenList[0]).property('lineNumber').to.equal(1).and.property('columnNumber').to.equal(1);
            expect(lTokenList[1]).property('lineNumber').to.equal(1).and.property('columnNumber').to.equal(3);
            expect(lTokenList[2]).property('lineNumber').to.equal(1).and.property('columnNumber').to.equal(12);
            expect(lTokenList[3]).property('lineNumber').to.equal(1).and.property('columnNumber').to.equal(17);
            expect(lTokenList[4]).property('lineNumber').to.equal(1).and.property('columnNumber').to.equal(19);
            expect(lTokenList[5]).property('lineNumber').to.equal(1).and.property('columnNumber').to.equal(22);
            expect(lTokenList[6]).property('lineNumber').to.equal(1).and.property('columnNumber').to.equal(25);
            expect(lTokenList[7]).property('lineNumber').to.equal(1).and.property('columnNumber').to.equal(31);
            expect(lTokenList[8]).property('lineNumber').to.equal(1).and.property('columnNumber').to.equal(44);
            expect(lTokenList[9]).property('lineNumber').to.equal(2).and.property('columnNumber').to.equal(1);
        });

        it('-- Valid token types', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Process. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
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

            // Process. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
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

            // Process. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lErrorFunction).to.throw(ParserException, `Invalid token. Can't tokenize "// is here"`);

        });
    });
});