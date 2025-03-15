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
    private retrieveChainedValues(pNode: GraphNode<TTokenType>, pNodeValues: Array<GraphParseResult>, pTokenList: Array<LexerToken<TTokenType>>, pRecursionNodeChain: Set<Graph<TTokenType>>): GraphChainResult {
        // TODO: pNodeValues should be a single result.

        const lGraphErrors: GraphException<TTokenType> = new GraphException<TTokenType>();

        // Run chained node parse for each node value.
        const lChainList: Array<ChainGraph> = new Array<ChainGraph>();
        for (const lNodeValue of pNodeValues) {
            // Process chained nodes in parallel.
            for (const lChainedNode of pNode.next()) {
                // Graph end. No chaining value.
                if (lChainedNode === null) {
                    lChainList.push({
                        nodeValue: lNodeValue,
                        chainedValue: {
                            data: {}, // Empty chain data.
                            nextTokenIndex: lNodeValue.nextTokenIndex,
                            tokenProcessed: false,
                            hops: lNodeValue.hops
                        },
                        loopNode: false,
                        hops: lNodeValue.hops
                    });
                    continue;
                }

                // Skip endless loops by preventing the same optional node chaining itself.
                if (!lNodeValue.tokenProcessed && lChainedNode === pNode) {
                    continue;
                }

                // Try to parse next graph node saves all errors on exception.
                lGraphErrors.onErrorMergeAndContinue(() => {

                    // Every graph branch should have their own recursion chain.
                    let lRecursionNodeChainBranchCopy: Set<GraphPartReference<TTokenType, unknown>>;
                    if (lNodeValue.tokenProcessed) {
                        // Reset recursion node chain when the current node had a parsed value.
                        // This prevents only infinit recursions when every node was optional.
                        lRecursionNodeChainBranchCopy = new Set<GraphPartReference<TTokenType, unknown>>();
                    } else {
                        // Copy recursion node chain to prevent stacking from other graph branches.
                        lRecursionNodeChainBranchCopy = new Set<GraphPartReference<TTokenType, unknown>>(pRecursionNodeChain);
                    }

                    // Parse chained node.
                    const lChainedNodeParseResult: GraphNodeParseResult = this.parseGraphNode(lChainedNode, pTokenList, lNodeValue.nextTokenIndex, lRecursionNodeChainBranchCopy, lNodeValue.hops);

                    // Process graph with chained node values.
                    lChainList.push({
                        nodeValue: lNodeValue,
                        chainedValue: lChainedNodeParseResult,
                        loopNode: lChainedNode === pNode,
                        hops: lChainedNodeParseResult.hops
                    });
                });
            }
        }

        // Throw error list when no result was found.
        if (lChainList.length === 0) {
            throw lGraphErrors;
        }

        // Filtered result list.
        const lChainResultList: Array<ChainGraph> = ((pChainList: Array<ChainGraph>) => {
            let lFilterdValues: Array<ChainGraph> = pChainList;

            // Fast exit on distinct graph value.
            if (lFilterdValues.length === 1) {
                return lFilterdValues;
            }

            // Prefere chains with node value with processed token.
            const lProcessedNodeValue: Array<ChainGraph> = lFilterdValues.filter((pResult: ChainGraph) => { return pResult.nodeValue.tokenProcessed; });
            if (lProcessedNodeValue.length !== 0) {
                lFilterdValues = lProcessedNodeValue;
            }

            // Fast exit on distinct graph value.
            if (lFilterdValues.length === 1) {
                return lFilterdValues;
            }

            // Filter all full-optional chains that had no processed token. This Prevent ambiguity paths triggering when the optional chain "failed".
            // Keep the "failed" optional chains, when no none-optional chain exists.
            const lNoOptionalChainList: Array<ChainGraph> = lFilterdValues.filter((pResult: ChainGraph) => { return pResult.chainedValue.tokenProcessed; });
            if (lNoOptionalChainList.length !== 0) {
                lFilterdValues = lNoOptionalChainList;
            }

            // Fast exit on distinct graph value.
            if (lFilterdValues.length === 1) {
                return lFilterdValues;
            }

            // Enforce greedy loops, Allways choose looped chains over static chains.
            // When a static and a loop chain exists it does not count as ambiguity paths.
            const lLoopChainList: Array<ChainGraph> = lFilterdValues.filter((pResult: ChainGraph) => { return pResult.loopNode; });
            if (lLoopChainList.length !== 0) {
                lFilterdValues = lLoopChainList;
            }

            // Fast exit on distinct graph value.
            if (lFilterdValues.length === 1) {
                return lFilterdValues;
            }

            // When chain contains empty values at this point, no none empty where found.
            // This includes branches on graph end as well.
            // When a optional exists, take the one with the most consumed token and the shortest path taken.
            const lOnlyOptionalList: Array<ChainGraph> = lFilterdValues.filter((pResult: ChainGraph) => { return !pResult.chainedValue.tokenProcessed; });
            if (lOnlyOptionalList.length !== 0) {
                // Find value with the most consumed token and the shortest path taken
                lFilterdValues = [lOnlyOptionalList.reduce((pPrevItem: ChainGraph, pCurrentItem: ChainGraph) => {
                    // Only include for hops when consumed token are the same.
                    if (pPrevItem.chainedValue.nextTokenIndex === pCurrentItem.chainedValue.nextTokenIndex) {
                        if (pPrevItem.hops < pCurrentItem.hops) {
                            return pPrevItem;
                        }

                        return pCurrentItem;
                    }

                    // Prefer higher token index as it has consumed more token.
                    return (pPrevItem.chainedValue.nextTokenIndex > pCurrentItem.chainedValue.nextTokenIndex) ? pPrevItem : pCurrentItem;
                })];
            }

            return lFilterdValues;
        })(lChainList);

        // Validate ambiguity paths.
        if (lChainResultList.length > 1) {
            // Recreate token path of every ambiguity path.
            const lAmbiguityPathDescriptionList: Array<string> = new Array<string>();
            for (const lAmbiguityPath of lChainResultList) {
                // Get current token index of node value.
                // Only one node value can be null, so two ambiguity paths with a node null value does not exists and the node value null check can be omited.
                const lStartTokenIndex: number = lAmbiguityPath.nodeValue.nextTokenIndex - 2;
                const lEndTokenIndex: number = lAmbiguityPath.chainedValue.nextTokenIndex;

                // Cut token Ambiguity path from complete token list.
                const lAmbiguityPathToken: Array<LexerToken<TTokenType>> = pTokenList.slice(lStartTokenIndex, lEndTokenIndex);

                // Build path string from lAmbiguityPathToken. 
                const lAmbiguityPathDescription: string = lAmbiguityPathToken.reduce((pPreviousValue: string, pCurrentValue: LexerToken<TTokenType>) => {
                    return `${pPreviousValue} ${pCurrentValue.value}(${pCurrentValue.type})`;
                }, '');

                // Add ambiguity path description to output list.
                lAmbiguityPathDescriptionList.push(`{${lAmbiguityPathDescription} }`);
            }

            // Throw error with all ambiguity paths.
            throw new Exception(`Graph has ambiguity paths. Values: [\n\t${lAmbiguityPathDescriptionList.join(',\n\t')}\n]`, this);
        }

        // Read first successfull chain result. At this point only one should remain.
        const lChainResult: ChainGraph = lChainResultList.at(0)!;
        return {
            nodeData: lChainResult.nodeValue,
            chainData: lChainResult.chainedValue
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

        // TODO: What this do?
        let lHasEmptyResult: boolean = false;

        // Find first node value result.
        const lNodeResultXXXXX: GraphParseResult | null = (() => {
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
                    lGraphErrors.onErrorMergeAndContinue(() => {
                        // Process inner value.
                        let lValueGraphResult: GraphParseResult;
                        if (lNodeValue instanceof GraphPartReference) {
                            // Call can fail:
                            // When it fails the graph reference set into pRecursionNodeChain persists for next node values until a node in another node value graph resolves into a value.
                            // This prevents other branches without or only optional nodes between the same reference to try to resolve the same graph reference.
                            // This includes looping nodes.
                            const lReferenceResult: GraphParseResult | null = this.parseGraph(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops + 1);
                            if (!lReferenceResult) {
                                // Build error list.
                                const lReferenceRecursionList: Array<string> = new Array<string>();
                                for (const lRecursionReference of pRecursionNodeChain) {
                                    lReferenceRecursionList.push(`Ref<${lRecursionReference.partName}>`);
                                }
    
                                // Add current reference to recursion error list.
                                lReferenceRecursionList.push(`Ref<${lNodeValue.partName}>`);
    
                                // Add potential error that prevents parsing.
                                lGraphErrors.appendError(`Infinite part reference recursion prevented for "${lReferenceRecursionList.join(' -> ')}".`, lCurrentToken);
                                return;
                            }
    
                            lValueGraphResult = lReferenceResult;
                        } else {
                            const lGraphParseResult: GraphNodeParseResult = this.parseGraphBranch(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops + 1);
    
                            // Parse empty GraphParseResult with undefined data.
                            lValueGraphResult = lGraphParseResult;
                        }
    
                        // Save if result list has an empty result.
                        lHasEmptyResult = lHasEmptyResult || !lValueGraphResult.tokenProcessed;
    
                        // Add graph result.
                        lResultList.push(lValueGraphResult);
                    });
                }
            }

            // No node value was found.
            return null;
        })();






        

        // Add single empty data when result was empty and node is optional.
        if (!pNode.required && !lHasEmptyResult) {
            lHasEmptyResult = true;

            lResultList.push({
                data: undefined,
                nextTokenIndex: pCurrentTokenIndex,
                tokenProcessed: false,
                hops: pGraphHops
            });
        }

        // When no result was added, node was required
        if (lResultList.length === 0) {
            throw lGraphErrors;
        }

        // Nothing to filter. Better performance than iterating each time.
        if (lResultList.length === 1 || !lHasEmptyResult) {
            return lResultList;
        }

        // Filter only one result with a tokenProcessed false.
        // Prevents optional nodes with optional graph references to keep ambiguity paths till the next branch. 
        return [
            // All graphs result with processed token.
            ...lResultList.filter((pItem) => { return pItem.tokenProcessed; }),

            // Single graph result without processed token and the lowest hop count.
            lResultList.filter((pItem) => { return !pItem.tokenProcessed; }).reduce((pPrevItem: GraphParseResult, pCurrentItem: GraphParseResult) => {
                return (pPrevItem.hops < pCurrentItem.hops) ? pPrevItem : pCurrentItem;
            })
        ];
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