import type { Matrix } from '../../../math/matrix.ts';

export interface IProjection {
    aspectRatio: number;
    far: number;
    near: number;
    projectionMatrix: Matrix;
}