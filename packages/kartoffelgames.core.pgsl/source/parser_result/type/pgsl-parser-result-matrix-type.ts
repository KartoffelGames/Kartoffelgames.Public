import { PgslParserResultType } from './pgsl-parser-result-type.ts';
import { PgslParserResultVectorType } from './pgsl-parser-result-vector-type.ts';
import type { PgslParserResultNumericType } from './pgsl-parser-result-numeric-type.ts';

/**
 * Represents a matrix type in PGSL parser results.
 * Handles mathematical matrices with a specified element type and dimension count.
 *
 * A matCxR is treated as an array of C column vectors of size R.
 * AlignOf(matCxR) = AlignOf(vecR)
 * SizeOf(matCxR) = SizeOf(array<vecR, C>) = C * roundUp(AlignOf(vecR), SizeOf(vecR))
 */
export class PgslParserResultMatrixType extends PgslParserResultType {
    private mColumns: number;
    private mElementType: PgslParserResultType;
    private mRows: number;

    /**
     * Gets the number of columns in this matrix.
     *
     * @returns The column count.
     */
    public get columns(): number {
        return this.mColumns;
    } set columns(pValue: number) {
        this.mColumns = pValue;
        this.resetType();
    }

    /**
     * Gets the type of elements contained in this matrix type.
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
     * Gets the number of rows in this matrix.
     *
     * @returns The row count.
     */
    public get rows(): number {
        return this.mRows;
    } set rows(pValue: number) {
        this.mRows = pValue;
        this.resetType();
    }

    /**
     * Creates a new PGSL parser result matrix type.
     *
     * @param pElementType - The type of elements in the matrix (scalar numeric type).
     * @param pRows - The number of rows in the matrix.
     * @param pColumns - The number of columns in the matrix.
     */
    public constructor(pElementType: PgslParserResultNumericType, pRows: number, pColumns: number) {
        super('matrix');
        this.mElementType = pElementType;
        this.mRows = pRows;
        this.mColumns = pColumns;
    }

    /**
     * Calculate byte alignment for matrix types.
     * AlignOf(matCxR) = AlignOf(vecR<T>).
     * Packed alignment is always 1.
     */
    protected onCalculateByteAlignment(): number {
        if (this.alignmentType === 'packed') {
            return 1;
        }

        // Create a temporary vecR to get its alignment.
        const lColumnVector: PgslParserResultVectorType = new PgslParserResultVectorType(this.mElementType as PgslParserResultNumericType, this.mRows);
        lColumnVector.alignmentType = this.alignmentType;

        return lColumnVector.byteAlignment;
    }

    /**
     * Calculate byte size for matrix types.
     * SizeOf(matCxR) = SizeOf(array<vecR, C>) = C * roundUp(AlignOf(vecR), SizeOf(vecR)).
     */
    protected onCalculateByteSize(): number {
        // Create a temporary vecR to get its size and alignment.
        const lColumnVector: PgslParserResultVectorType = new PgslParserResultVectorType(this.mElementType as PgslParserResultNumericType, this.mRows);
        lColumnVector.alignmentType = this.alignmentType;

        const lVecAlignment: number = lColumnVector.byteAlignment;
        const lVecSize: number = lColumnVector.byteSize;

        // SizeOf(matCxR) = C * roundUp(AlignOf(vecR), SizeOf(vecR))
        return this.mColumns * (Math.ceil(lVecSize / lVecAlignment) * lVecAlignment);
    }

    /**
     * Matrix types have no variable-sized component.
     */
    protected onCalculateVariableByteSize(): number {
        return 0;
    }
}
