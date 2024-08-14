import { Dictionary, Exception } from '@kartoffelgames/core';
import { GraphException, GraphParseError } from './exception/graph-exception';
import { ParserException } from './exception/parser-exception';
import { AnonymousGrammarNode } from './graph/node/anonymous-grammar-node';
import { BaseGrammarNode } from './graph/node/base-grammar-node';
import { GrammarNodeValueType } from './graph/node/grammer-node-value-type.enum';
import { GraphPart, GraphPartDataCollector } from './graph/part/graph-part';
import { GraphPartReference } from './graph/part/graph-part-reference';
import { Lexer } from './lexer/lexer';
import { LexerToken } from './lexer/lexer-token';

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
    private readonly mGraphParts: Dictionary<string, GraphPart<TTokenType>>;
    private readonly mLexer: Lexer<TTokenType>;
    private mMaxRecursion: number;
    private mRootPartName: string | null;


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
        this.mRootPartName = null;
        this.mGraphParts = new Dictionary<string, GraphPart<TTokenType>>();
    }

    /**
     * Create a new graph part that can be chained and references in other nodes or itself.
     * 
     * @param pPartName - Graph part name. Used for referencing,
     * @param pGraph - Graph part.
     * @param pDataCollector - Optional data collector that parses the parse result data into another type. 
     * 
     * @throws {@link Exception}
     * When the part name is already defined.
     */
    public defineGraphPart<TRawData extends object>(pPartName: string, pGraph: BaseGrammarNode<TTokenType, TRawData>, pDataCollector?: GraphPartDataCollector<TTokenType, TRawData>): void {
        if (this.mGraphParts.has(pPartName)) {
            throw new Exception(`Graph part "${pPartName}" already defined.`, this);
        }

        // Create and set graph part.
        const lGraphPart: GraphPart<TTokenType, TRawData> = new GraphPart<TTokenType, TRawData>(pGraph, pDataCollector);
        this.mGraphParts.set(pPartName, lGraphPart as GraphPart<TTokenType>);
    }

    /**
     * Get graph part by its name.
     * Validates existence.
     * 
     * @param pPartName - Part name.
     * 
     * @returns Graph part.  
     * 
     * @throws {@link Exception}
     * When the graph part does not exist.
     * 
     * @internal
     */
    public getGraphPart(pPartName: string): GraphPart<TTokenType> {
        if (!this.mGraphParts.has(pPartName)) {
            throw new Exception(`Path part "${pPartName}" not defined.`, this);
        }

        return this.mGraphParts.get(pPartName)!;
    }

    /**
     * Creates a new graph staring node.
     * This generated graph node must be chanined to not generate errors on parsing.
     * 
     * @returns new graph root.
     */
    public graph(): BaseGrammarNode<TTokenType> {
        return new AnonymousGrammarNode<TTokenType>();
    }

    /**
     * Parse a text with the set syntax from {@link CodeParser.setRootGraphPart} into a sytnax tree
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
        if (this.mRootPartName === null) {
            throw new Exception('Parser has not root part set.', this);
        }

        // Read complete token list.
        const lTokenList: Array<LexerToken<TTokenType>> = [...this.mLexer.tokenize(pCodeText)];

        // Create part reference.
        const lRootPartReference: GraphPartReference<TTokenType, unknown> = new GraphPartReference<TTokenType, unknown>(this, this.mRootPartName);

        let lRootParseData: GraphParseResult;
        try {
            // Parse root part. Start at 0 recursion level. Technicaly impossible to exit reference path because of recursion chain.
            lRootParseData = this.parseGraphReference(lRootPartReference, lTokenList, 0, new Set<GraphPartReference<TTokenType, unknown>>(), 0)!;
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
     * Generate a reference to a graph part.
     * The graph part doen't need to exist at this moment.
     * 
     * @param pPartName - Part name.
     * 
     * @returns Reference to the part. 
     */
    public partReference<TResult = unknown>(pPartName: string): GraphPartReference<TTokenType, TResult> {
        return new GraphPartReference<TTokenType, TResult>(this, pPartName);
    }

    /**
     * Set the root graph part of this parser.
     * 
     * @param pPartName - Graph part name.
     * 
     * @throws {@link Exception}
     * When the graph part is not defined or has no defined data collector.
     */
    public setRootGraphPart(pPartName: string): void {
        if (!this.mGraphParts.has(pPartName)) {
            throw new Exception(`Path part "${pPartName}" not defined.`, this);
        }

        // Validate that the root part has a data collector.
        if (!this.mGraphParts.get(pPartName)!.dataCollector) {
            throw new Exception(`A root graph part needs a defined data collector.`, this);
        }

        this.mRootPartName = pPartName;
    }

    /**
     * Merge chain and node data into one. 
     * Alters {@link pChainData} reference data.
     * 
     * @param pNode - Node configuration.
     * @param pChainData - Data that was collected from chained nodes.
     * @param pNodeData - Data of {@link pNode}
     * 
     * @returns Merged data from {@link pChainData} and {@link pNodeData}. 
     */
    private mergeNodeData(pNode: BaseGrammarNode<TTokenType>, pData: GraphChainResult): Record<string, unknown> {
        // Prefill chain data when it does not exists. When chain data is not empty, it is not null
        const lChainData: Record<string, unknown> = pData.chainData.data;

        // When no data has no identifier, nothing must be merged.
        if (!pNode.identifier) {
            return lChainData;
        }

        // Set as single value or list.
        if (pNode.valueType === GrammarNodeValueType.Single) {
            // Validate dublicate value identifier.
            if (pNode.identifier in lChainData) {
                throw new Exception(`Graph path has a dublicate value identifier "${pNode.identifier}"`, this);
            }

            if (!pNode.required && !pData.nodeData.tokenProcessed) {
                return lChainData;
            }

            // Overide value when set.
            lChainData[pNode.identifier] = pData.nodeData.data;
        } else { // pNode.valueType === GrammarNodeValueType.List
            let lIdentifierValue: unknown = lChainData[pNode.identifier];

            // Validate value identifier referes to a single value type.
            if (typeof lIdentifierValue !== 'undefined' && !Array.isArray(lIdentifierValue)) {
                throw new Exception(`Graph path has a dublicate value identifier "${pNode.identifier}" that is not a list value but should be.`, this);
            }

            // Validate if the array is initialized, when not do so.
            if (typeof lIdentifierValue === 'undefined') {
                // Init array and set it as identifier value.
                lIdentifierValue = new Array<unknown>();
                lChainData[pNode.identifier] = lIdentifierValue;
            }

            // Add value as array item but only when a value was set.
            if (pData.nodeData.tokenProcessed) {
                (<Array<unknown>>lIdentifierValue).unshift(pData.nodeData.data);
            }
        }

        return lChainData;
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
    private parseGraph(pGraph: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionNodeChain: Set<GraphPartReference<TTokenType, unknown>>, pGraphHops: number): GraphNodeParseResult {
        const lRootNode: BaseGrammarNode<TTokenType> = pGraph.branchRoot;

        return this.parseGraphNode(lRootNode, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops);
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
    private parseGraphNode(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionNodeChain: Set<GraphPartReference<TTokenType, unknown>>, pGraphHops: number): GraphNodeParseResult {
        // Parse and read current node values. Throws when no value was found and required.
        const lNodeValueParseResult: Array<GraphParseResult> = this.retrieveNodeValues(pNode, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops);

        // Parse and read data of chanined nodes. Add each error to the complete error list.
        const lChainParseResult: GraphChainResult = this.retrieveChainedValues(pNode, lNodeValueParseResult, pTokenList, pRecursionNodeChain);

        return {
            data: this.mergeNodeData(pNode, lChainParseResult),
            nextTokenIndex: lChainParseResult.chainData.nextTokenIndex,
            tokenProcessed: lChainParseResult.chainData.tokenProcessed || lChainParseResult.nodeData.tokenProcessed,
            hops: lChainParseResult.chainData.hops,
        };
    }

    /**
     * Parse the token, marked with {@link pCurrentTokenIndex} with the set graph part.
     * Return null when no token was processed.
     * 
     * @param pPartReference - Graph part or a reference to a part.
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
    private parseGraphReference(pPartReference: GraphPartReference<TTokenType, unknown>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionNodeChain: Set<GraphPartReference<TTokenType, unknown>>, pGraphHops: number): GraphParseResult | null {
        // When the reference was already used in the current recursion chain and since the last time the cursor was not moved, continue.
        // This breaks an endless recursion loop where eighter a reference is calling itself directly or between this and the last invoke only optional nodes without any found value were used.
        if (pRecursionNodeChain.has(pPartReference)) {
            return null;
        }

        // Read referenced root node and optional data collector.
        const lGraphPart: GraphPart<TTokenType, object> = pPartReference.resolveReference();
        const lCollector: GraphPartDataCollector<TTokenType, object> | null = lGraphPart.dataCollector;

        // Only graph references can have a infinite recursion, so we focus on these.
        pRecursionNodeChain.add(pPartReference);

        // Parse graph node, returns empty when graph has no value and was optional
        const lNodeParseResult: GraphNodeParseResult = this.parseGraph(lGraphPart.graph, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops);

        // Remove graph recursion entry after using graph.
        pRecursionNodeChain.delete(pPartReference);

        // Read start end end token.
        const lStartToken: LexerToken<TTokenType> = pTokenList.at(pCurrentTokenIndex)!;
        const lEndToken: LexerToken<TTokenType> = pTokenList.at(lNodeParseResult.nextTokenIndex - 1)!;

        // Execute optional collector.
        let lResultData: unknown = lNodeParseResult.data;
        if (lCollector) {
            try {
                lResultData = lCollector(lNodeParseResult.data, lStartToken, lEndToken);
            } catch (pError: any) {
                // Rethrow parser exception.
                if (pError instanceof ParserException) {
                    throw pError;
                }

                const lMessage: string = typeof pError === 'object' && pError !== null && 'message' in pError ? pError.message : pError.toString();

                // When no token was processed, throw default error on first token.
                throw ParserException.fromToken(lMessage, this, lStartToken, lEndToken);
            }
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
    private retrieveChainedValues(pNode: BaseGrammarNode<TTokenType>, pNodeValues: Array<GraphParseResult>, pTokenList: Array<LexerToken<TTokenType>>, pRecursionNodeChain: Set<GraphPartReference<TTokenType, unknown>>): GraphChainResult {
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
    private retrieveNodeValues(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionNodeChain: Set<GraphPartReference<TTokenType, unknown>>, pGraphHops: number): Array<GraphParseResult> {
        // Read next token.
        const lCurrentToken: LexerToken<TTokenType> | undefined = pTokenList.at(pCurrentTokenIndex);

        // Error buffer. Bundles all parser errors so on an error case an detailed error detection can be made.
        const lGraphErrors: GraphException<TTokenType> = new GraphException<TTokenType>();

        // Process each node value.
        let lHasEmptyResult: boolean = false;
        const lResultList: Array<GraphParseResult> = new Array<GraphParseResult>();
        for (const lNodeValue of pNode.nodeValues) {
            // Static token type of dynamic graph part.
            if (typeof lNodeValue === 'string') {
                // When no current token was found, skip node value parsing.
                if (!lCurrentToken) {
                    // Append error when node was required.
                    if (pNode.required) {
                        lGraphErrors.appendError(`Unexpected end of statement. TokenIndex: "${pCurrentTokenIndex}" missing.`, pTokenList.at(-1));
                    }

                    continue;
                }

                // Push possible parser error when token type does not match node value.
                if (lNodeValue !== lCurrentToken.type) {
                    if (pNode.required) {
                        lGraphErrors.appendError(`Unexpected token. "${lNodeValue}" expected`, lCurrentToken);
                    }

                    continue;
                }

                // Set node value.
                lResultList.push({
                    data: lCurrentToken.value,
                    nextTokenIndex: pCurrentTokenIndex + 1,
                    tokenProcessed: true,
                    hops: pGraphHops + 1
                });
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
                        const lReferenceResult: GraphParseResult | null = this.parseGraphReference(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops + 1);
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
                        const lGraphParseResult: GraphNodeParseResult = this.parseGraph(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionNodeChain, pGraphHops + 1);

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
    data: Record<string, unknown>;
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