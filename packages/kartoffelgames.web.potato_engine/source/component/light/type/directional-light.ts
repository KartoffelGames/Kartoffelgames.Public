import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { Color } from '../../../component_item/color.ts';
import { GameComponentItem } from '../../../core/component/game-component-item.ts';
import { EditorPropertyNumberType } from '../../../editor_property/editor-property-register.ts';
import { EditorProperty } from '../../../editor_property/editor-property.ts';
import type { ILightComponentItem } from './i-light-component-item.interface.ts';
import { LightComponentItemType } from './light-component-item-type.enum.ts';

/**
 * Directional light that emits parallel rays in a single direction.
 * Direction is derived from the entity's TransformationComponent.
 */
@FileSystem.fileClass('e2b3c4d5-f6a7-8901-bcde-f12345678901', FileSystemReferenceType.Instanced)
export class DirectionalLight extends GameComponentItem implements ILightComponentItem {
    /**
     * System instance with default values that can be used by components to avoid creating multiple identical instances.
     * This instance is immutable and cannot be modified, as it is shared across all components that use it.
     * Modifying this instance will throw an exception to prevent unintended side effects on other components using the same instance.
     */
    public static readonly SYSTEM_INSTANCE: DirectionalLight = (() => {
        // Create system instance with default values.
        const lInstance: DirectionalLight = new DirectionalLight();
        lInstance.mIntensity = 1;
        lInstance.markAsSystem();

        return lInstance;
    })();

    private mColor: Color;
    private mIntensity: number;

    /**
     * Light color.
     */
    @EditorProperty.objectControl()
    @FileSystem.fileProperty()
    public get color(): Color {
        if(this.mColor.isSystem) {
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
        this.mColor.unlinkParent(this);
        this.mColor = pValue;
        this.mColor.linkParent(this);

        // Signal parent component of the change.
        this.update('DirectionalLight_color');
    }

    /**
     * Light intensity multiplier.
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get intensity(): number {
        return this.mIntensity;
    } set intensity(pValue: number) {
        this.mIntensity = pValue;

        // Signal parent component of the change.
        this.update('DirectionalLight_intensity');
    }

    /**
     * Light type identifier.
     */
    public get type(): LightComponentItemType {
        return LightComponentItemType.Directional;
    }

    /**
     * Constructor. Defaults to white light, intensity 1.
     */
    public constructor() {
        super('Directional light');

        // Link system color instance to avoid creating multiple identical instances.
        this.mColor = Color.SYSTEM_INSTANCE;
        this.mColor.linkParent(this);

        // Setup default values.
        this.mIntensity = 1;
    }
}
