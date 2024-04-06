import { expect } from 'chai';
import { Lexer } from '../../source/lexer/lexer';
import { LexerToken } from '../../source/lexer/lexer-token';
import { ParserException } from '../../source/exception/parser-exception';

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
        lLexer.addTokenTemplate('word', { pattern: { regex: /[a-zA-Z]+/, type: TestTokenType.Word }, meta: TestTokenMetas.Word });
        lLexer.addTokenTemplate('number', { pattern: { regex: /[0-9]+/, type: TestTokenType.Number }, meta: TestTokenMetas.Number });

        lLexer.useTokenTemplate('word', 1);
        lLexer.useTokenTemplate('number', 1);
        lLexer.addTokenPattern({
            pattern: {
                start: { regex: /\(/, type: TestTokenType.Braket },
                end: { regex: /\)/, type: TestTokenType.Braket }
            },
            specificity: 1,
            meta: [TestTokenMetas.Braket, TestTokenMetas.List]
        }, (pLexer: Lexer<TestTokenType>) => {
            pLexer.useTokenTemplate('word', 1);
        });

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
        expect(lLexer.errorType).equals(TestTokenType.Error);
    });

    describe('Property: trimWhitespace', () => {
        it('-- True', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();

            // Process.
            lLexer.trimWhitespace = true;
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lInitTestText())];

            // Evaluation.
            expect(lTokenList).has.lengthOf(13);
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
            expect(lTokenList).has.lengthOf(12);
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
            expect(lTokenList).has.lengthOf(44); // 44 characters without whitespace.
        });
    });

    describe('Method: addTokenTemplate', () => {
        it('-- Add valid', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            const lTemplateName: string = 'TokenTemplateName';

            // Process.
            lLexer.addTokenTemplate(lTemplateName, { pattern: { regex: /./, type: TestTokenType.Word } });

            // Evaluation.
            expect(() => {
                lLexer.useTokenTemplate(lTemplateName, 0);
            }).to.not.throw();
        });

        it('-- Add dublicate', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            const lTemplateName: string = 'TokenTemplateName';
            lLexer.addTokenTemplate(lTemplateName, { pattern: { regex: /./, type: TestTokenType.Word } });

            // Process.
            const lErrorFunction = () => {
                lLexer.addTokenTemplate(lTemplateName, { pattern: { regex: /./, type: TestTokenType.Word } });
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(`Can't add dublicate token template "${lTemplateName}"`);
        });

        it('-- Split token without inner token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

            // Process.
            const lErrorFunction = () => {
                lLexer.addTokenPattern({
                    pattern: {
                        start: { regex: /\(/, type: TestTokenType.Braket },
                        end: { regex: /\)/, type: TestTokenType.Braket }
                    },
                    specificity: 1,
                    meta: [TestTokenMetas.Braket, TestTokenMetas.List]
                });
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(`Split token with a start and end token, need inner token definitions.`);
        });

        it('-- Single token with inner token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();

            // Process.
            const lErrorFunction = () => {
                lLexer.addTokenTemplate('Name', { pattern: { regex: /./, type: TestTokenType.Word } }, () => {
                    // Possible something.
                });
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(`Pattern does not allow inner token pattern.`);
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

            // end
            expect(lTokenList[12]).property('lineNumber').to.equal(2);
            expect(lTokenList[12]).property('columnNumber').to.equal(10);
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
            expect(lTokenList[12]).property('type').to.equal(TestTokenType.Word);
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
            expect(lTokenList[12]).property('value').to.equal('end');
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
                expect(lTokenList).has.lengthOf(5);
    
                // Error token ////
                expect(lTokenList[1]).property('value').to.equal('//// ');
                expect(lTokenList[1]).property('type').to.equal(TestTokenType.Error);
                expect(lTokenList[1]).property('lineNumber').to.equal(1);
                expect(lTokenList[1]).property('columnNumber').to.equal(6);
                expect(lTokenList[1]).property('metas').to.deep.equal([]);
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
                expect(lTokenList).has.lengthOf(7);
    
                // Error token ////
                expect(lTokenList[2]).property('value').to.equal('$%$%');
                expect(lTokenList[2]).property('type').to.equal(TestTokenType.Error);
                expect(lTokenList[2]).property('lineNumber').to.equal(1);
                expect(lTokenList[2]).property('columnNumber').to.equal(7);
                expect(lTokenList[2]).property('metas').to.deep.equal([TestTokenMetas.Braket, TestTokenMetas.List]);
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

            it('-- At end', () => {
                // Setup.
                const lLexer: Lexer<TestTokenType> = lInitTestLexer();
                lLexer.errorType = TestTokenType.Error;
    
                // Setup. Text.
                const lErrorText = 'An Error at end ////';
    
                // Process.
                const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lErrorText)];
    
                // Evaluation
                expect(lTokenList).has.lengthOf(5);
    
                // Error token ////
                expect(lTokenList[4]).property('value').to.equal('////');
                expect(lTokenList[4]).property('type').to.equal(TestTokenType.Error);
                expect(lTokenList[4]).property('lineNumber').to.equal(1);
                expect(lTokenList[4]).property('columnNumber').to.equal(17);
                expect(lTokenList[4]).property('metas').to.deep.equal([]);
            });
        });

        it('-- Combined types', () => {
            // Setup.
            const lLexer: Lexer<'aaa' | 'bbb'> = new Lexer<'aaa' | 'bbb'>();
            lLexer.addTokenPattern({
                pattern: {
                    regex: /(?<aaa>aaa)|(?<bbb>bbb)/,
                    type: {
                        aaa: 'aaa',
                        bbb: 'bbb',
                    }
                },
                specificity: 1
            });

            // Process.
            const lTokenList: Array<LexerToken<'aaa' | 'bbb'>> = [...lLexer.tokenize('bbbaaa')];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal('bbb');
            expect(lTokenList[1]).property('type').to.equal('aaa');
        });

        it('-- Validate full matches', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            lLexer.addTokenPattern({
                pattern: {
                    regex: /(?<aaa>aaa)bbb/,
                    type: {
                        aaa: TestTokenType.Custom
                    }
                },
                specificity: 1
            });

            // Process.
            const lErrorFunction = () => {
                [...lLexer.tokenize('aaabbb')];
            };

            // Evaluation.
            expect(lErrorFunction).to.throw('A group of a token pattern must match the whole token.');
        });

        it('-- Invalid type group names.', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            lLexer.addTokenPattern({
                pattern: {
                    regex: /(?<aaa>aaa)/,
                    type: {
                        bbb: TestTokenType.Custom
                    }
                },
                specificity: 1
            });

            // Process.
            const lErrorFunction = () => {
                [...lLexer.tokenize('aaa')];
            };

            // Evaluation.
            expect(lErrorFunction).to.throw('No token type for any defined pattern regex group was found.');
        });

        it('-- Has meta check', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            lLexer.addTokenPattern({ pattern: { regex: /1/, type: TestTokenType.Number }, specificity: 0, meta: TestTokenMetas.Number });

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize('1')];

            // Evaluation. 'A sentence with 1 or 10 words (Braket and \nnewline)'
            expect(lTokenList[0].hasMeta(TestTokenMetas.Number)).to.be.true;
        });

        it('-- Nested token cant find closing token', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = lInitTestLexer();
            const lTestString: string = '(Start without end';

            // Process.
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize(lTestString)];

            // Evaluation.
            expect(lTokenList).to.has.lengthOf(4);
            expect(lTokenList[3]).property('metas').to.deep.equal([TestTokenMetas.Braket, TestTokenMetas.List, TestTokenMetas.Word]);
        });
    });

    describe('Method: useTokenTemplate', () => {
        it('-- Use valid', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            const lTemplateName: string = 'TokenTemplateName';

            lLexer.addTokenTemplate(lTemplateName, { pattern: { regex: /./, type: TestTokenType.Word } });

            // Process.
            const lSuccessFunction = () => {
                lLexer.useTokenTemplate(lTemplateName, 0);
            };

            // Evaluation.
            expect(lSuccessFunction).to.not.throw();
        });

        it('-- Non existing pattern.', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            const lTemplateName: string = 'TokenTemplateName';

            // Process.
            const lErrorFunction = () => {
                lLexer.useTokenTemplate(lTemplateName, 0);
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(`Lexer template "${lTemplateName}" does not exist.`);
        });

        it('-- Override specificity', () => {
            // Setup.
            const lLexer: Lexer<TestTokenType> = new Lexer<TestTokenType>();
            lLexer.addTokenPattern({ pattern: { regex: /./, type: TestTokenType.Word }, specificity: 1 });

            // Setup. Add template
            const lTemplateName: string = 'TokenTemplateName';
            lLexer.addTokenTemplate(lTemplateName, { pattern: { regex: /aaa/, type: TestTokenType.Custom } });

            // Process.
            lLexer.useTokenTemplate(lTemplateName, 0);
            const lTokenList: Array<LexerToken<TestTokenType>> = [...lLexer.tokenize('aaa')];

            // Evaluation.
            expect(lTokenList[0]).property('type').to.equal(TestTokenType.Custom);
        });
    });
});