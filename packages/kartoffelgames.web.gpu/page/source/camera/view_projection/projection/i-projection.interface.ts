import { Matrix } from '../../math/matrix';

export interface IProjection {
    aspectRatio: number;
    far: number;
    near: number;
    projectionMatrix: Matrix;
}