import { Exception } from '../exception/exception.ts';
import { Vector } from './vector.ts';

export class Matrix {
    /**
     * Create identity matrix.
     *
     * @param pSize - Matrix size: nxn.
     *
     * @returns Identity matrix of given size.
     */
    public static identity(pSize: number): Matrix {
        // Create zero-filled array.
        const lData: Array<number> = new Array<number>(pSize * pSize).fill(0);

        // Set diagonal elements to one.
        for (let lIndex = 0; lIndex < pSize; lIndex++) {
            lData[lIndex * pSize + lIndex] = 1;
        }

        return new Matrix(lData, pSize, pSize);
    }

    private mData: Array<number>;
    private mHeight: number;
    private mWidth: number;

    /**
     * Data as column-major number array.
     */
    public get dataArray(): Array<number> {
        return this.mData;
    }

    /**
     * Get matrix height.
     */
    public get height(): number {
        return this.mHeight;
    }

    /**
     * Get matrix width.
     */
    public get width(): number {
        return this.mWidth;
    }

    /**
     * Constructor.
     *
     * @param pData - Column-major matrix data.
     * @param pHeight - Matrix row count.
     * @param pWidth - Matrix column count.
     */
    public constructor(pData: Array<number>, pHeight: number, pWidth: number) {
        this.mData = pData;
        this.mHeight = pHeight;
        this.mWidth = pWidth;
    }

    /**
     * Add value to matrix.
     *
     * @param pAddData - Matrix or scalar value.
     * @param pApplyToSelf - Apply calculation to this matrix instead of creating a new one.
     *
     * @returns New matrix with added values or this matrix if pApplyToSelf is true.
     */
    public add(pAddData: Matrix | number, pApplyToSelf: boolean = false): Matrix {
        // Set target matrix depending on apply to self or not.
        const lTargetMatrix: Matrix = pApplyToSelf ? this : new Matrix(new Array<number>(this.mData.length), this.mHeight, this.mWidth);

        if (pAddData instanceof Matrix) {
            // Restrict on same size.
            if (this.mHeight !== pAddData.mHeight || this.mWidth !== pAddData.mWidth) {
                throw new Exception('Matrices need to be the same size for calculation.', this);
            }

            // Add each component element-wise.
            for (let lIndex = 0; lIndex < this.mData.length; lIndex++) {
                lTargetMatrix.mData[lIndex] = this.mData[lIndex] + pAddData.mData[lIndex];
            }

            return lTargetMatrix;
        }

        // Add scalar to each matrix component.
        for (let lIndex = 0; lIndex < this.mData.length; lIndex++) {
            lTargetMatrix.mData[lIndex] = this.mData[lIndex] + pAddData;
        }

        return lTargetMatrix;
    }

    /**
     * Adjoint matrix.
     *
     * @returns Adjoint of this matrix.
     */
    public adjoint(): Matrix {
        const lCofactorData: Array<number> = new Array<number>(this.mHeight * this.mWidth);

        // Calculate cofactor for each element.
        for (let lRowIndex = 0; lRowIndex < this.mHeight; lRowIndex++) {
            for (let lColumnIndex = 0; lColumnIndex < this.mWidth; lColumnIndex++) {
                // Calculate determinant of matrix with omitted column and row.
                // Toggle sign on each new row or column.
                let lDeterminant: number = this.omit(lRowIndex, lColumnIndex).determinant();
                lDeterminant *= Math.pow(-1, (lRowIndex + 1) + (lColumnIndex + 1));

                // Store in cofactor matrix (column-major).
                lCofactorData[lColumnIndex * this.mHeight + lRowIndex] = lDeterminant;
            }
        }

        // Calculate transpose from cofactor matrix to get adjoint.
        const lCofactorMatrix: Matrix = new Matrix(lCofactorData, this.mHeight, this.mWidth);
        return lCofactorMatrix.transpose();
    }

