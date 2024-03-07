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
    private mCurrentPatternScope: Array<LexerPatternDefinition<TTokenType>>;
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
     * @remarks
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
        // Generate random name.
        const lRandomTokenName: string = (Math.random() * Math.pow(10, 16)).toString(16);

        // Add token as template.
        this.addTokenTemplate(lRandomTokenName, pPattern, pInnerFetch);

        // Apply token template to current scope.
        this.useTokenTemplate(lRandomTokenName, pPattern.specificity);
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
     * When the token pattern should be scoped to another token without and `inner` group.
     * When a template with the same name was already been added.
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
    public addTokenTemplate(pName: string, pPattern: LexerPatternTemplate<TTokenType>, pInnerFetch?: (pLexer: Lexer<TTokenType>) => void): void {
        // Restrict dublicate template names.
        if (this.mTokenPatternTemplates.has(pName)) {
            throw new Exception(`Can't add dublicate token template "${pName}"`, this);
        }

        // Convert and add named pattern.
        const lConvertedPattern: LexerPatternDefinition<TTokenType> = this.convertTokenPattern(pPattern);

        // Enforce inner fetch for pattern with a start and end token.
        if (lConvertedPattern.patternType === 'split' && !pInnerFetch) {
            throw new Exception('Split token with a start and end token, need inner token definitions.', this);
        }

        // Single pattern types forbid inner fetches.
        if (lConvertedPattern.patternType === 'single' && pInnerFetch) {
            throw new Exception('Pattern does not allow inner token pattern.', this);
        }

        // At this point the template can reference itself.
        this.mTokenPatternTemplates.set(pName, lConvertedPattern);

        // Execute scoped pattern.
        if (pInnerFetch && lConvertedPattern.patternType === 'split') {
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
        // Create tokenize cursor.
        const lCursor: LexerCursor = {
            data: pText,
            cursorPosition: 0,
            currentColumn: 1,
            currentLine: 1,
            error: null
        };

        yield* this.tokenizeRecursionLayer(lCursor, this.mTokenPatterns, new Array<string>(), null, null);
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
    public useTokenTemplate(pTemplateName: string, pSpecificity: number): void {
        // Validate pattern.
        if (!this.mTokenPatternTemplates.has(pTemplateName)) {
            throw new Exception(`Lexer template "${pTemplateName}" does not exist.`, this);
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
    private convertTokenPattern(pPattern: LexerPattern<TTokenType> | LexerPatternTemplate<TTokenType>): LexerPatternDefinition<TTokenType> {
        // Convert regex into a line start regex with global and single flag.
        const lConvertRegex = (pRegex: RegExp): RegExp => {
            // Create flag set and add sticky. Set removes all dublicate flags.
            const lFlags: Set<string> = new Set(pRegex.flags.split(''));
            lFlags.add('g');

            // Create pattern with same flags and added default group.
            return new RegExp(`(?<token>${pRegex.source})`, [...lFlags].join(''));
        };

        // Convert nested pattern type into linear pattern type definition.
        const lConvertPatternType = (pType: LexerPatternType<TTokenType>): LexerPatternDefinitionType<TTokenType> => {
            // Single token type. Defaults to token group name.
            if (typeof pType === 'string') {
                return { token: pType };
            }

            return pType;
        };

        // Create metas.
        const lMetaList: Array<string> = new Array<string>();
        if (pPattern.meta) {
            if (typeof pPattern.meta === 'string') {
                lMetaList.push(pPattern.meta);
            } else {
                lMetaList.push(...pPattern.meta);
            }
        }

        // Default specificity of 0 for templates.
        const lSpecificity: number = 'specificity' in pPattern ? pPattern.specificity : 0;

        // Convert pattern.
        if ('regex' in pPattern.pattern) {
            // Single pattern
            return {
                patternType: 'single',
                specificity: lSpecificity,
                pattern: {
                    single: {
                        regex: lConvertRegex(pPattern.pattern.regex),
                        types: lConvertPatternType(pPattern.pattern.type)
                    }
                },
                meta: lMetaList
            };
        } else {
            // Start end pattern.
            return {
                patternType: 'split',
                specificity: lSpecificity,
                pattern: {
                    start: {
                        regex: lConvertRegex(pPattern.pattern.start.regex),
                        types: lConvertPatternType(pPattern.pattern.start.type)
                    },
                    end: {
                        regex: lConvertRegex(pPattern.pattern.end.regex),
                        types: lConvertPatternType(pPattern.pattern.end.type)
                    },
                    // Optional inner type.
                    innerType: pPattern.pattern.innerType ?? null
                },
                meta: lMetaList,
                innerPattern: new Array<LexerPatternDefinition<TTokenType>>()
            };
        }
    }

    /**
     * Try to find valid token based on the provided token patter.
     * When it find the token, it clears the cursor error and prepend those token into the result when it is not empty,
     * moves the cursor and returns.
     * 
     * The result is always empty then the current token and provided tokenpatten does not match.
     * 
     * @param pTokenPattern - Current token pattern to seach next match.
     * @param pRegex - Regex of current pattern. Can be single, end or start regex of token.
     * @param pTokenTypes - Types of pattern. Can be single, end or start types of token.
     * @param pCursor - Current lexer token.
     * @param pCurrentMetas - Current metas valid in recursion scope.
     * @param pForcedType - Forced token type. Overrides all types specified in {@link pTokenTypes}.
     * 
     * @returns The found token based on {@link pTokenPattern} and additionally the an error token when the cursor has errors stored. 
     */
    private findNextTokenAndMove(pTokenPattern: LexerPatternDefinition<TTokenType>, pRegex: RegExp, pTokenTypes: LexerPatternDefinitionType<TTokenType>, pCursor: LexerCursor, pCurrentMetas: Array<string>, pForcedType: TTokenType | null): Array<LexerToken<TTokenType>> {
        const lTokenList: Array<LexerToken<TTokenType>> = new Array<LexerToken<TTokenType>>();

        const lTokenRegex: RegExp = pRegex;
        lTokenRegex.lastIndex = pCursor.cursorPosition;

        // Try to match pattern. Pattern is valid when matched from first character.
        const lTokenStartMatch: RegExpExecArray | null = lTokenRegex.exec(pCursor.data);
        if (!lTokenStartMatch || lTokenStartMatch.index !== pCursor.cursorPosition) {
            return lTokenList; // Empty list.
        }

        // Yield error token when a next valid token was found.
        const lErrorToken: LexerToken<TTokenType> | null = this.generateErrorToken(pCursor, pCurrentMetas);
        if (lErrorToken) {
            lTokenList.push(lErrorToken);
        }

        // Generate single token, move cursor and yield..
        const lSingleToken: LexerToken<TTokenType> = this.generateToken(pCursor, [...pCurrentMetas, ...pTokenPattern.meta], lTokenStartMatch, pTokenTypes, pForcedType);
        this.moveCursor(pCursor, lSingleToken.value);

        // Add found token to token list.
        lTokenList.push(lSingleToken);

        return lTokenList;
    }

    /**
     * Map the first found regex group that matches to a type of the group to type match object.
     * Return the found token type.
     * 
     * @param pTokenMatch - Token regex match. Match must at least contains a "token"-group.
     * @param pTypes - Available group to type match object.
     * 
     * @returns The found token type of a matched regex match group.  
     */
    private findTokenTypeOfMatch(pTokenMatch: RegExpExecArray, pTypes: LexerPatternDefinitionType<TTokenType>): TTokenType {
        // Find correct group for match.
        for (const lGroupName in pTokenMatch.groups!) {
            // Get regex group value
            const lGroupValue: string | undefined = pTokenMatch.groups[lGroupName];
            const lGroupType: TTokenType | undefined = pTypes[lGroupName];

            // Validate if group has a value and the group has a attachted token type.
            if (!lGroupValue || !lGroupType) {
                continue;
            }

            // Validate if group matches the whole match.
            if (lGroupValue.length !== pTokenMatch[0].length) {
                throw new Exception('A group of a token pattern must match the whole token.', this);
            }

            return lGroupType;
        }

        // No group that matched a token type was found.
        throw new Exception('No token type for any defined pattern regex group was found.', this);
    }

    /**
     * Generate new error lexer token. When error data is available.
     * When not error data is available or no error token type is specified, null is returned.
     * 
     * @param pCursor - Cursor object.
     * 
     * @returns Error token when error data is available.  
     */
    private generateErrorToken(pCursor: LexerCursor, pParentMetas: Array<string>): LexerToken<TTokenType> | null {
        if (!pCursor.error || !this.mSettings.errorType) {
            return null;
        }

        // Generate error token.
        const lErrorToken: LexerToken<TTokenType> = new LexerToken<TTokenType>(this.mSettings.errorType, pCursor.error.data, pCursor.error.startColumn, pCursor.error.startLine);
        lErrorToken.addMeta(...pParentMetas);

        // Reset error cursor.
        pCursor.error = null;

        return lErrorToken;
    }

    /**
     * Generate a token for a matched token.
     * 
     * @param pCursor - Current cursor.
     * @param pTokenPattern - Token pattern.
     * @param pTokenMatch - Match array of found token.
     * @param pAvailableTokenTypes - Match group to token mapping. 
     * @param pParentMetas - Metas of parent pattern.
     * @param pForcedType - Forced type of token.
     * 
     * @returns A new generated token with the current cursor data.  
     */
    private generateToken(pCursor: LexerCursor, pTokenMetas: Array<string>, pTokenMatch: RegExpExecArray, pAvailableTokenTypes: LexerPatternDefinitionType<TTokenType>, pForcedType: TTokenType | null): LexerToken<TTokenType> {
        // Read token type of
        const lTokenValue: string = pTokenMatch[0];
        const lTokenType: TTokenType = this.findTokenTypeOfMatch(pTokenMatch, pAvailableTokenTypes);

        // Create single value token and append metas. Force token type when forced type is set.
        const lToken: LexerToken<TTokenType> = new LexerToken<TTokenType>(pForcedType ?? lTokenType, lTokenValue, pCursor.currentColumn, pCursor.currentLine);
        lToken.addMeta(...pTokenMetas);

        return lToken;
    }

    /**
     * Move cursor for the provided {@link pToken.value}.
     * 
     * @param pCursor - Cursor object.
     * @param pToken - Token.
     */
    private moveCursor(pCursor: LexerCursor, pTokenValue: string): void {
        // Move cursor.
        const lLines: Array<string> = pTokenValue.split('\n');

        // Reset column number when any newline was tokenized.
        if (lLines.length > 1) {
            pCursor.currentColumn = 1;
        }

        // Step line and column number.
        pCursor.currentLine += lLines.length - 1;
        pCursor.currentColumn += lLines.at(-1)!.length;

        // Update untokenised text.
        pCursor.cursorPosition += pTokenValue.length;
    }

    /**
     * Move cursor forward one character when it is a white space character.
     * 
     * @param pCursor - Tokenize cursor.
     */
    private skipNextWhitespace(pCursor: LexerCursor): boolean {
        const lCharacter: string = pCursor.data.charAt(pCursor.cursorPosition);

        // Validate character if it can be skipped.
        if (!this.mSettings.trimSpaces || !this.mSettings.whiteSpaces.has(lCharacter)) {
            return false;
        }

        // Start newline when whitespace is a newline.
        if (lCharacter === '\n') {
            pCursor.currentLine++;
            pCursor.currentColumn = 1;
        } else {
            // On every other character, count column.
            pCursor.currentColumn++;
        }

        // Move cursor forward by one.
        pCursor.cursorPosition += 1;

        return true;
    }

    /**
     * Tokenize data present in {@link pCursor}.
     * Generation ends when all data is tokenized or the {@link pEndToken} has matched.
     * 
     * When an error token type is specified it skips all data that is not tokenizable and yield an error token instead.
     * 
     * @param pCursor - Current lexer token.
     * @param pAvailablePatterns - All available token pattern for this recursion scope. It does not contains merged patter lists from previous recursions.
     * @param pParentMetas  - Metas from current recursion scope.
     * @param pForcedType - Forced token type. Overrides all types specified in all token pattern.
     * @param pEndToken - Token that ends current recursion. When it is null, no token can end this recursion.
     * 
     * @returns Generator, generating all token till it reaches end of data.
     */
    private * tokenizeRecursionLayer(pCursor: LexerCursor, pAvailablePatterns: Array<LexerPatternDefinition<TTokenType>>, pParentMetas: Array<string>, pForcedType: TTokenType | null, pEndToken: LexerPatternDefinition<TTokenType> | null): Generator<LexerToken<TTokenType>> {
        // Create ordered token type list by specification.
        const lTokenPatternList: Array<LexerPatternDefinition<TTokenType>> = pAvailablePatterns.sort((pA: LexerPatternDefinition<TTokenType>, pB: LexerPatternDefinition<TTokenType>) => {
            // Sort lower specification at a lower index than higher specifications.
            return pA.specificity - pB.specificity;
        });

        // Tokenize until end.
        remainingDataLoop: while (pCursor.cursorPosition < pCursor.data.length) {
            // Skip whitespace but only when the current cursor has no buffered error.
            if (!pCursor.error && this.skipNextWhitespace(pCursor)) {
                continue;
            }

            // Check endtoken first.
            if (pEndToken && pEndToken.patternType === 'split') {
                // Get token start regex and set cursor position.
                const lTokenEndRegex: RegExp = pEndToken.pattern.end.regex;
                lTokenEndRegex.lastIndex = pCursor.cursorPosition;

                // Use single token types or start token types for different pattern types.
                const lTokenTypes: LexerPatternDefinitionType<TTokenType> = pEndToken.pattern.end.types;

                // Try to find end token.
                const lFoundTokenList: Array<LexerToken<TTokenType>> = this.findNextTokenAndMove(pEndToken, lTokenEndRegex, lTokenTypes, pCursor, pParentMetas, pForcedType);
                if (lFoundTokenList.length !== 0) {
                    // Yield all token.
                    for (const lToken of lFoundTokenList) {
                        yield lToken;
                    }

                    // Exit inner recursion when the end was found.
                    return;
                }
            }

            // Iterate available token pattern.
            for (const lTokenPattern of lTokenPatternList) {
                // Get token start regex and set cursor position.
                const lTokenStartRegex: RegExp = (lTokenPattern.patternType === 'single') ? lTokenPattern.pattern.single.regex : lTokenPattern.pattern.start.regex;
                lTokenStartRegex.lastIndex = pCursor.cursorPosition;

                // Use single token types or start token types for different pattern types.
                const lTokenTypes: LexerPatternDefinitionType<TTokenType> = (lTokenPattern.patternType === 'single') ? lTokenPattern.pattern.single.types : lTokenPattern.pattern.start.types;

                // Try to find next token.
                const lFoundTokenList: Array<LexerToken<TTokenType>> = this.findNextTokenAndMove(lTokenPattern, lTokenStartRegex, lTokenTypes, pCursor, pParentMetas, pForcedType);
                if (lFoundTokenList.length === 0) {
                    continue;
                }

                // Yield all token.
                for (const lToken of lFoundTokenList) {
                    yield lToken;
                }

                // Continue with next token when the current pattern is a single value pattern.
                if (lTokenPattern.patternType === 'single') {
                    continue remainingDataLoop;
                }

                // Yield every inner pattern token.
                yield* this.tokenizeRecursionLayer(pCursor, lTokenPattern.innerPattern, [...pParentMetas, ...lTokenPattern.meta], pForcedType ?? lTokenPattern.pattern.innerType, lTokenPattern);

                // Continue next token.
                continue remainingDataLoop;
            }

            // Throw a parser error when error ignoring is off.
            if (!this.mSettings.errorType) {
                // Throw error with next twenty chars as example data.
                throw new ParserException(`Unable to parse next token. No valid pattern found for "${pCursor.data.substring(pCursor.cursorPosition, pCursor.cursorPosition + 20)}".`, this, pCursor.currentColumn, pCursor.currentLine, pCursor.currentColumn, pCursor.currentLine);
            }

            // Init new error cursor when no error cursor exists.
            if (!pCursor.error) {
                pCursor.error = {
                    data: '',
                    startColumn: pCursor.currentColumn,
                    startLine: pCursor.currentLine
                };
            }

            // Apppend error character to error cursor.
            const lErrorChar: string = pCursor.data.charAt(pCursor.cursorPosition);
            pCursor.error.data += lErrorChar;

            // Move cursor position by the error character.
            this.moveCursor(pCursor, lErrorChar);
        }

        // Yield error token when a next valid token was found.
        const lErrorToken: LexerToken<TTokenType> | null = this.generateErrorToken(pCursor, pParentMetas);
        if (lErrorToken) {
            yield lErrorToken;
        }
    }
}

type LexerCursor = {
    data: string;
    cursorPosition: number;
    currentColumn: number;
    currentLine: number;
    error: null | {
        data: string;
        startColumn: number;
        startLine: number;
    };
};

type LexerSettings<TTokenType> = {
    trimSpaces: boolean;
    whiteSpaces: Set<string>;
    errorType: TTokenType | null;
};

type LexerPatternDefinitionType<TTokenType> = { [SubGroup: string]: TTokenType; };
type LexerPatternDefinition<TTokenType> = {
    patternType: 'split';
    pattern: {
        start: { regex: RegExp; types: LexerPatternDefinitionType<TTokenType>; };
        end: { regex: RegExp; types: LexerPatternDefinitionType<TTokenType>; };
        innerType: TTokenType | null;
    };
    specificity: number;
    meta: Array<string>;
    innerPattern: Array<LexerPatternDefinition<TTokenType>>;
} | {
    patternType: 'single';
    pattern: {
        single: { regex: RegExp; types: LexerPatternDefinitionType<TTokenType>; };
    };
    specificity: number;
    meta: Array<string>;
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

type LexerPatternTemplate<TTokenType> = Omit<LexerPattern<TTokenType>, 'specificity'>;
