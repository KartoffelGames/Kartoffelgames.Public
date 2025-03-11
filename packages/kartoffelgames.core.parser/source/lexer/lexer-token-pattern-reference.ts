import { Exception } from '@kartoffelgames/core';
import type { LexerToken } from './lexer-token.ts';
import type { Lexer } from './lexer.ts';

/**
 * Represents a pattern that can be used to match a series of token.
 */
export class LexerPattern<TTokenType extends string> {
    private mFetchResolved: boolean;
    private readonly mInnerFetch: LexerTokenPatternDependencyFetch<TTokenType> | null;
    private readonly mLexer: Lexer<TTokenType>;
    private readonly mPattern: LexerTokenPatternDefinition<TTokenType>;
    
    /**
     * Check if all dependencies are resolved.
     */
    public get dependenciesResolved(): boolean {
        return this.mFetchResolved;
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
    public get pattern(): LexerTokenPatternDefinition<TTokenType> {
        return this.mPattern;
    }

    /**
     * Type of the pattern.
     */
    public get type(): LexerPatternType {
        return this.mPattern.patternType;
    }

    /**
     * Creates an instance of LexerTokenPattern.
     * 
     * @param pPattern - Lexer token pattern.
     */
    public constructor(pLexer: Lexer<TTokenType>, pPattern: LexerTokenPattern<TTokenType>, pInnerFetch?: LexerTokenPatternDependencyFetch<TTokenType>) {
        this.mLexer = pLexer;
        this.mPattern = this.convertTokenPattern(pPattern);
        this.mInnerFetch = pInnerFetch ?? null;

        // Set fetch resolved to false only if inner fetch is set.
        this.mFetchResolved = !pInnerFetch;

        // Enforce inner fetch for pattern with a start and end token.
        if (this.mPattern.patternType === 'split' && !pInnerFetch) {
            throw new Exception('Split token with a start and end token, need inner token definitions.', this);
        }

        // Single pattern types forbid inner fetches.
        if (this.mPattern.patternType === 'single' && pInnerFetch) {
            throw new Exception('Pattern does not allow inner token pattern.', this);
        }
    }

    /**
     * Resolves the dependencies for the lexer token pattern.
     * 
     * @param pLexer - The lexer instance used to resolve dependencies.
     */
    public resolveDependencies(pLexer: Lexer<TTokenType>): void {
        if (this.mFetchResolved) {
            return;
        }

        this.mInnerFetch!(pLexer);
        this.mFetchResolved = true;
    }

    /**
     * Convert a pattern into an easy readable definition.
     * 
     * @param pPattern - Pattern.
     *  
     * @returns easy to read token pattern.
     */
    private convertTokenPattern(pPattern: LexerTokenPattern<TTokenType>): LexerTokenPatternDefinition<TTokenType> {
        // Convert regex into a line start regex with global and single flag.
        const lConvertRegex = (pRegex: RegExp): RegExp => {
            // Create flag set and add sticky. Set removes all dublicate flags.
            const lFlags: Set<string> = new Set(pRegex.flags.split(''));
            lFlags.add('g');

            // Create pattern with same flags and added default group.
            return new RegExp(`(?<token>${pRegex.source})`, [...lFlags].join(''));
        };

        // Convert nested pattern type into linear pattern type definition.
        const lConvertPatternType = (pType: LexerTokenPatternType<TTokenType>): LexerTokenPatternDefinitionType<TTokenType> => {
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
                innerPattern: new Array<LexerTokenPatternDefinitionScope<TTokenType>>()
            };
        }
    }
}

export type LexerTokenPatternDependencyFetch<TTokenType extends string> = (pLexer: Lexer<TTokenType>) => void;

/* 
 * Pattern definition.
 */
export type LexerTokenPatternType<TTokenType> = TTokenType | { [SubGroup: string]: TTokenType; };

export type LexerTokenPatternMatcher<TTokenType extends string> = {
    regex: RegExp;
    type: LexerTokenPatternType<TTokenType>;
    validator?: LexerTokenPatternValidator<TTokenType>;
};

export type LexerTokenPattern<TTokenType extends string> = {
    pattern: LexerTokenPatternMatcher<TTokenType> | {
        start: LexerTokenPatternMatcher<TTokenType>,
        end: LexerTokenPatternMatcher<TTokenType>;
        innerType?: TTokenType;
    };
    meta?: string | Array<string>;
};


/*
 * Internal used token pattern definition. 
 */

export type LexerTokenPatternValidator<TTokenType extends string> = (pToken: LexerToken<TTokenType>, pText: string, pIndex: number) => boolean;

export type LexerTokenPatternDefinitionType<TTokenType> = { [SubGroup: string]: TTokenType; };
export type LexerTokenPatternDefinitionMatcher<TTokenType extends string> = {
    regex: RegExp;
    types: LexerTokenPatternDefinitionType<TTokenType>;
    validator: LexerTokenPatternValidator<TTokenType> | null;
};

export type LexerPatternType = 'split' | 'single';

export type LexerTokenPatternDefinitionSplit<TTokenType extends string> = {
    patternType: 'split';
    pattern: {
        start: LexerTokenPatternDefinitionMatcher<TTokenType>;
        end: LexerTokenPatternDefinitionMatcher<TTokenType>;
        innerType: TTokenType | null;
    };
    meta: Array<string>;
    innerPattern: Array<LexerTokenPatternDefinitionScope<TTokenType>>;
};

export type LexerTokenPatternDefinitionSingle<TTokenType extends string> = {
    patternType: 'single';
    pattern: {
        single: LexerTokenPatternDefinitionMatcher<TTokenType>;
    };
    meta: Array<string>;
};

export type LexerTokenPatternDefinition<TTokenType extends string> = LexerTokenPatternDefinitionSplit<TTokenType> | LexerTokenPatternDefinitionSingle<TTokenType>;

export type LexerTokenPatternDefinitionScope<TTokenType extends string> = {
    definition: LexerPattern<TTokenType>;
    specificity: number;
};