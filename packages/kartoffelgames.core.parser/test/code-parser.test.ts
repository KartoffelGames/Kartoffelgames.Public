import type { LexerToken } from '@kartoffelgames/core-parser';
import { expect } from '@kartoffelgames/core-test';
import { Lexer } from '../source/lexer/lexer.ts';
import { CodeParserException } from '../source/parser/code-parser-exception.ts';
import { CodeParser } from '../source/parser/code-parser.ts';
import { GraphNode } from '../source/parser/graph/graph-node.ts';
import { Graph } from '../source/parser/graph/graph.ts';

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

const gCreateLexer = (): Lexer<TokenType> => {
    const lLexer = new Lexer<TokenType>();

    // Add token patterns
    lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /const/, type: TokenType.Modifier } }));
    lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /=/, type: TokenType.Assignment } }));
    lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[a-zA-Z]+/, type: TokenType.Identifier } }));
    lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /:/, type: TokenType.TypeDelimiter } }));
    lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /;/, type: TokenType.Semicolon } }));
    lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[0-9]+/, type: TokenType.Number } }));
    lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /".*?"/, type: TokenType.String } }));

    // Configure whitespace handling
    lLexer.validWhitespaces = ' \n\t\r';
    lLexer.trimWhitespace = true;

    return lLexer;
};

Deno.test('CodeParser.lexer', async (pContext) => {
    await pContext.step('Default', () => {
        // Setup
        const lLexer = new Lexer<string>();
        const lParser = new CodeParser<string, any>(lLexer);

        // Evaluation
        expect(lParser.lexer).toBe(lLexer);
    });
});

