import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { ParserException } from '../parser-exception';
import { LexerToken } from './lexer-token';

/**
 * Lexer or tokenizer. Turns a text with grammar into tokens.
 * Creates a iterator that iterates over each found token till end of text.
 * 
 * @typeParam T - Token types. Best to use some sort of enumerator.
 * 
 * @public
 */
export class Lexer<TTokenType extends string> {
    private mCurrentSubPattern: LexerPattern<TTokenType> | null;
    private readonly mSettings: LexerSettings;
    private readonly mTokenPatterns: Dictionary<TTokenType, LexerPattern<TTokenType>>;
    private readonly mPatternTemplate: Dictionary<string, LexerPattern<TTokenType>>;

    /**
     * Enable or disable whitespace trimming.
     * 
     * @remark
     * {@link Lexer.tokenise} skips all whitespaces before and after found token.
     * Recognised whitespaces of this lexer can be set by setting a string of all valid whitespace characters to {@link Lexer.validWhitespaces}.
     */
    public get trimWhitespace(): boolean {
        return this.mSettings.trimSpaces;
    } set trimWhitespace(pValue: boolean) {
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
        this.mPatternTemplate = new Dictionary<string, LexerPattern<TTokenType>>();
        this.mTokenPatterns = new Dictionary<TTokenType, LexerPattern<TTokenType>>();

        // Set defaults.
        this.mSettings = {
            trimSpaces: true,
            whiteSpaces: new Set<string>()
        };
    }

    /**
     * Add token pattern. Patterns with the same specification get grouped.
     * When a token matches multiple times within the same group the first added pattern or a longer matched token gets priorized.
     * 
     * @param pPattern - Token pettern must not be unique but should.
     * @param pType - Pattern type.
     * @param pSpecification - Token specification. Lower numbers gets prioritzed over higher numbers.
     * 
     * @throws 
     * On adding a dublicate type.
     * 
     * @example Set two types of tokens for a text.
     * ``` Typescript
     * const lexer = new Lexer<'number' | 'string' | 'text-a-ending'>();
     * lexer.addTokenPattern(/[0-9]+/, 'number', 0);
     * lexer.addTokenPattern(/[a-zA-Z]+/, 'text', 0);
     *  // Token that ends with an a. The ending a will not be skipped.
     * lexer.addTokenPattern(/(?<token>[a-zA-Z]+)a/, 'text-a-ending', 1);
     * 
     * lexer.addTokenPattern(/[a-zA-Z0-9]+/, 'text', 0); // => Fails
     * ``` 
     */
    public addTokenPattern(pPattern: LexerPattern<TTokenType>, pInnerFetch?: (pLexer: Lexer<XmlToken>) => void): void {


        // Add line start anchor to pattern.
        let lPatterSource: string = pPattern.source;
        if (!lPatterSource.startsWith('^')) {
            lPatterSource = '^' + lPatterSource;
        }

        // Add global and singleline flags remove every other flags except insensitive, unicode or Ungreedy.
        let lPatternFlags: string = pPattern.flags.replace(/[gmxsAJD]/g, '');
        lPatternFlags += 'gs';

        // Create pattern with adjusted settings.
        const lConvertedPattern: RegExp = new RegExp(lPatterSource, lPatternFlags);

        // Ordered type list.
        this.mTokenSpecifications.set(pType, pSpecification);

        // Type to pattern mapping.
        this.mTokenPatterns.set(pType, lConvertedPattern);
    }

    public addTokenTemplate(pName: string, pPattern: LexerPattern<TTokenType>, pInnerFetch?: (pLexer: Lexer<XmlToken>) => void): void {

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

        // Create ordered token type list by specification.
        const lTokenList: Array<TTokenType> = [...this.mTokenSpecifications.keys()].sort((pA: TTokenType, pB: TTokenType) => {
            // Sort lower specification at a lower index than higher specifications.
            return this.mTokenSpecifications.get(pA)! - this.mTokenSpecifications.get(pB)!;
        });

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

            const lBestMatch: { token: LexerTokenInformation<TTokenType> | null, specification: number; } = { token: null, specification: 0 };

            // Find next token.
            for (const lTokenType of lTokenList) {
                const lTokenPattern: RegExp = this.mTokenPatterns.get(lTokenType)!;
                const lTokenSpecifiaction: number = this.mTokenSpecifications.get(lTokenType)!;

                // Exit search when a token previous found with a better specification.
                if (lBestMatch.token && lBestMatch.specification < lTokenSpecifiaction) {
                    break;
                }

                // Execute pattern and reset last position.
                const lPatternMatch: RegExpExecArray | null = lTokenPattern.exec(lUntokenizedText);
                lTokenPattern.lastIndex = 0;

                // Process token on pattern match.
                if (lPatternMatch) {
                    // Read token group or complete match when no token group was specified.
                    const lPatternData: string = lPatternMatch.groups?.['token'] ?? lPatternMatch[0];

                    // Update token when no token was set, or a better token, a longer one, was found.
                    if (!lBestMatch.token || lPatternData.length > lBestMatch.token.value.length) {
                        lBestMatch.token = {
                            type: lTokenType,
                            value: lPatternData,
                            lineNumber: lCurrentLineNumber,
                            columnNumber: lCurrentColumnNumber
                        };
                        lBestMatch.specification = lTokenSpecifiaction;
                    }
                }
            }

            // Throw erros when the current untokenized text can't be tokenized.
            if (!lBestMatch.token) {
                throw new ParserException(`Invalid token. Can't tokenize "${lUntokenizedText}"`, this, lCurrentColumnNumber, lCurrentLineNumber, lCurrentColumnNumber, lCurrentLineNumber);
            }

            // Move cursor.
            const lLines: Array<string> = lBestMatch.token.value.split('\n');

            // Reset column number when any newline was tokenized.
            if (lLines.length > 1) {
                lCurrentColumnNumber = 0;
            }

            // Step line and column number.
            lCurrentLineNumber += lLines.length - 1;
            lCurrentColumnNumber += lLines.at(-1)!.length;

            // Update untokenised text.
            lUntokenizedText = lUntokenizedText.substring(lBestMatch.token.value.length);

            // Yield best found token.
            yield new LexerToken(lBestMatch.token.type, lBestMatch.token.value, lBestMatch.token.columnNumber, lBestMatch.token.lineNumber);
        }
    }

    public useTokenTemplate(pTemplateName: string): void {

    }

    /**
     * Resolve a pattern reference by name.
     * Can only resolve existing pattern templates.
     * 
     * @param pTemplateName 
     * @returns 
     * 
     * @throws {@link Exception}
     * When no pattern template with the provided {@link pTemplateName} was found.
     */
    private resolvePatternReference(pTemplateName: string): LexerPattern<TTokenType> {
        if (this.mPatternTemplate.has(pTemplateName)) {
            throw new Exception(`Pattern template "${pTemplateName}" not found.`, this);
        }

        return this.mPatternTemplate.get(pTemplateName)!;
    }
}

