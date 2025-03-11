import { Exception } from '@kartoffelgames/core';
import { ParserException } from '../exception/parser-exception.ts';
import { LexerPattern, type LexerTokenPattern, type LexerTokenPatternDefinitionMatcher, type LexerTokenPatternDefinitionScope, type LexerTokenPatternDefinitionType, type LexerTokenPatternDependencyFetch } from './lexer-token-pattern-reference.ts';
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
    private mCurrentPatternScope: Array<LexerTokenPatternDefinitionScope<TTokenType>>;
    private readonly mSettings: LexerSettings<TTokenType>;

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
        // Set defaults.
        this.mCurrentPatternScope = new Array<LexerTokenPatternDefinitionScope<TTokenType>>();
        this.mSettings = {
            errorType: null,
            trimSpaces: true,
            whiteSpaces: new Set<string>()
        };
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
     * const lQuotedTokenPattern = lexer.createTokenPattern({
     *    pattern: {
     *        regex: /(["']).*?\1/,
     *        type: 'quotedString'
     *    },
     *    specificity: 1
     * });
     * 
     * const lSomeElsePattern = lexer.createTokenPattern({...}, (pLexer: Lexer<string>) => {
     *      // Token that can appeare only inside this token.
     *      pLexer.useTokenTemplate(lQuotedTokenPattern);
     *  });
     * 
     * // Apply token to the root patterns.
     * lexer.useTokenTemplate('lSomeElsePattern');
     * lexer.useTokenTemplate('quotedString');
     * ``` 
     */
    public createTokenPattern(pPattern: LexerTokenPattern<TTokenType>, pInnerFetch?: LexerTokenPatternDependencyFetch<TTokenType>): LexerPattern<TTokenType> {
        // Convert and return pattern.
        return new LexerPattern<TTokenType>(this, pPattern, pInnerFetch);
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

        // Start tokenizing step with the current root pattern scope.
        yield* this.tokenizeRecursionLayer(lCursor, this.mCurrentPatternScope, new Array<string>(), null, null);
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
    public useTokenPattern(pTokenPattern: LexerPattern<TTokenType>, pSpecificity: number): void {
        // Must be assigned to this pattern.
        if (pTokenPattern.lexer !== this) {
            throw new Exception('Token pattern must be created by this lexer.', this);
        }

        // Set template pattern to current pattern scope.
        this.mCurrentPatternScope.push({ definition: pTokenPattern, specificity: pSpecificity });
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
    private findNextToken(pPattern: LexerPattern<TTokenType>, pTokenMatchDefinition: LexerTokenPatternDefinitionMatcher<TTokenType>, pTokenTypes: LexerTokenPatternDefinitionType<TTokenType>, pCursor: LexerCursor, pCurrentMetas: Array<string>, pForcedType: TTokenType | null): LexerToken<TTokenType> | null {
        // Set token regex and start matching at current cursor position.
        const lTokenRegex: RegExp = pTokenMatchDefinition.regex;
        lTokenRegex.lastIndex = pCursor.cursorPosition;

        // Try to match pattern. Pattern is valid when matched from first character.
        const lTokenStartMatch: RegExpExecArray | null = lTokenRegex.exec(pCursor.data);
        if (!lTokenStartMatch || lTokenStartMatch.index !== pCursor.cursorPosition) {
            return null;
        }

        // Generate single token, move cursor and yield.
        const lSingleToken: LexerToken<TTokenType> = this.generateToken(pCursor, [...pCurrentMetas, ...pPattern.pattern.meta], lTokenStartMatch, pTokenTypes, pForcedType, lTokenRegex);

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
    private findTokenTypeOfMatch(pTokenMatch: RegExpExecArray, pTypes: LexerTokenPatternDefinitionType<TTokenType>, pTargetRegex: RegExp): TTokenType {
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
    private generateToken(pCursor: LexerCursor, pTokenMetas: Array<string>, pTokenMatch: RegExpExecArray, pAvailableTokenTypes: LexerTokenPatternDefinitionType<TTokenType>, pForcedType: TTokenType | null, pTargetRegex: RegExp): LexerToken<TTokenType> {
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
    private * tokenizeRecursionLayer(pCursor: LexerCursor, pAvailablePatterns: Array<LexerTokenPatternDefinitionScope<TTokenType>>, pParentMetas: Array<string>, pForcedType: TTokenType | null, pEndToken: LexerPattern<TTokenType> | null): Generator<LexerToken<TTokenType>> {
        // Create ordered token type list by specification.
        const lPatternScopeDefinitionList: Array<LexerTokenPatternDefinitionScope<TTokenType>> = pAvailablePatterns.sort((pA: LexerTokenPatternDefinitionScope<TTokenType>, pB: LexerTokenPatternDefinitionScope<TTokenType>) => {
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
            if (pEndToken && pEndToken.pattern.patternType === 'split') {
                // Get token start regex and set cursor position.
                const lEndTokenMatcher: LexerTokenPatternDefinitionMatcher<TTokenType> = pEndToken.pattern.pattern.end;

                // Use single token types or start token types for different pattern types.
                const lTokenTypes: LexerTokenPatternDefinitionType<TTokenType> = pEndToken.pattern.pattern.end.types;

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
            let lBestFoundToken: { pattern: LexerPattern<TTokenType>, token: LexerToken<TTokenType>; definition: LexerTokenPatternDefinitionScope<TTokenType>; } | null = null;
            for (const lPatternScopeDefinition of lPatternScopeDefinitionList) {
                const lTokenPattern = lPatternScopeDefinition.definition;

                // Get token start regex and set cursor position.
                const lStartTokenMatcher: LexerTokenPatternDefinitionMatcher<TTokenType> = (lTokenPattern.pattern.patternType === 'single') ? lTokenPattern.pattern.pattern.single : lTokenPattern.pattern.pattern.start;

                // Use single token types or start token types for different pattern types.
                const lTokenTypes: LexerTokenPatternDefinitionType<TTokenType> = (lTokenPattern.pattern.patternType === 'single') ? lTokenPattern.pattern.pattern.single.types : lTokenPattern.pattern.pattern.start.types;

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
                if (lBestFoundToken && lBestFoundToken.token.value.length >= lFoundToken.value.length) {
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
                const lTokenPattern: LexerPattern<TTokenType> = lBestFoundToken.pattern;

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
                if (lTokenPattern.pattern.patternType === 'single') {
                    continue remainingDataLoop;
                }

                // Execute unresolved inner dependency imports before using it.
                if (!lTokenPattern.dependenciesResolved) {
                    // Buffer last scope and set created pattern as current scope.
                    const lLastPatternScope: Array<LexerTokenPatternDefinitionScope<TTokenType>> | null = this.mCurrentPatternScope;
                    this.mCurrentPatternScope = lTokenPattern.pattern.innerPattern;

                    // Execute inner pattern fetches.
                    lTokenPattern.resolveDependencies(this);

                    // Reset scope to last used scope.
                    this.mCurrentPatternScope = lLastPatternScope;
                }

                // Yield every inner pattern token.
                yield* this.tokenizeRecursionLayer(pCursor, lTokenPattern.pattern.innerPattern, [...pParentMetas, ...lTokenPattern.pattern.meta], pForcedType ?? lTokenPattern.pattern.pattern.innerType, lTokenPattern);

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

/*
 * Internal lexer settings and states. 
 */

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