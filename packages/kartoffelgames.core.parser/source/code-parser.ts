import { Lexer } from './lexer';

export class CodeParser<TTokenType extends string, TParseResult> {
    private readonly mLexer: Lexer<TTokenType>;
    private readonly mRootNode: GrammarBranchNode<TTokenType>;

    /**
     * Get parser grammar root node.
     * 
     * @remarks
     * Any graph resets to this point after reaching an end node.
     */
    public get rootNode(): GrammarBranchNode<TTokenType> {
        return this.mRootNode;
    }

    /**
     * Constructor.
     * @param pLexer - Token lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>) {
        this.mLexer = pLexer;
        this.mRootNode = new GrammarBranchNode<TTokenType>();
    }

    /**
     * Create new syntax node for a staring reference of a new branch.
     * @returns new grammar void node.
     */
    public newBranch(pCollector: BranchCollectorFunction | null = null): GrammarBranchNode<TTokenType> {
        return new GrammarBranchNode<TTokenType>(pCollector);
    }

    public parse(pCodeText: string): TParseResult {
        // TODO: Build up parallel data for branches that starts with the same starting nodes. 
        // This can go a long way until all but one fails and the data is inserted into the original data structure.
        const lParallelDimension: Array<any> = new Array<any>();

        // TODO: Push first dimension.


        // Iterate each token till end.
        for (const lNextToken of this.mLexer.tokenize(pCodeText)) {
            // For each paralell dimension, process the same token.
            for (const lDimension of lParallelDimension) {

            }
        }

        // TODO: Unexpected end of file.

        return <any>null;
    }
}

// ------------------------
// Test
// ------------------------
enum XmlToken {
    TextContent = 1,
    Namespace = 2,
    Assignment = 3,
    TagOpen = 4,
    TagOpenClose = 11,
    TagSelfClose = 5,
    TagClose = 6,
    Identifier = 7,
    Doctype = 8,
}


const lexer = new Lexer<XmlToken>();
const parser = new CodeParser(lexer);

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
    parser.graph().single(XmlToken.TagOpen).optional(XmlToken.Namespace, 'namespace').single(XmlToken.Identifier, 'openName').loop('attributes', CodeParser.partRef('attribute')).branch('closing', [
        parser.graph().single(XmlToken.TagSelfClose),
        parser.graph().single(XmlToken.TagClose).loop('contents',
            parser.graph().branch('content', [
                parser.graph().single(CodeParser.partRef('textContent'), 'value'),
                parser.graph().single(CodeParser.partRef('tag'), 'value')
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
    parser.graph().optional(CodeParser.partRef('doctype'), 'doctype').optional(CodeParser.partRef('tag'), 'rootTag'),
    (pTagData: Record<string, string>) => {
        return {};
    }
);

// Set root part. The part, the parser starts to parse.
parser.setRootPart('document');