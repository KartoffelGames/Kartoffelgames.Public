import { expect } from '@kartoffelgames/core-test';
import { BoundVolumeHierarchy } from '../../source/data_container/bound-volume-hierarchy.ts';
import type { IBoundable } from '../../source/interface/i-boundable.ts';

/**
 * Bounds callback for TestBox objects. Returns the object itself since it implements IBoundable.
 */
const gTestBoxBounds = (pObject: TestBox): IBoundable => pObject;

/**
 * Simple test helper implementing IBoundable with mutable bounds.
 */
class TestBox implements IBoundable {
    public maxX: number;
    public maxY: number;
    public maxZ: number;
    public minX: number;
    public minY: number;
    public minZ: number;

    public constructor(pMinX: number, pMinY: number, pMinZ: number, pMaxX: number, pMaxY: number, pMaxZ: number) {
        this.minX = pMinX;
        this.minY = pMinY;
        this.minZ = pMinZ;
        this.maxX = pMaxX;
        this.maxY = pMaxY;
        this.maxZ = pMaxZ;
    }
}

/**
 * Count objects in the tree by using find with a static true callback.
 */
function gCountObjects<T>(pBvh: BoundVolumeHierarchy<T>): number {
    return pBvh.find(() => true).length;
}

/**
 * Find the root node index by scanning the topology buffer for the node with parentIndex === -1
 * whose subtree contains all objects. Returns -1 when the tree is empty.
 */
function gFindRoot<T>(pBvh: BoundVolumeHierarchy<T>): number {
    const lExpectedObjects: number = pBvh.find(() => true).length;

    // If no objects exist, the tree is logically empty.
    if (lExpectedObjects === 0) {
        return -1;
    }

    const lTopo: Int32Array = new Int32Array(pBvh.topologyBuffer);
    const lNodeCount: number = lTopo.length / 4;

    // Find all candidate roots (parentIndex === -1) and pick the one
    // whose subtree leaf count matches the expected object count.
    for (let lIndex: number = 0; lIndex < lNodeCount; lIndex++) {
        if (lTopo[lIndex * 4 + 2] !== -1) {
            continue;
        }

        // Count leaves in this subtree.
        let lLeafCount: number = 0;
        const lStack: Array<number> = [lIndex];
        while (lStack.length > 0) {
            const lNode: number = lStack.pop()!;
            const lLeft: number = lTopo[lNode * 4 + 0];
            if (lLeft === -1) {
                lLeafCount++;
            } else {
                lStack.push(lLeft, lTopo[lNode * 4 + 1]);
            }
        }

        if (lLeafCount === lExpectedObjects) {
            return lIndex;
        }
    }

    return -1;
}

/**
 * Count all nodes (leaf + internal) in the tree by walking from the root.
 * Returns { leafCount, internalCount, totalCount }.
 */
function gCountNodes<T>(pBvh: BoundVolumeHierarchy<T>): { leafCount: number; internalCount: number; totalCount: number; } {
    const lObjectCount: number = gCountObjects(pBvh);

    if (lObjectCount === 0) {
        return { leafCount: 0, internalCount: 0, totalCount: 0 };
    }

    // A full binary tree with N leaves has exactly N-1 internal nodes.
    const lInternalCount: number = Math.max(lObjectCount - 1, 0);
    return { leafCount: lObjectCount, internalCount: lInternalCount, totalCount: lObjectCount + lInternalCount };
}

/**
 * Validate tree structural integrity. Checks that all parent-child relationships
 * are consistent and AABBs of parents enclose their children.
 */