Deno.test('CodeParser.parse()', async (pContext) => {
    await pContext.step('Linear', async (pContext) => {
        await pContext.step('Linear Parsing no optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const name: number;';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).required(TokenType.Semicolon);
            });

            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('modifier', 'const');
            expect(lParsedData).toHaveProperty('variableName', 'name');
            expect(lParsedData).toHaveProperty('typeName', 'number');
        });

        await pContext.step('Linear Parsing with optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const name: number';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).optional(TokenType.Semicolon);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('modifier', 'const');
            expect(lParsedData).toHaveProperty('variableName', 'name');
            expect(lParsedData).toHaveProperty('typeName', 'number');
        });

        await pContext.step('Linear Parsing with two ending optionals without value', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const name: number';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).optional(TokenType.Semicolon).optional(TokenType.Semicolon);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('modifier', 'const');
            expect(lParsedData).toHaveProperty('variableName', 'name');
            expect(lParsedData).toHaveProperty('typeName', 'number');
        });

        await pContext.step('Linear Parsing with branching', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const name: number';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required([
                    TokenType.Custom,
                    TokenType.TypeDelimiter,
                ]).required('typeName', TokenType.Identifier).optional(TokenType.Semicolon);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('modifier', 'const');
            expect(lParsedData).toHaveProperty('variableName', 'name');
            expect(lParsedData).toHaveProperty('typeName', 'number');
        });

        await pContext.step('Linear Parsing where the graph ends before the file is finished', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const; and it goes on';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier).optional(TokenType.Semicolon);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lErrorFunction = () => {
                lParser.parse(lCodeText);
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(`Tokens could not be parsed. Graph end meet without reaching last token. Current: "and" (Identifier)`);
        });
    });

    await pContext.step('Branches', async (pContext) => {
        await pContext.step('Branch Parsing without optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lParsedIdentifierData: any = lParser.parse(lCodeTextIdentifier).result;
            const lParsedModifierData: any = lParser.parse(lCodeTextModifier).result;

            // Evaluation.
            expect(lParsedIdentifierData).toHaveProperty('data', 'notconst');
            expect(lParsedModifierData).toHaveProperty('data', 'const');
        });

        await pContext.step('Branch Parsing with existing optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lParsedIdentifierData: any = lParser.parse(lCodeTextIdentifier).result;
            const lParsedNumberData: any = lParser.parse(lCodeTextNumber).result;

            // Evaluation.
            expect(lParsedNumberData).toHaveProperty('data');
            expect(lParsedNumberData.data).toBeDeepEqual({ optional: '123' });
            expect(lParsedIdentifierData).toHaveProperty('data');
            expect(lParsedIdentifierData.data).toBeDeepEqual({ required: 'myname' });
        });

        await pContext.step('Branch Parsing with missing optionals', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const ;';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier).required('data', [
                    GraphNode.new<TokenType>().optional('optional', TokenType.Identifier)
                ]).required(TokenType.Semicolon);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('data');
            expect(lParsedData.data).toBeDeepEqual({});
        });

        await pContext.step('Optional branch parsing with existing token', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().optional('data', [
                    GraphNode.new<TokenType>().required('optional', TokenType.Modifier)
                ]);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('data');
            expect(lParsedData.data).toBeDeepEqual({ optional: 'const' });
        });

        await pContext.step('Optional branch parsing without existing token', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier).optional('data', [
                    GraphNode.new<TokenType>().required('optional', TokenType.Identifier)
                ]);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toBeDeepEqual({});
        });
    });

    await pContext.step('Loops', async (pContext) => {
        await pContext.step('Loop Parsing with existing items', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'one two three four five';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                const lSelfReference: Graph<TokenType, { data: Array<string>; }> = lMainGraph;
                return GraphNode.new<TokenType>().required('data[]', TokenType.Identifier).optional('data<-data', lSelfReference);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('data');
            expect(lParsedData.data).toBeDeepEqual(['one', 'two', 'three', 'four', 'five']);
        });

        await pContext.step('Loop Parsing with different front and back data.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('data');
            expect(lParsedData.data).toBeDeepEqual(['one', 'two', 'three', 'four', 'five']);
        });

        await pContext.step('Loop start greedy parsing', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('first', 'one');
            expect(lParsedData).toHaveProperty('data');
            expect(lParsedData.data).toBeDeepEqual(['two', 'three', 'four', 'five']);
            expect(lParsedData).toHaveProperty('second', 'const');
        });

        await pContext.step('Loop Parsing with missing items', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).not.toHaveProperty('loop');
        });

        await pContext.step('Loop Parsing with existing items', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeTextList: Array<string> = ['const', 'ident', 'ident', 'ident', 'ident', 'ident'];

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
            const lParsedData: any = lParser.parse(lCodeTextList.join(' ')).result;

            // Evaluation.
            expect(lParsedData).toHaveProperty('loop');
            expect(lParsedData.loop).toBeDeepEqual(lCodeTextList.slice(1));
        });

        await pContext.step('Optional recursion loops', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                const lSelfReference: Graph<TokenType, { optional?: string; }> = lMainGraph;
                return GraphNode.new<TokenType>().optional('optional', TokenType.Modifier).optional(lSelfReference);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toBeDeepEqual({
                optional: lCodeText
            });
        });

        await pContext.step('Optional recursion loops with required node in optional graph', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                const lSelfReference: Graph<TokenType, { optional?: { mod: string; }; }> = lMainGraph;
                return GraphNode.new<TokenType>().optional('optional', GraphNode.new<TokenType>().required('mod', TokenType.Modifier)).optional(lSelfReference);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lParsedData: any = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lParsedData).toBeDeepEqual({
                optional: {
                    mod: lCodeText
                }
            });
        });
    });

    await pContext.step('Part references', async (pContext) => {
        await pContext.step('Reference with collector', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lResult = lParser.parse(lCodeText).result;

            // Evaluation. Loop chain twice as long as actual loop.
            expect(lResult).toHaveProperty('part', lCodeText);
        });

        await pContext.step('Reference without collector', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lResult = lParser.parse(lCodeText).result;

            // Evaluation. Loop chain twice as long as actual loop.
            expect(lResult).toHaveProperty('part');
            expect(lResult.part).toHaveProperty('data', lCodeText);
        });

        await pContext.step('Reference as optional value with value', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lResult = lParser.parse(lCodeText).result;

            // Evaluation. Loop chain twice as long as actual loop.
            expect(lResult).toHaveProperty('part');
            expect(lResult.part).toHaveProperty('data');
        });

        await pContext.step('Reference as optional value without value', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lResult = lParser.parse(lCodeText).result;

            // Evaluation. Loop chain twice as long as actual loop.
            expect(lResult).toHaveProperty('modifier');
            expect(lResult).not.toHaveProperty('part');
        });

        await pContext.step('Optional self reference fail when not on end of graph', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Required self reference fail when not on end of graph', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Self reference with different start and end data.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const const indent indent';

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                const lSelfReference: Graph<TokenType, any> = lMainGraph;
                return GraphNode.new<TokenType>().required('start', TokenType.Modifier).optional('inner', lSelfReference).required('end', TokenType.Identifier);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lResult = lParser.parse(lCodeText).result;

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

        await pContext.step('Wide references in loops', () => {
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
                }, (pPattern) => {
                    pPattern.useChildPattern(lIdentifier);
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
                }, (pPattern) => {
                    pPattern.useChildPattern(lIdentifier);
                    pPattern.useChildPattern(lExplicitValue);
                });
                lLexer.useRootTokenPattern(lOpeningBracket);
                lLexer.useRootTokenPattern(lClosingBracket);
                lLexer.useRootTokenPattern(lExplicitValue);
                lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[^<>"]+/, type: 'VALUE' } }));
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

        await pContext.step('Null as converter result', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'part';

            // Setup. Define additive part.
            const lIdentifierGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('data', TokenType.Identifier);
            }).converter(() => {
                return null;
            });

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('part', lIdentifierGraph);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lResult = lParser.parse(lCodeText).result;

            // Evaluation. Loop chain twice as long as actual loop.
            expect(lResult).toHaveProperty('part');
            expect(lResult.part).toBeNull();
        });

        await pContext.step('Undefined as converter result', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'part';

            // Setup. Define additive part.
            const lIdentifierGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('data', TokenType.Identifier);
            }).converter(() => {
                return undefined;
            });

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('part', lIdentifierGraph);
            });
            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lResult = lParser.parse(lCodeText).result;

            // Evaluation. Loop chain twice as long as actual loop.
            expect(lResult.part).toBeUndefined();
        });
    });

    await pContext.step('Parse Graph Errors', async (pContext) => {
        await pContext.step('Parse without root part', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());

            // Process.
            const lErrorFunction = () => {
                lParser.parse('Some text');
            };

            // Evaluation.
            expect(lErrorFunction).toThrow('Parser has not root part set.');
        });

        await pContext.step('Single parse error, wrong token type.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Single parse error, missing token.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Single parse error, no token.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Graph end meet without reaching last token.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Duplicate branchings paths takes the first', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            const lResult = lParser.parse(lCodeText).result;

            // Evaluation.
            expect(lResult).toBeDeepEqual({
                data: {
                    one: 'const',
                    name: 'identifier'
                }
            });
        });

        await pContext.step('Detect endless circular dependency over multiple references.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());

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

        await pContext.step('Detect endless circular dependency with branch.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());

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

        await pContext.step('Detect endless circular dependency with junction graph.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());

            const lLoopGraph = Graph.define(() => {
                const lSelfReference: Graph<TokenType, any> = lLoopGraph;
                return GraphNode.new<TokenType>().required(lSelfReference);
            }, true);
            lParser.setRootGraph(lLoopGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('identifier');
            };

            // Evaluation. Loop chain twice as long as actual loop.
            expect(lErrorFunction).toThrow(`Junction graph called circular too often.`);
        });

        await pContext.step('Detect junction graph having own nodes.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());

            const lLoopGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Identifier);
            }, true);
            lParser.setRootGraph(lLoopGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('identifier');
            };

            // Evaluation. Loop chain twice as long as actual loop.
            expect(lErrorFunction).toThrow(`Junction graph must not have own nodes.`);
        });

        await pContext.step('Add data from empty loop node.', () => {
            // Setup. Init lexer.
            const lLexer = new Lexer<string>();
            lLexer.trimWhitespace = true;
            lLexer.validWhitespaces = ' ';
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /@/, type: '@' } }));
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /a/, type: 'a' } }));
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /;/, type: ';' } }));
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /1/, type: '1' } }));

            // Setup. Init grapth.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().optional('list', GraphNode.new<TokenType>().optional('innerList[]', TokenType.Identifier)).required('type', TokenType.Modifier);
            });
            lParser.setRootGraph(lMainGraph);

            // Process
            const lResult: any = lParser.parse('const').result;

            // Evaluation.
            expect(lResult).toBeDeepEqual({ type: 'const', list: { innerList: [] } });
        });

        await pContext.step('Prevent circular detection on infinit depths with exit token first', () => {
            // Setup. Init lexer.
            const lLexer = new Lexer<TokenType>();
            lLexer.trimWhitespace = true;
            lLexer.validWhitespaces = ' ';
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[abc]/, type: TokenType.Identifier } }));
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[+-]/, type: TokenType.Custom } }));

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
            }, true);
            lParser.setRootGraph(lExpressionGraph);

            // Process
            const lResult: any = lParser.parse('a + b - c').result;

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

        await pContext.step('Prevent circular detection on infinit depths with exit token last', () => {
            // Setup. Init lexer.
            const lLexer = new Lexer<string>();
            lLexer.trimWhitespace = true;
            lLexer.validWhitespaces = ' ';
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[abc]/, type: 'ident' } }));
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[+-]/, type: 'operator' } }));

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
            }, true);
            lParser.setRootGraph(lExpressionGraph);

            // Process
            const lResult: any = lParser.parse('a + b - c').result;

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

        await pContext.step('Prevent circular detection on infinit depths with none hitting optional branching', () => {
            // Setup. Init lexer.
            const lLexer = new Lexer<string>();
            lLexer.trimWhitespace = true;
            lLexer.validWhitespaces = ' ';
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[abc]/, type: 'ident' } }));
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[+-]/, type: 'operator' } }));

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
            }, true);
            lParser.setRootGraph(lExpressionGraph);

            // Process
            const lResult: any = lParser.parse('a + b - c').result;

            // Evaluation.
            expect(lResult).toEqual({
                expression: {
                    left: {
                        expression: {
                            expression: { // Hitting optional graph here
                                variable: 'a'
                            }
                        }
                    },
                    right: {
                        expression: {
                            left: {
                                expression: {
                                    expression: { // Hitting optional graph here
                                        variable: 'b'
                                    }
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

        await pContext.step('Error on lexing while parsing.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lCodeText: string = 'const name: ????;';
            const lExpectedMessage = `Unable to parse next token. No valid pattern found for "${lCodeText.substring(12)}".`;

            // Setup. Define graph part and set as root.
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).required(TokenType.Semicolon);
            });

            lParser.setRootGraph(lMainGraph);

            // Process. Convert code.
            const lErrorFunction = () => {
                lParser.parse(lCodeText);
            };

            // Evaluation.
            const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
            expect(lException).toBeInstanceOf(CodeParserException);
            expect(lException.message).toBe(lExpectedMessage);
            expect(lException.columnStart).toBe(13);
            expect(lException.columnEnd).toBe(13);
            expect(lException.lineStart).toBe(1);
            expect(lException.lineEnd).toBe(1);
        });
    });

    await pContext.step('Identifier errors.', async (pContext) => {
        await pContext.step('Graph has duplicate single value identifier', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('Something', TokenType.Modifier).required('Something', TokenType.Modifier);
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const const');
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(`Graph path has a duplicate value identifier "Something"`);
        });

        await pContext.step('Graph has duplicate list value identifier. With existing single identifier.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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
            expect(lErrorFunction).toThrow(`Graph path has a duplicate value identifier "something"`);
        });

        await pContext.step('Not completing to end and failing on the first token.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

    await pContext.step('Data collector errors.', async (pContext) => {
        await pContext.step('Unknown error messages of symbol errors without description', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier);
            }).converter(() => {
                return Symbol();
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const');
            };

            // Evaluation.
            expect(lErrorFunction).toThrow('Unknown data convert error');
        });

        await pContext.step('Keep error messages of symbol errors', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lErrorMessage: string = 'Error message';
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier);
            }).converter(() => {
                return Symbol(lErrorMessage);
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const');
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(lErrorMessage);
        });

        await pContext.step('Keep error messages of error objects', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lErrorMessage: string = 'Error message';
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier);
            }).converter(() => {
                throw Error(lErrorMessage);
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const');
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(lErrorMessage);
        });

        await pContext.step('Correct error graph of error object', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());

            // Setup graphs.
            const lFailingGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Identifier);
            }).converter(() => {
                throw new Error();
            });
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier).required(lFailingGraph);
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const');
            };

            // Evaluation.
            const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
            expect(lException).toBeInstanceOf(CodeParserException);
            expect(lException.graph).toBe(lFailingGraph);
        });

        await pContext.step('Correct error graph of error symbol', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());

            // Setup graphs.
            const lFailingGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Identifier);
            }).converter(() => {
                return Symbol();
            });
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier).required(lFailingGraph);
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const');
            };

            // Evaluation.
            const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
            expect(lException).toBeInstanceOf(CodeParserException);
            expect(lException.graph).toBe(lFailingGraph);
        });

        await pContext.step('Keep error messages stacktrace', () => {
            // Setup. Function name.
            const lFunctionName: string = 'lMyErrorFunctionName';

            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Keep error messages of string', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Error positions single token.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Error positions chained token without newline.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Keep error object on parser error.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Error positions chained token with newline.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Error positions with only optional token.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Error positions with no parse data.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Multi error after line break.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Token error with an multiline token.', () => {
            // Setup. Lexer
            const lLexer: Lexer<TokenType> = new Lexer<TokenType>();
            lLexer.validWhitespaces = ' \n\t\r';
            lLexer.trimWhitespace = true;
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /new\nline/, type: TokenType.Custom } }));
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[a-zA-Z]+/, type: TokenType.Identifier } }));

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

        await pContext.step('Graph error with an multiline token.', () => {
            // Setup. Lexer
            const lLexer: Lexer<TokenType> = new Lexer<TokenType>();
            lLexer.validWhitespaces = ' \n\t\r';
            lLexer.trimWhitespace = true;
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /new\nline/, type: TokenType.Custom } }));
            lLexer.useRootTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[a-zA-Z]+/, type: TokenType.Identifier } }));

            // Setup. Parser.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lLexer);

            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Identifier).required(TokenType.Identifier).required(TokenType.Custom);
            }).converter(() => {
                return Symbol();
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const identifier new\nline');
            };

            // Evaluation.
            const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
            expect(lException).toBeInstanceOf(CodeParserException);
            expect(lException.columnStart).toBe(1);
            expect(lException.columnEnd).toBe(5);
            expect(lException.lineStart).toBe(1);
            expect(lException.lineEnd).toBe(2);
        });

        await pContext.step('Error messages of optional graphs when end not meet', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
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

        await pContext.step('Abort parsing process that would otherwise fail.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lErrorMessage: string = 'Error message';

            // Setup graphs.
            const lFailingGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('name', TokenType.Identifier);
            }).converter((pData) => {
                if (pData.name === 'someidentifier') {
                    throw new Error(lErrorMessage);
                }
            });
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier).optional(lFailingGraph).required(TokenType.Semicolon);
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const someidentifier notSemicolon');
            };

            // Evaluation.
            const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
            expect(lException).toBeInstanceOf(CodeParserException);
            expect(lException.message).toBe(lErrorMessage);
            expect(lException.columnStart).toBe(7);
            expect(lException.columnEnd).toBe(21);
            expect(lException.lineStart).toBe(1);
            expect(lException.lineEnd).toBe(1);
        });

        await pContext.step('Abort parsing process that would suceed.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lErrorMessage: string = 'Error message';

            // Setup graphs.
            const lFailingGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required('name', TokenType.Identifier);
            }).converter((pData) => {
                if (pData.name === 'someidentifier') {
                    throw new Error(lErrorMessage);
                }
            });
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier).optional(lFailingGraph).required(TokenType.Semicolon);
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const someidentifier;');
            };

            // Evaluation.
            const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
            expect(lException).toBeInstanceOf(CodeParserException);
            expect(lException.message).toBe(lErrorMessage);
            expect(lException.columnStart).toBe(7);
            expect(lException.columnEnd).toBe(21);
            expect(lException.lineStart).toBe(1);
            expect(lException.lineEnd).toBe(1);
        });

        await pContext.step('Abort parsing process with optional graph without output but aborts.', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lErrorMessage: string = 'Error message';

            // Setup graphs.
            const lFailingGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().optional(TokenType.Identifier);
            }).converter(() => {
                throw new Error(lErrorMessage);
            });
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier).optional(lFailingGraph);
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const');
            };

            // Evaluation.
            const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
            expect(lException).toBeInstanceOf(CodeParserException);
            expect(lException.message).toBe(lErrorMessage);
            expect(lException.columnStart).toBe(1);
            expect(lException.columnEnd).toBe(6);
            expect(lException.lineStart).toBe(1);
            expect(lException.lineEnd).toBe(1);
        });

        await pContext.step('Override error priority on converter abort', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
            const lErrorMessage: string = 'Aborted Error';
            const lFailingGraph = Graph.define(() => {
                return GraphNode.new<TokenType>()
                    .optional('namespace',
                        GraphNode.new<TokenType>().required('name', TokenType.Identifier).required(TokenType.Assignment)
                    )
                    .required('name', TokenType.Identifier)
                    .optional('value',
                        GraphNode.new<TokenType>().required(TokenType.Assignment).required('value', TokenType.Custom)
                    );
            }).converter(() => {
                throw Error(lErrorMessage);
            });
            const lMainGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Modifier).optional(lFailingGraph).required(TokenType.Semicolon);
            });
            lParser.setRootGraph(lMainGraph);

            // Process.
            const lErrorFunction = () => {
                lParser.parse('const ident;');
            };

            // Evaluation.
            expect(lErrorFunction).toThrow(lErrorMessage);
        });
    });

    await pContext.step('Token passthrough to converter', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeTextList: Array<string> = ['valOne', 'valTwo', 'valThree', 'valFour'];

        let lReceivedMainStartToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedMainEndToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedInnerStartToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedInnerEndToken: LexerToken<TokenType> | undefined | null = null as any;

        const lInnerGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required(TokenType.Identifier).required(TokenType.Identifier);
        }).converter((pData, pStartToken, pEndToken) => {
            lReceivedInnerStartToken = pStartToken;
            lReceivedInnerEndToken = pEndToken;
            return pData;
        });

        const lMainGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required(TokenType.Identifier).required(lInnerGraph).required(TokenType.Identifier);
        }).converter((pData, pStartToken, pEndToken) => {
            lReceivedMainStartToken = pStartToken;
            lReceivedMainEndToken = pEndToken;
            return pData;
        });
        lParser.setRootGraph(lMainGraph);

        // Process.
        lParser.parse(lCodeTextList.join(' '));

        // Evaluation.
        expect(lReceivedMainStartToken?.value).toBe('valOne');
        expect(lReceivedInnerStartToken?.value).toBe('valTwo');
        expect(lReceivedInnerEndToken?.value).toBe('valThree');
        expect(lReceivedMainEndToken?.value).toBe('valFour');
    });
});

