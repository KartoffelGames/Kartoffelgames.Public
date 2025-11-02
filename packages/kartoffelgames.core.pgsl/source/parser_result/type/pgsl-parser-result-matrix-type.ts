import { PgslParserResultType, PgslParserResultTypeAlignmentType } from './pgsl-parser-result-type.ts';

/**
 * Represents a matrix type in PGSL parser results.
 * Handles mathematical matrices with a specified element type and dimension count.
 */
export class PgslParserResultMatrixType extends PgslParserResultType {
    private readonly mElementType: PgslParserResultType;
    private readonly mRows: number;
    private readonly mColumns: number;

    /**
     * Gets the type of elements contained in this matrix type.
     *
     * @returns The element type.
     */
    public get elementType(): PgslParserResultType {
        return this.mElementType;
    }

    /**
     * Gets the number of rows in this matrix.
     *
     * @returns The row count.
     */
    public get rows(): number {
        return this.mRows;
    }

    /**
     * Gets the number of columns in this matrix.
     *
     * @returns The column count.
     */
    public get columns(): number {
        return this.mColumns;
    }

    /**
     * Creates a new PGSL parser result matrix type.
     *
     * @param pElementType - The type of elements in the matrix.
     * @param pRows - The number of rows in the matrix.
     * @param pColumns - The number of columns in the matrix.
     * @param pAlignmentType - The alignment type (uniform, storage, or packed).
     */
    public constructor(pElementType: PgslParserResultType, pRows: number, pColumns: number, pAlignmentType: PgslParserResultTypeAlignmentType) {
        super('matrix', pAlignmentType);
        this.mElementType = pElementType;
        this.mRows = pRows;
        this.mColumns = pColumns;
    }
}