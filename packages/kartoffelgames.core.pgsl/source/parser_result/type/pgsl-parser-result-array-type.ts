import { PgslParserResultType, type PgslParserResultTypeAlignmentType } from './pgsl-parser-result-type.ts';

/**
 * Represents an array-like type in PGSL parser results (arrays, vectors, matrices).
 * Handles collections of other types with calculated size and alignment based on element type.
 */
export class PgslParserResultArrayType extends PgslParserResultType {
    private readonly mElementType: PgslParserResultType;
    private readonly mLength: number | null;

    /**
     * Gets the type of elements contained in this array-like type.
     *
     * @returns The element type.
     */
    public get elementType(): PgslParserResultType {
        return this.mElementType;
    }

    /**
     * Gets whether this array-like type is runtime-sized.
     *
     * @returns True if runtime-sized, false if fixed-size.
     */
    public get isRuntimeSized(): boolean {
        return this.mLength === null;
    }

    /**
     * Gets the length of the array-like type.
     *
     * @returns The length if fixed, null if runtime-sized.
     */
    public get length(): number | null {
        return this.mLength;
    }

    /**
     * Creates a new PGSL parser result array-like type.
     *
     * @param pElementType - The type of elements in the array.
     * @param pLength - The length of the array, or null for runtime-sized arrays.
     * @param pAlignmentType - The alignment type (uniform, storage, or packed).
     */
    public constructor(pElementType: PgslParserResultType, pLength: number | null, pAlignmentType: PgslParserResultTypeAlignmentType) {
        super('array', pAlignmentType);
        this.mElementType = pElementType;
        this.mLength = pLength;
    }
}