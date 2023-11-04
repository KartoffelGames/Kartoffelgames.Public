import { expect } from 'chai';
import { CodeParser } from '../../source/code-parser';
import { Lexer } from '../../source/lexer';
import { GrammarSingleNode } from '../../source/graph/node/grammer-single-node';
import { GraphPart } from '../../source/graph/part/graph-part';
import { BaseGrammarNode } from '../../source/graph/node/base-grammar-node';
import { AnonymoutGrammarNode } from '../../source/graph/node/anonymous-grammar-node';
import { GrammarBranchNode } from '../../source/graph/node/grammer-branch-node';
import { GrammarLoopNode } from '../../source/graph/node/grammer-loop-node';
import { GraphPartReference } from '../../source/graph/part/graph-part-reference';
import { Exception } from '@kartoffelgames/core.data';

describe('CodeParser', () => {
    enum TokenType {
        Identifier = 'Identifier',
        Modifier = 'Modifier',
        Assignment = 'Assignment',
        TypeDelimiter = 'TypeDelimiter',
        Semicolon = 'Semicolon',
        String = 'String',
        Number = 'Number'
    }

    const lCreateLexer = (): Lexer<TokenType> => {
        const lLexter = new Lexer<TokenType>();
        lLexter.addTokenPattern(/const/, TokenType.Modifier, 0);
        lLexter.addTokenPattern(/=/, TokenType.Assignment, 1);
        lLexter.addTokenPattern(/[a-zA-Z]+/, TokenType.Identifier, 2);
        lLexter.addTokenPattern(/:/, TokenType.TypeDelimiter, 2);
        lLexter.addTokenPattern(/;/, TokenType.Semicolon, 2);
        lLexter.addTokenPattern(/[0-9]+/, TokenType.Number, 2);
        lLexter.addTokenPattern(/".*?"/, TokenType.String, 2);

        lLexter.validWhitespaces = ' \n\t\r';
        lLexter.trimWhitespace = true;

        return lLexter;
    };

    describe('Method: defineGraphPart', () => {
        it('-- Define default without collector', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            lParser.defineGraphPart('branch',
                lParser.graph().single(TokenType.Modifier, 'modifier')
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
                lParser.graph().single(TokenType.Modifier, 'modifier'),
                lDataCollector
            );

            // Evaluation.
            expect(lParser.getGraphPart('branch')).has.property('graph').and.be.instanceOf(GrammarSingleNode);
            expect(lParser.getGraphPart('branch')).has.property('dataCollector').and.equal(lDataCollector);
        });
    });

    describe('Method: getGraphPart', () => {
        it('-- Read part', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            lParser.defineGraphPart('branch',
                lParser.graph().single(TokenType.Modifier, 'modifier')
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

        it('-- Create with chaining single', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            const lGraph: BaseGrammarNode<TokenType> = lParser.graph().single(TokenType.Assignment);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarSingleNode);
        });

        it('-- Create with chaining branch', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            const lGraph: BaseGrammarNode<TokenType> = lParser.graph().branch(null, [TokenType.Assignment]);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarBranchNode);
        });

        it('-- Create with chaining loop', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            const lGraph: BaseGrammarNode<TokenType> = lParser.graph().loop(null, TokenType.Assignment);

            // Evaluation.
            expect(lGraph).be.instanceOf(GrammarLoopNode);
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
        it('-- Linear Parsing no optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lCodeText: string = 'const name: number;';

            // Setup. Define graph part and set as root.
            lParser.defineGraphPart('LinearCode',
                lParser.graph().single(TokenType.Modifier, 'modifier').single(TokenType.Identifier, 'variableName').single(TokenType.TypeDelimiter).single(TokenType.Identifier, 'typeName').single(TokenType.Semicolon),
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
                lParser.graph().single(TokenType.Modifier, 'modifier').single(TokenType.Identifier, 'variableName').single(TokenType.TypeDelimiter).single(TokenType.Identifier, 'typeName').optional(TokenType.Semicolon),
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
                    lParser.graph().single(TokenType.Identifier, 'required'),
                    lParser.graph().optional(TokenType.Number, 'optional')
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
                    lParser.graph().optional(TokenType.Identifier, 'optional')
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
                    lParser.graph().single(TokenType.Modifier, 'optional')
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
                    lParser.graph().single(TokenType.Identifier, 'optional')
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

        it('-- Loop Parsing with missing items', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
            const lCodeText: string = 'const';

            // Setup. Define graph part and set as root.
            lParser.defineGraphPart('LoopCode',
                lParser.graph().single(TokenType.Modifier).loop('data', TokenType.Identifier),
                (pData: any) => {
                    return pData;
                }
            );
            lParser.setRootGraphPart('LoopCode');

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText);

            // Evaluation.
            expect(lParsedData).has.property('data').and.deep.equals([]);
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
});