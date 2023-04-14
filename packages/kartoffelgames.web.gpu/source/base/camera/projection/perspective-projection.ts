import { Matrix } from '../../../math/matrix';
import { IProjection } from './i-projection.interface';

export class PerspectiveProjection implements IProjection {
    private mAngleOfView: number;
    private mAspectRatio: number;
    private mCacheProjectionMatrix: Matrix | null;
    private mFarPlane: number;
    private mNearPlane: number;

    /**
     * Angle of view.
     */
    public get angleOfView(): number {
        return this.mAngleOfView;
    } set angleOfView(pValue: number) {
        this.mAngleOfView = pValue;
    }

    /**
     * Angle of view.
     */
    public get aspectRatio(): number {
        return this.mAspectRatio;
    } set aspectRatio(pValue: number) {
        this.mAspectRatio = pValue;
    }

    /**
     * Far plane.
     */
    public get farPlane(): number {
        return this.mFarPlane;
    } set farPlane(pValue: number) {
        this.mFarPlane = pValue;
    }

    /**
     * Near plane.
     */
    public get nearPlane(): number {
        return this.mNearPlane;
    } set nearPlane(pValue: number) {
        this.mNearPlane = pValue;
    }

    /**
     * Projection matrix.
     */
    public get projectionMatrix(): Matrix {
        if (this.mCacheProjectionMatrix === null) {
            this.mCacheProjectionMatrix = this.createMatrix();
        }

        return this.mCacheProjectionMatrix;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mAngleOfView = 0;
        this.mNearPlane = 0;
        this.mFarPlane = 0;
        this.mAspectRatio = 0;

        // Cache.
        this.mCacheProjectionMatrix = null;
    }

    /**
     * Create projection matrix.
     */
    private createMatrix(): Matrix {
        const lMatrix: Matrix = Matrix.identity(4);

        // Reset identity.
        lMatrix.data[0][0] = 0;
        lMatrix.data[1][1] = 0;
        lMatrix.data[2][2] = 0;
        lMatrix.data[3][3] = 0;

        // 1 / tan(angleAsRadian / 2)
        const lScale = 1.0 / Math.tan((this.angleOfView * Math.PI / 180) / 2);

        lMatrix.data[0][0] = lScale / this.mAspectRatio;
        lMatrix.data[1][1] = lScale;
        lMatrix.data[2][3] = -1;


        if (this.mFarPlane !== Infinity) {
            const lNearFar = 1 / (this.mNearPlane - this.mFarPlane);

            lMatrix.data[2][2] = this.mFarPlane * lNearFar;
            lMatrix.data[3][2] = this.mFarPlane * this.mNearPlane * lNearFar;
        } else {
            lMatrix.data[2][2] = -1;
            lMatrix.data[3][2] = -this.mNearPlane;
        }

        return lMatrix;
    }
}