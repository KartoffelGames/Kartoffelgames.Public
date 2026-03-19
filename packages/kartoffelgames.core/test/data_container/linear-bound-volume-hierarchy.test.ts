import { expect } from '@kartoffelgames/core-test';
import { LinearBoundVolumeHierarchy } from '../../source/data_container/linear-bound-volume-hierarchy.ts';
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
 * Validate tree structural integrity. Checks that all parent-child relationships
 * are consistent and AABBs of parents enclose their children.
 */
function gValidateTree<T>(pBvh: LinearBoundVolumeHierarchy<T>): void {
    if (pBvh.count === 0) {
        return;
    }

    const lAabb: Float32Array = new Float32Array(pBvh.aabbBuffer);
    const lTopo: Int32Array = new Int32Array(pBvh.topologyBuffer);
    const lRoot: number = pBvh.rootIndex;

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

    expect(lLeafCount).toBe(pBvh.count);
    if (pBvh.count > 1) {
        expect(lInternalCount).toBe(pBvh.count - 1);
    }
}

// --- Constructor ---

Deno.test('LinearBoundVolumeHierarchy.constructor()', async (pContext) => {
    await pContext.step('should initialize with zero count and empty root', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Evaluation.
        expect(lBvh.count).toBe(0);
        expect(lBvh.rootIndex).toBe(-1);
        expect(lBvh.nodeCount).toBe(0);
    });

    await pContext.step('should create valid ArrayBuffer buffers', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Evaluation.
        expect(lBvh.aabbBuffer).toBeInstanceOf(SharedArrayBuffer);
        expect(lBvh.topologyBuffer).toBeInstanceOf(SharedArrayBuffer);
        expect(lBvh.aabbBuffer.byteLength).toBe(0);
        expect(lBvh.topologyBuffer.byteLength).toBe(0);
    });

    await pContext.step('should accept a custom rebuild threshold', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds, 5.0);

        // Evaluation.
        expect(lBvh.quality).toBe(1.0);
    });
});

// --- insert() ---

Deno.test('LinearBoundVolumeHierarchy.insert()', async (pContext) => {
    await pContext.step('should insert a single object as root', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);

        // Process.
        lBvh.insert(lBox);

        // Evaluation.
        expect(lBvh.count).toBe(1);
        expect(lBvh.nodeCount).toBe(1);
        expect(lBvh.rootIndex).toBeGreaterThanOrEqual(0);

        // Leaf AABB should match object bounds.
        const lRoot: number = lBvh.rootIndex;
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
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 2, 2, 3, 3, 3);

        // Process.
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);

        // Evaluation.
        expect(lBvh.count).toBe(2);
        expect(lBvh.nodeCount).toBe(3);
        gValidateTree(lBvh);
    });

    await pContext.step('should insert multiple objects with correct topology', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
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
        expect(lBvh.count).toBe(5);
        expect(lBvh.nodeCount).toBe(9);
        gValidateTree(lBvh);
    });

    await pContext.step('should throw on duplicate insert', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Evaluation.
        expect(() => {
            lBvh.insert(lBox);
        }).toThrow();
    });

    await pContext.step('should store correct object indices in topology buffer', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 2, 2, 3, 3, 3);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);

        // Process. Find all leaf nodes and verify objectOf returns correct objects.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lFoundObjects: Set<TestBox> = new Set<TestBox>();

        const lStack: Array<number> = [lBvh.rootIndex];
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
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lInitialCapacity: number = lBvh.capacity;

        // Process. Insert enough objects to exceed initial capacity.
        // With N objects we need 2N-1 nodes. For capacity 64 that's about 33 objects.
        const lObjectCount: number = 100;
        for (let lIndex: number = 0; lIndex < lObjectCount; lIndex++) {
            lBvh.insert(new TestBox(lIndex * 2, 0, 0, lIndex * 2 + 1, 1, 1));
        }

        // Evaluation.
        expect(lBvh.capacity).toBeGreaterThan(lInitialCapacity);
        expect(lBvh.count).toBe(lObjectCount);
        expect(lBvh.nodeCount).toBe(lObjectCount * 2 - 1);
        gValidateTree(lBvh);
    });
});

