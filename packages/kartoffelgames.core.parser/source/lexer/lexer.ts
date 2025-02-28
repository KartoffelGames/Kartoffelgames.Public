import { Dictionary, Exception } from '@kartoffelgames/core';
import { ParserException } from '../exception/parser-exception.ts';
import { LexerToken } from './lexer-token.ts';

/**
 * Lexer or tokenizer. Turns a text with grammar into tokens.
 * Creates a iterator that iterates over each found token till end of text.
 * 
 * @typeParam T - Token types. Best to use some sort of enumerator.
 * 
 * @public
 */
export class Lexer<TTokenType extends string> {
    private mCurrentPatternScope: Array<LexerPatternScopeDefinition<TTokenType>>;
    private readonly mSettings: LexerSettings<TTokenType>;
    private readonly mTokenPatternTemplates: Dictionary<string, LexerPatternDefinition<TTokenType>>;
    private readonly mTokenPatterns: Array<LexerPatternScopeDefinition<TTokenType>>;
    private readonly mUnresolvedScopes: WeakMap<SplitLexerPatternDefinition<TTokenType>, LexerPatternInnerFetch<TTokenType>>;

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
        this.mTokenPatterns = new Array<LexerPatternScopeDefinition<TTokenType>>();
        this.mTokenPatternTemplates = new Dictionary<string, LexerPatternDefinition<TTokenType>>();
        this.mUnresolvedScopes = new WeakMap<SplitLexerPatternDefinition<TTokenType>, LexerPatternInnerFetch<TTokenType>>();

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
    public addTokenPattern(pPattern: LexerPattern<TTokenType>, pInnerFetch?: LexerPatternInnerFetch<TTokenType>): void {
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
    public addTokenTemplate(pName: string, pPattern: LexerPatternTemplate<TTokenType>, pInnerFetch?: LexerPatternInnerFetch<TTokenType>): void {
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
            // Add pattern to unresolved scopes.
            this.mUnresolvedScopes.set(lConvertedPattern, pInnerFetch);
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
        const lTemplate: LexerPatternDefinition<TTokenType> = this.mTokenPatternTemplates.get(pTemplateName)!;

        // Set template pattern to current pattern scope.
        this.mCurrentPatternScope.push({ definition: lTemplate, specificity: pSpecificity });
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

        // Convert pattern.
        if ('regex' in pPattern.pattern) {
            // Single pattern
            return {
                patternType: 'single',
                pattern: {
                    single: {
                        regex: lConvertRegex(pPattern.pattern.regex),
                        types: lConvertPatternType(pPattern.pattern.type),
                        validator: pPattern.pattern.validator ?? null
                    }
                },
                meta: lMetaList
            };
        } else {
            // Start end pattern.
            return {
                patternType: 'split',
                pattern: {
                    start: {
                        regex: lConvertRegex(pPattern.pattern.start.regex),
                        types: lConvertPatternType(pPattern.pattern.start.type),
                        validator: pPattern.pattern.start.validator ?? null
                    },
                    end: {
                        regex: lConvertRegex(pPattern.pattern.end.regex),
                        types: lConvertPatternType(pPattern.pattern.end.type),
                        validator: pPattern.pattern.end.validator ?? null
                    },
                    // Optional inner type.
                    innerType: pPattern.pattern.innerType ?? null
                },
                meta: lMetaList,
                innerPattern: new Array<LexerPatternScopeDefinition<TTokenType>>()
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
     * @param pPattern - Current pattern to seach next match.
     * @param pTokenMatchDefinition - Match definition of current token. Can be single, end or start match defintion of token.
     * @param pTokenTypes - Types of pattern. Can be single, end or start types of token.
     * @param pCursor - Current lexer token.
     * @param pCurrentMetas - Current metas valid in recursion scope.
     * @param pForcedType - Forced token type. Overrides all types specified in {@link pTokenTypes}.
     * 
     * @returns The found token based on {@link pPattern} and additionally the an error token when the cursor has errors stored. 
     */
    private findNextToken(pPattern: LexerPatternDefinition<TTokenType>, pTokenMatchDefinition: LexerPatternDefinitionMatcher<TTokenType>, pTokenTypes: LexerPatternDefinitionType<TTokenType>, pCursor: LexerCursor, pCurrentMetas: Array<string>, pForcedType: TTokenType | null): LexerToken<TTokenType> | null {
        // Set token regex and start matching at current cursor position.
        const lTokenRegex: RegExp = pTokenMatchDefinition.regex;
        lTokenRegex.lastIndex = pCursor.cursorPosition;

        // Try to match pattern. Pattern is valid when matched from first character.
        const lTokenStartMatch: RegExpExecArray | null = lTokenRegex.exec(pCursor.data);
        if (!lTokenStartMatch || lTokenStartMatch.index !== pCursor.cursorPosition) {
            return null;
        }

        // Generate single token, move cursor and yield.
        const lSingleToken: LexerToken<TTokenType> = this.generateToken(pCursor, [...pCurrentMetas, ...pPattern.meta], lTokenStartMatch, pTokenTypes, pForcedType, lTokenRegex);

        // Validate token with optional validator.
        if (pTokenMatchDefinition.validator && !pTokenMatchDefinition.validator(lSingleToken, pCursor.data, pCursor.cursorPosition)) {
            return null;
        }

        return lSingleToken;
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
    private findTokenTypeOfMatch(pTokenMatch: RegExpExecArray, pTypes: LexerPatternDefinitionType<TTokenType>, pTargetRegex: RegExp): TTokenType {
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

        // Collect valid matches groups.
        const lMatchGroupList: Array<string> = new Array<string>();
        for (const lGroupName in pTokenMatch.groups!) {
            if (pTokenMatch.groups[lGroupName]) {
                lMatchGroupList.push(lGroupName);
            }
        }

        // No group that matched a token type was found.
        throw new Exception(`No token type found for any defined pattern regex group. Full: "${pTokenMatch[0]}", Matches: "${lMatchGroupList.join(', ')}", Regex: "${pTargetRegex.source}"`, this);
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
    private generateToken(pCursor: LexerCursor, pTokenMetas: Array<string>, pTokenMatch: RegExpExecArray, pAvailableTokenTypes: LexerPatternDefinitionType<TTokenType>, pForcedType: TTokenType | null, pTargetRegex: RegExp): LexerToken<TTokenType> {
        // Read token type of
        const lTokenValue: string = pTokenMatch[0];
        const lTokenType: TTokenType = this.findTokenTypeOfMatch(pTokenMatch, pAvailableTokenTypes, pTargetRegex);

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
    private * tokenizeRecursionLayer(pCursor: LexerCursor, pAvailablePatterns: Array<LexerPatternScopeDefinition<TTokenType>>, pParentMetas: Array<string>, pForcedType: TTokenType | null, pEndToken: LexerPatternDefinition<TTokenType> | null): Generator<LexerToken<TTokenType>> {
        // Create ordered token type list by specification.
        const lPatternScopeDefinitionList: Array<LexerPatternScopeDefinition<TTokenType>> = pAvailablePatterns.sort((pA: LexerPatternScopeDefinition<TTokenType>, pB: LexerPatternScopeDefinition<TTokenType>) => {
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
                const lEndTokenMatcher: LexerPatternDefinitionMatcher<TTokenType> = pEndToken.pattern.end;

                // Use single token types or start token types for different pattern types.
                const lTokenTypes: LexerPatternDefinitionType<TTokenType> = pEndToken.pattern.end.types;

                // Try to find end token.
                const lFoundToken: LexerToken<TTokenType> | null = this.findNextToken(pEndToken, lEndTokenMatcher, lTokenTypes, pCursor, pParentMetas, pForcedType);
                if (lFoundToken !== null) {
                    // Move cursor when any validation has passed.
                    this.moveCursor(pCursor, lFoundToken.value);

                    // Yield error token when a next valid token was found.
                    const lErrorToken: LexerToken<TTokenType> | null = this.generateErrorToken(pCursor, pParentMetas);
                    if (lErrorToken) {
                        yield lErrorToken;
                    }

                    // Yield found token.
                    yield lFoundToken;

                    // Exit inner recursion when the end was found.
                    return;
                }
            }

            // Iterate available token pattern.
            let lBestFoundToken: { pattern: LexerPatternDefinition<TTokenType>, token: LexerToken<TTokenType>; definition: LexerPatternScopeDefinition<TTokenType>; } | null = null;
            for (const lPatternScopeDefinition of lPatternScopeDefinitionList) {
                const lTokenPattern = lPatternScopeDefinition.definition;

                // Get token start regex and set cursor position.
                const lStartTokenMatcher: LexerPatternDefinitionMatcher<TTokenType> = (lTokenPattern.patternType === 'single') ? lTokenPattern.pattern.single : lTokenPattern.pattern.start;

                // Use single token types or start token types for different pattern types.
                const lTokenTypes: LexerPatternDefinitionType<TTokenType> = (lTokenPattern.patternType === 'single') ? lTokenPattern.pattern.single.types : lTokenPattern.pattern.start.types;

                // Try to find next token.
                const lFoundToken: LexerToken<TTokenType> | null = this.findNextToken(lTokenPattern, lStartTokenMatcher, lTokenTypes, pCursor, pParentMetas, pForcedType);
                if (lFoundToken === null) {
                    continue;
                }

                // When a good token with a better specificity was found, keep it.
                if (lBestFoundToken && lBestFoundToken.definition.specificity !== lPatternScopeDefinition.specificity) {
                    break;
                }

                // Prefer longer token over shorter, but keep when current when they have the same length.
                if(lBestFoundToken && lBestFoundToken.token.value.length >= lFoundToken.value.length){
                    continue;
                }

                // Save best token.
                lBestFoundToken = {
                    definition: lPatternScopeDefinition,
                    pattern: lTokenPattern,
                    token: lFoundToken
                };
            }

            // Iterate available token pattern.
            if (lBestFoundToken) {
                const lFoundToken: LexerToken<TTokenType> = lBestFoundToken.token;
                const lTokenPattern: LexerPatternDefinition<TTokenType> = lBestFoundToken.pattern;

                // Move cursor when any validation has passed.
                this.moveCursor(pCursor, lFoundToken.value);

                // Yield error token when a next valid token was found.
                const lErrorToken: LexerToken<TTokenType> | null = this.generateErrorToken(pCursor, pParentMetas);
                if (lErrorToken) {
                    yield lErrorToken;
                }

                // Yield found token.
                yield lFoundToken;

                // Continue with next token when the current pattern is a single value pattern.
                if (lTokenPattern.patternType === 'single') {
                    continue remainingDataLoop;
                }

                // Execute unresolved inner dependency imports before using it.
                if (this.mUnresolvedScopes.has(lTokenPattern)) {
                    // Buffer last scope and set created pattern as current scope.
                    const lLastPatternScope: Array<LexerPatternScopeDefinition<TTokenType>> | null = this.mCurrentPatternScope;
                    this.mCurrentPatternScope = lTokenPattern.innerPattern;

                    // Get inner function to fetch scoped lexer.
                    const lInnerFetchFunction: LexerPatternInnerFetch<TTokenType> = this.mUnresolvedScopes.get(lTokenPattern)!;

                    // Execute inner pattern fetches.
                    lInnerFetchFunction(this);

                    // Reset scope to last used scope.
                    this.mCurrentPatternScope = lLastPatternScope;

                    // Remove unresolved scope as it is resolved.
                    this.mUnresolvedScopes.delete(lTokenPattern);
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
type LexerPatternDefinitionMatcher<TTokenType extends string> = {
    regex: RegExp;
    types: LexerPatternDefinitionType<TTokenType>;
    validator: LexerPatternValidator<TTokenType> | null;
};

type SplitLexerPatternDefinition<TTokenType extends string> = {
    patternType: 'split';
    pattern: {
        start: LexerPatternDefinitionMatcher<TTokenType>;
        end: LexerPatternDefinitionMatcher<TTokenType>;
        innerType: TTokenType | null;
    };
    meta: Array<string>;
    innerPattern: Array<LexerPatternScopeDefinition<TTokenType>>;
};

type SingleLexerPatternDefinition<TTokenType extends string> = {
    patternType: 'single';
    pattern: {
        single: LexerPatternDefinitionMatcher<TTokenType>;
    };
    meta: Array<string>;
};

type LexerPatternDefinition<TTokenType extends string> = SplitLexerPatternDefinition<TTokenType> | SingleLexerPatternDefinition<TTokenType>;

type LexerPatternScopeDefinition<TTokenType extends string> = {
    definition: LexerPatternDefinition<TTokenType>;
    specificity: number;
};

/* 
 * Pattern definition.
 */
type LexerPatternType<TTokenType> = TTokenType | { [SubGroup: string]: TTokenType; };
type LexerPatternValidator<TTokenType extends string> = (pToken: LexerToken<TTokenType>, pText: string, pIndex: number) => boolean;
type LexerPatternMatcher<TTokenType extends string> = {
    regex: RegExp;
    type: LexerPatternType<TTokenType>;
    validator?: LexerPatternValidator<TTokenType>;
};
type LexerPattern<TTokenType extends string> = {
    pattern: LexerPatternMatcher<TTokenType> | {
        start: LexerPatternMatcher<TTokenType>,
        end: LexerPatternMatcher<TTokenType>;
        innerType?: TTokenType;
    };
    specificity: number;
    meta?: string | Array<string>;
};

type LexerPatternTemplate<TTokenType extends string> = Omit<LexerPattern<TTokenType>, 'specificity'>;
type LexerPatternInnerFetch<TTokenType extends string> = (pLexer: Lexer<TTokenType>) => void;