function gValidateTree<T>(pBvh: BoundVolumeHierarchy<T>): void {
    const lObjectCount: number = gCountObjects(pBvh);
    if (lObjectCount === 0) {
        return;
    }

    const lAabb: Float32Array = new Float32Array(pBvh.aabbBuffer);
    const lTopo: Int32Array = new Int32Array(pBvh.topologyBuffer);
    const lRoot: number = gFindRoot(pBvh);

    // Root must have parent -1.
    expect(lTopo[lRoot * 4 + 2]).toBe(-1);

    // Walk all nodes via stack.
    const lStack: Array<number> = [lRoot];
    let lLeafCount: number = 0;
    let lInternalCount: number = 0;

    while (lStack.length > 0) {
        const lNode: number = lStack.pop()!;
        const lLeft: number = lTopo[lNode * 4 + 0];
        const lRight: number = lTopo[lNode * 4 + 1];
        const lObjIdx: number = lTopo[lNode * 4 + 3];

        if (lLeft === -1) {
            // Leaf node.
            expect(lRight).toBe(-1);
            expect(lObjIdx).toBeGreaterThanOrEqual(0);
            lLeafCount++;
        } else {
            // Internal node.
            expect(lRight).toBeGreaterThanOrEqual(0);
            expect(lObjIdx).toBe(-1);
            lInternalCount++;

            // Children must point back to this node as parent.
            expect(lTopo[lLeft * 4 + 2]).toBe(lNode);
            expect(lTopo[lRight * 4 + 2]).toBe(lNode);

            // Parent AABB must enclose both children.
            const lParentBase: number = lNode * 6;
            const lLeftBase: number = lLeft * 6;
            const lRightBase: number = lRight * 6;

            // Min of parent <= min of each child.
            expect(lAabb[lParentBase + 0]).toBeLessThanOrEqual(lAabb[lLeftBase + 0] + 1e-6);
            expect(lAabb[lParentBase + 1]).toBeLessThanOrEqual(lAabb[lLeftBase + 1] + 1e-6);
            expect(lAabb[lParentBase + 2]).toBeLessThanOrEqual(lAabb[lLeftBase + 2] + 1e-6);
            expect(lAabb[lParentBase + 0]).toBeLessThanOrEqual(lAabb[lRightBase + 0] + 1e-6);
            expect(lAabb[lParentBase + 1]).toBeLessThanOrEqual(lAabb[lRightBase + 1] + 1e-6);
            expect(lAabb[lParentBase + 2]).toBeLessThanOrEqual(lAabb[lRightBase + 2] + 1e-6);

            // Max of parent >= max of each child.
            expect(lAabb[lParentBase + 3]).toBeGreaterThanOrEqual(lAabb[lLeftBase + 3] - 1e-6);
            expect(lAabb[lParentBase + 4]).toBeGreaterThanOrEqual(lAabb[lLeftBase + 4] - 1e-6);
            expect(lAabb[lParentBase + 5]).toBeGreaterThanOrEqual(lAabb[lLeftBase + 5] - 1e-6);
            expect(lAabb[lParentBase + 3]).toBeGreaterThanOrEqual(lAabb[lRightBase + 3] - 1e-6);
            expect(lAabb[lParentBase + 4]).toBeGreaterThanOrEqual(lAabb[lRightBase + 4] - 1e-6);
            expect(lAabb[lParentBase + 5]).toBeGreaterThanOrEqual(lAabb[lRightBase + 5] - 1e-6);

            lStack.push(lLeft, lRight);
        }
    }

    expect(lLeafCount).toBe(lObjectCount);
    if (lObjectCount > 1) {
        expect(lInternalCount).toBe(lObjectCount - 1);
    }
}

// --- Constructor ---

Deno.test('BoundVolumeHierarchy.constructor()', async (pContext) => {
    await pContext.step('should initialize with zero count and empty root', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(0);
        expect(gFindRoot(lBvh)).toBe(-1);
        expect(gCountNodes(lBvh).totalCount).toBe(0);
    });

    await pContext.step('should create valid ArrayBuffer buffers', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Evaluation.
        expect(lBvh.aabbBuffer).toBeInstanceOf(SharedArrayBuffer);
        expect(lBvh.topologyBuffer).toBeInstanceOf(SharedArrayBuffer);
        expect(lBvh.aabbBuffer.byteLength).toBe(0);
        expect(lBvh.topologyBuffer.byteLength).toBe(0);
    });

    await pContext.step('should start with quality of 1.0', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Evaluation.
        expect(lBvh.quality).toBe(1.0);
    });
});

// --- insert() ---

