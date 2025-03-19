import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { CodeParserException } from "../source/exception/code-parser-exception.ts";
import { GraphNode } from '../source/graph/graph-node.ts';
import { Graph } from '../source/graph/graph.ts';
import { Lexer } from '../source/lexer/lexer.ts';
import { CodeParser } from '../source/parser/code-parser.ts';

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
        lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /const/, type: TokenType.Modifier } }));
        lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /=/, type: TokenType.Assignment } }));
        lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[a-zA-Z]+/, type: TokenType.Identifier } }));
        lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /:/, type: TokenType.TypeDelimiter } }));
        lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /;/, type: TokenType.Semicolon } }));
        lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[0-9]+/, type: TokenType.Number } }));
        lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /".*?"/, type: TokenType.String } }));

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
        expect(lParser.lexer).toBe(lLexer);
    });

    it('Property: maxRecursion', () => {
        // Setup
        const lParser = new CodeParser<string, any>(new Lexer<string>());
        const lRecursionValue: number = 121;

        // Process.
        lParser.maxRecursion = lRecursionValue;

        // Evaluation
        expect(lParser.maxRecursion).toBe(lRecursionValue);
    });

    describe('Method: parse', () => {
        describe('-- Linear', () => {
            it('-- Linear Parsing no optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const name: number;';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).required(TokenType.Semicolon);
                });

                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('modifier', 'const');
                expect(lParsedData).toHaveProperty('variableName', 'name');
                expect(lParsedData).toHaveProperty('typeName', 'number');
            });

            it('-- Linear Parsing with optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const name: number';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).optional(TokenType.Semicolon);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('modifier', 'const');
                expect(lParsedData).toHaveProperty('variableName', 'name');
                expect(lParsedData).toHaveProperty('typeName', 'number');
            });

            it('-- Linear Parsing with two ending optionals without value', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const name: number';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).optional(TokenType.Semicolon).optional(TokenType.Semicolon);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('modifier', 'const');
                expect(lParsedData).toHaveProperty('variableName', 'name');
                expect(lParsedData).toHaveProperty('typeName', 'number');
            });
        });

        describe('-- Branches', () => {
            it('-- Branch Parsing without optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeTextModifier: string = 'const';
                const lCodeTextIdentifier: string = 'notconst';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('data', [
                        TokenType.Identifier,
                        TokenType.Modifier
                    ]);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedIdentifierData: any = lParser.parse(lCodeTextIdentifier);
                const lParsedModifierData: any = lParser.parse(lCodeTextModifier);

                // Evaluation.
                expect(lParsedIdentifierData).toHaveProperty('data', 'notconst');
                expect(lParsedModifierData).toHaveProperty('data', 'const');
            });

            it('-- Branch Parsing with existing optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeTextNumber: string = '123';
                const lCodeTextIdentifier: string = 'myname';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('data', [
                        GraphNode.new<TokenType>().required('required', TokenType.Identifier),
                        GraphNode.new<TokenType>().optional('optional', TokenType.Number)
                    ]);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedIdentifierData: any = lParser.parse(lCodeTextIdentifier);
                const lParsedNumberData: any = lParser.parse(lCodeTextNumber);

                // Evaluation.
                expect(lParsedNumberData).toHaveProperty('data');
                expect(lParsedNumberData.data).toBeDeepEqual({ optional: '123' });
                expect(lParsedIdentifierData).toHaveProperty('data');
                expect(lParsedIdentifierData.data).toBeDeepEqual({ required: 'myname' });
            });

            it('-- Branch Parsing with missing optionals', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const ;';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier).required('data', [
                        GraphNode.new<TokenType>().optional('optional', TokenType.Identifier)
                    ]).required(TokenType.Semicolon);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('data');
                expect(lParsedData.data).toBeDeepEqual({});
            });

            it('-- Optional branch parsing with existing token', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().optional('data', [
                        GraphNode.new<TokenType>().required('optional', TokenType.Modifier)
                    ]);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('data');
                expect(lParsedData.data).toBeDeepEqual({ optional: 'const' });
            });

            it('-- Optional branch parsing without existing token', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier).optional('data', [
                        GraphNode.new<TokenType>().required('optional', TokenType.Identifier)
                    ]);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toBeDeepEqual({});
            });
        });

        describe('-- Loops', () => {
            it('-- Loop Parsing with existing items', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'one two three four five';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, { data: Array<string>; }> = lMainGraph;
                    return GraphNode.new<TokenType>().required('data[]', TokenType.Identifier).optional('data<-data', lSelfReference);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('data');
                expect(lParsedData.data).toBeDeepEqual(['one', 'two', 'three', 'four', 'five']);
            });

            it('-- Loop Parsing with different front and back data.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const one two three four five const';

                // Setup. Define graph part and set as root.
                const lLoopGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, { data: Array<string>; }> = lLoopGraph;
                    return GraphNode.new<TokenType>().required('data[]', TokenType.Identifier).optional('data<-data', lSelfReference);
                });
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier).required('data<-data', lLoopGraph).required(TokenType.Modifier);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('data');
                expect(lParsedData.data).toBeDeepEqual(['one', 'two', 'three', 'four', 'five']);
            });

            it('-- Loop start greedy parsing', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'one two three four five const';

                // Setup. Define graph part and set as root.
                const lLoopGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, { data: Array<string>; }> = lLoopGraph;
                    return GraphNode.new<TokenType>().required('data[]', TokenType.Identifier).optional('data<-data', lSelfReference);
                });
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('first', TokenType.Identifier).required('data<-data', lLoopGraph).required('second', TokenType.Modifier);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('first', 'one');
                expect(lParsedData).toHaveProperty('data');
                expect(lParsedData.data).toBeDeepEqual(['two', 'three', 'four', 'five']);
                expect(lParsedData).toHaveProperty('second', 'const');
            });

            it('-- Loop Parsing with missing items', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                const lLoopGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, { data: Array<string>; }> = lLoopGraph;
                    return GraphNode.new<TokenType>().required('data[]', TokenType.Identifier).optional('data<-data', lSelfReference);
                });
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier).optional('loop<-data', lLoopGraph);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('loop');
                expect(lParsedData.loop).toBeDeepEqual([]);
            });

            it('-- Optional recursion loops', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, { optional?: string; }> = lMainGraph;
                    return GraphNode.new<TokenType>().optional('optional', TokenType.Modifier).optional(lSelfReference);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toBeDeepEqual({
                    optional: lCodeText
                });
            });

            it('-- Optional recursion loops with required node in optional graph', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, { optional?: { mod: string; }; }> = lMainGraph;
                    return GraphNode.new<TokenType>().optional('optional', GraphNode.new<TokenType>().required('mod', TokenType.Modifier)).optional(lSelfReference);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toBeDeepEqual({
                    optional: {
                        mod: lCodeText
                    }
                });
            });
        });

        describe('--Part references', () => {
            it('-- Reference with collector', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define additive part.
                const lLoopGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('data', TokenType.Modifier);
                }).converter((pData) => {
                    return pData.data;
                });

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().optional('part', lLoopGraph);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).toHaveProperty('part', lCodeText);
            });

            it('-- Reference without collector', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define additive part without collector
                const lModifierGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('data', TokenType.Modifier);
                });

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().optional('part', lModifierGraph);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).toHaveProperty('part');
                expect(lResult.part).toHaveProperty('data', lCodeText);
            });

            it('-- Reference as optional value with value', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define additive part.
                const lModifierGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('data', TokenType.Modifier);
                });

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().optional('part', lModifierGraph);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).toHaveProperty('part');
                expect(lResult.part).toHaveProperty('data');
            });

            it('-- Reference as optional value without value', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define additive part.
                const lIdentifierGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('data', TokenType.Identifier);
                });

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).optional('part', lIdentifierGraph);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).toHaveProperty('modifier');
                expect(lResult).not.toHaveProperty('part');
            });

            it('-- Optional self reference fail when not on end of graph', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const const const const';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, any> = lMainGraph;
                    return GraphNode.new<TokenType>().required('start', TokenType.Modifier).optional('inner', lSelfReference).required('end', TokenType.Modifier);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).toThrow('Unexpected end of statement. Token "Modifier" expected.');
            });

            it('-- Required self reference fail when not on end of graph', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const const const const';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, any> = lMainGraph;
                    return GraphNode.new<TokenType>().required('start', TokenType.Modifier).required('inner', lSelfReference).required('end', TokenType.Modifier);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).toThrow('Unexpected end of statement. Token "Modifier" expected.');
            });

            it('-- Self reference with different start and end data.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const const indent indent';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, any> = lMainGraph;
                    return GraphNode.new<TokenType>().required('start', TokenType.Modifier).optional('inner', lSelfReference).required('end', TokenType.Identifier);
                });
                lParser.setRootGraph(lMainGraph);

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).toBeDeepEqual({
                    start: 'const',
                    inner: {
                        start: 'const',
                        end: 'indent'
                    },
                    end: 'indent'
                });
            });

            it('-- Wide references in loops', () => {
                // Setup Type
                type XmlToken = 'VALUE' | 'OPENBRACKET' | 'IDENTIFIER' | 'CLOSEBRACKET' | 'OPENCLOSINGBRACKET';

                // Setup. Lexer
                const lLexer: Lexer<XmlToken> = new Lexer<XmlToken>();
                lLexer.validWhitespaces = ' \n';
                lLexer.trimWhitespace = true;
                {
                    const lIdentifier = lLexer.createTokenPattern({ pattern: { regex: /[^<>\s\n/:="]+/, type: 'IDENTIFIER' } });
                    const lExplicitValue = lLexer.createTokenPattern({ pattern: { regex: /"[^"]*"/, type: 'VALUE' } });
                    const lOpeningBracket = lLexer.createTokenPattern({
                        pattern: {
                            start: {
                                regex: /<\//,
                                type: 'OPENCLOSINGBRACKET'
                            },
                            end: {
                                regex: />/,
                                type: 'CLOSEBRACKET'
                            }
                        }
                    }, () => {
                        lLexer.useTokenPattern(lIdentifier);
                    });
                    const lClosingBracket = lLexer.createTokenPattern({
                        pattern: {
                            start: {
                                regex: /</,
                                type: 'OPENBRACKET'
                            },
                            end: {
                                regex: />/,
                                type: 'CLOSEBRACKET'
                            }
                        }
                    }, () => {
                        lLexer.useTokenPattern(lIdentifier);
                        lLexer.useTokenPattern(lExplicitValue);
                    });
                    lLexer.useTokenPattern(lOpeningBracket);
                    lLexer.useTokenPattern(lClosingBracket);
                    lLexer.useTokenPattern(lExplicitValue);
                    lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[^<>"]+/, type: 'VALUE' } }));
                }

                // Setup. Graphs.
                const lTextNodeGraph = Graph.define(() => {
                    return GraphNode.new<XmlToken>().required('text', 'VALUE');
                });
                const lXmlElementGraph = Graph.define(() => {
                    const lLoopedContentGraph: Graph<XmlToken, any, any> = lContentListGraph;

                    return GraphNode.new<XmlToken>()
                        .required('OPENBRACKET')
                        .required('IDENTIFIER')
                        .required(GraphNode.new<XmlToken>()
                            .required('CLOSEBRACKET')
                            .optional(lLoopedContentGraph)
                            .required('OPENCLOSINGBRACKET')
                            .required('IDENTIFIER').required('CLOSEBRACKET')
                        );
                });
                const lContentListGraph = Graph.define(() => {
                    const lSelfReference: Graph<XmlToken, any, any> = lContentListGraph;

                    return GraphNode.new<XmlToken>().required('list[]', [
                        lXmlElementGraph,
                        lTextNodeGraph,
                    ]).optional('list[]', lSelfReference);
                });
                const lXmlDocumentGraph = Graph.define(() => {
                    return GraphNode.new<XmlToken>().optional('content[]', lContentListGraph);
                });

                // Setup. Parser.
                const lParser = new CodeParser<XmlToken, any>(lLexer);
                lParser.setRootGraph(lXmlDocumentGraph);

                // Process.
                const lFunction = () => {
                    lParser.parse(`MyText"MyOtherText"<quotation>"AnotherText"</quotation>`);
                };

                // Evaluation.
                expect(lFunction).not.toThrow();
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
                expect(lErrorFunction).toThrow('Parser has not root part set.');
            });

            it('-- Single parse error, wrong token type.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('Something', TokenType.Number);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Unexpected token "const". "${TokenType.Number}" expected`);
            });

            it('-- Single parse error, missing token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier).required('Something', TokenType.Number);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Unexpected end of statement. Token "Number" expected.`);
            });

            it('-- Single parse error, no token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = '';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('Something', TokenType.Number);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Unexpected end of statement. Token "Number" expected.`);
            });

            it('-- Graph end meet without reaching last token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const identifier';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('Something', TokenType.Modifier);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Tokens could not be parsed. Graph end meet without reaching last token. Current: "identifier" (${TokenType.Identifier})`);
            });

            it('-- Dublicate branchings paths takes the first', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const identifier;';

                // Setup. Define graph part and set as root.
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('data', [
                        GraphNode.new<TokenType>().required('one', TokenType.Modifier).required('name', TokenType.Identifier),
                        GraphNode.new<TokenType>().required('two', TokenType.Modifier).required('name', TokenType.Identifier)
                    ]).required(TokenType.Semicolon);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lResult = lParser.parse(lCodeText);

                // Evaluation.
                expect(lResult).toBeDeepEqual({
                    data: {
                        one: 'const',
                        name: 'identifier'
                    }
                });
            });

            it('-- Detect endless circular dependency over multiple references.', () => {
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

                const lLevel1Graph = Graph.define(() => {
                    const lLevel2GraphReference: Graph<TokenType, any> = lLevel2Graph;
                    return GraphNode.new<TokenType>().optional(TokenType.Modifier).required(lLevel2GraphReference);
                });
                const lLevel2Graph = Graph.define(() => {
                    return GraphNode.new<TokenType>().optional(TokenType.Modifier).required(lLevel1Graph);
                });
                lParser.setRootGraph(lLevel1Graph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('identifier');
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).toThrow(`Circular graph detected.`);
            });

            it('-- Detect endless circular dependency with branch.', () => {
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

                const lLoopGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, any> = lLoopGraph;
                    return GraphNode.new<TokenType>().optional(TokenType.Modifier).required([
                        GraphNode.new<TokenType>().optional(TokenType.Identifier),
                        GraphNode.new<TokenType>().optional(TokenType.Number)
                    ]).required(lSelfReference);
                });
                lParser.setRootGraph(lLoopGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('identifier');
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).toThrow(`Circular graph detected.`);
            });

            it('-- Add data from empty loop node.', () => {
                // Setup. Init lexer.
                const lLexer = new Lexer<string>();
                lLexer.trimWhitespace = true;
                lLexer.validWhitespaces = ' ';
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /@/, type: '@' } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /a/, type: 'a' } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /;/, type: ';' } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /1/, type: '1' } }));

                // Setup. Init grapth.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().optional('list', GraphNode.new<TokenType>().optional('innerList[]', TokenType.Identifier)).required('type', TokenType.Modifier);
                });
                lParser.setRootGraph(lMainGraph);

                // Process
                const lResult: any = lParser.parse('const');

                // Evaluation.
                expect(lResult).toBeDeepEqual({ type: 'const', list: { innerList: [] } });
            });

            it('-- Prevent circular detection on infinit depths with exit token first', () => {
                // Setup. Init lexer.
                const lLexer = new Lexer<TokenType>();
                lLexer.trimWhitespace = true;
                lLexer.validWhitespaces = ' ';
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[abc]/, type: TokenType.Identifier } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[+-]/, type: TokenType.Custom } }));

                // Setup. Init grapth.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lLexer);
                const lAdditionGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('left', lExpressionGraph).required(TokenType.Custom).required('right', lExpressionGraph);
                });
                const lVariableGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('variable', TokenType.Identifier);
                });
                const lExpressionGraph = Graph.define(() => {
                    const lLoopingAdditionGraph: Graph<TokenType, any> = lAdditionGraph;
                    const lLoopingVariableGraph: Graph<TokenType, any> = lVariableGraph;

                    return GraphNode.new<TokenType>().required('expression', [
                        lLoopingAdditionGraph,
                        lLoopingVariableGraph
                    ]);
                });
                lParser.setRootGraph(lExpressionGraph);

                // Process
                const lResult: any = lParser.parse('a + b - c');

                // Evaluation.
                expect(lResult).toBeDeepEqual({
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
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[abc]/, type: 'ident' } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[+-]/, type: 'operator' } }));

                // Setup. Init grapth.
                const lParser: CodeParser<string, any> = new CodeParser(lLexer);
                const lVariableGraph = Graph.define(() => {
                    return GraphNode.new<string>().required('variable', 'ident');
                });
                const lAdditionGraph = Graph.define(() => {
                    return GraphNode.new<string>().required('left', lExpressionGraph).required('operator').required('right', lExpressionGraph);
                });
                const lExpressionGraph = Graph.define(() => {
                    const lLoopingAdditionGraph: Graph<string, any> = lAdditionGraph;
                    const lLoopingVariableGraph: Graph<string, any> = lVariableGraph;

                    return GraphNode.new<string>().required('expression', [
                        lLoopingAdditionGraph,
                        lLoopingVariableGraph
                    ]);
                });
                lParser.setRootGraph(lExpressionGraph);

                // Process
                const lResult: any = lParser.parse('a + b - c');

                // Evaluation.
                expect(lResult).toBeDeepEqual({
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

            it('-- Prevent circular detection on infinit depths with none hitting optional branching', () => {
                // Setup. Init lexer.
                const lLexer = new Lexer<string>();
                lLexer.trimWhitespace = true;
                lLexer.validWhitespaces = ' ';
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[abc]/, type: 'ident' } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[+-]/, type: 'operator' } }));

                // Setup. Init grapth.
                const lParser: CodeParser<string, any> = new CodeParser(lLexer);

                const lAdditionGraph = Graph.define(() => {
                    return GraphNode.new<string>().required('left', lExpressionGraph).required('operator').required('right', lExpressionGraph);
                });
                const lOptionalGraph = Graph.define(() => {
                    return GraphNode.new<string>().optional('optional').required('expression', lExpressionGraph);
                }).converter((pData) => {
                    return pData.expression;
                });
                const lVariableGraph = Graph.define(() => {
                    return GraphNode.new<string>().required('variable', 'ident');
                });
                const lExpressionGraph = Graph.define(() => {
                    const lLoopingAdditionGraph: Graph<string, any> = lAdditionGraph;
                    const lLoopingOptionalGraph: Graph<string, any> = lOptionalGraph;
                    const lLoopingVariableGraph: Graph<string, any> = lVariableGraph;

                    return GraphNode.new<string>().required('expression', [
                        lLoopingAdditionGraph,
                        lLoopingOptionalGraph,
                        lLoopingVariableGraph
                    ]);
                });
                lParser.setRootGraph(lExpressionGraph);

                // Process
                const lResult: any = lParser.parse('a + b - c');

                // Evaluation.
                expect(lResult).toBeDeepEqual({
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
                                    // Last variable can not be parsed with AdditionGraph so it takes the OptionalGraph what calls the expression again , that than calls the AdditionGraph.
                                    expression: {
                                        expression: {
                                            variable: 'c'
                                        }
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
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('Something', TokenType.Modifier).required('Something', TokenType.Modifier);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const const');
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Graph path has a dublicate value identifier "Something"`);
            });

            it('-- Graph has dublicate list value identifier. With existing single identifier.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lLoopGraph = Graph.define(() => {
                    const lSelfReference: Graph<TokenType, { something: Array<string>; }> = lLoopGraph;
                    return GraphNode.new<TokenType>().required('something[]', TokenType.Modifier).optional('something<-something', lSelfReference);
                });
                const lMaingraph = Graph.define(() => {
                    // Big type upfuck here. But it is too typesafe.
                    const lMainGraph: GraphNode<TokenType, any> = GraphNode.new<TokenType>().required('something', TokenType.Identifier);
                    return lMainGraph.required('something<-something', lLoopGraph) as GraphNode<TokenType, any>;
                });
                lParser.setRootGraph(lMaingraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('identifier const const');
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Graph path has a dublicate value identifier "something"`);
            });

            it('-- Not completing to end and failing on the first token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().optional(TokenType.Modifier);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('Notconst');
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Tokens could not be parsed. Graph end meet without reaching last token. Current: "Notconst" (${TokenType.Identifier})`);
            });
        });

        describe('-- Data collector errors.', () => {
            it('-- Keep error messages of error objects', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier);
                }).converter(() => {
                    throw new Error(lErrorMessage);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(lErrorMessage);
            });

            it('-- Keep error messages stacktrace', () => {
                // Setup. Function name.
                const lFunctionName: string = 'lMyErrorFunctionName';

                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier);
                }).converter(function lMyErrorFunctionName() {
                    throw new Error();
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
                expect(lException).not.toBeNull();
                expect(lException).toHaveProperty('cause');
                expect(lException.cause).toBeInstanceOf(Error);
                expect(lException.cause).toHaveProperty('stack');
                expect((<any>lException.cause).stack).toContain(lFunctionName);
            });

            it('-- Keep error messages of string', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier);
                }).converter(() => {
                    throw lErrorMessage;
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(lErrorMessage);
            });

            it('-- Error positions single token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier);
                }).converter(() => {
                    throw lErrorMessage;
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
                expect(lException).toBeInstanceOf(CodeParserException);
                expect(lException.columnStart).toBe(1);
                expect(lException.columnEnd).toBe(6);
                expect(lException.lineStart).toBe(1);
                expect(lException.lineEnd).toBe(1);
            });

            it('-- Error positions chained token without newline.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Modifier);
                }).converter(() => {
                    throw lErrorMessage;
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const const');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
                expect(lException).toBeInstanceOf(CodeParserException);
                expect(lException.columnStart).toBe(1);
                expect(lException.columnEnd).toBe(12);
                expect(lException.lineStart).toBe(1);
                expect(lException.lineEnd).toBe(1);
            });

            it('-- Keep error object on parser error.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lError: Error = new Error('My message is clear');
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier);
                }).converter(() => {
                    throw lError;
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
                expect(lException).toBeInstanceOf(CodeParserException);
                expect(lException.cause).toBe(lError);
            });

            it('-- Error positions chained token with newline.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Modifier);
                }).converter(() => {
                    throw lErrorMessage;
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const\nconst');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
                expect(lException).toBeInstanceOf(CodeParserException);
                expect(lException.columnStart).toBe(1);
                expect(lException.columnEnd).toBe(6);
                expect(lException.lineStart).toBe(1);
                expect(lException.lineEnd).toBe(2);
            });

            it('-- Error positions with only optional token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().optional(TokenType.Modifier);
                }).converter(() => {
                    throw lErrorMessage;
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
                expect(lException).toBeInstanceOf(CodeParserException);
                expect(lException.message).toBe(lErrorMessage);
                expect(lException.columnStart).toBe(1);
                expect(lException.columnEnd).toBe(1);
                expect(lException.lineStart).toBe(1);
                expect(lException.lineEnd).toBe(1);
            });

            it('-- Error positions with no parse data.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier);
                }).converter(() => {
                    return {};
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
                expect(lException).toBeInstanceOf(CodeParserException);
                expect(lException.columnStart).toBe(1);
                expect(lException.columnEnd).toBe(1);
                expect(lException.lineStart).toBe(1);
                expect(lException.lineEnd).toBe(1);
            });

            it('-- Multi error after line break.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required([
                        GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Semicolon),
                        GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Identifier).required(TokenType.Semicolon),
                    ]);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const \nidentifier error');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
                expect(lException).toBeInstanceOf(CodeParserException);
                expect(lException.columnStart).toBe(12);
                expect(lException.columnEnd).toBe(17);
                expect(lException.lineStart).toBe(2);
                expect(lException.lineEnd).toBe(2);
            });

            it('-- Error with an multiline token.', () => {
                // Setup. Lexer
                const lLexer: Lexer<TokenType> = new Lexer<TokenType>();
                lLexer.validWhitespaces = ' \n\t\r';
                lLexer.trimWhitespace = true;
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /new\nline/, type: TokenType.Custom } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[a-zA-Z]+/, type: TokenType.Identifier } }));

                // Setup. Parser.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lLexer);

                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Identifier).required(TokenType.Identifier).required(TokenType.Semicolon);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const identifier new\nline');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
                expect(lException).toBeInstanceOf(CodeParserException);
                expect(lException.columnStart).toBe(18);
                expect(lException.columnEnd).toBe(5);
                expect(lException.lineStart).toBe(1);
                expect(lException.lineEnd).toBe(2);
            });

            it('-- Error messages of optional graphs when end not meet', () => {
                // TODO: // FIXME: Look and priorize parser exception so the own error message gets priorized.
                // TODO: Remove/rename GraphError and keep any exceptions in global/cursor at the end, Take error message with the latest end or start token. 

                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                const lOptionalGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required(TokenType.Modifier);
                }).converter(() => {
                    throw lErrorMessage;
                });
                const lMainGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().optional(lOptionalGraph);
                });
                lParser.setRootGraph(lMainGraph);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(lErrorMessage);
            });
        });
    });

    describe('Method: setRootGraphPart', () => {
        it('-- Set root part', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Assignment);
            });

            // Evaluation.
            lParser.setRootGraph(lMainGraph);
        });
    });

    describe('Functionality: Type checking', () => {
        type TypedTokenType = 'item1' | 'item2' | 'item3';
        type TypedBaseObject = { a: 'a'; };

        it(() => {
            // Content data.
            const lContentGraph = Graph.define(() => {
                return GraphNode.new<TypedTokenType>().required('node', ['item1', 'item2', 'item3']);
            }).converter((): Array<TypedBaseObject> => {
                return {} as any; // doesnt matter
            });;

            const lContentListGraph = Graph.define(() => {
                const lSelfReference: Graph<TypedTokenType, any, Array<TypedBaseObject>> = lContentListGraph;

                return GraphNode.new<TypedTokenType>().required('list[]', lContentGraph).optional('list[]', lSelfReference);

            }).converter((pData): Array<TypedBaseObject> => {
                const lContentList: Array<TypedBaseObject> = new Array<TypedBaseObject>();

                for (const lItem of pData.list) {
                    lContentList.push(lItem);
                }

                return lContentList;
            });
        });

        it(() => {
            const lContentGraph = Graph.define(() => {
                return GraphNode.new<TypedTokenType>().required('node', ['item1', 'item2', 'item3']);
            }).converter((): TypedBaseObject => {
                return {} as any; // doesnt matter
            });

            const lContentListGraph = Graph.define(() => {
                const lSelfReference: Graph<TypedTokenType, any, { list: Array<TypedBaseObject>; }> = lContentListGraph;

                return GraphNode.new<TypedTokenType>().required('list[]', lContentGraph).optional('list<-list', lSelfReference);

            }).converter((pData): { list: Array<TypedBaseObject>; } => {
                const lContentList: Array<TypedBaseObject> = new Array<TypedBaseObject>();

                for (const lItem of pData.list) {
                    lContentList.push(lItem);
                }

                return { list: lContentList };
            });
        });
    });
});