import { Serializer } from '@kartoffelgames/core-serializer';
import { GameComponentItem } from '../core/component/game-component-item.ts';
import { EditorPropertyNumberType } from "../editor_property/editor-property-register.ts";
import { EditorProperty } from "../editor_property/editor-property.ts";

/**
 * Component item that holds an RGBA color value.
 * Changes to any channel propagate to linked parent components.
 */
@Serializer.serializeableClass('c83e4f12-9a6b-4d10-b2f7-6e8a1c3d5f90')
export class Color extends GameComponentItem {
    /**
     * System instance with default values that can be used by components to avoid creating multiple identical instances.
     * This instance is immutable and cannot be modified, as it is shared across all components that use it.
     * Modifying this instance will throw an exception to prevent unintended side effects on other components using the same instance.
     */
    public static systemInstance: Color = (() => {
        // Create system instance with default values.
        const lInstance: Color = new Color();
        lInstance.mR = 1;
        lInstance.mG = 1;
        lInstance.mB = 1;
        lInstance.mA = 1;
        lInstance.markAsSystem();

        return lInstance;
    })();

    private mA: number;
    private mB: number;
    private mG: number;
    private mR: number;

    /**
     * Alpha channel (0-1).
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @Serializer.property()
    public get a(): number {
        return this.mA;
    } set a(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mA = pValue;
        this.update();
    }

    /**
     * Blue channel (0-1).
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @Serializer.property()
    public get b(): number {
        return this.mB;
    } set b(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mB = pValue;
        this.update();
    }

    /**
     * Green channel (0-1).
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @Serializer.property()
    public get g(): number {
        return this.mG;
    } set g(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mG = pValue;
        this.update();
    }

    /**
     * Red channel (0-1).
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @Serializer.property()
    public get r(): number {
        return this.mR;
    } set r(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mR = pValue;
        this.update();
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Color');

        this.mR = 1;
        this.mG = 1;
        this.mB = 1;
        this.mA = 1;
    }
}