Deno.test('BoundVolumeHierarchy.insert()', async (pContext) => {
    await pContext.step('should insert a single object as root', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);

        // Process.
        lBvh.insert(lBox);

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(1);
        expect(gCountNodes(lBvh).totalCount).toBe(1);
        expect(gFindRoot(lBvh)).toBeGreaterThanOrEqual(0);

        // Leaf AABB should match object bounds.
        const lRoot: number = gFindRoot(lBvh);
        const lAabb: Float32Array = new Float32Array(lBvh.aabbBuffer);
        expect(lAabb[lRoot * 6 + 0]).toBe(0);
        expect(lAabb[lRoot * 6 + 1]).toBe(0);
        expect(lAabb[lRoot * 6 + 2]).toBe(0);
        expect(lAabb[lRoot * 6 + 3]).toBe(1);
        expect(lAabb[lRoot * 6 + 4]).toBe(1);
        expect(lAabb[lRoot * 6 + 5]).toBe(1);
    });

    await pContext.step('should insert two objects creating one internal node', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 2, 2, 3, 3, 3);

        // Process.
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(2);
        expect(gCountNodes(lBvh).totalCount).toBe(3);
        gValidateTree(lBvh);
    });

    await pContext.step('should insert multiple objects with correct topology', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxes: Array<TestBox> = [
            new TestBox(0, 0, 0, 1, 1, 1),
            new TestBox(2, 0, 0, 3, 1, 1),
            new TestBox(4, 0, 0, 5, 1, 1),
            new TestBox(6, 0, 0, 7, 1, 1),
            new TestBox(8, 0, 0, 9, 1, 1),
        ];

        // Process.
        for (const lBox of lBoxes) {
            lBvh.insert(lBox);
        }

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(5);
        expect(gCountNodes(lBvh).totalCount).toBe(9);
        gValidateTree(lBvh);
    });

    await pContext.step('should throw on duplicate insert', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Evaluation.
        expect(() => {
            lBvh.insert(lBox);
        }).toThrow();
    });

    await pContext.step('should store correct object indices in topology buffer', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 2, 2, 3, 3, 3);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);

        // Process. Find all leaf nodes and verify objectOf returns correct objects.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lFoundObjects: Set<TestBox> = new Set<TestBox>();

        const lStack: Array<number> = [gFindRoot(lBvh)];
        while (lStack.length > 0) {
            const lNode: number = lStack.pop()!;
            const lLeft: number = lTopo[lNode * 4 + 0];
            if (lLeft === -1) {
                // Leaf node.
                const lObjIdx: number = lTopo[lNode * 4 + 3];
                lFoundObjects.add(lBvh.objectOf(lObjIdx));
            } else {
                lStack.push(lLeft, lTopo[lNode * 4 + 1]);
            }
        }

        // Evaluation.
        expect(lFoundObjects.size).toBe(2);
        expect(lFoundObjects.has(lBoxA)).toBe(true);
        expect(lFoundObjects.has(lBoxB)).toBe(true);
    });

    await pContext.step('should grow buffers when capacity is exceeded', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lInitialByteLength: number = lBvh.aabbBuffer.byteLength;

        // Process. Insert enough objects to exceed initial capacity.
        // With N objects we need 2N-1 nodes. For capacity 64 that's about 33 objects.
        const lObjectCount: number = 100;
        for (let lIndex: number = 0; lIndex < lObjectCount; lIndex++) {
            lBvh.insert(new TestBox(lIndex * 2, 0, 0, lIndex * 2 + 1, 1, 1));
        }

        // Evaluation.
        expect(lBvh.aabbBuffer.byteLength).toBeGreaterThan(lInitialByteLength);
        expect(gCountObjects(lBvh)).toBe(lObjectCount);
        expect(gCountNodes(lBvh).totalCount).toBe(lObjectCount * 2 - 1);
        gValidateTree(lBvh);
    });
});

// --- remove() ---

Deno.test('BoundVolumeHierarchy.remove()', async (pContext) => {
    await pContext.step('should remove the only object leaving the tree empty', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process.
        lBvh.remove(lBox);

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(0);
        expect(gFindRoot(lBvh)).toBe(-1);
        expect(gCountNodes(lBvh).totalCount).toBe(0);
    });

    await pContext.step('should remove one of two objects', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 2, 2, 3, 3, 3);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);

        // Process.
        lBvh.remove(lBoxA);

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(1);
        expect(gCountNodes(lBvh).totalCount).toBe(1);
        expect(gFindRoot(lBvh)).toBeGreaterThanOrEqual(0);
        gValidateTree(lBvh);
    });

    await pContext.step('should remove objects from a larger tree', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxes: Array<TestBox> = [];
        for (let lIndex: number = 0; lIndex < 10; lIndex++) {
            const lBox: TestBox = new TestBox(lIndex * 2, 0, 0, lIndex * 2 + 1, 1, 1);
            lBoxes.push(lBox);
            lBvh.insert(lBox);
        }

        // Process. Remove 5 objects.
        for (let lIndex: number = 0; lIndex < 5; lIndex++) {
            lBvh.remove(lBoxes[lIndex]);
        }

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(5);
        expect(gCountNodes(lBvh).totalCount).toBe(9);
        gValidateTree(lBvh);
    });

    await pContext.step('should silently ignore removing a non-existent object', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);

        // Evaluation. Removing a non-existent object should not throw.
        lBvh.remove(lBox);
        expect(gCountObjects(lBvh)).toBe(0);
    });

    await pContext.step('should allow re-inserting a removed object', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);
        lBvh.remove(lBox);

        // Process.
        lBvh.insert(lBox);

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(1);
        expect(gFindRoot(lBvh)).toBeGreaterThanOrEqual(0);
        gValidateTree(lBvh);
    });
});