    /**
     * Calculate determinant of matrix.
     *
     * @returns Determinant value.
     */
    public determinant(): number {
        // Handle 0x0 matrix (empty matrix determinant is 1 by convention).
        if (this.mHeight === 0 && this.mWidth === 0) {
            return 1;
        }

        // Fast determinant calculation of a 1x1 matrix.
        if (this.mHeight === 1 && this.mWidth === 1) {
            return this.mData[0];
        }

        // Fast determinant calculation of a 2x2 matrix: ad - bc.
        if (this.mHeight === 2 && this.mWidth === 2) {
            return this.mData[0] * this.mData[3] - this.mData[2] * this.mData[1];
        }

        // Expand along first row using Laplace expansion.
        let lDeterminant: number = 0;
        for (let lColumnIndex = 0; lColumnIndex < this.mWidth; lColumnIndex++) {
            // Get element of first row at current column.
            let lSignedNumber: number = this.mData[lColumnIndex * this.mHeight];
            lSignedNumber *= (lColumnIndex % 2) ? -1 : 1; // Toggle sign between iterations.

            // Check if any calculation needs to be done. Zero multiplied is always zero.
            if (lSignedNumber !== 0) {
                // Calculate determinant of submatrix with omitted first row and current column.
                const lSubMatrix: Matrix = this.omit(0, lColumnIndex);
                lDeterminant += lSignedNumber * lSubMatrix.determinant();
            }
        }

        return lDeterminant;
    }

    /**
     * Get element at specified row and column.
     *
     * @param pRow - Row index.
     * @param pColumn - Column index.
     *
     * @returns Element value.
     */
    public get(pRow: number, pColumn: number): number {
        return this.mData[pColumn * this.mHeight + pRow];
    }

    /**
     * Inverse matrix.
     *
     * @returns Inverse of this matrix.
     */
    public inverse(): Matrix {
        const lAdjoint: Matrix = this.adjoint();
        const lDeterminant: number = this.determinant();

        // Divide each adjoint component by determinant.
        const lData: Array<number> = new Array<number>(this.mData.length);
        for (let lIndex = 0; lIndex < lData.length; lIndex++) {
            lData[lIndex] = lAdjoint.mData[lIndex] / lDeterminant;
        }

        return new Matrix(lData, this.mHeight, this.mWidth);
    }

    /**
     * Multiplicate matrix.
     *
     * @param pMultData - Matrix or scalar value.
     * @param pApplyToSelf - Apply calculation to this matrix instead of creating a new one.
     *
     * @returns New matrix with multiplied values or this matrix if pApplyToSelf is true.
     */
    public mult(pMultData: Matrix | number, pApplyToSelf: boolean = false): Matrix {
        if (pMultData instanceof Matrix) {
            // Set target matrix depending on apply to self or not.
            // New matrix is initialized with empty data and correct dimensions, data will be set directly after calculation.
            const lTargetMatrix: Matrix = pApplyToSelf ? this : new Matrix(new Array<number>(0), 0, 0);

            // Restrict on matching dimensions.
            if (this.mWidth !== pMultData.mHeight) {
                throw new Exception('Matrices A width and B height must match for multiplication.', this);
            }

            // Multiply matrices column by column.
            const lResultHeight: number = this.mHeight;
            const lResultWidth: number = pMultData.mWidth;
            const lData: Array<number> = new Array<number>(lResultHeight * lResultWidth);

            for (let lColumnIndex = 0; lColumnIndex < lResultWidth; lColumnIndex++) {
                for (let lRowIndex = 0; lRowIndex < lResultHeight; lRowIndex++) {
                    // Dot product of source row with target column.
                    let lProduct: number = 0;
                    for (let lComponentIndex = 0; lComponentIndex < this.mWidth; lComponentIndex++) {
                        lProduct += this.mData[lComponentIndex * this.mHeight + lRowIndex] * pMultData.mData[lColumnIndex * pMultData.mHeight + lComponentIndex];
                    }

                    lData[lColumnIndex * lResultHeight + lRowIndex] = lProduct;
                }
            }

            // Set data directly on target.
            lTargetMatrix.mData = lData;
            lTargetMatrix.mHeight = lResultHeight;
            lTargetMatrix.mWidth = lResultWidth;

            return lTargetMatrix;
        }

        // Set target matrix depending on apply to self or not.
        const lScalarTargetMatrix: Matrix = pApplyToSelf ? this : new Matrix(new Array<number>(this.mData.length), this.mHeight, this.mWidth);

        // Multiply scalar to each matrix component.
        for (let lIndex = 0; lIndex < this.mData.length; lIndex++) {
            lScalarTargetMatrix.mData[lIndex] = this.mData[lIndex] * pMultData;
        }

        return lScalarTargetMatrix;
    }

