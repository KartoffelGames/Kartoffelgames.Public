import { expect } from '@kartoffelgames/core-test';
import { Exception } from '../../source/exception/exception.ts';
import { Vector } from '../../source/math/vector.ts';

Deno.test('Vector constructor', async (pContext) => {
    await pContext.step('Construct 2D vector', () => {
        // Setup.
        const lVector: Vector = new Vector([1, 2]);

        // Evaluation.
        expect(lVector.data).toEqual([1, 2]);
    });

    await pContext.step('Construct 3D vector', () => {
        // Setup.
        const lVector: Vector = new Vector([1, 2, 3]);

        // Evaluation.
        expect(lVector.data).toEqual([1, 2, 3]);
    });

    await pContext.step('Construct 4D vector', () => {
        // Setup.
        const lVector: Vector = new Vector([1, 2, 3, 4]);

        // Evaluation.
        expect(lVector.data).toEqual([1, 2, 3, 4]);
    });

    await pContext.step('Constructor copies input data', () => {
        // Setup.
        const lData: Array<number> = [1, 2, 3];

        // Process.
        const lVector: Vector = new Vector(lData);
        lData[0] = 99;

        // Evaluation.
        expect(lVector.data[0]).toBe(1);
        expect(lVector.data[1]).toBe(2);
        expect(lVector.data[2]).toBe(3);
    });
});

Deno.test('Vector.data', async (pContext) => {
    await pContext.step('Get data of 3D vector', () => {
        // Setup.
        const lVector: Vector = new Vector([5, 10, 15]);

        // Process.
        const lResult: Array<number> = lVector.data;

        // Evaluation.
        expect(lResult).toEqual([5, 10, 15]);
    });
});

Deno.test('Vector.x', async (pContext) => {
    await pContext.step('Get x value', () => {
        // Setup.
        const lVector: Vector = new Vector([7, 8, 9]);

        // Process.
        const lResult: number = lVector.x;

        // Evaluation.
        expect(lResult).toBe(7);
    });
});

Deno.test('Vector.y', async (pContext) => {
    await pContext.step('Get y value', () => {
        // Setup.
        const lVector: Vector = new Vector([7, 8, 9]);

        // Process.
        const lResult: number = lVector.y;

        // Evaluation.
        expect(lResult).toBe(8);
    });
});

Deno.test('Vector.z', async (pContext) => {
    await pContext.step('Get z value', () => {
        // Setup.
        const lVector: Vector = new Vector([7, 8, 9]);

        // Process.
        const lResult: number = lVector.z;

        // Evaluation.
        expect(lResult).toBe(9);
    });
});

Deno.test('Vector.w', async (pContext) => {
    await pContext.step('Get w value', () => {
        // Setup.
        const lVector: Vector = new Vector([7, 8, 9, 10]);

        // Process.
        const lResult: number = lVector.w;

        // Evaluation.
        expect(lResult).toBe(10);
    });

    await pContext.step('Get w value of 3D vector returns undefined', () => {
        // Setup.
        const lVector: Vector = new Vector([7, 8, 9]);

        // Process.
        const lResult: number = lVector.w;

        // Evaluation.
        expect(lResult).toBeUndefined();
    });
});