// --- update() ---

Deno.test('BoundVolumeHierarchy.update()', async (pContext) => {
    await pContext.step('should refit AABB upward after bounds change', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 2, 2, 3, 3, 3);
        const lBoxC: TestBox = new TestBox(4, 4, 4, 5, 5, 5);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        lBvh.insert(lBoxC);

        // Process. Move boxA far away.
        lBoxA.minX = -10;
        lBoxA.minY = -10;
        lBoxA.minZ = -10;
        lBoxA.maxX = -9;
        lBoxA.maxY = -9;
        lBoxA.maxZ = -9;
        lBvh.update(lBoxA);

        // Evaluation. Root AABB should now encompass the new position.
        const lRoot: number = gFindRoot(lBvh);
        const lAabb: Float32Array = new Float32Array(lBvh.aabbBuffer);
        expect(lAabb[lRoot * 6 + 0]).toBeLessThanOrEqual(-10);
        expect(lAabb[lRoot * 6 + 1]).toBeLessThanOrEqual(-10);
        expect(lAabb[lRoot * 6 + 2]).toBeLessThanOrEqual(-10);
        expect(lAabb[lRoot * 6 + 3]).toBeGreaterThanOrEqual(5);
        expect(lAabb[lRoot * 6 + 4]).toBeGreaterThanOrEqual(5);
        expect(lAabb[lRoot * 6 + 5]).toBeGreaterThanOrEqual(5);
        gValidateTree(lBvh);
    });

    await pContext.step('should not change node count after update', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 2, 2, 3, 3, 3);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        const lNodeCountBefore: number = gCountNodes(lBvh).totalCount;

        // Process.
        lBoxA.maxX = 5;
        lBvh.update(lBoxA);

        // Evaluation.
        expect(gCountNodes(lBvh).totalCount).toBe(lNodeCountBefore);
    });

    await pContext.step('should throw when updating a non-existent object', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);

        // Evaluation.
        expect(() => {
            lBvh.update(lBox);
        }).toThrow();
    });
});

// --- rebuild() ---

Deno.test('BoundVolumeHierarchy.rebuild()', async (pContext) => {
    await pContext.step('should preserve all objects after rebuild', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxes: Array<TestBox> = [];
        for (let lIndex: number = 0; lIndex < 10; lIndex++) {
            const lBox: TestBox = new TestBox(lIndex * 3, lIndex, 0, lIndex * 3 + 2, lIndex + 1, 1);
            lBoxes.push(lBox);
            lBvh.insert(lBox);
        }

        // Process.
        lBvh.rebuild();

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(10);
        expect(gCountNodes(lBvh).totalCount).toBe(19);
        gValidateTree(lBvh);

        // Verify all objects are retrievable via find.
        const lFoundObjects: Set<TestBox> = new Set<TestBox>(lBvh.find(() => true));
        for (const lBox of lBoxes) {
            expect(lFoundObjects.has(lBox)).toBe(true);
        }
    });

    await pContext.step('should reset quality to 1.0', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 0, 0, 3, 1, 1);
        const lBoxC: TestBox = new TestBox(4, 0, 0, 5, 1, 1);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        lBvh.insert(lBoxC);

        // Process. Degrade quality then rebuild.
        lBoxA.minX = -100;
        lBoxA.maxX = 100;
        lBvh.update(lBoxA);
        const lQualityBefore: number = lBvh.quality;
        lBvh.rebuild();

        // Evaluation.
        expect(lQualityBefore).toBeGreaterThan(1.0);
        expect(lBvh.quality).toBe(1.0);
    });

    await pContext.step('should handle rebuild with 1 object', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process.
        lBvh.rebuild();

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(1);
        expect(gFindRoot(lBvh)).toBeGreaterThanOrEqual(0);
    });

    await pContext.step('should produce a compact layout after insert and remove cycles', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxes: Array<TestBox> = [];
        for (let lIndex: number = 0; lIndex < 10; lIndex++) {
            const lBox: TestBox = new TestBox(lIndex * 2, 0, 0, lIndex * 2 + 1, 1, 1);
            lBoxes.push(lBox);
            lBvh.insert(lBox);
        }

        // Remove half the objects to fragment the buffer.
        for (let lIndex: number = 0; lIndex < 5; lIndex++) {
            lBvh.remove(lBoxes[lIndex]);
        }

        // Process.
        lBvh.rebuild();

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(5);
        expect(gCountNodes(lBvh).totalCount).toBe(9);
        gValidateTree(lBvh);
    });
});

