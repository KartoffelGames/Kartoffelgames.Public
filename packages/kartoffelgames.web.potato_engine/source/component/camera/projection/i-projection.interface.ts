
import type { Matrix } from '@kartoffelgames/core';
import type { GameComponentItem } from '../../../core/component/game-component-item.ts';

/**
 * Interface for camera projection implementations.
 * Defines the properties and methods required for a camera projection, such as aspect ratio, near and far planes, and the projection matrix.
 * Implementations of this interface can represent different types of projections, such as perspective or orthographic.
 */
export interface IProjection extends GameComponentItem {
    aspectRatio: number;
    far: number;
    near: number;
    projectionMatrix: Matrix;
}