import { PgslParserResultType } from './pgsl-parser-result-type.ts';

/**
 * Represents an array type in PGSL parser results.
 * Handles collections of other types with calculated size and alignment based on element type.
 *
 * array<E, N>: AlignOf = AlignOf(E), SizeOf = N * roundUp(AlignOf(E), SizeOf(E))
 * array<E>: AlignOf = AlignOf(E), SizeOf = NRuntime * roundUp(AlignOf(E), SizeOf(E))
 *
 * Uniform alignment: roundUp(16, AlignOf(E))
 * Storage alignment: AlignOf(E)
 * Packed alignment: 1
 */
export class PgslParserResultArrayType extends PgslParserResultType {
    private mElementType: PgslParserResultType;
    private mLength: number | null;

    /**
     * Gets the type of elements contained in this array type.
     *
     * @returns The element type.
     */
    public get elementType(): PgslParserResultType {
        return this.mElementType;
    } set elementType(pValue: PgslParserResultType) {
        this.mElementType = pValue;
        this.resetType();
    }

    /**
     * Gets whether this array type is runtime-sized.
     *
     * @returns True if runtime-sized, false if fixed-size.
     */
    public get isRuntimeSized(): boolean {
        return this.mLength === null;
    }

    /**
     * Gets the length of the array type.
     *
     * @returns The length if fixed, null if runtime-sized.
     */
    public get length(): number | null {
        return this.mLength;
    } set length(pValue: number | null) {
        this.mLength = pValue;
        this.resetType();
    }

    /**
     * Creates a new PGSL parser result array type.
     *
     * @param pElementType - The type of elements in the array.
     * @param pLength - The length of the array, or null for runtime-sized arrays.
     */
    public constructor(pElementType: PgslParserResultType, pLength: number | null) {
        super('array');
        this.mElementType = pElementType;
        this.mLength = pLength;
    }

    /**
     * Calculate byte alignment for array types.
     * Base: AlignOf(E)
     * Uniform: roundUp(16, AlignOf(E))
     * Storage: AlignOf(E)
     * Packed: 1
     */
    protected onCalculateByteAlignment(): number {
        if (this.alignmentType === 'packed') {
            return 1;
        }

        const lElementAlignment: number = this.mElementType.byteAlignment;

        if (this.alignmentType === 'uniform') {
            return Math.ceil(lElementAlignment / 16) * 16;
        }

        // Storage uses base alignment.
        return lElementAlignment;
    }

    /**
     * Calculate byte size for array types.
     * array<E, N>: N * roundUp(AlignOf(E), SizeOf(E))
     * array<E> (runtime): 0 (unknown at compile time; use variableByteSize for stride).
     */
    protected onCalculateByteSize(): number {
        if (this.mLength === null) {
            // Runtime-sized arrays have 0 static size.
            return 0;
        }

        const lElementAlignment: number = this.mElementType.byteAlignment;
        const lElementSize: number = this.mElementType.byteSize;

        return this.mLength * (Math.ceil(lElementSize / lElementAlignment) * lElementAlignment);
    }

    /**
     * Calculate variable byte size for array types.
     * For runtime-sized arrays, this returns roundUp(AlignOf(E), SizeOf(E)) which is the stride per element.
     * For fixed-size arrays, this returns 0.
     */
    protected onCalculateVariableByteSize(): number {
        if (this.mLength !== null) {
            return 0;
        }

        const lElementAlignment: number = this.mElementType.byteAlignment;
        const lElementSize: number = this.mElementType.byteSize;

        return Math.ceil(lElementSize / lElementAlignment) * lElementAlignment;
    }

}
