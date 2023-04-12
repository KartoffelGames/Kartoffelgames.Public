import { Matrix } from '../math/matrix';
import { Quaternion } from '../math/quaternion';

export class Transform {
    private mRotation: Quaternion;
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
            this.mTransformationMatrix = this.mTranslation.mult(this.mRotation.asMatrix().mult(this.mScale));
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
        this.mRotation = new Quaternion(1, 0, 0, 0);
        this.mTransformationMatrix = null;
    }

    public addRotation(pRoll: number, pPitch: number, pYaw: number): void {
        // Create quaternion from euler rotation and multiplicate with current orientation.
        const lQuaternion: Quaternion = Quaternion.fromEuler(pRoll, pPitch, pYaw);
        this.mRotation = this.mRotation.mult(lQuaternion);

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }
}