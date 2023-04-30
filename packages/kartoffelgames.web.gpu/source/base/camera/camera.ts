import { Euler } from '../../math/euler';
import { Matrix } from '../../math/matrix';
import { Quaternion } from '../../math/quaternion';
import { IProjection } from './projection/i-projection.interface';

export class Camera {
    private mCacheProjection: Matrix | null;
    private mCacheView: Matrix | null;
    private mCacheViewProjection: Matrix | null;
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

        // Clear view cache.
        this.mCacheView = null;
    }

    /**
     * Y pivot point.
     */
    public get pivotY(): number {
        return this.mPivot.data[1][3];
    } set pivotY(pValue: number) {
        this.mPivot.data[1][3] = pValue;

        // Clear view cache.
        this.mCacheView = null;
    }

    /**
     * Z pivot point.
     */
    public get pivotZ(): number {
        return this.mPivot.data[2][3];
    } set pivotZ(pValue: number) {
        this.mPivot.data[2][3] = pValue;

        // Clear view cache.
        this.mCacheView = null;
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

        // Clear view cache.
        this.mCacheView = null;
    }

    /**
     * Y translation.
     */
    public get translationY(): number {
        return this.mTranslation.data[1][3];
    } set translationY(pValue: number) {
        this.mTranslation.data[1][3] = pValue;

        // Clear view cache.
        this.mCacheView = null;
    }

    /**
     * Z translation.
     */
    public get translationZ(): number {
        return this.mTranslation.data[2][3];
    } set translationZ(pValue: number) {
        this.mTranslation.data[2][3] = pValue;

        // Clear view cache.
        this.mCacheView = null;
    }

    /**
     * Get cameras projection view matrix.
     * Caches calculated matrix.
     */
    public get viewProjectionMatrix(): Matrix {
        let lCacheChanged: boolean = false;

        // Validate view matrix,
        if (this.mCacheView === null) {
            this.mCacheView = this.mTranslation.mult(this.mRotation.asMatrix()).inverse();
            lCacheChanged = true;
        }

        // Check for projection changes.
        if (this.mCacheProjection !== this.mProjection.projectionMatrix) {
            this.mCacheProjection = this.mProjection.projectionMatrix;
            lCacheChanged = true;
        }

        // Recalculate projection view matrix on cache change.
        if (lCacheChanged || this.mCacheViewProjection === null) {
            this.mCacheViewProjection = this.mCacheProjection.mult(this.mCacheView);
        }

        return this.mCacheViewProjection;
    }

    /**
     * Constructor.
     */
    public constructor(pProjection: IProjection) {
        this.mProjection = pProjection;

        this.mRotation = Quaternion.identity();
        this.mTranslation = Matrix.identity(4);
        this.mPivot = Matrix.identity(4);

        // Caches.
        this.mCacheView = null;
        this.mCacheProjection = null;
        this.mCacheViewProjection = null;
    }

    /**
     * Rotate camera.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public rotate(pPitch: number, pYaw: number, pRoll: number): void {
        this.mRotation = this.mRotation.addEulerRotation(pPitch, pYaw, pRoll);

        // Clear view cache.
        this.mCacheView = null;
    }

    /**
     * Set absolute camera rotation.
     * @param pPitch - Pitch degree.
     * @param pYaw - Yaw degree.
     * @param pRoll - Roll degree.
     */
    public setRotation(pPitch: number, pYaw: number, pRoll: number): void {
        this.mRotation = Quaternion.fromRotation(pPitch, pYaw, pRoll);

        // Clear view cache.
        this.mCacheView = null;
    }
}