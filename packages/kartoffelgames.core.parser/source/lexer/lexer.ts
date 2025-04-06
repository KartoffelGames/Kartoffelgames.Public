import { Exception } from '@kartoffelgames/core';
import { LexerException } from "./lexer-exception.ts";
import { LexerPattern, type LexerPatternConstructorParameter, type LexerPatternDependencyFetch, type LexerPatternTokenMatcher, type LexerPatternTokenTypes, type LexerPatternTokenValidator, type LexerPatternType } from './lexer-pattern.ts';
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
    private readonly mRootPattern: LexerPattern<TTokenType, 'split'>;
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
        this.mRootPattern = new LexerPattern<TTokenType, any>(this, {
            type: 'single',
            pattern: {
                single: {
                    regex: /^/,
                    types: {},
                    validator: null
                }
            },
            metadata: [],
            dependencyFetch: null
        });
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

            // Create pattern with same flags and added default group.
            return new RegExp(`^(?<token>${pRegex.source})`, [...lFlags].join(''));
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
    public * tokenize(pText: string, pProgressTracker?: LexerProgressTracker): Generator<LexerToken<TTokenType>> {
        // Create a new local lexer state object.
        const lLexerStateObject: LexerStateObject = {
            data: pText,
            cursor: {
                position: 0,
                column: 1,
                line: 1,
            },
            error: null,
            progressTracker: pProgressTracker ?? null
        };

        // Start tokenizing step with the current root pattern scope.
        yield* this.tokenizeRecursionLayer(lLexerStateObject, this.mRootPattern, new Array<string>(), null);
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
        this.mRootPattern.useChildPattern(pTokenPattern);
    }

    /**
     * Tries to match the next token with the pattern start tokem matcher returns the best match.
     *
     * @template TTokenType - The type of the token.
     * @param pStateObject - The current state of the lexer.
     * @param pPattern - An array of lexer patterns to match against.
     * @param pParentMetas - An array of parent metadata strings.
     * @param pForcedType - A forced token type, or null if not forced.
     * @returns The best matching token pattern start match, or null if no match is found.
     */
    private findNextStartToken(pStateObject: LexerStateObject, pPattern: Array<LexerPattern<TTokenType, LexerPatternType>>, pParentMetas: Array<string>, pForcedType: TTokenType | null): LexerPatternStartMatch<TTokenType> | null {
        // Iterate available token pattern.
        for (const lTokenPattern of pPattern) {
            // Get token start regex and use single token types or start token types for different pattern types.
            const lTokenMatcher: LexerPatternTokenMatcher<TTokenType> = lTokenPattern.pattern.start;

            // Try to find next token.
            const lFoundToken: LexerToken<TTokenType> | null = this.matchToken(lTokenPattern, lTokenMatcher, pStateObject, pParentMetas, pForcedType);
            if (lFoundToken === null) {
                continue;
            }

            // Return found token.
            return {
                pattern: lTokenPattern,
                token: lFoundToken
            };
        }

        return null;
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

        // Collect valid type groups.
        const lTypeGroupList: Array<string> = new Array<string>();
        for (const lGroupName in pTypes) {
            lTypeGroupList.push(lGroupName);
        }

        // No group that matched a token type was found.
        throw new Exception(`No token type found for any defined pattern regex group. Full: "${pTokenMatch[0]}", Matches: "${lMatchGroupList.join(', ')}", Available: "${lTypeGroupList.join(', ')}", Regex: "${pTargetRegex.source}"`, this);
    }

    /**
     * Generate new error lexer token. When error data is available.
     * When not error data is available or no error token type is specified, null is returned.
     * 
     * @param pStateObject - Lexer state object.
     * 
     * @returns Error token when error data is available.  
     */
    private * generateErrorToken(pStateObject: LexerStateObject, pParentMetas: Array<string>): Generator<LexerToken<TTokenType>> {
        // Skip yield when no error state is available.
        if (!pStateObject.error || !this.mSettings.errorType) {
            return;
        }

        // Generate error token.
        const lErrorToken: LexerToken<TTokenType> = new LexerToken<TTokenType>(this.mSettings.errorType, pStateObject.error.data, pStateObject.error.startColumn, pStateObject.error.startLine);
        lErrorToken.addMeta(...pParentMetas);

        // Reset error state.
        pStateObject.error = null;

        yield lErrorToken;
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
     * Try to find valid token based on the provided token matcher.
     * When it find the token, it clears the error state and prepend those token into the result when it is not empty,
     * moves the cursor and returns.
     * 
     * The result is always empty then the current token and provided tokenpatten does not match.
     * 
     * @param pPattern - Pattern of token matcher.
     * @param pTokenMatchDefinition - Match definition of current token. Can be single, end or start match defintion of token.
     * @param pTokenTypes - Types of pattern. Can be single, end or start types of token.
     * @param pStateObject - Current lexer token.
     * @param pCurrentMetas - Current metas valid in recursion scope.
     * @param pForcedType - Forced token type. Overrides all types specified in {@link pTokenTypes}.
     * 
     * @returns The found token based on {@link pPattern} and additionally the an error token when the lexer state has an error state. 
     */
    private matchToken(pPattern: LexerPattern<TTokenType, LexerPatternType>, pTokenMatchDefinition: LexerPatternTokenMatcher<TTokenType>, pStateObject: LexerStateObject, pCurrentMetas: Array<string>, pForcedType: TTokenType | null): LexerToken<TTokenType> | null {
        // Set token regex and start matching at current cursor position.
        const lTokenRegex: RegExp = pTokenMatchDefinition.regex;
        lTokenRegex.lastIndex = 0;

        // Try to match pattern. Pattern is valid when matched from first character.
        const lTokenStartMatch: RegExpExecArray | null = lTokenRegex.exec(pStateObject.data);
        if (!lTokenStartMatch || lTokenStartMatch.index !== 0) {
            return null;
        }

        // Generate single token, move cursor and yield.
        const lSingleToken: LexerToken<TTokenType> = this.generateToken(pStateObject, [...pCurrentMetas, ...pPattern.meta], lTokenStartMatch, pTokenMatchDefinition.types, pForcedType, lTokenRegex);

        // Process token validation only when set.
        if (pTokenMatchDefinition.validator) {
            // Get following text after token.
            const lFollowingText: string = pStateObject.data.substring(lSingleToken.value.length);

            // Validate token.
            if (!pTokenMatchDefinition.validator(lSingleToken, lFollowingText, pStateObject.cursor.position)) {
                return null;
            }
        }

        // Move cursor when any validation has passed.
        this.moveCursor(pStateObject, lSingleToken.value);

        return lSingleToken;
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

        // Cut off tokenized text.
        pStateObject.data = pStateObject.data.substring(pTokenValue.length);

        // Track progress.
        this.trackProgress(pStateObject);
    }

    /**
     * Pushes the next single character to the error state of the lexer.
     * 
     * This method handles the error state by either throwing a `LexerException` 
     * if error ignoring is off, or by appending the erroneous character to the 
     * error state and moving the cursor position.
     * 
     * @param pStateObject - The current state object of the lexer.
     * 
     * @throws {@link LexerException} - If no valid pattern is found and error ignoring is off.
     */
    private pushNextCharToErrorState(pStateObject: LexerStateObject): void {
        // Throw a parser error when error ignoring is off.
        if (!this.mSettings.errorType) {
            // Throw error with next twenty chars as example data.
            throw new LexerException(`Unable to parse next token. No valid pattern found for "${pStateObject.data.substring(0, 20)}".`, this, pStateObject.cursor.column, pStateObject.cursor.line, pStateObject.cursor.column, pStateObject.cursor.line);
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
        const lErrorChar: string = pStateObject.data.charAt(0);
        pStateObject.error.data += lErrorChar;

        // Move cursor position by the error character.
        this.moveCursor(pStateObject, lErrorChar);
    }

    /**
     * Move cursor forward by the current character when it is a white space character.
     * 
     * @param pStateObject - Tokenize state object.
     */
    private skipNextWhitespace(pStateObject: LexerStateObject): boolean {
        const lCharacter: string = pStateObject.data.charAt(0);

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
    private * tokenizeRecursionLayer(pStateObject: LexerStateObject, pPatternScope: LexerPattern<TTokenType, LexerPatternType>, pParentMetas: Array<string>, pForcedType: TTokenType | null): Generator<LexerToken<TTokenType>> {
        // Create ordered token type list by specification.
        const lPatternScopeDefinitionList: Array<LexerPattern<TTokenType, LexerPatternType>> = pPatternScope.dependencies;

        // Tokenize until end.
        while (pStateObject.data.length > 0) {
            // Skip whitespace but only when the current lexer state has no buffered error.
            if (!pStateObject.error && this.skipNextWhitespace(pStateObject)) {
                continue;
            }

            // Check endtoken first.
            if (pPatternScope.isSplit()) {
                // Try to find end token.
                const lFoundToken: LexerToken<TTokenType> | null = this.matchToken(pPatternScope, pPatternScope.pattern.end, pStateObject, pParentMetas, pForcedType);
                if (lFoundToken !== null) {
                    // Yield error token when a next valid token was found.
                    yield* this.generateErrorToken(pStateObject, pParentMetas);

                    // Yield found token.
                    yield lFoundToken;

                    // Exit inner recursion when the end was found.
                    return;
                }
            }

            // Iterate available token pattern.
            const lFoundToken: LexerPatternStartMatch<TTokenType> | null = this.findNextStartToken(pStateObject, lPatternScopeDefinitionList, pParentMetas, pForcedType);
            if (!lFoundToken) {
                // Push next character to error state when no valid token was found.
                this.pushNextCharToErrorState(pStateObject);
                continue;
            }

            // Yield error token when a next valid token was found.
            yield* this.generateErrorToken(pStateObject, pParentMetas);

            // Yield found token.
            yield lFoundToken.token;

            // Continue with next token when the current pattern is not a split pattern.
            const lTokenPattern: LexerPattern<TTokenType, LexerPatternType> = lFoundToken.pattern;
            if (!lTokenPattern.isSplit()) {
                continue;
            }

            // Execute unresolved inner dependency imports before using it.
            lTokenPattern.resolveDependencies();

            // Yield every inner pattern token.
            yield* this.tokenizeRecursionLayer(pStateObject, lTokenPattern, [...pParentMetas, ...lTokenPattern.meta], pForcedType ?? lTokenPattern.pattern.innerType);
        }

        // Yield error token when eof was reached.
        yield* this.generateErrorToken(pStateObject, pParentMetas);
    }

    /**
     * Tracks the progress of the lexer progress.
     *
     * @param pPosition - The current position in the input.
     * @param pLine - The current line number in the input.
     * @param pColumn - The current column number in the input.
     */
    private trackProgress(pStateObject: LexerStateObject): void {
        if (pStateObject.progressTracker === null) {
            return;
        }

        // Call progress tracker.
        pStateObject.progressTracker(pStateObject.cursor.position, pStateObject.cursor.line, pStateObject.cursor.column);
    }
}

/**
 * Lexer debug.
 */

export type LexerProgressTracker = (pPosition: number, pLine: number, pColumn: number) => void;

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
    progressTracker: LexerProgressTracker | null;
};

type LexerSettings<TTokenType extends string> = {
    trimSpaces: boolean;
    whiteSpaces: Set<string>;
    errorType: TTokenType | null;
};

type LexerPatternStartMatch<TTokenType extends string> = {
    pattern: LexerPattern<TTokenType, LexerPatternType>;
    token: LexerToken<TTokenType>;
};