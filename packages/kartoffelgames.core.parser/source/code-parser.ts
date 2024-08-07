import { Dictionary, Exception, Stack } from '@kartoffelgames/core';
import { GraphParseError, GraphException } from './exception/graph-exception';
import { ParserException } from './exception/parser-exception';
import { AnonymoutGrammarNode } from './graph/node/anonymous-grammar-node';
import { BaseGrammarNode } from './graph/node/base-grammar-node';
import { GrammarBranchNode } from './graph/node/grammer-branch-node';
import { GrammarLoopNode } from './graph/node/grammer-loop-node';
import { GrammarNodeValueType } from './graph/node/grammer-node-value-type.enum';
import { GrammarSingleNode } from './graph/node/grammer-single-node';
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
    public defineGraphPart(pPartName: string, pGraph: BaseGrammarNode<TTokenType>, pDataCollector?: GraphPartDataCollector): void {
        if (this.mGraphParts.has(pPartName)) {
            throw new Exception(`Graph part "${pPartName}" already defined.`, this);
        }

        // Create and set graph part.
        const lGraphPart: GraphPart<TTokenType> = new GraphPart<TTokenType>(pGraph, pDataCollector);
        this.mGraphParts.set(pPartName, lGraphPart);
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
        return new AnonymoutGrammarNode<TTokenType>();
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
        const lRootPartReference: GraphPartReference<TTokenType> = new GraphPartReference<TTokenType>(this, this.mRootPartName);

        let lRootParseData: GraphParseResult;
        try {
            // Parse root part. Start at 0 recursion level.
            lRootParseData = this.parseGraphReference(lRootPartReference, lTokenList, 0, new Stack<BaseGrammarNode<TTokenType>>());
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
    public partReference(pPartName: string): GraphPartReference<TTokenType> {
        return new GraphPartReference<TTokenType>(this, pPartName);
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
     * @param pRecursionItem - Recursion tracker item. Tracks depth and potential loops of recursion.
     * 
     * @returns The Token data object with all parsed brother node token data merged. Additionally the last used token index is returned.
     * When the parsing fails for this node or a brother node, a complete list with all potential errors are returned instead of the token data.
     */
    private parseGraph(pGraph: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionItem: GraphRecursionStack<TTokenType>): GraphNodeParseResult {
        const lRootNode: BaseGrammarNode<TTokenType> = pGraph.branchRoot;

        return this.parseGraphNode(lRootNode, pTokenList, pCurrentTokenIndex, pRecursionItem);
    }

    /**
     * Parse the token, marked with {@link pCurrentTokenIndex} with the set node.
     * Also parses chained nodes.
     * Returns null when the complete node graph chain processed no token.
     * 
     * @param pNode - Current node that should handle the set token.
     * @param pTokenList - Current parsed list of all token in appearing order.
     * @param pCurrentTokenIndex - Current token index that should be parsed with the node.
     * @param pRecursionItem - Recursion tracker item. Tracks depth and potential loops of recursion.
     * 
     * @returns The Token data object with all parsed brother node token data merged. Additionally the last used token index is returned.
     * When the parsing fails for this node or a brother node, a complete list with all potential errors are returned instead of the token data.
     */
    private parseGraphNode(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionItem: GraphRecursionStack<TTokenType>): GraphNodeParseResult {
        // Increase recursion level.
        const lRecursionItem: GraphRecursionStack<TTokenType> = this.stackRecursion(pRecursionItem, pNode);

        // Parse and read current node values. Throws when no value was found and required.
        const lNodeValueParseResult: Array<GraphParseResult> = this.retrieveNodeValues(pNode, pTokenList, pCurrentTokenIndex, lRecursionItem);

        // Parse and read data of chanined nodes. Add each error to the complete error list.
        const lChainParseResult: GraphChainResult = this.retrieveChainedValues(pNode, lNodeValueParseResult, pTokenList, lRecursionItem);

        return {
            data: this.mergeNodeData(pNode, lChainParseResult),
            nextTokenIndex: lChainParseResult.chainData.nextTokenIndex,
            tokenProcessed: lChainParseResult.chainData.tokenProcessed || lChainParseResult.nodeData.tokenProcessed
        };
    }

    /**
     * Parse the token, marked with {@link pCurrentTokenIndex} with the set graph part.
     * Return null when no token was processed.
     * 
     * @param pPartReference - Graph part or a reference to a part.
     * @param pTokenList - Current parsed list of all token in appearing order..
     * @param pCurrentTokenIndex - Current token index that should be parsed with the graph part.
     * @param pRecursionItem - Recursion tracker item. Tracks depth and potential loops of recursion.
     *  
     * @returns The Token data object, or when the graph part has a data collector, the collected and altered data object is returned.
     * Additionally the last used token index is returned.
     * When the parsing fails for this graph part, a complete list with all potential errors are returned instead of the pared data.
     * 
     * @throws {@link ParserException}
     * When an error is thrown while paring collected data.
     */
    private parseGraphReference(pPartReference: GraphPartReference<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionItem: GraphRecursionStack<TTokenType>): GraphParseResult {
        // Read referenced root node and optional data collector.
        const lGraphPart: GraphPart<TTokenType> = pPartReference.resolveReference();
        const lRootNode: BaseGrammarNode<TTokenType> = lGraphPart.graph;
        const lCollector: GraphPartDataCollector | null = lGraphPart.dataCollector;

        // Parse graph node, returns empty when graph has no value and was optional
        const lNodeParseResult: GraphNodeParseResult = this.parseGraphNode(lRootNode, pTokenList, pCurrentTokenIndex, pRecursionItem);

        // Execute optional collector.
        let lResultData: unknown = lNodeParseResult.data;
        if (lCollector) {
            try {
                lResultData = lCollector(lNodeParseResult.data);
            } catch (pError: any) {
                // Rethrow parser exception.
                if (pError instanceof ParserException) {
                    throw pError;
                }

                const lMessage: string = typeof pError === 'object' && pError !== null && 'message' in pError ? pError.message : pError.toString();

                // Read start end end token.
                const lErrorStartToken: LexerToken<TTokenType> | undefined = pTokenList.at(pCurrentTokenIndex);
                const lErrorEndToken: LexerToken<TTokenType> | undefined = pTokenList.at(lNodeParseResult.nextTokenIndex - 1);

                // When no token was processed, throw default error on first token.
                throw ParserException.fromToken(lMessage, this, lErrorStartToken, lErrorEndToken);
            }
        }

        return {
            data: lResultData,
            nextTokenIndex: lNodeParseResult.nextTokenIndex,
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
     * @param pRecursionItem - Recursion tracker item. Tracks depth and potential loops of recursion.
     * 
     * @returns The data of the successfull graph value chain or null when no token was processed.
     * 
     * @throws {@link Exception}
     * When more than one node value chain resolves to be valid.
     * 
     * @throws {@link GraphException}
     * When no valid token for the next chaining node was found.
     */
    private retrieveChainedValues(pNode: BaseGrammarNode<TTokenType>, pNodeValues: Array<GraphParseResult>, pTokenList: Array<LexerToken<TTokenType>>, pRecursionItem: GraphRecursionStack<TTokenType>): GraphChainResult {
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
                            tokenProcessed: false
                        },
                        loopNode: false
                    });
                    continue;
                }

                // Skip endless loops by preventing the same optional node chaining itself.
                if (!lNodeValue.tokenProcessed && lChainedNode === pNode) {
                    continue;
                }

                // Try to parse next graph node saves all errors on exception.
                lGraphErrors.onErrorMergeAndContinue(() => {
                    // Parse chained node.
                    const lChainedNodeParseResult: GraphNodeParseResult = this.parseGraphNode(lChainedNode, pTokenList, lNodeValue.nextTokenIndex, pRecursionItem);

                    // Process graph with chained node values.
                    lChainList.push({
                        nodeValue: lNodeValue,
                        chainedValue: lChainedNodeParseResult,
                        loopNode: lChainedNode === pNode,
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

            // Prefere chains with node value with processed token.
            const lProcessedNodeValue: Array<ChainGraph> = lFilterdValues.filter((pResult: ChainGraph) => { return pResult.nodeValue.tokenProcessed; });
            if (lProcessedNodeValue.length !== 0) {
                lFilterdValues = lProcessedNodeValue;
            }

            // Filter all full-optional chains that had no processed token. This Prevent ambiguity paths triggering when the optional chain "failed".
            // Keep the "failed" optional chains, when no none-optional chain exists.
            const lNoOptionalChainList: Array<ChainGraph> = lFilterdValues.filter((pResult: ChainGraph) => { return pResult.chainedValue.tokenProcessed; });
            if (lNoOptionalChainList.length !== 0) {
                lFilterdValues = lNoOptionalChainList;
            }

            // Enforce greedy loops, Allways choose looped chains over static chains.
            // When a static and a loop chain exists it does not count as ambiguity paths.
            const lLoopChainList: Array<ChainGraph> = lFilterdValues.filter((pResult: ChainGraph) => { return pResult.loopNode; });
            if (lLoopChainList.length !== 0) {
                lFilterdValues = lLoopChainList;
            }

            // When chain contains empty values at this point, no none empty where found.
            // When a optional exists, take the first one. They all should have the same null data and token index.
            const lOnlyOptionalList: Array<ChainGraph> = lFilterdValues.filter((pResult: ChainGraph) => { return !pResult.chainedValue.tokenProcessed; });
            if (lOnlyOptionalList.length !== 0) {
                lFilterdValues = lOnlyOptionalList.slice(0, 1);
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
     * @param pRecursionItem - Recursion tracker item. Tracks depth and potential loops of recursion.
     * 
     * @throws {@link GraphException}
     * When no value was found but the node is required.
     * 
     * @returns all valid node values or null when no valid token was found but {@link pNode} is optional.
     */
    private retrieveNodeValues(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionItem: GraphRecursionStack<TTokenType>): Array<GraphParseResult> {
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
                    tokenProcessed: true
                });
            } else {
                // Try to retrieve values from graphs.
                lGraphErrors.onErrorMergeAndContinue(() => {
                    // Process inner value.
                    let lValueGraphResult: GraphParseResult;
                    if (lNodeValue instanceof GraphPartReference) {
                        lValueGraphResult = this.parseGraphReference(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionItem);
                    } else {
                        const lGraphParseResult: GraphNodeParseResult = this.parseGraph(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionItem);

                        // Save if result list has an empty result.
                        lHasEmptyResult = lHasEmptyResult || !lGraphParseResult.tokenProcessed;

                        // Parse empty GraphParseResult with undefined data.
                        lValueGraphResult = {
                            data: lGraphParseResult.data,
                            nextTokenIndex: lGraphParseResult.nextTokenIndex,
                            tokenProcessed: lGraphParseResult.tokenProcessed,
                        };
                    }

                    // Adds null when the graph was full optional.
                    lResultList.push(lValueGraphResult);
                });
            }
        }

        // Add single empty data when result was empty and node is optional.
        if (!pNode.required && !lHasEmptyResult) {
            lResultList.push({
                data: undefined,
                nextTokenIndex: pCurrentTokenIndex,
                tokenProcessed: false
            });
        }

        // When no result was added, node was required
        if (lResultList.length === 0) {
            throw lGraphErrors;
        }

        return lResultList;
    }

    /**
     * Stack up recursion level.
     * Validates current resursion level and throws an error when it has exceeded the set max recursion level.
     * 
     * @param pRecursionStack - Current recursion stack.
     * @param pPart - Current resolved graph part.
     * 
     * @throws {@link Exception} 
     * When recursion level exceeded set max recursion count. 
     * 
     * @returns Incremented resursion level. 
     */
    private stackRecursion(pRecursionStack: GraphRecursionStack<TTokenType>, pPart: BaseGrammarNode<TTokenType>): GraphRecursionStack<TTokenType> {
        const lRecursionStack: Stack<BaseGrammarNode<TTokenType>> = pRecursionStack.clone();

        // Increase recursion level and add part reference to recursion stack.
        lRecursionStack.push(pPart);

        // Throw exception when stack exceeds recursion count.
        if (lRecursionStack.size > this.mMaxRecursion) {
            const lRecursionChain: Array<BaseGrammarNode<TTokenType>> = new Array<BaseGrammarNode<TTokenType>>();

            /* Set recursion chain twice as long as found loop length.
             *
             * Save any referenced nodes in a set, so i can only hold a node only once.
             * The recursion chain, is set to  be twice as long as the count of any unique node in the loop or no stack is left.
             * So the actual loop is displayed at least once but optionaly exactly two times.
             * 
             * When the loop starts, at lease one reference should be added (size === 0).
             */
            const lRecursionReferences: Set<BaseGrammarNode<TTokenType>> = new Set<BaseGrammarNode<TTokenType>>();
            while ((lRecursionReferences.size === 0 || (lRecursionReferences.size * 2) > lRecursionChain.length) && !!lRecursionStack.top) {
                // Set current chain item as processed reference.
                lRecursionReferences.add(lRecursionStack.top);

                // Set current recursion item to chain.
                lRecursionChain.push(lRecursionStack.top);

                // Read next chain item.
                lRecursionStack.pop();
            }

            // Construct recursion loop name data. Reverse list to set actual call order.
            const lPartNameList: Array<string> = [...lRecursionChain].map((pPart: BaseGrammarNode<TTokenType>) => {
                // Get graph name based on type.
                let lNodeName!: string;
                switch (true) {
                    case pPart instanceof GrammarBranchNode: {
                        lNodeName = `Branch`;
                        break;
                    }
                    case pPart instanceof GrammarLoopNode: {
                        lNodeName = `Loop`;
                        break;
                    }
                    case pPart instanceof GrammarSingleNode: {
                        lNodeName = `Single`;
                        break;
                    }
                }

                // Resolve part value names.
                const lValueNames: Array<string> = pPart.nodeValues.map((pValue) => {
                    switch (true) {
                        case pValue instanceof GraphPartReference: {
                            return `<REF:${pValue.partName}>`;
                        }
                        case pValue instanceof BaseGrammarNode: {
                            return '<NODE>';
                        }
                        default: {
                            return pValue.toString();
                        }
                    }
                });

                // Append optional status to name.
                if (!pPart.required) {
                    lNodeName = 'Optional-' + lNodeName;
                }

                return `${lNodeName}(${pPart.identifier ?? ''})[${lValueNames.join(', ')}]`;
            });
            lPartNameList.reverse();

            // Throw recursion error.
            throw new Exception(`Circular dependency detected between: ${lPartNameList.join(' -> ')}`, this);
        }

        return lRecursionStack;
    }
}

type ChainGraph = {
    nodeValue: GraphParseResult;
    chainedValue: GraphNodeParseResult;
    loopNode: boolean;
};

type GraphNodeParseResult = {
    data: Record<string, unknown>;
    nextTokenIndex: number;
    tokenProcessed: boolean;
};

type GraphParseResult = {
    data: unknown;
    nextTokenIndex: number;
    tokenProcessed: boolean;
};

type GraphChainResult = {
    nodeData: GraphParseResult;
    chainData: GraphNodeParseResult;
};

type GraphRecursionStack<TTokenType extends string> = Stack<BaseGrammarNode<TTokenType>>;