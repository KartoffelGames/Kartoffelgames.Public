import { Dictionary, Exception, Stack } from '@kartoffelgames/core.data';
import { BaseGrammarNode, GrammarGrapthValue } from './graph/base-grammar-node';
import { Lexer, LexerToken } from './lexer';
import { ParserException } from './parser-exception';
import { GraphPartReference } from './graph/graph-part-reference';

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

    public parse(pCodeText: string): TParseResult {
        // Validate lazy parameters.
        if (this.mRootPartName === null) {
            throw new Exception('Parser has not root part set.', this);
        }

        // Read complete token list.
        const lTokenList: Array<LexerToken<TTokenType>> = [...this.mLexer.tokenize(pCodeText)];

        // Parse root part.
        const lRootParseData: GraphParseResult | GraphParseError<TTokenType> = this.parseGraphPart(this.graphByName(this.mRootPartName), lTokenList, 0);
        if ('errorToken' in lRootParseData) {
            throw new ParserException(lRootParseData.message, this, lRootParseData.errorToken?.columnNumber ?? -1, lRootParseData.errorToken?.lineNumber ?? -1);
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

    private parseGraphNode(pNode: BaseGrammarNode<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number): GraphParseResult | GraphParseError<TTokenType> {
        // Get all valid types of this node.
        const lValidTokenTypeList: Array<TTokenType> = pNode.validTokens();

        // Get and check current token.
        const lCurrentToken: LexerToken<TTokenType> | undefined = pTokenList[pCurrentTokenIndex];
        if (!lCurrentToken) {
            return {
                message: `Missing an expected token "${lValidTokenTypeList.join(', ')}"`,
                errorToken: null
            };
        }

        // TODO: Save data when a identifier is set.
        const lResultData: any = {};

        // Validate token type and get next tokens.
        let lNextNodeList: Array<GrammarGrapthValue<TTokenType>>;
        if (!lValidTokenTypeList.includes(lCurrentToken.type)) {
            // Token is not valid, skip this part.
            if (!pNode.skipable) {
                return {
                    message: `Unexpected token`,
                    errorToken: lCurrentToken
                };
            }

            // Skip this token as it was already processed.
            lNextNodeList = pNode.next(true);
        } else {
            // Read next nodes.
            lNextNodeList = pNode.next(false);
        }

        // Process next nodes in parallel.
        const lBranchingResultList: Array<GraphParseResult | GraphParseError<TTokenType> | null> = new Array<GraphParseResult | GraphParseError<TTokenType> | null>();
        for (const lNextNode of lNextNodeList) {
            // End branch.
            if (lNextNode === null) {
                lBranchingResultList.push(null);
            } else if (lNextNode instanceof BaseGrammarNode) {
                // Process branch with next node and a new token.
                lBranchingResultList.push(this.parseGraphNode(lNextNode, pTokenList, pCurrentTokenIndex + 1));
            } else { // Graph part
                // Process graph part but keep on current node.
                lBranchingResultList.push(this.parseGraphPart(lNextNode, pTokenList, pCurrentTokenIndex));

                // TODO: Next node?
            }
        }

        // Validate parsed branches. 
        // - At least one successfull branch or an exit node is needed.
        // - Only one sucessfull branch can be valid. More than one result in an error.
        // - When only errors exists, take the one with a valid token or else the first one. 
        let lPriorityError: GraphParseError<TTokenType> | null = null;
        const lSucessList: Array<GraphParseResult> = new Array<GraphParseResult>();
        let lBranchEnd: boolean = false;
        for (const lResult of lBranchingResultList) {
            // Possible branch end.
            if (lResult === null) {
                lBranchEnd = true;
                continue;
            }

            // Errors.
            if ('errorToken' in lResult) {
                // Update error only when it has a better priority.
                if (lPriorityError === null || lPriorityError.errorToken === null && lResult.errorToken !== null) {
                    lPriorityError = lResult;
                }
            }

            // Errors.
            if ('tokenIndex' in lResult) {
                lSucessList.push(lResult);
            }
        }

        // Apply validation.
        if (lSucessList.length > 1) {
            throw new Exception('Graph has ambiguity paths', this);
        }

        // Success.
        if (lSucessList.length > 0) {
            const lResult: GraphParseResult = lSucessList[0];
            // TODO: Merge data.
            return {
                data: lResultData,
                tokenIndex: lResult.tokenIndex
            };
        }

        // Branch end.
        if (lBranchEnd) {
            return {
                data: lResultData,
                tokenIndex: pCurrentTokenIndex
            };
        }

        // Branch error.
        if (lPriorityError === null) {
            throw new Exception('Graph branch has a node without valid childs.', this);
        }
        return lPriorityError;
    }

    private parseGraphPart(pPart: GraphPartReference<TTokenType>, pTokenList: Array<LexerToken<TTokenType>>, pCurrentTokenIndex: number): GraphParseResult | GraphParseError<TTokenType> {
        // Set grapth root as staring node and validate correct confoguration.
        const lRootNode: BaseGrammarNode<TTokenType> | null = pPart.graph();
        if (lRootNode === null) {
            throw new Exception('A grapth node should not be null', this);
        }

        // Parse branch.
        const lBranchResult: GraphParseResult | GraphParseError<TTokenType> = this.parseGraphNode(lRootNode, pTokenList, pCurrentTokenIndex);

        // Redirect errors.
        if ('errorToken' in lBranchResult) {
            return lBranchResult;
        }

        // TODO: Execute collector.
        const lResultData: object = {};

        return {
            data: lResultData,
            tokenIndex: lBranchResult.tokenIndex
        };
    }
}

type GraphParseResult = {
    data: object;
    tokenIndex: number;
};

type GraphParseError<TTokenType> = {
    message: string;
    errorToken: LexerToken<TTokenType> | null;
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
                parser.graph().graph(parser.partReference('textContent'), 'value'),
                parser.graph().graph(parser.partReference('tag'), 'value')
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
    parser.graph().optionalgraph(parser.partReference('doctype'), 'doctype').optionalgraph(parser.partReference('tag'), 'rootTag'),
    (pTagData: Record<string, string>) => {
        return {};
    }
);

// Set root part. The part, the parser starts to parse.
parser.setRootPart('document');