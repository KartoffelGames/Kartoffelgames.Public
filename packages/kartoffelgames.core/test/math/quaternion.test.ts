import { expect } from '@kartoffelgames/core-test';
import { Quaternion } from '../../source/math/quaternion.ts';
import { Matrix } from '../../source/math/matrix.ts';

Deno.test('Quaternion constructor', async (pContext) => {
    await pContext.step('Default identity quaternion', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Evaluation.
        expect(lQuaternion.w).toBe(1);
        expect(lQuaternion.x).toBe(0);
        expect(lQuaternion.y).toBe(0);
        expect(lQuaternion.z).toBe(0);
    });
});

Deno.test('Quaternion.x', async (pContext) => {
    await pContext.step('Get x value', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lResult: number = lQuaternion.x;

        // Evaluation.
        expect(lResult).toBe(0);
    });

    await pContext.step('Set x value', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        lQuaternion.x = 0.5;

        // Evaluation.
        expect(lQuaternion.x).toBe(0.5);
    });
});

Deno.test('Quaternion.y', async (pContext) => {
    await pContext.step('Get y value', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lResult: number = lQuaternion.y;

        // Evaluation.
        expect(lResult).toBe(0);
    });

    await pContext.step('Set y value', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        lQuaternion.y = 0.7;

        // Evaluation.
        expect(lQuaternion.y).toBe(0.7);
    });
});

Deno.test('Quaternion.z', async (pContext) => {
    await pContext.step('Get z value', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lResult: number = lQuaternion.z;

        // Evaluation.
        expect(lResult).toBe(0);
    });

    await pContext.step('Set z value', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        lQuaternion.z = 0.3;

        // Evaluation.
        expect(lQuaternion.z).toBe(0.3);
    });
});

Deno.test('Quaternion.w', async (pContext) => {
    await pContext.step('Get w value', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lResult: number = lQuaternion.w;

        // Evaluation.
        expect(lResult).toBe(1);
    });

    await pContext.step('Set w value', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        lQuaternion.w = 0.9;

        // Evaluation.
        expect(lQuaternion.w).toBe(0.9);
    });
});

Deno.test('Quaternion.fromRotation()', async (pContext) => {
    await pContext.step('Create quaternion from zero rotation', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(0, 0, 0);

        // Evaluation.
        expect(lQuaternion.w).toBeCloseTo(1, 10);
        expect(lQuaternion.x).toBeCloseTo(0, 10);
        expect(lQuaternion.y).toBeCloseTo(0, 10);
        expect(lQuaternion.z).toBeCloseTo(0, 10);
    });

    await pContext.step('Create quaternion from 90 degree pitch rotation', () => {
        // Setup. 90 degree rotation around X axis.
        const lQuaternion: Quaternion = Quaternion.fromRotation(90, 0, 0);

        // Evaluation. sin(45°) = cos(45°) ≈ 0.7071
        expect(lQuaternion.w).toBeCloseTo(Math.cos(Math.PI / 4), 10);
        expect(lQuaternion.x).toBeCloseTo(Math.sin(Math.PI / 4), 10);
        expect(lQuaternion.y).toBeCloseTo(0, 10);
        expect(lQuaternion.z).toBeCloseTo(0, 10);
    });

    await pContext.step('Create quaternion from 90 degree yaw rotation', () => {
        // Setup. 90 degree rotation around Y axis.
        const lQuaternion: Quaternion = Quaternion.fromRotation(0, 90, 0);

        // Evaluation.
        expect(lQuaternion.w).toBeCloseTo(Math.cos(Math.PI / 4), 10);
        expect(lQuaternion.x).toBeCloseTo(0, 10);
        expect(lQuaternion.y).toBeCloseTo(Math.sin(Math.PI / 4), 10);
        expect(lQuaternion.z).toBeCloseTo(0, 10);
    });

    await pContext.step('Create quaternion from 90 degree roll rotation', () => {
        // Setup. 90 degree rotation around Z axis.
        const lQuaternion: Quaternion = Quaternion.fromRotation(0, 0, 90);

        // Evaluation.
        expect(lQuaternion.w).toBeCloseTo(Math.cos(Math.PI / 4), 10);
        expect(lQuaternion.x).toBeCloseTo(0, 10);
        expect(lQuaternion.y).toBeCloseTo(0, 10);
        expect(lQuaternion.z).toBeCloseTo(Math.sin(Math.PI / 4), 10);
    });

    await pContext.step('Create quaternion from 360 degree rotation equals identity', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(360, 0, 0);

        // Evaluation. 360 degrees wraps to 0 via modulo, so identity quaternion.
        expect(lQuaternion.w).toBeCloseTo(1, 10);
        expect(lQuaternion.x).toBeCloseTo(0, 10);
        expect(lQuaternion.y).toBeCloseTo(0, 10);
        expect(lQuaternion.z).toBeCloseTo(0, 10);
    });

    await pContext.step('Create quaternion from combined rotation is unit quaternion', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(30, 45, 60);

        // Evaluation. A quaternion from rotation should be a unit quaternion.
        const lLength: number = Math.hypot(lQuaternion.w, lQuaternion.x, lQuaternion.y, lQuaternion.z);
        expect(lLength).toBeCloseTo(1, 10);
    });
});

