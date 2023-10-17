import { BaseGrammarNode } from './graph/base-grammar-node';
import { GrammarNodeType } from './graph/grammar-node-type.enum';
import { GrammarVoidNode } from './graph/chain_nodes/grammar-void-node';
import { Lexer } from './lexer';
import { ParserException } from './parser-exception';

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
        let lCurrentNode: BaseGrammarNode<TTokenType> | null = this.rootNode;

        for (const lNextToken of this.mLexer.tokenize(pCodeText)) {
            // Try to read next grammar node of token that is not of type void.
            let lNextGrammarNode: BaseGrammarNode<TTokenType> | null;
            do {
                lNextGrammarNode = lCurrentNode.retrieveNextFor(lNextToken.type);

                // Catch unexpected token.
                if (!lNextGrammarNode) {
                    throw new ParserException(`Unexpected token "${lNextToken.value}"`, this, lNextToken.columnNumber, lNextToken.lineNumber);
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

/*

const xmlTextContent = parser.syntaxNode(XmlToken.TextContent, 'text').end((pArgs: Record<string, LexerToken>) => { return new XmlTextNode(pArgs['text'].value) });
const xmlAttribute = parser.syntaxNode().optional(XmlToken.Namespace, 'namespace').then(XmlIdentifier).optional(()=>{
    return parser.syntaxNode(XmlToken.Assignment).then(xmlTextContent);
})

const xmlTag = parser.trunk((pData: Record<string, any>) => {}, ()=>{
    return parser.syntaxNode(XmlToken.TagOpen).Then(XmlTag.Identifier).loop(xmlAttribute).or(()=>{
        return [
            parser.syntaxNode(XmlToken.TagSelfClose),
            parser.syntaxNode(XmlToken.TagClose).
        ]
    })
})

 */