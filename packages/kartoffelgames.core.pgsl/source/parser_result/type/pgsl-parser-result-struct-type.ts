import { PgslParserResultType } from './pgsl-parser-result-type.ts';

/**
 * Represents a struct type in PGSL parser results with member fields and calculated size/alignment.
 * Handles structured data with multiple fields and provides member offset calculations following WGSL struct layout rules.
 *
 * AlignOf(S) = max(AlignOfMember(S,1), ..., AlignOfMember(S,N))
 * SizeOf(S) = roundUp(AlignOf(S), justPastLastMember)
 *   where justPastLastMember = OffsetOfMember(S,N) + SizeOfMember(S,N)
 *
 * Uniform alignment: roundUp(16, AlignOf(S))
 * Storage alignment: AlignOf(S)
 * Packed alignment: 1
 */
export class PgslParserResultStructType extends PgslParserResultType {
    private mProperties: Array<PgslParserResultStructProperty>;

    /**
     * Gets the properties of the struct.
     *
     * @returns Readonly array of struct properties.
     */
    public get properties(): ReadonlyArray<PgslParserResultStructProperty> {
        return this.mProperties;
    } set properties(pValue: ReadonlyArray<PgslParserResultStructProperty>) {
        this.mProperties = [...pValue];
        this.resetType();
    }

    /**
     * Creates a new PGSL parser result struct type.
     */
    public constructor() {
        super('struct');
        this.mProperties = new Array<PgslParserResultStructProperty>();
    }

    /**
     * Calculate byte alignment for struct types.
     * Base: max(AlignOfMember(S,1), ..., AlignOfMember(S,N))
     * Uniform: roundUp(16, base alignment)
     * Storage: base alignment
     * Packed: 1
     */
    protected onCalculateByteAlignment(): number {
        if (this.alignmentType === 'packed') {
            return 1;
        }

        // Base alignment = max of all member alignments.
        let lMaxAlignment: number = 0;
        for (const lProperty of this.mProperties) {
            const lMemberAlignment: number = lProperty.alignmentOverride ?? lProperty.type.byteAlignment;
            if (lMemberAlignment > lMaxAlignment) {
                lMaxAlignment = lMemberAlignment;
            }
        }

        // Something must be aligned to at least 1 byte.
        if (lMaxAlignment === 0) {
            return 1;
        }

        // Uniform alignment rounds up to the next multiple of 16.
        if (this.alignmentType === 'uniform') {
            return Math.ceil(16 / lMaxAlignment) * lMaxAlignment;
        }

        // Storage uses base alignment.
        return lMaxAlignment;
    }

    /**
     * Calculate byte size for struct types.
     * SizeOf(S) = roundUp(AlignOf(S), justPastLastMember)
     *   where justPastLastMember = OffsetOfMember(S,N) + SizeOfMember(S,N)
     */
    protected onCalculateByteSize(): number {
        const lAlignment: number = this.byteAlignment;

        // Calculate the offset for each member sequentially.
        let lOffset: number = 0;
        for (const lProperty of this.mProperties) {
            const lMemberAlignment: number = lProperty.alignmentOverride ?? lProperty.type.byteAlignment;
            const lMemberSize: number = lProperty.sizeOverride ?? lProperty.type.byteSize;

            // Align the offset to the member's alignment.
            lOffset = Math.ceil(lOffset / lMemberAlignment) * lMemberAlignment;

            // Move past this member.
            lOffset += lMemberSize;
        }

        // Round up to the struct's alignment.
        return Math.ceil(lOffset / lAlignment) * lAlignment;
    }

    /**
     * Calculate variable byte size for struct types.
     * If the last member is a runtime-sized array, the struct has a variable component.
     * Returns the variable byte size of the last member.
     */
    protected onCalculateVariableByteSize(): number {
        if (this.mProperties.length === 0) {
            return 0;
        }

        // Only the last member can be runtime-sized.
        return this.mProperties.at(-1)!.type.variableByteSize;
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
