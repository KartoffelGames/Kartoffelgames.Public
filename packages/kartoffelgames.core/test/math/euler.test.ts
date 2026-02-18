import { expect } from '@kartoffelgames/core-test';
import { Euler } from '../../source/math/euler.ts';

Deno.test('Euler constructor', async (pContext) => {
    await pContext.step('Default values are zero', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Evaluation.
        expect(lEuler.x).toBe(0);
        expect(lEuler.y).toBe(0);
        expect(lEuler.z).toBe(0);
    });
});

Deno.test('Euler.x', async (pContext) => {
    await pContext.step('Get x value', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        const lResult: number = lEuler.x;

        // Evaluation.
        expect(lResult).toBe(0);
    });

    await pContext.step('Set x value', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        lEuler.x = 45;

        // Evaluation.
        expect(lEuler.x).toBe(45);
    });

    await pContext.step('Set x value does not affect y and z', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        lEuler.x = 90;

        // Evaluation.
        expect(lEuler.y).toBe(0);
        expect(lEuler.z).toBe(0);
    });
});

Deno.test('Euler.y', async (pContext) => {
    await pContext.step('Get y value', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        const lResult: number = lEuler.y;

        // Evaluation.
        expect(lResult).toBe(0);
    });

    await pContext.step('Set y value', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        lEuler.y = 180;

        // Evaluation.
        expect(lEuler.y).toBe(180);
    });

    await pContext.step('Set y value does not affect x and z', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        lEuler.y = 90;

        // Evaluation.
        expect(lEuler.x).toBe(0);
        expect(lEuler.z).toBe(0);
    });
});

Deno.test('Euler.z', async (pContext) => {
    await pContext.step('Get z value', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        const lResult: number = lEuler.z;

        // Evaluation.
        expect(lResult).toBe(0);
    });

    await pContext.step('Set z value', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        lEuler.z = 270;

        // Evaluation.
        expect(lEuler.z).toBe(270);
    });

    await pContext.step('Set z value does not affect x and y', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        lEuler.z = 90;

        // Evaluation.
        expect(lEuler.x).toBe(0);
        expect(lEuler.y).toBe(0);
    });
});

Deno.test('Euler functionality', async (pContext) => {
    await pContext.step('Set all axis values independently', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        lEuler.x = 10;
        lEuler.y = 20;
        lEuler.z = 30;

        // Evaluation.
        expect(lEuler.x).toBe(10);
        expect(lEuler.y).toBe(20);
        expect(lEuler.z).toBe(30);
    });

    await pContext.step('Overwrite axis values', () => {
        // Setup.
        const lEuler: Euler = new Euler();
        lEuler.x = 10;
        lEuler.y = 20;
        lEuler.z = 30;

        // Process.
        lEuler.x = 100;
        lEuler.y = 200;
        lEuler.z = 300;

        // Evaluation.
        expect(lEuler.x).toBe(100);
        expect(lEuler.y).toBe(200);
        expect(lEuler.z).toBe(300);
    });

    await pContext.step('Negative values', () => {
        // Setup.
        const lEuler: Euler = new Euler();

        // Process.
        lEuler.x = -45;
        lEuler.y = -90;
        lEuler.z = -180;

        // Evaluation.
        expect(lEuler.x).toBe(-45);
        expect(lEuler.y).toBe(-90);
        expect(lEuler.z).toBe(-180);
    });
});
