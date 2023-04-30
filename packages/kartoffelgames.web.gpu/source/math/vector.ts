import { Exception } from '@kartoffelgames/core.data';

export class Vector {
    private readonly mData: Array<number>;

    /**
     * Get vector data.
     */
    public get data(): Array<number> {
        return this.mData;
    }

    /**
     * W value quick access. 
     */
    public get w(): number {
        return this.mData[3];
    }

    /**
     * X value quick access. 
     */
    public get x(): number {
        return this.mData[0];
    }

    /**
     * Y value quick access. 
     */
    public get y(): number {
        return this.mData[1];
    }

    /**
     * Z value quick access. 
     */
    public get z(): number {
        return this.mData[2];
    }
    

    /**
     * Constructor.
     * @param pData - Vector data.
     */
    public constructor(pData: Array<number>) {
        this.mData = [...pData];
    }

    /**
     * Add two vectors.
     * @param pAddData - Vector or scalar.
     */
    public add(pAddData: Vector | number): Vector {
        const lData: Array<number> = new Array<number>();

        if (pAddData instanceof Vector) {
            // Restrict on same length.
            if (this.mData.length !== pAddData.data.length) {
                throw new Exception('Vectors need to be the same length for calculation.', this);
            }

            // Add values.
            for (let lIndex: number = 0; lIndex < this.mData.length; lIndex++) {
                lData.push(this.mData[lIndex] + pAddData.data[lIndex]);
            }
        } else {
            // Add scalar to each vector component.
            for (const lItem of this.mData) {
                lData.push(lItem + pAddData);
            }
        }

        return new Vector(lData);
    }

    /**
     * Get length of vector.
     */
    public length(): number {
        // Square root sum.
        return Math.hypot(...this.mData);
    }

    /**
     * Calulate cross product of two vector3.
     * @param pVector - Vector3.
     */
    public multCross(pVector: Vector): Vector {
        // Restrict on same length.
        if (this.mData.length !== pVector.data.length && this.mData.length !== 3) {
            throw new Exception('Vectors need to be the length of 3 for corss product calculation.', this);
        }

        /*
         * cx = ay*bz − az*by
         * cy = az*bx − ax*bz
         * cz = ax*by − ay*bx
         */
        return new Vector([
            this.mData[1] * pVector.data[2] - this.mData[2] * pVector.data[1],
            this.mData[2] * pVector.data[0] - this.mData[0] * pVector.data[2],
            this.mData[0] * pVector.data[1] - this.mData[1] * pVector.data[0]
        ]);
    }

    /**
     * Multiply with dot procedure.
     * @param pVector - Vector.
     */
    public multDot(pVector: Vector): number {
        // Restrict on same length.
        if (this.mData.length !== pVector.data.length) {
            throw new Exception('Vectors need to be the same length for calculation.', this);
        }

        // Calculate dot product.
        let lProduct: number = 0;
        for (let lIndex: number = 0; lIndex < this.mData.length; lIndex++) {
            lProduct += this.mData[lIndex] * pVector.data[lIndex];
        }

        return lProduct;
    }

    /**
     * Normalize vector.
     */
    public normalize(): Vector {
        const lLength: number = this.length();

        // Devide each vector component with it vector length.
        const lData: Array<number> = new Array<number>();
        for (const lItem of this.mData) {
            lData.push(lItem / lLength);
        }

        return new Vector(lData);
    }

    /**
     * Substract two vectors.
     * @param pSubData - Vector or scalar
     */
    public sub(pSubData: Vector | number): Vector {
        const lData: Array<number> = new Array<number>();

        if (pSubData instanceof Vector) {
            // Restrict on same length.
            if (this.mData.length !== pSubData.data.length) {
                throw new Exception('Vectors need to be the same length for calculation.', this);
            }

            // Add values.
            for (let lIndex: number = 0; lIndex < this.mData.length; lIndex++) {
                lData.push(this.mData[lIndex] - pSubData.data[lIndex]);
            }
        } else {
            // Substract scalar to each vector component.
            for (const lItem of this.mData) {
                lData.push(lItem - pSubData);
            }
        }

        return new Vector(lData);
    }
}