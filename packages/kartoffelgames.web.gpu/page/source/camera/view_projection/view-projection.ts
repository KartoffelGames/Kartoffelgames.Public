import { Matrix } from '../math/matrix.ts';
import { Transform, TransformMatrix } from '../transform.ts';
import { IProjection } from './projection/i-projection.interface.ts';

export class ViewProjection {
    private readonly mProjection: IProjection;
    private readonly mTransformation: Transform;

    /**
     * Camera projection.
     */
    public get projection(): IProjection {
        return this.mProjection;
    }

    /**
     * Camera transformation.
     */
    public get transformation(): Transform {
        return this.mTransformation;
    }

    /**
     * Constructor.
     */
    public constructor(pProjection: IProjection) {
        this.mProjection = pProjection;
        this.mTransformation = new Transform();
    }

    /**
     * Get camera matrix. 
     * @param pType - Matrix type. 
     */
    public getMatrix(pType: CameraMatrix): Matrix {
        switch (pType) {
            case CameraMatrix.Translation: {
                return this.mTransformation.getMatrix(TransformMatrix.Translation);
            }
            case CameraMatrix.Rotation: {
                return this.mTransformation.getMatrix(TransformMatrix.Rotation);
            }
            case CameraMatrix.PivotRotation: {
                return this.mTransformation.getMatrix(TransformMatrix.PivotRotation);
            }
            case CameraMatrix.Projection: {
                return this.mProjection.projectionMatrix;
            }
            case CameraMatrix.View: {
                const lTranslation: Matrix = this.getMatrix(CameraMatrix.Translation);
                const lRotation: Matrix = this.getMatrix(CameraMatrix.Rotation);
                return lTranslation.mult(lRotation).inverse();
            }
            case CameraMatrix.ViewProjection: {
                const lView: Matrix = this.getMatrix(CameraMatrix.View);
                const lProjection: Matrix = this.getMatrix(CameraMatrix.Projection);
                return lProjection.mult(lView);
            }
        }
    }

}

export enum CameraMatrix {
    Translation = 1,
    Rotation = 2,
    PivotRotation = 3,
    Projection = 4,
    View = 5,
    ViewProjection = 6
}