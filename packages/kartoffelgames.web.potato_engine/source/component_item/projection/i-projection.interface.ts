
import type { GameComponentItem } from "../../core/component/game-component-item.ts";
import type { Matrix } from "../../math/matrix.ts";

export interface IProjection extends GameComponentItem {
    aspectRatio: number;
    far: number;
    near: number;
    projectionMatrix: Matrix;
}