import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { GameComponentItem } from '../core/component/game-component-item.ts';
import { EditorPropertyNumberType } from '../editor_property/editor-property-register.ts';
import { EditorProperty } from '../editor_property/editor-property.ts';

/**
 * Component item that holds an RGBA color value.
 * Changes to any channel propagate to linked parent components.
 */
@FileSystem.fileClass('c83e4f12-9a6b-4d10-b2f7-6e8a1c3d5f90', FileSystemReferenceType.Instanced)
export class Color extends GameComponentItem {
    /**
     * System instance with default values that can be used by components to avoid creating multiple identical instances.
     * This instance is immutable and cannot be modified, as it is shared across all components that use it.
     * Modifying this instance will throw an exception to prevent unintended side effects on other components using the same instance.
     */
    public static readonly SYSTEM_INSTANCE: Color = (() => {
        // Create system instance with default values.
        const lInstance: Color = new Color();
        lInstance.mData = [1, 1, 1, 1];
        lInstance.markAsSystem();

        return lInstance;
    })();

    private mData: [number, number, number, number];

    /**
     * Alpha channel (0-1).
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get a(): number {
        return this.mData[3];
    } set a(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mData[3] = pValue;

        // Signal parent component of the change.
        this.update('Color_a');
    }

    /**
     * Blue channel (0-1).
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get b(): number {
        return this.mData[2];
    } set b(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mData[2] = pValue;

        // Signal parent component of the change.
        this.update('Color_b');
    }

    /**
     * Read-only access to the internal color data array [r, g, b, a].
     */
    public get data(): ReadonlyArray<number> {
        return this.mData;
    }

    /**
     * Green channel (0-1).
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get g(): number {
        return this.mData[1];
    } set g(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mData[1] = pValue;

        // Signal parent component of the change.
        this.update('Color_g');
    }

    /**
     * Red channel (0-1).
     */
    @EditorProperty.rangeControl(0, 1, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get r(): number {
        return this.mData[0];
    } set r(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mData[0] = pValue;

        // Signal parent component of the change.
        this.update('Color_r');
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Color');

        this.mData = [1, 1, 1, 1];
    }
}
