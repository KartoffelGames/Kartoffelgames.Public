import { Exception } from "@kartoffelgames/core";
import type { LexerPattern, LexerPatternType } from './lexer-pattern.ts';
import type { Lexer } from "./lexer.ts";

/**
 * Creates a index for a list of child pattern.
 * It creates buckets to sort the pattern by its static char codes, so only the pattern that can actually match anything are checked.  
 */
export class LexerPatternIndex<TTokenType extends string> {
    private static readonly ASCII_RANGE: number = 128;

    private readonly mLexer: Lexer<TTokenType>;
    private readonly mChildPattern: Array<LexerPattern<TTokenType, LexerPatternType>>;
    private mBucketsInitialized: boolean;
    private mFallback: Array<LexerPattern<TTokenType, LexerPatternType>>;
    private mBuckets: Map<number, Array<LexerPattern<TTokenType, LexerPatternType>>>;

    /**
     * Constructor.
     *
     * @param pLexer - Lexer.
     */
    public constructor(pLexer: Lexer<TTokenType>) {
        this.mChildPattern = new Array<LexerPattern<TTokenType, LexerPatternType>>();
        this.mLexer = pLexer;

        // Both fallbacks and buckets are initially empty but "initialized".
        this.mFallback = new Array<LexerPattern<TTokenType, LexerPatternType>>();
        this.mBuckets = new Map<number, Array<LexerPattern<TTokenType, LexerPatternType>>>();
        this.mBucketsInitialized = true;
    }

    /**
     * Use a lexer pattern as child pattern.
     * 
     * @param pPattern - Lexer token pattern.
     */
    public addChild(pPattern: LexerPattern<TTokenType, LexerPatternType>): void {
        if (this.mLexer !== pPattern.lexer) {
            throw new Exception(`Can only add dependencies of the same lexer.`, this);
        }

        // Add pattern dependency and reset initialization state of buckets.
        this.mChildPattern.push(pPattern);

        // Reset bucket state.
        this.mBucketsInitialized = false;
    }

    /**
     * Get every pattern that can start a token with the provided character.
     *
     * @param pCharCode - Character code at the current cursor position.
     *
     * @returns Pattern to try, in dependency list order.
     */
    public bucketOf(pCharCode: number): Array<LexerPattern<TTokenType, LexerPatternType>> {
        // Rebuild only after a child was added. Costs one predictable branch per token.
        if (!this.mBucketsInitialized) {
            this.refreshBuckets();
        }

        return this.mBuckets.get(pCharCode) ?? this.mFallback;
    }

    /**
     * Sort every child pattern into one bucket per first character.
     */
    private refreshBuckets(): void {
        this.mFallback = new Array<LexerPattern<TTokenType, LexerPatternType>>();
        this.mBuckets = new Map<number, Array<LexerPattern<TTokenType, LexerPatternType>>>();

        // Process in list order, so every bucket keeps the priority of the dependency list.
        for (const lPattern of this.mChildPattern) {
            const lStaticCharCodes: Set<number> = lPattern.pattern.start.staticCharCodes;

            // Pattern with an underivable first character must be tried for every character.
            if (lStaticCharCodes.size === 0) {
                this.mFallback.push(lPattern);

                // Push the fallback to all initialized buckets.
                for (const lBucket of this.mBuckets.values()) {
                    lBucket.push(lPattern);
                }

                continue;
            }

            for (const lCharCode of lStaticCharCodes) {
                // A new bucket starts with every fallback pattern already set to keep the order.
                if (!this.mBuckets.has(lCharCode)) {
                    this.mBuckets.set(lCharCode, [...this.mFallback]);
                }

                this.mBuckets.get(lCharCode)!.push(lPattern);
            }
        }


        this.mBucketsInitialized = true;
    }
}
