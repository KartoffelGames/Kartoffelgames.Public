import { Exception } from '../exception/exception.ts';

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
        this.mData = pData;
    }

    /**
     * Add two vectors.
     * @param pAddData - Vector or scalar.
     * @param pApplyToSelf - Apply calculation to this vector instead of creating a new one.
     */
    public add(pAddData: Vector | number, pApplyToSelf: boolean = false): Vector {
        // Set target vector depending on apply to self or not.
        const lTargetVector: Vector = pApplyToSelf ? this : new Vector(new Array<number>(this.mData.length));

        if (pAddData instanceof Vector) {
            // Restrict on same length.
            if (this.mData.length !== pAddData.data.length) {
                throw new Exception('Vectors need to be the same length for calculation.', this);
            }

            // Add values.
            for (let lIndex: number = 0; lIndex < this.mData.length; lIndex++) {
                lTargetVector.mData[lIndex] = this.mData[lIndex] + pAddData.data[lIndex];
            }

            return lTargetVector;
        }

        // Add scalar to each vector component in-place.
        for (let lIndex: number = 0; lIndex < this.mData.length; lIndex++) {
            lTargetVector.mData[lIndex] = this.mData[lIndex] + pAddData;
        }

        return lTargetVector;
    }

    /**
     * Get length of vector.
     */
    public length(): number {
        // Square root sum.
        let lSum: number = 0;
        for(let lIndex: number = 0; lIndex < this.mData.length; lIndex++) {
            lSum += this.mData[lIndex] ** 2;
        }
        
        return Math.sqrt(lSum);
    }

    /**
     * Calulate cross product of two vector3.
     * @param pVector - Vector3.
     * @param pApplyToSelf - Apply calculation to this vector instead of creating a new one.
     */
    public multCross(pVector: Vector, pApplyToSelf: boolean = false): Vector {
        // Restrict on same length.
        if (this.mData.length !== pVector.data.length && this.mData.length !== 3) {
            throw new Exception('Vectors need to be the length of 3 for cross product calculation.', this);
        }

        /*
         * cx = ay*bz − az*by
         * cy = az*bx − ax*bz
         * cz = ax*by − ay*bx
         */
        const lX: number = this.mData[1] * pVector.data[2] - this.mData[2] * pVector.data[1];
        const lY: number = this.mData[2] * pVector.data[0] - this.mData[0] * pVector.data[2];
        const lZ: number = this.mData[0] * pVector.data[1] - this.mData[1] * pVector.data[0];

        // Set target vector depending on apply to self or not.
        const lTargetVector: Vector = pApplyToSelf ? this : new Vector([0, 0, 0]);
        lTargetVector.mData[0] = lX;
        lTargetVector.mData[1] = lY;
        lTargetVector.mData[2] = lZ;

        return lTargetVector;
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
     * @param pApplyToSelf - Apply calculation to this vector instead of creating a new one.
     */
    public normalize(pApplyToSelf: boolean = false): Vector {
        const lLength: number = this.length();

        // Set target vector depending on apply to self or not.
        const lTargetVector: Vector = pApplyToSelf ? this : new Vector([0, 0, 0]);

        // Divide each vector component by length in-place.
        for (let lIndex: number = 0; lIndex < this.mData.length; lIndex++) {
            lTargetVector.mData[lIndex] = this.mData[lIndex] / lLength;
        }

        return lTargetVector;
    }

    /**
     * Substract two vectors.
     * @param pSubData - Vector or scalar
     * @param pApplyToSelf - Apply calculation to this vector instead of creating a new one.
     */
    public sub(pSubData: Vector | number, pApplyToSelf: boolean = false): Vector {
        // Set target vector depending on apply to self or not.
        const lTargetVector: Vector = pApplyToSelf ? this : new Vector(new Array<number>(this.mData.length));

        if (pSubData instanceof Vector) {
            // Restrict on same length.
            if (this.mData.length !== pSubData.data.length) {
                throw new Exception('Vectors need to be the same length for calculation.', this);
            }

            // Subtract values.
            for (let lIndex: number = 0; lIndex < this.mData.length; lIndex++) {
                lTargetVector.mData[lIndex] = this.mData[lIndex] - pSubData.data[lIndex];
            }

            return lTargetVector;
        }

        // Substract scalar to each vector component.
        for (let lIndex: number = 0; lIndex < this.mData.length; lIndex++) {
            lTargetVector.mData[lIndex] = this.mData[lIndex] - pSubData;
        }

        return lTargetVector;
    }
}