Deno.test('CodeParser.setRootGraph()', async (pContext) => {
    await pContext.step('Set root part', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());

        // Process.
        const lMainGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required(TokenType.Assignment);
        });

        // Evaluation.
        lParser.setRootGraph(lMainGraph);
    });
});

Deno.test('CodeParser.constructor()', async (pContext) => {
    await pContext.step('Include a complete trace in the exception when debugMode is true', () => {
        // Setup
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer(), {
            debug: { analitics: true }
        });

        // Define a graph that will fail
        const lMainGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional(
                GraphNode.new<TokenType>().required(TokenType.Modifier)
            ).required(TokenType.Identifier).required(TokenType.Semicolon);
        });
        lParser.setRootGraph(lMainGraph);

        // Process and evaluate
        const lErrorFunction = () => {
            lParser.parse('identifier');
        };

        const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
        expect(lException).toBeInstanceOf(CodeParserException);
        expect(lException.analitics).not.toBeNull();
        expect(lException.analitics!.incidents).toHaveLength(2);
    });

    await pContext.step('Omit trace list in the exception when debugMode is false', () => {
        // Setup
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer(), {
            debug: { analitics: false }
        });

        // Define a graph that will fail
        const lMainGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional(TokenType.Modifier).required(TokenType.Identifier).required(TokenType.Semicolon);
        });
        lParser.setRootGraph(lMainGraph);

        // Process and evaluate
        const lErrorFunction = () => {
            lParser.parse('const');
        };

        const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })() as CodeParserException<string>;
        expect(lException).toBeInstanceOf(CodeParserException);
        expect(lException.analitics).toBeNull();
    });

    await pContext.step('Accurate token positions on a nested graph', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeTextList: Array<string> = ['valOne', 'valTwo', 'valThree', 'valFour'];

        let lReceivedMainStartToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedMainEndToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedInnerStartToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedInnerEndToken: LexerToken<TokenType> | undefined | null = null as any;

        const lInnerGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required(TokenType.Identifier).required(TokenType.Identifier);
        }).converter((pData, pStartToken, pEndToken) => {
            lReceivedInnerStartToken = pStartToken;
            lReceivedInnerEndToken = pEndToken;
            return pData;
        });

        const lMainGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required(TokenType.Identifier).required(lInnerGraph).required(TokenType.Identifier);
        }).converter((pData, pStartToken, pEndToken) => {
            lReceivedMainStartToken = pStartToken;
            lReceivedMainEndToken = pEndToken;
            return pData;
        });
        lParser.setRootGraph(lMainGraph);

        // Process.
        lParser.parse(lCodeTextList.join(' '));

        // Evaluation.
        expect(lReceivedMainStartToken?.value).toBe(lCodeTextList[0]);
        expect(lReceivedInnerStartToken?.value).toBe(lCodeTextList[1]);
        expect(lReceivedInnerEndToken?.value).toBe(lCodeTextList[2]);
        expect(lReceivedMainEndToken?.value).toBe(lCodeTextList[3]);
    });

    await pContext.step('Token positions on a graph that owns no node itself', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeTextList: Array<string> = ['valOne', 'valTwo'];

        let lReceivedMainStartToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedMainEndToken: LexerToken<TokenType> | undefined | null = null as any;

        const lMainGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required([
                GraphNode.new<TokenType>().required(TokenType.Identifier).required(TokenType.Identifier)
            ]);
        }).converter((pData, pStartToken, pEndToken) => {
            lReceivedMainStartToken = pStartToken;
            lReceivedMainEndToken = pEndToken;
            return pData;
        });
        lParser.setRootGraph(lMainGraph);

        // Process.
        lParser.parse(lCodeTextList.join(' '));

        // Evaluation.
        // A graph without an own node is still bound by the token its child graph has consumed.
        expect(lReceivedMainStartToken?.value).toBe(lCodeTextList[0]);
        expect(lReceivedMainEndToken?.value).toBe(lCodeTextList[1]);
    });

    await pContext.step('Accurate token positions inside a branch', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeTextList: Array<string> = ['valOne', 'valTwo', 'valThree', 'valFour'];

        let lReceivedMainStartToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedMainEndToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedInnerStartToken: LexerToken<TokenType> | undefined | null = null as any;
        let lReceivedInnerEndToken: LexerToken<TokenType> | undefined | null = null as any;

        const lInnerGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required(TokenType.Identifier).required(TokenType.Identifier);
        }).converter((pData, pStartToken, pEndToken) => {
            lReceivedInnerStartToken = pStartToken;
            lReceivedInnerEndToken = pEndToken;
            return pData;
        });

        const lMainGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required([
                GraphNode.new<TokenType>().required(TokenType.Identifier).required(lInnerGraph).required(TokenType.Identifier),
                TokenType.Custom
            ]);
        }).converter((pData, pStartToken, pEndToken) => {
            lReceivedMainStartToken = pStartToken;
            lReceivedMainEndToken = pEndToken;
            return pData;
        });
        lParser.setRootGraph(lMainGraph);

        // Process.
        lParser.parse(lCodeTextList.join(' '));

        // Evaluation.
        expect(lReceivedMainStartToken?.value).toBe(lCodeTextList[0]);
        expect(lReceivedInnerStartToken?.value).toBe(lCodeTextList[1]);
        expect(lReceivedInnerEndToken?.value).toBe(lCodeTextList[2]);
        expect(lReceivedMainEndToken?.value).toBe(lCodeTextList[3]);
    });
});

