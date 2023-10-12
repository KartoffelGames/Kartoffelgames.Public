import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { ParserException } from './parser-exception';

/**
 * Lexer or tokenizer. Turns a text with grammar into tokens.
 * Creates a iterator that iterates over each found token till end of text.
 * 
 * @typeParam T - Token types. Best to use some sort of enumerator.
 * 
 * @public
 */
export class Lexer<TTokenType> {
    private readonly mSettings: LexerSettings;
    private readonly mTokenPatterns: Dictionary<TTokenType, RegExp>;
    private readonly mTokenTypes: Array<TTokenType>;

    /**
     * Enable or disable whitespace trimming.
     * 
     * @remark
     * {@link Lexer.tokenise} skips all whitespaces before and after found token.
     * Recognised whitespaces of this lexer can be set by setting a string of all valid whitespace characters to {@link Lexer.validWhitespaces}.
     */
    public get trimWhitespace(): boolean {
        return this.mSettings.trimSpaces;
    } set trimWhitespaces(pValue: boolean) {
        this.mSettings.trimSpaces = pValue;
    }

    /**
     * Whitespace characters recognised by the lexer.
     * 
     * @remarks
     * Used to trim whitespaces by {@link Lexer.tokenise}.
     * Trimming of whitespaces can be turned on by setting {@link Lexer.trimWhitespace} to `true`.
     * 
     * @example Set default whitespaces
     * ``` Typescript
     * const lexer = new Lexer<number>();
     * lexer.validWhitespaces = ' \n\r\t';
     * ```
     */
    public get validWhitespaces(): string {
        return [...this.mSettings.whiteSpaces].join('');
    } set validWhitespaces(pWhitespaces: string) {
        this.mSettings.whiteSpaces = new Set<string>(pWhitespaces.split(''));
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTokenPatterns = new Dictionary<TTokenType, RegExp>();
        this.mTokenTypes = new Array<TTokenType>();

        // Set defaults.
        this.mSettings = {
            trimSpaces: true,
            whiteSpaces: new Set<string>()
        };
    }

    /**
     * Add token pattern
     * The order the pattern are added matters for priorizing.
     * 
     * @param pPattern - Token pettern must not be unique but should.
     * @param pType - Pattern type.
     * 
     * @throws 
     * On adding a dublicate type.
     * 
     * @example Set two types of tokens for a text.
     * ``` Typescript
     * const lexer = new Lexer<'number' | 'string'>();
     * lexer.addTokenPattern(/[0-9]+/, 'number');
     * lexer.addTokenPattern(/[a-zA-Z]+/, 'text');
     * 
     * lexer.addTokenPattern(/[a-zA-Z0-9]+/, 'text'); // => Fails
     * ``` 
     */
    public addTokenPattern(pPattern: RegExp, pType: TTokenType): void {
        // Restrict dublicate token type.
        if (this.mTokenPatterns.has(pType)) {
            throw new Exception(`Dublicate token type "${pType}". Token types for patthern need to be unique`, this);
        }

        // Ordered type list.
        this.mTokenTypes.push(pType);

        // Type to pattern mapping.
        this.mTokenPatterns.set(pType, pPattern);
    }

    /**
     * Create a generator that yield any token of the provided text.
     * Generated token contains additional line and column numbers.
     * 
     * @param pText - Text holding a grammar that can be completly tokenised by the set token patterns.
     * 
     * @returns Generator that yields any valid token that can be found with the set token patterns.
     * 
     * @throws 
     * On any text part that can not be tokenised.
     */
    public * tokenise(pText: string): Generator<LexerToken<TTokenType>> {
        let lCurrentLineNumber = 1;
        let lCurrentColumnNumber = 1;

        let lUntokenisedText: string = pText;

        // Loop till end.
        while (true) {
            // Skip on file end.
            if (lUntokenisedText.length === 0) {
                break;
            }

            // Skip all set whitespaces.
            if (this.mSettings.trimSpaces && this.mSettings.whiteSpaces.has(lUntokenisedText.charAt(0))) {
                const lWhitespaceCharacter: string = lUntokenisedText.charAt(0);

                // Start newline when whitespace is a newline.
                if (lWhitespaceCharacter === '\n') {
                    lCurrentLineNumber++;
                    lCurrentColumnNumber = 1;
                } else {
                    // On every other character, count column.
                    lCurrentColumnNumber++;
                }

                // Update untokenised list.
                lUntokenisedText = lUntokenisedText.substring(1);

                // Skip to next character.
                continue;
            }

            // Find next token.
            for (const lTokenType of this.mTokenTypes) {
                const lTokenPattern: RegExp = this.mTokenPatterns.get(lTokenType)!;

                yield <any>null;
            }

            // Throw erros when the current untokenised text can't be tokenised.
            if (lUntokenisedText.length !== 0) {
                throw new ParserException(`Invalid token. Can't tokenise ${lUntokenisedText}`, this, lCurrentColumnNumber, lCurrentLineNumber);
            }
        }
    }
}

type LexerSettings = {
    trimSpaces: boolean;
    whiteSpaces: Set<string>;
};

export type LexerToken<TTokenType> = {
    type: TTokenType;
    value: string;
    lineNumber: number;
    columnNumber: number;
};