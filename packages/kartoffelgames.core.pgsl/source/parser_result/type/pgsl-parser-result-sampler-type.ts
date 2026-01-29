import { PgslParserResultType } from './pgsl-parser-result-type.ts';

/**
 * Represents a sampler type in PGSL parser results.
 * Samplers are opaque types in WGSL and do not have meaningful size/alignment for buffer layout.
 */
export class PgslParserResultSamplerType extends PgslParserResultType {
    private readonly mIsComparison: boolean;

    /**
     * Gets whether this sampler is a comparison sampler.
     *
     * @returns True if this is a comparison sampler, false otherwise.
     */
    public get isComparison(): boolean {
        return this.mIsComparison;
    }

    /**
     * Creates a new PGSL parser result sampler type.
     *
     * @param pIsComparison - Whether this sampler performs comparison operations.
     */
    public constructor(pIsComparison: boolean) {
        // Samplers are always packed alignment.
        super('sampler', 'packed');

        this.mIsComparison = pIsComparison;
    }
}