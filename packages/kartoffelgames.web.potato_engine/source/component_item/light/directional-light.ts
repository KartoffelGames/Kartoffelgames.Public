import { Serializer } from '@kartoffelgames/core-serializer';
import { GameComponentItem } from '../../core/component/game-component-item.ts';
import { Color } from '../color.ts';
import type { ILightComponentItem } from './i-light-component-item.interface.ts';

/**
 * Directional light that emits parallel rays in a single direction.
 * Direction is derived from the entity's TransformationComponent.
 */
@Serializer.serializeableClass('e2b3c4d5-f6a7-8901-bcde-f12345678901')
export class DirectionalLight extends GameComponentItem implements ILightComponentItem {
    private mColor: Color;
    private mIntensity: number;

    /**
     * Light color.
     */
    @Serializer.property()
    public get color(): Color {
        return this.mColor;
    } set color(pValue: Color) {
        this.mColor.unlinkParent(this);
        this.mColor = pValue;
        this.mColor.linkParent(this);
        this.update();
    }

    /**
     * Light intensity multiplier.
     */
    @Serializer.property()
    public get intensity(): number {
        return this.mIntensity;
    } set intensity(pValue: number) {
        this.mIntensity = pValue;
        this.update();
    }

    /**
     * Constructor. Defaults to white light, intensity 1.
     */
    public constructor() {
        super('Directional light');

        this.mColor = new Color();
        this.mColor.linkParent(this);
        this.mIntensity = 1;
    }
}