type LexerSettings<TTokenType> = {
    trimSpaces: boolean;
    whiteSpaces: Set<string>;
    skipErrors: boolean,
    errorType: TTokenType;
};

/* 
 * Pattern definition.
 */
type LexerPattern<TTokenType> = {
    pattern: RegExp; // Flow over Regex groups (start, inner, end) or (token)
    type?: TTokenType | { // Single type only for (token) or Fullmatch pattern. (start, inner, end) Needs complex types.
        start?: TTokenType | { [SubGroup: string]: TTokenType; };
        inner?: TTokenType | { [SubGroup: string]: TTokenType; };
        end?: TTokenType | { [SubGroup: string]: TTokenType; };
    };
    specificity: number;
    meta?: string;
};


// TEST

enum XmlToken {
    OpenBracket = 'Open braket',
    CloseBracket = 'Close braket',
    Comment = 'Comment',
    OpenClosingBracket = 'Open closing braket',
    CloseClosingBracket = 'Close closing braket',
    Identifier = 'Identifier',
    Value = 'Value',
    Assignment = 'Assignment',
    NamespaceDelimiter = 'Namespace delimiter'
}

const lLexer: Lexer<XmlToken> = new Lexer<XmlToken>();
lLexer.validWhitespaces = ' \n';
lLexer.trimWhitespace = true;

// Repository.
lLexer.addTokenTemplate('quotedString', {
    pattern: /(["']).*?\1/,
    type: XmlToken.Value,
    specificity: 1
});
lLexer.addTokenTemplate('identifier', {
    pattern: /[^<>\s\n/:="]+/,
    type: XmlToken.Identifier,
    specificity: 5
});
lLexer.addTokenTemplate('namespaceDelimiter', {
    pattern: /:/,
    type: XmlToken.NamespaceDelimiter,
    specificity: 3
});

// Comment.
lLexer.addTokenPattern({
    pattern: /<!--.*?-->/,
    type: XmlToken.Comment,
    specificity: 0,
    meta: 'comment.xml'
});

// Opening tag.
lLexer.addTokenPattern({
    pattern: /(?<start><)(?<inner>.*?)(?<end>(?<end_close>>)|(?<end_selfClose>\/>))/,
    type: {
        start: XmlToken.OpenBracket,
        end: {
            close: XmlToken.CloseBracket,
            selfClose: XmlToken.CloseClosingBracket
        }
    },
    specificity: 2,
    meta: 'tag.xml'
}, (pLexer: Lexer<XmlToken>) => {
    // Token that can appeare only inside tags.
    pLexer.useTokenTemplate('quotedString');
    pLexer.useTokenTemplate('identifier');
    pLexer.useTokenTemplate('namespaceDelimiter');
    pLexer.addTokenPattern({
        pattern: /=/,
        type: XmlToken.Assignment,
        specificity: 3
    });
});

// Values.
lLexer.addTokenPattern({
    pattern: /(?<token>[^<>"]+)[^<>]*(<|$)/,
    type: XmlToken.Value,
    specificity: 4,
    meta: 'value.xml'
});
lLexer.useTokenTemplate('quotedString');

// Closing tag.
lLexer.addTokenPattern({
    pattern: /(?<start><\/)(?<inner>\s*[^/].*?)(?<end>>)/,
    type: {
        start: XmlToken.OpenBracket,
        end: {
            close: XmlToken.CloseBracket,
            selfClose: XmlToken.CloseClosingBracket
        }
    },
    specificity: 1,
    meta: 'tag.xml'
}, (pLexer: Lexer<XmlToken>) => {
    // Token that can appeare only inside closing tags.
    pLexer.useTokenTemplate('identifier');
    pLexer.useTokenTemplate('namespaceDelimiter');
});