import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { BaseGrammarNode } from './graph/base-grammar-node';
import { GrammarNodeValueType } from './graph/grammer-node-value-type.enum';
import { GraphPartReference } from './graph/graph-part-reference';
import { Lexer, LexerToken } from './lexer';
import { ParserException } from './parser-exception';

export class CodeParser<TTokenType extends string, TParseResult> {
    private readonly mGraphParts: Dictionary<string, GraphPartReference<TTokenType>>;
    private readonly mLexer: Lexer<TTokenType>;
    private mRootPartName: string | null;

    /**
     * Constructor.
     * @param pLexer - Token lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>) {
        this.mLexer = pLexer;
        this.mRootPartName = null;
        this.mGraphParts = new Dictionary<string, GraphPartReference<TTokenType>>();
    }

    /**
     * Parse a text with the set syntax from {@link CodeParser.setRootPart} into a sytnax tree
     * or custom data structure.
     * 
     * @param pCodeText - Code as text.
     * 
     * @returns The code as {@link TTokenType} data structure.
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

        // Parse root part.
        const lRootParseData: GraphParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphPart(this.graphByName(this.mRootPartName), lTokenList, 0);
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
     * 
     * @param pPartName 
     */
    public setRootPart(pPartName: string): void {
        if (!this.mGraphParts.has(pPartName)) {
            throw new Exception(`Path part "${pPartName}" not defined.`, this);
        }

        // TODO: Validate that the root part has the correct data parser. 

        this.mRootPartName = pPartName;
    }

    private graphByName(pPartName: string): GraphPartReference<TTokenType> {
        if (!this.mGraphParts.has(pPartName)) {
            throw new Exception(`Path part "${pPartName}" not defined.`, this);
        }

        return this.mGraphParts.get(pPartName)!;
    }

    private parseGraphNode(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number): GraphParseResult | Array<GraphParseError<TTokenType>> {
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
        const lCurrentNodeDataResultList: Array<GraphParseResult> = new Array<GraphParseResult>();
        for (const lNodeValue of pNode.nodeValues) {
            let lNodeParseValue: GraphParseResult | null;

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
                    data: pNode.identifier ? {
                        identifier: pNode.identifier,
                        value: lCurrentToken.value,
                        type: pNode.valueType
                    } : null,
                    tokenIndex: pCurrentTokenIndex
                };
            } else {
                // Process inner value but keep on current node.
                const lInnerValue: GraphParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphPart(lNodeValue, pTokenList, pCurrentTokenIndex);

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
        const lNodeValue: GraphParseResult | undefined = lCurrentNodeDataResultList[0];
        const lNextTokenIndex: number = lNodeValue ? (lNodeValue.tokenIndex + 1) : pCurrentTokenIndex;

        // Process next nodes in parallel.
        const lSucessList: Array<GraphParseResult> = new Array<GraphParseResult>();
        let lBranchEnd: boolean = false;
        for (const lNextNode of pNode.next()) {
            // Branch end.
            if (lNextNode === null) {
                lBranchEnd = true;
                continue;
            }

            // Parse next node. Save all errors.
            const lNextNodeParseResult: GraphParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphNode(lNextNode, pTokenList, lNextTokenIndex);
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

        // Success.
        if (lSucessList.length > 0) {
            const lResult: GraphParseResult = lSucessList[0];
            // TODO: Merge data. Current node data into next node data.
            return {
                data: lResultData,
                tokenIndex: lResult.tokenIndex
            };
        }

        // Branch end. Return the current node value.
        if (lBranchEnd) {
            // Skip token process, when this node was optional.
            if (!lNodeValue) {
                return {
                    identifier: null,
                    data: {

                    },
                    tokenIndex: pCurrentTokenIndex // TODO: reverse index (-1 ?)
                };
            }

            return {
                data: lResultData,
                tokenIndex: lNextTokenIndex
            };
        }

        return lErrorList;
    }

    private parseGraphPart(pPart: GraphPartReference<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number): GraphParseResult | Array<GraphParseError<TTokenType>> {
        // Set grapth root as staring node and validate correct confoguration.
        const lRootNode: BaseGrammarNode<TTokenType> | null = pPart.graph();
        if (lRootNode === null) {
            throw new Exception('A grapth node should not be null', this);
        }

        // Parse branch.
        const lBranchResult: GraphParseResult | Array<GraphParseError<TTokenType>> = this.parseGraphNode(lRootNode, pTokenList, pCurrentTokenIndex);

        // Redirect errors.
        if (Array.isArray(lBranchResult)) {
            return lBranchResult;
        }

        // TODO: Execute collector.
        const lResultData: object = {};

        return {
            identifier: null,
            data: {
                value: lResultData,
                type: GrammarNodeValueType.Single
            },
            tokenIndex: lBranchResult.tokenIndex
        };
    }
}

type GraphParseResult = {
    data: {
        identifier: string;
        type: GrammarNodeValueType;
        value: any;
    } | null;
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