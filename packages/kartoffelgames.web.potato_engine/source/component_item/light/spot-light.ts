import { Serializer } from '@kartoffelgames/core-serializer';
import { GameComponentItem } from '../../core/component/game-component-item.ts';
import { Color } from '../color.ts';
import type { ILightComponentItem } from './i-light-component-item.interface.ts';

/**
 * Spot light that emits a cone of light from a single point in a direction.
 * Direction is derived from the entity's TransformationComponent.
 * The cone is defined by an inner angle (full intensity) and an outer angle (fading edge).
 */
@Serializer.serializeableClass('f3c4d5e6-a7b8-9012-cdef-123456789012')
export class SpotLight extends GameComponentItem implements ILightComponentItem {
    private mColor: Color;
    private mDropOff: number;
    private mInnerAngle: number;
    private mIntensity: number;
    private mOuterAngle: number;
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
     * Drop-off factor controlling the intensity falloff curve over distance.
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
     * Inner cone angle in degrees where full intensity is emitted.
     */
    @Serializer.property()
    public get innerAngle(): number {
        return this.mInnerAngle;
    } set innerAngle(pValue: number) {
        this.mInnerAngle = pValue;
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
     * Outer cone angle in degrees where light fades to zero.
     */
    @Serializer.property()
    public get outerAngle(): number {
        return this.mOuterAngle;
    } set outerAngle(pValue: number) {
        this.mOuterAngle = pValue;
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
     * Constructor. Defaults to white light, intensity 1, range 10, 30/45 degree cone, linear dropOff.
     */
    public constructor() {
        super('Spot light');

        this.mColor = new Color();
        this.mColor.linkParent(this);
        this.mIntensity = 1;
        this.mRange = 10;
        this.mDropOff = 1;
        this.mInnerAngle = 30;
        this.mOuterAngle = 45;
    }
}
