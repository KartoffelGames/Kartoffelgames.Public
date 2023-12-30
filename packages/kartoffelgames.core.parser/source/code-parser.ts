import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { AnonymoutGrammarNode } from './graph/node/anonymous-grammar-node';
import { BaseGrammarNode } from './graph/node/base-grammar-node';
import { GrammarNodeValueType } from './graph/node/grammer-node-value-type.enum';
import { GraphPart, GraphPartDataCollector } from './graph/part/graph-part';
import { GraphPartReference } from './graph/part/graph-part-reference';
import { Lexer } from './lexer/lexer';
import { ParserException } from './parser-exception';
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
    private mRootPartName: string | null;

    /**
     * Get lexer.
     */
    public get lexer(): Lexer<TTokenType> {
        return this.mLexer;
    }

    /**
     * Constructor.
     * 
     * @param pLexer - Token lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>) {
        this.mLexer = pLexer;
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

        // Parse root part.
        const lRootParseData: GraphPartParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphPart(lRootPartReference, lTokenList, 0);
        if (Array.isArray(lRootParseData)) {
            // Find error with the latest error position.
            let lErrorPosition: GraphParseError<TTokenType> | null = null;
            for (const lError of lRootParseData) {
                if (!lErrorPosition || lError.errorToken.lineNumber > lErrorPosition.errorToken.lineNumber || lError.errorToken.lineNumber === lErrorPosition.errorToken.lineNumber && lError.errorToken.columnNumber > lErrorPosition.errorToken.columnNumber) {
                    lErrorPosition = lError;
                }
            }

            // At lease one error must be found.
            throw ParserException.fromToken(lErrorPosition!.message, this, lErrorPosition!.errorToken, lErrorPosition!.errorToken);
        }

        // Validate, that every token was parsed.
        if (lRootParseData.tokenIndex < (lTokenList.length - 1)) {
            const lLastToken: LexerToken<TTokenType> = lTokenList.at(-1)!;
            throw ParserException.fromToken(`Tokens could not be parsed. Graph end meet without reaching last token "${lLastToken.value}"`, this, lTokenList[lRootParseData.tokenIndex]!, lLastToken);
        }

        return <TParseResult>lRootParseData.data;
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
     * Parse the token, marked with {@link pCurrentTokenIndex} with the set node.
     * 
     * @param pNode - Current node that should handle the set token.
     * @param pTokenList - Current parsed list of all token in appearing order.
     * @param pCurrentTokenIndex - Current token index that should be parsed with the node.
     * 
     * @returns The Token data object with all parsed brother node token data merged. Additionally the last used token index is returned.
     * When the parsing fails for this node or a brother node, a complete list with all potential errors are returned instead of the token data.
     */
    private parseGraphNode(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number): GraphNodeParseResult | Array<GraphParseError<TTokenType>> {
        // Parse and read current node values. Add each error to the complete error list.
        const lNodeValueParseResult: GraphNodeValueParseSuccess | GraphNodeValueParseError<TTokenType> = this.retrieveNodeValues(pNode, pTokenList, pCurrentTokenIndex);

        // Return parser error when no parse value was found.
        if ('errorList' in lNodeValueParseResult) {
            return lNodeValueParseResult.errorList;
        }

        // Parse and read data of chanined nodes. Add each error to the complete error list.
        // When result contains errors, return the error list.
        const lChainParseResult: GraphBranchResult | Array<GraphParseError<TTokenType>> = this.retrieveChainedValues(pNode, lNodeValueParseResult.resultList, pTokenList);
        if (Array.isArray(lChainParseResult)) {
            return lChainParseResult;
        }

        // Read last used token index of branch and polyfill branch data when this node was the last node of this branch.
        const lData: Record<string, unknown> = lChainParseResult.chainData;
        const lNodeValue: unknown = lChainParseResult.nodeData;

        // Merge data. Current node data into chained node data.
        // Merge only when the current node has a value (not optional/skipped) and has a identifier. 
        if (pNode.identifier) {
            // Set as single value or list.
            if (pNode.valueType === GrammarNodeValueType.Single && typeof lNodeValue !== 'undefined') {
                // Validate dublicate value identifier.
                if (pNode.identifier in lData) {
                    throw new Exception(`Grapth path has a dublicate value identifier "${pNode.identifier}"`, this);
                }

                // Overide value when set.
                lData[pNode.identifier] = lNodeValue;
            } else if (pNode.valueType === GrammarNodeValueType.List) {
                let lIdentifierValue: unknown = lData[pNode.identifier];

                // Validate value identifier referes to a single value type.
                if (typeof lIdentifierValue !== 'undefined' && !Array.isArray(lIdentifierValue)) {
                    throw new Exception(`Grapth path has a dublicate value identifier "${pNode.identifier}" that is not a list value but should be.`, this);
                }

                // Validate if the array is initialized, when not do so.
                if (typeof lIdentifierValue === 'undefined') {
                    // Init array and set it as identifier value.
                    lIdentifierValue = new Array<unknown>();
                    lData[pNode.identifier] = lIdentifierValue;
                }

                // Add value as array item and set, but only when a value was set.
                if (typeof lNodeValue !== 'undefined') {
                    (<Array<unknown>>lIdentifierValue).unshift(lNodeValue);
                }
            }
        }

        return {
            data: lData,
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
    private parseGraphPart(pPart: GraphPartReference<TTokenType> | BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number): GraphPartParseResult | Array<GraphParseError<TTokenType>> {
        let lRootNode: BaseGrammarNode<TTokenType> | null;
        let lCollector: GraphPartDataCollector | null = null;

        // Read reference or read branch root of part node.
        if (pPart instanceof GraphPartReference) {
            const lGraphPart: GraphPart<TTokenType> = pPart.resolveReference();
            lRootNode = lGraphPart.graph;
            lCollector = lGraphPart.dataCollector;
        } else {
            lRootNode = pPart.branchRoot;
        }

        // Parse branch.
        const lBranchResult: GraphNodeParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphNode(lRootNode, pTokenList, pCurrentTokenIndex);

        // Redirect errors.
        if (Array.isArray(lBranchResult)) {
            return lBranchResult;
        }

        // Execute optional collector.
        let lResultData: Record<string, unknown> | unknown = lBranchResult.data;
        if (lCollector) {
            try {
                lResultData = lCollector(lBranchResult.data);
            } catch (pError: any) {
                const lMessage: string = typeof pError === 'object' && pError !== null && 'message' in pError ? pError.message : pError.toString();

                // Read start end end token.
                let lErrorStartToken: LexerToken<TTokenType> | undefined = pTokenList.at(pCurrentTokenIndex);
                let lErrorEndToken: LexerToken<TTokenType> | undefined = pTokenList.at(lBranchResult.tokenIndex);

                // Fill in previous start token when the current token has no value.
                if (!lErrorStartToken) {
                    lErrorStartToken = pTokenList.at(pCurrentTokenIndex - 1);
                }

                // Fill in previous end token when the current end token has no value.
                if (!lErrorEndToken) {
                    lErrorEndToken = pTokenList.at(lBranchResult.tokenIndex - 1);
                }

                // Set end token to start token, when no token was found whatsoever.
                if (!lErrorEndToken) {
                    lErrorEndToken = lErrorStartToken;
                }

                // When no token was processed, throw default error on first token.
                if (!lErrorStartToken || !lErrorEndToken) {
                    throw new ParserException(lMessage, this, 0, 0, 0, 0);
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
    private retrieveChainedValues(pNode: BaseGrammarNode<TTokenType>, pBranchValues: Array<GraphNodeValueParseResult>, pTokenList: Array<LexerToken<TTokenType>>): GraphBranchResult | Array<GraphParseError<TTokenType>> {
        const lErrorList: Array<GraphParseError<TTokenType>> = new Array<GraphParseError<TTokenType>>();

        type ChainResult = {
            chainedValue: GraphNodeParseResult | null;
            chainnode: BaseGrammarNode<TTokenType> | null;
            branchValue: GraphNodeValueParseResult;
        };

        // Run chained node parse for each branch value and check for dublicates after that.
        let lResultList: Array<ChainResult> = new Array<ChainResult>();
        for (const lBranch of pBranchValues) {
            // Process chained nodes in parallel.
            for (const lChainedNode of pNode.next()) {
                // Branch end. No chaining value.
                if (lChainedNode === null) {
                    lResultList.push({
                        chainnode: lChainedNode,
                        chainedValue: null,
                        branchValue: lBranch
                    });
                    continue;
                }

                // Skip endless loops by preventing the same optional node chaining itself.
                if (lBranch.emptyValue && lChainedNode === pNode) {
                    continue;
                }

                // Parse chained node. Save all errors.
                const lChainedNodeParseResult: GraphNodeParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphNode(lChainedNode, pTokenList, lBranch.tokenIndex + 1);
                if (Array.isArray(lChainedNodeParseResult)) {
                    lErrorList.push(...lChainedNodeParseResult);
                    continue;
                }

                // Process branch with chained node values and a new token.
                lResultList.push({
                    chainnode: lChainedNode,
                    chainedValue: lChainedNodeParseResult,
                    branchValue: lBranch
                });
            }
        }

        // Check for ambiguity paths.
        if (lResultList.filter((pResult: ChainResult) => { return pResult.chainedValue !== null; }).length > 1) {
            // When a loop node exists use only this looping nodes, omit any other node.
            const lLoopNodeList: Array<ChainResult> = lResultList.filter((pResult: ChainResult) => { return pResult.chainedValue !== null && pResult.chainnode === pNode; });
            if(lLoopNodeList.length > 0) {
                lResultList = lLoopNodeList;
            }

            // Validate if ambiguity paths still exists.
            if (lResultList.filter((pResult: ChainResult) => { return pResult.chainedValue !== null; }).length > 1) {
                const lDublicatePathList: Array<ChainResult> = lResultList.filter((pResult) => { return pResult.chainedValue !== null; });
                const lDublicatePathValueList: Array<string> = lDublicatePathList.map((pItem) => { return `[${JSON.stringify(pItem.chainnode?.valueType)}, "${JSON.stringify(pItem.chainedValue?.data)}]"`; });

                throw new Exception(`Graph has ambiguity paths. Values: [${lDublicatePathValueList.join(', ')}]`, this);
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

        // Return error list when no result was found.
        if (lBranchingResult === null) {
            return lErrorList;
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
    private retrieveNodeValues(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number): GraphNodeValueParseSuccess | GraphNodeValueParseError<TTokenType> {
        // Read next token.
        const lCurrentToken: LexerToken<TTokenType> | undefined = pTokenList.at(pCurrentTokenIndex);

        // When no current token was found. Skip node value parsing.
        if (!lCurrentToken) {
            // Add empty data result, when the node was optional
            if (pNode.required) {
                return {
                    errorList: [{
                        message: `Unexpected end of statement. TokenIndex: "${pCurrentTokenIndex}" missing.`,
                        errorToken: pTokenList.at(-1)!
                    }]
                };
            }

            return {
                resultList: [{
                    data: undefined,
                    tokenIndex: pCurrentTokenIndex - 1,
                    emptyValue: true
                }]
            };
        }

        // Error buffer. Bundles all parser errors so on an error case an detailed error detection can be made.
        const lErrorList: Array<GraphParseError<TTokenType>> = new Array<GraphParseError<TTokenType>>();
        const lResultList: Array<GraphNodeValueParseResult> = new Array<GraphNodeValueParseResult>();

        // Process each node value.
        for (const lNodeValue of pNode.nodeValues) {
            let lNodeParseValue: GraphNodeValueParseResult | null;

            // Static token type of dynamic graph part.
            if (typeof lNodeValue === 'string') {
                // Push possible parser error when token type does not match node value.
                if (lNodeValue !== lCurrentToken.type) {
                    lErrorList.push({
                        message: `Unexpected token. "${lNodeValue}" expected`,
                        errorToken: lCurrentToken
                    });
                    continue;
                }

                // Set node value.
                lNodeParseValue = {
                    data: lCurrentToken.value,
                    tokenIndex: pCurrentTokenIndex,
                    emptyValue: false
                };
            } else {
                // Process inner value but keep on current node.
                const lInnerValue: GraphPartParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphPart(lNodeValue, pTokenList, pCurrentTokenIndex);

                // When unsuccessfull save the last error.
                if (Array.isArray(lInnerValue)) {
                    lErrorList.push(...lInnerValue);
                    continue;
                }

                lNodeParseValue = {
                    data: lInnerValue.data,
                    tokenIndex: lInnerValue.tokenIndex,
                    emptyValue: false
                };
            }

            lResultList.push(lNodeParseValue);
        }

        // Add empty GraphNodeValueParseResult when the node is optional and the node value has no positive result.
        if (lResultList.length === 0 && !pNode.required) {
            // When the node was optional, reuse the current token.
            lResultList.push({
                data: undefined,
                tokenIndex: pCurrentTokenIndex - 1,
                emptyValue: true
            });
        }

        // Return error list when no result was found.
        if (lResultList.length === 0) {
            return {
                errorList: lErrorList
            };
        }

        return {
            resultList: lResultList
        };
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
    emptyValue: boolean;
};

type GraphParseError<TTokenType extends string> = {
    message: string;
    errorToken: LexerToken<TTokenType>;
};

type GraphNodeValueParseSuccess = {
    resultList: Array<GraphNodeValueParseResult>;
};

type GraphNodeValueParseError<TTokenType extends string> = {
    errorList: Array<GraphParseError<TTokenType>>;
};

type GraphBranchResult = {
    nodeData: unknown;
    chainData: Record<string, unknown>;
    tokenIndex: number;
};