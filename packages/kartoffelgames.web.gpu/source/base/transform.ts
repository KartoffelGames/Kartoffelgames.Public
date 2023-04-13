import { Matrix } from '../math/matrix';
import { Quaternion } from '../math/quaternion';

export class Transform {
    private mCachePivitInverse: Matrix | null;
    private mCachePivitRotation: Matrix | null;
    private mCacheRotation: Matrix | null;
    private mCacheTransformationMatrix: Matrix | null;
    private readonly mPivot: Matrix;
    private mRotation: Quaternion;
    private readonly mScale: Matrix;

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

        // Reset calculated transformation matrix and pivot caches.
        this.mCachePivitInverse = null;
        this.mCachePivitRotation = null;
        this.mCacheTransformationMatrix = null;
    }

    /**
     * Y pivot point.
     */
    public get pivotY(): number {
        return this.mPivot.data[1][3];
    } set pivotY(pValue: number) {
        this.mPivot.data[1][3] = pValue;

        // Reset calculated transformation matrix and pivot caches.
        this.mCachePivitInverse = null;
        this.mCachePivitRotation = null;
        this.mCacheTransformationMatrix = null;
    }

    /**
     * Z pivot point.
     */
    public get pivotZ(): number {
        return this.mPivot.data[2][3];
    } set pivotZ(pValue: number) {
        this.mPivot.data[2][3] = pValue;

        // Reset calculated transformation matrix and pivot caches.
        this.mCachePivitInverse = null;
        this.mCachePivitRotation = null;
        this.mCacheTransformationMatrix = null;
    }

    /**
     * Depth scale.
     */
    public get scaleDepth(): number {
        return this.mScale.data[2][2];
    } set scaleDepth(pValue: number) {
        this.mScale.data[2][2] = pValue;

        // Reset calculated transformation matrix.
        this.mCacheTransformationMatrix = null;
    }

    /**
     * Height scale.
     */
    public get scaleHeight(): number {
        return this.mScale.data[1][1];
    } set scaleHeight(pValue: number) {
        this.mScale.data[1][1] = pValue;

        // Reset calculated transformation matrix.
        this.mCacheTransformationMatrix = null;
    }

    /**
     * Width scale.
     */
    public get scaleWidth(): number {
        return this.mScale.data[0][0];
    } set scaleWidth(pValue: number) {
        this.mScale.data[0][0] = pValue;

        // Reset calculated transformation matrix.
        this.mCacheTransformationMatrix = null;
    }

    /**
     * Get transformation matrix.
     */
    public get transformationMatrix(): Matrix {
        // private mCachePivitInverse: Matrix | null;
        // private mCachePivitRotation: Matrix | null;


        // Recalulate transformation matrix.
        if (!this.mCacheTransformationMatrix) {
            // Check rotation change.
            if (this.mCacheRotation === null) {
                this.mCacheRotation = this.mRotation.asMatrix();
            }

            // Check pivit and rotation cache.
            if (this.mCachePivitRotation === null) {
                // Check if pivit point is used.
                if (this.pivotX !== 0 || this.pivotY !== 0 || this.pivotZ !== 0) {
                    // Check pivit inverse cache.
                    if (this.mCachePivitInverse === null) {
                        this.mCachePivitInverse = this.mPivot.inverse();
                    }

                    // Translate pivot => rotate => reverse pivate translation.
                    this.mCachePivitRotation = this.mCachePivitInverse.mult(this.mCacheRotation).mult(this.mPivot);
                } else {
                    this.mCachePivitRotation = this.mCacheRotation;
                }
            }

            // First scale, second rotate, third translate.
            this.mCacheTransformationMatrix = this.mTranslation.mult(this.mCachePivitRotation).mult(this.mScale);
        }

        return this.mCacheTransformationMatrix;
    }

    /**
     * X translation.
     */
    public get translationX(): number {
        return this.mTranslation.data[0][3];
    } set translationX(pValue: number) {
        this.mTranslation.data[0][3] = pValue;

        // Reset calculated transformation matrix.
        this.mCacheTransformationMatrix = null;
    }

    /**
     * Y translation.
     */
    public get translationY(): number {
        return this.mTranslation.data[1][3];
    } set translationY(pValue: number) {
        this.mTranslation.data[1][3] = pValue;

        // Reset calculated transformation matrix.
        this.mCacheTransformationMatrix = null;
    }

    /**
     * Z translation.
     */
    public get translationZ(): number {
        return this.mTranslation.data[2][3];
    } set translationZ(pValue: number) {
        this.mTranslation.data[2][3] = pValue;

        // Reset calculated transformation matrix.
        this.mCacheTransformationMatrix = null;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mScale = Matrix.identity(4);
        this.mTranslation = Matrix.identity(4);
        this.mRotation = new Quaternion(1, 0, 0, 0);
        this.mPivot = Matrix.identity(4);

        // Matrix caches.
        this.mCachePivitInverse = null;
        this.mCachePivitRotation = null;
        this.mCacheTransformationMatrix = null;
        this.mCacheRotation = null;
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

        // Reset calculated transformation matrix and rotation matrix.
        this.mCacheRotation = null;
        this.mCachePivitRotation = null;
        this.mCacheTransformationMatrix = null;
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

        // Reset calculated transformation matrix and rotation matrix.
        this.mCacheRotation = null;
        this.mCachePivitRotation = null;
        this.mCacheTransformationMatrix = null;
    }
}