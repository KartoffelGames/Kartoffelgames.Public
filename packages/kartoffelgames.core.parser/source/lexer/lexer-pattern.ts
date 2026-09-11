import { Exception } from '@kartoffelgames/core';
import type { LexerToken } from './lexer-token.ts';
import type { Lexer } from './lexer.ts';

/**
 * Represents a pattern that can be used to match a series of token.
 */
export class LexerPattern<TTokenType extends string, TPatternType extends LexerPatternType> {
    private readonly mDependencyFetch: LexerPatternDependencyFetch<TTokenType, TPatternType> | null;
    private mDependencyFetchResolved: boolean;
    private readonly mLexer: Lexer<TTokenType>;
    private readonly mMeta: Array<string>;
    private readonly mPattern: LexerPatternDefinition<TTokenType, TPatternType>;
    private readonly mPatternDependencies: Array<LexerPattern<TTokenType, LexerPatternType>>;
    private readonly mType: TPatternType;

    /**
     * Dependencies for the pattern.
     */
    public get dependencies(): Array<LexerPattern<TTokenType, LexerPatternType>> {
        return this.mPatternDependencies;
    }

    /**
     * Check if all dependencies are resolved.
     */
    public get dependenciesResolved(): boolean {
        return this.mDependencyFetchResolved;
    }

    /**
     * Lexer instance this pattern is associated with.
     */
    public get lexer(): Lexer<TTokenType> {
        return this.mLexer;
    }

    /**
     * Meta data for the pattern.
     */
    public get meta(): Array<string> {
        return this.mMeta;
    }

    /**
     * Lexer token pattern.
     */
    public get pattern(): LexerPatternDefinition<TTokenType, TPatternType> {
        return this.mPattern;
    }

    /**
     * Creates an instance of LexerTokenPattern.
     * 
     * @param pPattern - Lexer token pattern.
     */
    public constructor(pLexer: Lexer<TTokenType>, pParameter: LexerPatternConstructorParameter<TTokenType, TPatternType>) {
        this.mLexer = pLexer;

        // Set token type.
        this.mType = pParameter.type;
        this.mMeta = pParameter.metadata;

        // Init unresolved dependency list.
        this.mPatternDependencies = new Array<LexerPattern<TTokenType, LexerPatternType>>();

        // Set inner fetch data and fetch resolved state based on parameter.
        this.mDependencyFetch = pParameter.dependencyFetch ?? null;
        this.mDependencyFetchResolved = !pParameter.dependencyFetch;

        // Enforce inner fetch for pattern with a start and end token.
        if (this.mType === 'split' && !this.mDependencyFetch) {
            throw new Exception('Split token with a start and end token, need inner token definitions.', this);
        }

        // Single pattern types forbid inner fetches.
        if (this.mType === 'single' && this.mDependencyFetch) {
            throw new Exception('Pattern does not allow inner token pattern.', this);
        }

        // Convert inner pattern.
        this.mPattern = this.convertTokenPattern(this.mType, pParameter.pattern);
    }

    /**
     * Determines if the current lexer pattern is of type 'split'.
     *
     * @returns {boolean} True if the lexer pattern type is 'split', otherwise false.
     */
    public isSplit(): this is LexerPattern<TTokenType, 'split'> {
        return this.mType === 'split';
    }

    /**
     * Resolves the dependencies for the lexer token pattern.
     * 
     * @param pLexer - The lexer instance used to resolve dependencies.
     */
    public resolveDependencies(): void {
        if (this.mDependencyFetchResolved) {
            return;
        }

        this.mDependencyFetch!(this);
        this.mDependencyFetchResolved = true;
    }

    /**
     * User a lexer pattern as child pattern.
     * 
     * @param pPattern - Lexer token pattern.
     */
    public useChildPattern(pPattern: LexerPattern<TTokenType, LexerPatternType>): void {
        if (this.mLexer !== pPattern.lexer) {
            throw new Exception(`Can only add dependencies of the same lexer.`, this);
        }

        this.mPatternDependencies.push(pPattern);
    }

    /**
     * Convert a pattern into an easy readable definition.
     * 
     * @param pPattern - Pattern.
     *  
     * @returns easy to read token pattern.
     */
    private convertTokenPattern(pPatternType: TPatternType, pPattern: LexerPatternConstructorParameter<TTokenType, TPatternType>['pattern']): LexerPatternDefinition<TTokenType, TPatternType> {
        // Convert regex into a line start regex with global and single flag.
        const lConvertRegex = (pRegex: RegExp): RegExp => {
            // Create flag set and add sticky. Set removes all duplicate flags.
            const lFlags: Set<string> = new Set(pRegex.flags.split(''));

            // Create pattern with same flags and added default group.
            return new RegExp(`^(?<token>${pRegex.source})`, [...lFlags].join(''));
        };

        // Convert pattern.
        if ('single' in pPattern) {
            // Pattern type must be single pattern.
            if (pPatternType === 'split') {
                throw new Exception(`Can't use split pattern type with single pattern definition.`, this);
            }

            // Single pattern
            return {
                start: {
                    regex: lConvertRegex(pPattern.single.regex),
                    types: pPattern.single.types,
                    validator: pPattern.single.validator ?? null,
                    staticCharCodes: this.staticFirstCharsOfRegex(pPattern.single.regex)
                }
            } satisfies LexerPatternDefinitionSingle<TTokenType> as any;
        } else {
            // Pattern type must be single pattern.
            if (pPatternType === 'single') {
                throw new Exception(`Can't use single pattern type with split pattern definition.`, this);
            }

            // Split pattern.
            return {
                start: {
                    regex: lConvertRegex(pPattern.start.regex),
                    types: pPattern.start.types,
                    validator: pPattern.start.validator ?? null,
                    staticCharCodes: this.staticFirstCharsOfRegex(pPattern.start.regex)
                },
                end: {
                    regex: lConvertRegex(pPattern.end.regex),
                    types: pPattern.end.types,
                    validator: pPattern.end.validator ?? null,
                    staticCharCodes: this.staticFirstCharsOfRegex(pPattern.end.regex)
                },
                // Optional inner type.
                innerType: pPattern.innerType ?? null
            } satisfies LexerPatternDefinitionSplit<TTokenType> as any;
        }
    }

