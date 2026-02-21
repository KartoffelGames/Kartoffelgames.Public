import { Serializer } from '@kartoffelgames/core-serializer';
import { Color } from '../../../component_item/color.ts';
import { GameComponentItem } from '../../../core/component/game-component-item.ts';
import { EditorPropertyNumberType } from '../../../editor_property/editor-property-register.ts';
import { EditorProperty } from '../../../editor_property/editor-property.ts';
import type { ILightComponentItem } from './i-light-component-item.interface.ts';

/**
 * Point light that emits light in all directions from a single point.
 * Intensity falls off based on distance and the dropOff curve.
 */
@Serializer.serializeableClass('d1a2b3c4-e5f6-7890-abcd-ef1234567890')
export class PointLight extends GameComponentItem implements ILightComponentItem {
    /**
     * System instance with default values that can be used by components to avoid creating multiple identical instances.
     * This instance is immutable and cannot be modified, as it is shared across all components that use it.
     * Modifying this instance will throw an exception to prevent unintended side effects on other components using the same instance.
     */
    public static readonly SYSTEM_INSTANCE: PointLight = (() => {
        // Create system instance with default values.
        const lInstance: PointLight = new PointLight();
        lInstance.mIntensity = 1;
        lInstance.mRange = 10;
        lInstance.mDropOff = 1;
        lInstance.markAsSystem();

        return lInstance;
    })();

    private mColor: Color;
    private mDropOff: number;
    private mIntensity: number;
    private mRange: number;

    /**
     * Light color.
     */
    @EditorProperty.objectControl()
    @Serializer.property()
    public get color(): Color {
        if (this.mColor.isSystem) {
            // Copy color to allow modifications without affecting other components using the same system instance.
            const lNewColor = new Color();
            lNewColor.a = this.mColor.a;
            lNewColor.b = this.mColor.b;
            lNewColor.g = this.mColor.g;
            lNewColor.r = this.mColor.r;

            // Set color with accessor to link it to this component and trigger updates.
            this.color = lNewColor;
        }

        return this.mColor;
    } set color(pValue: Color) {
        // Gate access on system items.
        this.systemgate();

        // Unlink previous color.
        this.mColor.unlinkParent(this);

        // Save and link new color.
        this.mColor = pValue;
        this.mColor.linkParent(this);

        this.update();
    }

    /**
     * Drop-off factor controlling the intensity falloff curve.
     * 0 = full intensity across entire range, 1 = linear falloff.
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @Serializer.property()
    public get dropOff(): number {
        return this.mDropOff;
    } set dropOff(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mDropOff = pValue;
        this.update();
    }

    /**
     * Light intensity multiplier.
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @Serializer.property()
    public get intensity(): number {
        return this.mIntensity;
    } set intensity(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mIntensity = pValue;
        this.update();
    }

    /**
     * Maximum distance the light reaches.
     */
    @EditorProperty.rangeControl(0, 100, EditorPropertyNumberType.Float)
    @Serializer.property()
    public get range(): number {
        return this.mRange;
    } set range(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mRange = pValue;
        this.update();
    }

    /**
     * Constructor. Defaults to white light, intensity 1, range 10, linear dropOff.
     */
    public constructor() {
        super('Point light');

        // Link system color instance to avoid creating multiple identical instances.
        this.mColor = Color.SYSTEM_INSTANCE;
        this.mColor.linkParent(this);

        // Setup default values.
        this.mIntensity = 1;
        this.mRange = 10;
        this.mDropOff = 1;
    }
}
