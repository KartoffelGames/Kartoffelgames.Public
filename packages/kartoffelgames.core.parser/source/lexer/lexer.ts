import { Exception } from '@kartoffelgames/core';
import { LexerException } from '../index.ts';
import { LexerPattern, LexerPatternScope, type LexerPatternConstructorParameter, type LexerPatternDependencyFetch, type LexerPatternTokenMatcher, type LexerPatternTokenTypes, type LexerPatternTokenValidator, type LexerPatternType } from './lexer-pattern.ts';
import { LexerToken } from './lexer-token.ts';

// TODO: Lexer and Parser should revert to root state on fail. So another run can be done without creating another instance.

/**
 * Lexer or tokenizer. Turns a text with grammar into tokens.
 * Creates a iterator that iterates over each found token till end of text.
 * 
 * @typeParam T - Token types. Best to use some sort of enumerator.
 * 
 * @public
 */
export class Lexer<TTokenType extends string> {
    private mRootPatternScope: LexerPatternScope;
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
        this.mSettings = {
            errorType: null,
            trimSpaces: true,
            whiteSpaces: new Set<string>()
        };

        // Core dependency scope
        this.mRootPatternScope = {
            dependencies: Array<LexerPattern<TTokenType, LexerPatternType>>(),
            useChildPattern: function (pPattern: LexerPattern<TTokenType, LexerPatternType>) {
                this.dependencies.push(pPattern);
            }
        };
    }

    /**
     * Add token pattern template.
     * When a token matches multiple times within the same group the first added pattern or a longer matched token gets priorized.
     * 
     * @param pName - Template name.
     * @param pPattern - Token pattern definintion.
     * @param pDependencyFetch - Token added inside this function are scoped to this token.
     * 
     * @remarks
     * Token added inside {@link pDependencyFetch} are scoped to this token.
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
    public createTokenPattern<TPattern extends LexerPatternBuildDefinition<TTokenType>>(pPattern: TPattern, pDependencyFetch?: LexerPatternDependencyFetch<TTokenType, LexerPatternType>): TPattern extends LexerPatternBuildDefinitionSplit<TTokenType> ? LexerPattern<TTokenType, 'split'> : LexerPattern<TTokenType, 'single'> {
        // Convert nested pattern type into linear pattern type definition.
        const lConvertPatternType = (pType: LexerPatternBuildDefinitionTypes<TTokenType>): LexerPatternTokenTypes<TTokenType> => {
            // Single token type. Defaults to token group name.
            if (typeof pType === 'string') {
                return { token: pType };
            }

            return pType;
        };

        // Convert regex into a line start regex with global and single flag.
        const lConvertRegex = (pRegex: RegExp): RegExp => {
            // Create flag set and add sticky. Set removes all dublicate flags.
            const lFlags: Set<string> = new Set(pRegex.flags.split(''));
            lFlags.add('g');

            // Create pattern with same flags and added default group.
            return new RegExp(`(?<token>${pRegex.source})`, [...lFlags].join(''));
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
        let lPattern: LexerPatternConstructorParameter<TTokenType, LexerPatternType>['pattern'];
        if ('regex' in pPattern.pattern) {
            // Single pattern
            lPattern = {
                single: {
                    regex: lConvertRegex(pPattern.pattern.regex),
                    types: lConvertPatternType(pPattern.pattern.type),
                    validator: pPattern.pattern.validator ?? null
                }
            };
        } else {
            // Start end pattern.
            lPattern = {
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
            };
        }

        // Convert and return pattern.
        return new LexerPattern<TTokenType, any>(this, {
            type: ('regex' in pPattern.pattern) ? 'single' : 'split',
            pattern: lPattern,
            metadata: lMetaList,
            dependencyFetch: pDependencyFetch ?? null,
        });
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
    public * tokenize(pText: string, pProcessTracker?: LexerPatternProgressTracker): Generator<LexerToken<TTokenType>> {
        // Create a new local lexer state object.
        const lLexerStateObject: LexerStateObject = {
            data: pText,
            cursor: {
                position: 0,
                column: 1,
                line: 1,
            },
            error: null,
            processTracker: pProcessTracker ?? null
        };

        // Start tokenizing step with the current root pattern scope.
        yield* this.tokenizeRecursionLayer(lLexerStateObject, this.mRootPatternScope, new Array<string>(), null, null);
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
    public useRootTokenPattern(pTokenPattern: LexerPattern<TTokenType, LexerPatternType>): void {
        // Must be assigned to this pattern.
        if (pTokenPattern.lexer !== this) {
            throw new Exception('Token pattern must be created by this lexer.', this);
        }

        // Set template pattern to current pattern scope.
        this.mRootPatternScope.useChildPattern(pTokenPattern);
    }

    /**
     * Try to find valid token based on the provided token patter.
     * When it find the token, it clears the error state and prepend those token into the result when it is not empty,
     * moves the cursor and returns.
     * 
     * The result is always empty then the current token and provided tokenpatten does not match.
     * 
     * @param pPattern - Current pattern to seach next match.
     * @param pTokenMatchDefinition - Match definition of current token. Can be single, end or start match defintion of token.
     * @param pTokenTypes - Types of pattern. Can be single, end or start types of token.
     * @param pStateObject - Current lexer token.
     * @param pCurrentMetas - Current metas valid in recursion scope.
     * @param pForcedType - Forced token type. Overrides all types specified in {@link pTokenTypes}.
     * 
     * @returns The found token based on {@link pPattern} and additionally the an error token when the lexer state has an error state. 
     */
    private findNextToken(pPattern: LexerPattern<TTokenType, LexerPatternType>, pTokenMatchDefinition: LexerPatternTokenMatcher<TTokenType>, pTokenTypes: LexerPatternTokenTypes<TTokenType>, pStateObject: LexerStateObject, pCurrentMetas: Array<string>, pForcedType: TTokenType | null): LexerToken<TTokenType> | null {
        // Set token regex and start matching at current cursor position.
        const lTokenRegex: RegExp = pTokenMatchDefinition.regex;
        lTokenRegex.lastIndex = pStateObject.cursor.position;

        // Try to match pattern. Pattern is valid when matched from first character.
        const lTokenStartMatch: RegExpExecArray | null = lTokenRegex.exec(pStateObject.data);
        if (!lTokenStartMatch || lTokenStartMatch.index !== pStateObject.cursor.position) {
            return null;
        }

        // Generate single token, move cursor and yield.
        const lSingleToken: LexerToken<TTokenType> = this.generateToken(pStateObject, [...pCurrentMetas, ...pPattern.meta], lTokenStartMatch, pTokenTypes, pForcedType, lTokenRegex);

        // Validate token with optional validator.
        if (pTokenMatchDefinition.validator && !pTokenMatchDefinition.validator(lSingleToken, pStateObject.data, pStateObject.cursor.position)) {
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
    private findTokenTypeOfMatch(pTokenMatch: RegExpExecArray, pTypes: LexerPatternTokenTypes<TTokenType>, pTargetRegex: RegExp): TTokenType {
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
     * @param pStateObject - Lexer state object.
     * 
     * @returns Error token when error data is available.  
     */
    private generateErrorToken(pStateObject: LexerStateObject, pParentMetas: Array<string>): LexerToken<TTokenType> | null {
        if (!pStateObject.error || !this.mSettings.errorType) {
            return null;
        }

        // Generate error token.
        const lErrorToken: LexerToken<TTokenType> = new LexerToken<TTokenType>(this.mSettings.errorType, pStateObject.error.data, pStateObject.error.startColumn, pStateObject.error.startLine);
        lErrorToken.addMeta(...pParentMetas);

        // Reset error state.
        pStateObject.error = null;

        return lErrorToken;
    }

    /**
     * Generate a token for a matched token.
     * 
     * @param pStateObject - Lexer state object.
     * @param pTokenPattern - Token pattern.
     * @param pTokenMatch - Match array of found token.
     * @param pAvailableTokenTypes - Match group to token mapping. 
     * @param pParentMetas - Metas of parent pattern.
     * @param pForcedType - Forced type of token.
     * 
     * @returns A new generated token.  
     */
    private generateToken(pStateObject: LexerStateObject, pTokenMetas: Array<string>, pTokenMatch: RegExpExecArray, pAvailableTokenTypes: LexerPatternTokenTypes<TTokenType>, pForcedType: TTokenType | null, pTargetRegex: RegExp): LexerToken<TTokenType> {
        // Read token type of
        const lTokenValue: string = pTokenMatch[0];
        const lTokenType: TTokenType = this.findTokenTypeOfMatch(pTokenMatch, pAvailableTokenTypes, pTargetRegex);

        // Create single value token and append metas. Force token type when forced type is set.
        const lToken: LexerToken<TTokenType> = new LexerToken<TTokenType>(pForcedType ?? lTokenType, lTokenValue, pStateObject.cursor.column, pStateObject.cursor.line);
        lToken.addMeta(...pTokenMetas);

        return lToken;
    }

    /**
     * Move cursor for the provided {@link pToken.value}.
     * 
     * @param pStateObject - Lexer state object.
     * @param pToken - Token.
     */
    private moveCursor(pStateObject: LexerStateObject, pTokenValue: string): void {
        // Move cursor.
        const lLines: Array<string> = pTokenValue.split('\n');

        // Reset column number when any newline was tokenized.
        if (lLines.length > 1) {
            pStateObject.cursor.column = 1;
        }

        // Step line and column number.
        pStateObject.cursor.line += lLines.length - 1;
        pStateObject.cursor.column += lLines.at(-1)!.length;

        // Update untokenised text.
        pStateObject.cursor.position += pTokenValue.length;

        // Track process.
        this.trackProgress(pStateObject);
    }

    /**
     * Move cursor forward by the current character when it is a white space character.
     * 
     * @param pStateObject - Tokenize state object.
     */
    private skipNextWhitespace(pStateObject: LexerStateObject): boolean {
        const lCharacter: string = pStateObject.data.charAt(pStateObject.cursor.position);

        // Validate character if it can be skipped.
        if (!this.mSettings.trimSpaces || !this.mSettings.whiteSpaces.has(lCharacter)) {
            return false;
        }

        // Move cursor the length of the whitespace character.
        this.moveCursor(pStateObject, lCharacter);

        return true;
    }

    /**
     * Tokenize data present in {@link pStateObject}.
     * Generation ends when all data is tokenized or the {@link pEndToken} has matched.
     * 
     * When an error token type is specified it skips all data that is not tokenizable and yield an error token instead.
     * 
     * @param pStateObject - Current lexer token.
     * @param pPatternScope - All available token pattern for this recursion scope. It does not contains merged patter lists from previous recursions.
     * @param pParentMetas  - Metas from current recursion scope.
     * @param pForcedType - Forced token type. Overrides all types specified in all token pattern.
     * @param pEndToken - Token that ends current recursion. When it is null, no token can end this recursion.
     * 
     * @returns Generator, generating all token till it reaches end of data.
     */
    private * tokenizeRecursionLayer(pStateObject: LexerStateObject, pPatternScope: LexerPatternScope, pParentMetas: Array<string>, pForcedType: TTokenType | null, pEndToken: LexerPattern<TTokenType, LexerPatternType> | null): Generator<LexerToken<TTokenType>> {
        // Create ordered token type list by specification.
        const lPatternScopeDefinitionList: Array<LexerPattern<TTokenType, LexerPatternType>> = pPatternScope.dependencies;

        // Tokenize until end.
        remainingDataLoop: while (pStateObject.cursor.position < pStateObject.data.length) {
            // Skip whitespace but only when the current lexer state has no buffered error.
            if (!pStateObject.error && this.skipNextWhitespace(pStateObject)) {
                continue;
            }

            // Check endtoken first.
            if (pEndToken && pEndToken.is('split')) {
                // Get token start regex.
                const lEndTokenMatcher: LexerPatternTokenMatcher<TTokenType> = pEndToken.pattern.end;

                // Use single token types or start token types for different pattern types.
                const lTokenTypes: LexerPatternTokenTypes<TTokenType> = pEndToken.pattern.end.types;

                // Try to find end token.
                const lFoundToken: LexerToken<TTokenType> | null = this.findNextToken(pEndToken, lEndTokenMatcher, lTokenTypes, pStateObject, pParentMetas, pForcedType);
                if (lFoundToken !== null) {
                    // Move cursor when any validation has passed.
                    this.moveCursor(pStateObject, lFoundToken.value);

                    // Yield error token when a next valid token was found.
                    const lErrorToken: LexerToken<TTokenType> | null = this.generateErrorToken(pStateObject, pParentMetas);
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
            let lBestFoundToken: { pattern: LexerPattern<TTokenType, LexerPatternType>, token: LexerToken<TTokenType>; } | null = null;
            for (const lTokenPattern of lPatternScopeDefinitionList) {
                // Get token start regex and use single token types or start token types for different pattern types.
                let lStartTokenMatcher!: LexerPatternTokenMatcher<TTokenType>;
                let lTokenTypes!: LexerPatternTokenTypes<TTokenType>;
                if (lTokenPattern.is('split')) {
                    lStartTokenMatcher = lTokenPattern.pattern.start;
                    lTokenTypes = lTokenPattern.pattern.start.types;
                } else if (lTokenPattern.is('single')) {
                    lStartTokenMatcher = lTokenPattern.pattern;
                    lTokenTypes = lTokenPattern.pattern.types;
                }

                // Try to find next token.
                const lFoundToken: LexerToken<TTokenType> | null = this.findNextToken(lTokenPattern, lStartTokenMatcher, lTokenTypes, pStateObject, pParentMetas, pForcedType);
                if (lFoundToken === null) {
                    continue;
                }

                // Save best token.
                lBestFoundToken = {
                    pattern: lTokenPattern,
                    token: lFoundToken
                };

                break;
            }

            // Iterate available token pattern.
            if (lBestFoundToken) {
                const lFoundToken: LexerToken<TTokenType> = lBestFoundToken.token;
                const lTokenPattern: LexerPattern<TTokenType, LexerPatternType> = lBestFoundToken.pattern;

                // Move cursor when any validation has passed.
                this.moveCursor(pStateObject, lFoundToken.value);

                // Yield error token when a next valid token was found.
                const lErrorToken: LexerToken<TTokenType> | null = this.generateErrorToken(pStateObject, pParentMetas);
                if (lErrorToken) {
                    yield lErrorToken;
                }

                // Yield found token.
                yield lFoundToken;

                // Continue with next token when the current pattern is not a split pattern.
                if (!lTokenPattern.is('split')) {
                    continue remainingDataLoop;
                }

                // Execute unresolved inner dependency imports before using it.
                if (!lTokenPattern.dependenciesResolved) {
                    // Execute inner pattern fetches.
                    lTokenPattern.resolveDependencies();
                }

                // Yield every inner pattern token.
                yield* this.tokenizeRecursionLayer(pStateObject, lTokenPattern, [...pParentMetas, ...lTokenPattern.meta], pForcedType ?? lTokenPattern.pattern.innerType, lTokenPattern);

                // Continue next token.
                continue remainingDataLoop;
            }

            // Throw a parser error when error ignoring is off.
            if (!this.mSettings.errorType) {
                // Throw error with next twenty chars as example data.
                throw new LexerException(`Unable to parse next token. No valid pattern found for "${pStateObject.data.substring(pStateObject.cursor.position, pStateObject.cursor.position + 20)}".`, this, pStateObject.cursor.column, pStateObject.cursor.line, pStateObject.cursor.column, pStateObject.cursor.line);
            }

            // Init new error state when no error state exists.
            if (!pStateObject.error) {
                pStateObject.error = {
                    data: '',
                    startColumn: pStateObject.cursor.column,
                    startLine: pStateObject.cursor.line
                };
            }

            // Apppend error character to error state.
            const lErrorChar: string = pStateObject.data.charAt(pStateObject.cursor.position);
            pStateObject.error.data += lErrorChar;

            // Move cursor position by the error character.
            this.moveCursor(pStateObject, lErrorChar);
        }

        // Yield error token when a next valid token was found.
        const lErrorToken: LexerToken<TTokenType> | null = this.generateErrorToken(pStateObject, pParentMetas);
        if (lErrorToken) {
            yield lErrorToken;
        }
    }

    /**
     * Tracks the progress of the lexer process.
     *
     * @param pPosition - The current position in the input.
     * @param pLine - The current line number in the input.
     * @param pColumn - The current column number in the input.
     */
    private trackProgress(pStateObject: LexerStateObject): void {
        if (pStateObject.processTracker === null) {
            return;
        }

        // Call progress tracker.
        pStateObject.processTracker(pStateObject.cursor.position, pStateObject.cursor.line, pStateObject.cursor.column);
    }
}

/**
 * Lexer debug.
 */

export type LexerPatternProgressTracker = (pPosition: number, pLine: number, pColumn: number) => void;

/*
 * Lexer build pattern.
 */

export type LexerPatternBuildDefinitionTypes<TTokenType extends string> = TTokenType | { [SubGroup: string]: TTokenType; };

export type LexerPatternBuildDefinitionTokenMatcher<TTokenType extends string> = {
    regex: RegExp;
    type: LexerPatternBuildDefinitionTypes<TTokenType>;
    validator?: LexerPatternTokenValidator<TTokenType>;
};

export type LexerPatternBuildDefinitionSplit<TTokenType extends string> = {
    pattern: {
        start: LexerPatternBuildDefinitionTokenMatcher<TTokenType>,
        end: LexerPatternBuildDefinitionTokenMatcher<TTokenType>;
        innerType?: TTokenType;
    };
    meta?: string | Array<string>;
};

export type LexerPatternBuildDefinitionSingle<TTokenType extends string> = {
    pattern: LexerPatternBuildDefinitionTokenMatcher<TTokenType>;
    meta?: string | Array<string>;
};

export type LexerPatternBuildDefinition<TTokenType extends string> = LexerPatternBuildDefinitionSplit<TTokenType> | LexerPatternBuildDefinitionSingle<TTokenType>;

/*
 * Internal lexer settings and states. 
 */

type LexerStateObject = {
    data: string;
    cursor: {
        position: number;
        column: number;
        line: number;
    },
    error: null | {
        data: string;
        startColumn: number;
        startLine: number;
    };
    processTracker: LexerPatternProgressTracker | null;
};

type LexerSettings<TTokenType> = {
    trimSpaces: boolean;
    whiteSpaces: Set<string>;
    errorType: TTokenType | null;
};