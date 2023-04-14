import { Euler } from '../../math/euler';
import { Matrix } from '../../math/matrix';
import { Quaternion } from '../../math/quaternion';
import { IProjection } from './projection/i-projection.interface';

export class Camera {
    private readonly mPivot: Matrix;
    private readonly mProjection: IProjection;
    private mRotation: Quaternion;
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
     * Camera rotation as euler rotation.
     */
    public get rotation(): Euler {
        return this.mRotation.asEuler();
    }

    /**
     * X translation.
     */
    public get translationX(): number {
        return this.mTranslation.data[0][3];
    } set translationX(pValue: number) {
        this.mTranslation.data[0][3] = pValue;
    }

    /**
     * Y translation.
     */
    public get translationY(): number {
        return this.mTranslation.data[1][3];
    } set translationY(pValue: number) {
        this.mTranslation.data[1][3] = pValue;
    }

    /**
     * Z translation.
     */
    public get translationZ(): number {
        return this.mTranslation.data[2][3];
    } set translationZ(pValue: number) {
        this.mTranslation.data[2][3] = pValue;
    }

    public get viewProjectionMatrix(): Matrix {
        // TODO: Cache.
        const lViewMatrix: Matrix = this.mTranslation.mult(this.mRotation.asMatrix()).inverse();
        const lProjectionMatrix: Matrix = this.mProjection.projectionMatrix;

        return lViewMatrix.mult(lProjectionMatrix);
    }

    /**
     * Constructor.
     */
    public constructor(pProjection: IProjection) {
        this.mProjection = pProjection;

        this.mRotation = Quaternion.identity();
        this.mTranslation = Matrix.identity(4);
        this.mPivot = Matrix.identity(4);
    }

    /**
     * Rotate camera.
     * @param pRoll - Roll degree.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     */
    public rotate(pRoll: number, pPitch: number, pYaw: number): void {
        this.mRotation = this.mRotation.addEulerRotation(pRoll, pPitch, pYaw);
    }

    /**
     * Set absolute camera rotation.
     * @param pRoll - Roll degree.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     */
    public setRotation(pRoll: number, pPitch: number, pYaw: number): void {
        this.mRotation = Quaternion.fromRotation(pRoll, pPitch, pYaw);
    }
}