Deno.test('Vector.add()', async (pContext) => {
    await pContext.step('Add two 3D vectors', () => {
        // Setup.
        const lVectorA: Vector = new Vector([1, 2, 3]);
        const lVectorB: Vector = new Vector([4, 5, 6]);

        // Process.
        const lResult: Vector = lVectorA.add(lVectorB);

        // Evaluation.
        expect(lResult.data).toEqual([5, 7, 9]);
    });

    await pContext.step('Add scalar to vector', () => {
        // Setup.
        const lVector: Vector = new Vector([1, 2, 3]);
        const lScalar: number = 10;

        // Process.
        const lResult: Vector = lVector.add(lScalar);

        // Evaluation.
        expect(lResult.data).toEqual([11, 12, 13]);
    });

    await pContext.step('Add does not mutate original vector', () => {
        // Setup.
        const lVector: Vector = new Vector([1, 2, 3]);

        // Process.
        lVector.add(10);

        // Evaluation.
        expect(lVector.data).toEqual([1, 2, 3]);
    });

    await pContext.step('Add two 2D vectors', () => {
        // Setup.
        const lVectorA: Vector = new Vector([3, 7]);
        const lVectorB: Vector = new Vector([1, -2]);

        // Process.
        const lResult: Vector = lVectorA.add(lVectorB);

        // Evaluation.
        expect(lResult.data).toEqual([4, 5]);
    });

    await pContext.step('Error: Add vectors of different lengths', () => {
        // Setup.
        const lVectorA: Vector = new Vector([1, 2]);
        const lVectorB: Vector = new Vector([1, 2, 3]);

        // Process.
        const lFailingFunction = () => {
            lVectorA.add(lVectorB);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow(Exception);
    });
});

Deno.test('Vector.sub()', async (pContext) => {
    await pContext.step('Subtract two 3D vectors', () => {
        // Setup.
        const lVectorA: Vector = new Vector([5, 7, 9]);
        const lVectorB: Vector = new Vector([1, 2, 3]);

        // Process.
        const lResult: Vector = lVectorA.sub(lVectorB);

        // Evaluation.
        expect(lResult.data).toEqual([4, 5, 6]);
    });

    await pContext.step('Subtract scalar from vector', () => {
        // Setup.
        const lVector: Vector = new Vector([10, 20, 30]);
        const lScalar: number = 5;

        // Process.
        const lResult: Vector = lVector.sub(lScalar);

        // Evaluation.
        expect(lResult.data).toEqual([5, 15, 25]);
    });

    await pContext.step('Subtract does not mutate original vector', () => {
        // Setup.
        const lVector: Vector = new Vector([10, 20, 30]);

        // Process.
        lVector.sub(5);

        // Evaluation.
        expect(lVector.data).toEqual([10, 20, 30]);
    });

    await pContext.step('Error: Subtract vectors of different lengths', () => {
        // Setup.
        const lVectorA: Vector = new Vector([1, 2]);
        const lVectorB: Vector = new Vector([1, 2, 3]);

        // Process.
        const lFailingFunction = () => {
            lVectorA.sub(lVectorB);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow(Exception);
    });
});

Deno.test('Vector.length()', async (pContext) => {
    await pContext.step('Length of 2D vector', () => {
        // Setup. length([3, 4]) = 5
        const lVector: Vector = new Vector([3, 4]);

        // Process.
        const lResult: number = lVector.length();

        // Evaluation.
        expect(lResult).toBe(5);
    });

    await pContext.step('Length of 3D vector', () => {
        // Setup. length([1, 2, 2]) = 3
        const lVector: Vector = new Vector([1, 2, 2]);

        // Process.
        const lResult: number = lVector.length();

        // Evaluation.
        expect(lResult).toBe(3);
    });

    await pContext.step('Length of unit vector is 1', () => {
        // Setup.
        const lVector: Vector = new Vector([1, 0, 0]);

        // Process.
        const lResult: number = lVector.length();

        // Evaluation.
        expect(lResult).toBe(1);
    });

    await pContext.step('Length of zero vector is 0', () => {
        // Setup.
        const lVector: Vector = new Vector([0, 0, 0]);

        // Process.
        const lResult: number = lVector.length();

        // Evaluation.
        expect(lResult).toBe(0);
    });
});

Deno.test('Vector.normalize()', async (pContext) => {
    await pContext.step('Normalize 2D vector', () => {
        // Setup. normalize([3, 4]) = [3/5, 4/5]
        const lVector: Vector = new Vector([3, 4]);

        // Process.
        const lResult: Vector = lVector.normalize();

        // Evaluation.
        expect(lResult.data[0]).toBeCloseTo(0.6, 10);
        expect(lResult.data[1]).toBeCloseTo(0.8, 10);
    });

    await pContext.step('Normalized vector has length 1', () => {
        // Setup.
        const lVector: Vector = new Vector([3, 4, 5]);

        // Process.
        const lResult: Vector = lVector.normalize();

        // Evaluation.
        expect(lResult.length()).toBeCloseTo(1, 10);
    });

    await pContext.step('Normalize does not mutate original vector', () => {
        // Setup.
        const lVector: Vector = new Vector([3, 4]);

        // Process.
        lVector.normalize();

        // Evaluation.
        expect(lVector.data).toEqual([3, 4]);
    });

    await pContext.step('Normalize unit axis vector returns same values', () => {
        // Setup.
        const lVector: Vector = new Vector([1, 0, 0]);

        // Process.
        const lResult: Vector = lVector.normalize();

        // Evaluation.
        expect(lResult.data).toEqual([1, 0, 0]);
    });
});

Deno.test('Vector.multDot()', async (pContext) => {
    await pContext.step('Dot product of two 3D vectors', () => {
        // Setup. dot([1,2,3], [4,5,6]) = 1*4 + 2*5 + 3*6 = 32
        const lVectorA: Vector = new Vector([1, 2, 3]);
        const lVectorB: Vector = new Vector([4, 5, 6]);

        // Process.
        const lResult: number = lVectorA.multDot(lVectorB);

        // Evaluation.
        expect(lResult).toBe(32);
    });

    await pContext.step('Dot product of two 2D vectors', () => {
        // Setup. dot([3, 4], [1, 2]) = 3*1 + 4*2 = 11
        const lVectorA: Vector = new Vector([3, 4]);
        const lVectorB: Vector = new Vector([1, 2]);

        // Process.
        const lResult: number = lVectorA.multDot(lVectorB);

        // Evaluation.
        expect(lResult).toBe(11);
    });

    await pContext.step('Dot product of orthogonal vectors is 0', () => {
        // Setup.
        const lVectorA: Vector = new Vector([1, 0, 0]);
        const lVectorB: Vector = new Vector([0, 1, 0]);

        // Process.
        const lResult: number = lVectorA.multDot(lVectorB);

        // Evaluation.
        expect(lResult).toBe(0);
    });

    await pContext.step('Dot product with zero vector is 0', () => {
        // Setup.
        const lVectorA: Vector = new Vector([5, 10, 15]);
        const lVectorB: Vector = new Vector([0, 0, 0]);

        // Process.
        const lResult: number = lVectorA.multDot(lVectorB);

        // Evaluation.
        expect(lResult).toBe(0);
    });

    await pContext.step('Error: Dot product of vectors with different lengths', () => {
        // Setup.
        const lVectorA: Vector = new Vector([1, 2]);
        const lVectorB: Vector = new Vector([1, 2, 3]);

        // Process.
        const lFailingFunction = () => {
            lVectorA.multDot(lVectorB);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow(Exception);
    });
});

Deno.test('Vector.multCross()', async (pContext) => {
    await pContext.step('Cross product of two 3D vectors', () => {
        // Setup. cross([1,0,0], [0,1,0]) = [0,0,1]
        const lVectorA: Vector = new Vector([1, 0, 0]);
        const lVectorB: Vector = new Vector([0, 1, 0]);

        // Process.
        const lResult: Vector = lVectorA.multCross(lVectorB);

        // Evaluation.
        expect(lResult.data).toEqual([0, 0, 1]);
    });

    await pContext.step('Cross product of two arbitrary 3D vectors', () => {
        // Setup. cross([2,3,4], [5,6,7]) = [3*7-4*6, 4*5-2*7, 2*6-3*5] = [-3, 6, -3]
        const lVectorA: Vector = new Vector([2, 3, 4]);
        const lVectorB: Vector = new Vector([5, 6, 7]);

        // Process.
        const lResult: Vector = lVectorA.multCross(lVectorB);

        // Evaluation.
        expect(lResult.data).toEqual([-3, 6, -3]);
    });

    await pContext.step('Cross product of parallel vectors is zero vector', () => {
        // Setup.
        const lVectorA: Vector = new Vector([1, 2, 3]);
        const lVectorB: Vector = new Vector([2, 4, 6]);

        // Process.
        const lResult: Vector = lVectorA.multCross(lVectorB);

        // Evaluation.
        expect(lResult.data).toEqual([0, 0, 0]);
    });

    await pContext.step('Cross product is anti-commutative', () => {
        // Setup.
        const lVectorA: Vector = new Vector([1, 2, 3]);
        const lVectorB: Vector = new Vector([4, 5, 6]);

        // Process.
        const lResultAB: Vector = lVectorA.multCross(lVectorB);
        const lResultBA: Vector = lVectorB.multCross(lVectorA);

        // Evaluation.
        expect(lResultAB.data[0]).toBe(-lResultBA.data[0]);
        expect(lResultAB.data[1]).toBe(-lResultBA.data[1]);
        expect(lResultAB.data[2]).toBe(-lResultBA.data[2]);
    });

    await pContext.step('Cross product does not mutate original vectors', () => {
        // Setup.
        const lVectorA: Vector = new Vector([1, 0, 0]);
        const lVectorB: Vector = new Vector([0, 1, 0]);

        // Process.
        lVectorA.multCross(lVectorB);

        // Evaluation.
        expect(lVectorA.data).toEqual([1, 0, 0]);
        expect(lVectorB.data).toEqual([0, 1, 0]);
    });

    await pContext.step('Error: Cross product of non-3D vectors with different lengths', () => {
        // Setup.
        const lVectorA: Vector = new Vector([1, 2]);
        const lVectorB: Vector = new Vector([1, 2, 3]);

        // Process.
        const lFailingFunction = () => {
            lVectorA.multCross(lVectorB);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow(Exception);
    });
});
