import { BaseGrammarNode } from './graph/base-grammar-node';
import { GrammarBranchReference, GrammarNodeType } from './graph/grammar-branch-reference.enum';
import { GrammarVoidNode } from './graph/branch_nodes/grammar-void-node';
import { Lexer, LexerToken } from './lexer';
import { ParserException } from './parser-exception';
import { GrammarTrunkNode } from './graph/branch_nodes/grammar-trunk-node';
import { Stack } from '@kartoffelgames/core.data';

export class CodeParser<TTokenType, TParseResult> {
    private readonly mLexer: Lexer<TTokenType>;
    private readonly mRootNode: GrammarVoidNode<TTokenType>;

    /**
     * Get parser grammar root node.
     * 
     * @remarks
     * Any graph resets to this point after reaching an end node.
     */
    public get rootNode(): GrammarVoidNode<TTokenType> {
        return this.mRootNode;
    }

    /**
     * Constructor.
     * @param pLexer - Token lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>) {
        this.mLexer = pLexer;
        this.mRootNode = new GrammarVoidNode<TTokenType>();
    }

    public parse(pCodeText: string): TParseResult {
        // Trunk stack to keep track of parser depth.
        const lTrunkStack: Stack<GrammarTrunkNode<TTokenType>> = new Stack<GrammarTrunkNode<TTokenType>>();

        // Buffer for end- and trunk nodes.
        let lEndTrunkData: Record<string, string> | null = null;
        let lTrunkNodeData: Record<string, object> | null = null;

        // Iterate each token till end. Clone root node to clean all status.
        let lCurrentNode: BaseGrammarNode<TTokenType> | null = this.rootNode.clone();
        for (const lNextToken of this.mLexer.tokenize(pCodeText)) {
            // Try to read next grammar node of token that is not of type void.
            let lNextGrammarNode: BaseGrammarNode<TTokenType> | null;
            do {
                lNextGrammarNode = lCurrentNode.retrieveNext(lNextToken.type);

                // Catch unexpected token.
                if (!lNextGrammarNode) {
                    // TODO: Load last starging node from stack and get chained node
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

    /**
     * Create new syntax node for a staring reference of a new chain.
     * @returns new grammar void node.
     */
    public newBranch(): GrammarVoidNode<TTokenType> {
        return new GrammarVoidNode<TTokenType>();
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
    TagSelfClose = 5,
    TagClose = 6,
    Identifier = 7
}


const lexer = new Lexer<XmlToken>();
const parser = new CodeParser(lexer);

const xmlTextContent = parser.newBranch((pArgs: Record<string, LexerToken<XmlToken>>) => { return new XmlTextNode(pArgs['text'].value); });
xmlTextContent.then(XmlToken.TextContent, 'text');

const xmlAttributes = parser.newBranch();
xmlAttributes.optional(XmlToken.Namespace, 'namespace').then(XmlToken.Identifier).optional(parser.newBranch().then(XmlToken.Assignment).then(xmlTextContent, 'attributes')).then(xmlAttributes);

const xmlTag = parser.newBranch((pData: Record<string, any>) => { });
xmlTag.then(XmlToken.TagOpen).then(XmlToken.Identifier).then(xmlAttributes).or([
    parser.newBranch().then(XmlToken.TagSelfClose),
    parser.newBranch().then(XmlToken.TagClose).then(xmlTag)
]);