// --- remove() ---

Deno.test('LinearBoundVolumeHierarchy.remove()', async (pContext) => {
    await pContext.step('should remove the only object leaving the tree empty', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process.
        lBvh.remove(lBox);

        // Evaluation.
        expect(lBvh.count).toBe(0);
        expect(lBvh.rootIndex).toBe(-1);
        expect(lBvh.nodeCount).toBe(0);
    });

    await pContext.step('should remove one of two objects', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 2, 2, 3, 3, 3);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);

        // Process.
        lBvh.remove(lBoxA);

        // Evaluation.
        expect(lBvh.count).toBe(1);
        expect(lBvh.nodeCount).toBe(1);
        expect(lBvh.rootIndex).toBeGreaterThanOrEqual(0);
        gValidateTree(lBvh);
    });

    await pContext.step('should remove objects from a larger tree', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
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
        expect(lBvh.count).toBe(5);
        expect(lBvh.nodeCount).toBe(9);
        gValidateTree(lBvh);
    });

    await pContext.step('should throw when removing a non-existent object', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);

        // Evaluation.
        expect(() => {
            lBvh.remove(lBox);
        }).toThrow();
    });

    await pContext.step('should allow re-inserting a removed object', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);
        lBvh.remove(lBox);

        // Process.
        lBvh.insert(lBox);

        // Evaluation.
        expect(lBvh.count).toBe(1);
        expect(lBvh.rootIndex).toBeGreaterThanOrEqual(0);
        gValidateTree(lBvh);
    });
});

// --- update() ---

Deno.test('LinearBoundVolumeHierarchy.update()', async (pContext) => {
    await pContext.step('should refit AABB upward after bounds change', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
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
        const lRoot: number = lBvh.rootIndex;
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
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 2, 2, 3, 3, 3);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        const lNodeCountBefore: number = lBvh.nodeCount;

        // Process.
        lBoxA.maxX = 5;
        lBvh.update(lBoxA);

        // Evaluation.
        expect(lBvh.nodeCount).toBe(lNodeCountBefore);
    });

    await pContext.step('should trigger auto-rebuild when quality degrades', () => {
        // Setup. Use a very low threshold.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds, 1.01);
        const lBoxA: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        const lBoxB: TestBox = new TestBox(2, 0, 0, 3, 1, 1);
        const lBoxC: TestBox = new TestBox(4, 0, 0, 5, 1, 1);
        lBvh.insert(lBoxA);
        lBvh.insert(lBoxB);
        lBvh.insert(lBoxC);

        // Process. Enlarge boxA enormously to degrade quality.
        lBoxA.minX = -1000;
        lBoxA.minY = -1000;
        lBoxA.minZ = -1000;
        lBoxA.maxX = 1000;
        lBoxA.maxY = 1000;
        lBoxA.maxZ = 1000;
        lBvh.update(lBoxA);

        // Evaluation. After auto-rebuild, quality should reset to 1.0.
        expect(lBvh.quality).toBe(1.0);
        expect(lBvh.count).toBe(3);
        gValidateTree(lBvh);
    });

    await pContext.step('should throw when updating a non-existent object', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);

        // Evaluation.
        expect(() => {
            lBvh.update(lBox);
        }).toThrow();
    });
});

// --- rebuild() ---

