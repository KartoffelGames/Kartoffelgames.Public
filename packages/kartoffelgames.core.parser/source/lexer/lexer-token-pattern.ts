import type { Lexer } from "./lexer.ts";

/**
 * Represents a pattern that can be used to match a series of token.
 */
export class LexerTokenPattern<TTokenType extends string> {
    private readonly mIdentity: symbol;
    private readonly mLexer: Lexer<TTokenType>;

    /**
     * Gets the unique symbol identifying this token pattern.
     */
    public get identity(): symbol {
        return this.mIdentity;
    }

    /**
     * Gets the lexer instance associated with this token pattern.
     */
    public get lexer(): Lexer<TTokenType> {
        return this.mLexer;
    }

    /**
     * Creates an instance of LexerTokenPattern.
     * 
     * @param pLexer - The lexer instance associated with this token pattern.
     * @param pIdentity - The unique symbol identifying this token pattern.
     */
    public constructor(pLexer: Lexer<TTokenType>, pIdentity: symbol) {
        this.mIdentity = pIdentity;
        this.mLexer = pLexer;
    }
}