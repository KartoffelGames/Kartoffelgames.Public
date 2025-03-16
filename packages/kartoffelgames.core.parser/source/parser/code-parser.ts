import { Exception } from '@kartoffelgames/core';
import { GraphException, type GraphParseError } from '../exception/graph-exception.ts';
import { ParserException } from '../exception/parser-exception.ts';
import { GraphNode, GraphNodeConnections } from "../graph/graph-node.ts";
import { Graph } from "../graph/graph.ts";
import type { LexerToken } from '../lexer/lexer-token.ts';
import type { Lexer } from '../lexer/lexer.ts';
import { CodeParserCursor } from "./code-parser-cursor.ts";

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

        let lRootParseData: GraphParseResult;
        try {
            // Parse root graph.
            lRootParseData = this.parseGraph(lCursor, this.mRootPart as Graph<TTokenType>, true)!;
        } catch (pException) {
            // Only handle exclusive graph errors.
            if (!(pException instanceof GraphException)) {
                throw pException;
            }

            // Find error with the latest error position.
            const lErrorPosition: GraphParseError<TTokenType> = pException.mostRelevant();

            // At lease one error must be found.
            throw ParserException.fromToken(lErrorPosition!.message, this, lErrorPosition!.errorToken, lErrorPosition!.errorToken);
        }

        // Convert parse data of null into index 0 token index. Null means no token was processed.
        const lRemainingToken: Array<LexerToken<TTokenType>> = lCursor.collapse();

        // Validate, that every token was parsed.
        if (lRemainingToken.length !== 0) {
            const lNextToken: LexerToken<TTokenType> = lRemainingToken[0];
            const lLastToken: LexerToken<TTokenType> = lRemainingToken.at(-1)!;

            throw ParserException.fromToken(`Tokens could not be parsed. Graph end meet without reaching last token. Current: "${lNextToken.value}" (${lNextToken.type})`, this, lNextToken, lLastToken);
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
     * Parse the graph, marked with {@link pCurrentTokenIndex}. Allways uses the root node of the provided
     * Returns null when the complete graph processed no token.
     * 
     * @param pGraph - Node of graph. Used to get the root node.
     * @param pTokenList - Current parsed list of all token in appearing order.
     * @param pCurrentTokenIndex - Current token index that should be parsed with the node.
     * @param pRecursionNodeChain - List of nodes that are called in recursion without any node with value between them.
     * 
     * @returns The Token data object with all parsed brother node token data merged. Additionally the last used token index is returned.
     * When the parsing fails for this node or a brother node, a complete list with all potential errors are returned instead of the token data.
     */
    private parseGraphBranch(pCursor: CodeParserCursor<TTokenType>, pGraph: GraphNode<TTokenType>, pGraphCalledLinear: boolean): GraphNodeParseResult {
        const lBranchRootNode: GraphNode<TTokenType> = pGraph.root;

        // Prevent circular graph branches calls that doesnt progressed itself.
        if (pCursor.graphBranchIsCircular(lBranchRootNode)) {
            const lGraphException: GraphException<TTokenType> = new GraphException();
            lGraphException.appendError(`Circular graph branch detected.`, null); // TODO: Null token hides the mesage.
            throw lGraphException;
        }

        return pCursor.pushGraphBranch(() => {
            return this.parseGraphNode(pCursor, pGraph.root);
        }, pGraph.root, pGraphCalledLinear);
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
    private parseGraphNode(pCursor: CodeParserCursor<TTokenType>, pNode: GraphNode<TTokenType>): GraphNodeParseResult {
        // Parse and read current node values. Throws when no value was found and required.
        const lNodeValueParseResult: GraphParseResult = this.retrieveNodeValues(pCursor, pNode);

        // Parse and read data of chanined nodes. Add each error to the complete error list.
        const lChainParseResult: GraphChainResult = this.retrieveChainedValues(pCursor, pNode, lNodeValueParseResult);

        return {
            data: pNode.mergeData(lChainParseResult.nodeData.data, lChainParseResult.chainData.data),
            tokenProcessed: lChainParseResult.chainData.tokenProcessed || lChainParseResult.nodeData.tokenProcessed
        };
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
    private parseGraph(pCursor: CodeParserCursor<TTokenType>, pGraph: Graph<TTokenType>, pGraphCalledLinear: boolean): GraphParseResult | null {
        // Parse graph node, returns empty when graph has no value and was optional
        const lNodeParseResult: GraphNodeParseResult = this.parseGraphBranch(pCursor, pGraph.node, pGraphCalledLinear);

        // Execute optional collector.
        let lResultData: unknown = lNodeParseResult.data;
        try {
            lResultData = pGraph.convert(lNodeParseResult.data);
        } catch (pError: any) {
            // Rethrow parser exception.
            if (pError instanceof ParserException) {
                throw pError;
            }

            // Read start end end token.
            const lStartToken: LexerToken<TTokenType> | null = pCursor.current();

            // TODO: Implement end token.
            // const lEndTokenIndex: number = (lNodeParseResult.nextTokenIndex === pCurrentTokenIndex) ? pCurrentTokenIndex : lNodeParseResult.nextTokenIndex - 1;
            // const lEndToken: LexerToken<TTokenType> | null = pTokenList.at(lEndTokenIndex) ?? null;

            const lEndToken: LexerToken<TTokenType> | null = pCursor.current();

            // When no token was processed, throw default error on first token.
            throw ParserException.fromToken(pError, this, lStartToken, lEndToken);
        }

        return {
            data: lResultData,
            tokenProcessed: lNodeParseResult.tokenProcessed
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
    private retrieveChainedValues(pCursor: CodeParserCursor<TTokenType>, pNode: GraphNode<TTokenType>, pNodeValue: GraphParseResult): GraphChainResult {
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
        const lChainedNodeParseResult: GraphNodeParseResult = this.parseGraphNode(pCursor, lNextNode);

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
    private retrieveNodeValues(pCursor: CodeParserCursor<TTokenType>, pNode: GraphNode<TTokenType>): GraphParseResult {
        // Read current token.
        const lCurrentToken: LexerToken<TTokenType> | null = pCursor.current();

        // Error buffer. Bundles all parser errors so on an error case an detailed error detection can be made.
        const lGraphErrors: GraphException<TTokenType> = new GraphException<TTokenType>();

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
                            lGraphErrors.appendError(`Unexpected end of statement. Token "${lNodeValue}" expected.`, null); // TODO: Null token hides the message.
                        }

                        continue;
                    }

                    // Push possible parser error when token type does not match node value.
                    if (lNodeValue !== lCurrentToken.type) {
                        if (lNodeConnections.required) {
                            lGraphErrors.appendError(`Unexpected token. "${lNodeValue}" expected`, lCurrentToken);
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
                    try {
                        if (lNodeValue instanceof Graph) {
                            return this.parseGraph(pCursor, lNodeValue, lNodeValueIsLinear);
                        } else {
                            return this.parseGraphBranch(pCursor, lNodeValue, lNodeValueIsLinear);
                        }
                    } catch (lError) {
                        // Append error message thrown by parsing graph/node.
                        if (lError instanceof GraphException) {
                            lGraphErrors.merge(lError);
                        } else if (lError instanceof Error) {
                            lGraphErrors.appendError(lError.message, lCurrentToken);
                        } else {
                            lGraphErrors.appendError((<any>lError).toString(), lCurrentToken);
                        }

                        continue;
                    }
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

        // When no result was added, node was required
        if (lNodeResult === null) {
            throw lGraphErrors;
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