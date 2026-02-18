import { Serializer } from '@kartoffelgames/core-serializer';
import { GameComponent } from '../core/component/game-component.ts';
import type { GameComponentConstructor } from '../core/component/game-component.ts';
import { Color } from '../component_item/color.ts';
import { TransformationComponent } from './transformation-component.ts';

/**
 * Light types supported by the light component.
 */
export enum LightType {
    Point = 0,
    Directional = 1
}

/**
 * Component that holds light source properties.
 * Requires a TransformationComponent for positioning in the scene.
 */
@Serializer.serializeableClass('f47ac10b-58cc-4372-a567-0e02b2c3d479')
export class LightComponent extends GameComponent {
    private mColor: Color;
    private mIntensity: number;
    private mLightType: LightType;

    /**
     * Light color.
     */
    @Serializer.property()
    public get color(): Color {
        return this.mColor;
    } set color(pValue: Color) {
        // Unlink from previous color.
        this.mColor.unlinkParent(this);

        // Save and link to new color.
        this.mColor = pValue;
        this.mColor.linkParent(this);

        this.update();
    }

    /**
     * Gets the component types that this component depends on.
     */
    public override get dependencies(): Array<GameComponentConstructor> {
        return [TransformationComponent];
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
     * Light type.
     */
    @Serializer.property()
    public get lightType(): LightType {
        return this.mLightType;
    } set lightType(pValue: LightType) {
        this.mLightType = pValue;
        this.update();
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Light');

        this.mColor = new Color();
        this.mColor.linkParent(this);
        this.mIntensity = 1;
        this.mLightType = LightType.Point;
    }
}