    /**
     * The single character this regex must start with, or null when it can't be proven.
     */
    private staticFirstCharsOfRegex(pRegex: RegExp): Set<number> {
        const lMetaCharacters: string = '[](){}.*+?^$|';
        const lOptionalQuantifierCharacters: string = '?*{';
        const lEscapeableCharacters: string = 'dDwWsSpPbBkxucnrtfv0123456789';

        const lPossibleFirstChars: Set<number> = new Set<number>();

        // Read regex source.
        const lSource: string = pRegex.source;

        // If the regex includes branching it cant be tested. Replace any escape sequenzes first before checking to not check for an excaped |.
        if (lSource.replace(/\\./g, '').includes('|')) {
            return lPossibleFirstChars;
        }

        // When the first character is a meta character it can also not be tested.
        if (lMetaCharacters.includes(lSource[0])) {
            return lPossibleFirstChars;
        }

        let lCurrentCharIndex: number = 0;

        // When the code starts with a escape sequence, check for unnecessary escapes.  
        if (lSource[lCurrentCharIndex] === '\\') {
            // Jump over escape sequence.
            lCurrentCharIndex++;

            // Check if the escapable character is a special escaped character like [\d \w \s \b].
            if (lEscapeableCharacters.includes(lSource[lCurrentCharIndex])) {
                return lPossibleFirstChars;
            }
        }

        // Read the current char end progress pointer.
        const lCurrentChar: string = lSource[lCurrentCharIndex];
        lCurrentCharIndex++;

        // A quantifier would make that first character optional.
        if (lOptionalQuantifierCharacters.includes(lSource[lCurrentCharIndex])) {
            return lPossibleFirstChars;
        }

        // Add found char as charcode.
        lPossibleFirstChars.add(lCurrentChar.charCodeAt(0));

        // If its case insensitve, convert the found charcode into both cases.
        if (pRegex.flags.includes('i')) {
            // Convert all chars into a upper and lower case.
            for (const lChar of lPossibleFirstChars) {
                lPossibleFirstChars.add(String.fromCharCode(lChar).toLowerCase().charCodeAt(0));
                lPossibleFirstChars.add(String.fromCharCode(lChar).toUpperCase().charCodeAt(0));
            }

        }

        return lPossibleFirstChars;
    }
}

/*
 * Pattern type.
 */
export type LexerPatternType = 'split' | 'single';

/*
 * Functions and callbacks
 */
export type LexerPatternDependencyFetch<TTokenType extends string, TPatternType extends LexerPatternType> = (pLexerToken: LexerPattern<TTokenType, TPatternType>) => void;
export type LexerPatternTokenValidator<TTokenType extends string> = (pToken: LexerToken<TTokenType>, pFollowingText: string, pIndex: number) => boolean;

/*
 * External pattern constructor parameter.
 */
export type LexerPatternTokenTypes<TTokenType> = { [SubGroup: string]: TTokenType; };

export type LexerPatternTokenMatcher<TTokenType extends string> = {
    regex: RegExp;
    types: LexerPatternTokenTypes<TTokenType>;
    validator: LexerPatternTokenValidator<TTokenType> | null;
};

export type LexerPatternConstructorParameter<TTokenType extends string, TPatternType extends LexerPatternType> = {
    type: TPatternType;
    metadata: Array<string>;
    dependencyFetch: LexerPatternDependencyFetch<TTokenType, TPatternType> | null;
    pattern: {
        start: LexerPatternTokenMatcher<TTokenType>;
        end: LexerPatternTokenMatcher<TTokenType>;
        innerType: TTokenType | null;
    } | { single: LexerPatternTokenMatcher<TTokenType>; };
};

/*
 * Internal pattern definition.
 */

export type LexerPatternDefinitionMatcher<TTokenType extends string> = {
    regex: RegExp;
    types: { [SubGroup: string]: TTokenType; };
    validator: LexerPatternTokenValidator<TTokenType> | null;

    /**
     * Set of static characters a pattern matcher can match at start.
     * If its empty, the regex could no be analized.
     */
    staticCharCodes: Set<number>;
};

export type LexerPatternDefinitionSplit<TTokenType extends string> = {
    start: LexerPatternDefinitionMatcher<TTokenType>;
    end: LexerPatternDefinitionMatcher<TTokenType>;
    innerType: TTokenType | null;
};

export type LexerPatternDefinitionSingle<TTokenType extends string> = {
    start: LexerPatternDefinitionMatcher<TTokenType>;
};

export type LexerPatternDefinition<TTokenType extends string, TPatternType extends LexerPatternType> =
    TPatternType extends 'split' ? LexerPatternDefinitionSplit<TTokenType> :
    TPatternType extends 'single' ? LexerPatternDefinitionSingle<TTokenType> :
    never;