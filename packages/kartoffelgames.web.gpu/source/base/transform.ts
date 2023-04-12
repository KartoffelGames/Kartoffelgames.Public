import { Matrix } from '../math/matrix';
import { Quaternion } from '../math/quaternion';

export class Transform {
    private readonly mPivot: Matrix;
    private mRotation: Quaternion;
    private readonly mScale: Matrix;
    private mTransformationMatrix: Matrix | null;
    private readonly mTranslation: Matrix;

    /**
     * Rotation on X angle.
     */
    public get axisRotationAngleX(): number {
        return (this.mRotation.x / Math.sqrt(1 - Math.pow(this.mRotation.w, 2))) * 180 / Math.PI;
    }

    /**
     * Rotation on Y angle.
     */
    public get axisRotationAngleY(): number {
        return (this.mRotation.y / Math.sqrt(1 - Math.pow(this.mRotation.w, 2))) * 180 / Math.PI;
    }

    /**
     * Rotation on Z angle.
     */
    public get axisRotationAngleZ(): number {
        return (this.mRotation.z / Math.sqrt(1 - Math.pow(this.mRotation.w, 2))) * 180 / Math.PI;
    }

    /**
     * X pivot point.
     */
    public get pivotX(): number {
        return this.mPivot.data[0][3];
    } set pivotX(pValue: number) {
        this.mPivot.data[0][3] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Y pivot point.
     */
    public get pivotY(): number {
        return this.mPivot.data[1][3];
    } set pivotY(pValue: number) {
        this.mPivot.data[1][3] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Z pivot point.
     */
    public get pivotZ(): number {
        return this.mPivot.data[2][3];
    } set pivotZ(pValue: number) {
        this.mPivot.data[2][3] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Depth scale.
     */
    public get scaleDepth(): number {
        return this.mScale.data[2][2];
    } set scaleDepth(pValue: number) {
        this.mScale.data[2][2] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Height scale.
     */
    public get scaleHeight(): number {
        return this.mScale.data[1][1];
    } set scaleHeight(pValue: number) {
        this.mScale.data[1][1] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Width scale.
     */
    public get scaleWidth(): number {
        return this.mScale.data[0][0];
    } set scaleWidth(pValue: number) {
        this.mScale.data[0][0] = pValue;

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
            this.mTransformationMatrix = this.mTranslation.mult(this.mRotation.asMatrix()).mult(this.mScale);
        }

        return this.mTransformationMatrix;
    }

    /**
     * X translation.
     */
    public get translationX(): number {
        return this.mTranslation.data[0][3];
    } set translationX(pValue: number) {
        this.mTranslation.data[0][3] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Y translation.
     */
    public get translationY(): number {
        return this.mTranslation.data[1][3];
    } set translationY(pValue: number) {
        this.mTranslation.data[1][3] = pValue;

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Z translation.
     */
    public get translationZ(): number {
        return this.mTranslation.data[2][3];
    } set translationZ(pValue: number) {
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
        this.mPivot = Matrix.identity(4, 1);
        this.mTransformationMatrix = null;
    }

    /**
     * Add rotation.
     * @param pRoll - Roll degree.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     */
    public addRotation(pRoll: number, pPitch: number, pYaw: number): void {
        // Apply rotation to current rotation.
        this.mRotation = Quaternion.fromEuler(pRoll, pPitch, pYaw).mult(this.mRotation);

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }

    /**
     * Set absolute rotation.
     * @param pRoll - Roll degree.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     */
    public setRotation(pRoll: number, pPitch: number, pYaw: number): void {
        // Apply rotation to current rotation.
        this.mRotation = Quaternion.fromEuler(pRoll, pPitch, pYaw).mult(this.mRotation);

        // Reset calculated transformation matrix.
        this.mTransformationMatrix = null;
    }
}