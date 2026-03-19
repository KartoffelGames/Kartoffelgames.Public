import { Exception } from '../../exception/exception.ts';
import type { IBoundable } from '../../interface/i-boundable.ts';

/**
 * Online linearized bounding volume hierarchy for 3D axis-aligned bounding boxes.
 * Stores all node data in two flat typed arrays for cache-friendly access.
 * Supports incremental insert, remove, and update operations with automatic
 * quality tracking and optional full rebuild.
 *
 * The AABB buffer is a {@link Float32Array} with 6 floats per node
 * (minX, minY, minZ, maxX, maxY, maxZ).
 * The topology buffer is an {@link Int32Array} with 4 integers per node
 * (leftChild, rightChild, parentIndex, objectIndex).
 *
 * Internal nodes have leftChild >= 0, rightChild >= 0 and objectIndex == -1.
 * Leaf nodes have leftChild == -1, rightChild == -1 and objectIndex >= 0.
 * The root node has parentIndex == -1.
 *
 * Buffer references may change when the tree grows beyond its current capacity.
 * External code holding references to the buffers must re-read the properties
 * after operations that insert new objects.
 *
 * @typeParam T - Type of objects stored in the hierarchy.
 *
 * @public
 */
export class LinearBoundVolumeHierarchy<T> {
    // AABB buffer offsets. Six floats per node: minX, minY, minZ, maxX, maxY, maxZ.
    private static readonly AABB_MAX_X_OFFSET: number = 3;
    private static readonly AABB_MAX_Y_OFFSET: number = 4;
    private static readonly AABB_MAX_Z_OFFSET: number = 5;
    private static readonly AABB_MIN_X_OFFSET: number = 0;
    private static readonly AABB_MIN_Y_OFFSET: number = 1;
    private static readonly AABB_MIN_Z_OFFSET: number = 2;
    private static readonly AABB_STRIDE: number = 6;

    // Default configuration values.
    private static readonly DEFAULT_CAPACITY: number = 64;
    private static readonly DEFAULT_REBUILD_THRESHOLD: number = 2.0;

    // Sentinel value for absent node or object references.
    private static readonly OBJECT_NULL_INDEX: number = -1;

    // Topology buffer offsets. Four integers per node: leftChild, rightChild, parentIndex, objectIndex.
    private static readonly TOPOLOGY_LEFT_CHILD_OFFSET: number = 0;
    private static readonly TOPOLOGY_OBJECT_INDEX_OFFSET: number = 3;
    private static readonly TOPOLOGY_PARENT_OFFSET: number = 2;
    private static readonly TOPOLOGY_RIGHT_CHILD_OFFSET: number = 1;
    private static readonly TOPOLOGY_STRIDE: number = 4;

    private mAabbBuffer: Float32Array;
    private readonly mBoundsCallback: (pObject: T) => IBoundable;
    private readonly mFreeNodeIndices: Array<number>;
    private readonly mFreeObjectIndices: Array<number>;
    private mNextFreshNodeIndex: number;
    private mNextFreshObjectIndex: number;
    private mObjectCount: number;
    private readonly mObjectToIndex: Map<T, number>;
    private readonly mObjectToLeaf: Map<T, number>;
    private mObjects: Array<T | null>;
    private mOptimalSurfaceArea: number;
    private readonly mRebuildThreshold: number;
    private mRootIndex: number;
    private mTopologyBuffer: Int32Array;
    private mTotalInternalSurfaceArea: number;

    /**
     * ArrayBuffer containing AABB data for all nodes.
     * Layout: 6 floats per node (minX, minY, minZ, maxX, maxY, maxZ).
     * Create a Float32Array view over this buffer to read individual values.
     *
     * @remarks
     * The buffer reference may change after insert operations that grow the tree
     * beyond its current capacity.
     *
     * @readonly
     */
    public get aabbBuffer(): ArrayBuffer {
        return this.mAabbBuffer.buffer as ArrayBuffer;
    }

    /**
     * Total number of allocated node slots in the buffers.
     *
     * @readonly
     */
    public get capacity(): number {
        return this.mAabbBuffer.length / LinearBoundVolumeHierarchy.AABB_STRIDE;
    }

    /**
     * Number of objects currently stored in the hierarchy.
     *
     * @readonly
     */
    public get count(): number {
        return this.mObjectCount;
    }

    /**
     * Total number of active nodes including both leaf and internal nodes.
     * A tree with N objects has N leaf nodes and max(N-1, 0) internal nodes.
     *
     * @readonly
     */
    public get nodeCount(): number {
        if (this.mObjectCount === 0) {
            return 0;
        }
        return this.mObjectCount * 2 - 1;
    }

