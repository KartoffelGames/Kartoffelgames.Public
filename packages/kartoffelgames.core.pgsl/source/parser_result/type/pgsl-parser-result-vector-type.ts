import { PgslParserResultType, PgslParserResultTypeAlignmentType } from './pgsl-parser-result-type.ts';

/**
 * Represents a vector type in PGSL parser results.
 * Handles mathematical vectors with a specified element type and dimension count.
 */
export class PgslParserResultVectorType extends PgslParserResultType {
    private readonly mElementType: PgslParserResultType;
    private readonly mDimension: number;

    /**
     * Gets the type of elements contained in this vector type.
     *
     * @returns The element type.
     */
    public get elementType(): PgslParserResultType {
        return this.mElementType;
    }

    /**
     * Gets the number of dimensions in this vector.
     *
     * @returns The dimension count.
     */
    public get dimension(): number {
        return this.mDimension;
    }

    /**
     * Creates a new PGSL parser result vector type.
     *
     * @param pElementType - The type of elements in the vector.
     * @param pDimension - The number of dimensions in the vector.
     * @param pAlignmentType - The alignment type (uniform, storage, or packed).
     */
    public constructor(pElementType: PgslParserResultType, pDimension: number, pAlignmentType: PgslParserResultTypeAlignmentType) {
        super('vector', pAlignmentType);
        this.mElementType = pElementType;
        this.mDimension = pDimension;
    }
}