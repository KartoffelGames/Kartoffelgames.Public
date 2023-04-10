import { Matrix } from '../math/matrix';

export class Transform {
    private readonly mRotation: Matrix;
    private readonly mScale: Matrix;
    private mTransformationMatrix: Matrix | null;
    private readonly mTranslation: Matrix;

    /**
     * Depth scale.
     */
    public get depth(): number {
        return this.mScale.data[2][2];
    } set depth(pValue: number) {
        this.mScale.data[2][2] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Height scale.
     */
    public get height(): number {
        return this.mScale.data[1][1];
    } set height(pValue: number) {
        this.mScale.data[1][1] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Get transformation matrix.
     */
    public get transformationMatrix(): Matrix {
        // Recalulate transformation matrix.
        if (!this.mTransformationMatrix) {
            // First scale, second rotate, third translate.
            this.mTransformationMatrix = this.mTranslation.mult(this.mRotation.mult(this.mScale));
        }

        return this.mTransformationMatrix;
    }

    /**
     * Width scale.
     */
    public get width(): number {
        return this.mScale.data[0][0];
    } set width(pValue: number) {
        this.mScale.data[0][0] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * X translation.
     */
    public get x(): number {
        return this.mTranslation.data[0][3];
    } set x(pValue: number) {
        this.mTranslation.data[0][3] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Y translation.
     */
    public get y(): number {
        return this.mTranslation.data[1][3];
    } set y(pValue: number) {
        this.mTranslation.data[1][3] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Z translation.
     */
    public get z(): number {
        return this.mTranslation.data[2][3];
    } set z(pValue: number) {
        this.mTranslation.data[2][3] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mScale = Matrix.identity(4, 1);
        this.mTranslation = Matrix.identity(4, 1);
        this.mRotation = Matrix.identity(4, 1);
        this.mTransformationMatrix = null;
    }
}