Deno.test('CodeParser--Functionality: Type checking', async (pContext) => {
    type ExtractGraphResultType<T> = T extends Graph<any, any, infer TGraphResult> ? TGraphResult : never;

    await pContext.step('Required single value', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['ident'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('node', TokenType.Identifier);
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node: string; };
        expect(lData).toEqual({ node: lCodeText[0] });
    });

    await pContext.step('Required array single value', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['const'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('node[]', TokenType.Modifier);
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node: Array<string>; };
        expect(lData).toEqual({ node: lCodeText });
    });

    await pContext.step('Required single value merge', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['identifier'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('node<-value',
                GraphNode.new<TokenType>().required('value', TokenType.Identifier)
            );
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node: string; };
        expect(lData).toEqual({ node: lCodeText[0] });
    });

    await pContext.step('Required array value merge', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['const'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('node<-value',
                GraphNode.new<TokenType>().required('value[]', TokenType.Modifier)
            );
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node: Array<string>; };
        expect(lData).toEqual({ node: lCodeText });
    });

    await pContext.step('Required array value merge with existing array', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['identifier', 'identifier'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('node[]', TokenType.Identifier).required('node<-value',
                GraphNode.new<TokenType>().required('value[]', TokenType.Identifier)
            );
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node: Array<string>; };
        expect(lData).toEqual({ node: lCodeText });
    });

    await pContext.step('Optional single value - Existing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['identifier'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional('node', TokenType.Identifier);
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node?: string; };
        expect(lData).toEqual({ node: lCodeText[0] });
    });

    await pContext.step('Optional single value - Missing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = [';'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional('node', TokenType.Identifier).required(TokenType.Semicolon);
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node?: string; };
        expect(lData).toEqual({});
    });

    await pContext.step('Optional array value - Existing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['identifier'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional('node[]', TokenType.Identifier);
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node: Array<string>; };
        expect(lData).toEqual({ node: [lCodeText[0]] });
    });

    await pContext.step('Optional array value - Missing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = [';'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional('node[]', TokenType.Identifier).required(TokenType.Semicolon);
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node: Array<string>; };
        expect(lData).toEqual({ node: [] });
    });

    await pContext.step('Optional single value merge - Existing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['identifier'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional('node<-value',
                GraphNode.new<TokenType>().required('value', TokenType.Identifier)
            );
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node?: string; };
        expect(lData).toEqual({ node: lCodeText[0] });
    });

    await pContext.step('Optional single value merge - Missing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = [';'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional('node<-value',
                GraphNode.new<TokenType>().required('value', TokenType.Identifier)
            ).required(TokenType.Semicolon);
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node?: string; };
        expect(lData).toEqual({});
    });

    await pContext.step('Optional array value merge - Existing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['const'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional('node<-value',
                GraphNode.new<TokenType>().required('value[]', TokenType.Modifier)
            );
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node?: Array<string>; };
        expect(lData).toEqual({ node: lCodeText });
    });

    await pContext.step('Optional array value merge - Missing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = [';'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional('node<-value',
                GraphNode.new<TokenType>().required('value[]', TokenType.Modifier)
            ).required(TokenType.Semicolon);
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node?: Array<string>; };
        expect(lData).toEqual({});
    });

    await pContext.step('Optional array value merge with existing array - Existing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['identifier', 'identifier'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('node[]', TokenType.Identifier).optional('node<-value',
                GraphNode.new<TokenType>().required('value[]', TokenType.Identifier)
            );
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node: Array<string>; };
        expect(lData).toEqual({ node: lCodeText });
    });

    await pContext.step('Optional array value merge with existing array - Missing', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lCodeText: Array<string> = ['identifier', ';'];

        // Setup.
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('node[]', TokenType.Identifier).optional('node<-value',
                GraphNode.new<TokenType>().required('value[]', TokenType.Identifier)
            ).required(TokenType.Semicolon);
        });
        lParser.setRootGraph(lGraph);

        // Process
        const lData = lParser.parse(lCodeText.join(' ')).result;

        // Evaluation
        ({} as ExtractGraphResultType<typeof lGraph>) satisfies { node: Array<string>; };
        expect(lData).toEqual({ node: [lCodeText[0]] });
    });
});

