import { Exception } from '../exception/exception.ts';
import type { IBoundable } from '../interface/i-boundable.ts';
import { Writeable } from "../types.ts";

/**
 * Online linearized bounding volume hierarchy for 3D axis-aligned bounding boxes.
 * Stores all node data in two flat typed arrays for cache-friendly access.
 * Supports incremental insert, remove, and update operations with automatic
 * quality tracking and optional full rebuild.
 *
 * Insert uses a fast volume-increase heuristic for sloppy but cheap placement.
 * Rebuild uses a full SAH centroid midpoint split for optimal tree quality.
 * The {@link quality} metric tracks degradation so callers can trigger rebuilds.
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
export class BoundVolumeHierarchy<T> {
    // AABB buffer offsets. Six floats per node: minX, minY, minZ, maxX, maxY, maxZ.
    private static readonly AABB_MAX_X_OFFSET: number = 3;
    private static readonly AABB_MAX_Y_OFFSET: number = 4;
    private static readonly AABB_MAX_Z_OFFSET: number = 5;
    private static readonly AABB_MIN_X_OFFSET: number = 0;
    private static readonly AABB_MIN_Y_OFFSET: number = 1;
    private static readonly AABB_MIN_Z_OFFSET: number = 2;
    private static readonly AABB_STRIDE_LENGTH: number = 6;

    // Sentinel value for absent node or object references.
    private static readonly NODE_NULL_INDEX: number = -1;
    private static readonly OBJECT_NULL_INDEX: number = -1;

    // Topology buffer offsets. Four integers per node: leftChild, rightChild, parentIndex, objectIndex.
    private static readonly TOPOLOGY_LEFT_CHILD_OFFSET: number = 0;
    private static readonly TOPOLOGY_OBJECT_INDEX_OFFSET: number = 3;
    private static readonly TOPOLOGY_PARENT_OFFSET: number = 2;
    private static readonly TOPOLOGY_RIGHT_CHILD_OFFSET: number = 1;
    private static readonly TOPOLOGY_STRIDE_LENGTH: number = 4;

    private readonly mAvailableNodeIndices: Array<number>;
    private readonly mAvailableObjectIndices: Array<number>;
    private readonly mBoundsCallback: (pObject: T) => IBoundable;
    private readonly mBuffers: BoundVolumeHierarchyBuffers;
    private readonly mCache: BoundVolumeHierarchyCache;
    private mNextFreshNodeIndex: number;
    private mNextFreshObjectIndex: number;
    private readonly mObjectToIndex: Map<T, number>;
    private readonly mObjectToLeaf: Map<T, number>;
    private mObjects: Array<T | null>;
    private mRootIndex: number;

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
        return this.mBuffers.aabb.buffer;
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
        if (this.mCache.surface.optimalSurfaceArea <= 0) {
            return 1.0;
        }
        return this.mCache.surface.totalInternalSurfaceArea / this.mCache.surface.optimalSurfaceArea;
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
    public get topologyBuffer(): SharedArrayBuffer {
        return this.mBuffers.topology.buffer;
    }

    /**
     * Constructor.
     *
     * @param pBoundsCallback - Callback that returns an {@link IBoundable} for a given object.
     *        Called whenever the hierarchy needs the current bounding box of an object.
     */
    public constructor(pBoundsCallback: (pObject: T) => IBoundable) {
        this.mBoundsCallback = pBoundsCallback;

        // Create buffers with a max byte length set to 100.000 nodes.
        const lAabbBuffer: SharedArrayBuffer = new SharedArrayBuffer(0, { maxByteLength: 100000 * BoundVolumeHierarchy.AABB_STRIDE_LENGTH * Float32Array.BYTES_PER_ELEMENT });
        const lTopologyBuffer: SharedArrayBuffer = new SharedArrayBuffer(0, { maxByteLength: 100000 * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH * Int32Array.BYTES_PER_ELEMENT });
        this.mBuffers = {
            aabb: {
                buffer: lAabbBuffer,
                view: new Float32Array(lAabbBuffer)
            },
            topology: {
                buffer: lTopologyBuffer,
                view: new Int32Array(lTopologyBuffer)
            }
        };

        // Create caching structure.
        this.mCache = {
            boundable: {
                objects: new Map<number, IBoundable>(),
                nodes: new Map<number, WriteableBoundable>()
            },
            surface: {
                nodes: new Map<number, number>(),
                totalInternalSurfaceArea: 0,
                optimalSurfaceArea: 0
            }
        };

        this.mNextFreshNodeIndex = 0;
        this.mAvailableNodeIndices = new Array<number>();

        this.mObjects = new Array<T>();
        this.mObjectToIndex = new Map<T, number>();
        this.mObjectToLeaf = new Map<T, number>();
        this.mNextFreshObjectIndex = 0;
        this.mAvailableObjectIndices = new Array<number>();

        this.mRootIndex = BoundVolumeHierarchy.NODE_NULL_INDEX;
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
    public find(pCallback: BoundVolumeHierarchyFindCallback<T>): Array<T> {
        const lResults: Array<T> = new Array<T>();

        // Empty tree has no results.
        if (this.mRootIndex === BoundVolumeHierarchy.NODE_NULL_INDEX) {
            return lResults;
        }

        // Iterative traversal using an explicit stack.
        const lStack: Array<number> = [this.mRootIndex];
        while (lStack.length > 0) {
            const lNodeIndex: number = lStack.pop()!;

            const lNodeBaseIndex: number = lNodeIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH;
            const lLeftChild: number = this.mBuffers.topology.view[lNodeBaseIndex + BoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];

            // Try to find an associated object for this node. Will be non-null only for leaf nodes.
            const lObject: T | null = (() => {
                // If leftChild is null, this is a leaf node. Collect the associated object and test it with the callback.
                if (lLeftChild === BoundVolumeHierarchy.NODE_NULL_INDEX) {
                    // Leaf node passed the test, collect the associated object.
                    return this.mObjects[this.mBuffers.topology.view[lNodeBaseIndex + BoundVolumeHierarchy.TOPOLOGY_OBJECT_INDEX_OFFSET]]!;
                }

                return null;
            })();

            // Test the node's AABB against the callback.
            if (!pCallback(this.mCache.boundable.nodes.get(lNodeIndex)!, lObject)) {
                continue;
            }

            // Eighter a leaf node passed the test, or an internal node passed the test and needs to be descended into.
            if (lObject) {
                lResults.push(lObject);
            } else {
                // Internal node passed the test, descend into both children.
                const lRightChild: number = this.mBuffers.topology.view[lNodeBaseIndex + BoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];

                lStack.push(lLeftChild);
                lStack.push(lRightChild);
            }
        }

        return lResults;
    }

    /**
     * Insert an object into the hierarchy.
     * Uses a fast volume-increase heuristic for sibling selection.
     * The resulting placement may be suboptimal; use {@link rebuild} to restore optimal quality.
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
        this.mCache.boundable.objects.set(lObjectIndex, lBounds);
        this.writeAabb(lLeafIndex, lBounds);

        // Write leaf topology: no children, no parent, stores objectIndex.
        this.writeTopology(lLeafIndex, BoundVolumeHierarchy.NODE_NULL_INDEX, BoundVolumeHierarchy.NODE_NULL_INDEX, BoundVolumeHierarchy.NODE_NULL_INDEX, lObjectIndex);

        // Track mapping.
        this.mObjectToLeaf.set(pObject, lLeafIndex);

        // First object becomes the root directly.
        if (this.mRootIndex === BoundVolumeHierarchy.NODE_NULL_INDEX) {
            this.mRootIndex = lLeafIndex;
            this.mCache.surface.optimalSurfaceArea = 0;
            return;
        }

        // Find best sibling using SAH-guided tree descent.
        const lSiblingIndex: number = this.findBestSibling(lLeafIndex);

        // Create a new internal parent node.
        const lNewParentIndex: number = this.allocateNode();
        const lOldParentIndex: number = this.mBuffers.topology.view[lSiblingIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];

        // Wire up the new parent with sibling as left child and new leaf as right child.
        this.writeTopology(lNewParentIndex, lSiblingIndex, lLeafIndex, lOldParentIndex, BoundVolumeHierarchy.NODE_NULL_INDEX);
        this.writeTopology(lSiblingIndex, null, null, lNewParentIndex, null);
        this.writeTopology(lLeafIndex, null, null, lNewParentIndex, null);

        // Link new parent into the tree in place of the sibling.
        if (lOldParentIndex === BoundVolumeHierarchy.NODE_NULL_INDEX) {
            this.mRootIndex = lNewParentIndex;
        } else {
            // Replace the sibling reference in the old parent with the new parent.
            if (this.mBuffers.topology.view[lOldParentIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === lSiblingIndex) {
                this.writeTopology(lOldParentIndex, lNewParentIndex, null, null, null);
            } else {
                this.writeTopology(lOldParentIndex, null, lNewParentIndex, null, null);
            }
        }

        // Set new parent AABB as union of sibling and leaf.
        this.writeAabb(lNewParentIndex, this.calculateUnionAabb(lSiblingIndex, lLeafIndex));

        // Track surface area of the new internal node.
        this.mCache.surface.totalInternalSurfaceArea += this.mCache.surface.nodes.get(lNewParentIndex)!;

        // Refit AABBs upward from grandparent to root.
        this.refitFrom(lOldParentIndex);

        // Update quality baseline after SAH-guided insertion.
        this.mCache.surface.optimalSurfaceArea = this.mCache.surface.totalInternalSurfaceArea;
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
        // Collect all currently stored objects.
        const lObjects: Array<T> = Array.from(this.mObjectToLeaf.keys());

        // Reset all node storage.
        this.mAvailableNodeIndices.length = 0;
        this.mNextFreshNodeIndex = 0;
        this.mCache.surface.totalInternalSurfaceArea = 0;
        this.mObjectToLeaf.clear();

        // Recreate leaf nodes for each object preserving their existing object indices.
        const lLeaves: Array<number> = new Array<number>(lObjects.length);
        for (let lIndex: number = 0; lIndex < lObjects.length; lIndex++) {
            const lObject: T = lObjects[lIndex];
            const lLeafIndex: number = this.allocateNode();
            lLeaves[lIndex] = lLeafIndex;

            const lObjectIndex: number = this.mObjectToIndex.get(lObject)!;
            const lBounds: IBoundable = this.mCache.boundable.objects.get(lObjectIndex)!;
            this.writeAabb(lLeafIndex, lBounds);
            this.writeTopology(lLeafIndex, BoundVolumeHierarchy.NODE_NULL_INDEX, BoundVolumeHierarchy.NODE_NULL_INDEX, BoundVolumeHierarchy.NODE_NULL_INDEX, lObjectIndex);

            this.mObjectToLeaf.set(lObject, lLeafIndex);
        }

        // Build tree top-down using SAH centroid midpoint split.
        this.mRootIndex = this.buildTopDown(lLeaves, 0, lLeaves.length);
        this.writeTopology(this.mRootIndex, null, null, BoundVolumeHierarchy.NODE_NULL_INDEX, null);

        // Record optimal surface area baseline.
        this.mCache.surface.optimalSurfaceArea = this.mCache.surface.totalInternalSurfaceArea;
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
            return;
        }

        const lLeafIndex: number = this.mObjectToLeaf.get(pObject)!;
        const lObjectIndex: number = this.mObjectToIndex.get(pObject)!;
        const lParentIndex: number = this.mBuffers.topology.view[lLeafIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];

        // Clean up object tracking.
        this.mObjectToLeaf.delete(pObject);
        this.mObjectToIndex.delete(pObject);
        this.mObjects[lObjectIndex] = null;
        this.mAvailableObjectIndices.push(lObjectIndex);

        // If the removed leaf was the root, the tree becomes empty.
        if (lParentIndex === BoundVolumeHierarchy.NODE_NULL_INDEX) {
            this.mRootIndex = BoundVolumeHierarchy.NODE_NULL_INDEX;
            this.mAvailableNodeIndices.push(lLeafIndex);
            this.mCache.surface.totalInternalSurfaceArea = 0;
            this.mCache.surface.optimalSurfaceArea = 0;
            return;
        }

        // Find the sibling of the removed leaf by checking which child of the parent is not the leaf.
        const lParentBase: number = lParentIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH;
        let lSiblingIndex: number;
        if (this.mBuffers.topology.view[lParentBase + BoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === lLeafIndex) {
            lSiblingIndex = this.mBuffers.topology.view[lParentBase + BoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];
        } else {
            lSiblingIndex = this.mBuffers.topology.view[lParentBase + BoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];
        }

        const lGrandparentIndex: number = this.mBuffers.topology.view[lParentBase + BoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];

        // Subtract the removed internal parent surface area from the total.
        this.mCache.surface.totalInternalSurfaceArea -= this.mCache.surface.nodes.get(lParentIndex)!;

        // Patch the sibling into the grandparent's slot, replacing the removed parent.
        if (lGrandparentIndex !== BoundVolumeHierarchy.NODE_NULL_INDEX) {
            if (this.mBuffers.topology.view[lGrandparentIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] === lParentIndex) {
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
            this.writeTopology(lSiblingIndex, null, null, BoundVolumeHierarchy.NODE_NULL_INDEX, null);
        }

        // Free the removed leaf and parent nodes.
        this.mAvailableNodeIndices.push(lLeafIndex);
        this.mAvailableNodeIndices.push(lParentIndex);

        // Update quality baseline after structural change.
        this.mCache.surface.optimalSurfaceArea = this.mCache.surface.totalInternalSurfaceArea;
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

        // Write objects bounds as nodes bounds as they are the same for leaf nodes and this allows us to reuse the cache for both.
        this.writeAabb(lLeafIndex, lBounds);

        // Cache the object bounds as they dont update so often.
        const lObjectIndex: number = this.mObjectToIndex.get(pObject)!;
        this.mCache.boundable.objects.set(lObjectIndex, lBounds);

        // Refit AABBs upward from the leaf's parent to root.
        this.refitFrom(this.mBuffers.topology.view[lLeafIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET]);
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

            this.writeTopology(lInternalIndex, lLeftLeaf, lRightLeaf, null, BoundVolumeHierarchy.OBJECT_NULL_INDEX);
            this.writeTopology(lLeftLeaf, null, null, lInternalIndex, null);
            this.writeTopology(lRightLeaf, null, null, lInternalIndex, null);

            // Recalculate the internal node AABB as the union of its two leaf children.
            this.writeAabb(lInternalIndex, this.calculateUnionAabb(lLeftLeaf, lRightLeaf));

            this.mCache.surface.totalInternalSurfaceArea += this.mCache.surface.nodes.get(lInternalIndex)!;
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
            const lBase: number = lLeaf * BoundVolumeHierarchy.AABB_STRIDE_LENGTH;
            const lCx: number = (this.mBuffers.aabb.view[lBase + BoundVolumeHierarchy.AABB_MIN_X_OFFSET] + this.mBuffers.aabb.view[lBase + BoundVolumeHierarchy.AABB_MAX_X_OFFSET]) * 0.5;
            const lCy: number = (this.mBuffers.aabb.view[lBase + BoundVolumeHierarchy.AABB_MIN_Y_OFFSET] + this.mBuffers.aabb.view[lBase + BoundVolumeHierarchy.AABB_MAX_Y_OFFSET]) * 0.5;
            const lCz: number = (this.mBuffers.aabb.view[lBase + BoundVolumeHierarchy.AABB_MIN_Z_OFFSET] + this.mBuffers.aabb.view[lBase + BoundVolumeHierarchy.AABB_MAX_Z_OFFSET]) * 0.5;

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

        this.writeTopology(lInternalIndex, lLeftChild, lRightChild, null, BoundVolumeHierarchy.OBJECT_NULL_INDEX);
        this.writeTopology(lLeftChild, null, null, lInternalIndex, null);
        this.writeTopology(lRightChild, null, null, lInternalIndex, null);

        // Recalculate the internal node AABB as the union of its children.
        this.writeAabb(lInternalIndex, this.calculateUnionAabb(lLeftChild, lRightChild));

        this.mCache.surface.totalInternalSurfaceArea += this.mCache.surface.nodes.get(lInternalIndex)!;
        return lInternalIndex;
    }

    /**
     * Calculate the union of two nodes' AABBs.
     *
     * @param pNodeOne - First source node index.
     * @param pNodeTwo - Second source node index.
     */
    private calculateUnionAabb(pNodeOne: number, pNodeTwo: number): WriteableBoundable {
        // Read source AABBs from cache.
        const lNodeABounds: WriteableBoundable = this.mCache.boundable.nodes.get(pNodeOne)!;
        const lNodeBBounds: WriteableBoundable = this.mCache.boundable.nodes.get(pNodeTwo)!;

        // Compute the union of the two AABBs.
        return {
           minX: Math.min(lNodeABounds.minX, lNodeBBounds.minX),
           minY: Math.min(lNodeABounds.minY, lNodeBBounds.minY),
           minZ: Math.min(lNodeABounds.minZ, lNodeBBounds.minZ),
           maxX: Math.max(lNodeABounds.maxX, lNodeBBounds.maxX),
           maxY: Math.max(lNodeABounds.maxY, lNodeBBounds.maxY),
           maxZ: Math.max(lNodeABounds.maxZ, lNodeBBounds.maxZ)
        }
    }

    /**
     * Compute the volume of the union of two AABBs.
     *
     * @param pNodeOneBounds - First AABB.
     * @param pNodeTwoBounds - Second AABB.
     *
     * @returns Volume of the union AABB.
     */
    private computeUnionVolume(pNodeOneBounds: IBoundable, pNodeTwoBounds: IBoundable): number {
        const lDx: number = Math.max(pNodeOneBounds.maxX, pNodeTwoBounds.maxX) - Math.min(pNodeOneBounds.minX, pNodeTwoBounds.minX);
        const lDy: number = Math.max(pNodeOneBounds.maxY, pNodeTwoBounds.maxY) - Math.min(pNodeOneBounds.minY, pNodeTwoBounds.minY);
        const lDz: number = Math.max(pNodeOneBounds.maxZ, pNodeTwoBounds.maxZ) - Math.min(pNodeOneBounds.minZ, pNodeTwoBounds.minZ);

        return lDx * lDy * lDz;
    }

    /**
     * Ensure the buffers can hold at least the given number of node capacity.
     * Doubles capacity until sufficient.
     *
     * @param pRequiredCapacity - Minimum number of node capacity needed.
     */
    private ensureCapacity(pRequiredCapacity: number): void {
        const lCurrentCapacity: number = this.mBuffers.aabb.view.length / BoundVolumeHierarchy.AABB_STRIDE_LENGTH;
        if (pRequiredCapacity <= lCurrentCapacity) {
            return;
        }

        // Grow the capacity in 64 node increments to avoid frequent small resizes.
        let lNewCapacity: number = lCurrentCapacity;
        lNewCapacity += (pRequiredCapacity - lCurrentCapacity + 63) & ~63;

        // Grow buffers with the new capacity.
        this.mBuffers.aabb.buffer.grow(lNewCapacity * BoundVolumeHierarchy.AABB_STRIDE_LENGTH * Float32Array.BYTES_PER_ELEMENT);
        this.mBuffers.topology.buffer.grow(lNewCapacity * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH * Int32Array.BYTES_PER_ELEMENT);

        // Update views to reflect the new buffer sizes.
        this.mBuffers.aabb.view = new Float32Array(this.mBuffers.aabb.buffer);
        this.mBuffers.topology.view = new Int32Array(this.mBuffers.topology.buffer);
    }

    /**
     * Find the best sibling for inserting a new leaf using smallest volume increase descent.
     * Descends to a leaf, picking the child whose AABB volume grows the least when unioned with the new leaf.
     *
     * @param pLeafIndex - Index of the new leaf node to insert.
     */
    private findBestSibling(pLeafIndex: number): number {
        const lLeafBounds: IBoundable = this.mCache.boundable.nodes.get(pLeafIndex)!;

        let lNode: number = this.mRootIndex;

        // Descend to a leaf, at each level picking the child with smaller volume increase.
        while (this.mBuffers.topology.view[lNode * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] !== BoundVolumeHierarchy.NODE_NULL_INDEX) {
            const lLeftNodeIndex: number = this.mBuffers.topology.view[lNode * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];
            const lRightNodeIndex: number = this.mBuffers.topology.view[lNode * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];

            // Read the cached surface area of the left and right child nodes.
            const lLeftVolume: number = this.mCache.surface.nodes.get(lLeftNodeIndex)!;
            const lRightVolume: number = this.mCache.surface.nodes.get(lRightNodeIndex)!;

            const lLeftBounds: WriteableBoundable = this.mCache.boundable.nodes.get(lLeftNodeIndex)!;
            const lRightBounds: WriteableBoundable = this.mCache.boundable.nodes.get(lRightNodeIndex)!;

            // Volume increase for each child when unioned with the new leaf.
            const lLeftVolumeIncrease: number = this.computeUnionVolume(lLeftBounds, lLeafBounds) - lLeftVolume;
            const lRightVolumeIncrease: number = this.computeUnionVolume(lRightBounds, lLeafBounds) - lRightVolume;

            // Descend toward the child with smaller volume increase.
            lNode = (lLeftVolumeIncrease <= lRightVolumeIncrease) ? lLeftNodeIndex : lRightNodeIndex;
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
            const lBase: number = lLeaf * BoundVolumeHierarchy.AABB_STRIDE_LENGTH;
            const lCentroid: number = (this.mBuffers.aabb.view[lBase + pAxis] + this.mBuffers.aabb.view[lBase + 3 + pAxis]) * 0.5;

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
        while (lCurrentNodeIndex !== BoundVolumeHierarchy.NODE_NULL_INDEX) {
            const lLeftNodeIndex: number = this.mBuffers.topology.view[lCurrentNodeIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET];
            const lRightNodeIndex: number = this.mBuffers.topology.view[lCurrentNodeIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET];

            // Subtract old surface area before recomputing.
            this.mCache.surface.totalInternalSurfaceArea -= this.mCache.surface.nodes.get(lCurrentNodeIndex)!;

            // Recompute AABB as union of children.
            this.writeAabb(lCurrentNodeIndex, this.calculateUnionAabb(lLeftNodeIndex, lRightNodeIndex));

            // Add new surface area after recomputing.
            this.mCache.surface.totalInternalSurfaceArea += this.mCache.surface.nodes.get(lCurrentNodeIndex)!;

            // Walk upward to parent.
            lCurrentNodeIndex = this.mBuffers.topology.view[lCurrentNodeIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH + BoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET];
        }
    }

    /**
     * Write AABB coordinates for a node.
     *
     * @param pNodeIndex - Index of the node.
     * @param pBounds - AABB bounds to write for the node.
     */
    private writeAabb(pNodeIndex: number, pBounds: WriteableBoundable): void {
        // Calculate the base indices for the source and target nodes' AABB fields.
        const lBaseIndexTarget: number = pNodeIndex * BoundVolumeHierarchy.AABB_STRIDE_LENGTH;
        
        // Write union to the target node.
        this.mBuffers.aabb.view[lBaseIndexTarget + BoundVolumeHierarchy.AABB_MIN_X_OFFSET] = pBounds.minX;
        this.mBuffers.aabb.view[lBaseIndexTarget + BoundVolumeHierarchy.AABB_MIN_Y_OFFSET] = pBounds.minY;
        this.mBuffers.aabb.view[lBaseIndexTarget + BoundVolumeHierarchy.AABB_MIN_Z_OFFSET] = pBounds.minZ;
        this.mBuffers.aabb.view[lBaseIndexTarget + BoundVolumeHierarchy.AABB_MAX_X_OFFSET] = pBounds.maxX;
        this.mBuffers.aabb.view[lBaseIndexTarget + BoundVolumeHierarchy.AABB_MAX_Y_OFFSET] = pBounds.maxY;
        this.mBuffers.aabb.view[lBaseIndexTarget + BoundVolumeHierarchy.AABB_MAX_Z_OFFSET] = pBounds.maxZ;

        // Cache the boundable for this node.
        this.mCache.boundable.nodes.set(pNodeIndex, pBounds);

        // Cache surface area.
        const lDx: number = pBounds.maxX - pBounds.minX;
        const lDy: number = pBounds.maxY - pBounds.minY;
        const lDz: number = pBounds.maxZ - pBounds.minZ;
        this.mCache.surface.nodes.set(pNodeIndex, 2.0 * (lDx * lDy + lDy * lDz + lDz * lDx));
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
        const lBaseIndex: number = pNodeIndex * BoundVolumeHierarchy.TOPOLOGY_STRIDE_LENGTH;

        // Write only the fields that are not null, allowing for partial updates.
        if (pLeftChildIndex !== null) {
            this.mBuffers.topology.view[lBaseIndex + BoundVolumeHierarchy.TOPOLOGY_LEFT_CHILD_OFFSET] = pLeftChildIndex;
        }
        if (pRightChildIndex !== null) {
            this.mBuffers.topology.view[lBaseIndex + BoundVolumeHierarchy.TOPOLOGY_RIGHT_CHILD_OFFSET] = pRightChildIndex;
        }
        if (pParentIndex !== null) {
            this.mBuffers.topology.view[lBaseIndex + BoundVolumeHierarchy.TOPOLOGY_PARENT_OFFSET] = pParentIndex;
        }
        if (pObjectIndex !== null) {
            this.mBuffers.topology.view[lBaseIndex + BoundVolumeHierarchy.TOPOLOGY_OBJECT_INDEX_OFFSET] = pObjectIndex;
        }
    }
}

type BoundVolumeHierarchyBuffers = {
    aabb: {
        buffer: SharedArrayBuffer;
        view: Float32Array<SharedArrayBuffer>;
    },
    topology: {
        buffer: SharedArrayBuffer;
        view: Int32Array<SharedArrayBuffer>;
    };
};

type BoundVolumeHierarchyCache = {
    boundable: {
        /**
         * Cache of boundable objects for each node, indexed by object index.
         */
        objects: Map<number, IBoundable>;

        /**
         * Cache of boundable objects for each node, indexed by node index.
         */
        nodes: Map<number, WriteableBoundable>;
    };
    surface: {
        /**
         * Cache of surface area values for each node, indexed by node index.
         */
        nodes: Map<number, number>;

        /**
         * Optimal surface area for the hierarchy.
         */
        optimalSurfaceArea: number;

        /**
         * Total internal surface area for the hierarchy.
         */
        totalInternalSurfaceArea: number;
    };
};

type WriteableBoundable = Writeable<IBoundable>;

export type BoundVolumeHierarchyFindCallback<T> = (pBounding: IBoundable, pObject: T | null) => boolean;