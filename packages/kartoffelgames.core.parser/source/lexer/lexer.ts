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
    private mCurrentPatternScope: Array<LexerPatternDefinition<TTokenType>> | null;
    private readonly mSettings: LexerSettings<TTokenType>;

    // Token pattern data.
    private readonly mTokenPatternTemplates: Dictionary<string, LexerPatternDefinition<TTokenType>>;
    private readonly mTokenPatterns: Array<LexerPatternDefinition<TTokenType>>;

    /**
     * Set token type of faulty token.
     * When the error type is not set, every faulty token throws an error.
     */
    public get errorType(): TTokenType | null {
        return this.mSettings.errorType;
    } set errorType(pValue: TTokenType | null) {
        this.mSettings.errorType = pValue;
    }

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
        this.mTokenPatterns = new Array<LexerPatternDefinition<TTokenType>>();
        this.mTokenPatternTemplates = new Dictionary<string, LexerPatternDefinition<TTokenType>>();

        // Set defaults.
        this.mCurrentPatternScope = this.mTokenPatterns;
        this.mSettings = {
            errorType: null,
            trimSpaces: true,
            whiteSpaces: new Set<string>()
        };
    }

    /**
     * Add token pattern. Patterns with the same specification get grouped.
     * When a token matches multiple times within the same group the first added pattern or a longer matched token gets priorized.
     * 
     * @param pPattern - Token pattern definintion.
     * @param pInnerFetch - Token added inside this function are scoped to this token.
     * 
     * @remarks
     * Token added inside {@link pInnerFetch} are scoped to this token.
     * Only token with and `start`, `inner` and `end` group can have a fetch function.
     * 
     * @throws {@link Exception}
     * When the token pattern should be scoped to another token without and `inner` group.
     * 
     * @example Set two types of tokens
     * ``` Typescript
     * // Token with start and end token.
     * lexer.addTokenPattern({
     *     pattern: {
     *         start: {
     *             regex: /</,
     *             type: 'open'
     *         },
     *         end: {
     *             regex: /(?<close>>)|(?<selfClose>\/>)/,
     *             type: {
     *                 close: 'closeBracket',
     *                 selfClose: 'closeClosingBracket'
     *             }
     *         }
     *     },
     *     specificity: 2,
     *     meta: 'tag.xml'
     * }, (pLexer: Lexer<XmlToken>) => {
     *     // Token that can appeare only inside tags.
     *     pLexer.useTokenTemplate('quotedString');
     * }); 
     * 
     * // Single token.
     * lexer.addTokenPattern({
     *     pattern: {
     *         regex: /(?<token>[^<>"]+)[^<>]*(<|$)/,
     *         type: 'textValue'
     *     },
     *     specificity: 4,
     *     meta: 'value.xml'
     * });
     * ```
     */
    public addTokenPattern(pPattern: LexerPattern<TTokenType>, pInnerFetch?: (pLexer: Lexer<TTokenType>) => void): void {
        const lConvertedPattern: LexerPatternDefinition<TTokenType> = this.convertTokenPattern(pPattern);

        // Enforce inner fetch for pattern with a start and end token.
        if ('start' in lConvertedPattern.pattern && !pInnerFetch) {
            throw new Exception('Split token with a start and end token, need inner token definitions.', this);
        }

        // Throw when scoped pattern has no inner group.
        if (this.mCurrentPatternScope === null) {
            throw new Exception('Parent pattern does not allow inner token pattern.', this);
        }

        // Set pattern for current pattern scope.
        this.mCurrentPatternScope.push(lConvertedPattern);

        // Execute scoped pattern.
        if (pInnerFetch) {
            // Buffer last scope and set created pattern as current scope.
            const lLastPatternScope: Array<LexerPatternDefinition<TTokenType>> = this.mCurrentPatternScope;
            this.mCurrentPatternScope = lConvertedPattern.innerPattern;

            // Execute inner pattern fetches.
            pInnerFetch(this);

            // Reset scope to last used scope.
            this.mCurrentPatternScope = lLastPatternScope;
        }
    }

    /**
     * Add token pattern template.
     * When a token matches multiple times within the same group the first added pattern or a longer matched token gets priorized.
     * 
     * @param pName - Template name.
     * @param pPattern - Token pattern definintion.
     * @param pInnerFetch - Token added inside this function are scoped to this token.
     * 
     * @remarks
     * Token added inside {@link pInnerFetch} are scoped to this token.
     * Only token with and `start`, `inner` and `end` group can have a fetch function.
     * 
     * @throws {@link Exception}
     * When the token pattern should be scoped to another token without and `inner` group.\
     * When a template with the same name was already been added.\
     * When a template is added inside a scoped call.
     * 
     * @example Add a pattern template and use it in a scoped call.
     * ``` Typescript
     * const lexer: Lexer<string> = new Lexer<string>();
     * 
     * // Define quoted string token template.
     * lexer.addTokenTemplate('quotedString', {
     *    pattern: {
     *        regex: /(["']).*?\1/,
     *        type: 'quotedString'
     *    },
     *    specificity: 1
     * });
     * 
     * lexer.addTokenPattern({...}, (pLexer: Lexer<string>) => {
     *      // Token that can appeare only inside this token.
     *      pLexer.useTokenTemplate('quotedString');
     *  });
     * 
     * // Apply token to the root patterns.
     * lexer.useTokenTemplate('quotedString');
     * ``` 
     */
    public addTokenTemplate(pName: string, pPattern: LexerPattern<TTokenType>, pInnerFetch?: (pLexer: Lexer<TTokenType>) => void): void {
        // Restrict defining templates inside scoped calls.
        if (this.mCurrentPatternScope === this.mTokenPatterns) {
            throw new Exception('Defining token templates are not allows inside scoped calls.', this);
        }

        // Restrict dublicate template names.
        if (this.mTokenPatternTemplates.has(pName)) {
            throw new Exception(`Can't add dublicate token template "${pName}"`, this);
        }

        // Convert and add named pattern.
        const lConvertedPattern: LexerPatternDefinition<TTokenType> = this.convertTokenPattern(pPattern);
        this.mTokenPatternTemplates.set(pName, lConvertedPattern);

        // At this point the template can reference itself.

        // Execute scoped pattern.
        if (pInnerFetch) {
            // Buffer last scope and set created pattern as current scope.
            const lLastPatternScope: Array<LexerPatternDefinition<TTokenType>> | null = this.mCurrentPatternScope;
            this.mCurrentPatternScope = lConvertedPattern.innerPattern;

            // Execute inner pattern fetches.
            pInnerFetch(this);

            // Reset scope to last used scope.
            this.mCurrentPatternScope = lLastPatternScope;
        }
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

    /**
     * Load template into the current pattern scope.
     * Copies template and does not alter the original on specificity override.
     * 
     * @param pTemplateName - Template name.
     * @param pSpecificity - Override template specificity.
     * 
     * @throws {@link Exception}
     * When the template does not exists.
     * 
     * @example Use template in root and pattern scope
     * ``` Typescript
     * const lexer = new Lexer<number>();
     * lexer.addTokenTemplate('myName', {...});
     * 
     * // Also usable inside addTokenTemplate scopes.
     * lexer.addTokenPattern({...}, (lexerParam) => {
     *      // Scoped call.
     *      lexerParam.useTokenTemplate('myName', 2);
     * });
     * 
     * // Root call.
     * lexerParam.useTokenTemplate('myName');
     * ```
     */
    public useTokenTemplate(pTemplateName: string, pSpecificity?: number): void {
        // Validate pattern.
        if (this.mTokenPatternTemplates.has(pTemplateName)) {
            throw new Exception(`Lexer template "${pTemplateName}" does not exist.`, this);
        }

        // Throw when scoped pattern has no inner group.
        if (this.mCurrentPatternScope === null) {
            throw new Exception('Parent pattern does not allow inner token pattern.', this);
        }

        // Read pattern template. Clone template and alter specificity when is differs from parameter.
        let lTemplate: LexerPatternDefinition<TTokenType> = this.mTokenPatternTemplates.get(pTemplateName)!;
        if (typeof pSpecificity !== 'undefined' && lTemplate.specificity !== pSpecificity) {
            lTemplate = { ...lTemplate, specificity: pSpecificity };
        }

        // Set template pattern to current pattern scope.
        this.mCurrentPatternScope.push(lTemplate);
    }

    /**
     * Convert a pattern into an easy readable definition.
     * 
     * @param pPattern - Pattern.
     *  
     * @returns easy to read token pattern.
     */
    private convertTokenPattern(pPattern: LexerPattern<TTokenType>): LexerPatternDefinition<TTokenType> {
        // Convert regex into a line start regex with global and single flag.
        const lConvertRegex = (pRegex: RegExp): RegExp => {
            // Add global and singleline flags remove every other flags except insensitive, unicode or Ungreedy.
            const lPatternFlags: string = pRegex.flags.replace(/[gmxsAJD]/g, '') + 'gs';

            // Create pattern with adjusted settings and added line start anchor to regex.
            return new RegExp(`^(?<token>${pRegex.source})`, lPatternFlags);
        };

        // Convert nested pattern type into linear pattern type definition.
        const lConvertPatternType = (pType: LexerPatternType<TTokenType>): LexerPatternDefinitionType<TTokenType> => {
            // Single token type. Defaults to token group name.
            if (typeof pType === 'string') {
                return { token: pType };
            }

            return pType;
        };

        // Convert pattern.
        let lPattern: LexerPatternDefinition<TTokenType>['pattern'];
        if ('regex' in pPattern.pattern) {
            // Single pattern
            lPattern = {
                single: {
                    regex: lConvertRegex(pPattern.pattern.regex),
                    type: lConvertPatternType(pPattern.pattern.type)
                }
            };
        } else {
            // Start end pattern.
            lPattern = {
                start: {
                    regex: lConvertRegex(pPattern.pattern.start.regex),
                    type: lConvertPatternType(pPattern.pattern.start.type)
                },
                end: {
                    regex: lConvertRegex(pPattern.pattern.end.regex),
                    type: lConvertPatternType(pPattern.pattern.end.type)
                },
                // Optional inner type.
                innerType: pPattern.pattern.innerType ?? null
            };
        }

        // Create metas.
        const lMetaList: Array<string> = new Array<string>();

        // Type to pattern mapping.
        return {
            pattern: lPattern,
            specificity: pPattern.specificity,
            meta: lMetaList,
            innerPattern: new Array<LexerPatternDefinition<TTokenType>>()
        };
    }
}