Deno.test('CodeParserConfiguration.debug.analitics', async (pContext) => {
    await pContext.step('Absent when disabled', () => {
        // Setup.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer());
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('name', TokenType.Identifier);
        });
        lParser.setRootGraph(lGraph);

        // Process.
        const lResult = lParser.parse('identifier');

        // Evaluation.
        expect(lResult.analitics).toBeUndefined();
    });

    await pContext.step('Counts a hit and a miss of every graph', () => {
        // Setup. A branch that fails, followed by one that succeeds.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer(), {
            debug: { analitics: true }
        });
        const lNameGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('name', TokenType.Identifier);
        });
        const lRootGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('branch', [
                GraphNode.new<TokenType>().required('value', lNameGraph).required(TokenType.Assignment),
                GraphNode.new<TokenType>().required('value', lNameGraph).required(TokenType.Semicolon)
            ]);
        });
        lParser.setRootGraph(lRootGraph);

        // Process.
        const lAnalitics = lParser.parse('identifier;').analitics!;

        // Evaluation. The name graph was parsed once per branch, and both times successfully.
        const lNameAnalitics = lAnalitics.graphs.get(lNameGraph as Graph<TokenType>)!;
        expect(lNameAnalitics.hit).toBe(2);
        expect(lNameAnalitics.missed).toBe(0);

        // Evaluation. Both parses happened on the same token, so one of them was discarded.
        expect(lNameAnalitics.usedToken.size).toBe(1);
        expect(lNameAnalitics.succeededToken.size).toBe(1);
        expect(lNameAnalitics.consumedTokenCount).toBe(2);
        expect(lNameAnalitics.maxStackDepth).toBe(3);

        // Evaluation. The root graph itself was parsed once, at the bottom of the stack.
        const lRootAnalitics = lAnalitics.graphs.get(lRootGraph as Graph<TokenType>)!;
        expect(lRootAnalitics.hit).toBe(1);
        expect(lRootAnalitics.missed).toBe(0);
        expect(lRootAnalitics.maxStackDepth).toBe(1);
    });

    await pContext.step('Collects the token a graph was entered on', () => {
        // Setup. A trailing optional graph is attempted after the last token was read.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer(), {
            debug: { analitics: true }
        });
        const lTrailingGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('tail', TokenType.Semicolon);
        });
        const lRootGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('name', TokenType.Identifier).optional('tail', lTrailingGraph);
        });
        lParser.setRootGraph(lRootGraph);

        // Process.
        const lAnalitics = lParser.parse('identifier').analitics!;

        // Evaluation. The root graph was entered on the only token.
        const lRootToken = [...lAnalitics.graphs.get(lRootGraph as Graph<TokenType>)!.usedToken][0];
        expect(lRootToken).not.toBeNull();
        expect(lRootToken!.value).toBe('identifier');
        expect(lRootToken!.lineNumber).toBe(1);
        expect(lRootToken!.columnNumber).toBe(1);

        // Evaluation. The trailing graph was entered after the last token, so it has no token.
        const lTrailingToken = [...lAnalitics.graphs.get(lTrailingGraph as Graph<TokenType>)!.usedToken][0];
        expect(lTrailingToken).toBeNull();
    });

    await pContext.step('Counts a cached failure', () => {
        // Setup. A graph that fails, retried by a second branch on the same token.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer(), {
            debug: { analitics: true },
            caching: { failureCache: true }
        });
        const lFailingGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required(TokenType.Identifier).required(TokenType.Assignment);
        });
        const lRootGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('branch', [
                GraphNode.new<TokenType>().required('value', lFailingGraph).required(TokenType.Semicolon),
                GraphNode.new<TokenType>().required('value', lFailingGraph).required(TokenType.TypeDelimiter),
                GraphNode.new<TokenType>().required(TokenType.Identifier).required(TokenType.Semicolon)
            ]);
        });
        lParser.setRootGraph(lRootGraph);

        // Process.
        const lAnalitics = lParser.parse('identifier;').analitics!;

        // Evaluation. Entered once, and the second branch was spared by the cache.
        const lFailingAnalitics = lAnalitics.graphs.get(lFailingGraph as Graph<TokenType>)!;
        expect(lFailingAnalitics.missed).toBe(1);
        expect(lFailingAnalitics.cached).toBe(1);
    });

    await pContext.step('Counts a rejected data converter', () => {
        // Setup. A data converter that rejects its data by returning a symbol.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer(), {
            debug: { analitics: true }
        });
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('name', TokenType.Identifier);
        }).converter((): { name: string; } | symbol => {
            return Symbol('Converter rejects.');
        });
        lParser.setRootGraph(lGraph);

        // Process.
        const lException = (() => { try { lParser.parse('identifier'); } catch (e) { return e; } return null; })() as CodeParserException<TokenType>;

        // Evaluation. A rejected converter is a miss of its own kind.
        expect(lException).toBeInstanceOf(CodeParserException);

        const lGraphAnalitics = lException.analitics!.graphs.get(lGraph as Graph<TokenType>)!;
        expect(lGraphAnalitics.thrown).toBe(1);
        expect(lGraphAnalitics.missed).toBe(1);
        expect(lGraphAnalitics.hit).toBe(0);
    });

    await pContext.step('Does not count a thrown error as a rejected data converter', () => {
        // Setup. An error thrown by the graph definition, not by a data converter.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer(), {
            debug: { analitics: true }
        });
        const lGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('name', TokenType.Identifier).required('name', TokenType.Identifier);
        });
        lParser.setRootGraph(lGraph);

        // Process.
        const lException = (() => { try { lParser.parse('one two'); } catch (e) { return e; } return null; })() as CodeParserException<TokenType>;

        // Evaluation. The error aborts the parse, so it is reported as an incident and counted nowhere.
        expect(lException).toBeInstanceOf(CodeParserException);
        expect(lException.message).toContain('duplicate value identifier');

        let lThrown: number = 0;
        for (const lGraphAnalitics of lException.analitics!.graphs.values()) {
            lThrown += lGraphAnalitics.thrown;
        }
        expect(lThrown).toBe(0);
    });

    await pContext.step('Counts a circular graph rejection', () => {
        // Setup. Two graphs referencing each other without consuming a token.
        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer(), {
            debug: { analitics: true }
        });
        const lLevel1Graph = Graph.define(() => {
            const lLevel2GraphReference: Graph<TokenType, any> = lLevel2Graph;
            return GraphNode.new<TokenType>().optional(TokenType.Modifier).required(lLevel2GraphReference);
        });
        const lLevel2Graph = Graph.define(() => {
            return GraphNode.new<TokenType>().optional(TokenType.Modifier).required(lLevel1Graph);
        });
        lParser.setRootGraph(lLevel1Graph);

        // Process.
        const lException = (() => { try { lParser.parse('identifier'); } catch (e) { return e; } return null; })() as CodeParserException<TokenType>;

        // Evaluation. A circular rejection is counted on its own, not as a miss.
        expect(lException).toBeInstanceOf(CodeParserException);
        expect(lException.analitics!.graphs.get(lLevel1Graph as Graph<TokenType>)!.circular).toBeGreaterThan(0);
    });
});

