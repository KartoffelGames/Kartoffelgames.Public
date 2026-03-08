import type { PgslParserResultNumericType } from './pgsl-parser-result-numeric-type.ts';
import { PgslParserResultType } from './pgsl-parser-result-type.ts';

/**
 * Represents a vector type in PGSL parser results.
 * Handles mathematical vectors with a specified element type and dimension count.
 */
export class PgslParserResultVectorType extends PgslParserResultType {
    private mDimension: number;
    private mElementType: PgslParserResultType;

    /**
     * Gets the number of dimensions in this vector.
     *
     * @returns The dimension count.
     */
    public get dimension(): number {
        return this.mDimension;
    } set dimension(pValue: number) {
        this.mDimension = pValue;
        this.resetType();
    }

    /**
     * Gets the type of elements contained in this vector type.
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
     * Creates a new PGSL parser result vector type.
     *
     * @param pElementType - The type of elements in the vector.
     * @param pDimension - The number of dimensions in the vector.
     */
    public constructor(pElementType: PgslParserResultNumericType, pDimension: number) {
        super('vector');
        this.mElementType = pElementType;
        this.mDimension = pDimension;
    }

    /**
     * Calculate byte alignment for vector types.
     * vec2<T> = AlignOf(T) * 2, vec3<T> = AlignOf(T) * 4, vec4<T> = AlignOf(T) * 4.
     * Packed alignment is always 1.
     */
    protected onCalculateByteAlignment(): number {
        if (this.alignmentType === 'packed') {
            return 1;
        }

        const lElementAlignment: number = this.mElementType.byteSize;

        switch (this.mDimension) {
            case 2:
                // vec2<T>: alignment = 2 * sizeof(T)
                return lElementAlignment * 2;
            case 3:
            case 4:
                // vec3<T> and vec4<T>: alignment = 4 * sizeof(T)
                return lElementAlignment * 4;
            default:
                return lElementAlignment;
        }
    }

    /**
     * Calculate byte size for vector types.
     * vec2<T> = 2 * SizeOf(T), vec3<T> = 3 * SizeOf(T), vec4<T> = 4 * SizeOf(T).
     */
    protected onCalculateByteSize(): number {
        return this.mDimension * this.mElementType.byteSize;
    }

    /**
     * Vector types have no variable-sized component.
     */
    protected onCalculateVariableByteSize(): number {
        return 0;
    }
}
