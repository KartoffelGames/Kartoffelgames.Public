import { PgslParserResultType, type PgslParserResultTypeAlignmentType } from './pgsl-parser-result-type.ts';

/**
 * Represents a struct type in PGSL parser results with member fields and calculated size/alignment.
 * Handles structured data with multiple fields and provides member offset calculations following WGSL struct layout rules.
 */
export class PgslParserResultStructType extends PgslParserResultType {
    private readonly mProperties: Array<PgslParserResultStructProperty>;

    /**
     * Gets the properties of the struct.
     *
     * @returns Array of struct properties.
     */
    public get properties(): ReadonlyArray<PgslParserResultStructProperty> {
        return this.mProperties;
    }

    /**
     * Creates a new PGSL parser result struct type.
     *
     * @param pProperties - Array of struct property definitions.
     * @param pAlignmentType - The alignment type (uniform, storage, or packed).
     */
    public constructor(pProperties: Array<PgslParserResultStructProperty>, pAlignmentType: PgslParserResultTypeAlignmentType) {
        super('struct', pAlignmentType);
        this.mProperties = [...pProperties];
    }
}

/**
 * Represents a member field within a struct type.
 */
export type PgslParserResultStructProperty = {
    /**
     * The name of the struct member.
     */
    name: string;

    /**
     * The type of the struct member.
     */
    type: PgslParserResultType;

    /**
     * Optional size override for this specific member.
     * If provided, this size will be used instead of the type's calculated size.
     */
    sizeOverride?: number;

    /**
     * Optional alignment override for this specific member.
     * If provided, this alignment will be used instead of the type's calculated alignment.
     */
    alignmentOverride?: number;
};