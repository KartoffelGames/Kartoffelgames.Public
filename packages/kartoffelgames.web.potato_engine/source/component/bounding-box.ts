/**
 * Axis-aligned bounding box defined by minimum and maximum corner points.
 * Used to represent the spatial extent of a mesh in local space.
 */
export class BoundingBox {
    private mMaxX: number;
    private mMaxY: number;
    private mMaxZ: number;
    private mMinX: number;
    private mMinY: number;
    private mMinZ: number;

    /**
     * Maximum X coordinate of the bounding box.
     */
    public get maxX(): number {
        return this.mMaxX;
    } set maxX(pValue: number) {
        this.mMaxX = pValue;
    }

    /**
     * Maximum Y coordinate of the bounding box.
     */
    public get maxY(): number {
        return this.mMaxY;
    } set maxY(pValue: number) {
        this.mMaxY = pValue;
    }

    /**
     * Maximum Z coordinate of the bounding box.
     */
    public get maxZ(): number {
        return this.mMaxZ;
    } set maxZ(pValue: number) {
        this.mMaxZ = pValue;
    }

    /**
     * Minimum X coordinate of the bounding box.
     */
    public get minX(): number {
        return this.mMinX;
    } set minX(pValue: number) {
        this.mMinX = pValue;
    }

    /**
     * Minimum Y coordinate of the bounding box.
     */
    public get minY(): number {
        return this.mMinY;
    } set minY(pValue: number) {
        this.mMinY = pValue;
    }

    /**
     * Minimum Z coordinate of the bounding box.
     */
    public get minZ(): number {
        return this.mMinZ;
    } set minZ(pValue: number) {
        this.mMinZ = pValue;
    }

    /**
     * Constructor.
     * Creates a bounding box with all dimensions initialized to zero.
     */
    public constructor() {
        this.mMinX = 0;
        this.mMinY = 0;
        this.mMinZ = 0;
        this.mMaxX = 0;
        this.mMaxY = 0;
        this.mMaxZ = 0;
    }
}
