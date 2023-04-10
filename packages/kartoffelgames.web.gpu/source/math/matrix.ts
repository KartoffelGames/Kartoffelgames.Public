import { Exception } from '@kartoffelgames/core.data';

export class Matrix {
    /**
     * Create identity matrix.
     * @param pSize - Matix size: nxn
     * @param pValue - Value of identity. 
     */
    public static identity(pSize: number, pValue: number): Matrix {
        const lData: Array<Array<number>> = new Array<Array<number>>();
        for (let lRowIndex = 0; lRowIndex < pSize; lRowIndex++) {
            // Create Array filled with zeros.
            const lRowData: Array<number> = new Array<number>(pSize).fill(0);

            // Set identity column to value.
            lRowData[lRowIndex] = pValue;

            // Add row to data array.
            lData.push(lRowData);
        }

        return new Matrix(lData);
    }

    private readonly mData: Array<Array<number>>;

    /**
     * Get matix raw data.
     */
    public get data(): Array<Array<number>> {
        return this.mData;
    }

    /**
     * Data as number array.
     */
    public get dataArray(): Array<number> {
        const lData: Array<number> = new Array<number>();

        // Read from columns to rows.
        for (let lColumnIndex = 0; lColumnIndex < this.width; lColumnIndex++) {
            for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
                lData.push(this.mData[lRowIndex][lColumnIndex]);
            }
        }

        return lData;
    }

    /**
     * Get matrix height.
     */
    public get height(): number {
        return this.mData.length;
    }

    /**
     * Get matrix width.
     */
    public get width(): number {
        return this.mData[0]?.length ?? 0;
    }

    /**
     * Constructor.
     * @param pData - Matrix data.
     */
    public constructor(pData: Array<Array<number>>) {
        this.mData = pData;
    }

    /**
     * Add value to matrix.
     * @param pAddData - Matrix or scalar value.
     */
    public add(pAddData: Matrix | number): Matrix {
        const lData: Array<Array<number>> = new Array<Array<number>>();

        if (pAddData instanceof Matrix) {
            // Restrict on same length.
            if (this.height !== pAddData.height && this.width !== pAddData.width) {
                throw new Exception('Matrices need to be the same size for calculation.', this);
            }

            // Iterate rows and extend data dynamicly by pushing new data rows.
            for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
                // Add each column of row.
                const lRowData: Array<number> = new Array<number>(this.width);
                for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
                    lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] + pAddData.data[lRowIndex][lColumnIndex];
                }

                lData.push(lRowData);
            }
        } else {
            // Add scalar to each matrix component.
            for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
                const lRowData: Array<number> = new Array<number>(this.width);
                for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
                    lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] + pAddData;
                }

                lData.push(lRowData);
            }
        }

        return new Matrix(lData);
    }

    /**
     * Multiplicate matrix.
     * @param pMultData - Matrix or scalar value.
     */
    public mult(pMultData: Matrix | number): Matrix {
        const lData: Array<Array<number>> = new Array<Array<number>>();

        if (pMultData instanceof Matrix) {
            // Restrict on same length.
            if (this.height !== pMultData.width) {
                throw new Exception('Matrices A height and B width must match for multiplication.', this);
            }

            // Iterate rows and extend data dynamicly by pushing new data rows.
            for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
                // Add each column of row.
                const lRowData: Array<number> = new Array<number>(pMultData.width);
                for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {

                    // Multiplicate target row with source column components.
                    // Iteration length is eighter target.height or source.width.
                    let lProduct: number = 0;
                    for (let lComponentIndex = 0; lComponentIndex < this.height; lComponentIndex++) {
                        lProduct += this.mData[lRowIndex][lComponentIndex] * pMultData.data[lComponentIndex][lColumnIndex];
                    }
                    lRowData[lColumnIndex] = lProduct;
                }

                lData.push(lRowData);
            }
        } else {
            // Multiplicate scalar to each matrix component.
            for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
                const lRowData: Array<number> = new Array<number>(this.width);
                for (let lColumnIndex = 0; lColumnIndex < this.width; lColumnIndex++) {
                    lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] * pMultData;
                }

                lData.push(lRowData);
            }
        }

        return new Matrix(lData);
    }

    /**
     * Substract value to matrix.
     * @param pAddData - Matrix or scalar value.
     */
    public sub(pAddData: Matrix | number): Matrix {
        const lData: Array<Array<number>> = new Array<Array<number>>();

        if (pAddData instanceof Matrix) {
            // Restrict on same length.
            if (this.height !== pAddData.height && this.width !== pAddData.width) {
                throw new Exception('Matrices need to be the same size for calculation.', this);
            }

            // Iterate rows and extend data dynamicly by pushing new data rows.
            for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
                // Add each column of row.
                const lRowData: Array<number> = new Array<number>(this.width);
                for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
                    lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] - pAddData.data[lRowIndex][lColumnIndex];
                }

                lData.push(lRowData);
            }
        } else {
            // Add scalar to each matrix component.
            for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
                const lRowData: Array<number> = new Array<number>(this.width);
                for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
                    lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] - pAddData;
                }

                lData.push(lRowData);
            }
        }

        return new Matrix(lData);
    }
}