    /**
     * Quality metric indicating tree degradation since the last rebuild.
     * Returns the ratio of current total internal node surface area to the
     * optimal surface area recorded at the last structural change.
     * A value of 1.0 indicates optimal quality. Values above 1.0 indicate
     * degradation caused by object movement without structural reorganization.
     *
     * @readonly
     */
    public get quality(): number {
        if (this.mOptimalSurfaceArea <= 0 || this.mObjectCount < 2) {
            return 1.0;
        }
        return this.mTotalInternalSurfaceArea / this.mOptimalSurfaceArea;
    }

    /**
     * Index of the root node in the buffers.
     * Returns -1 when the tree is empty.
     *
     * @readonly
     */
    public get rootIndex(): number {
        return this.mRootIndex;
    }

    /**
     * ArrayBuffer containing topology data for all nodes.
     * Layout: 4 signed 32-bit integers per node (leftChild, rightChild, parentIndex, objectIndex).
     * Create an Int32Array view over this buffer to read individual values.
     *
     * @remarks
     * The buffer reference may change after insert operations that grow the tree
     * beyond its current capacity.
     *
     * @readonly
     */
    public get topologyBuffer(): ArrayBuffer {
        return this.mTopologyBuffer.buffer as ArrayBuffer;
    }

    /**
     * Constructor.
     *
     * @param pBoundsCallback - Callback that returns an {@link IBoundable} for a given object.
     *        Called whenever the hierarchy needs the current bounding box of an object.
     * @param pRebuildThreshold - Quality ratio above which an automatic rebuild
     *        is triggered during update operations. Defaults to 2.0.
     *        Set to Infinity to disable automatic rebuilds.
     */
    public constructor(pBoundsCallback: (pObject: T) => IBoundable, pRebuildThreshold: number = LinearBoundVolumeHierarchy.DEFAULT_REBUILD_THRESHOLD) {
        this.mBoundsCallback = pBoundsCallback;
        this.mAabbBuffer = new Float32Array(LinearBoundVolumeHierarchy.DEFAULT_CAPACITY * LinearBoundVolumeHierarchy.AABB_STRIDE);
        this.mTopologyBuffer = new Int32Array(LinearBoundVolumeHierarchy.DEFAULT_CAPACITY * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE);

        this.mNextFreshNodeIndex = 0;
        this.mFreeNodeIndices = [];

        this.mObjects = [];
        this.mObjectToIndex = new Map<T, number>();
        this.mObjectToLeaf = new Map<T, number>();
        this.mNextFreshObjectIndex = 0;
        this.mFreeObjectIndices = [];
        this.mObjectCount = 0;

        this.mRootIndex = LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX;

        this.mTotalInternalSurfaceArea = 0;
        this.mOptimalSurfaceArea = 0;
        this.mRebuildThreshold = pRebuildThreshold;
    }

