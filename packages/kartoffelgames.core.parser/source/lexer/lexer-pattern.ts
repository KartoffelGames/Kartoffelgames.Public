import { Exception } from '@kartoffelgames/core';
import type { LexerToken } from './lexer-token.ts';
import type { Lexer } from './lexer.ts';

/**
 * Represents a pattern that can be used to match a series of token.
 */
export class LexerPattern<TTokenType extends string, TPatternType extends LexerPatternType> {
    private mDependecnyFetchResolved: boolean;
    private readonly mDependencyFetch: LexerPatternDependencyFetch<TTokenType> | null;
    private readonly mLexer: Lexer<TTokenType>;
    private readonly mPattern: LexerPatternDefinition<TTokenType, TPatternType>;

    private readonly mType: TPatternType;
    private readonly mMeta: Array<string>;
    private readonly mPatternDependencies: Array<LexerPattern<TTokenType, LexerPatternType>>;

    /**
     * Check if all dependencies are resolved.
     */
    public get dependenciesResolved(): boolean {
        return this.mDependecnyFetchResolved;
    }

    /**
     * Lexer instance this pattern is associated with.
     */
    public get lexer(): Lexer<TTokenType> {
        return this.mLexer;
    }

    /**
     * Lexer token pattern.
     */
    public get pattern(): LexerPatternDefinition<TTokenType, TPatternType> {
        return this.mPattern;
    }

    /**
     * Meta data for the pattern.
     */
    public get meta(): Array<string> {
        return this.mMeta;
    }

    /**
     * Dependencies for the pattern.
     */
    public get dependencies(): Array<LexerPattern<TTokenType, LexerPatternType>> {
        return this.mPatternDependencies;
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
        this.mDependecnyFetchResolved = !pParameter.dependencyFetch;

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
    public is<T extends TPatternType>(pPatternType: T): this is LexerPattern<TTokenType, T> {
        return this.mType === pPatternType;
    }

    /**
     * Resolves the dependencies for the lexer token pattern.
     * 
     * @param pLexer - The lexer instance used to resolve dependencies.
     */
    public resolveDependencies(pLexer: Lexer<TTokenType>): void {
        if (this.mDependecnyFetchResolved) {
            return;
        }

        this.mDependencyFetch!(pLexer);
        this.mDependecnyFetchResolved = true;
    }

    /**
     * Convert a pattern into an easy readable definition.
     * 
     * @param pPattern - Pattern.
     *  
     * @returns easy to read token pattern.
     */
    private convertTokenPattern(pPatternType: TPatternType, pPattern: LexerPatternConstructorParameter<TTokenType, TPatternType>['pattern']): LexerPatternDefinition<TTokenType, TPatternType> {
        // Convert pattern.
        if ('single' in pPattern) {
            // Pattern type must be single pattern.
            if (pPatternType === 'split') {
                throw new Exception(`Can't use single pattern with split pattern definition.`, this);
            }

            // Single pattern
            return {
                regex: pPattern.single.regex,
                types: pPattern.single.types,
                validator: pPattern.single.validator ?? null
            } satisfies LexerPatternDefinitionSingle<TTokenType> as any;
        } else {
            // Pattern type must be single pattern.
            if (pPatternType === 'single') {
                throw new Exception(`Can't use split pattern with single pattern definition.`, this);	
            }

            // Split pattern.
            return {
                start: {
                    regex: pPattern.start.regex,
                    types: pPattern.start.types,
                    validator: pPattern.start.validator ?? null
                },
                end: {
                    regex: pPattern.end.regex,
                    types: pPattern.end.types,
                    validator: pPattern.end.validator ?? null
                },
                // Optional inner type.
                innerType: pPattern.innerType ?? null
            } satisfies LexerPatternDefinitionSplit<TTokenType> as any;
        }
    }
}

/**
 * Pattern type.
 */
export type LexerPatternType = 'split' | 'single';

/*
 * Functions and callbacks
 */
export type LexerPatternDependencyFetch<TTokenType extends string> = (pLexer: Lexer<TTokenType>) => void;
export type LexerPatternTokenValidator<TTokenType extends string> = (pToken: LexerToken<TTokenType>, pText: string, pIndex: number) => boolean;

/**
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
    dependencyFetch: LexerPatternDependencyFetch<TTokenType> | null;
    pattern: {
        start: LexerPatternTokenMatcher<TTokenType>;
        end: LexerPatternTokenMatcher<TTokenType>;
        innerType: TTokenType | null;
    } | { single: LexerPatternTokenMatcher<TTokenType>; };
};

/**
 * Internal pattern definition.
 */

type LexerPatternDefinitionMatcher<TTokenType extends string> = {
    regex: RegExp;
    types: { [SubGroup: string]: TTokenType; };
    validator: LexerPatternTokenValidator<TTokenType> | null;
};

export type LexerPatternDefinitionSplit<TTokenType extends string> = {
    start: LexerPatternDefinitionMatcher<TTokenType>;
    end: LexerPatternDefinitionMatcher<TTokenType>;
    innerType: TTokenType | null;
};

export type LexerPatternDefinitionSingle<TTokenType extends string> = LexerPatternDefinitionMatcher<TTokenType>;

export type LexerPatternDefinition<TTokenType extends string, TPatternType extends LexerPatternType> =
    TPatternType extends 'split' ? LexerPatternDefinitionSplit<TTokenType> :
    TPatternType extends 'single' ? LexerPatternDefinitionSingle<TTokenType> :
    never;