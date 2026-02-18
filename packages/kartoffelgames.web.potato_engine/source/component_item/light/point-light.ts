import { Serializer } from '@kartoffelgames/core-serializer';
import { GameComponentItem } from '../../core/component/game-component-item.ts';
import { Color } from '../color.ts';
import type { ILightComponentItem } from './i-light-component-item.interface.ts';

/**
 * Point light that emits light in all directions from a single point.
 * Intensity falls off based on distance and the dropOff curve.
 */
@Serializer.serializeableClass('d1a2b3c4-e5f6-7890-abcd-ef1234567890')
export class PointLight extends GameComponentItem implements ILightComponentItem {
    private mColor: Color;
    private mDropOff: number;
    private mIntensity: number;
    private mRange: number;

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
     * Drop-off factor controlling the intensity falloff curve.
     * 0 = full intensity across entire range, 1 = linear falloff.
     */
    @Serializer.property()
    public get dropOff(): number {
        return this.mDropOff;
    } set dropOff(pValue: number) {
        this.mDropOff = pValue;
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
     * Maximum distance the light reaches.
     */
    @Serializer.property()
    public get range(): number {
        return this.mRange;
    } set range(pValue: number) {
        this.mRange = pValue;
        this.update();
    }

    /**
     * Constructor. Defaults to white light, intensity 1, range 10, linear dropOff.
     */
    public constructor() {
        super('Point light');

        this.mColor = new Color();
        this.mColor.linkParent(this);
        this.mIntensity = 1;
        this.mRange = 10;
        this.mDropOff = 1;
    }
}
