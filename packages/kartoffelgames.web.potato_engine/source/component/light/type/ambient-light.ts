import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { Color } from '../../../component_item/color.ts';
import { GameComponentItem } from '../../../core/component/game-component-item.ts';
import { EditorPropertyNumberType } from '../../../editor_property/editor-property-register.ts';
import { EditorProperty } from '../../../editor_property/editor-property.ts';
import type { ILightComponentItem } from './i-light-component-item.interface.ts';
import { LightComponentItemType } from './light-component-item-type.enum.ts';

/**
 * Ambient light that illuminates all objects equally from all directions.
 * Intensity falls off based on distance and the dropOff curve.
 */
@FileSystem.fileClass('660dadc7-bd50-46ea-b755-639b3d3c5759', FileSystemReferenceType.Instanced)
export class AmbientLight extends GameComponentItem implements ILightComponentItem {
    /**
     * System instance with default values that can be used by components to avoid creating multiple identical instances.
     * This instance is immutable and cannot be modified, as it is shared across all components that use it.
     * Modifying this instance will throw an exception to prevent unintended side effects on other components using the same instance.
     */
    public static readonly SYSTEM_INSTANCE: AmbientLight = (() => {
        // Create system instance with default values.
        const lInstance: AmbientLight = new AmbientLight();
        lInstance.mIntensity = 1;
        lInstance.mRange = 0;
        lInstance.mDropOff = 0;
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
    @FileSystem.fileProperty()
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

        // Signal parent component of the change.
        this.update('AmbientLight_color');
    }

    /**
     * Drop-off factor controlling the intensity falloff curve.
     * 0 = full intensity across entire range.
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get dropOff(): number {
        return this.mDropOff;
    } set dropOff(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mDropOff = pValue;

        // Signal parent component of the change.
        this.update('AmbientLight_dropOff');
    }

    /**
     * Light intensity multiplier.
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get intensity(): number {
        return this.mIntensity;
    } set intensity(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mIntensity = pValue;

        // Signal parent component of the change.
        this.update('AmbientLight_intensity');
    }

    /**
     * Maximum distance the light reaches.
     */
    @EditorProperty.rangeControl(0, 100, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get range(): number {
        return this.mRange;
    } set range(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mRange = pValue;

        // Signal parent component of the change.
        this.update('AmbientLight_range');
    }

    /**
     * Light type identifier.
     */
    public get type(): LightComponentItemType {
        return LightComponentItemType.Ambient;
    }

    /**
     * Constructor. Defaults to white light, intensity 1, no range restriction.
     */
    public constructor() {
        super('Ambient light');

        // Link system color instance to avoid creating multiple identical instances.
        this.mColor = Color.SYSTEM_INSTANCE;
        this.mColor.linkParent(this);

        // Setup default values.
        this.mIntensity = 1;
        this.mRange = 0;
        this.mDropOff = 0;
    }
}
