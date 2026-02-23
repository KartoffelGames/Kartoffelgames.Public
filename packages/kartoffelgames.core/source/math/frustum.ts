import type { Matrix } from './matrix.ts';

/**
 * Represents a view frustum defined by 6 clipping planes.
 * Used for frustum culling to determine visibility of objects in a scene.
 *
 * Planes are extracted from a view-projection matrix using the Gribb-Hartmann method,
 * adapted for WebGPU's clip space where Z ranges from 0 to 1.
 *
 * Each plane is stored in the form: normalX * x + normalY * y + normalZ * z + distance >= 0,
 * where (normalX, normalY, normalZ) is the unit-length plane normal and distance is the
 * signed offset from the origin along the normal.
 */
export class Frustum {
    private readonly mPlanes: Array<FrustumPlane>;

    /**
     * Constructor.
     * Creates a frustum with all plane coefficients initialized to zero.
     */
    public constructor() {
        // Its a mirracle that this works by creating a Arraylike with only a length property.
        this.mPlanes = Array.from({ length: 6 }, () => {
            return { normalX: 0, normalY: 0, normalZ: 0, distance: 0 };
        });
    }

    /**
     * Test if an axis-aligned bounding box intersects or is inside the frustum.
     * Uses the positive vertex (p-vertex) approach for each plane: if the corner of the AABB
     * closest to the plane's positive half-space is outside the plane, the entire AABB is outside.
     *
     * The AABB coordinates must be in the same coordinate space as the view-projection matrix
     * used to update the frustum (typically world space).
     *
     * @param pMinX - Minimum X coordinate of the AABB.
     * @param pMinY - Minimum Y coordinate of the AABB.
     * @param pMinZ - Minimum Z coordinate of the AABB.
     * @param pMaxX - Maximum X coordinate of the AABB.
     * @param pMaxY - Maximum Y coordinate of the AABB.
     * @param pMaxZ - Maximum Z coordinate of the AABB.
     *
     * @returns True if the AABB intersects or is inside the frustum.
     */
    public intersectsBoundingBox(pMinX: number, pMinY: number, pMinZ: number, pMaxX: number, pMaxY: number, pMaxZ: number): boolean {
        for (const lPlane of this.mPlanes) {
            // Select the positive vertex: the corner of the AABB most aligned with the plane normal.
            const lPositiveVertexX: number = lPlane.normalX >= 0 ? pMaxX : pMinX;
            const lPositiveVertexY: number = lPlane.normalY >= 0 ? pMaxY : pMinY;
            const lPositiveVertexZ: number = lPlane.normalZ >= 0 ? pMaxZ : pMinZ;

            // If the positive vertex is on the negative side of this plane, the entire AABB is outside.
            if (lPlane.normalX * lPositiveVertexX + lPlane.normalY * lPositiveVertexY + lPlane.normalZ * lPositiveVertexZ + lPlane.distance < 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Update frustum planes from a view-projection matrix.
     * Uses the Gribb-Hartmann plane extraction method adapted for WebGPU clip space (Z in [0, 1]).
     *
     * The 6 planes are derived from the inequalities that define the visible volume:
     * - Left/Right:   -clip.w <= clip.x <= clip.w
     * - Bottom/Top:   -clip.w <= clip.y <= clip.w
     * - Near/Far:     0 <= clip.z <= clip.w
     *
     * @param pViewProjectionMatrix - Combined view-projection matrix (projection * view).
     */
    public update(pViewProjectionMatrix: Matrix): void {
        // Left plane: clip.x + clip.w >= 0  →  row3 + row0
        this.setPlane(FrustumPlanes.Left,
            pViewProjectionMatrix.get(3, 0) + pViewProjectionMatrix.get(0, 0),
            pViewProjectionMatrix.get(3, 1) + pViewProjectionMatrix.get(0, 1),
            pViewProjectionMatrix.get(3, 2) + pViewProjectionMatrix.get(0, 2),
            pViewProjectionMatrix.get(3, 3) + pViewProjectionMatrix.get(0, 3)
        );

        // Right plane: clip.w - clip.x >= 0  →  row3 - row0
        this.setPlane(FrustumPlanes.Right,
            pViewProjectionMatrix.get(3, 0) - pViewProjectionMatrix.get(0, 0),
            pViewProjectionMatrix.get(3, 1) - pViewProjectionMatrix.get(0, 1),
            pViewProjectionMatrix.get(3, 2) - pViewProjectionMatrix.get(0, 2),
            pViewProjectionMatrix.get(3, 3) - pViewProjectionMatrix.get(0, 3)
        );

        // Bottom plane: clip.y + clip.w >= 0  →  row3 + row1
        this.setPlane(FrustumPlanes.Bottom,
            pViewProjectionMatrix.get(3, 0) + pViewProjectionMatrix.get(1, 0),
            pViewProjectionMatrix.get(3, 1) + pViewProjectionMatrix.get(1, 1),
            pViewProjectionMatrix.get(3, 2) + pViewProjectionMatrix.get(1, 2),
            pViewProjectionMatrix.get(3, 3) + pViewProjectionMatrix.get(1, 3)
        );

        // Top plane: clip.w - clip.y >= 0  →  row3 - row1
        this.setPlane(FrustumPlanes.Top,
            pViewProjectionMatrix.get(3, 0) - pViewProjectionMatrix.get(1, 0),
            pViewProjectionMatrix.get(3, 1) - pViewProjectionMatrix.get(1, 1),
            pViewProjectionMatrix.get(3, 2) - pViewProjectionMatrix.get(1, 2),
            pViewProjectionMatrix.get(3, 3) - pViewProjectionMatrix.get(1, 3)
        );

        // Near plane: clip.z >= 0  →  row2 (WebGPU Z range starts at 0, not -1)
        this.setPlane(FrustumPlanes.Near,
            pViewProjectionMatrix.get(2, 0),
            pViewProjectionMatrix.get(2, 1),
            pViewProjectionMatrix.get(2, 2),
            pViewProjectionMatrix.get(2, 3)
        );

        // Far plane: clip.w - clip.z >= 0  →  row3 - row2
        this.setPlane(FrustumPlanes.Far,
            pViewProjectionMatrix.get(3, 0) - pViewProjectionMatrix.get(2, 0),
            pViewProjectionMatrix.get(3, 1) - pViewProjectionMatrix.get(2, 1),
            pViewProjectionMatrix.get(3, 2) - pViewProjectionMatrix.get(2, 2),
            pViewProjectionMatrix.get(3, 3) - pViewProjectionMatrix.get(2, 3)
        );
    }

    /**
     * Set a frustum plane's coefficients and normalize the plane equation.
     * Normalizing divides all coefficients by the length of the normal vector,
     * ensuring the normal has unit length. This makes the distance test produce correct signed distances.
     *
     * @param pPlane - Target frustum plane to set.
     * @param pNormalX - Unnormalized plane normal X component.
     * @param pNormalY - Unnormalized plane normal Y component.
     * @param pNormalZ - Unnormalized plane normal Z component.
     * @param pDistance - Unnormalized signed distance from the origin.
     */
    private setPlane(pPlane: FrustumPlanes, pNormalX: number, pNormalY: number, pNormalZ: number, pDistance: number): void {
        const lLength: number = Math.sqrt(pNormalX * pNormalX + pNormalY * pNormalY + pNormalZ * pNormalZ);

        const lPlane: FrustumPlane = this.mPlanes[pPlane];
        lPlane.normalX = pNormalX / lLength;
        lPlane.normalY = pNormalY / lLength;
        lPlane.normalZ = pNormalZ / lLength;
        lPlane.distance = pDistance / lLength;
    }
}

export enum FrustumPlanes {
    Left = 0,
    Right = 1,
    Bottom = 2,
    Top = 3,
    Near = 4,
    Far = 5
}

/**
 * A single plane of the frustum in the form: normalX * x + normalY * y + normalZ * z + distance >= 0.
 * The normal vector (normalX, normalY, normalZ) has unit length after normalization.
 */
type FrustumPlane = {
    normalX: number;
    normalY: number;
    normalZ: number;
    distance: number;
};
