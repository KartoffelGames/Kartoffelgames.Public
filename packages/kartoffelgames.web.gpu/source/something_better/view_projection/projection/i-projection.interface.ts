import { Matrix } from 'packages/kartoffelgames.web.gpu/source/math/matrix';

export interface IProjection {
    aspectRatio: number;
    far: number;
    near: number;
    projectionMatrix: Matrix;
}