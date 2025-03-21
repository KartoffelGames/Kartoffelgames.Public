import { Exception } from '@kartoffelgames/core';
import type { GraphNode, GraphNodeConnections } from '../graph/graph-node.ts';
import type { Graph } from '../graph/graph.ts';
import { CodeParserException, LexerException } from "../index.ts";
import type { LexerToken } from '../lexer/lexer-token.ts';
import type { Lexer } from '../lexer/lexer.ts';
import { CodeParserCursor, CodeParserCursorGraphPosition, CodeParserCursorTokenPosition } from './code-parser-cursor.ts';
import { CodeParserTrace } from "./code-parser-trace.ts";
import { PARSER_ERROR_SYMBOL } from "../exception/code-parser-exception.ts";

/**
 * Code parser turns a text with the help of a setup lexer into a syntax tree.
 * The data gets converted in the last step into another data type.
 * 
 * Parser moves a syntax graph along with the tokens to match a syntax and invoke specialized data collectors.
 * 
 * @typeparam TTokenType - Type of tokens the parser should handle. Must match with the lexter token types.
 * @typeparam TParseResult - The result object the parser returns on success.
 */
export class CodeParser<TTokenType extends string, TParseResult> {
    private readonly mLexer: Lexer<TTokenType>;
    private mMaxRecursion: number;
    private mRootPart: Graph<TTokenType, any, TParseResult> | null;
    private readonly mTrace: CodeParserTrace<TTokenType>;

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
    public constructor(pLexer: Lexer<TTokenType>, pDebug: boolean = false) {
        this.mLexer = pLexer;
        this.mMaxRecursion = 100;
        this.mRootPart = null;
        this.mTrace = new  CodeParserTrace<TTokenType>(pDebug);
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
    public parse(pCodeText: string): TParseResult {
        // Validate lazy parameters.
        if (this.mRootPart === null) {
            throw new Exception('Parser has not root part set.', this);
        }

        // Create a parser cursor for the code text.
        const lCursor: CodeParserCursor<TTokenType> = new CodeParserCursor<TTokenType>(this.mLexer.tokenize(pCodeText));

        // Parse root graph part.
        const lRootParseData: GraphParseResult | PARSER_ERROR_SYMBOL = (() => {
            try {
                return this.parseGraph(lCursor, this.mRootPart as Graph<TTokenType>, true)!;
            } catch (pError) {
                // The graph is still in the right state the error was thrown, so we can still extract data from it.

                // Lexer error can be directly added to the trace.
                if(pError instanceof LexerException) {
                    this.mTrace.push(pError.message, lCursor.graph, pError.lineStart, pError.columnStart, pError.lineEnd, pError.columnEnd, true, pError);
                    return CodeParserException.PARSER_ERROR;
                }

                // Read error message from error object. Default to toString.
                let lErrorMessage: string = pError instanceof Error ? pError.message : (<any>pError).toString();

                // Read current graph position, as errors can only be thrown in the data converter functions.
                const lCursorPosition: CodeParserCursorGraphPosition<TTokenType> = lCursor.getGraphPosition();

                // Add error as trace incident and return an error.
                this.mTrace.push(lErrorMessage, lCursor.graph, lCursorPosition.lineStart, lCursorPosition.columnStart, lCursorPosition.lineEnd, lCursorPosition.columnEnd, true, pError);
                return CodeParserException.PARSER_ERROR;
            }
        })();

        // Or throw a normal parser exception when it was handled.
        if (lRootParseData === CodeParserException.PARSER_ERROR) {
            throw new CodeParserException(this.mTrace);
        }

        // Convert parse data of null into index 0 token index. Null means no token was processed.
        const lRemainingToken: Array<LexerToken<TTokenType>> = lCursor.collapse();

        // Validate, that every token was parsed.
        if (lRemainingToken.length !== 0) {
            const lNextToken: LexerToken<TTokenType> = lRemainingToken[0];
            const lLastToken: LexerToken<TTokenType> = lRemainingToken.at(-1)!;

            // Create a error message and add a incident.
            const lErrorMessage: string = `Tokens could not be parsed. Graph end meet without reaching last token. Current: "${lNextToken.value}" (${lNextToken.type})`;
            this.mTrace.push(lErrorMessage, this.mRootPart as Graph<TTokenType>, lNextToken.lineNumber, lNextToken.columnNumber, lLastToken.lineNumber, lLastToken.columnNumber);

            // Throw error with pushed incident.
            throw new CodeParserException(this.mTrace);
        }

        return lRootParseData.data as TParseResult;
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

    /**
     * Parse the token, marked with {@link pCurrentTokenIndex} with the set graph part.
     * Return null when no token was processed.
     * 
     * @param pGraph - Graph part or a reference to a part.
     * @param pTokenList - Current parsed list of all token in appearing order..
     * @param pCurrentTokenIndex - Current token index that should be parsed with the graph part.
     * @param pRecursionNodeChain - List of nodes that are called in recursion without any node with value between them.
     *  
     * @returns The Token data object, or when the graph part has a data collector, the collected and altered data object is returned.
     * Additionally the last used token index is returned.
     * When the parsing fails for this graph part, a complete list with all potential errors are returned instead of the pared data.
     * 
     * @throws {@link ParserException}
     * When an error is thrown while paring collected data.
     */
    private parseGraph(pCursor: CodeParserCursor<TTokenType>, pGraph: Graph<TTokenType>, pGraphCalledLinear: boolean): GraphParseResult | PARSER_ERROR_SYMBOL {
        // Prevent circular graph calls that doesnt progressed itself.
        if (pCursor.graphIsCircular(pGraph)) {
            // Read the current graph position.
            const lGraphPosition: CodeParserCursorGraphPosition<TTokenType> = pCursor.getGraphPosition();

            // Add a circular graph incident.
            this.mTrace.push(`Circular graph detected.`, pGraph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

            // Exit parsing with error.
            return CodeParserException.PARSER_ERROR;
        }

        // Execute graph parse on a new graph stack.
        return pCursor.pushGraph((pGraph: Graph<TTokenType>) => {
            // Get parse result.
            const lNodeParseResult: GraphNodeParseResult | PARSER_ERROR_SYMBOL = this.parseGraphNode(pCursor, pGraph.node);
            if (lNodeParseResult === CodeParserException.PARSER_ERROR) {
                return CodeParserException.PARSER_ERROR;
            }

            // Try to convert data.
            const lConvertedData: object | symbol = pGraph.convert(lNodeParseResult.data);
            if (typeof lConvertedData === 'symbol') {
                // Read the current graph position.
                const lGraphPosition: CodeParserCursorGraphPosition<TTokenType> = pCursor.getGraphPosition();

                // Integrate exception into parser exception, this should never be a code parser exception.
                this.mTrace.push(lConvertedData.description ?? 'Unknown data convert error', lGraphPosition.graph, lGraphPosition.lineStart, lGraphPosition.columnStart, lGraphPosition.lineEnd, lGraphPosition.columnEnd);

                // Exit parsing with error.
                return CodeParserException.PARSER_ERROR;
            }

            return {
                data: lConvertedData,
                tokenProcessed: lNodeParseResult.tokenProcessed
            };
        }, pGraph, pGraphCalledLinear);
    }

    /**
     * Parse the token, marked with {@link pCurrentTokenIndex} with the set node.
     * Also parses chained nodes.
     * Returns null when the complete node graph chain processed no token.
     * 
     * @param pNode - Current node that should handle the set token.
     * @param pTokenList - Current parsed list of all token in appearing order.
     * @param pCurrentTokenIndex - Current token index that should be parsed with the node.
     * @param pRecursionNodeChain - List of nodes that are called in recursion without any node with value between them.
     * 
     * @returns The Token data object with all parsed brother node token data merged. Additionally the last used token index is returned.
     * When the parsing fails for this node or a brother node, a complete list with all potential errors are returned instead of the token data.
     */
    private parseGraphNode(pCursor: CodeParserCursor<TTokenType>, pNode: GraphNode<TTokenType>): GraphNodeParseResult | PARSER_ERROR_SYMBOL {
        // Parse and read current node values. Throws when no value was found and required.
        const lNodeValueParseResult: GraphParseResult | PARSER_ERROR_SYMBOL = this.retrieveNodeValues(pCursor, pNode);
        if (lNodeValueParseResult === CodeParserException.PARSER_ERROR) {
            return CodeParserException.PARSER_ERROR;
        }

        // Parse and read data of chanined nodes. Add each error to the complete error list.
        const lChainParseResult: GraphChainResult | PARSER_ERROR_SYMBOL = this.retrieveChainedValues(pCursor, pNode, lNodeValueParseResult);
        if (lChainParseResult === CodeParserException.PARSER_ERROR) {
            return CodeParserException.PARSER_ERROR;
        }

        return {
            data: pNode.mergeData(lChainParseResult.nodeData.data, lChainParseResult.chainData.data),
            tokenProcessed: lChainParseResult.chainData.tokenProcessed || lChainParseResult.nodeData.tokenProcessed
        };
    }

    /**
     * Processes every node value, a successfull parsed value of a node, until only one is successfull or the graph end is reached.
     * When more than one node value chain is successfull, the graph is invalid and an error is thrown.
     * Returns null when no token was processed.
     * 
     * @param pNode - Current node.
     * @param pNodeTokenIndex - Current token index of {@link pNode}.
     * @param pNodeValues - Every sucessfull value of the node.
     * @param pTokenList - Current parsed list of all token in appearing order.
     * @param pRecursionNodeChain - List of nodes that are called in recursion without any node with value between them.
     * 
     * @returns The data of the successfull graph value chain or null when no token was processed.
     * 
     * @throws {@link Exception}
     * When more than one node value chain resolves to be valid.
     * 
     * @throws {@link GraphException}
     * When no valid token for the next chaining node was found.
     */
    private retrieveChainedValues(pCursor: CodeParserCursor<TTokenType>, pNode: GraphNode<TTokenType>, pNodeValue: GraphParseResult): GraphChainResult | PARSER_ERROR_SYMBOL {
        const lNodeConnections: GraphNodeConnections<TTokenType> = pNode.connections;

        // Next chained node.
        const lNextNode: GraphNode<TTokenType, object> | null = lNodeConnections.next;

        // No result when branch end was meet.
        if (lNextNode === null) {
            return {
                nodeData: pNodeValue,
                chainData: {
                    data: {}, // Empty chain data.
                    tokenProcessed: false
                }
            };
        }

        // Parse chained node.
        const lChainedNodeParseResult: GraphNodeParseResult | PARSER_ERROR_SYMBOL = this.parseGraphNode(pCursor, lNextNode);
        if (lChainedNodeParseResult === CodeParserException.PARSER_ERROR) {
            return CodeParserException.PARSER_ERROR;
        }

        // Process graph with chained node values.
        return {
            nodeData: pNodeValue,
            chainData: lChainedNodeParseResult
        };
    }

    /**
     * Read data and errors for all node values. 
     * Return null, when the node is optional and no token was found
     * or when the node is optional and no node value fits the current token.
     * 
     * The {@link GraphException} contains every possible error generated for any possible static or graph value.
     * 
     * @param pNode - Current node.
     * @param pTokenList - Current parsed list of all token in appearing order.
     * @param pCurrentTokenIndex - Current token index that should be parsed with the graph part.
     * @param pRecursionNodeChain - List of nodes that are called in recursion without any node with value between them.
     * 
     * @throws {@link GraphException}
     * When no value was found but the node is required.
     * 
     * @returns all valid node values or null when no valid token was found but {@link pNode} is optional.
     */
    private retrieveNodeValues(pCursor: CodeParserCursor<TTokenType>, pNode: GraphNode<TTokenType>): GraphParseResult | PARSER_ERROR_SYMBOL {
        // Read current token. Can fail when lexer fails.
        const lCurrentToken: LexerToken<TTokenType> | null = pCursor.current;

        // Read node connections.
        const lNodeConnections: GraphNodeConnections<TTokenType> = pNode.connections;

        // Check of node has any branches or is linear.
        const lNodeValueIsLinear: boolean = lNodeConnections.values.length === 1;

        // Find first node value result.
        const lNodeResult: GraphParseResult | null = (() => {
            for (const lNodeValue of lNodeConnections.values) {
                if (typeof lNodeValue === 'string') {
                    // When no current token was found, skip node value parsing.
                    if (!lCurrentToken) {
                        // Append error when node was required.
                        if (lNodeConnections.required) {
                            // Get current token position.
                            const lTokenPosition: CodeParserCursorTokenPosition<TTokenType> = pCursor.getCurrentTokenPosition();

                            // Push parser incident as the current token position.
                            this.mTrace.push(`Unexpected end of statement. Token "${lNodeValue}" expected.`, pCursor.graph, lTokenPosition.lineStart, lTokenPosition.columnStart, lTokenPosition.lineEnd, lTokenPosition.columnEnd);
                        }

                        continue;
                    }

                    // Push possible parser error when token type does not match node value.
                    if (lNodeValue !== lCurrentToken.type) {
                        if (lNodeConnections.required) {
                            // Get current token position.
                            const lTokenPosition: CodeParserCursorTokenPosition<TTokenType> = pCursor.getCurrentTokenPosition();

                            // Push parser incident as the current token position.
                            this.mTrace.push(`Unexpected token "${lCurrentToken.value}". "${lNodeValue}" expected`, pCursor.graph, lTokenPosition.lineStart, lTokenPosition.columnStart, lTokenPosition.lineEnd, lTokenPosition.columnEnd);
                        }

                        continue;
                    }

                    // Move cursor to next token.
                    pCursor.moveNext();

                    // Set node value.
                    return {
                        data: lCurrentToken.value,
                        tokenProcessed: true
                    };
                } else {
                    // Try to retrieve values from graphs.
                    const lGraphParseResult: GraphParseResult | PARSER_ERROR_SYMBOL = this.parseGraph(pCursor, lNodeValue, lNodeValueIsLinear);
                    if (lGraphParseResult === CodeParserException.PARSER_ERROR) {
                        continue;
                    }

                    return lGraphParseResult;
                }
            }

            // No node value was found.
            return null;
        })();

        // Empty result when no node value was found and node is optional.
        if (lNodeResult === null && !lNodeConnections.required) {
            return {
                data: undefined,
                tokenProcessed: false
            };
        }

        // When no result was added, node was required and should fail.
        if (lNodeResult === null) {
            return CodeParserException.PARSER_ERROR;
        }

        return lNodeResult;
    }
}

type GraphNodeParseResult = {
    data: object;
    tokenProcessed: boolean;
};

type GraphParseResult = {
    data: unknown;
    tokenProcessed: boolean;
};

type GraphChainResult = {
    nodeData: GraphParseResult;
    chainData: GraphNodeParseResult;
};