Deno.test('Quaternion.mult()', async (pContext) => {
    await pContext.step('Multiply identity quaternion by another', () => {
        // Setup.
        const lIdentity: Quaternion = new Quaternion();
        const lOther: Quaternion = Quaternion.fromRotation(45, 0, 0);

        // Process.
        const lResult: Quaternion = lIdentity.mult(lOther);

        // Evaluation.
        expect(lResult.w).toBeCloseTo(lOther.w, 10);
        expect(lResult.x).toBeCloseTo(lOther.x, 10);
        expect(lResult.y).toBeCloseTo(lOther.y, 10);
        expect(lResult.z).toBeCloseTo(lOther.z, 10);
    });

    await pContext.step('Multiply quaternion by identity', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(30, 60, 90);
        const lIdentity: Quaternion = new Quaternion();

        // Process.
        const lResult: Quaternion = lQuaternion.mult(lIdentity);

        // Evaluation.
        expect(lResult.w).toBeCloseTo(lQuaternion.w, 10);
        expect(lResult.x).toBeCloseTo(lQuaternion.x, 10);
        expect(lResult.y).toBeCloseTo(lQuaternion.y, 10);
        expect(lResult.z).toBeCloseTo(lQuaternion.z, 10);
    });

    await pContext.step('Multiply two quaternions produces unit quaternion', () => {
        // Setup.
        const lQuaternionA: Quaternion = Quaternion.fromRotation(30, 0, 0);
        const lQuaternionB: Quaternion = Quaternion.fromRotation(0, 45, 0);

        // Process.
        const lResult: Quaternion = lQuaternionA.mult(lQuaternionB);

        // Evaluation.
        const lLength: number = Math.hypot(lResult.w, lResult.x, lResult.y, lResult.z);
        expect(lLength).toBeCloseTo(1, 10);
    });

    await pContext.step('Multiply does not mutate original quaternions', () => {
        // Setup.
        const lQuaternionA: Quaternion = Quaternion.fromRotation(45, 0, 0);
        const lOriginalW: number = lQuaternionA.w;
        const lOriginalX: number = lQuaternionA.x;

        // Process.
        lQuaternionA.mult(Quaternion.fromRotation(0, 90, 0));

        // Evaluation.
        expect(lQuaternionA.w).toBe(lOriginalW);
        expect(lQuaternionA.x).toBe(lOriginalX);
    });

    await pContext.step('Multiply two 90 degree pitch rotations equals 180 degree pitch', () => {
        // Setup.
        const lQuaternion90: Quaternion = Quaternion.fromRotation(90, 0, 0);
        const lQuaternion180: Quaternion = Quaternion.fromRotation(180, 0, 0);

        // Process.
        const lResult: Quaternion = lQuaternion90.mult(lQuaternion90);

        // Evaluation.
        expect(lResult.w).toBeCloseTo(lQuaternion180.w, 10);
        expect(lResult.x).toBeCloseTo(lQuaternion180.x, 10);
        expect(lResult.y).toBeCloseTo(lQuaternion180.y, 10);
        expect(lResult.z).toBeCloseTo(lQuaternion180.z, 10);
    });
});

