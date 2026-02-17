import { Serializer } from "@kartoffelgames/core-serializer";
import { GameComponentItem } from "../core/component/game-component-item.ts";

/**
 * Axis-aligned bounding box defined by minimum and maximum corner points.
 * Used to represent the spatial extent of a mesh in local space.
 */
@Serializer.serializeableClass('cd4942b0-af79-4f34-8f1a-cb892599e01e')
export class BoundingBox extends GameComponentItem{
    private mMaxX: number;
    private mMaxY: number;
    private mMaxZ: number;
    private mMinX: number;
    private mMinY: number;
    private mMinZ: number;

    /**
     * Maximum X coordinate of the bounding box.
     */
    @Serializer.property()
    public get maxX(): number {
        return this.mMaxX;
    } set maxX(pValue: number) {
        this.mMaxX = pValue;

        // Send update event to parent.
        this.update();
    }

    /**
     * Maximum Y coordinate of the bounding box.
     */
    @Serializer.property()
    public get maxY(): number {
        return this.mMaxY;
    } set maxY(pValue: number) {
        this.mMaxY = pValue;

        // Send update event to parent.
        this.update();
    }

    /**
     * Maximum Z coordinate of the bounding box.
     */
    @Serializer.property()
    public get maxZ(): number {
        return this.mMaxZ;
    } set maxZ(pValue: number) {
        this.mMaxZ = pValue;

        // Send update event to parent.
        this.update();
    }

    /**
     * Minimum X coordinate of the bounding box.
     */
    @Serializer.property()
    public get minX(): number {
        return this.mMinX;
    } set minX(pValue: number) {
        this.mMinX = pValue;

        // Send update event to parent.
        this.update();
    }

    /**
     * Minimum Y coordinate of the bounding box.
     */
    @Serializer.property()
    public get minY(): number {
        return this.mMinY;
    } set minY(pValue: number) {
        this.mMinY = pValue;

        // Send update event to parent.
        this.update();
    }

    /**
     * Minimum Z coordinate of the bounding box.
     */
    @Serializer.property()
    public get minZ(): number {
        return this.mMinZ;
    } set minZ(pValue: number) {
        this.mMinZ = pValue;

        // Send update event to parent.
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
