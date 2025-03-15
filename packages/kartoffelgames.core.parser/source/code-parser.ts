import { Exception } from '@kartoffelgames/core';
import { GraphException, type GraphParseError } from './exception/graph-exception.ts';
import { ParserException } from './exception/parser-exception.ts';
import { GraphNode, GraphNodeConnections } from "./graph/graph-node.ts";
import { Graph } from "./graph/graph.ts";
import type { LexerToken } from './lexer/lexer-token.ts';
import type { Lexer } from './lexer/lexer.ts';

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

        /* TODO:
         * Would be cool when there will be a cursor object. like
         * {generator: Generator, tokenStack: {stack: Array<LexerToken>, index: number}}
         * The cursor caches all generated tokens that could be to revert the cursor to a previous state.
         * This is usefull in branches when the current branch graph is not resolved and next branch graphs might be used next.
         * When a branch is resolved, the cursor stack index is set to -1.
         * When a token should be read from the cursor and the index is -1, the generator can generate the next.
         * 
         * This way memory usage is reduced.
         */

        // Read complete token list.
        const lTokenList: Array<LexerToken<TTokenType>> = [...this.mLexer.tokenize(pCodeText)];

        let lRootParseData: GraphParseResult;
        try {
            // Parse root part. Start at 0 recursion level. Technicaly impossible to exit reference path because of recursion chain.
            lRootParseData = this.parseGraph(this.mRootPart, lTokenList, 0, new Set<Graph<TTokenType>>(), 0)!;
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
        const lNextTokenIndex: number = lRootParseData.nextTokenIndex;

        // Validate, that every token was parsed.
        if (lNextTokenIndex < lTokenList.length) {
            // Find current token. 
            const lLastToken: LexerToken<TTokenType> = lTokenList.at(-1)!;

            // Token index can't be less than zero.  When it fails on the first token, GraphPartParseResult is null. 
            // It allways has a next index when not all token are used.
            const lNextToken: LexerToken<TTokenType> = lTokenList[lNextTokenIndex]!;

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
    private parseGraphBranch(pGraph: GraphNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionNodeChain: Set<Graph<TTokenType>>, pGraphHops: number): GraphNodeParseResult {
        return this.parseGraphNode(pGraph.root, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops);
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
    private parseGraphNode(pNode: GraphNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionNodeChain: Set<Graph<TTokenType>>, pGraphHops: number): GraphNodeParseResult {
        // Parse and read current node values. Throws when no value was found and required.
        const lNodeValueParseResult: GraphParseResult = this.retrieveNodeValues(pNode, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops);

        // Parse and read data of chanined nodes. Add each error to the complete error list.
        const lChainParseResult: GraphChainResult = this.retrieveChainedValues(pNode, lNodeValueParseResult, pTokenList, pRecursionNodeChain);

        return {
            data: pNode.mergeData(lChainParseResult.nodeData, lChainParseResult.chainData),
            nextTokenIndex: lChainParseResult.chainData.nextTokenIndex,
            tokenProcessed: lChainParseResult.chainData.tokenProcessed || lChainParseResult.nodeData.tokenProcessed,
            hops: lChainParseResult.chainData.hops,
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
    private parseGraph(pGraph: Graph<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionNodeChain: Set<Graph<TTokenType>>, pGraphHops: number): GraphParseResult | null {
        // When the reference was already used in the current recursion chain and since the last time the cursor was not moved, continue.
        // This breaks an endless recursion loop where eighter a reference is calling itself directly or between this and the last invoke only optional nodes without any found value were used.
        if (pRecursionNodeChain.has(pGraph)) {
            return null;
        }

        // Only graph references can have a infinite recursion, so we focus on these.
        pRecursionNodeChain.add(pGraph);

        // Parse graph node, returns empty when graph has no value and was optional
        const lNodeParseResult: GraphNodeParseResult = this.parseGraphBranch(pGraph.node, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops);

        // Remove graph recursion entry after using graph.
        pRecursionNodeChain.delete(pGraph);

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
            const lStartToken: LexerToken<TTokenType> | undefined = pTokenList.at(pCurrentTokenIndex);
            const lEndTokenIndex: number = (lNodeParseResult.nextTokenIndex === pCurrentTokenIndex) ? pCurrentTokenIndex : lNodeParseResult.nextTokenIndex - 1;
            const lEndToken: LexerToken<TTokenType> | undefined = pTokenList.at(lEndTokenIndex);

            // When no token was processed, throw default error on first token.
            throw ParserException.fromToken(pError, this, lStartToken, lEndToken);
        }

        return {
            data: lResultData,
            nextTokenIndex: lNodeParseResult.nextTokenIndex,
            tokenProcessed: lNodeParseResult.tokenProcessed,
            hops: lNodeParseResult.hops
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
    private retrieveChainedValues(pNode: GraphNode<TTokenType>, pNodeValue: GraphParseResult, pTokenList: Array<LexerToken<TTokenType>>, pRecursionNodeChain: Set<Graph<TTokenType>>): GraphChainResult {
        const lNodeConnections: GraphNodeConnections<TTokenType> = pNode.connections;

        // Next chained node.
        const lNextNode: GraphNode<TTokenType, object> | null = lNodeConnections.next;

        // No result when branch end was meet.
        if (lNextNode === null) {
            return {
                nodeData: pNodeValue,
                chainData: {
                    data: {}, // Empty chain data.
                    nextTokenIndex: pNodeValue.nextTokenIndex,
                    tokenProcessed: false,
                    hops: pNodeValue.hops
                }
            };
        }

        // Parse chained node.
        const lChainedNodeParseResult: GraphNodeParseResult = this.parseGraphNode(lNextNode, pTokenList, pNodeValue.nextTokenIndex, pRecursionNodeChain, pNodeValue.hops);

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
    private retrieveNodeValues(pNode: GraphNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionNodeChain: Set<Graph<TTokenType>>, pGraphHops: number): GraphParseResult {
        // Read next token.
        const lCurrentToken: LexerToken<TTokenType> | undefined = pTokenList.at(pCurrentTokenIndex);

        // Error buffer. Bundles all parser errors so on an error case an detailed error detection can be made.
        const lGraphErrors: GraphException<TTokenType> = new GraphException<TTokenType>();

        // Read node connections.
        const lNodeConnections: GraphNodeConnections<TTokenType> = pNode.connections;

        // Find first node value result.
        const lNodeResult: GraphParseResult | null = (() => {
            for (const lNodeValue of lNodeConnections.values) {
                if (typeof lNodeValue === 'string') {
                    // When no current token was found, skip node value parsing.
                    if (!lCurrentToken) {
                        // Append error when node was required.
                        if (lNodeConnections.required) {
                            lGraphErrors.appendError(`Unexpected end of statement. TokenIndex: "${pCurrentTokenIndex}" missing.`, pTokenList.at(-1));
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

                    // Set node value.
                    return {
                        data: lCurrentToken.value,
                        nextTokenIndex: pCurrentTokenIndex + 1,
                        tokenProcessed: true,
                        hops: pGraphHops + 1
                    };
                } else {
                    // Try to retrieve values from graphs.
                    try {
                        if (lNodeValue instanceof Graph) {
                            return this.parseGraph(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops + 1);
                        } else {
                            return this.parseGraphBranch(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops + 1);
                        }
                    } catch (lError) {
                        // Append error message thrown by parsing graph/node.
                        if (lError instanceof Error) {
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
                data: null,
                nextTokenIndex: pCurrentTokenIndex,
                tokenProcessed: false,
                hops: pGraphHops
            };
        }

        // When no result was added, node was required
        if (lNodeResult === null) {
            throw lGraphErrors;
        }

        return lNodeResult;
    }
}

type ChainGraph = {
    nodeValue: GraphParseResult;
    chainedValue: GraphNodeParseResult;
    loopNode: boolean;
    hops: number;
};

type GraphNodeParseResult = {
    data: object;
    nextTokenIndex: number;
    tokenProcessed: boolean;
    hops: number;
};

type GraphParseResult = {
    data: unknown;
    nextTokenIndex: number;
    tokenProcessed: boolean;
    hops: number;
};

type GraphChainResult = {
    nodeData: GraphParseResult;
    chainData: GraphNodeParseResult;
};