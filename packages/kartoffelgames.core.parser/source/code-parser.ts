import { Lexer } from './lexer';

export class CodeParser<TTokenType> {
    private readonly mLexer: Lexer<TTokenType>;

    /**
     * Constructor.
     * @param pLexer - Token lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>){
        this.mLexer = pLexer;
    }
}