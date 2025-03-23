import { Exception, Stack } from '@kartoffelgames/core';
import { CodeParserException, LexerException } from '../index.ts';
import type { LexerToken } from '../lexer/lexer-token.ts';
import type { Lexer } from '../lexer/lexer.ts';
import type { CodeParserErrorSymbol } from './code-parser-exception.ts';
import { CodeParserStateIterative, type CodeParserCursorGraphPosition, type CodeParserCursorTokenPosition } from './code-parser-state-iterative.ts';
import type { GraphNode, GraphNodeConnections } from './graph/graph-node.ts';
import type { Graph } from './graph/graph.ts';

/**
 * Code parser turns a text with the help of a setup lexer into a syntax tree.
 * The data gets converted in the last step into another data type.
 * 
 * Parser moves a syntax graph along with the tokens to match a syntax and invoke specialized data collectors.
 * 
 * @typeparam TTokenType - Type of tokens the parser should handle. Must match with the lexter token types.
 * @typeparam TParseResult - The result object the parser returns on success.
 */
export class CodeParserIterative<TTokenType extends string, TParseResult> {
    private mDebugMode: boolean;
    private readonly mLexer: Lexer<TTokenType>;
    private mMaxRecursion: number;
    private mRootPart: Graph<TTokenType, any, TParseResult> | null;

    /**
     * Get debug mode.
     */
    public get debugMode(): boolean {
        return this.mDebugMode;
    } set debugMode(pValue: boolean) {
        this.mDebugMode = pValue;
    }

    /**
     * Get lexer.
     */
    public get lexer(): Lexer<TTokenType> {
        return this.mLexer;
    }

    /**
     * Set max recursion count for detecting circular part dependencies.
     */
    public get maxRecursion(): number {
        return this.mMaxRecursion;
    } set maxRecursion(pValue: number) {
        this.mMaxRecursion = pValue;
    }

    /**
     * Constructor.
     * 
     * @param pLexer - Token lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>) {
        this.mLexer = pLexer;
        this.mMaxRecursion = 100;
        this.mRootPart = null;
        this.mDebugMode = false;
    }

    /**
     * Parse a text with the set syntax from {@link CodeParser.setRootGraph} into a sytnax tree
     * or custom data structure.
     * 
     * @param pCodeText - Code as text.
     * 
     * @returns The code as {@link TTokenType} data structure.
     * 
     * @throws {@link ParserException}
     * When the graph could not be resolved with the set code text.
     * Or {@link Exception} when no tokenizeable text should be parsed.
     */
    public parse(pCodeText: string, pProgressTracker?: CodeParserProgressTracker): TParseResult {
        // Validate lazy parameters.
        if (this.mRootPart === null) {
            throw new Exception('Parser has not root part set.', this);
        }

        // Create a parser cursor for the code text.
        const lCursor: CodeParserStateIterative<TTokenType> = new CodeParserStateIterative<TTokenType>(this.mLexer.tokenize(pCodeText, pProgressTracker), this.mDebugMode);

        // Parse root graph part.
        const lRootParseData: unknown | CodeParserErrorSymbol = (() => {
            try {
                return this.parseGraph(lCursor, this.mRootPart as Graph<TTokenType>)!;
            } catch (pError) {
                // The graph is still in the right state the error was thrown, so we can still extract data from it.

                // Lexer error can be directly added to the trace.
                if (pError instanceof LexerException) {
                    lCursor.trace.push(pError.message, lCursor.graph, pError.lineStart, pError.columnStart, pError.lineEnd, pError.columnEnd, true, pError);
                    return CodeParserException.PARSER_ERROR;
                }

                // Read error message from error object. Default to toString.
                const lErrorMessage: string = pError instanceof Error ? pError.message : (<any>pError).toString();

                // Read current graph position, as errors can only be thrown in the data converter functions.
                const lCursorPosition: CodeParserCursorGraphPosition<TTokenType> = lCursor.getGraphPosition();

                // Add error as trace incident and return an error.
                lCursor.trace.push(lErrorMessage, lCursor.graph, lCursorPosition.lineStart, lCursorPosition.columnStart, lCursorPosition.lineEnd, lCursorPosition.columnEnd, true, pError);
                return CodeParserException.PARSER_ERROR;
            }
        })();

        // Or throw a normal parser exception when it was handled.
        if (lRootParseData === CodeParserException.PARSER_ERROR) {
            throw new CodeParserException(lCursor.trace);
        }

        // Convert parse data of null into index 0 token index. Null means no token was processed.
        const lRemainingToken: Array<LexerToken<TTokenType>> = lCursor.collapse();

        // Validate, that every token was parsed.
        if (lRemainingToken.length !== 0) {
            const lNextToken: LexerToken<TTokenType> = lRemainingToken[0];
            const lLastToken: LexerToken<TTokenType> = lRemainingToken.at(-1)!;

            // Create a error message and add a incident.
            const lErrorMessage: string = `Tokens could not be parsed. Graph end meet without reaching last token. Current: "${lNextToken.value}" (${lNextToken.type})`;
            lCursor.trace.push(lErrorMessage, this.mRootPart as Graph<TTokenType>, lNextToken.lineNumber, lNextToken.columnNumber, lLastToken.lineNumber, lLastToken.columnNumber);

            // Throw error with pushed incident.
            throw new CodeParserException(lCursor.trace);
        }

        return lRootParseData as TParseResult;
    }

