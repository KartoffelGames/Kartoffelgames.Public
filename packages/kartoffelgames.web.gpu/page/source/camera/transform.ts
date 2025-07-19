import { Matrix } from './math/matrix.ts';
import { Quaternion } from './math/quaternion.ts';
import { Vector } from './math/vector.ts';

export class Transform {
    private readonly mPivot: Matrix;
    private mRotation: Quaternion;
    private readonly mScale: Matrix;
    private readonly mTranslation: Matrix;

    /**
     * X pivot point.
     */
    public get pivotX(): number {
        return this.mPivot.data[0][3];
    } set pivotX(pValue: number) {
        this.mPivot.data[0][3] = pValue;
    }

    /**
     * Y pivot point.
     */
    public get pivotY(): number {
        return this.mPivot.data[1][3];
    } set pivotY(pValue: number) {
        this.mPivot.data[1][3] = pValue;
    }

    /**
     * Z pivot point.
     */
    public get pivotZ(): number {
        return this.mPivot.data[2][3];
    } set pivotZ(pValue: number) {
        this.mPivot.data[2][3] = pValue;
    }

    /**
     * Rotation on X angle.
     * Pitch.
     */
    public get rotationPitch(): number {
        return this.mRotation.asEuler().x;
    }

    /**
     * Rotation on Z angle.
     * Roll.
     */
    public get rotationRoll(): number {
        return this.mRotation.asEuler().z;
    }

    /**
     * Rotation on Y angle.
     * Yaw.
     */
    public get rotationYaw(): number {
        return this.mRotation.asEuler().y;
    }

    /**
     * Depth scale.
     */
    public get scaleDepth(): number {
        return this.mScale.data[2][2];
    }

    /**
     * Height scale.
     */
    public get scaleHeight(): number {
        return this.mScale.data[1][1];
    }

    /**
     * Width scale.
     */
    public get scaleWidth(): number {
        return this.mScale.data[0][0];
    }

    /**
     * X translation.
     */
    public get translationX(): number {
        return this.mTranslation.data[0][3];
    }

    /**
     * Y translation.
     */
    public get translationY(): number {
        return this.mTranslation.data[1][3];
    }

    /**
     * Z translation.
     */
    public get translationZ(): number {
        return this.mTranslation.data[2][3];
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mScale = Matrix.identity(4);
        this.mTranslation = Matrix.identity(4);
        this.mRotation = new Quaternion(1, 0, 0, 0);
        this.mPivot = Matrix.identity(4);
    }

    /**
     * Add angles to current euler rotation angles.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public addEulerRotation(pPitch: number, pYaw: number, pRoll: number): void {
        // Apply rotation to current rotation.
        this.mRotation = this.mRotation.addEulerRotation(pPitch, pYaw, pRoll);
    }

    /**
     * Add rotation to already rotated object.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public addRotation(pPitch: number, pYaw: number, pRoll: number): void {
        // Apply rotation to current rotation.
        this.mRotation = Quaternion.fromRotation(pPitch, pYaw, pRoll).mult(this.mRotation);
    }

    /**
     * Add scale.
     * @param pWidth - Width multiplier.
     * @param pHeight - Height multiplier.
     * @param pDepth - Depth multiplier.
     */
    public addScale(pWidth: number, pHeight: number, pDepth: number): void {
        this.mScale.data[0][0] += pWidth;
        this.mScale.data[1][1] += pHeight;
        this.mScale.data[2][2] += pDepth;
    }

    /**
     * Add translation.
     * @param pX - Movement on worlds X axis.
     * @param pY - Movement on worlds Y axis.
     * @param pZ - Movement on worlds Z axis.
     */
    public addTranslation(pX: number, pY: number, pZ: number): this {
        this.mTranslation.data[0][3] += pX;
        this.mTranslation.data[1][3] += pY;
        this.mTranslation.data[2][3] += pZ;

        return this;
    }

    /**
     * Get transformation matrix.
     */
    public getMatrix(pType: TransformMatrix): Matrix {
        switch (pType) {
            case TransformMatrix.Scale: {
                return this.mScale;
            }
            case TransformMatrix.Translation: {
                return this.mTranslation;
            }
            case TransformMatrix.Rotation: {
                return this.mRotation.asMatrix();
            }
            case TransformMatrix.PivotRotation: {
                const lRotationMatrix: Matrix = this.getMatrix(TransformMatrix.Rotation);

                // Check if pivit point is used.
                let lPivotRotation: Matrix;
                if (this.pivotX !== 0 || this.pivotY !== 0 || this.pivotZ !== 0) {
                    // Translate pivot => rotate => reverse pivate translation.
                    lPivotRotation = this.mPivot.inverse().mult(lRotationMatrix).mult(this.mPivot);
                } else {
                    lPivotRotation = lRotationMatrix;
                }

                return lPivotRotation;
            }
            case TransformMatrix.Transformation: {
                const lScale: Matrix = this.getMatrix(TransformMatrix.Scale);
                const lTranslation: Matrix = this.getMatrix(TransformMatrix.Translation);
                const lRotation: Matrix = this.getMatrix(TransformMatrix.PivotRotation);

                // First scale, second rotate, third translate.
                return lTranslation.mult(lRotation).mult(lScale);
            }
        }
    }

    /**
     * Reset current rotation and set new rotation.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public setRotation(pPitch: number | null, pYaw: number | null, pRoll: number | null): void {
        const lPitch: number = pPitch ?? this.rotationPitch;
        const lYaw: number = pYaw ?? this.rotationYaw;
        const lRoll: number = pRoll ?? this.rotationRoll;

        // Create new rotation.
        this.mRotation = Quaternion.fromRotation(lPitch, lYaw, lRoll);
    }

    /**
     * Set scale.
     * @param pWidth - Width multiplier.
     * @param pHeight - Height multiplier.
     * @param pDepth - Depth multiplier.
     */
    public setScale(pWidth: number | null, pHeight: number | null, pDepth: number | null): this {
        this.mScale.data[0][0] = pWidth ?? this.scaleWidth;
        this.mScale.data[1][1] = pHeight ?? this.scaleHeight;
        this.mScale.data[2][2] = pDepth ?? this.scaleDepth;

        return this;
    }

    /**
     * Set translation.
     * @param pX - Movement on worlds X axis.
     * @param pY - Movement on worlds Y axis.
     * @param pZ - Movement on worlds Z axis.
     */
    public setTranslation(pX: number | null, pY: number | null, pZ: number | null): this {
        this.mTranslation.data[0][3] = pX ?? this.translationX;
        this.mTranslation.data[1][3] = pY ?? this.translationY;
        this.mTranslation.data[2][3] = pZ ?? this.translationZ;

        return this;
    }

    /**
     * Translate into rotation direction.
     * @param pForward - Forward movement.
     * @param pRight - Right movement.
     * @param pUp - Up movement.
     */
    public translateInDirection(pForward: number, pRight: number, pUp: number): void {
        const lTranslationVector: Vector = new Vector([pRight, pUp, pForward, 1]);
        const lDirectionVector: Vector = this.getMatrix(TransformMatrix.Rotation).vectorMult(lTranslationVector);

        // Add direction.
        this.addTranslation(lDirectionVector.x, lDirectionVector.y, lDirectionVector.z);
    }
}

export enum TransformMatrix {
    Rotation = 1,
    PivotRotation = 2,
    Translation = 3,
    Scale = 4,
    Transformation = 5
}