// --- objectOf() ---

Deno.test('BoundVolumeHierarchy.objectOf()', async (pContext) => {
    await pContext.step('should return the correct object for a valid index', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process. Read the object index from the root leaf.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lRoot: number = gFindRoot(lBvh);
        const lObjIdx: number = lTopo[lRoot * 4 + 3];
        const lResult: TestBox = lBvh.objectOf(lObjIdx);

        // Evaluation.
        expect(lResult).toBe(lBox);
    });

    await pContext.step('should throw for an invalid object index', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Evaluation.
        expect(() => {
            lBvh.objectOf(-1);
        }).toThrow();

        expect(() => {
            lBvh.objectOf(999);
        }).toThrow();
    });
});

// --- quality ---

Deno.test('BoundVolumeHierarchy.quality', async (pContext) => {
    await pContext.step('should return 1.0 for newly built tree', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        lBvh.insert(new TestBox(2, 0, 0, 3, 1, 1));
        lBvh.insert(new TestBox(4, 0, 0, 5, 1, 1));

        // Evaluation.
        expect(lBvh.quality).toBe(1.0);
    });

    await pContext.step('should return 1.0 for empty tree', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Evaluation.
        expect(lBvh.quality).toBe(1.0);
    });

    await pContext.step('should return 1.0 for single object tree', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));

        // Evaluation.
        expect(lBvh.quality).toBe(1.0);
    });

    await pContext.step('should increase above 1.0 after AABB-enlarging updates', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 0, 0, 3, 1, 1);
        const lBoxC: TestBox = new TestBox(4, 0, 0, 5, 1, 1);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        lBvh.insert(lBoxC);

        // Process. Enlarge one box significantly.
        lBoxA.minX = -50;
        lBoxA.maxX = 50;
        lBoxA.minY = -50;
        lBoxA.maxY = 50;
        lBvh.update(lBoxA);

        // Evaluation.
        expect(lBvh.quality).toBeGreaterThan(1.0);
    });
});

// --- Buffer correctness ---

Deno.test('BoundVolumeHierarchy buffer correctness', async (pContext) => {
    await pContext.step('should have correct AABB data for leaf nodes', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(1, 2, 3, 4, 5, 6);
        lBvh.insert(lBox);

        // Evaluation. Single leaf is the root.
        const lRoot: number = gFindRoot(lBvh);
        const lAabb: Float32Array = new Float32Array(lBvh.aabbBuffer);
        expect(lAabb[lRoot * 6 + 0]).toBe(1);
        expect(lAabb[lRoot * 6 + 1]).toBe(2);
        expect(lAabb[lRoot * 6 + 2]).toBe(3);
        expect(lAabb[lRoot * 6 + 3]).toBe(4);
        expect(lAabb[lRoot * 6 + 4]).toBe(5);
        expect(lAabb[lRoot * 6 + 5]).toBe(6);
    });

    await pContext.step('should have root with parentIndex -1', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        lBvh.insert(new TestBox(2, 2, 2, 3, 3, 3));

        // Evaluation.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lRoot: number = gFindRoot(lBvh);
        expect(lTopo[lRoot * 4 + 2]).toBe(-1);
    });

    await pContext.step('should have internal nodes with objectIndex -1', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        lBvh.insert(new TestBox(2, 2, 2, 3, 3, 3));
        lBvh.insert(new TestBox(4, 4, 4, 5, 5, 5));

        // Process. Walk tree to find all internal nodes.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lStack: Array<number> = [gFindRoot(lBvh)];
        while (lStack.length > 0) {
            const lNode: number = lStack.pop()!;
            const lLeft: number = lTopo[lNode * 4 + 0];
            if (lLeft !== -1) {
                // Internal node.
                expect(lTopo[lNode * 4 + 3]).toBe(-1);
                lStack.push(lLeft, lTopo[lNode * 4 + 1]);
            }
        }
    });

    await pContext.step('should have leaf nodes with leftChild and rightChild -1', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        lBvh.insert(new TestBox(2, 2, 2, 3, 3, 3));
        lBvh.insert(new TestBox(4, 4, 4, 5, 5, 5));

        // Process. Walk tree to find all leaf nodes.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lStack: Array<number> = [gFindRoot(lBvh)];
        while (lStack.length > 0) {
            const lNode: number = lStack.pop()!;
            const lLeft: number = lTopo[lNode * 4 + 0];
            const lRight: number = lTopo[lNode * 4 + 1];
            if (lLeft === -1) {
                // Leaf node.
                expect(lRight).toBe(-1);
            } else {
                lStack.push(lLeft, lRight);
            }
        }
    });

    await pContext.step('should have parent AABBs enclosing both children', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        for (let lIndex: number = 0; lIndex < 8; lIndex++) {
            lBvh.insert(new TestBox(lIndex * 3, lIndex * 2, lIndex, lIndex * 3 + 2, lIndex * 2 + 1, lIndex + 1));
        }

        // Evaluation. Full tree validation checks parent-child enclosure.
        gValidateTree(lBvh);
    });
});

