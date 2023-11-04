import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { AnonymoutGrammarNode } from './graph/node/anonymous-grammar-node';
import { BaseGrammarNode } from './graph/node/base-grammar-node';
import { GrammarNodeValueType } from './graph/node/grammer-node-value-type.enum';
import { GraphPart, GraphPartDataCollector } from './graph/part/graph-part';
import { GraphPartReference } from './graph/part/graph-part-reference';
import { Lexer, LexerToken } from './lexer';
import { ParserException } from './parser-exception';

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

        // There must be at least one token to start the parse.
        if (lTokenList.length === 0) {
            throw new Exception('No parseable code was found.', this);
        }

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
            throw new ParserException(lErrorPosition!.message, this, lErrorPosition!.errorToken.columnNumber, lErrorPosition!.errorToken.lineNumber);
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
        // Get and check current token.
        const lCurrentToken: LexerToken<TTokenType> | undefined = pTokenList[pCurrentTokenIndex];
        if (!lCurrentToken) {
            if (pNode.required) {
                return [{
                    message: `Unexpected end of statement.`,
                    errorToken: pTokenList.at(-1)!
                }];
            } else {
                return {
                    data: {},
                    tokenIndex: pCurrentTokenIndex
                };
            }
        }

        // Error buffer. Bundles all parser errors so on an error case an detailed error detection can be made.
        const lErrorList: Array<GraphParseError<TTokenType>> = new Array<GraphParseError<TTokenType>>();

        // Process values.
        const lCurrentNodeValueResultList: Array<GraphNodeValueParseResult> = new Array<GraphNodeValueParseResult>();
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
                    tokenIndex: pCurrentTokenIndex
                };
            } else {
                // Process inner value but keep on current node.
                const lInnerValue: GraphPartParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphPart(lNodeValue, pTokenList, pCurrentTokenIndex);

                // When unsuccessfull save the last error.
                if (Array.isArray(lInnerValue)) {
                    lErrorList.push(...lInnerValue);
                    continue;
                }

                lNodeParseValue = lInnerValue;
            }

            lCurrentNodeValueResultList.push(lNodeParseValue);
        }

        // Return parser error when no parse value was found and the current node is not optional.
        if (lCurrentNodeValueResultList.length === 0 && pNode.required) {
            return lErrorList;
        }

        // Add empty GraphNodeValueParseResult when the node is optional and the node value has no positive result.
        if (lCurrentNodeValueResultList.length === 0 && !pNode.required) {
            // When the node was optional, reuse the current token.
            lCurrentNodeValueResultList.push({
                data: undefined,
                tokenIndex: pCurrentTokenIndex
            });
        }

        // Run next node parse for each lCurrentNodeDataResultList and check for dublicates after that.
        const lValueBranchResultList: Array<{ nextNodeValue: GraphNodeParseResult | null, nodeValue: GraphNodeValueParseResult; }> = new Array<{ nextNodeValue: GraphNodeParseResult | null, nodeValue: GraphNodeValueParseResult; }>();
        for (const lValueBranching of lCurrentNodeValueResultList) {
            // Process next nodes in parallel.
            for (const lNextNode of pNode.next()) {
                // Branch end. No chaining value.
                if (lNextNode === null) {
                    lValueBranchResultList.push({
                        nextNodeValue: null,
                        nodeValue: lValueBranching
                    });
                    continue;
                }

                // Parse next node. Save all errors.
                const lNextNodeParseResult: GraphNodeParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphNode(lNextNode, pTokenList, lValueBranching.tokenIndex + 1);
                if (Array.isArray(lNextNodeParseResult)) {
                    lErrorList.push(...lNextNodeParseResult);
                    continue;
                }

                // Process branch with next node and a new token.
                lValueBranchResultList.push({
                    nextNodeValue: lNextNodeParseResult,
                    nodeValue: lValueBranching
                });
            }
        }

        /* 
         * Validate parsed branches. 
         * - At least one successfull branch or an exit node is needed.
         * - Only one sucessfull branch can be valid. More than one result in an error.
         */

        // Permit ambiguity paths.
        if (lValueBranchResultList.filter((pResult) => { return pResult.nextNodeValue !== null; }).length > 1) {
            throw new Exception('Graph has ambiguity paths.', this);
        }

        // Next node parse success or branch ending.
        if (lValueBranchResultList.length > 0) {
            // Find sucessfull branch value or when is does not exists, go for the branch end. At least one of these exists.
            const lBranchingResult = lValueBranchResultList.find((pResult) => { return pResult.nextNodeValue !== null; }) ?? lValueBranchResultList.find((pResult) => { return pResult.nextNodeValue === null; })!;

            // Read last used token index of branch and polyfill branch data when this node was the last node of this branch.
            const lProcessedTokenIndex: number = lBranchingResult.nextNodeValue?.tokenIndex ?? lBranchingResult.nodeValue.tokenIndex;
            const lData: Record<string, unknown> = lBranchingResult.nextNodeValue?.data ?? {};
            const lNodeValue: unknown = lBranchingResult.nodeValue.data;

            // Merge data. Current node data into next node data.
            // Merge only when the current node has a value (not optional/skipped) and has a identifier. 
            if (pNode.identifier && typeof lNodeValue !== 'undefined') {
                // Set as single value or list.
                if (pNode.valueType === GrammarNodeValueType.Single) {
                    // Validate dublicate value identifier.
                    if (typeof lData[pNode.identifier] !== 'undefined') {
                        throw new Exception(`Grapth path has a dublicate value identifier "${pNode.identifier}"`, this);
                    }

                    // Overide value.
                    lData[pNode.identifier] = lNodeValue;
                } else {
                    let lIdentifierValue: unknown = lData[pNode.identifier];

                    // Validate value identifier referes to a single value type.
                    if (typeof lIdentifierValue !== 'undefined' && !Array.isArray(lIdentifierValue)) {
                        throw new Exception(`Grapth path has a dublicate value identifier "${pNode.identifier}" that is not a list value but should be.`, this);
                    }

                    // Check if value is already there and is a array. Init array otherwise.
                    if (typeof lIdentifierValue === 'undefined') {
                        // Init array and set it as identifier value.
                        lIdentifierValue = new Array<unknown>();
                        lData[pNode.identifier] = lIdentifierValue;
                    }

                    // Add value as array item and set 
                    (<Array<unknown>>lIdentifierValue).push(lNodeValue);
                }
            }

            return {
                data: lData,
                tokenIndex: lProcessedTokenIndex
            };
        }

        return lErrorList;
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

        // Set grapth root as staring node and validate correct confoguration.
        if (lRootNode === null) {
            throw new Exception('A grapth node should not be null', this);
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
            lResultData = lCollector(lBranchResult.data);
        }

        return {
            data: lResultData,
            tokenIndex: lBranchResult.tokenIndex
        };
    }
}

export type GraphNodeParseResult = {
    data: Record<string, Array<unknown> | unknown>;
    tokenIndex: number;
};

type GraphNodeValueParseResult = {
    data: unknown;
    tokenIndex: number;
};

type GraphPartParseResult = {
    data: unknown;
    tokenIndex: number;
};

type GraphParseError<TTokenType> = {
    message: string;
    errorToken: LexerToken<TTokenType>;
};