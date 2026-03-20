import { Exception } from '../exception/exception.ts';
import type { IBoundable } from '../interface/i-boundable.ts';
import { Writeable } from "../types.ts";

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

    // Sentinel value for absent node or object references.
    private static readonly NODE_NULL_INDEX: number = -1;
    private static readonly OBJECT_NULL_INDEX: number = -1;

    // Topology buffer offsets. Four integers per node: leftChild, rightChild, parentIndex, objectIndex.
    private static readonly TOPOLOGY_LEFT_CHILD_OFFSET: number = 0;
    private static readonly TOPOLOGY_OBJECT_INDEX_OFFSET: number = 3;
    private static readonly TOPOLOGY_PARENT_OFFSET: number = 2;
    private static readonly TOPOLOGY_RIGHT_CHILD_OFFSET: number = 1;
    private static readonly TOPOLOGY_STRIDE: number = 4;

    private readonly mAabbBuffer: SharedArrayBuffer;
    private mAabbBufferView: Float32Array;
    private readonly mBoundableCache: Array<Writeable<IBoundable>>;
    private readonly mBoundsCallback: (pObject: T) => IBoundable;
    private readonly mAvailableNodeIndices: Array<number>;
    private readonly mAvailableObjectIndices: Array<number>;
    private mNextFreshNodeIndex: number;
    private mNextFreshObjectIndex: number;
    private mObjectCount: number;
    private readonly mObjectToIndex: Map<T, number>;
    private readonly mObjectToLeaf: Map<T, number>;
    private mObjects: Array<T | null>;
    private mOptimalSurfaceArea: number;
    private readonly mRebuildThreshold: number;
    private mRootIndex: number;
    private readonly mSurfaceAreaCache: Array<number>;
    private readonly mTopologyBuffer: SharedArrayBuffer;
    private mTopologyBufferView: Int32Array;
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
    public get aabbBuffer(): SharedArrayBuffer {
        return this.mAabbBuffer;
    }

    /**
     * Total number of allocated node slots in the buffers.
     *
     * @readonly
     */
    public get capacity(): number {
        return this.mAabbBufferView.length / LinearBoundVolumeHierarchy.AABB_STRIDE;
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
        return this.mTopologyBufferView.buffer as ArrayBuffer;
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
    public constructor(pBoundsCallback: (pObject: T) => IBoundable, pRebuildThreshold: number = 2.0) {
        this.mBoundsCallback = pBoundsCallback;
        this.mBoundableCache = [];
        this.mSurfaceAreaCache = [];

        // Create buffers with a max byte length set to 100.000 nodes.
        this.mAabbBuffer = new SharedArrayBuffer(0, {maxByteLength: 100000 * LinearBoundVolumeHierarchy.AABB_STRIDE * Float32Array.BYTES_PER_ELEMENT});
        this.mAabbBufferView = new Float32Array(this.mAabbBuffer);
        this.mTopologyBuffer = new SharedArrayBuffer(0, {maxByteLength: 100000 * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE * Int32Array.BYTES_PER_ELEMENT});
        this.mTopologyBufferView = new Int32Array(this.mTopologyBuffer);

        this.mNextFreshNodeIndex = 0;
        this.mAvailableNodeIndices = [];

        this.mObjects = [];
        this.mObjectToIndex = new Map<T, number>();
        this.mObjectToLeaf = new Map<T, number>();
        this.mNextFreshObjectIndex = 0;
        this.mAvailableObjectIndices = [];
        this.mObjectCount = 0;

        this.mRootIndex = LinearBoundVolumeHierarchy.NODE_NULL_INDEX;

        this.mTotalInternalSurfaceArea = 0;
        this.mOptimalSurfaceArea = 0;
        this.mRebuildThreshold = pRebuildThreshold;
    }

    /**
     * Find all objects whose bounding boxes satisfy the given test callback.
     * Traverses the tree top-down, pruning entire subtrees when the callback
     * returns false for an internal node's AABB.
     *
     * @param pCallback - Test function receiving a node's AABB bounds.
     *        Return true to include (leaf) or descend into (internal) the node.
     *        Return false to skip the node and its entire subtree.
     *
     * @returns Array of objects whose leaf AABBs passed the test.
     */
    public find(pCallback: (pBounds: IBoundable) => boolean): Array<T> {
        const lResults: Array<T> = [];

        // Empty tree has no results.
        if (this.mRootIndex === LinearBoundVolumeHierarchy.NODE_NULL_INDEX) {
            return lResults;
        }

        // Iterative traversal using an explicit stack.
        const lStack: Array<number> = [this.mRootIndex];

        while (lStack.length > 0) {
            const lNodeIndex: number = lStack.pop()!;

            // Test the node's AABB against the callback.
            if (!pCallback(this.mBoundableCache[lNodeIndex])) {
                continue;
            }

            const lBase: number = lNodeIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE;
            const lLeftChild: number = this.mTopologyBufferView[lBase + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];

            if (lLeftChild === LinearBoundVolumeHierarchy.NODE_NULL_INDEX) {
                // Leaf node passed the test, collect the associated object.
                const lObjectIndex: number = this.mTopologyBufferView[lBase + LinearBoundVolumeHierarchy.TOPOLOGY_OBJECT_INDEX_OFFSET];
                lResults.push(this.mObjects[lObjectIndex]!);
            } else {
                // Internal node passed the test, descend into both children.
                const lRightChild: number = this.mTopologyBufferView[lBase + LinearBoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];
                lStack.push(lLeftChild);
                lStack.push(lRightChild);
            }
        }

        return lResults;
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
        this.writeTopology(lLeafIndex, LinearBoundVolumeHierarchy.NODE_NULL_INDEX, LinearBoundVolumeHierarchy.NODE_NULL_INDEX, LinearBoundVolumeHierarchy.NODE_NULL_INDEX, lObjectIndex);

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
        const lOldParentIndex: number = this.mTopologyBufferView[lSiblingIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];

        // Wire up the new parent with sibling as left child and new leaf as right child.
        this.writeTopology(lNewParentIndex, lSiblingIndex, lLeafIndex, lOldParentIndex, LinearBoundVolumeHierarchy.NODE_NULL_INDEX);
        this.writeTopology(lSiblingIndex, null, null, lNewParentIndex, null);
        this.writeTopology(lLeafIndex, null, null, lNewParentIndex, null);

        // Link new parent into the tree in place of the sibling.
        if (lOldParentIndex === LinearBoundVolumeHierarchy.NODE_NULL_INDEX) {
            this.mRootIndex = lNewParentIndex;
        } else {
            // Replace the sibling reference in the old parent with the new parent.
            if (this.mTopologyBufferView[lOldParentIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === lSiblingIndex) {
                this.writeTopology(lOldParentIndex, lNewParentIndex, null, null, null);
            } else {
                this.writeTopology(lOldParentIndex, null, lNewParentIndex, null, null);
            }
        }

        // Set new parent AABB as union of sibling and leaf.
        this.writeUnionAabb(lNewParentIndex, lSiblingIndex, lLeafIndex);

        // Track surface area of the new internal node.
        this.mTotalInternalSurfaceArea += this.mSurfaceAreaCache[lNewParentIndex];

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
        this.mAvailableNodeIndices.length = 0;
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
            this.writeTopology(lLeafIndex, LinearBoundVolumeHierarchy.NODE_NULL_INDEX, LinearBoundVolumeHierarchy.NODE_NULL_INDEX, LinearBoundVolumeHierarchy.NODE_NULL_INDEX, lObjIndex);

            this.mObjectToLeaf.set(lObj, lLeafIndex);
        }

        // Build tree top-down using SAH centroid midpoint split.
        this.mRootIndex = this.buildTopDown(lLeaves, 0, lLeaves.length);
        this.writeTopology(this.mRootIndex, null, null, LinearBoundVolumeHierarchy.NODE_NULL_INDEX, null);

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
        const lParentIndex: number = this.mTopologyBufferView[lLeafIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];

        // Clean up object tracking.
        this.mObjectToLeaf.delete(pObject);
        this.mObjectToIndex.delete(pObject);
        this.mObjects[lObjectIndex] = null;
        this.mAvailableObjectIndices.push(lObjectIndex);
        this.mObjectCount--;

        // If the removed leaf was the root, the tree becomes empty.
        if (lParentIndex === LinearBoundVolumeHierarchy.NODE_NULL_INDEX) {
            this.mRootIndex = LinearBoundVolumeHierarchy.NODE_NULL_INDEX;
            this.mAvailableNodeIndices.push(lLeafIndex);
            this.mTotalInternalSurfaceArea = 0;
            this.mOptimalSurfaceArea = 0;
            return;
        }

        // Find the sibling of the removed leaf by checking which child of the parent is not the leaf.
        const lParentBase: number = lParentIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE;
        let lSiblingIndex: number;
        if (this.mTopologyBufferView[lParentBase + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === lLeafIndex) {
            lSiblingIndex = this.mTopologyBufferView[lParentBase + LinearBoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];
        } else {
            lSiblingIndex = this.mTopologyBufferView[lParentBase + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];
        }

        const lGrandparentIndex: number = this.mTopologyBufferView[lParentBase + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];

        // Subtract the removed internal parent surface area from the total.
        this.mTotalInternalSurfaceArea -= this.mSurfaceAreaCache[lParentIndex];

        // Patch the sibling into the grandparent's slot, replacing the removed parent.
        if (lGrandparentIndex !== LinearBoundVolumeHierarchy.NODE_NULL_INDEX) {
            if (this.mTopologyBufferView[lGrandparentIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === lParentIndex) {
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
            this.writeTopology(lSiblingIndex, null, null, LinearBoundVolumeHierarchy.NODE_NULL_INDEX, null);
        }

        // Free the removed leaf and parent nodes.
        this.mAvailableNodeIndices.push(lLeafIndex);
        this.mAvailableNodeIndices.push(lParentIndex);

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
        this.refitFrom(this.mTopologyBufferView[lLeafIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET]);

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
        if (this.mAvailableNodeIndices.length > 0) {
            return this.mAvailableNodeIndices.pop()!;
        }

        // Otherwise allocate the next fresh slot and grow buffers if needed.
        const lIndex: number = this.mNextFreshNodeIndex++;

        this.ensureCapacity(this.mNextFreshNodeIndex);

        return lIndex;
    }

    /**
     * Allocate a numeric object index from the free list or from the fresh pool.
     */
    private allocateObjectIndex(): number {
        // Reuse a previously freed object slot if available.
        if (this.mAvailableObjectIndices.length > 0) {
            return this.mAvailableObjectIndices.pop()!;
        }

        const lIndex: number = this.mNextFreshObjectIndex++;

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

            this.mTotalInternalSurfaceArea += this.mSurfaceAreaCache[lInternalIndex];
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
            const lCx: number = (this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET] + this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET]) * 0.5;
            const lCy: number = (this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET] + this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET]) * 0.5;
            const lCz: number = (this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET] + this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET]) * 0.5;

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

        this.mTotalInternalSurfaceArea += this.mSurfaceAreaCache[lInternalIndex];
        return lInternalIndex;
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
        // Get base index for the node's AABB in the buffer.
        const lBaseIndex: number = pNodeIndex * LinearBoundVolumeHierarchy.AABB_STRIDE;

        // Read min and max of the node's AABB and compute the extents of the union with the raw AABB.
        const lDx: number = Math.max(this.mAabbBufferView[lBaseIndex + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET], pMaxX) - Math.min(this.mAabbBufferView[lBaseIndex + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET], pMinX);
        const lDy: number = Math.max(this.mAabbBufferView[lBaseIndex + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET], pMaxY) - Math.min(this.mAabbBufferView[lBaseIndex + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET], pMinY);
        const lDz: number = Math.max(this.mAabbBufferView[lBaseIndex + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET], pMaxZ) - Math.min(this.mAabbBufferView[lBaseIndex + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET], pMinZ);

        // AABB surface area = 2 * (dx*dy + dy*dz + dz*dx)
        return 2.0 * (lDx * lDy + lDy * lDz + lDz * lDx);
    }

    /**
     * Ensure the buffers can hold at least the given number of node capacity.
     * Doubles capacity until sufficient.
     *
     * @param pRequiredCapacity - Minimum number of node capacity needed.
     */
    private ensureCapacity(pRequiredCapacity: number): void {
        const lCurrentCapacity: number = this.mAabbBufferView.length / LinearBoundVolumeHierarchy.AABB_STRIDE;
        if (pRequiredCapacity <= lCurrentCapacity) {
            return;
        }

        // Grow the capacity in 64 node increments to avoid frequent small resizes.
        let lNewCapacity: number = lCurrentCapacity;
        lNewCapacity += (pRequiredCapacity - lCurrentCapacity + 63) & ~63;

        // Grow buffers with the new capacity.
        this.mAabbBuffer.grow(lNewCapacity * LinearBoundVolumeHierarchy.AABB_STRIDE * Float32Array.BYTES_PER_ELEMENT);
        this.mTopologyBuffer.grow(lNewCapacity * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE * Int32Array.BYTES_PER_ELEMENT);

        // Update views to reflect the new buffer sizes.
        this.mAabbBufferView = new Float32Array(this.mAabbBuffer);
        this.mTopologyBufferView = new Int32Array(this.mTopologyBuffer);
    }

    /**
     * Find the best sibling for inserting a new leaf using SAH-guided greedy descent.
     *
     * @param pLeafIndex - Index of the new leaf node to insert.
     */
    private findBestSibling(pLeafIndex: number): number {
        // Cache the new leaf's AABB for repeated union cost calculations.
        const lLeafBase: number = pLeafIndex * LinearBoundVolumeHierarchy.AABB_STRIDE;
        const lLeafMinX: number = this.mAabbBufferView[lLeafBase + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET];
        const lLeafMinY: number = this.mAabbBufferView[lLeafBase + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET];
        const lLeafMinZ: number = this.mAabbBufferView[lLeafBase + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET];
        const lLeafMaxX: number = this.mAabbBufferView[lLeafBase + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET];
        const lLeafMaxY: number = this.mAabbBufferView[lLeafBase + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET];
        const lLeafMaxZ: number = this.mAabbBufferView[lLeafBase + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET];

        let lNode: number = this.mRootIndex;

        // Descend the tree greedily, choosing the child with lower SAH cost at each level.
        while (this.mTopologyBufferView[lNode * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] !== LinearBoundVolumeHierarchy.NODE_NULL_INDEX) {
            const lLeft: number = this.mTopologyBufferView[lNode * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];
            const lRight: number = this.mTopologyBufferView[lNode * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];

            // Cost of creating a new parent at this node.
            const lCombinedArea: number = this.computeUnionSurfaceAreaWithRaw(lNode, lLeafMinX, lLeafMinY, lLeafMinZ, lLeafMaxX, lLeafMaxY, lLeafMaxZ);
            const lCurrentArea: number = this.mSurfaceAreaCache[lNode];
            const lInheritanceCost: number = lCombinedArea - lCurrentArea;

            // Cost of descending to the left child. For leaf children, the cost is the
            // full union area. For internal children, only the area increase matters.
            const lLeftUnionArea: number = this.computeUnionSurfaceAreaWithRaw(lLeft, lLeafMinX, lLeafMinY, lLeafMinZ, lLeafMaxX, lLeafMaxY, lLeafMaxZ);
            let lCostLeft: number;
            if (this.mTopologyBufferView[lLeft * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === LinearBoundVolumeHierarchy.NODE_NULL_INDEX) {
                lCostLeft = lLeftUnionArea + lInheritanceCost;
            } else {
                lCostLeft = (lLeftUnionArea - this.mSurfaceAreaCache[lLeft]) + lInheritanceCost;
            }

            // Cost of descending to the right child.
            const lRightUnionArea: number = this.computeUnionSurfaceAreaWithRaw(lRight, lLeafMinX, lLeafMinY, lLeafMinZ, lLeafMaxX, lLeafMaxY, lLeafMaxZ);
            let lCostRight: number;
            if (this.mTopologyBufferView[lRight * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === LinearBoundVolumeHierarchy.NODE_NULL_INDEX) {
                lCostRight = lRightUnionArea + lInheritanceCost;
            } else {
                lCostRight = (lRightUnionArea - this.mSurfaceAreaCache[lRight]) + lInheritanceCost;
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
            const lCentroid: number = (this.mAabbBufferView[lBase + pAxis] + this.mAabbBufferView[lBase + 3 + pAxis]) * 0.5;

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
        // Walk from the starting node up to the root, recalculating each AABB.
        let lCurrentNodeIndex: number = pNodeIndex;
        while (lCurrentNodeIndex !== LinearBoundVolumeHierarchy.NODE_NULL_INDEX) {
            const lLeft: number = this.mTopologyBufferView[lCurrentNodeIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];
            const lRight: number = this.mTopologyBufferView[lCurrentNodeIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];

            // Subtract old surface area before recomputing.
            this.mTotalInternalSurfaceArea -= this.mSurfaceAreaCache[lCurrentNodeIndex];

            // Recompute AABB as union of children.
            this.writeUnionAabb(lCurrentNodeIndex, lLeft, lRight);

            // Add new surface area after recomputing.
            this.mTotalInternalSurfaceArea += this.mSurfaceAreaCache[lCurrentNodeIndex];

            // Walk upward to parent.
            lCurrentNodeIndex = this.mTopologyBufferView[lCurrentNodeIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];
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
        // Calculate the base index for the node's AABB fields.
        const lBase: number = pNodeIndex * LinearBoundVolumeHierarchy.AABB_STRIDE;

        // Write AABB coordinates for the node.
        this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET] = pMinX;
        this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET] = pMinY;
        this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET] = pMinZ;
        this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET] = pMaxX;
        this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET] = pMaxY;
        this.mAabbBufferView[lBase + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET] = pMaxZ;

        // Cache surface area.
        const lDx: number = pMaxX - pMinX;
        const lDy: number = pMaxY - pMinY;
        const lDz: number = pMaxZ - pMinZ;
        this.mSurfaceAreaCache[pNodeIndex] = 2.0 * (lDx * lDy + lDy * lDz + lDz * lDx);

        // Cache boundable.
        const lCached = this.mBoundableCache[pNodeIndex];
        if (lCached === undefined) {
            this.mBoundableCache[pNodeIndex] = { minX: pMinX, minY: pMinY, minZ: pMinZ, maxX: pMaxX, maxY: pMaxY, maxZ: pMaxZ };
        } else {
            lCached.minX = pMinX;
            lCached.minY = pMinY;
            lCached.minZ = pMinZ;
            lCached.maxX = pMaxX;
            lCached.maxY = pMaxY;
            lCached.maxZ = pMaxZ;
        }
    }

    /**
     * Write topology fields for a node. Pass null for any field that should not be updated.
     *
     * @param pNodeIndex - Index of the node.
     * @param pLeftChildIndex - Left child index or null to skip.
     * @param pRightChildIndex - Right child index or null to skip.
     * @param pParentIndex - Parent index or null to skip.
     * @param pObjectIndex - Object index or null to skip.
     */
    private writeTopology(pNodeIndex: number, pLeftChildIndex: number | null, pRightChildIndex: number | null, pParentIndex: number | null, pObjectIndex: number | null): void {
        // Calculate the base index for the node's topology fields.
        const lBaseIndex: number = pNodeIndex * LinearBoundVolumeHierarchy.TOPOLOGY_STRIDE;

        // Write only the fields that are not null, allowing for partial updates.
        if (pLeftChildIndex !== null) {
            this.mTopologyBufferView[lBaseIndex + LinearBoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] = pLeftChildIndex;
        }
        if (pRightChildIndex !== null) {
            this.mTopologyBufferView[lBaseIndex + LinearBoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET] = pRightChildIndex;
        }
        if (pParentIndex !== null) {
            this.mTopologyBufferView[lBaseIndex + LinearBoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET] = pParentIndex;
        }
        if (pObjectIndex !== null) {
            this.mTopologyBufferView[lBaseIndex + LinearBoundVolumeHierarchy.TOPOLOGY_OBJECT_INDEX_OFFSET] = pObjectIndex;
        }
    }

    /**
     * Write the union of two nodes' AABBs into a target node.
     *
     * @param pTargetIndex - Index of the node to write to.
     * @param pNodeA - First source node index.
     * @param pNodeB - Second source node index.
     */
    private writeUnionAabb(pTargetIndex: number, pNodeA: number, pNodeB: number): void {
        // Calculate the base indices for the source and target nodes' AABB fields.
        const lBaseA: number = pNodeA * LinearBoundVolumeHierarchy.AABB_STRIDE;
        const lBaseB: number = pNodeB * LinearBoundVolumeHierarchy.AABB_STRIDE;
        const lBaseTarget: number = pTargetIndex * LinearBoundVolumeHierarchy.AABB_STRIDE;

        // Compute the union of the two AABBs.
        const lMinX: number = Math.min(this.mAabbBufferView[lBaseA + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET], this.mAabbBufferView[lBaseB + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET]);
        const lMinY: number = Math.min(this.mAabbBufferView[lBaseA + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET], this.mAabbBufferView[lBaseB + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET]);
        const lMinZ: number = Math.min(this.mAabbBufferView[lBaseA + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET], this.mAabbBufferView[lBaseB + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET]);
        const lMaxX: number = Math.max(this.mAabbBufferView[lBaseA + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET], this.mAabbBufferView[lBaseB + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET]);
        const lMaxY: number = Math.max(this.mAabbBufferView[lBaseA + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET], this.mAabbBufferView[lBaseB + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET]);
        const lMaxZ: number = Math.max(this.mAabbBufferView[lBaseA + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET], this.mAabbBufferView[lBaseB + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET]);

        // Write union to the target node.
        this.mAabbBufferView[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MIN_X_OFFSET] = lMinX;
        this.mAabbBufferView[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MIN_Y_OFFSET] = lMinY;
        this.mAabbBufferView[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MIN_Z_OFFSET] = lMinZ;
        this.mAabbBufferView[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MAX_X_OFFSET] = lMaxX;
        this.mAabbBufferView[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MAX_Y_OFFSET] = lMaxY;
        this.mAabbBufferView[lBaseTarget + LinearBoundVolumeHierarchy.AABB_MAX_Z_OFFSET] = lMaxZ;

        // Cache surface area.
        const lDx: number = lMaxX - lMinX;
        const lDy: number = lMaxY - lMinY;
        const lDz: number = lMaxZ - lMinZ;
        this.mSurfaceAreaCache[pTargetIndex] = 2.0 * (lDx * lDy + lDy * lDz + lDz * lDx);

        // Cache boundable.
        const lCached = this.mBoundableCache[pTargetIndex];
        if (lCached === undefined) {
            this.mBoundableCache[pTargetIndex] = { minX: lMinX, minY: lMinY, minZ: lMinZ, maxX: lMaxX, maxY: lMaxY, maxZ: lMaxZ };
        } else {
            lCached.minX = lMinX;
            lCached.minY = lMinY;
            lCached.minZ = lMinZ;
            lCached.maxX = lMaxX;
            lCached.maxY = lMaxY;
            lCached.maxZ = lMaxZ;
        }
    }
}