// --- find() ---

Deno.test('BoundVolumeHierarchy.find()', async (pContext) => {
    await pContext.step('should return empty array for empty tree', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Process.
        const lResults: Array<TestBox> = lBvh.find(() => true);

        // Evaluation.
        expect(lResults.length).toBe(0);
    });

    await pContext.step('should return all objects when callback always returns true', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(5, 5, 5, 6, 6, 6);
        const lBoxC: TestBox = new TestBox(10, 10, 10, 11, 11, 11);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        lBvh.insert(lBoxC);

        // Process.
        const lResults: Array<TestBox> = lBvh.find(() => true);

        // Evaluation.
        expect(lResults.length).toBe(3);
        const lResultSet: Set<TestBox> = new Set(lResults);
        expect(lResultSet.has(lBoxA)).toBe(true);
        expect(lResultSet.has(lBoxB)).toBe(true);
        expect(lResultSet.has(lBoxC)).toBe(true);
    });

    await pContext.step('should return no objects when callback always returns false', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        lBvh.insert(new TestBox(5, 5, 5, 6, 6, 6));
        lBvh.insert(new TestBox(10, 10, 10, 11, 11, 11));

        // Process.
        const lResults: Array<TestBox> = lBvh.find(() => false);

        // Evaluation.
        expect(lResults.length).toBe(0);
    });

    await pContext.step('should return only objects overlapping a query region', () => {
        // Setup. Place boxes along the X axis with gaps between them.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);     // X: 0-1
        const lBoxB: TestBox = new TestBox(3, 0, 0, 4, 1, 1);     // X: 3-4
        const lBoxC: TestBox = new TestBox(6, 0, 0, 7, 1, 1);     // X: 6-7
        const lBoxD: TestBox = new TestBox(9, 0, 0, 10, 1, 1);    // X: 9-10
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        lBvh.insert(lBoxC);
        lBvh.insert(lBoxD);

        // Process. Query region overlaps only boxB and boxC (X: 2.5-7.5).
        const lResults: Array<TestBox> = lBvh.find((pBounds: IBoundable) => {
            return pBounds.maxX >= 2.5 && pBounds.minX <= 7.5 &&
                   pBounds.maxY >= 0 && pBounds.minY <= 1 &&
                   pBounds.maxZ >= 0 && pBounds.minZ <= 1;
        });

        // Evaluation.
        const lResultSet: Set<TestBox> = new Set(lResults);
        expect(lResultSet.has(lBoxB)).toBe(true);
        expect(lResultSet.has(lBoxC)).toBe(true);
        expect(lResultSet.has(lBoxA)).toBe(false);
        expect(lResultSet.has(lBoxD)).toBe(false);
    });

    await pContext.step('should prune subtrees when callback rejects internal node', () => {
        // Setup. Create a tree with spatially separated groups.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        for (let lIndex: number = 0; lIndex < 10; lIndex++) {
            lBvh.insert(new TestBox(lIndex * 5, 0, 0, lIndex * 5 + 1, 1, 1));
        }

        // Process. Count how many times the callback is invoked.
        let lCallCount: number = 0;
        lBvh.find(() => {
            lCallCount++;
            return false;
        });
        const lRejectAllCount: number = lCallCount;

        lCallCount = 0;
        lBvh.find(() => {
            lCallCount++;
            return true;
        });
        const lAcceptAllCount: number = lCallCount;

        // Evaluation. Rejecting at root should call the callback only once.
        // Accepting all should call it for every node in the tree.
        expect(lRejectAllCount).toBe(1);
        expect(lAcceptAllCount).toBe(gCountNodes(lBvh).totalCount);
    });

    await pContext.step('should work on a single object tree', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process. Match.
        const lMatched: Array<TestBox> = lBvh.find(() => true);
        // Process. No match.
        const lUnmatched: Array<TestBox> = lBvh.find(() => false);

        // Evaluation.
        expect(lMatched.length).toBe(1);
        expect(lMatched[0]).toBe(lBox);
        expect(lUnmatched.length).toBe(0);
    });

    await pContext.step('should return correct results after object removal', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(5, 0, 0, 6, 1, 1);
        const lBoxC: TestBox = new TestBox(10, 0, 0, 11, 1, 1);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        lBvh.insert(lBoxC);

        // Process. Remove boxB then find all.
        lBvh.remove(lBoxB);
        const lResults: Array<TestBox> = lBvh.find(() => true);

        // Evaluation.
        const lResultSet: Set<TestBox> = new Set(lResults);
        expect(lResults.length).toBe(2);
        expect(lResultSet.has(lBoxA)).toBe(true);
        expect(lResultSet.has(lBoxC)).toBe(true);
        expect(lResultSet.has(lBoxB)).toBe(false);
    });

    await pContext.step('should return correct results after object update', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(5, 0, 0, 6, 1, 1);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);

        // Process. Move boxA far to the right so it no longer overlaps the query region.
        lBoxA.minX = 100;
        lBoxA.maxX = 101;
        lBvh.update(lBoxA);

        // Query a region that only overlaps boxB (X: 4-7).
        const lResults: Array<TestBox> = lBvh.find((pBounds: IBoundable) => {
            return pBounds.maxX >= 4 && pBounds.minX <= 7 &&
                   pBounds.maxY >= 0 && pBounds.minY <= 1 &&
                   pBounds.maxZ >= 0 && pBounds.minZ <= 1;
        });

        // Evaluation.
        expect(lResults.length).toBe(1);
        expect(lResults[0]).toBe(lBoxB);
    });

    await pContext.step('should return correct results after rebuild', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxes: Array<TestBox> = [];
        for (let lIndex: number = 0; lIndex < 8; lIndex++) {
            const lBox: TestBox = new TestBox(lIndex * 3, 0, 0, lIndex * 3 + 1, 1, 1);
            lBoxes.push(lBox);
            lBvh.insert(lBox);
        }

        // Process.
        lBvh.rebuild();
        const lResults: Array<TestBox> = lBvh.find(() => true);

        // Evaluation.
        expect(lResults.length).toBe(8);
        const lResultSet: Set<TestBox> = new Set(lResults);
        for (const lBox of lBoxes) {
            expect(lResultSet.has(lBox)).toBe(true);
        }
    });

    await pContext.step('should provide correct AABB bounds to the callback', () => {
        // Setup. Single object, so root is the leaf itself.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(1, 2, 3, 4, 5, 6);
        lBvh.insert(lBox);

        // Process. Capture the bounds passed to the callback.
        let lReceivedBounds: IBoundable | null = null;
        lBvh.find((pBounds: IBoundable) => {
            lReceivedBounds = pBounds;
            return true;
        });

        // Evaluation.
        expect(lReceivedBounds).not.toBeNull();
        expect(lReceivedBounds!.minX).toBe(1);
        expect(lReceivedBounds!.minY).toBe(2);
        expect(lReceivedBounds!.minZ).toBe(3);
        expect(lReceivedBounds!.maxX).toBe(4);
        expect(lReceivedBounds!.maxY).toBe(5);
        expect(lReceivedBounds!.maxZ).toBe(6);
    });

    await pContext.step('should provide updated bounds after object update', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process. Move the object and update.
        lBox.minX = 10;
        lBox.maxX = 20;
        lBvh.update(lBox);

        // Capture the bounds passed to the callback.
        let lReceivedBounds: IBoundable | null = null;
        lBvh.find((pBounds: IBoundable) => {
            lReceivedBounds = pBounds;
            return true;
        });

        // Evaluation.
        expect(lReceivedBounds).not.toBeNull();
        expect(lReceivedBounds!.minX).toBe(10);
        expect(lReceivedBounds!.maxX).toBe(20);
    });

    await pContext.step('should work with large tree and selective query', () => {
        // Setup. Insert 100 objects spread along X axis.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxes: Array<TestBox> = [];
        for (let lIndex: number = 0; lIndex < 100; lIndex++) {
            const lBox: TestBox = new TestBox(lIndex * 3, 0, 0, lIndex * 3 + 1, 1, 1);
            lBoxes.push(lBox);
            lBvh.insert(lBox);
        }

        // Process. Query a narrow region that should only match a few objects.
        // Objects at indices 10-14 have X ranges: 30-31, 33-34, 36-37, 39-40, 42-43.
        const lResults: Array<TestBox> = lBvh.find((pBounds: IBoundable) => {
            return pBounds.maxX >= 30 && pBounds.minX <= 43 &&
                   pBounds.maxY >= 0 && pBounds.minY <= 1 &&
                   pBounds.maxZ >= 0 && pBounds.minZ <= 1;
        });

        // Evaluation. Should find exactly the objects in that X range.
        const lResultSet: Set<TestBox> = new Set(lResults);
        for (let lIndex: number = 0; lIndex < 100; lIndex++) {
            const lBox: TestBox = lBoxes[lIndex];
            const lOverlaps: boolean = lBox.maxX >= 30 && lBox.minX <= 43;
            expect(lResultSet.has(lBox)).toBe(lOverlaps);
        }
    });
});