Deno.test('LinearBoundVolumeHierarchy.rebuild()', async (pContext) => {
    await pContext.step('should preserve all objects after rebuild', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBoxes: Array<TestBox> = [];
        for (let lIndex: number = 0; lIndex < 10; lIndex++) {
            const lBox: TestBox = new TestBox(lIndex * 3, lIndex, 0, lIndex * 3 + 2, lIndex + 1, 1);
            lBoxes.push(lBox);
            lBvh.insert(lBox);
        }

        // Process.
        lBvh.rebuild();

        // Evaluation.
        expect(lBvh.count).toBe(10);
        expect(lBvh.nodeCount).toBe(19);
        gValidateTree(lBvh);

        // Verify all objects are retrievable.
        const lFoundObjects: Set<TestBox> = new Set<TestBox>();
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lStack: Array<number> = [lBvh.rootIndex];
        while (lStack.length > 0) {
            const lNode: number = lStack.pop()!;
            const lLeft: number = lTopo[lNode * 4 + 0];
            if (lLeft === -1) {
                lFoundObjects.add(lBvh.objectOf(lTopo[lNode * 4 + 3]));
            } else {
                lStack.push(lLeft, lTopo[lNode * 4 + 1]);
            }
        }
        for (const lBox of lBoxes) {
            expect(lFoundObjects.has(lBox)).toBe(true);
        }
    });

    await pContext.step('should reset quality to 1.0', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds, Infinity);
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

    await pContext.step('should handle rebuild with 0 objects', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Process.
        lBvh.rebuild();

        // Evaluation.
        expect(lBvh.count).toBe(0);
        expect(lBvh.rootIndex).toBe(-1);
    });

    await pContext.step('should handle rebuild with 1 object', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process.
        lBvh.rebuild();

        // Evaluation.
        expect(lBvh.count).toBe(1);
        expect(lBvh.rootIndex).toBeGreaterThanOrEqual(0);
    });

    await pContext.step('should produce a compact layout after insert and remove cycles', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
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
        expect(lBvh.count).toBe(5);
        expect(lBvh.nodeCount).toBe(9);
        gValidateTree(lBvh);
    });
});

// --- objectOf() ---

Deno.test('LinearBoundVolumeHierarchy.objectOf()', async (pContext) => {
    await pContext.step('should return the correct object for a valid index', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process. Read the object index from the root leaf.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lObjIdx: number = lTopo[lBvh.rootIndex * 4 + 3];
        const lResult: TestBox = lBvh.objectOf(lObjIdx);

        // Evaluation.
        expect(lResult).toBe(lBox);
    });

    await pContext.step('should throw for an invalid object index', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);

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

Deno.test('LinearBoundVolumeHierarchy.quality', async (pContext) => {
    await pContext.step('should return 1.0 for newly built tree', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        lBvh.insert(new TestBox(2, 0, 0, 3, 1, 1));
        lBvh.insert(new TestBox(4, 0, 0, 5, 1, 1));

        // Evaluation.
        expect(lBvh.quality).toBe(1.0);
    });

    await pContext.step('should return 1.0 for empty tree', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Evaluation.
        expect(lBvh.quality).toBe(1.0);
    });

    await pContext.step('should return 1.0 for single object tree', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));

        // Evaluation.
        expect(lBvh.quality).toBe(1.0);
    });

    await pContext.step('should increase above 1.0 after AABB-enlarging updates', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds, Infinity);
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

