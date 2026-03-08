import { PgslParserResultType } from './pgsl-parser-result-type.ts';

/**
 * Represents a sampler type in PGSL parser results.
 * Samplers are opaque types in WGSL and do not have meaningful size/alignment for buffer layout.
 */
export class PgslParserResultSamplerType extends PgslParserResultType {
    private mIsComparison: boolean;

    /**
     * Gets whether this sampler is a comparison sampler.
     *
     * @returns True if this is a comparison sampler, false otherwise.
     */
    public get isComparison(): boolean {
        return this.mIsComparison;
    } set isComparison(pValue: boolean) {
        this.mIsComparison = pValue;
    }

    /**
     * Creates a new PGSL parser result sampler type.
     *
     * @param pIsComparison - Whether this sampler performs comparison operations.
     */
    public constructor(pIsComparison: boolean) {
        super('sampler');

        this.mIsComparison = pIsComparison;
    }

    /**
     * Samplers are opaque types with no buffer alignment.
     */
    protected onCalculateByteAlignment(): number {
        return 0;
    }

    /**
     * Samplers are opaque types with no buffer size.
     */
    protected onCalculateByteSize(): number {
        return 0;
    }

    /**
     * Samplers have no variable-sized component.
     */
    protected onCalculateVariableByteSize(): number {
        return 0;
    }
}
