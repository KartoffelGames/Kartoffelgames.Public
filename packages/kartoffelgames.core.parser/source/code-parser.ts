import { Dictionary, Exception, Stack } from '@kartoffelgames/core.data';
import { GraphParseError, GrapthException } from './exception/graph-exception';
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
     * Create a new graph part that can be chained and references in other branches or itself.
     * 
     * @param pPartName - Graph part name. Used for referencing,
     * @param pBranch - Graph part branch.
     * @param pDataCollector - Optional data collector that parses the parse result data into another type. 
     * 
     * @throws {@link Exception}
     * When the part name is already defined.
     */
    public defineGraphPart(pPartName: string, pBranch: BaseGrammarNode<TTokenType>, pDataCollector?: GraphPartDataCollector): void {
        if (this.mGraphParts.has(pPartName)) {
            throw new Exception(`Graph part "${pPartName}" already defined.`, this);
        }

        // Create and set graph part.
        const lGraphPart: GraphPart<TTokenType> = new GraphPart<TTokenType>(pBranch, pDataCollector);
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
     * Creates a new graph branch.
     * This generated graph node must be chanined to not generate errors on parsing.
     * 
     * @returns new branch root.
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

        let lRootParseData: GraphPartParseResult | null;
        try {
            // Parse root part. Start at 0 recursion level.
            lRootParseData = this.parseGraphReference(lRootPartReference, lTokenList, 0, new Stack<BaseGrammarNode<TTokenType>>());
        } catch (pException) {
            // Only handle exclusive grapth errors.
            if (!(pException instanceof GrapthException)) {
                throw pException;
            }

            // Find error with the latest error position.
            const lErrorPosition: GraphParseError<TTokenType> = pException.mostRelevant();

            // At lease one error must be found.
            throw ParserException.fromToken(lErrorPosition!.message, this, lErrorPosition!.errorToken, lErrorPosition!.errorToken);
        }

        // Convert parse data of null into index 0 token index. Null means no token was processed.
        let lCurrentProcessedTokenIndex: number = 0;
        if (lRootParseData) {
            lCurrentProcessedTokenIndex = lRootParseData.tokenIndex;
        }

        // Validate, that every token was parsed.
        if (lCurrentProcessedTokenIndex < (lTokenList.length - 1)) {
            // Find current token. 
            const lLastToken: LexerToken<TTokenType> = lTokenList.at(-1)!;

            // Token index can't be less than zero.  When it fails on the first token, GraphPartParseResult is null. 
            // It allways has a next index when not all token are used.
            const lNextToken: LexerToken<TTokenType> = lTokenList[lCurrentProcessedTokenIndex + 1]!;

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

    private mergeNodeData(pNode: BaseGrammarNode<TTokenType>, pChainData: Record<string, unknown> | null, pNodeData: unknown | null): Record<string, unknown> | null {


        // Merge data. Current node data into chained node data.
        // Merge only when the current node has a value (not optional/skipped) and has a identifier.
        if (pNode.identifier) {
            // Set as single value or list.
            if (pNode.valueType === GrammarNodeValueType.Single && typeof pNodeData !== 'undefined') {
                // Validate dublicate value identifier.
                if (pNode.identifier in pChainData) {
                    throw new Exception(`Grapth path has a dublicate value identifier "${pNode.identifier}"`, this);
                }

                // Overide value when set.
                pChainData[pNode.identifier] = pNodeData;
            } else if (pNode.valueType === GrammarNodeValueType.List) {
                let lIdentifierValue: unknown = pChainData[pNode.identifier];

                // Validate value identifier referes to a single value type.
                if (typeof lIdentifierValue !== 'undefined' && !Array.isArray(lIdentifierValue)) {
                    throw new Exception(`Grapth path has a dublicate value identifier "${pNode.identifier}" that is not a list value but should be.`, this);
                }

                // Validate if the array is initialized, when not do so.
                if (typeof lIdentifierValue === 'undefined') {
                    // Init array and set it as identifier value.
                    lIdentifierValue = new Array<unknown>();
                    pChainData[pNode.identifier] = lIdentifierValue;
                }

                // Add value as array item and set, but only when a value was set.
                if (typeof pNodeData !== 'undefined') {
                    (<Array<unknown>>lIdentifierValue).unshift(pNodeData);
                }
            }
        }
    }

    /**
     * Parse the token, marked with {@link pCurrentTokenIndex} with the set node.
     * Returns null when the complete node path processed no token.
     * 
     * @param pNode - Current node that should handle the set token.
     * @param pTokenList - Current parsed list of all token in appearing order.
     * @param pCurrentTokenIndex - Current token index that should be parsed with the node.
     * 
     * @returns The Token data object with all parsed brother node token data merged. Additionally the last used token index is returned.
     * When the parsing fails for this node or a brother node, a complete list with all potential errors are returned instead of the token data.
     */
    private parseGraphNode(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionItem: GrapthRecursionStack<TTokenType>): GraphNodeParseResult | null {
        // Increase recursion level.
        const lRecursionItem: GrapthRecursionStack<TTokenType> = this.stackRecursion(pRecursionItem, pNode);

        // Parse and read current node values. Add each error to the complete error list.
        const lNodeValueParseResult: Array<GraphNodeValueParseResult> | null = this.retrieveNodeValues(pNode, pTokenList, pCurrentTokenIndex, lRecursionItem);

        // Parse and read data of chanined nodes. Add each error to the complete error list.
        // When result is empty, return empty.
        const lChainParseResult: GraphBranchResult | null = this.retrieveChainedValues(pNode, lNodeValueParseResult, pTokenList, lRecursionItem);

        // TODO: Return null when lNodeValueParseResult and lChainParseResult is null.

        return {
            data: this.mergeNodeData(pNode, lChainParseResult.chainData, lChainParseResult.nodeData),
            tokenIndex: lChainParseResult.tokenIndex
        };
    }

    /**
     * Parse the token, marked with {@link pCurrentTokenIndex} with the set graph part.
     * 
     * @param pPart - Graph part or a reference to a part.
     * @param pTokenList - Current parsed list of all token in appearing order..
     * @param pCurrentTokenIndex - Current token index that should be parsed with the graph part.
     *  
     * @returns The Token data object, or when the graph part has a data collector, the collected and altered data object is returned.
     * Additionally the last used token index is returned.
     * When the parsing fails for this graph part, a complete list with all potential errors are returned instead of the pared data.
     */
    private parseGraphReference(pPart: GraphPartReference<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionItem: GrapthRecursionStack<TTokenType>): GraphPartParseResult {
        // Read reference or read branch root of part node.
        const lGraphPart: GraphPart<TTokenType> = pPart.resolveReference();
        const lRootNode: BaseGrammarNode<TTokenType> = lGraphPart.graph;
        const lCollector: GraphPartDataCollector | null = lGraphPart.dataCollector;

        // Parse branch, return empty when branch has no value.
        const lBranchResult: GraphNodeParseResult | null = this.parseGraphNode(lRootNode, pTokenList, pCurrentTokenIndex, pRecursionItem);

        // Execute optional collector.
        let lResultData: Record<string, unknown> | unknown = lBranchResult.data;
        if (lCollector) {
            try {
                lResultData = lCollector(lResultData);
            } catch (pError: any) {
                // Rethrow parser exception.
                if (pError instanceof ParserException) {
                    throw pError;
                }

                const lMessage: string = typeof pError === 'object' && pError !== null && 'message' in pError ? pError.message : pError.toString();

                // Read start end end token.
                const lErrorStartToken: LexerToken<TTokenType> | undefined = pTokenList.at(pCurrentTokenIndex);
                const lErrorEndToken: LexerToken<TTokenType> | undefined = pTokenList.at(lBranchResult.tokenIndex);

                // When no token was processed, throw default error on first token.
                if (!lErrorStartToken || !lErrorEndToken) {
                    throw new ParserException(lMessage, this, 1, 1, 1, 1);
                } else {
                    throw ParserException.fromToken(lMessage, this, lErrorStartToken, lErrorEndToken);
                }
            }
        }

        return {
            data: lResultData,
            tokenIndex: lBranchResult.tokenIndex
        };
    }

    /**
     * Processes every branch value, a successfull parsed value of a node, until only one is successfull or a branch end is reached.
     * When more than one branch is successfull, the graph is invalid and an error is thrown.
     * 
     * @param pNode - Current node.
     * @param pBranchValues - Every sucessfull value of the node. 
     * @param pTokenList - Current parsed list of all token in appearing order.
     * 
     * @returns The data of the successfull branch and a list of all errors that can be important for later nodes.
     * 
     * @throws {@link Exception}
     * When more than one branch resolves to be valid.
     */
    private retrieveChainedValues(pNode: BaseGrammarNode<TTokenType>, pBranchValues: Array<GraphNodeValueParseResult> | null, pTokenList: Array<LexerToken<TTokenType>>, pRecursionItem: GrapthRecursionStack<TTokenType>): GraphBranchResult {
        const lGrapthErrors: GrapthException<TTokenType> = new GrapthException<TTokenType>();

        type ChainResult = {
            chainedValue: GraphNodeParseResult | null;
            chainnode: BaseGrammarNode<TTokenType> | null;
            branchValue: GraphNodeValueParseResult;
        };

        let lResultList: Array<ChainResult> = new Array<ChainResult>();
        // Process chained nodes in parallel.
        for (const lChainedNode of pNode.next()) {
            // Skip endless loops by preventing the same optional node chaining itself.
            if (pBranchValues === null && lChainedNode === pNode) {
                continue;
            }

            // Run chained node parse for each branch value and check for dublicates after that.
            for (const lBranch of pBranchValues) {

                // Branch end. No chaining value.
                if (lChainedNode === null) {
                    lResultList.push({
                        chainnode: lChainedNode,
                        chainedValue: null,
                        branchValue: lBranch
                    });
                    continue;
                }

                try {
                    // Parse chained node. Save all errors.
                    const lChainedNodeParseResult: GraphNodeParseResult = this.parseGraphNode(lChainedNode, pTokenList, lBranch.tokenIndex + 1, pRecursionItem);

                    // Process branch with chained node values and a new token.
                    lResultList.push({
                        chainnode: lChainedNode,
                        chainedValue: lChainedNodeParseResult,
                        branchValue: lBranch
                    });
                } catch (pException) {
                    // Only handle exclusive grapth errors.
                    if (!(pException instanceof GrapthException)) {
                        throw pException;
                    }

                    // When unsuccessfull save the last error.
                    lGrapthErrors.merge(pException);
                    continue;
                }
            }
        }

        // Check for ambiguity paths.
        if (lResultList.filter((pResult: ChainResult) => { return pResult.chainedValue !== null; }).length > 1) {
            // When a loop node exists use only this looping nodes, omit any other node.
            const lLoopNodeList: Array<ChainResult> = lResultList.filter((pResult: ChainResult) => { return pResult.chainedValue !== null && pResult.chainnode === pNode; });
            if (lLoopNodeList.length > 0) {
                lResultList = lLoopNodeList;
            }

            // Validate if ambiguity paths still exists.
            const lAmbiguityPathList: Array<ChainResult> = lResultList.filter((pResult) => { return pResult.chainedValue !== null; });
            if (lAmbiguityPathList.length > 1) {
                // Recreate token path of every ambiguity path.
                const lAmbiguityPathDescriptionList: Array<string> = new Array<string>();
                for (const lAmbiguityPath of lAmbiguityPathList) {
                    const lAmbiguityPathDescription: string = pTokenList.slice(lAmbiguityPath.branchValue.tokenIndex - 1, lAmbiguityPath.chainedValue!.tokenIndex + 1)
                        .reduce((pPreviousValue: string, pCurrentValue: LexerToken<TTokenType>) => {
                            return `${pPreviousValue} ${pCurrentValue.value}(${pCurrentValue.type})`;
                        }, '');

                    // Iterate over all token and save each of the path.
                    lAmbiguityPathDescriptionList.push(`{${lAmbiguityPathDescription} }`);
                }

                throw new Exception(`Graph has ambiguity paths. Values: [\n\t${lAmbiguityPathDescriptionList.join(',\n\t')}\n]`, this);
            }
        }

        // Read single branching result. Polyfill in missing values or when no result exists, use no result. 
        let lBranchingResult: GraphBranchResult | null = null;
        if (lResultList.length > 0) {
            // Find sucessfull branch value or when is does not exists, go for the branch end. At least one of these exists.
            const lBranchValues: ChainResult = lResultList.find((pResult) => { return pResult.chainedValue !== null; }) ?? lResultList.find((pResult) => { return pResult.chainedValue === null; })!;

            // Read last used token index of branch and polyfill branch data when this node was the last node of this branch.
            lBranchingResult = {
                nodeData: lBranchValues.branchValue.data,
                chainData: lBranchValues.chainedValue?.data ?? {},
                tokenIndex: lBranchValues.chainedValue?.tokenIndex ?? lBranchValues.branchValue.tokenIndex
            };
        }

        // Throw error list when no result was found.
        if (lBranchingResult === null) {
            throw lGrapthErrors;
        }

        return lBranchingResult;
    }

    /**
     * Read data and errors for all node values. 
     * Adds an empty data result, when the node is optional and no token was found
     * or when the node is optional and no node value fits the current token.
     * 
     * The error list contains every possible error.
     * 
     * @param pNode - Current node.
     * @param pTokenList - Current parsed list of all token in appearing order.
     * @param pCurrentTokenIndex - Current token index that should be parsed with the graph part.
     * 
     * @returns A error and a result list.
     */
    private retrieveNodeValues(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number, pRecursionItem: GrapthRecursionStack<TTokenType>): Array<GraphNodeValueParseResult> | null {
        // Read next token.
        const lCurrentToken: LexerToken<TTokenType> | undefined = pTokenList.at(pCurrentTokenIndex);

        // When no current token was found. Skip node value parsing for optional nodes.
        if (!lCurrentToken && !pNode.required) {
            return null;
        }

        // Error buffer. Bundles all parser errors so on an error case an detailed error detection can be made.
        const lGrapthErrors: GrapthException<TTokenType> = new GrapthException<TTokenType>();
        const lResultList: Array<GraphNodeValueParseResult> = new Array<GraphNodeValueParseResult>();

        // Process each node value.
        for (const lNodeValue of pNode.nodeValues) {
            let lNodeParseValue: GraphNodeValueParseResult;

            // Static token type of dynamic graph part.
            if (typeof lNodeValue === 'string') {
                // When no current token was found. Skip node value parsing.
                if (!lCurrentToken) {
                    lGrapthErrors.appendError(`Unexpected end of statement. TokenIndex: "${pCurrentTokenIndex}" missing.`, pTokenList.at(-1));
                    continue;
                }

                // Push possible parser error when token type does not match node value.
                if (lNodeValue !== lCurrentToken.type) {
                    lGrapthErrors.appendError(`Unexpected token. "${lNodeValue}" expected`, lCurrentToken);
                    continue;
                }

                // Set node value.
                lNodeParseValue = {
                    data: lCurrentToken.value,
                    tokenIndex: pCurrentTokenIndex
                };
            } else {
                try {
                    // Process inner value but keep on current node.
                    let lInnerValue: GraphPartParseResult;
                    if (lNodeValue instanceof GraphPartReference) {
                        lInnerValue = this.parseGraphReference(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionItem);
                    } else {
                        lInnerValue = this.parseGraphNode(lNodeValue, pTokenList, pCurrentTokenIndex, pRecursionItem);
                    }

                    // TODO: Sometimes, this shouldn't be data. It can return null.

                    lNodeParseValue = {
                        data: lInnerValue.data,
                        tokenIndex: lInnerValue.tokenIndex
                    };
                } catch (pException) {
                    // Only handle exclusive grapth errors.
                    if (!(pException instanceof GrapthException)) {
                        throw pException;
                    }

                    // When unsuccessfull save the last error.
                    lGrapthErrors.merge(pException);
                    continue;
                }
            }

            lResultList.push(lNodeParseValue);
        }

        // Add empty GraphNodeValueParseResult when the node is optional and the node value has no positive result.
        if (lResultList.length === 0) {
            // Throw error list when no result was found.
            if (pNode.required) {
                throw lGrapthErrors;
            }

            return null;
        }

        return lResultList;
    }

    /**
     * Stack up recursion level.
     * Validates current resursion level and throws an error when it has exceeded the set max recursion level.
     * 
     * @param pRecursionLevel - Current recursion level.
     * @param pRecursionStack - Current recursion stack.
     * @param pPart - Current resolved graph part.
     * 
     * @throws {@link Exception} 
     * When recursion level exceeded set max recursion count. 
     * 
     * @returns Incremented resursion level. 
     */
    private stackRecursion(pRecursionStack: GrapthRecursionStack<TTokenType>, pPart: BaseGrammarNode<TTokenType>): GrapthRecursionStack<TTokenType> {
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
                // Part references are resolved by name.
                if (pPart instanceof GraphPartReference) {
                    return `Part(${pPart.partName})`;
                }

                // Get graph name based on type.
                let lBranchName: string;
                switch (true) {
                    case pPart instanceof GrammarBranchNode: {
                        lBranchName = `Branch`;
                        break;
                    }
                    case pPart instanceof GrammarLoopNode: {
                        lBranchName = `Loop`;
                        break;
                    }
                    case pPart instanceof GrammarSingleNode: {
                        lBranchName = `Single`;
                        break;
                    }
                    default: {
                        lBranchName = `Unknown`;
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
                    lBranchName = 'Optional-' + lBranchName;
                }

                return `${lBranchName}(${pPart.identifier ?? ''})[${lValueNames.join(', ')}]`;
            });
            lPartNameList.reverse();

            // Throw recursion error.
            throw new Exception(`Circular dependency detected between: ${lPartNameList.join(' -> ')}`, this);
        }

        return lRecursionStack;
    }
}

type GraphNodeParseResult = {
    data: Record<string, Array<unknown> | unknown>;
    tokenIndex: number;
};

type GraphPartParseResult = {
    data: unknown;
    tokenIndex: number;
};

type GraphNodeValueParseResult = {
    data: unknown;
    tokenIndex: number;
};

type GraphBranchResult = {
    nodeData: unknown;
    chainData: Record<string, unknown> | null;
    tokenIndex: number;
};

type GrapthRecursionStack<TTokenType extends string> = Stack<BaseGrammarNode<TTokenType>>;