Deno.test('CodeParserConfiguration.caching.failureCache', async (pContext) => {
    /**
     * Build a parser over a grammar that retries a failing graph on the same token.
     *
     * @param pFailureCache - Enables the failure cache.
     * @param pDefaultConfiguration - Omits the caching configuration completely.
     *
     * @returns Parser and the graph that always fails.
     */
    const lCreateParser = (pFailureCache: boolean, pDefaultConfiguration: boolean = false) => {
        const lFailingGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required(TokenType.Identifier).required(TokenType.Assignment);
        });
        const lRootGraph = Graph.define(() => {
            return GraphNode.new<TokenType>().required('branch', [
                GraphNode.new<TokenType>().required('value', lFailingGraph).required(TokenType.Semicolon),
                GraphNode.new<TokenType>().required('value', lFailingGraph).required(TokenType.TypeDelimiter),
                GraphNode.new<TokenType>().required('name', TokenType.Identifier).required(TokenType.Semicolon)
            ]);
        });

        const lParser: CodeParser<TokenType, any> = new CodeParser(gCreateLexer(), pDefaultConfiguration
            ? { debug: { analitics: true } }
            : { debug: { analitics: true }, caching: { failureCache: pFailureCache } });
        lParser.setRootGraph(lRootGraph);

        return { parser: lParser, failingGraph: lFailingGraph };
    };

    await pContext.step('Enabled by default', () => {
        // Setup.
        const lSetup = lCreateParser(false, true);

        // Process.
        const lAnalitics = lSetup.parser.parse('identifier;').analitics!;

        // Evaluation.
        expect(lAnalitics.graphs.get(lSetup.failingGraph as Graph<TokenType>)!.cached).toBe(1);
    });

    await pContext.step('Retries the failed graph when disabled', () => {
        // Setup.
        const lSetup = lCreateParser(false);

        // Process.
        const lAnalitics = lSetup.parser.parse('identifier;').analitics!;

        // Evaluation. Nothing is spared, so the graph is entered a second time.
        const lFailingAnalitics = lAnalitics.graphs.get(lSetup.failingGraph as Graph<TokenType>)!;
        expect(lFailingAnalitics.missed).toBe(2);
        expect(lFailingAnalitics.cached).toBe(0);
    });

    await pContext.step('Parses the same result either way', () => {
        // Setup.
        const lEnabled = lCreateParser(true);
        const lDisabled = lCreateParser(false);

        // Process.
        const lEnabledResult = lEnabled.parser.parse('identifier;').result;
        const lDisabledResult = lDisabled.parser.parse('identifier;').result;

        // Evaluation.
        expect(lDisabledResult).toBeDeepEqual(lEnabledResult);
    });
});
