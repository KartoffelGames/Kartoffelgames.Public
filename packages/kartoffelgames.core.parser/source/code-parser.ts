import { GrammarRootNode } from './graph/grammar-root-node';
import { Lexer } from './lexer';

export class CodeParser<TTokenType, TParseResult> {
    private readonly mLexer: Lexer<TTokenType>;
    private readonly mRootNode: GrammarRootNode<TTokenType>;

    /**
     * Get parser grammar root node.
     * 
     * @remarks
     * Any graph resets to this point after reaching an end node.
     */
    public get rootNode(): GrammarRootNode<TTokenType>{
        return this.mRootNode;
    }

    /**
     * Constructor.
     * @param pLexer - Token lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>){
        this.mLexer = pLexer;
        this.mRootNode = new GrammarRootNode<TTokenType>();
    }

    public parse(pCodeText: string): TParseResult {
        let lCurrentNode = this.rootNode;

        for(const lNextToken of this.mLexer.tokenize(pCodeText)){
            // TODO: Process token.
        }

        return <any>null;
    }
}