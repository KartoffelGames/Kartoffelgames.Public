import { Exception } from '@kartoffelgames/core';
import { expect } from '@kartoffelgames/core-test';
import { describe, it } from '@std/testing/bdd';
import { CodeParser } from '../source/code-parser.ts';
import { ParserException } from '../source/exception/parser-exception.ts';
import { Lexer } from '../source/lexer/lexer.ts';
import { Graph } from "../source/graph/graph.ts";
import { GraphNode } from "../source/graph/graph-node.ts";

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
                const lGraph = Graph.define(() => {
                    return GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).required(TokenType.Semicolon);
                }).converter((pData) => {
                    return pData;
                });

                lParser.setRootGraph(lGraph);

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
                lParser.defineGraphPart('LinearCode',
                    GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).optional(TokenType.Semicolon),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LinearCode');

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
                lParser.defineGraphPart('LinearCode',
                    GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).required('variableName', TokenType.Identifier).required(TokenType.TypeDelimiter).required('typeName', TokenType.Identifier).optional(TokenType.Semicolon).optional(TokenType.Semicolon),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LinearCode');

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
                lParser.defineGraphPart('BranchCode',
                    GraphNode.new<TokenType>().required('data', [
                        TokenType.Identifier,
                        TokenType.Modifier
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('BranchCode');

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
                lParser.defineGraphPart('BranchCode',
                    GraphNode.new<TokenType>().required('data', [
                        GraphNode.new<TokenType>().required('required', TokenType.Identifier),
                        GraphNode.new<TokenType>().optional('optional', TokenType.Number)
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('BranchCode');

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
                lParser.defineGraphPart('BranchCode',
                    GraphNode.new<TokenType>().required(TokenType.Modifier).required('data', [
                        GraphNode.new<TokenType>().optional('optional', TokenType.Identifier)
                    ]).required(TokenType.Semicolon), // Last single is needed to not get "end of statement" Exception because .required() is not optional and needs a token to proceed.
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('BranchCode');

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
                lParser.defineGraphPart('BranchCode',
                    GraphNode.new<TokenType>().optional('data', [
                        GraphNode.new<TokenType>().required('optional', TokenType.Modifier)
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('BranchCode');

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
                lParser.defineGraphPart('BranchCode',
                    GraphNode.new<TokenType>().required(TokenType.Modifier).optional('data', [
                        GraphNode.new<TokenType>().required('optional', TokenType.Identifier)
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('BranchCode');

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
                lParser.defineGraphPart('LoopCode',
                    GraphNode.new<TokenType>().loop('data', TokenType.Identifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LoopCode');

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
                lParser.defineGraphPart('LoopCode',
                    GraphNode.new<TokenType>().required(TokenType.Modifier).loop('data', TokenType.Identifier).required(TokenType.Modifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('data');
                expect(lParsedData.data).toBeDeepEqual(['one', 'two', 'three', 'four', 'five']);
            });

            it('-- Loop wrapped greedy parsing.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'one two three four five';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    GraphNode.new<TokenType>().required('first', TokenType.Identifier).loop('data', TokenType.Identifier).required('second', TokenType.Identifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('first', 'one');
                expect(lParsedData).toHaveProperty('data');
                expect(lParsedData.data).toBeDeepEqual(['two', 'three', 'four']);
                expect(lParsedData).toHaveProperty('second', 'five');
            });

            it('-- Loop start greedy parsing', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'one two three four five const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    GraphNode.new<TokenType>().required('first', TokenType.Identifier).loop('data', TokenType.Identifier).required('second', TokenType.Modifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LoopCode');

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
                lParser.defineGraphPart('LoopCode',
                    GraphNode.new<TokenType>().required(TokenType.Modifier).loop('loop', TokenType.Identifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LoopCode');

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
                lParser.defineGraphPart('LoopCode',
                    GraphNode.new<TokenType>().optional('optional', TokenType.Modifier).optional(lParser.partReference('LoopCode')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LoopCode');

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
                lParser.defineGraphPart('LoopCode',
                    GraphNode.new<TokenType>().optional('optional', GraphNode.new<TokenType>().required('mod', TokenType.Modifier)).optional(lParser.partReference('LoopCode')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toBeDeepEqual({
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
                    GraphNode.new<TokenType>().loop('loop', TokenType.Identifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                expect(lParsedData).toHaveProperty('loop');
                expect(lParsedData.loop).toHaveLength(0);
            });

            it('-- Empty data for nested loops into single', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = '';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    GraphNode.new<TokenType>().loop('loop', TokenType.Identifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('LinearCode',
                    GraphNode.new<TokenType>().required('value', lParser.partReference('LoopCode')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LinearCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                expect(lParsedData).toHaveProperty('value');
                expect(lParsedData.value).toHaveLength(0);
            });

            it('-- Loop with optional inner node.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'one five';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LoopCode',
                    GraphNode.new<TokenType>().required('first', TokenType.Identifier).loop(GraphNode.new<TokenType>().optional(TokenType.Modifier)).required('second', TokenType.Identifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LoopCode');

                // Process. Convert code.
                const lParsedData: any = lParser.parse(lCodeText);

                // Evaluation.
                expect(lParsedData).toHaveProperty('first', 'one');
                expect(lParsedData).toHaveProperty('second', 'five');
            });
        });

        describe('--Part references', () => {
            it('-- Reference with collector', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define additive part.
                lParser.defineGraphPart('NewPart',
                    GraphNode.new<TokenType>().required('data', TokenType.Modifier),
                    (pData) => {
                        return pData.data;
                    }
                );

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    GraphNode.new<TokenType>().optional('part', lParser.partReference('NewPart')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('StartPart');

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
                lParser.defineGraphPart('NewPart',
                    GraphNode.new<TokenType>().required('data', TokenType.Modifier)
                );

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    GraphNode.new<TokenType>().optional('part', lParser.partReference('NewPart')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('StartPart');

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
                lParser.defineGraphPart('NewPart',
                    GraphNode.new<TokenType>().required('data', TokenType.Modifier),
                    (pData) => {
                        return pData;
                    }
                );

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    GraphNode.new<TokenType>().optional('part', lParser.partReference('NewPart')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('StartPart');

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
                lParser.defineGraphPart('NewPart',
                    GraphNode.new<TokenType>().required('data', TokenType.Identifier),
                    (pData) => {
                        return pData;
                    }
                );

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    GraphNode.new<TokenType>().required('modifier', TokenType.Modifier).optional('part', lParser.partReference('NewPart')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('StartPart');

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).toHaveProperty('modifier');
                expect(lResult).not.toHaveProperty('part');
            });

            it('-- Self reference with same data for inner and outer reference.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const const const const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('StartPart',
                    GraphNode.new<TokenType>().required('start', TokenType.Modifier).optional('inner', lParser.partReference('StartPart')).required('end', TokenType.Modifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('StartPart');

                // Process. Convert code.
                const lResult = lParser.parse(lCodeText);

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lResult).toBeDeepEqual({
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
                    GraphNode.new<TokenType>().required('start', TokenType.Modifier).optional('inner', lParser.partReference('StartPart')).required('end', TokenType.Identifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('StartPart');

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
                lParser.defineGraphPart('LinearCode',
                    GraphNode.new<TokenType>().required('Something', TokenType.Number),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LinearCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Unexpected token. "${TokenType.Number}" expected`);
            });

            it('-- Single parse error, missing token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    GraphNode.new<TokenType>().required(TokenType.Modifier).required('Something', TokenType.Number),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LinearCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Unexpected end of statement. TokenIndex: "1" missing.`);
            });

            it('-- Single parse error, no token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = '';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    GraphNode.new<TokenType>().required('Something', TokenType.Number),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LinearCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Unexpected end of statement. TokenIndex: "0" missing.`);
            });

            it('-- Graph end meet without reaching last token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const identifier';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('LinearCode',
                    GraphNode.new<TokenType>().required('Something', TokenType.Modifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('LinearCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Tokens could not be parsed. Graph end meet without reaching last token. Current: "identifier" (${TokenType.Identifier})`);
            });

            it('-- Dublicate branching paths', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lCodeText: string = 'const identifier;';

                // Setup. Define graph part and set as root.
                lParser.defineGraphPart('DublicateBranchingCode',
                    GraphNode.new<TokenType>().required([
                        GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Identifier),
                        GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Identifier)
                    ]).required(TokenType.Semicolon),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('DublicateBranchingCode');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse(lCodeText);
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Graph has ambiguity paths. Values: [\n\t{ const(Modifier) identifier(Identifier) ;(Semicolon) },\n\t{ const(Modifier) identifier(Identifier) ;(Semicolon) }\n]`);
            });

            it('-- Detect endless circular dependency over multiple references.', () => {
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

                lParser.defineGraphPart('Level1',
                    GraphNode.new<TokenType>().optional(TokenType.Modifier).required(lParser.partReference('Level2')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Level2',
                    GraphNode.new<TokenType>().optional(TokenType.Modifier).required(lParser.partReference('Level1')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('Level1');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('identifier');
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).toThrow(`Circular dependency detected between: Single()[<REF:Level2>] -> Optional-Single()[Modifier] -> Single()[<REF:Level1>] -> Optional-Single()[Modifier] -> Single()[<REF:Level2>] -> Optional-Single()[Modifier] -> Single()[<REF:Level1>] -> Optional-Single()[Modifier]`);
            });

            it('-- Detect endless circular dependency with loop.', () => {
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

                lParser.defineGraphPart('Level1',
                    GraphNode.new<TokenType>().optional(TokenType.Modifier).loop(TokenType.Identifier).required(lParser.partReference('Level1')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('Level1');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('identifier');
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).toThrow(`Circular dependency detected between: Optional-Loop()[Identifier] -> Single()[<REF:Level1>] -> Optional-Single()[Modifier] -> Optional-Loop()[Identifier] -> Single()[<REF:Level1>] -> Optional-Single()[Modifier]`);
            });

            it('-- Detect endless circular dependency with branch.', () => {
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

                lParser.defineGraphPart('Level1',
                    GraphNode.new<TokenType>().optional(TokenType.Modifier).required([
                        GraphNode.new<TokenType>().optional(TokenType.Identifier),
                        GraphNode.new<TokenType>().optional(TokenType.Number)
                    ]).required(lParser.partReference('Level1')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('Level1');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('identifier');
                };

                // Evaluation. Loop chain twice as long as actual loop.
                expect(lErrorFunction).toThrow(`Circular dependency detected between: Single()[<REF:Level1>] -> Optional-Single()[Modifier] -> Branch()[<NODE>, <NODE>] -> Single()[<REF:Level1>] -> Optional-Single()[Modifier] -> Branch()[<NODE>, <NODE>]`);
            });

            it('-- Prevent duplicate paths on optional partReference with a loop', () => {
                // Setup. Init lexer.
                const lLexer = new Lexer<string>();
                lLexer.trimWhitespace = true;
                lLexer.validWhitespaces = ' ';
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /@/, type: '@' } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /a/, type: 'a' } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /;/, type: ';' } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /1/, type: '1' } }));

                // Setup. Init grapth.
                const lParser: CodeParser<string, any> = new CodeParser(lLexer);
                lParser.defineGraphPart('List', GraphNode.new<TokenType>()
                    .loop('list', GraphNode.new<TokenType>().required('@')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Graph', GraphNode.new<TokenType>()
                    .optional('list', lParser.partReference('List'))
                    .required('type', 'a')
                    .required([
                        ';',
                        GraphNode.new<TokenType>().required('1').required(';')
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('Graph');

                // Process
                const lResult: any = lParser.parse('a1;');

                // Evaluation.
                expect(lResult).toBeDeepEqual({ type: 'a' });
            });

            it('-- Prevent circular detection on infinit depths with exit token first', () => {
                // Setup. Init lexer.
                const lLexer = new Lexer<string>();
                lLexer.trimWhitespace = true;
                lLexer.validWhitespaces = ' ';
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[abc]/, type: 'ident' } }));
                lLexer.useTokenPattern(lLexer.createTokenPattern({ pattern: { regex: /[+-]/, type: 'operator' } }));

                // Setup. Init grapth.
                const lParser: CodeParser<string, any> = new CodeParser(lLexer);
                lParser.defineGraphPart('Variable', GraphNode.new<TokenType>()
                    .required('variable', 'ident'),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Addition', GraphNode.new<TokenType>()
                    .required('left', lParser.partReference('Expression'))
                    .required('operator')
                    .required('right', lParser.partReference('Expression')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Expression', GraphNode.new<TokenType>()
                    .required('expression', [
                        lParser.partReference('Variable'),
                        lParser.partReference('Addition')
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('Expression');

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
                lParser.defineGraphPart('Variable', GraphNode.new<TokenType>()
                    .required('variable', 'ident'),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Addition', GraphNode.new<TokenType>()
                    .required('left', lParser.partReference('Expression'))
                    .required('operator')
                    .required('right', lParser.partReference('Expression')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Expression', GraphNode.new<TokenType>()
                    .required('expression', [
                        lParser.partReference('Addition'),
                        lParser.partReference('Variable')
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('Expression');

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
                lParser.defineGraphPart('Variable', GraphNode.new<TokenType>()
                    .required('variable', 'ident'),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Optional', GraphNode.new<TokenType>()
                    .optional('optional')
                    .required('expression', lParser.partReference('Expression')),
                    (pData) => {
                        return pData.expression;
                    }
                );
                lParser.defineGraphPart('Addition', GraphNode.new<TokenType>()
                    .required('left', lParser.partReference('Expression'))
                    .required('operator')
                    .required('right', lParser.partReference('Expression')),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.defineGraphPart('Expression', GraphNode.new<TokenType>()
                    .required('expression', [
                        lParser.partReference('Optional'),
                        lParser.partReference('Addition'),
                        lParser.partReference('Variable')
                    ]),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph('Expression');

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
        });

        describe('-- Identifier errors.', () => {
            it('-- Graph has dublicate single value identifier', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lPartName: string = 'DublicateValueIdentifierPart';
                lParser.defineGraphPart(lPartName,
                    GraphNode.new<TokenType>().required('Something', TokenType.Modifier).required('Something', TokenType.Modifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph(lPartName);

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
                const lPartName: string = 'DublicateValueIdentifierPart';
                lParser.defineGraphPart(lPartName,
                    GraphNode.new<TokenType>().loop('Something', TokenType.Modifier).required('Something', TokenType.Modifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph(lPartName);

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const const');
                };

                // Evaluation.
                expect(lErrorFunction).toThrow(`Graph path has a dublicate value identifier "Something" that is not a list value but should be.`);
            });

            it('-- Not completing to end and failing on the first token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lPartName: string = 'FailingToEnd';
                lParser.defineGraphPart(lPartName,
                    GraphNode.new<TokenType>().optional(TokenType.Modifier),
                    (pData) => {
                        return pData;
                    }
                );
                lParser.setRootGraph(lPartName);

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
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required(TokenType.Modifier),
                    () => {
                        throw new Error(lErrorMessage);
                    }
                );
                lParser.setRootGraph('PartName');

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
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required(TokenType.Modifier),
                    function lMyErrorFunctionName() {
                        throw new Error();
                    }
                );
                lParser.setRootGraph('PartName');

                // Process.
                let lError: Error | null = null;
                try {
                    lParser.parse('const');
                } catch (pError) {
                    lError = <Error>pError;
                }

                // Evaluation.
                expect(lError).not.toBeNull();
                expect(lError).toHaveProperty('cause');
                expect(lError!.cause).toBeInstanceOf(Error);
                expect(lError!.cause).toHaveProperty('stack');
                expect((<any>lError!.cause).stack).toContain(lFunctionName);
            });

            it('-- Keep error messages of string', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraph('PartName');

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
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraph('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })();
                expect(lException).toBeInstanceOf(ParserException);
                expect(lException).toHaveProperty('columnStart', 1);
                expect(lException).toHaveProperty('columnEnd', 6);
                expect(lException).toHaveProperty('lineStart', 1);
                expect(lException).toHaveProperty('lineEnd', 1);
            });

            it('-- Error positions chained token without newline.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraph('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const const');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })();
                expect(lException).toBeInstanceOf(ParserException);
                expect(lException).toHaveProperty('columnStart', 1);
                expect(lException).toHaveProperty('columnEnd', 12);
                expect(lException).toHaveProperty('lineStart', 1);
                expect(lException).toHaveProperty('lineEnd', 1);
            });

            it('-- Error rethrow on parser erro.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lError: ParserException<any> = new ParserException('', null, 2, 3, 4, 5);
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required(TokenType.Modifier),
                    () => {
                        throw lError;
                    }
                );
                lParser.setRootGraph('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })();
                expect(lException).toBeInstanceOf(ParserException);
                expect(lException).toBe(lError);
            });

            it('-- Error positions chained token with newline.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraph('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const\nconst');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })();
                expect(lException).toBeInstanceOf(ParserException);
                expect(lException).toHaveProperty('columnStart', 1);
                expect(lException).toHaveProperty('columnEnd', 6);
                expect(lException).toHaveProperty('lineStart', 1);
                expect(lException).toHaveProperty('lineEnd', 2);
            });

            it('-- Error positions with only optional token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().optional(TokenType.Modifier),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraph('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })();
                expect(lException).toBeInstanceOf(ParserException);
                expect(lException).toHaveProperty('message', lErrorMessage);
                expect(lException).toHaveProperty('columnStart', 1);
                expect(lException).toHaveProperty('columnEnd', 1);
                expect(lException).toHaveProperty('lineStart', 1);
                expect(lException).toHaveProperty('lineEnd', 1);
            });

            it('-- Error positions with no parse data.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required(TokenType.Modifier),
                    () => {
                        return {};
                    }
                );
                lParser.setRootGraph('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })();
                expect(lException).toBeInstanceOf(ParserException);
                expect(lException).toHaveProperty('columnStart', 1);
                expect(lException).toHaveProperty('columnEnd', 1);
                expect(lException).toHaveProperty('lineStart', 1);
                expect(lException).toHaveProperty('lineEnd', 1);
            });

            it('-- Multi error after line break.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required([
                        GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Semicolon),
                        GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Identifier).required(TokenType.Semicolon),
                    ]),
                    () => { }
                );
                lParser.setRootGraph('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const \nidentifier error');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })();
                expect(lException).toBeInstanceOf(ParserException);
                expect(lException).toHaveProperty('columnStart', 12);
                expect(lException).toHaveProperty('columnEnd', 17);
                expect(lException).toHaveProperty('lineStart', 2);
                expect(lException).toHaveProperty('lineEnd', 2);
            });

            it('-- Error with an multiline token.', () => {
                // Setup.
                const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());
                lParser.lexer.useTokenPattern(lParser.lexer.createTokenPattern({ pattern: { regex: /new\nline/, type: TokenType.Custom } }));

                const lErrorMessage: string = 'Error message';
                lParser.defineGraphPart('PartName',
                    GraphNode.new<TokenType>().required(TokenType.Modifier).required(TokenType.Identifier).required(TokenType.Semicolon),
                    () => {
                        throw lErrorMessage;
                    }
                );
                lParser.setRootGraph('PartName');

                // Process.
                const lErrorFunction = () => {
                    lParser.parse('const identifier new\nline');
                };

                // Evaluation.
                const lException = (() => { try { lErrorFunction(); } catch (e) { return e; } return null; })();
                expect(lException).toBeInstanceOf(ParserException);
                expect(lException).toHaveProperty('columnStart', 18);
                expect(lException).toHaveProperty('columnEnd', 5);
                expect(lException).toHaveProperty('lineStart', 1);
                expect(lException).toHaveProperty('lineEnd', 2);
            });
        });
    });

    describe('Method: setRootGraphPart', () => {
        it('-- Set root part', () => {
            // Setup.
            const lParser: CodeParser<TokenType, any> = new CodeParser(lCreateLexer());

            // Process.
            const lGraph = Graph.define(() => {
                return GraphNode.new<TokenType>().required(TokenType.Assignment);
            });

            // Evaluation.
            lParser.setRootGraph(lGraph);
        });
    });
});