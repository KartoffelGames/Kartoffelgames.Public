import { Stack } from '@kartoffelgames/core.data';
import { BaseGrammarNode } from './graph/base-grammar-node';
import { BranchCollectorFunction, GrammarBranchNode } from './graph/branch_nodes/grammar-branch-node';
import { GrammarNodeType } from './graph/grammar-node-type.enum';
import { Lexer } from './lexer';
import { ParserException } from './parser-exception';

export class CodeParser<TTokenType, TParseResult> {
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
        // Trunk stack to keep track of parser depth.
        const lBranchStack: Stack<GrammarBranchNode<TTokenType>> = new Stack<GrammarBranchNode<TTokenType>>();

        // Buffer for end- and trunk nodes.
        let lBranchDataCollection: Record<string, Array<string>> = {};
        let lTrunkNodeData: Array<object> = [];

        // Iterate each token till end. Clone root node to clean all status.
        let lCurrentNode: BaseGrammarNode<TTokenType> | null = this.rootNode;
        for (const lNextToken of this.mLexer.tokenize(pCodeText)) {
            // Try to read next grammar node of token that is not of type void.
            let lNextGrammarNode: BaseGrammarNode<TTokenType> | null;
            do {
                lNextGrammarNode = lCurrentNode.retrieveNext(lNextToken.type, false);

                // Catch unexpected token.
                if (!lNextGrammarNode) {
                    const lBranchRoot: GrammarBranchNode<TTokenType> | undefined = lBranchStack.pop();

                    // This should never happen.
                    if (!lBranchRoot) {
                        throw new ParserException(`Syntax root not found.`, this, lNextToken.columnNumber, lNextToken.lineNumber);
                    }

                    // When the branch has a data collector, execute it.
                    if (lBranchRoot.hasCollector) {
                        const lCollectorBundle: any = lBranchRoot.executeCollector(lBranchDataCollection);

                        // TODO: Save collected bundle. Order needs to be preserved.

                        // Reset collected data.
                        lBranchDataCollection = {};
                    }

                    // TODO: Load last starging node from stack and get chained node


                    continue;
                }

                // A new branch was 
                if (lNextGrammarNode.branchRoot === lNextGrammarNode) {
                    lBranchStack.push(<GrammarBranchNode<TTokenType>>lNextGrammarNode);
                }

            } while (lNextGrammarNode.type !== GrammarNodeType.Void);

            // TODO: Process token value for different token types.

            // TODO: Save data from endpoints.
            // TODO: Save stack of trunks. For each endpoint meet, send data to trunk.

            // Update token.
            lCurrentNode = lNextGrammarNode;
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
    parser.graph().loop(XmlToken.TextContent, 'text'),
    (pTextContentData: Record<string, string>) => {
        return {};
    }
);

// Define tag
parser.definePart('tag',
    parser.graph().single(XmlToken.TagOpen).optional(XmlToken.Namespace, 'namespace').single(XmlToken.Identifier, 'openName').loop(CodeParser.partRef('attribute'), 'attributes').branch([
        parser.graph().single(XmlToken.TagSelfClose),
        parser.graph().single(XmlToken.TagClose).loop(
            parser.graph().branch([
                CodeParser.partRef('textContent'),
                CodeParser.partRef('tag')
            ], 'content')
        ).single(XmlToken.TagOpenClose).single(XmlToken.Identifier, 'closeName').single(XmlToken.TagClose)
    ]),
    (pTagData: Record<string, string>) => {
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
parser.defineEndpoint(
    parser.graph().optional(CodeParser.partRef('doctype'), 'doctype').optional(CodeParser.partRef('tag'), 'rootTag'),
    (pTagData: Record<string, string>) => {
        return {};
    }
);