Deno.test('Quaternion.normalize()', async (pContext) => {
    await pContext.step('Normalize identity quaternion', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lResult: Quaternion = lQuaternion.normalize();

        // Evaluation.
        expect(lResult.w).toBe(1);
        expect(lResult.x).toBe(0);
        expect(lResult.y).toBe(0);
        expect(lResult.z).toBe(0);
    });

    await pContext.step('Normalize non-unit quaternion produces unit length', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();
        lQuaternion.w = 2;
        lQuaternion.x = 0;
        lQuaternion.y = 0;
        lQuaternion.z = 0;

        // Process.
        const lResult: Quaternion = lQuaternion.normalize();

        // Evaluation.
        const lLength: number = Math.hypot(lResult.w, lResult.x, lResult.y, lResult.z);
        expect(lLength).toBeCloseTo(1, 10);
    });

    await pContext.step('Normalize arbitrary quaternion', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();
        lQuaternion.w = 1;
        lQuaternion.x = 1;
        lQuaternion.y = 1;
        lQuaternion.z = 1;

        // Process.
        const lResult: Quaternion = lQuaternion.normalize();

        // Evaluation. Length of [1,1,1,1] = 2, so each component = 0.5
        expect(lResult.w).toBeCloseTo(0.5, 10);
        expect(lResult.x).toBeCloseTo(0.5, 10);
        expect(lResult.y).toBeCloseTo(0.5, 10);
        expect(lResult.z).toBeCloseTo(0.5, 10);
    });

    await pContext.step('Normalize does not mutate original quaternion', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();
        lQuaternion.w = 2;
        lQuaternion.x = 0;
        lQuaternion.y = 0;
        lQuaternion.z = 0;

        // Process.
        lQuaternion.normalize();

        // Evaluation.
        expect(lQuaternion.w).toBe(2);
    });
});

Deno.test('Quaternion.addEulerRotation()', async (pContext) => {
    await pContext.step('Add zero rotation to identity', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lResult: Quaternion = lQuaternion.addEulerRotation(0, 0, 0);

        // Evaluation.
        expect(lResult.w).toBeCloseTo(1, 10);
        expect(lResult.x).toBeCloseTo(0, 10);
        expect(lResult.y).toBeCloseTo(0, 10);
        expect(lResult.z).toBeCloseTo(0, 10);
    });

    await pContext.step('Add rotation to identity quaternion equals fromRotation', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();
        const lExpected: Quaternion = Quaternion.fromRotation(45, 30, 60);

        // Process.
        const lResult: Quaternion = lQuaternion.addEulerRotation(45, 30, 60);

        // Evaluation.
        expect(lResult.w).toBeCloseTo(lExpected.w, 10);
        expect(lResult.x).toBeCloseTo(lExpected.x, 10);
        expect(lResult.y).toBeCloseTo(lExpected.y, 10);
        expect(lResult.z).toBeCloseTo(lExpected.z, 10);
    });

    await pContext.step('Add euler rotation produces unit quaternion', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(10, 20, 30);

        // Process.
        const lResult: Quaternion = lQuaternion.addEulerRotation(40, 50, 60);

        // Evaluation.
        const lLength: number = Math.hypot(lResult.w, lResult.x, lResult.y, lResult.z);
        expect(lLength).toBeCloseTo(1, 10);
    });
});