type LexerSettings<TTokenType> = {
    trimSpaces: boolean;
    whiteSpaces: Set<string>;
    errorType: TTokenType | null;
};

type LexerPatternDefinitionType<TTokenType> = { [SubGroup: string]: TTokenType; };
type LexerPatternDefinition<TTokenType> = {
    pattern: {
        start: { regex: RegExp; type: LexerPatternDefinitionType<TTokenType>; };
        end: { regex: RegExp; type: LexerPatternDefinitionType<TTokenType>; };
        innerType: TTokenType | null;
    } | {
        single: { regex: RegExp; type: LexerPatternDefinitionType<TTokenType>; };
    };
    specificity: number;
    meta: Array<string>;
    innerPattern: Array<LexerPatternDefinition<TTokenType>> | null;
};

/* 
 * Pattern definition.
 */
type LexerPatternType<TTokenType> = TTokenType | { [SubGroup: string]: TTokenType; };
type LexerPattern<TTokenType> = {
    pattern: {
        regex: RegExp;
        type: LexerPatternType<TTokenType>;
    } | {
        start: {
            regex: RegExp;
            type: LexerPatternType<TTokenType>;
        },
        end: {
            regex: RegExp;
            type: LexerPatternType<TTokenType>;
        };
        innerType?: TTokenType;
    };
    specificity: number;
    meta?: string | Array<string>;
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
    pattern: {
        regex: /(["']).*?\1/,
        type: XmlToken.Value
    },
    specificity: 1
});
lLexer.addTokenTemplate('identifier', {
    pattern: {
        regex: /[^<>\s\n/:="]+/,
        type: XmlToken.Identifier,
    },
    specificity: 5
});
lLexer.addTokenTemplate('namespaceDelimiter', {
    pattern: {
        regex: /:/,
        type: XmlToken.NamespaceDelimiter
    },
    specificity: 3
});

// Comment.
lLexer.addTokenPattern({
    pattern: {
        regex: /<!--.*?-->/,
        type: XmlToken.Comment,
    },
    specificity: 0,
    meta: 'comment.xml'
});

// Opening tag.
lLexer.addTokenPattern({
    pattern: {
        start: {
            regex: /</,
            type: XmlToken.OpenBracket
        },
        end: {
            regex: /(?<end_close>>)|(?<end_selfClose>\/>)/,
            type: {
                close: XmlToken.CloseBracket,
                selfClose: XmlToken.CloseClosingBracket
            }
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
        pattern: {
            regex: /=/,
            type: XmlToken.Assignment
        },
        specificity: 3
    });
});

// Values.
lLexer.addTokenPattern({
    pattern: {
        regex: /(?<token>[^<>"]+)[^<>]*(<|$)/,
        type: XmlToken.Value
    },
    specificity: 4,
    meta: 'value.xml'
});
lLexer.useTokenTemplate('quotedString');

// Closing tag.
lLexer.addTokenPattern({
    pattern: {
        start: {
            regex: /<\//,
            type: XmlToken.OpenBracket
        },
        end: {
            regex: />/,
            type: {
                close: XmlToken.CloseBracket,
                selfClose: XmlToken.CloseClosingBracket
            }
        }
    },
    specificity: 1,
    meta: 'tag.xml'
}, (pLexer: Lexer<XmlToken>) => {
    // Token that can appeare only inside closing tags.
    pLexer.useTokenTemplate('identifier');
    pLexer.useTokenTemplate('namespaceDelimiter');
});