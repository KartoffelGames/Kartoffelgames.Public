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
     * @param pText - Text holding a grammar that can be completly tokenized by the set token patterns.
     * 
     * @returns Generator that yields any valid token that can be found with the set token patterns.
     * 
     * @throws 
     * On any text part that can not be tokeniszd.
     */
    public * tokenize(pText: string): Generator<LexerToken<TTokenType>> {
        let lCurrentLineNumber = 1;
        let lCurrentColumnNumber = 1;

        let lUntokenizedText: string = pText;

        // Loop till end.
        while (lUntokenizedText.length !== 0) {
            // Skip all set whitespaces.
            if (this.mSettings.trimSpaces && this.mSettings.whiteSpaces.has(lUntokenizedText.charAt(0))) {
                const lWhitespaceCharacter: string = lUntokenizedText.charAt(0);

                // Start newline when whitespace is a newline.
                if (lWhitespaceCharacter === '\n') {
                    lCurrentLineNumber++;
                    lCurrentColumnNumber = 1;
                } else {
                    // On every other character, count column.
                    lCurrentColumnNumber++;
                }

                // Update untokenised text.
                lUntokenizedText = lUntokenizedText.substring(1);

                // Skip to next character.
                continue;
            }

            let lBestToken: LexerToken<TTokenType> | null = null;

            // Find next token.
            for (const lTokenType of this.mTokenTypes) {
                const lTokenPattern: RegExp = this.mTokenPatterns.get(lTokenType)!;

                // Execute pattern and reset last position.
                const lPatternMatch: RegExpExecArray | null = lTokenPattern.exec(lUntokenizedText);
                lTokenPattern.lastIndex = 0;

                // Process token on pattern match.
                if (lPatternMatch) {
                    // Read token group or complete match when no token group was specified.
                    const lPatternData: string = lPatternMatch.groups!['token'] ?? lPatternMatch[0];

                    // Update token when no token was set, or a better token, a longer one, was found.
                    if (!lBestToken || lPatternData.length > lBestToken.value.length) {
                        lBestToken = {
                            type: lTokenType,
                            value: lPatternData,
                            lineNumber: lCurrentLineNumber,
                            columnNumber: lCurrentColumnNumber
                        };
                    }
                }
            }

            // Throw erros when the current untokenized text can't be tokenized.
            if (!lBestToken) {
                throw new ParserException(`Invalid token. Can't tokenize ${lUntokenizedText}`, this, lCurrentColumnNumber, lCurrentLineNumber);
            }

            // Move cursor.
            const lLines: Array<string> = lBestToken.value.split('\n');

            // Reset column number when any newline was tokenized.
            if (lLines.length > 1) {
                lCurrentColumnNumber = 0;
            }

            // Step line and column number.
            lCurrentLineNumber += lLines.length - 1;
            lCurrentColumnNumber += lLines.at(-1)!.length;

            // Update untokenised text.
            lUntokenizedText = lUntokenizedText.substring(lBestToken.value.length);

            // Yield best found token.
            yield lBestToken;
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