    /**
     * Set the root graph part of this parser.
     * 
     * @param pPartName - Graph part name.
     * 
     * @throws {@link Exception}
     * When the graph part is not defined or has no defined data collector.
     */
    public setRootGraph(pGraph: Graph<TTokenType, any, TParseResult>): void {
        this.mRootPart = pGraph;
    }

    private parseGraph(pCursor: CodeParserStateIterative<TTokenType>, pRootGraph: Graph<TTokenType>): unknown | CodeParserErrorSymbol {
        const lProcessStack: Stack<CodeParserProcessStackItem<TTokenType>> = new Stack<CodeParserProcessStackItem<TTokenType>>();

        // Push the first process.
        lProcessStack.push({ type: 'graph-parse__start', process: { graph: pRootGraph, linear: true } });

        // Process stack.
        let lCurrentProcess: CodeParserProcessStackItem<TTokenType> | undefined = undefined;
        MAIN_LOOP: while (!!(lCurrentProcess = lProcessStack.pop())) {
            // Process current process
            switch (lCurrentProcess.type) {
                case 'graph-parse__start': {
                    const lGraph: Graph<TTokenType> = lCurrentProcess.process.graph;

                    // Prevent circular graph calls that doesnt progressed itself.
                    if (pCursor.graphIsCircular(lGraph)) {
                        // Read the current graph position.
                        const lGraphPosition: CodeParserCursorGraphPosition<TTokenType> = pCursor.getGraphPosition();

                        // Add a circular graph incident.
                        pCursor.trace.push(`Circular graph detected.`, lGraph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

                        // Exit parsing without pushing a new process.
                        continue MAIN_LOOP;
                    }

                    // Read linear parameter of the graph.
                    const lCalledLinear: boolean = lCurrentProcess.process.linear;

                    // Add graph to parser state graph stack.
                    pCursor.pushGraph(lGraph, lCalledLinear);

                    // Continue with graph parse end after node value parse
                    lProcessStack.push({ type: 'graph-parse__end', process: { graph: lGraph, parseResult: CodeParserException.PARSER_ERROR } });

                    // Add starting node as parse process.
                    lProcessStack.push({ type: 'node-parse__start', process: { node: lGraph.node } });

                    continue MAIN_LOOP;
                }

                case "graph-parse__end": {
                    // Read parameter.
                    const lGraph: Graph<TTokenType> = lCurrentProcess.process.graph;
                    const lNodeParseResult: unknown | CodeParserErrorSymbol = lCurrentProcess.process.parseResult;

                    if (lNodeParseResult === CodeParserException.PARSER_ERROR) {
                        // Pop graph with an error.
                        pCursor.popGraph(true);

                        // Exit parsing without pushing a new process.
                        continue MAIN_LOOP;
                    }

                    // Parse result must be an object.
                    if (typeof lNodeParseResult !== 'object' || lNodeParseResult === null) {
                        throw new Exception('Parse result type missmatch (3)', this);
                    }

                    // Try to convert data.
                    const lConvertedData: object | symbol = lGraph.convert(lNodeParseResult);
                    if (typeof lConvertedData === 'symbol') {
                        // Read the current graph position.
                        const lGraphPosition: CodeParserCursorGraphPosition<TTokenType> = pCursor.getGraphPosition();

                        // Integrate exception into parser exception, this should never be a code parser exception.
                        pCursor.trace.push(lConvertedData.description ?? 'Unknown data convert error', lGraphPosition.graph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

                        // Pop graph with an error.
                        pCursor.popGraph(true);

                        // Exit parsing without pushing a new process.
                        continue MAIN_LOOP;
                    }

                    // Pop graph with success.
                    pCursor.popGraph(false);

                    // Return converted data when no more graphs are in the stack.
                    if (!lProcessStack.top) {
                        return lConvertedData;
                    }

                    // Previous process must be a parser result process item.
                    if (!('parseResult' in lProcessStack.top.process)) {
                        throw new Exception('Missmatched process stack state. (3)', this);
                    }

                    // Update previous stacks values to parse result.
                    lProcessStack.top.process.parseResult = lConvertedData;

                    continue MAIN_LOOP;
                }

                case 'node-parse__start': {
                    // Read parameter.
                    const lNode: GraphNode<TTokenType> = lCurrentProcess.process.node;

                    // Continue with node parse end after node value parse
                    lProcessStack.push({ type: 'node-parse__end', process: { node: lNode, nodeNextParseResult: CodeParserException.PARSER_ERROR, nodeValueResult: CodeParserException.PARSER_ERROR } });

                    // Add starting node value as parse process.
                    lProcessStack.push({ type: 'node-value-parse__start', process: { node: lNode, valueIndex: 0 } });

                    continue MAIN_LOOP;
                }

                // TODO: is there a 'node-parse__middle'?

                case 'node-parse__end': {
                    // Read parameter.
                    const lNode: GraphNode<TTokenType> = lCurrentProcess.process.node;
                    const lNodeValueParseResult: unknown | CodeParserErrorSymbol = lCurrentProcess.process.nodeValueResult;
                    const lChainParseResult: object | CodeParserErrorSymbol = lCurrentProcess.process.nodeNextParseResult;

                    // Exit on node parse error.
                    if (lNodeValueParseResult === CodeParserException.PARSER_ERROR || lChainParseResult === CodeParserException.PARSER_ERROR) {
                        continue MAIN_LOOP;
                    }

                    // Merge data.
                    const lMergedData: object = lNode.mergeData(lNodeValueParseResult, lChainParseResult);

                    // Previous process must be a parser result process item.
                    if (!lProcessStack.top || !('parseResult' in lProcessStack.top.process)) {
                        throw new Exception('Missmatched process stack state. (2)', this);
                    }

                    // Update previous stacks values to parse result.
                    lProcessStack.top.process.parseResult = lMergedData;

                    continue MAIN_LOOP;
                }

                case 'node-value-parse__start': {
                    // Read node.
                    const lNode: GraphNode<TTokenType> = lCurrentProcess.process.node;

                    // Read current value index.
                    const lValueIndex: number = lCurrentProcess.process.valueIndex;

                    // Read node connections.
                    const lNodeConnections: GraphNodeConnections<TTokenType> = lNode.connections;

                    if (lValueIndex >= lNodeConnections.values.length) {
                        // Push empty value parse end to process stack. Used for optional graphs.
                        lProcessStack.push({ type: 'node-value-parse__end', process: { node: lNode, parseResult: null } });
                        continue MAIN_LOOP;
                    }

                    // Read current token. Can fail when lexer fails.
                    const lCurrentToken: LexerToken<TTokenType> | null = pCursor.currentToken;

                    // Check of node has any branches or is linear.
                    const lNodeValueIsLinear: boolean = lNodeConnections.values.length === 1;

                    const lNodeValue = lNodeConnections.values[lValueIndex];
                    if (typeof lNodeValue === 'string') {
                        // When no current token was found, skip node value parsing.
                        if (!lCurrentToken) {
                            // Append error when node was required.
                            if (lNodeConnections.required) {
                                // Get current token position.
                                const lTokenPosition: CodeParserCursorTokenPosition<TTokenType> = pCursor.getTokenPosition();

                                // Push parser incident as the current token position.
                                pCursor.trace.push(`Unexpected end of statement. Token "${lNodeValue}" expected.`, pCursor.graph, lTokenPosition.lineStart, lTokenPosition.columnStart, lTokenPosition.lineEnd, lTokenPosition.columnEnd);
                            }

                            // No token was found, try next value.
                            lProcessStack.push({ type: 'node-value-parse__start', process: { node: lNode, valueIndex: lValueIndex + 1 } });
                            continue MAIN_LOOP;
                        }

                        // Push possible parser error when token type does not match node value.
                        if (lNodeValue !== lCurrentToken.type) {
                            if (lNodeConnections.required) {
                                // Get current token position.
                                const lTokenPosition: CodeParserCursorTokenPosition<TTokenType> = pCursor.getTokenPosition();

                                // Push parser incident as the current token position.
                                pCursor.trace.push(`Unexpected token "${lCurrentToken.value}". "${lNodeValue}" expected`, pCursor.graph, lTokenPosition.lineStart, lTokenPosition.columnStart, lTokenPosition.lineEnd, lTokenPosition.columnEnd);
                            }

                            // No token was found, try next value.
                            lProcessStack.push({ type: 'node-value-parse__start', process: { node: lNode, valueIndex: lValueIndex + 1 } });
                            continue MAIN_LOOP;
                        }

                        // Move cursor to next token.
                        pCursor.moveNext();

                        // Push value parse end to process stack.
                        lProcessStack.push({ type: 'node-value-parse__end', process: { node: lNode, parseResult: lCurrentToken.value } });
                    } else {
                        // FIXME: Thats fucked up. When this graph parse fails, no sibling value is parsed.
                        // TODO: Rethink process design. 
                        /*
                         {
                            type: 'node-parse__start',
                            parameter: { node },
                            results: { // Any local variable that must persist. Has a {[key: string]: unknown} structure.
                                lNodeValueParseResult, // they are allways optional.
                                lChainParseResult
                            }
                         }
                         */

                         // TODO: is 'node-value-parse__start' more a 'node-value-parse__loop'? Think about it.

                        // Continue with node value parse end after node value parse
                        lProcessStack.push({ type: 'node-value-parse__end', process: { node: lNode, parseResult: CodeParserException.PARSER_ERROR } });

                        // Push parser process for graph value.
                        lProcessStack.push({ type: 'graph-parse__start', process: { graph: lNodeValue, linear: lNodeValueIsLinear } });
                    }

                    continue MAIN_LOOP;
                }

                case 'node-value-parse__end': {
                    // Read node.
                    const lNode: GraphNode<TTokenType> = lCurrentProcess.process.node;

                    // Read node value parse result.
                    const lNodeResult: unknown = lCurrentProcess.process.parseResult;

                    // Read node connections.
                    const lNodeConnections: GraphNodeConnections<TTokenType> = lNode.connections;

                    // Empty result when no node value was found and node is optional.
                    if (lNodeResult === null && !lNodeConnections.required) {
                        // Send a empty node result to chaining process
                        lProcessStack.push({ type: 'node-next-parse__start', process: { node: lNode, nodeValue: undefined } });
                        continue MAIN_LOOP;
                    }

                    // When no result was added, node was required and should fail.
                    if (lNodeResult === null) {
                        continue MAIN_LOOP;
                    }

                    // Send node result to chaining process
                    lProcessStack.push({ type: 'node-next-parse__start', process: { node: lNode, nodeValue: lNodeResult } });

                    continue MAIN_LOOP;
                }

                case 'node-next-parse__start': {
                    // Read parameters.
                    const lNode: GraphNode<TTokenType> = lCurrentProcess.process.node;
                    const lNodeValue: unknown = lCurrentProcess.process.nodeValue;

                    // Read node connections.
                    const lNodeConnections: GraphNodeConnections<TTokenType> = lNode.connections;

                    // Next chained node.
                    const lNextNode: GraphNode<TTokenType, object> | null = lNodeConnections.next;

                    // No result when branch end was meet.
                    if (lNextNode === null) {
                        // Empty chain data.
                        lProcessStack.push({ type: 'node-next-parse__end', process: { parseResult: {}, nodeValue: lNodeValue } });
                        continue MAIN_LOOP;
                    }

                    // After parsing execute parse end.
                    lProcessStack.push({ type: 'node-next-parse__end', process: { parseResult: CodeParserException.PARSER_ERROR, nodeValue: lNodeValue } });

                    // Parse chained node.
                    lProcessStack.push({ type: 'node-parse__start', process: { node: lNextNode } });

                    continue MAIN_LOOP;
                }

                case 'node-next-parse__end': {
                    // Read parameters.
                    const lNodeResult: unknown | CodeParserErrorSymbol = lCurrentProcess.process.nodeValue;
                    const lChainResult: unknown | CodeParserErrorSymbol = lCurrentProcess.process.parseResult;

                    // Exit on node parse error.
                    if (lChainResult === CodeParserException.PARSER_ERROR) {
                        continue MAIN_LOOP;
                    }

                    // Next process MUST be a 'node-parse__end' process.
                    if (!lProcessStack.top || lProcessStack.top.type !== 'node-parse__end') {
                        throw new Exception('Missmatched process stack state. (1)', this);
                    }

                    // Parse result must be an object.
                    if (typeof lChainResult !== 'object' || lChainResult === null) {
                        throw new Exception('Parse result type missmatch (1)', this);
                    }

                    // Update previous stacks values to parse result.
                    lProcessStack.top.process.nodeNextParseResult = lChainResult;
                    lProcessStack.top.process.nodeValueResult = lNodeResult;

                    continue MAIN_LOOP;
                }
            }
        }

        return CodeParserException.PARSER_ERROR;
    }
}

/*
 * State control types.
 */
type CodeParserProcessStackItemParseResult = {
    parseResult: CodeParserErrorSymbol | unknown;
};

type CodeParserProcessStackMapping<TTokenType extends string> = {
    // Graph parse
    'graph-parse__start': {
        graph: Graph<TTokenType>;
        linear: boolean;
    },
    'graph-parse__end': {
        graph: Graph<TTokenType>;
    } & CodeParserProcessStackItemParseResult,

    // Node parse.
    'node-parse__start': {
        node: GraphNode<TTokenType>;
    };
    'node-parse__end': {
        node: GraphNode<TTokenType>;
        nodeValueResult: CodeParserErrorSymbol | unknown;
        nodeNextParseResult: CodeParserErrorSymbol | object;
    };

    // Node value parse.
    'node-value-parse__start': {
        node: GraphNode<TTokenType>;
        valueIndex: number;
    };
    'node-value-parse__end': {
        node: GraphNode<TTokenType>;
    } & CodeParserProcessStackItemParseResult;

    // Node next parse
    'node-next-parse__start': {
        node: GraphNode<TTokenType>;
        nodeValue: unknown;
    };
    'node-next-parse__end': {
        nodeValue: CodeParserErrorSymbol | unknown;
    } & CodeParserProcessStackItemParseResult;
};

export type CodeParserProcessStackItem<TTokenType extends string> =
    { type: 'graph-parse__start'; process: CodeParserProcessStackMapping<TTokenType>['graph-parse__start']; } |
    { type: 'graph-parse__end'; process: CodeParserProcessStackMapping<TTokenType>['graph-parse__end']; } |
    { type: 'node-parse__start'; process: CodeParserProcessStackMapping<TTokenType>['node-parse__start']; } |
    { type: 'node-parse__end'; process: CodeParserProcessStackMapping<TTokenType>['node-parse__end']; } |
    { type: 'node-value-parse__start'; process: CodeParserProcessStackMapping<TTokenType>['node-value-parse__start']; } |
    { type: 'node-value-parse__end'; process: CodeParserProcessStackMapping<TTokenType>['node-value-parse__end']; } |
    { type: 'node-next-parse__start'; process: CodeParserProcessStackMapping<TTokenType>['node-next-parse__start']; } |
    { type: 'node-next-parse__end'; process: CodeParserProcessStackMapping<TTokenType>['node-next-parse__end']; };

export type CodeParserProgressTracker = (pPosition: number, pLine: number, pColumn: number) => void;