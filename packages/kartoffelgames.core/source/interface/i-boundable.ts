/**
 * Boundable type. Provides axis-aligned bounding box bounds in 3D space.
 *
 * @public
 */
export interface IBoundable {
    /**
     * Minimum X coordinate of the bounding box.
     */
    readonly minX: number;

    /**
     * Minimum Y coordinate of the bounding box.
     */
    readonly minY: number;

    /**
     * Minimum Z coordinate of the bounding box.
     */
    readonly minZ: number;

    /**
     * Maximum X coordinate of the bounding box.
     */
    readonly maxX: number;

    /**
     * Maximum Y coordinate of the bounding box.
     */
    readonly maxY: number;

    /**
     * Maximum Z coordinate of the bounding box.
     */
    readonly maxZ: number;
}
