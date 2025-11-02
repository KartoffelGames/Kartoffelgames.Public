import { PgslParserResultType, PgslParserResultTypeAlignmentType } from './pgsl-parser-result-type.ts';

/**
 * Represents a struct type in PGSL parser results with member fields and calculated size/alignment.
 * Handles structured data with multiple fields and provides member offset calculations following WGSL struct layout rules.
 */
export class PgslParserResultStructType extends PgslParserResultType {
    private readonly mMembers: Array<PgslParserResultStructMember>;

    /**
     * Gets the member fields of the struct.
     *
     * @returns Array of struct members.
     */
    public get members(): ReadonlyArray<PgslParserResultStructMember> {
        return this.mMembers;
    }

    /**
     * Creates a new PGSL parser result struct type.
     *
     * @param pMembers - Array of struct member definitions.#
     * @param pAlignmentType - The alignment type (uniform, storage, or packed).
     */
    public constructor(pMembers: Array<PgslParserResultStructMember>, pAlignmentType: PgslParserResultTypeAlignmentType) {
        super('struct', pAlignmentType);
        this.mMembers = [...pMembers];
    }
}

/**
 * Represents a member field within a struct type.
 */
export type PgslParserResultStructMember = {
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