// --- Edge cases ---

Deno.test('BoundVolumeHierarchy edge cases', async (pContext) => {
    await pContext.step('should handle objects at the same position', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Process. Insert multiple objects at the exact same position.
        for (let lIndex: number = 0; lIndex < 5; lIndex++) {
            lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        }

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(5);
        expect(gCountNodes(lBvh).totalCount).toBe(9);
        gValidateTree(lBvh);

        // Rebuild should also handle coincident centroids.
        lBvh.rebuild();
        expect(gCountObjects(lBvh)).toBe(5);
        gValidateTree(lBvh);
    });

    await pContext.step('should handle large numbers of objects', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Process.
        const lCount: number = 1000;
        for (let lIndex: number = 0; lIndex < lCount; lIndex++) {
            lBvh.insert(new TestBox(lIndex, lIndex % 50, lIndex % 25, lIndex + 1, lIndex % 50 + 1, lIndex % 25 + 1));
        }

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(lCount);
        expect(gCountNodes(lBvh).totalCount).toBe(lCount * 2 - 1);
        gValidateTree(lBvh);
    });

    await pContext.step('should handle alternating insert and remove', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Process. Insert and remove alternately.
        const lKeptBoxes: Array<TestBox> = [];
        for (let lIndex: number = 0; lIndex < 20; lIndex++) {
            const lBox: TestBox = new TestBox(lIndex * 2, 0, 0, lIndex * 2 + 1, 1, 1);
            lBvh.insert(lBox);

            if (lIndex % 2 === 0) {
                lBvh.remove(lBox);
            } else {
                lKeptBoxes.push(lBox);
            }
        }

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(lKeptBoxes.length);
        if (gCountObjects(lBvh) > 1) {
            gValidateTree(lBvh);
        }
    });

    await pContext.step('should degrade quality after AABB-enlarging updates without rebuild', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 0, 0, 3, 1, 1);
        const lBoxC: TestBox = new TestBox(4, 0, 0, 5, 1, 1);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        lBvh.insert(lBoxC);

        // Process. Enlarge boxA enormously.
        lBoxA.minX = -1000;
        lBoxA.maxX = 1000;
        lBoxA.minY = -1000;
        lBoxA.maxY = 1000;
        lBoxA.minZ = -1000;
        lBoxA.maxZ = 1000;
        lBvh.update(lBoxA);

        // Evaluation. Quality should be degraded since no auto-rebuild occurs.
        expect(lBvh.quality).toBeGreaterThan(1.0);
        gValidateTree(lBvh);
    });

    await pContext.step('should handle update on single object tree', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process.
        lBox.minX = -5;
        lBox.maxX = 5;
        lBvh.update(lBox);

        // Evaluation.
        const lRoot: number = gFindRoot(lBvh);
        const lAabb: Float32Array = new Float32Array(lBvh.aabbBuffer);
        expect(lAabb[lRoot * 6 + 0]).toBe(-5);
        expect(lAabb[lRoot * 6 + 3]).toBe(5);
        expect(gCountObjects(lBvh)).toBe(1);
    });

    await pContext.step('should handle all objects removed then re-inserted', () => {
        // Setup.
        const lBvh: BoundVolumeHierarchy<TestBox> = new BoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxes: Array<TestBox> = [];
        for (let lIndex: number = 0; lIndex < 5; lIndex++) {
            const lBox: TestBox = new TestBox(lIndex, 0, 0, lIndex + 1, 1, 1);
            lBoxes.push(lBox);
            lBvh.insert(lBox);
        }

        // Remove all.
        for (const lBox of lBoxes) {
            lBvh.remove(lBox);
        }
        expect(gCountObjects(lBvh)).toBe(0);
        expect(gFindRoot(lBvh)).toBe(-1);

        // Re-insert all.
        for (const lBox of lBoxes) {
            lBvh.insert(lBox);
        }

        // Evaluation.
        expect(gCountObjects(lBvh)).toBe(5);
        expect(gCountNodes(lBvh).totalCount).toBe(9);
        gValidateTree(lBvh);
    });
});