Deno.test('Quaternion.asEuler()', async (pContext) => {
    await pContext.step('Identity quaternion converts to zero euler', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lEuler = lQuaternion.asEuler();

        // Evaluation.
        expect(lEuler.x).toBeCloseTo(0, 10);
        expect(lEuler.y).toBeCloseTo(0, 10);
        expect(lEuler.z).toBeCloseTo(0, 10);
    });

    await pContext.step('90 degree pitch round-trip', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(90, 0, 0);

        // Process.
        const lEuler = lQuaternion.asEuler();

        // Evaluation.
        expect(lEuler.x).toBeCloseTo(90, 5);
        expect(lEuler.y).toBeCloseTo(0, 5);
        expect(lEuler.z).toBeCloseTo(0, 5);
    });

    await pContext.step('90 degree yaw round-trip', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(0, 90, 0);

        // Process.
        const lEuler = lQuaternion.asEuler();

        // Evaluation.
        expect(lEuler.x).toBeCloseTo(0, 5);
        expect(lEuler.y).toBeCloseTo(90, 5);
        expect(lEuler.z).toBeCloseTo(0, 5);
    });

    await pContext.step('90 degree roll round-trip', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(0, 0, 90);

        // Process.
        const lEuler = lQuaternion.asEuler();

        // Evaluation.
        expect(lEuler.x).toBeCloseTo(0, 5);
        expect(lEuler.y).toBeCloseTo(0, 5);
        expect(lEuler.z).toBeCloseTo(90, 5);
    });

    await pContext.step('Euler values are in range 0 to 360', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(45, 30, 60);

        // Process.
        const lEuler = lQuaternion.asEuler();

        // Evaluation.
        expect(lEuler.x).toBeGreaterThanOrEqual(0);
        expect(lEuler.x).toBeLessThan(360);
        expect(lEuler.y).toBeGreaterThanOrEqual(0);
        expect(lEuler.y).toBeLessThan(360);
        expect(lEuler.z).toBeGreaterThanOrEqual(0);
        expect(lEuler.z).toBeLessThan(360);
    });
});

Deno.test('Quaternion.asMatrix()', async (pContext) => {
    await pContext.step('Identity quaternion converts to identity matrix', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lResult: Matrix = lQuaternion.asMatrix();

        // Evaluation.
        const lIdentity: Matrix = Matrix.identity(4);
        for (let lRow: number = 0; lRow < 4; lRow++) {
            for (let lCol: number = 0; lCol < 4; lCol++) {
                expect(lResult.get(lRow, lCol)).toBeCloseTo(lIdentity.get(lRow, lCol), 10);
            }
        }
    });

    await pContext.step('Rotation matrix is 4x4', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(45, 30, 60);

        // Process.
        const lResult: Matrix = lQuaternion.asMatrix();

        // Evaluation.
        expect(lResult.height).toBe(4);
        expect(lResult.width).toBe(4);
    });

    await pContext.step('Rotation matrix has identity fourth row and column', () => {
        // Setup.
        const lQuaternion: Quaternion = Quaternion.fromRotation(45, 30, 60);

        // Process.
        const lResult: Matrix = lQuaternion.asMatrix();

        // Evaluation. Fourth row and column should be [0,0,0,1].
        expect(lResult.get(3, 0)).toBeCloseTo(0, 10);
        expect(lResult.get(3, 1)).toBeCloseTo(0, 10);
        expect(lResult.get(3, 2)).toBeCloseTo(0, 10);
        expect(lResult.get(3, 3)).toBeCloseTo(1, 10);
        expect(lResult.get(0, 3)).toBeCloseTo(0, 10);
        expect(lResult.get(1, 3)).toBeCloseTo(0, 10);
        expect(lResult.get(2, 3)).toBeCloseTo(0, 10);
    });

    await pContext.step('90 degree pitch rotation matrix', () => {
        // Setup. 90 degrees around X axis.
        // Expected 3x3 rotation part:
        // [1,  0,       0     ]
        // [0,  cos(90), -sin(90)]
        // [0,  sin(90), cos(90) ]
        // = [[1,0,0],[0,0,-1],[0,1,0]]
        const lQuaternion: Quaternion = Quaternion.fromRotation(90, 0, 0);

        // Process.
        const lResult: Matrix = lQuaternion.asMatrix();

        // Evaluation.
        expect(lResult.get(0, 0)).toBeCloseTo(1, 5);
        expect(lResult.get(0, 1)).toBeCloseTo(0, 5);
        expect(lResult.get(0, 2)).toBeCloseTo(0, 5);
        expect(lResult.get(1, 0)).toBeCloseTo(0, 5);
        expect(lResult.get(1, 1)).toBeCloseTo(0, 5);
        expect(lResult.get(1, 2)).toBeCloseTo(-1, 5);
        expect(lResult.get(2, 0)).toBeCloseTo(0, 5);
        expect(lResult.get(2, 1)).toBeCloseTo(1, 5);
        expect(lResult.get(2, 2)).toBeCloseTo(0, 5);
    });
});

