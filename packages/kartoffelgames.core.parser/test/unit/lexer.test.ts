import { expect } from 'chai';
import { Lexer } from '../../source/lexer/lexer';
import { ParserException } from '../../source/parser-exception';
import { Exception } from '@kartoffelgames/core.data';
import { LexerToken } from '../../source/lexer/lexer-token';

describe('Lexer', () => {
    enum TestTokenType {
        Word = 'word',
        Number = 'number',
        Braket = 'braket',
        Custom = 'Custom'
    }

    // Init new lexer with all test node types set as token patterns.
    const lInitTestLexer = () => {
        const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
        lLexer.validWhitespaces = ' \n';

        // Add templates.
        lLexer.addTokenTemplate('word', { pattern: { regex: /[a-zA-Z]+/, type: TestTokenType.Word }, specificity: 1 });
        lLexer.addTokenTemplate('number', { pattern: { regex:  /[0-9]+/, type: TestTokenType.Number }, specificity: 1 });

        lLexer.useTokenTemplate('word');
        lLexer.useTokenTemplate('number');
        lLexer.addTokenPattern({
            pattern: {
                start: { regex: /\(/, type: TestTokenType.Braket },
                end: { regex: /\)/, type: TestTokenType.Braket }
            },
            specificity: 1
        }, (pLexer:Lexer<TestTokenType> )=>{
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
            lLexer.addTokenPattern({ pattern: { regex: /and \nnewlin/, type: TestTokenType.Custom }, specificity: 1 });

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
            lLexer.addTokenPattern({ pattern: { regex: /(?<token>\(.*?\))and+/, type: TestTokenType.Custom }, specificity: 0 });

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lTokenList[7]).property('type').to.equal(TestTokenType.Custom);
        });

        it('-- Priorize longer token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.addTokenPattern({ pattern: { regex: /and \nnewlin/, type: TestTokenType.Custom }, specificity: 1 });

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation. 'A sentence with 1 or 10 words (Ending with)and \nnewline'
            expect(lTokenList[8]).property('type').to.equal(TestTokenType.Custom);
        });

        it('-- Optional token capture group', () => {
            // Setup.
            const lText: string = 'My Text Data<';
            const lLexer: Lexer<'text' | 'closing'> = new Lexer<'text' | 'closing'>();

            lLexer.addTokenPattern({ pattern: { regex: /^"[^"]*"|^(?<token>[^<>"]+)(?:<|")/, type: 'text' }, specificity: 4 });
            lLexer.addTokenPattern({ pattern: { regex: /</, type: 'closing' }, specificity: 4 });

            // Process.
            const lTokenList: Array<LexerToken<'text' | 'closing'>> = [...lLexer.tokenize(lText)];

            // Evaluation.
            expect(lTokenList).has.lengthOf(2);
            expect(lTokenList[0]).property('value').to.equal('My Text Data');
            expect(lTokenList[0]).property('type').to.equal('text');
            expect(lTokenList[1]).property('value').to.equal('<');
            expect(lTokenList[1]).property('type').to.equal('closing');
        });
    });
});