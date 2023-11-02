import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { AnonymoutGrammarNode } from './graph/node/anonymous-grammar-node';
import { BaseGrammarNode } from './graph/node/base-grammar-node';
import { GrammarNodeValueType } from './graph/node/grammer-node-value-type.enum';
import { GraphPart } from './graph/part/graph-part';
import { GraphPartReference } from './graph/part/graph-part-reference';
import { Lexer, LexerToken } from './lexer';
import { ParserException } from './parser-exception';

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
     * Parse a text with the set syntax from {@link CodeParser.setRootPart} into a sytnax tree
     * or custom data structure.
     * 
     * @param pCodeText - Code as text.
     * 
     * @returns The code as {@link TTokenType} data structure.
     * 
     * @throws {@link ParserException}
     * When the graph could not be resolved with the set code text.
     */
    public parse(pCodeText: string): TParseResult {
        // Validate lazy parameters.
        if (this.mRootPartName === null) {
            throw new Exception('Parser has not root part set.', this);
        }

        // Read complete token list.
        const lTokenList: Array<LexerToken<TTokenType>> = [...this.mLexer.tokenize(pCodeText)];

        // There must be at least one token to start the parse.
        if (lTokenList.length) {
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
    public setRootPart(pPartName: string): void {
        if (!this.mGraphParts.has(pPartName)) {
            throw new Exception(`Path part "${pPartName}" not defined.`, this);
        }

        // Validate that the root part has a data collector.
        if (!this.mGraphParts.get(pPartName)!.dataCollector) {
            throw new Exception(`A root graph part needs a defined data collector.`, this);
        }

        this.mRootPartName = pPartName;
    }

    private parseGraphNode(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number): GraphNodeParseResult | Array<GraphParseError<TTokenType>> {
        // Get and check current token.
        const lCurrentToken: LexerToken<TTokenType> | undefined = pTokenList[pCurrentTokenIndex];
        if (!lCurrentToken) {
            return [{
                message: `Unexpected end of statement.`,
                errorToken: pTokenList.at(-1)!
            }];
        }

        // Error buffer. Bundles all parser errors so on an error case an detailed error detection can be made.
        const lErrorList: Array<GraphParseError<TTokenType>> = new Array<GraphParseError<TTokenType>>();

        // Process values.
        const lCurrentNodeDataResultList: Array<GraphNodeValueParseResult> = new Array<GraphNodeValueParseResult>();
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

            lCurrentNodeDataResultList.push(lNodeParseValue);
        }

        // Permit ambiguity paths.
        if (lCurrentNodeDataResultList.length > 1) {
            throw new Exception('Graph has ambiguity node values paths.', this);
        }

        // Return parser error when no parse value was found and the current node is not optional.
        if (lCurrentNodeDataResultList.length === 0 && pNode.required) {
            return lErrorList;
        }

        // Easy access for node value. When the node was optional, reuse the current token.
        const lNodeValue: GraphNodeValueParseResult | undefined = lCurrentNodeDataResultList.at(0);
        const lLastProcessedTokenIndex: number = (lNodeValue ? lNodeValue.tokenIndex : pCurrentTokenIndex);

        // Process next nodes in parallel.
        const lSucessList: Array<GraphNodeParseResult> = new Array<GraphNodeParseResult>();
        let lBranchEnd: boolean = false;
        for (const lNextNode of pNode.next()) {
            // Branch end.
            if (lNextNode === null) {
                lBranchEnd = true;
                continue;
            }

            // Parse next node. Save all errors.
            const lNextNodeParseResult: GraphNodeParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphNode(lNextNode, pTokenList, lLastProcessedTokenIndex + 1);
            if (Array.isArray(lNextNodeParseResult)) {
                lErrorList.push(...lNextNodeParseResult);
                continue;
            }

            // Process branch with next node and a new token.
            lSucessList.push(lNextNodeParseResult);
        }

        /* 
         * Validate parsed branches. 
         * - At least one successfull branch or an exit node is needed.
         * - Only one sucessfull branch can be valid. More than one result in an error.
         */

        // Apply validation.
        if (lSucessList.length > 1) {
            throw new Exception('Graph has ambiguity chained paths', this);
        }

        // Next node parse success or branch ending.
        if (lSucessList.length > 0 || lBranchEnd) {
            let lProcessedTokenIndex: number;
            let lData: Record<string, unknown>;

            // Set data and last processed token index based of if this node is the branch end node.
            if (lBranchEnd) {
                // Empty data set bc. no
                lData = {};

                // Reset last processed token index when this node was skipped.
                lProcessedTokenIndex = (typeof lNodeValue !== 'undefined') ? lLastProcessedTokenIndex : pCurrentTokenIndex;
            } else { // Next node parse success.
                const lNextNodeParseResult: GraphNodeParseResult = lSucessList[0];

                // Set data and processed token from next node parse result.
                lProcessedTokenIndex = lNextNodeParseResult.tokenIndex;
                lData = lNextNodeParseResult.data;
            }

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
                    lData[pNode.identifier] = lNodeValue.data;
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
                    (<Array<unknown>>lIdentifierValue).push(lNodeValue.data);
                }
            }

            return {
                data: lData,
                tokenIndex: lProcessedTokenIndex
            };
        }

        return lErrorList;
    }

    private parseGraphPart(pPartReference: GraphPartReference<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number): GraphPartParseResult | Array<GraphParseError<TTokenType>> {
        const lResolvedGraphPart: GraphPart<TTokenType> = pPartReference.resolveReference();

        // Set grapth root as staring node and validate correct confoguration.
        const lRootNode: BaseGrammarNode<TTokenType> | null = lResolvedGraphPart.graph;
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
        if (lResolvedGraphPart.dataCollector) {
            lResultData = lResolvedGraphPart.dataCollector(lBranchResult.data);
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



// ------------------------
// Test
// ------------------------
enum XmlToken {
    TextContent = 'TextContent',
    Namespace = 'Namespace',
    Assignment = 'Assignment',
    TagOpen = 'TagOpen',
    TagOpenClose = 'TagOpenClose',
    TagSelfClose = 'TagSelfClose',
    TagClose = 'TagClose',
    Identifier = 'Identifier',
    Doctype = 'Doctype'
}


const lexer = new Lexer<XmlToken>();
const parser = new CodeParser<XmlToken, unknown>(lexer);

// TODO: ParserData defined from graph. => All loops need a name {loopName: [...loopdata]}

// Define attribute
parser.definePart('attribute',
    parser.graph().optional(XmlToken.Namespace, 'namespace').single(XmlToken.Identifier, 'name').optional(
        parser.graph().single(XmlToken.Assignment).single(XmlToken.TextContent, 'value')
    ),
    (pAttributeData: Record<string, string>) => {
        return {};
    }
);

// Define content
parser.definePart('textContent',
    parser.graph().loop('text', XmlToken.TextContent),
    (pTextContentData: Record<string, string>) => {
        return {};
    }
);

// Define tag
type ParserTagPartGraphData = {
    namespace?: string;
    openName: string;
    attributes: Array<XmlAttribute>;
    closing: {
        contents: Array<{
            content: {
                value: XmlText | XmlTag;
            };
        }>;
        closeName: string;
    };
};
parser.definePart('tag',
    parser.graph().single(XmlToken.TagOpen).optional(XmlToken.Namespace, 'namespace').single(XmlToken.Identifier, 'openName').loop('attributes', parser.partReference('attribute')).branch('closing', [
        parser.graph().single(XmlToken.TagSelfClose),
        parser.graph().single(XmlToken.TagClose).loop('contents',
            parser.graph().branch('content', [
                parser.graph().single(parser.partReference('textContent'), 'value'),
                parser.graph().single(parser.partReference('tag'), 'value')
            ]),
        ).single(XmlToken.TagOpenClose).single(XmlToken.Identifier, 'closeName').single(XmlToken.TagClose)
    ]),
    (pTagData: ParserTagPartGraphData): XmlTag => {
        return {};
    }
);

// Define xml doctype
parser.definePart('doctype',
    parser.graph().single(XmlToken.TagOpen).single(XmlToken.Doctype).single(XmlToken.Identifier, 'doctype'),
    (pDoctypeData: Record<string, string>) => {
        return {};
    }
);

// Define parser endpoint where all data is merged.
parser.definePart('document',
    parser.graph().optional(parser.partReference('doctype'), 'doctype').optional(parser.partReference('tag'), 'rootTag'),
    (pTagData: Record<string, string>) => {
        return {};
    }
);

// Set root part. The part, the parser starts to parse.
parser.setRootPart('document');