    /**
     * Insert an object into the hierarchy.
     * Uses SAH-guided sibling selection for near-optimal tree quality.
     *
     * @param pObject - Object to insert.
     *
     * @throws {@link Exception} when the object is already present in the hierarchy.
     */
    public insert(pObject: T): void {
        // Validate that the object is not already in the tree.
        if (this.mObjectToLeaf.has(pObject)) {
            throw new Exception('Object already exists in the BVH.', this);
        }

        // Allocate a new leaf node.
        const lLeafIndex: number = this.allocateNode();

        // Allocate a numeric object index for the topology buffer.
        const lObjectIndex: number = this.allocateObjectIndex();
        this.mObjects[lObjectIndex] = pObject;
        this.mObjectToIndex.set(pObject, lObjectIndex);

        // Write the leaf AABB from the object bounds.
        const lBounds: IBoundable = this.mBoundsCallback(pObject);
        this.writeAabb(lLeafIndex, lBounds.minX, lBounds.minY, lBounds.minZ, lBounds.maxX, lBounds.maxY, lBounds.maxZ);

        // Write leaf topology: no children, no parent, stores objectIndex.
        this.writeTopology(lLeafIndex, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX, lObjectIndex);

        // Track mapping.
        this.mObjectToLeaf.set(pObject, lLeafIndex);
        this.mObjectCount++;

        // First object becomes the root directly.
        if (this.mObjectCount === 1) {
            this.mRootIndex = lLeafIndex;
            this.mOptimalSurfaceArea = 0;
            return;
        }

        // Find best sibling using SAH-guided tree descent.
        const lSiblingIndex: number = this.findBestSibling(lLeafIndex);

        // Create a new internal parent node.
        const lNewParentIndex: number = this.allocateNode();
        const lOldParentIndex: number = this.mTopologyBuffer[lSiblingIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];

        // Wire up the new parent with sibling as left child and new leaf as right child.
        this.writeTopology(lNewParentIndex, lSiblingIndex, lLeafIndex, lOldParentIndex, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX);
        this.writeTopology(lSiblingIndex, null, null, lNewParentIndex, null);
        this.writeTopology(lLeafIndex, null, null, lNewParentIndex, null);

        // Link new parent into the tree in place of the sibling.
        if (lOldParentIndex === LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX) {
            this.mRootIndex = lNewParentIndex;
        } else {
            // Replace the sibling reference in the old parent with the new parent.
            if (this.mTopologyBuffer[lOldParentIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === lSiblingIndex) {
                this.writeTopology(lOldParentIndex, lNewParentIndex, null, null, null);
            } else {
                this.writeTopology(lOldParentIndex, null, lNewParentIndex, null, null);
            }
        }

        // Set new parent AABB as union of sibling and leaf.
        this.writeUnionAabb(lNewParentIndex, lSiblingIndex, lLeafIndex);

        // Track surface area of the new internal node.
        this.mTotalInternalSurfaceArea += this.computeSurfaceArea(lNewParentIndex);

        // Refit AABBs upward from grandparent to root.
        this.refitFrom(lOldParentIndex);

        // Update quality baseline after SAH-guided insertion.
        this.mOptimalSurfaceArea = this.mTotalInternalSurfaceArea;
    }

    /**
     * Retrieve the object associated with a given object index from the topology buffer.
     *
     * @param pObjectIndex - Numeric index as stored in the topology buffer's object index slot.
     *
     * @returns The object associated with the given index.
     *
     * @throws {@link Exception} when the object index is invalid or has no associated object.
     */
    public objectOf(pObjectIndex: number): T {
        // Validate object index range.
        if (pObjectIndex < 0 || pObjectIndex >= this.mObjects.length || this.mObjects[pObjectIndex] === null) {
            throw new Exception('Invalid object index.', this);
        }

        return this.mObjects[pObjectIndex]!;
    }

    /**
     * Force a full top-down SAH rebuild of the tree.
     * Produces a compact linearized layout and resets the quality baseline.
     * Object indices in the topology buffer are preserved.
     */
    public rebuild(): void {
        // Nothing to rebuild for 0 or 1 objects.
        if (this.mObjectCount <= 1) {
            this.mOptimalSurfaceArea = 0;
            return;
        }

        // Collect all currently stored objects.
        const lObjects: Array<T> = Array.from(this.mObjectToLeaf.keys());

        // Reset all node storage.
        this.mFreeNodeIndices.length = 0;
        this.mNextFreshNodeIndex = 0;
        this.mTotalInternalSurfaceArea = 0;
        this.mObjectToLeaf.clear();

        // Recreate leaf nodes for each object preserving their existing object indices.
        const lLeaves: Array<number> = new Array<number>(lObjects.length);
        for (let lIndex: number = 0; lIndex < lObjects.length; lIndex++) {
            const lObj: T = lObjects[lIndex];
            const lLeafIndex: number = this.allocateNode();
            lLeaves[lIndex] = lLeafIndex;

            const lObjIndex: number = this.mObjectToIndex.get(lObj)!;
            const lBounds: IBoundable = this.mBoundsCallback(lObj);
            this.writeAabb(lLeafIndex, lBounds.minX, lBounds.minY, lBounds.minZ, lBounds.maxX, lBounds.maxY, lBounds.maxZ);
            this.writeTopology(lLeafIndex, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX, lObjIndex);

            this.mObjectToLeaf.set(lObj, lLeafIndex);
        }

        // Build tree top-down using SAH centroid midpoint split.
        this.mRootIndex = this.buildTopDown(lLeaves, 0, lLeaves.length);
        this.writeTopology(this.mRootIndex, null, null, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX, null);

        // Record optimal surface area baseline.
        this.mOptimalSurfaceArea = this.mTotalInternalSurfaceArea;
    }

    /**
     * Remove a boundable object from the hierarchy.
     *
     * @param pObject - Object to remove.
     *
     * @throws {@link Exception} when the object is not present in the hierarchy.
     */
    public remove(pObject: T): void {
        // Validate that the object exists in the tree.
        if (!this.mObjectToLeaf.has(pObject)) {
            throw new Exception('Object does not exist in the BVH.', this);
        }

        const lLeafIndex: number = this.mObjectToLeaf.get(pObject)!;
        const lObjectIndex: number = this.mObjectToIndex.get(pObject)!;
        const lParentIndex: number = this.mTopologyBuffer[lLeafIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];

        // Clean up object tracking.
        this.mObjectToLeaf.delete(pObject);
        this.mObjectToIndex.delete(pObject);
        this.mObjects[lObjectIndex] = null;
        this.mFreeObjectIndices.push(lObjectIndex);
        this.mObjectCount--;

        // If the removed leaf was the root, the tree becomes empty.
        if (lParentIndex === LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX) {
            this.mRootIndex = LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX;
            this.mFreeNodeIndices.push(lLeafIndex);
            this.mTotalInternalSurfaceArea = 0;
            this.mOptimalSurfaceArea = 0;
            return;
        }

        // Find the sibling of the removed leaf by checking which child of the parent is not the leaf.
        const lParentBase: number = lParentIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE;
        let lSiblingIndex: number;
        if (this.mTopologyBuffer[lParentBase + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === lLeafIndex) {
            lSiblingIndex = this.mTopologyBuffer[lParentBase + LinearBoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];
        } else {
            lSiblingIndex = this.mTopologyBuffer[lParentBase + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];
        }

        const lGrandparentIndex: number = this.mTopologyBuffer[lParentBase + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];

        // Subtract the removed internal parent surface area from the total.
        this.mTotalInternalSurfaceArea -= this.computeSurfaceArea(lParentIndex);

        // Patch the sibling into the grandparent's slot, replacing the removed parent.
        if (lGrandparentIndex !== LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX) {
            if (this.mTopologyBuffer[lGrandparentIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === lParentIndex) {
                this.writeTopology(lGrandparentIndex, lSiblingIndex, null, null, null);
            } else {
                this.writeTopology(lGrandparentIndex, null, lSiblingIndex, null, null);
            }
            this.writeTopology(lSiblingIndex, null, null, lGrandparentIndex, null);

            // Refit AABBs from grandparent to root.
            this.refitFrom(lGrandparentIndex);
        } else {
            // Parent was the root so sibling becomes the new root.
            this.mRootIndex = lSiblingIndex;
            this.writeTopology(lSiblingIndex, null, null, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX, null);
        }

        // Free the removed leaf and parent nodes.
        this.mFreeNodeIndices.push(lLeafIndex);
        this.mFreeNodeIndices.push(lParentIndex);

        // Update quality baseline after structural change.
        this.mOptimalSurfaceArea = this.mTotalInternalSurfaceArea;
    }

    /**
     * Notify the hierarchy that an object's bounding box has changed.
     * Refits AABBs upward from the object's leaf to the root.
     * May trigger an automatic rebuild if quality has degraded beyond
     * the configured threshold.
     *
     * @param pObject - Object whose bounds have changed.
     *
     * @throws {@link Exception} when the object is not present in the hierarchy.
     */
    public update(pObject: T): void {
        // Validate that the object exists in the tree.
        if (!this.mObjectToLeaf.has(pObject)) {
            throw new Exception('Object does not exist in the BVH.', this);
        }

        const lLeafIndex: number = this.mObjectToLeaf.get(pObject)!;

        // Overwrite the leaf AABB from the object's current bounds.
        const lBounds: IBoundable = this.mBoundsCallback(pObject);
        this.writeAabb(lLeafIndex, lBounds.minX, lBounds.minY, lBounds.minZ, lBounds.maxX, lBounds.maxY, lBounds.maxZ);

        // Refit AABBs upward from the leaf's parent to root.
        this.refitFrom(this.mTopologyBuffer[lLeafIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET]);

        // Trigger auto-rebuild if quality has degraded past the threshold.
        if (this.mObjectCount >= 2 && this.quality > this.mRebuildThreshold) {
            this.rebuild();
        }
    }

    /**
     * Allocate a node index from the free list or from the fresh pool.
     */
    private allocateNode(): number {
        // Reuse a previously freed node slot if available.
        if (this.mFreeNodeIndices.length > 0) {
            return this.mFreeNodeIndices.pop()!;
        }

        // Otherwise allocate the next fresh slot and grow buffers if needed.
        const lIndex: number = this.mNextFreshNodeIndex;
        this.mNextFreshNodeIndex++;
        this.ensureCapacity(this.mNextFreshNodeIndex);
        return lIndex;
    }

    /**
     * Allocate a numeric object index from the free list or from the fresh pool.
     */
    private allocateObjectIndex(): number {
        // Reuse a previously freed object slot if available.
        if (this.mFreeObjectIndices.length > 0) {
            return this.mFreeObjectIndices.pop()!;
        }

        const lIndex: number = this.mNextFreshObjectIndex;
        this.mNextFreshObjectIndex++;

        // Grow objects array if needed.
        if (lIndex >= this.mObjects.length) {
            this.mObjects.length = lIndex + 1;
        }

        return lIndex;
    }

    /**
     * Build a subtree top-down using SAH centroid midpoint split.
     * Returns the root index of the built subtree.
     *
     * @param pLeaves - Array of leaf node indices.
     * @param pStart - Start index in the leaves array (inclusive).
     * @param pEnd - End index in the leaves array (exclusive).
     */
    private buildTopDown(pLeaves: Array<number>, pStart: number, pEnd: number): number {
        const lCount: number = pEnd - pStart;

        // Base case: single leaf needs no internal node.
        if (lCount === 1) {
            return pLeaves[pStart];
        }

        // Base case: pair of leaves creates one internal parent.
        if (lCount === 2) {
            const lInternalIndex: number = this.allocateNode();
            const lLeftLeaf: number = pLeaves[pStart];
            const lRightLeaf: number = pLeaves[pStart + 1];

            this.writeTopology(lInternalIndex, lLeftLeaf, lRightLeaf, null, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX);
            this.writeTopology(lLeftLeaf, null, null, lInternalIndex, null);
            this.writeTopology(lRightLeaf, null, null, lInternalIndex, null);
            this.writeUnionAabb(lInternalIndex, lLeftLeaf, lRightLeaf);

            this.mTotalInternalSurfaceArea += this.computeSurfaceArea(lInternalIndex);
            return lInternalIndex;
        }

        // Compute centroid bounding box over all leaves in the range.
        let lCentroidMinX: number = Infinity;
        let lCentroidMaxX: number = -Infinity;
        let lCentroidMinY: number = Infinity;
        let lCentroidMaxY: number = -Infinity;
        let lCentroidMinZ: number = Infinity;
        let lCentroidMaxZ: number = -Infinity;

        // Scan all leaves to find the extent of their centroids along each axis.
        for (let lIndex: number = pStart; lIndex < pEnd; lIndex++) {
            const lLeaf: number = pLeaves[lIndex];
            const lBase: number = lLeaf * LinearBoundVolumeHierarchy.AABB_STRIDE;
            const lCx: number = (this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET] + this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET]) * 0.5;
            const lCy: number = (this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET] + this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET]) * 0.5;
            const lCz: number = (this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET] + this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET]) * 0.5;

            if (lCx < lCentroidMinX) { lCentroidMinX = lCx; }
            if (lCx > lCentroidMaxX) { lCentroidMaxX = lCx; }
            if (lCy < lCentroidMinY) { lCentroidMinY = lCy; }
            if (lCy > lCentroidMaxY) { lCentroidMaxY = lCy; }
            if (lCz < lCentroidMinZ) { lCentroidMinZ = lCz; }
            if (lCz > lCentroidMaxZ) { lCentroidMaxZ = lCz; }
        }

        // Choose the split axis with the largest centroid spread.
        const lSpreadX: number = lCentroidMaxX - lCentroidMinX;
        const lSpreadY: number = lCentroidMaxY - lCentroidMinY;
        const lSpreadZ: number = lCentroidMaxZ - lCentroidMinZ;

        let lAxis: number = 0;
        let lMaxSpread: number = lSpreadX;
        if (lSpreadY > lMaxSpread) {
            lAxis = 1;
            lMaxSpread = lSpreadY;
        }
        if (lSpreadZ > lMaxSpread) {
            lAxis = 2;
            lMaxSpread = lSpreadZ;
        }

        let lMid: number;

        if (lMaxSpread === 0) {
            // All centroids coincide, split in half.
            lMid = (pStart + pEnd) >> 1;
        } else {
            // Compute midpoint of centroid range along the chosen axis.
            let lMidValue: number;
            if (lAxis === 0) {
                lMidValue = (lCentroidMinX + lCentroidMaxX) * 0.5;
            } else if (lAxis === 1) {
                lMidValue = (lCentroidMinY + lCentroidMaxY) * 0.5;
            } else {
                lMidValue = (lCentroidMinZ + lCentroidMaxZ) * 0.5;
            }

            // Partition leaves into two groups by centroid value along the split axis.
            lMid = this.partitionLeaves(pLeaves, pStart, pEnd, lAxis, lMidValue);

            // Guard against degenerate partition where all leaves end up on one side.
            if (lMid === pStart || lMid === pEnd) {
                lMid = (pStart + pEnd) >> 1;
            }
        }

        // Recurse on both halves and link them under a new internal node.
        const lInternalIndex: number = this.allocateNode();
        const lLeftChild: number = this.buildTopDown(pLeaves, pStart, lMid);
        const lRightChild: number = this.buildTopDown(pLeaves, lMid, pEnd);

        this.writeTopology(lInternalIndex, lLeftChild, lRightChild, null, LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX);
        this.writeTopology(lLeftChild, null, null, lInternalIndex, null);
        this.writeTopology(lRightChild, null, null, lInternalIndex, null);
        this.writeUnionAabb(lInternalIndex, lLeftChild, lRightChild);

        this.mTotalInternalSurfaceArea += this.computeSurfaceArea(lInternalIndex);
        return lInternalIndex;
    }

    /**
     * Compute the surface area of a node's AABB.
     *
     * @param pNodeIndex - Index of the node.
     */
    private computeSurfaceArea(pNodeIndex: number): number {
        const lBase: number = pNodeIndex * LinearBoundVolumeHierarchy.AABB_STRIDE;
        const lDx: number = this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET] - this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET];
        const lDy: number = this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET] - this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET];
        const lDz: number = this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET] - this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET];
        return 2.0 * (lDx * lDy + lDy * lDz + lDz * lDx);
    }

    /**
     * Compute the surface area of the union of a node's AABB and a raw AABB.
     *
     * @param pNodeIndex - Index of the existing node.
     * @param pMinX - Minimum X of the raw AABB.
     * @param pMinY - Minimum Y of the raw AABB.
     * @param pMinZ - Minimum Z of the raw AABB.
     * @param pMaxX - Maximum X of the raw AABB.
     * @param pMaxY - Maximum Y of the raw AABB.
     * @param pMaxZ - Maximum Z of the raw AABB.
     */
    private computeUnionSurfaceAreaWithRaw(pNodeIndex: number, pMinX: number, pMinY: number, pMinZ: number, pMaxX: number, pMaxY: number, pMaxZ: number): number {
        const lBase: number = pNodeIndex * LinearBoundVolumeHierarchy.AABB_STRIDE;
        const lDx: number = Math.max(this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET], pMaxX) - Math.min(this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET], pMinX);
        const lDy: number = Math.max(this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET], pMaxY) - Math.min(this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET], pMinY);
        const lDz: number = Math.max(this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET], pMaxZ) - Math.min(this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET], pMinZ);
        return 2.0 * (lDx * lDy + lDy * lDz + lDz * lDx);
    }

    /**
     * Ensure the buffers can hold at least the given number of node slots.
     * Doubles capacity until sufficient.
     *
     * @param pRequiredSlots - Minimum number of node slots needed.
     */
    private ensureCapacity(pRequiredSlots: number): void {
        const lCurrentCapacity: number = this.mAabbBuffer.length / LinearBoundVolumeHierarchy.AABB_STRIDE;

        if (pRequiredSlots <= lCurrentCapacity) {
            return;
        }

        // Double the capacity until it fits the required number of slots.
        let lNewCapacity: number = lCurrentCapacity;
        while (lNewCapacity < pRequiredSlots) {
            lNewCapacity *= 2;
        }

        // Allocate new buffers and copy existing data.
        const lNewAabbBuffer: Float32Array = new Float32Array(lNewCapacity * LinearBoundVolumeHierarchy.AABB_STRIDE);
        const lNewTopologyBuffer: Int32Array = new Int32Array(lNewCapacity * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE);

        lNewAabbBuffer.set(this.mAabbBuffer);
        lNewTopologyBuffer.set(this.mTopologyBuffer);

        this.mAabbBuffer = lNewAabbBuffer;
        this.mTopologyBuffer = lNewTopologyBuffer;
    }

    /**
     * Find the best sibling for inserting a new leaf using SAH-guided greedy descent.
     *
     * @param pLeafIndex - Index of the new leaf node to insert.
     */
    private findBestSibling(pLeafIndex: number): number {
        // Cache the new leaf's AABB for repeated union cost calculations.
        const lLeafBase: number = pLeafIndex * LinearBoundVolumeHierarchy.AABB_STRIDE;
        const lLeafMinX: number = this.mAabbBuffer[lLeafBase + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET];
        const lLeafMinY: number = this.mAabbBuffer[lLeafBase + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET];
        const lLeafMinZ: number = this.mAabbBuffer[lLeafBase + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET];
        const lLeafMaxX: number = this.mAabbBuffer[lLeafBase + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET];
        const lLeafMaxY: number = this.mAabbBuffer[lLeafBase + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET];
        const lLeafMaxZ: number = this.mAabbBuffer[lLeafBase + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET];

        let lNode: number = this.mRootIndex;

        // Descend the tree greedily, choosing the child with lower SAH cost at each level.
        while (this.mTopologyBuffer[lNode * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] !== LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX) {
            const lLeft: number = this.mTopologyBuffer[lNode * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];
            const lRight: number = this.mTopologyBuffer[lNode * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];

            // Cost of creating a new parent at this node.
            const lCombinedArea: number = this.computeUnionSurfaceAreaWithRaw(lNode, lLeafMinX, lLeafMinY, lLeafMinZ, lLeafMaxX, lLeafMaxY, lLeafMaxZ);
            const lCurrentArea: number = this.computeSurfaceArea(lNode);
            const lInheritanceCost: number = lCombinedArea - lCurrentArea;

            // Cost of descending to the left child. For leaf children, the cost is the
            // full union area. For internal children, only the area increase matters.
            const lLeftUnionArea: number = this.computeUnionSurfaceAreaWithRaw(lLeft, lLeafMinX, lLeafMinY, lLeafMinZ, lLeafMaxX, lLeafMaxY, lLeafMaxZ);
            let lCostLeft: number;
            if (this.mTopologyBuffer[lLeft * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX) {
                lCostLeft = lLeftUnionArea + lInheritanceCost;
            } else {
                lCostLeft = (lLeftUnionArea - this.computeSurfaceArea(lLeft)) + lInheritanceCost;
            }

            // Cost of descending to the right child.
            const lRightUnionArea: number = this.computeUnionSurfaceAreaWithRaw(lRight, lLeafMinX, lLeafMinY, lLeafMinZ, lLeafMaxX, lLeafMaxY, lLeafMaxZ);
            let lCostRight: number;
            if (this.mTopologyBuffer[lRight * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX) {
                lCostRight = lRightUnionArea + lInheritanceCost;
            } else {
                lCostRight = (lRightUnionArea - this.computeSurfaceArea(lRight)) + lInheritanceCost;
            }

            // Stop if inserting here is cheaper than descending further.
            if (lCombinedArea <= Math.min(lCostLeft, lCostRight)) {
                break;
            }

            // Descend toward the cheaper child.
            if (lCostLeft < lCostRight) {
                lNode = lLeft;
            } else {
                lNode = lRight;
            }
        }

        return lNode;
    }

    /**
     * Partition a range of the leaves array by centroid value along a given axis.
     * Leaves with centroid <= midpoint go to the left partition.
     * Uses an in-place swap to avoid allocations.
     *
     * @param pLeaves - Array of leaf node indices.
     * @param pStart - Start index (inclusive).
     * @param pEnd - End index (exclusive).
     * @param pAxis - Axis to partition on (0=X, 1=Y, 2=Z).
     * @param pMidValue - Centroid midpoint along the axis.
     *
     * @returns The partition boundary index.
     */
    private partitionLeaves(pLeaves: Array<number>, pStart: number, pEnd: number, pAxis: number, pMidValue: number): number {
        let lWriter: number = pStart;

        // Scan through all leaves, swapping those on the left side to the front.
        for (let lIndex: number = pStart; lIndex < pEnd; lIndex++) {
            const lLeaf: number = pLeaves[lIndex];
            const lBase: number = lLeaf * LinearBoundVolumeHierarchy.AABB_STRIDE;
            const lCentroid: number = (this.mAabbBuffer[lBase + pAxis] + this.mAabbBuffer[lBase + 3 + pAxis]) * 0.5;

            if (lCentroid <= pMidValue) {
                const lTemp: number = pLeaves[lWriter];
                pLeaves[lWriter] = pLeaves[lIndex];
                pLeaves[lIndex] = lTemp;
                lWriter++;
            }
        }

        return lWriter;
    }

    /**
     * Refit AABBs upward from the given node to the root.
     * Updates each internal node's AABB to be the union of its children
     * and adjusts the total internal surface area incrementally.
     *
     * @param pNodeIndex - Index of the node to start refitting from.
     */
    private refitFrom(pNodeIndex: number): void {
        let lCurrent: number = pNodeIndex;

        // Walk from the starting node up to the root, recalculating each AABB.
        while (lCurrent !== LinearBoundVolumeHierarchy.OBJECT_NULL_INDEX) {
            const lLeft: number = this.mTopologyBuffer[lCurrent * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];
            const lRight: number = this.mTopologyBuffer[lCurrent * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];

            // Subtract old surface area before recomputing.
            this.mTotalInternalSurfaceArea -= this.computeSurfaceArea(lCurrent);

            // Recompute AABB as union of children.
            this.writeUnionAabb(lCurrent, lLeft, lRight);

            // Add new surface area after recomputing.
            this.mTotalInternalSurfaceArea += this.computeSurfaceArea(lCurrent);

            // Walk upward to parent.
            lCurrent = this.mTopologyBuffer[lCurrent * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];
        }
    }

    /**
     * Write AABB coordinates for a node.
     *
     * @param pNodeIndex - Index of the node.
     * @param pMinX - Minimum X.
     * @param pMinY - Minimum Y.
     * @param pMinZ - Minimum Z.
     * @param pMaxX - Maximum X.
     * @param pMaxY - Maximum Y.
     * @param pMaxZ - Maximum Z.
     */
    private writeAabb(pNodeIndex: number, pMinX: number, pMinY: number, pMinZ: number, pMaxX: number, pMaxY: number, pMaxZ: number): void {
        const lBase: number = pNodeIndex * LinearBoundVolumeHierarchy.AABB_STRIDE;
        this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET] = pMinX;
        this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET] = pMinY;
        this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET] = pMinZ;
        this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET] = pMaxX;
        this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET] = pMaxY;
        this.mAabbBuffer[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET] = pMaxZ;
    }

    /**
     * Write topology fields for a node. Pass null for any field that should not be updated.
     *
     * @param pNodeIndex - Index of the node.
     * @param pLeftChild - Left child index or null to skip.
     * @param pRightChild - Right child index or null to skip.
     * @param pParent - Parent index or null to skip.
     * @param pObjectIndex - Object index or null to skip.
     */
    private writeTopology(pNodeIndex: number, pLeftChild: number | null, pRightChild: number | null, pParent: number | null, pObjectIndex: number | null): void {
        const lBase: number = pNodeIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE;
        if (pLeftChild !== null) { this.mTopologyBuffer[lBase + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] = pLeftChild; }
        if (pRightChild !== null) { this.mTopologyBuffer[lBase + LinearBoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET] = pRightChild; }
        if (pParent !== null) { this.mTopologyBuffer[lBase + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET] = pParent; }
        if (pObjectIndex !== null) { this.mTopologyBuffer[lBase + LinearBoundVolumeHierarchy.TOPOLOGY_OBJECT_INDEX_OFFSET] = pObjectIndex; }
    }

    /**
     * Write the union of two nodes' AABBs into a target node.
     *
     * @param pTargetIndex - Index of the node to write to.
     * @param pNodeA - First source node index.
     * @param pNodeB - Second source node index.
     */
    private writeUnionAabb(pTargetIndex: number, pNodeA: number, pNodeB: number): void {
        const lBaseA: number = pNodeA * LinearBoundVolumeHierarchy.AABB_STRIDE;
        const lBaseB: number = pNodeB * LinearBoundVolumeHierarchy.AABB_STRIDE;
        const lBaseTarget: number = pTargetIndex * LinearBoundVolumeHierarchy.AABB_STRIDE;

        this.mAabbBuffer[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET] = Math.min(this.mAabbBuffer[lBaseA + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET], this.mAabbBuffer[lBaseB + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET]);
        this.mAabbBuffer[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET] = Math.min(this.mAabbBuffer[lBaseA + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET], this.mAabbBuffer[lBaseB + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET]);
        this.mAabbBuffer[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET] = Math.min(this.mAabbBuffer[lBaseA + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET], this.mAabbBuffer[lBaseB + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET]);
        this.mAabbBuffer[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET] = Math.max(this.mAabbBuffer[lBaseA + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET], this.mAabbBuffer[lBaseB + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET]);
        this.mAabbBuffer[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET] = Math.max(this.mAabbBuffer[lBaseA + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET], this.mAabbBuffer[lBaseB + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET]);
        this.mAabbBuffer[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET] = Math.max(this.mAabbBuffer[lBaseA + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET], this.mAabbBuffer[lBaseB + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET]);
    }
}
