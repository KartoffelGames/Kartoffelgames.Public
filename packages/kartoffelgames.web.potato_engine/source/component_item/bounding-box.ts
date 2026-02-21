import { FileSystem, FileSystemReferenceType } from '@kartoffelgames/web-file-system';
import { GameComponentItem } from '../core/component/game-component-item.ts';
import { EditorPropertyNumberType } from '../editor_property/editor-property-register.ts';
import { EditorProperty } from '../editor_property/editor-property.ts';

/**
 * Axis-aligned bounding box defined by minimum and maximum corner points.
 * Used to represent the spatial extent of a mesh in local space.
 */
@FileSystem.fileClass('cd4942b0-af79-4f34-8f1a-cb892599e01e', FileSystemReferenceType.Instanced)
export class BoundingBox extends GameComponentItem{
    /**
     * System instance with default values that can be used by components to avoid creating multiple identical instances.
     * This instance is immutable and cannot be modified, as it is shared across all components that use it.
     * Modifying this instance will throw an exception to prevent unintended side effects on other components using the same instance.
     */
    public static readonly SYSTEM_INSTANCE: BoundingBox = (() => {
        // Create system instance with default values.
        const lInstance: BoundingBox = new BoundingBox();
        lInstance.mMinX = 0;
        lInstance.mMinY = 0;
        lInstance.mMinZ = 0;
        lInstance.mMaxX = 1;
        lInstance.mMaxY = 1;
        lInstance.mMaxZ = 1;
        lInstance.markAsSystem();

        return lInstance;
    })();


    private mMaxX: number;
    private mMaxY: number;
    private mMaxZ: number;
    private mMinX: number;
    private mMinY: number;
    private mMinZ: number;

    /**
     * Maximum X coordinate of the bounding box.
     */
    @EditorProperty.rangeControl(-10, 10, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get maxX(): number {
        return this.mMaxX;
    } set maxX(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mMaxX = pValue;
        this.update();
    }

    /**
     * Maximum Y coordinate of the bounding box.
     */
    @EditorProperty.rangeControl(-10, 10, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get maxY(): number {
        return this.mMaxY;
    } set maxY(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mMaxY = pValue;
        this.update();
    }

    /**
     * Maximum Z coordinate of the bounding box.
     */
    @EditorProperty.rangeControl(-10, 10, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get maxZ(): number {
        return this.mMaxZ;
    } set maxZ(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mMaxZ = pValue;
        this.update();
    }

    /**
     * Minimum X coordinate of the bounding box.
     */
    @EditorProperty.rangeControl(-10, 10, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get minX(): number {
        return this.mMinX;
    } set minX(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mMinX = pValue;
        this.update();
    }

    /**
     * Minimum Y coordinate of the bounding box.
     */
    @EditorProperty.rangeControl(-10, 10, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get minY(): number {
        return this.mMinY;
    } set minY(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mMinY = pValue;
        this.update();
    }

    /**
     * Minimum Z coordinate of the bounding box.
     */
    @EditorProperty.rangeControl(-10, 10, EditorPropertyNumberType.Float)
    @FileSystem.fileProperty()
    public get minZ(): number {
        return this.mMinZ;
    } set minZ(pValue: number) {
        // Gate access on system items.
        this.systemgate();

        // Set new value and update.
        this.mMinZ = pValue;
        this.update();
    }

    /**
     * Constructor.
     * Creates a bounding box with all dimensions initialized to zero.
     */
    public constructor() {
        super('Bounding box');

        this.mMinX = 0;
        this.mMinY = 0;
        this.mMinZ = 0;
        this.mMaxX = 0;
        this.mMaxY = 0;
        this.mMaxZ = 0;
    }
}
