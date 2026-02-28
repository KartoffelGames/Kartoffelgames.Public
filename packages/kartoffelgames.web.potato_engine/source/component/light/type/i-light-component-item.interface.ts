import type { Color } from '../../../component_item/color.ts';
import type { GameComponentItem } from '../../../core/component/game-component-item.ts';
import { LightComponentItemType } from "./light-component-item-type.enum.ts";

/**
 * Interface for light component items defining common properties for all light types.
 * Implemented by specific light types like PointLight, DirectionalLight, and SpotLight.
 * This allows the LightComponent to reference a generic light item while still supporting specific properties of each light type.
 */
export interface ILightComponentItem extends GameComponentItem {
    /**
     * Light color.
     */
    color: Color;

    /**
     * Light intensity multiplier.
     */
    intensity: number;

    /**
     * Light type identifier. Used to determine the specific light type and its properties.
     */
    readonly type: LightComponentItemType;
}