Deno.test('Quaternion.vectorForward', async (pContext) => {
    await pContext.step('Identity quaternion forward is z-axis', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lForward = lQuaternion.vectorForward;

        // Evaluation. Default forward should be [0, 0, 1].
        expect(lForward.x).toBeCloseTo(0, 10);
        expect(lForward.y).toBeCloseTo(0, 10);
        expect(lForward.z).toBeCloseTo(1, 10);
    });

    await pContext.step('90 degree yaw rotation rotates forward vector', () => {
        // Setup. Rotating 90 degrees around Y should turn forward from [0,0,1] to [1,0,0].
        const lQuaternion: Quaternion = Quaternion.fromRotation(0, 90, 0);

        // Process.
        const lForward = lQuaternion.vectorForward;

        // Evaluation.
        expect(lForward.x).toBeCloseTo(1, 5);
        expect(lForward.y).toBeCloseTo(0, 5);
        expect(lForward.z).toBeCloseTo(0, 5);
    });
});

Deno.test('Quaternion.vectorRight', async (pContext) => {
    await pContext.step('Identity quaternion right is x-axis', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lRight = lQuaternion.vectorRight;

        // Evaluation. Default right should be [1, 0, 0].
        expect(lRight.x).toBeCloseTo(1, 10);
        expect(lRight.y).toBeCloseTo(0, 10);
        expect(lRight.z).toBeCloseTo(0, 10);
    });

    await pContext.step('90 degree yaw rotation rotates right vector', () => {
        // Setup. Rotating 90 degrees around Y should turn right from [1,0,0] to [0,0,-1].
        const lQuaternion: Quaternion = Quaternion.fromRotation(0, 90, 0);

        // Process.
        const lRight = lQuaternion.vectorRight;

        // Evaluation.
        expect(lRight.x).toBeCloseTo(0, 5);
        expect(lRight.y).toBeCloseTo(0, 5);
        expect(lRight.z).toBeCloseTo(-1, 5);
    });
});

Deno.test('Quaternion.vectorUp', async (pContext) => {
    await pContext.step('Identity quaternion up is y-axis', () => {
        // Setup.
        const lQuaternion: Quaternion = new Quaternion();

        // Process.
        const lUp = lQuaternion.vectorUp;

        // Evaluation. Default up should be [0, 1, 0].
        expect(lUp.x).toBeCloseTo(0, 10);
        expect(lUp.y).toBeCloseTo(1, 10);
        expect(lUp.z).toBeCloseTo(0, 10);
    });

    await pContext.step('90 degree pitch rotation rotates up vector', () => {
        // Setup. Rotating 90 degrees around X should turn up from [0,1,0] to [0,0,1].
        const lQuaternion: Quaternion = Quaternion.fromRotation(90, 0, 0);

        // Process.
        const lUp = lQuaternion.vectorUp;

        // Evaluation.
        expect(lUp.x).toBeCloseTo(0, 5);
        expect(lUp.y).toBeCloseTo(0, 5);
        expect(lUp.z).toBeCloseTo(1, 5);
    });
});