Deno.test('LinearBoundVolumeHierarchy buffer correctness', async (pContext) => {
    await pContext.step('should have correct AABB data for leaf nodes', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(1, 2, 3, 4, 5, 6);
        lBvh.insert(lBox);

        // Evaluation. Single leaf is the root.
        const lRoot: number = lBvh.rootIndex;
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
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        lBvh.insert(new TestBox(2, 2, 2, 3, 3, 3));

        // Evaluation.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        expect(lTopo[lBvh.rootIndex * 4 + 2]).toBe(-1);
    });

    await pContext.step('should have internal nodes with objectIndex -1', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        lBvh.insert(new TestBox(2, 2, 2, 3, 3, 3));
        lBvh.insert(new TestBox(4, 4, 4, 5, 5, 5));

        // Process. Walk tree to find all internal nodes.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lStack: Array<number> = [lBvh.rootIndex];
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
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        lBvh.insert(new TestBox(2, 2, 2, 3, 3, 3));
        lBvh.insert(new TestBox(4, 4, 4, 5, 5, 5));

        // Process. Walk tree to find all leaf nodes.
        const lTopo: Int32Array = new Int32Array(lBvh.topologyBuffer);
        const lStack: Array<number> = [lBvh.rootIndex];
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
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        for (let lIndex: number = 0; lIndex < 8; lIndex++) {
            lBvh.insert(new TestBox(lIndex * 3, lIndex * 2, lIndex, lIndex * 3 + 2, lIndex * 2 + 1, lIndex + 1));
        }

        // Evaluation. Full tree validation checks parent-child enclosure.
        gValidateTree(lBvh);
    });
});

// --- Edge cases ---

Deno.test('LinearBoundVolumeHierarchy edge cases', async (pContext) => {
    await pContext.step('should handle objects at the same position', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Process. Insert multiple objects at the exact same position.
        for (let lIndex: number = 0; lIndex < 5; lIndex++) {
            lBvh.insert(new TestBox(0, 0, 0, 1, 1, 1));
        }

        // Evaluation.
        expect(lBvh.count).toBe(5);
        expect(lBvh.nodeCount).toBe(9);
        gValidateTree(lBvh);

        // Rebuild should also handle coincident centroids.
        lBvh.rebuild();
        expect(lBvh.count).toBe(5);
        gValidateTree(lBvh);
    });

    await pContext.step('should handle large numbers of objects', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);

        // Process.
        const lCount: number = 1000;
        for (let lIndex: number = 0; lIndex < lCount; lIndex++) {
            lBvh.insert(new TestBox(lIndex, lIndex % 50, lIndex % 25, lIndex + 1, lIndex % 50 + 1, lIndex % 25 + 1));
        }

        // Evaluation.
        expect(lBvh.count).toBe(lCount);
        expect(lBvh.nodeCount).toBe(lCount * 2 - 1);
        gValidateTree(lBvh);
    });

    await pContext.step('should handle alternating insert and remove', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);

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
        expect(lBvh.count).toBe(lKeptBoxes.length);
        if (lBvh.count > 1) {
            gValidateTree(lBvh);
        }
    });

    await pContext.step('should disable auto-rebuild when threshold is Infinity', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds, Infinity);
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

        // Evaluation. Quality should be degraded, not auto-rebuilt.
        expect(lBvh.quality).toBeGreaterThan(1.0);
        gValidateTree(lBvh);
    });

    await pContext.step('should handle update on single object tree', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
        const lBox: TestBox = new TestBox(0, 0, 0, 1, 1, 1);
        lBvh.insert(lBox);

        // Process.
        lBox.minX = -5;
        lBox.maxX = 5;
        lBvh.update(lBox);

        // Evaluation.
        const lRoot: number = lBvh.rootIndex;
        const lAabb: Float32Array = new Float32Array(lBvh.aabbBuffer);
        expect(lAabb[lRoot * 6 + 0]).toBe(-5);
        expect(lAabb[lRoot * 6 + 3]).toBe(5);
        expect(lBvh.count).toBe(1);
    });

    await pContext.step('should handle all objects removed then re-inserted', () => {
        // Setup.
        const lBvh: LinearBoundVolumeHierarchy<TestBox> = new LinearBoundVolumeHierarchy<TestBox>(gTestBoxBounds);
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
        expect(lBvh.count).toBe(0);
        expect(lBvh.rootIndex).toBe(-1);

        // Re-insert all.
        for (const lBox of lBoxes) {
            lBvh.insert(lBox);
        }

        // Evaluation.
        expect(lBvh.count).toBe(5);
        expect(lBvh.nodeCount).toBe(9);
        gValidateTree(lBvh);
    });
});
