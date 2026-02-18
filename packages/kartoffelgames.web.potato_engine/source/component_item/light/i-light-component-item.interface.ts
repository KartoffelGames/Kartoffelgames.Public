import type { Color } from '../color.ts';
import type { GameComponentItem } from '../../core/component/game-component-item.ts';

export interface ILightComponentItem extends GameComponentItem {
    color: Color;
    intensity: number;
}