    /**
     * Omit row and column from matrix.
     *
     * @param pOmitRow - Omitting row.
     * @param pOmitColumn - Omitting column.
     *
     * @returns New matrix with omitted row and column.
     */
    public omit(pOmitRow: number, pOmitColumn: number): Matrix {
        const lNewHeight: number = this.mHeight - 1;
        const lNewWidth: number = this.mWidth - 1;
        const lData: Array<number> = new Array<number>(lNewHeight * lNewWidth);

        // Copy elements skipping omitted row and column.
        let lNewColumnIndex: number = 0;
        for (let lColumnIndex = 0; lColumnIndex < this.mWidth; lColumnIndex++) {
            if (lColumnIndex === pOmitColumn) {
                continue;
            }

            let lNewRowIndex: number = 0;
            for (let lRowIndex = 0; lRowIndex < this.mHeight; lRowIndex++) {
                if (lRowIndex === pOmitRow) {
                    continue;
                }

                lData[lNewColumnIndex * lNewHeight + lNewRowIndex] = this.mData[lColumnIndex * this.mHeight + lRowIndex];
                lNewRowIndex++;
            }

            lNewColumnIndex++;
        }

        return new Matrix(lData, lNewHeight, lNewWidth);
    }

    /**
     * Set element at specified row and column.
     *
     * @param pRow - Row index.
     * @param pColumn - Column index.
     * @param pValue - Value to set.
     */
    public set(pRow: number, pColumn: number, pValue: number): void {
        this.mData[pColumn * this.mHeight + pRow] = pValue;
    }

    /**
     * Subtract value from matrix.
     *
     * @param pSubData - Matrix or scalar value.
     * @param pApplyToSelf - Apply calculation to this matrix instead of creating a new one.
     *
     * @returns New matrix with subtracted values or this matrix if pApplyToSelf is true.
     */
    public sub(pSubData: Matrix | number, pApplyToSelf: boolean = false): Matrix {
        // Set target matrix depending on apply to self or not.
        const lTargetMatrix: Matrix = pApplyToSelf ? this : new Matrix(new Array<number>(this.mData.length), this.mHeight, this.mWidth);

        if (pSubData instanceof Matrix) {
            // Restrict on same size.
            if (this.mHeight !== pSubData.mHeight || this.mWidth !== pSubData.mWidth) {
                throw new Exception('Matrices need to be the same size for calculation.', this);
            }

            // Subtract each component element-wise.
            for (let lIndex = 0; lIndex < this.mData.length; lIndex++) {
                lTargetMatrix.mData[lIndex] = this.mData[lIndex] - pSubData.mData[lIndex];
            }

            return lTargetMatrix;
        }

        // Subtract scalar from each matrix component.
        for (let lIndex = 0; lIndex < this.mData.length; lIndex++) {
            lTargetMatrix.mData[lIndex] = this.mData[lIndex] - pSubData;
        }

        return lTargetMatrix;
    }

    /**
     * Transpose matrix.
     *
     * @returns Transposed matrix.
     */
    public transpose(): Matrix {
        const lData: Array<number> = new Array<number>(this.mHeight * this.mWidth);

        // Copy each element to transposed position.
        for (let lColumnIndex = 0; lColumnIndex < this.mWidth; lColumnIndex++) {
            for (let lRowIndex = 0; lRowIndex < this.mHeight; lRowIndex++) {
                // Source: column-major index (lColumnIndex * height + lRowIndex).
                // Target: transposed column-major index (lRowIndex * width + lColumnIndex).
                lData[lRowIndex * this.mWidth + lColumnIndex] = this.mData[lColumnIndex * this.mHeight + lRowIndex];
            }
        }

        return new Matrix(lData, this.mWidth, this.mHeight);
    }

    /**
     * Multiply matrix with vector.
     *
     * @param pMultData - Vector.
     *
     * @returns Resulting vector.
     */
    public vectorMult(pMultData: Vector): Vector {
        // Restrict on matching dimensions.
        if (this.mWidth !== pMultData.data.length) {
            throw new Exception('Matrices A width and B height must match for multiplication.', this);
        }

        // Multiply each row with vector components.
        const lResultData: Array<number> = new Array<number>(this.mHeight);
        for (let lRowIndex = 0; lRowIndex < this.mHeight; lRowIndex++) {
            let lSum: number = 0;
            for (let lColumnIndex = 0; lColumnIndex < this.mWidth; lColumnIndex++) {
                lSum += this.mData[lColumnIndex * this.mHeight + lRowIndex] * pMultData.data[lColumnIndex];
            }

            lResultData[lRowIndex] = lSum;
        }

        return new Vector(lResultData);
    }
}