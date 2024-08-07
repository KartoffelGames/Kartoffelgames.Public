import { Exception } from '@kartoffelgames/core';
import { expect } from 'chai';
import { CodeParser } from '../../source/code-parser';
import { AnonymoutGrammarNode } from '../../source/graph/node/anonymous-grammar-node';
import { BaseGrammarNode } from '../../source/graph/node/base-grammar-node';
import { GrammarLoopNode } from '../../source/graph/node/grammer-loop-node';
import { GrammarSingleNode } from '../../source/graph/node/grammer-single-node';
import { GraphPart } from '../../source/graph/part/graph-part';
import { GraphPartReference } from '../../source/graph/part/graph-part-reference';
import { Lexer } from '../../source/lexer/lexer';
import { ParserException } from '../../source/exception/parser-exception';

describe('CodeParser', () => {
    enum TokenType {
        Identifier = 'Identifier',
        Modifier = 'Modifier',
        Assignment = 'Assignment',
        TypeDelimiter = 'TypeDelimiter',
        Semicolon = 'Semicolon',
        String = 'String',
        Number = 'Number',
        Custom = 'Custom'
    }

    const lCreateLexer = (): Lexer<TokenType> => {
        const lLexer = new Lexer<TokenType>();

        // Add token patterns
        lLexer.addTokenPattern({ pattern: { regex: /const/, type: TokenType.Modifier }, specificity: 0 });
        lLexer.addTokenPattern({ pattern: { regex: /=/, type: TokenType.Assignment }, specificity: 1 });
        lLexer.addTokenPattern({ pattern: { regex: /[a-zA-Z]+/, type: TokenType.Identifier }, specificity: 2 });
        lLexer.addTokenPattern({ pattern: { regex: /:/, type: TokenType.TypeDelimiter }, specificity: 2 });
        lLexer.addTokenPattern({ pattern: { regex: /;/, type: TokenType.Semicolon }, specificity: 2 });
        lLexer.addTokenPattern({ pattern: { regex: /[0-9]+/, type: TokenType.Number }, specificity: 2 });
        lLexer.addTokenPattern({ pattern: { regex: /".*?"/, type: TokenType.String }, specificity: 2 });

        // Configure whitespace handling
        lLexer.validWhitespaces = ' \n\t\r';
        lLexer.trimWhitespace = true;

        return lLexer;
    };

    it('Property: lexer', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lParser = new CodeParser<string, any>(lLexer);

        // Evaluation
        expect(lParser.lexer).to.equal(lLexer);
    });

    it('Property: maxRecursion', () => {
        // Setup
        const lParser = new CodeParser<string, any>(new Lexer<string>());
        const lRecursionValue: number = 121;

        // Process.
        lParser.maxRecursion = lRecursionValue;

        // Evaluation
        expect(lParser.maxRecursion).to.equal(lRecursionValue);
    });

    describe('Method: defineGraphPart', () => {
        it('-- Define default without collector', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            lParser.defineGraphPart('branch',
                lParser.graph().single('modifier', TokenType.Modifier)
            );

            // Evaluation.
            expect(lParser.getGraphPart('branch')).has.property('graph').and.be.instanceOf(GrammarSingleNode);
            expect(lParser.getGraphPart('branch')).has.property('dataCollector').and.be.null;
        });

        it('-- Define default with collector', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lDataCollector: any = (pData: Record<string, any>) => { return pData; };

            // Process.
            lParser.defineGraphPart('branch',
                lParser.graph().single('modifier', TokenType.Modifier),
                lDataCollector
            );

            // Evaluation.
            expect(lParser.getGraphPart('branch')).has.property('graph').and.be.instanceOf(GrammarSingleNode);
            expect(lParser.getGraphPart('branch')).has.property('dataCollector').and.equal(lDataCollector);
        });

        it('-- Duplicate graph part', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            lParser.defineGraphPart('branch', lParser.graph());
            const lErrorFunction = () => {
                lParser.defineGraphPart('branch', lParser.graph());
            };

            // Evaluation.
            expect(lErrorFunction).to.throws(Exception, /already defined/);
        });
    });

    describe('Method: getGraphPart', () => {
        it('-- Read part', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            lParser.defineGraphPart('branch',
                lParser.graph().single('modifier', TokenType.Modifier)
            );

            // Process.
            const lGraphPart: GraphPart<TokenType> = lParser.getGraphPart('branch');

            // Evaluation.
            expect(lGraphPart).has.property('graph').and.be.instanceOf(GrammarSingleNode);
            expect(lGraphPart).has.property('dataCollector').and.be.null;
        });

        it('-- Missing part', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            const lErrorFunction = () => {
                lParser.getGraphPart('branch');
            };

            // Evaluation.
            expect(lErrorFunction).to.throw(Exception);
        });
    });

    describe('Method: graph', () => {
        it('-- Create without chaining', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            const lGraph: BaseGrammarNode<TokenType> = lParser.graph();

            // Evaluation.
            expect(lGraph).be.instanceOf(AnonymoutGrammarNode);
        });

        it('-- Create with single node chain', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            const lGraph: BaseGrammarNode<TokenType> = lParser.graph().single(TokenType.Assignment);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
        });


        it('-- Create with long chaining', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            const lGraph: BaseGrammarNode<TokenType> = lParser.graph().loop(null, TokenType.Assignment).single(TokenType.Assignment);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
            expect(lGraph.branchRoot).be.instanceOf(GrammarLoopNode);
        });
    });

    describe('Method: parse', () => {
        describe('-- Linear', () => {
            it('-- Linear Parsing no optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const name: number;';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    lParser.graph().single('modifier', TokenType.Modifier).single('variableName', TokenType.Identifier).single(TokenType.TypeDelimiter).single('typeName', TokenType.Identifier).single(TokenType.Semicolon),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LinearCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('modifier').and.equals('const');
                expect(lParsedData).has.property('variableName').and.equals('name');
                expect(lParsedData).has.property('typeName').and.equals('number');
            });

            it('-- Linear Parsing with optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const name: number';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    lParser.graph().single('modifier', TokenType.Modifier).single('variableName', TokenType.Identifier).single(TokenType.TypeDelimiter).single('typeName', TokenType.Identifier).optional(TokenType.Semicolon),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LinearCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('modifier').and.equals('const');
                expect(lParsedData).has.property('variableName').and.equals('name');
                expect(lParsedData).has.property('typeName').and.equals('number');
            });

            it('-- Linear Parsing with two ending optionals without value', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const name: number';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    lParser.graph().single('modifier', TokenType.Modifier).single('variableName', TokenType.Identifier).single(TokenType.TypeDelimiter).single('typeName', TokenType.Identifier).optional(TokenType.Semicolon).optional(TokenType.Semicolon),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LinearCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('modifier').and.equals('const');
                expect(lParsedData).has.property('variableName').and.equals('name');
                expect(lParsedData).has.property('typeName').and.equals('number');
            });
        });

        describe('-- Branches', () => {
            it('-- Branch Parsing without optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeTextModifier: string = 'const';
                const lCodeTextIdentifier: string = 'notconst';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('BranchCode',
                    lParser.graph().branch('data', [
                        TokenType.Identifier,
                        TokenType.Modifier
                    ]),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('BranchCode');

                // Process. Convert code.
                const lParsedIdentifierData: any = lParser.parse(lCodeTextIdentifier);
                const lParsedModifierData: any = lParser.parse(lCodeTextModifier);

                // Evaluation.
                expect(lParsedIdentifierData).has.property('data').and.equals('notconst');
                expect(lParsedModifierData).has.property('data').and.equals('const');
            });

            it('-- Branch Parsing with existing optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeTextNumber: string = '123';
                const lCodeTextIdentifier: string = 'myname';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('BranchCode',
                    lParser.graph().branch('data', [
                        lParser.graph().single('required', TokenType.Identifier),
                        lParser.graph().optional('optional', TokenType.Number)
                    ]),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('BranchCode');

                // Process. Convert code.
                const lParsedIdentifierData: any = lParser.parse(lCodeTextIdentifier);
                const lParsedNumberData: any = lParser.parse(lCodeTextNumber);

                // Evaluation.
                expect(lParsedNumberData).has.property('data').and.deep.equals({ optional: '123' });
                expect(lParsedIdentifierData).has.property('data').and.deep.equals({ required: 'myname' });
            });

            it('-- Branch Parsing with missing optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const ;';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('BranchCode',
                    lParser.graph().single(TokenType.Modifier).branch('data', [
                        lParser.graph().optional('optional', TokenType.Identifier)
                    ]).single(TokenType.Semicolon), // Last single is needed to not get "end of statement" Exception because .branch() is not optional and needs a token to proceed.
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('BranchCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('data').and.deep.equals({});
            });

            it('-- Optional branch parsing with existing token', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('BranchCode',
                    lParser.graph().optionalBranch('data', [
                        lParser.graph().single('optional', TokenType.Modifier)
                    ]),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('BranchCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('data').and.deep.equals({ optional: 'const' });
            });

            it('-- Optional branch parsing without existing token', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('BranchCode',
                    lParser.graph().single(TokenType.Modifier).optionalBranch('data', [
                        lParser.graph().single('optional', TokenType.Identifier)
                    ]),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('BranchCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).to.deep.equals({});
            });
        });

        describe('-- Loops', () => {
            it('-- Loop Parsing with existing items', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'one two three four five';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().loop('data', TokenType.Identifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('data').and.deep.equals(['one', 'two', 'three', 'four', 'five']);
            });

            it('-- Loop Parsing with different front and back data.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const one two three four five const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().single(TokenType.Modifier).loop('data', TokenType.Identifier).single(TokenType.Modifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('data').and.deep.equals(['one', 'two', 'three', 'four', 'five']);
            });

            it('-- Loop wrapped greedy parsing.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'one two three four five';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().single('first', TokenType.Identifier).loop('data', TokenType.Identifier).single('second', TokenType.Identifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('first').and.deep.equals('one');
                expect(lParsedData).has.property('data').and.deep.equals(['two', 'three', 'four']);
                expect(lParsedData).has.property('second').and.deep.equals('five');
            });

            it('-- Loop start greedy parsing', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'one two three four five const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().single('first', TokenType.Identifier).loop('data', TokenType.Identifier).single('second', TokenType.Modifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('first').and.deep.equals('one');
                expect(lParsedData).has.property('data').and.deep.equals(['two', 'three', 'four', 'five']);
                expect(lParsedData).has.property('second').and.deep.equals('const');
            });

            it('-- Loop Parsing with missing items', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().single(TokenType.Modifier).loop('loop', TokenType.Identifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('loop').and.deep.equals([]);
            });

            it('-- Optional recursion loops', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().optional('optional', TokenType.Modifier).optional(lParser.partReference('LoopCode')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).to.deep.equal({
                    optional: lCodeText
                });
            });

            it('-- Optional recursion loops with required node in optional graph', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().optional('optional', lParser.graph().single('mod', TokenType.Modifier)).optional(lParser.partReference('LoopCode')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).to.deep.equal({
                    optional: {
                        mod: lCodeText
                    }
                });
            });

            it('-- Empty data for loops', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = '';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().loop('loop', TokenType.Identifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                expect(lParsedData).has.property('loop').and.lengthOf(0);
            });

            it('-- Empty data for nested loops into single', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = '';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().loop('loop', TokenType.Identifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('LinearCode',
                    lParser.graph().single('value', lParser.partReference('LoopCode')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LinearCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                expect(lParsedData).has.property('value').has.property('loop').and.lengthOf(0);
            });

            it('-- Loop with optional inner node.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'one five';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    lParser.graph().single('first', TokenType.Identifier).loop(lParser.graph().optional(TokenType.Modifier)).single('second', TokenType.Identifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).has.property('first').and.deep.equals('one');
                expect(lParsedData).has.property('second').and.deep.equals('five');
            });
        });

        describe('--Part references', () => {
            it('-- Reference with collector', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define additive part.
                lParser.defineGraphPart('NewPart',
                    lParser.graph().single('data', TokenType.Modifier),
                    (pData: any) => {
                        return pData.data;
                    }
                );

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    lParser.graph().optional('part', lParser.partReference('NewPart')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('StartPart');

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).to.have.property('part').to.equal(lCodeText);
            });

            it('-- Reference without collector', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define additive part without collector
                lParser.defineGraphPart('NewPart',
                    lParser.graph().single('data', TokenType.Modifier)
                );

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    lParser.graph().optional('part', lParser.partReference('NewPart')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('StartPart');

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).to.have.property('part').and.property('data').to.equal(lCodeText);
            });

            it('-- Reference as optional value with value', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define additive part.
                lParser.defineGraphPart('NewPart',
                    lParser.graph().single('data', TokenType.Modifier),
                    (pData: any) => {
                        return pData;
                    }
                );

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    lParser.graph().optional('part', lParser.partReference('NewPart')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('StartPart');

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).to.have.property('part').and.property('data');
            });

            it('-- Reference as optional value without value', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define additive part.
                lParser.defineGraphPart('NewPart',
                    lParser.graph().single('data', TokenType.Identifier),
                    (pData: any) => {
                        return pData;
                    }
                );

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    lParser.graph().single('modifier', TokenType.Modifier).optional('part', lParser.partReference('NewPart')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('StartPart');

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).to.have.property('modifier');
                expect(lResult).to.not.have.property('part');
            });

            it('-- Self reference with same data for inner and outer reference.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const const const const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    lParser.graph().single('start', TokenType.Modifier).optional('inner', lParser.partReference('StartPart')).single('end', TokenType.Modifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('StartPart');

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).to.deep.equals({
                    start: 'const',
                    inner: {
                        start: 'const',
                        end: 'const'
                    },
                    end: 'const'
                });
            });

            it('-- Self reference with different start and end data.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const const indent indent';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    lParser.graph().single('start', TokenType.Modifier).optional('inner', lParser.partReference('StartPart')).single('end', TokenType.Identifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('StartPart');

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).to.deep.equals({
                    start: 'const',
                    inner: {
                        start: 'const',
                        end: 'indent'
                    },
                    end: 'indent'
                });
            });
        });

        describe('-- Parse Graph Errors', () => {
            it('-- Parse without root part', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('Some text');
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(Exception, 'Parser has not root part set.');
            });

            it('-- Single parse error, wrong token type.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    lParser.graph().single('Something', TokenType.Number),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LinearCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(Exception, `Unexpected token. "${TokenType.Number}" expected`);
            });

            it('-- Single parse error, missing token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    lParser.graph().single(TokenType.Modifier).single('Something', TokenType.Number),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LinearCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(ParserException, `Unexpected end of statement. TokenIndex: "1" missing.`);
            });

            it('-- Single parse error, no token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = '';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    lParser.graph().single('Something', TokenType.Number),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LinearCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(ParserException, `Unexpected end of statement. TokenIndex: "0" missing.`);
            });

            it('-- Graph end meet without reaching last token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const identifier';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    lParser.graph().single('Something', TokenType.Modifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('LinearCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(Exception, `Tokens could not be parsed. Graph end meet without reaching last token. Current: "identifier" (${TokenType.Identifier})`);
            });

            it('-- Dublicate branching paths', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const identifier;';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('DublicateBranchingCode',
                    lParser.graph().branch([
                        lParser.graph().single(TokenType.Modifier).single(TokenType.Identifier),
                        lParser.graph().single(TokenType.Modifier).single(TokenType.Identifier)
                    ]).single(TokenType.Semicolon),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('DublicateBranchingCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(Exception, `Graph has ambiguity paths. Values: [\n\t{ const(Modifier) identifier(Identifier) ;(Semicolon) },\n\t{ const(Modifier) identifier(Identifier) ;(Semicolon) }\n]`);
            });

            it('-- Detect endless circular dependency over multiple references', () => {
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

                lParser.defineGraphPart('Level1',
                    lParser.graph().optional(TokenType.Modifier).single(lParser.partReference('Level2')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Level2',
                    lParser.graph().optional(TokenType.Modifier).single(lParser.partReference('Level1')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('Level1');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('identifier');
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).to.throws(Exception, `Infinite part reference recursion prevented for "Ref<Level1> -> Ref<Level2> -> Ref<Level1>`);
            });

            it('-- Detect endless circular dependency with loop', () => {
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

                lParser.defineGraphPart('Level1',
                    lParser.graph().optional(TokenType.Modifier).loop(TokenType.Identifier).single(lParser.partReference('Level1')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('Level1');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('identifier');
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).to.throws(Exception, `Infinite part reference recursion prevented for "Ref<Level1> -> Ref<Level1>`);
            });

            it('-- Detect endless circular dependency with branch', () => {
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

                lParser.defineGraphPart('Level1',
                    lParser.graph().optional(TokenType.Modifier).branch([
                        lParser.graph().optional(TokenType.Identifier),
                        lParser.graph().optional(TokenType.Number)
                    ]).single(lParser.partReference('Level1')),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('Level1');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('identifier');
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).to.throws(Exception, `Infinite part reference recursion prevented for "Ref<Level1> -> Ref<Level1>`);
            });

            it('-- Prevent duplicate paths on optional partReference with a loop', () => {
                // Setup. Init lexer.
                const lLexer = new Lexer<string>();
                lLexer.trimWhitespace = true;
                lLexer.validWhitespaces = ' ';
                lLexer.addTokenPattern({ pattern: { regex: /@/, type: '@' }, specificity: 0 });
                lLexer.addTokenPattern({ pattern: { regex: /a/, type: 'a' }, specificity: 0 });
                lLexer.addTokenPattern({ pattern: { regex: /;/, type: ';' }, specificity: 0 });
                lLexer.addTokenPattern({ pattern: { regex: /1/, type: '1' }, specificity: 0 });

                // Setup. Init grapth.
                const lParser: CodeParser<string, any> = new CodeParser(lLexer);
                lParser.defineGraphPart('List', lParser.graph()
                    .loop('list', lParser.graph().single('@')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Graph', lParser.graph()
                    .optional('list', lParser.partReference('List'))
                    .single('type', 'a')
                    .branch([
                        ';',
                        lParser.graph().single('1').single(';')
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('Graph');

                // Process
                const lResult: any = lParser.parse('a1;');

                // Evaluation.
                expect(lResult).to.deep.equal({ type: 'a' });
            });

            it('-- Prevent circular detection on infinit depths with exit token first', () => {
                // Setup. Init lexer.
                const lLexer = new Lexer<string>();
                lLexer.trimWhitespace = true;
                lLexer.validWhitespaces = ' ';
                lLexer.addTokenPattern({ pattern: { regex: /[abc]/, type: 'ident' }, specificity: 0 });
                lLexer.addTokenPattern({ pattern: { regex: /[+-]/, type: 'operator' }, specificity: 0 });

                // Setup. Init grapth.
                const lParser: CodeParser<string, any> = new CodeParser(lLexer);
                lParser.defineGraphPart('Variable', lParser.graph()
                    .single('variable', 'ident'),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Addition', lParser.graph()
                    .single('left', lParser.partReference('Expression'))
                    .single('operator')
                    .single('right', lParser.partReference('Expression')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Expression', lParser.graph()
                    .branch('expression', [
                        lParser.partReference('Variable'),
                        lParser.partReference('Addition')
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('Expression');

                // Process
                const lResult: any = lParser.parse('a + b - c');

                // Evaluation.
                expect(lResult).to.deep.equal({
                    expression: {
                        left: {
                            expression: {
                                variable: 'a'
                            }
                        },
                        right: {
                            expression: {
                                left: {
                                    expression: {
                                        variable: 'b'
                                    }
                                },
                                right: {
                                    expression: {
                                        variable: 'c'
                                    }
                                },
                            }
                        },
                    }
                });
            });

            it('-- Prevent circular detection on infinit depths with exit token last', () => {
                // Setup. Init lexer.
                const lLexer = new Lexer<string>();
                lLexer.trimWhitespace = true;
                lLexer.validWhitespaces = ' ';
                lLexer.addTokenPattern({ pattern: { regex: /[abc]/, type: 'ident' }, specificity: 0 });
                lLexer.addTokenPattern({ pattern: { regex: /[+-]/, type: 'operator' }, specificity: 0 });

                // Setup. Init grapth.
                const lParser: CodeParser<string, any> = new CodeParser(lLexer);
                lParser.defineGraphPart('Variable', lParser.graph()
                    .single('variable', 'ident'),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Addition', lParser.graph()
                    .single('left', lParser.partReference('Expression'))
                    .single('operator')
                    .single('right', lParser.partReference('Expression')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Expression', lParser.graph()
                    .branch('expression', [
                        lParser.partReference('Addition'),
                        lParser.partReference('Variable')
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('Expression');

                // Process
                const lResult: any = lParser.parse('a + b - c');

                // Evaluation.
                expect(lResult).to.deep.equal({
                    expression: {
                        left: {
                            expression: {
                                variable: 'a'
                            }
                        },
                        right: {
                            expression: {
                                left: {
                                    expression: {
                                        variable: 'b'
                                    }
                                },
                                right: {
                                    expression: {
                                        variable: 'c'
                                    }
                                },
                            }
                        },
                    }
                });
            });

            it('-- Prevent circular detection on infinit depths with optional branching', () => {
                // Setup. Init lexer.
                const lLexer = new Lexer<string>();
                lLexer.trimWhitespace = true;
                lLexer.validWhitespaces = ' ';
                lLexer.addTokenPattern({ pattern: { regex: /[abc]/, type: 'ident' }, specificity: 0 });
                lLexer.addTokenPattern({ pattern: { regex: /[+-]/, type: 'operator' }, specificity: 0 });

                // Setup. Init grapth.
                const lParser: CodeParser<string, any> = new CodeParser(lLexer);
                lParser.defineGraphPart('Variable', lParser.graph()
                    .single('variable', 'ident'),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Optional', lParser.graph()
                    .optional('optional')
                    .single('expression', lParser.partReference('Expression')),
                    (pData) => {
                        return pData.expression;
                    }
                );
                lParser.defineGraphPart('Addition', lParser.graph()
                    .single('left', lParser.partReference('Expression'))
                    .single('operator')
                    .single('right', lParser.partReference('Expression')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Expression', lParser.graph()
                    .branch('expression', [
                        lParser.partReference('Optional'),
                        lParser.partReference('Addition'),
                        lParser.partReference('Variable')
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart('Expression');

                // Process
                const lResult: any = lParser.parse('a + b - c');

                // Evaluation.
                expect(lResult).to.deep.equal({
                    expression: {
                        left: {
                            expression: {
                                variable: 'a'
                            }
                        },
                        right: {
                            expression: {
                                left: {
                                    expression: {
                                        variable: 'b'
                                    }
                                },
                                right: {
                                    expression: {
                                        variable: 'c'
                                    }
                                },
                            }
                        },
                    }
                });
            });
        });

        describe('-- Identifier errors.', () => {
            it('-- Graph has dublicate single value identifier', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lPartName: string = 'DublicateValueIdentifierPart';
                lParser.defineGraphPart(lPartName,
                    lParser.graph().single('Something', TokenType.Modifier).single('Something', TokenType.Modifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart(lPartName);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const const');
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(Exception, `Graph path has a dublicate value identifier "Something"`);
            });

            it('-- Graph has dublicate list value identifier. With existing single identifier.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lPartName: string = 'DublicateValueIdentifierPart';
                lParser.defineGraphPart(lPartName,
                    lParser.graph().loop('Something', TokenType.Modifier).single('Something', TokenType.Modifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart(lPartName);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const const');
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(Exception, `Graph path has a dublicate value identifier "Something" that is not a list value but should be.`);
            });

            it('-- Not completing to end and failing on the first token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lPartName: string = 'FailingToEnd';
                lParser.defineGraphPart(lPartName,
                    lParser.graph().optional(TokenType.Modifier),
                    (pData: any) => {
                        return pData;
                    }
                );
                lParser.setRootGraphPart(lPartName);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('Notconst');
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(Exception, `Tokens could not be parsed. Graph end meet without reaching last token. Current: "Notconst" (${TokenType.Identifier})`);
            });
        });

        describe('-- Data collector errors.', () => {
            it('-- Keep error messages of error objects', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    lParser.graph().single(TokenType.Modifier),
                    () => {
                        throw new Error(lErrorMessage);
                    }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(ParserException, lErrorMessage);
            });

            it('-- Keep error messages of string', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    lParser.graph().single(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                expect(lErrorFunction).to.throws(ParserException, lErrorMessage);
            });

            it('-- Error positions single token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    lParser.graph().single(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                const lException = expect(lErrorFunction).to.throws(ParserException);
                lException.with.property('columnStart', 1);
                lException.with.property('columnEnd', 6);
                lException.with.property('lineStart', 1);
                lException.with.property('lineEnd', 1);
            });

            it('-- Error positions chained token without newline.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    lParser.graph().single(TokenType.Modifier).single(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const const');
                };

                // Evaluation.
                const lException = expect(lErrorFunction).to.throws(ParserException);
                lException.with.property('columnStart', 1);
                lException.with.property('columnEnd', 12);
                lException.with.property('lineStart', 1);
                lException.with.property('lineEnd', 1);
            });

            it('-- Error rethrow on parser erro.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lError: ParserException<any> = new ParserException('', null, 2, 3, 4, 5);
                lParser.defineGraphPart('PartName',
                    lParser.graph().single(TokenType.Modifier),
                    () => {
                        throw lError;
                    }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                const lException = expect(lErrorFunction).to.throws(ParserException);
                lException.equal(lError);
            });

            it('-- Error positions chained token with newline.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    lParser.graph().single(TokenType.Modifier).single(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const\nconst');
                };

                // Evaluation.
                const lException = expect(lErrorFunction).to.throws(ParserException);
                lException.with.property('columnStart', 1);
                lException.with.property('columnEnd', 6);
                lException.with.property('lineStart', 1);
                lException.with.property('lineEnd', 2);
            });

            it('-- Error positions with only optional token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    lParser.graph().optional(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('');
                };

                // Evaluation.
                const lException = expect(lErrorFunction).to.throws(ParserException, lErrorMessage);
                lException.with.property('columnStart', 1);
                lException.with.property('columnEnd', 1);
                lException.with.property('lineStart', 1);
                lException.with.property('lineEnd', 1);
            });

            it('-- Error positions with no parse data.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                lParser.defineGraphPart('PartName',
                    lParser.graph().single(TokenType.Modifier),
                    () => {
                        return {};
                    }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('');
                };

                // Evaluation.
                const lException = expect(lErrorFunction).to.throws(ParserException);
                lException.with.property('columnStart', 1);
                lException.with.property('columnEnd', 1);
                lException.with.property('lineStart', 1);
                lException.with.property('lineEnd', 1);
            });

            it('-- Multi error after line break.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                lParser.defineGraphPart('PartName',
                    lParser.graph().branch([
                        lParser.graph().single(TokenType.Modifier).single(TokenType.Semicolon),
                        lParser.graph().single(TokenType.Modifier).single(TokenType.Identifier).single(TokenType.Semicolon),
                    ]),
                    () => { }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const \nidentifier error');
                };

                // Evaluation.
                const lException = expect(lErrorFunction).to.throws(ParserException);
                lException.with.property('columnStart', 12);
                lException.with.property('columnEnd', 17);
                lException.with.property('lineStart', 2);
                lException.with.property('lineEnd', 2);
            });

            it('-- Error with an multiline token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                lParser.lexer.addTokenPattern({ pattern: { regex: /new\nline/, type: TokenType.Custom }, specificity: 0 });

                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    lParser.graph().single(TokenType.Modifier).single(TokenType.Identifier).single(TokenType.Semicolon),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraphPart('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const identifier new\nline');
                };

                // Evaluation.
                const lException = expect(lErrorFunction).to.throws(ParserException);
                lException.with.property('columnStart', 18);
                lException.with.property('columnEnd', 5);
                lException.with.property('lineStart', 1);
                lException.with.property('lineEnd', 2);
            });
        });
    });

    it('Method: partReference', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

        // Process.
        const lReference: GraphPartReference<TokenType> = lParser.partReference('Part');

        // Define and read part after reference creation.
        lParser.defineGraphPart('Part', lParser.graph());
        const lOriginalPart = lParser.getGraphPart('Part');

        // Evaluation.
        expect(lReference.resolveReference()).to.equal(lOriginalPart);
    });

    describe('Method: setRootGraphPart', () => {
        it('-- Set root part', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lPartName: string = 'Part';

            // Process.
            lParser.defineGraphPart(lPartName, lParser.graph(), () => { });

            // Evaluation.
            lParser.setRootGraphPart(lPartName);
        });

        it('-- Set root part with invalid part name', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lPartName: string = 'Part';

            // Process.
            const lErrorFunction = () => {
                lParser.setRootGraphPart(lPartName);
            };

            // Evaluation.
            expect(lErrorFunction).to.throws(`Path part "${lPartName}" not defined.`);
        });

        it('-- Set root part with missing data collector', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lPartName: string = 'Part';
            lParser.defineGraphPart(lPartName, lParser.graph());

            // Process.
            const lErrorFunction = () => {
                lParser.setRootGraphPart(lPartName);
            };

            // Evaluation.
            expect(lErrorFunction).to.throws(`A root graph part needs a defined data collector.`);
        });
    });
});