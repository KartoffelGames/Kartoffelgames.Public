import { expect } from '@kartoffelgames/core-test';
import { Frustum } from '../../source/math/frustum.ts';
import { Matrix } from '../../source/math/matrix.ts';

Deno.test('Frustum.intersectsAABB()', async (pContext) => {
    // With an identity 4x4 view-projection matrix, the frustum defines the clip volume:
    // X in [-1, 1], Y in [-1, 1], Z in [0, 1]  (WebGPU clip space).
    const lIdentity: Matrix = Matrix.identity(4);

    await pContext.step('AABB fully inside the frustum returns true', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.5,
            minY: -0.5,
            minZ: 0.1,
            maxX: 0.5,
            maxY: 0.5,
            maxZ: 0.9
        })).toBe(true);

    });

    await pContext.step('AABB fully outside left plane returns false', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Entire box is at x < -1.
        expect(lFrustum.intersectsBoundingBox({
            minX: -3,
            minY: -0.5,
            minZ: 0.1,
            maxX: -1.5,
            maxY: 0.5,
            maxZ: 0.9
        })).toBe(false);
    });

    await pContext.step('AABB fully outside right plane returns false', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Entire box is at x > 1.
        expect(lFrustum.intersectsBoundingBox({
            minX: 1.5,
            minY: -0.5,
            minZ: 0.1,
            maxX: 3,
            maxY: 0.5,
            maxZ: 0.9
        })).toBe(false);
    });

    await pContext.step('AABB fully outside bottom plane returns false', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Entire box is at y < -1.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.5,
            minY: -3,
            minZ: 0.1,
            maxX: 0.5,
            maxY: -1.5,
            maxZ: 0.9
        })).toBe(false);
    });

    await pContext.step('AABB fully outside top plane returns false', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Entire box is at y > 1.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.5,
            minY: 1.5,
            minZ: 0.1,
            maxX: 0.5,
            maxY: 3,
            maxZ: 0.9
        })).toBe(false);
    });

    await pContext.step('AABB fully outside near plane returns false', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Entire box is at z < 0.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.5,
            minY: -0.5,
            minZ: -1,
            maxX: 0.5,
            maxY: 0.5,
            maxZ: -0.1
        })).toBe(false);
    });

    await pContext.step('AABB fully outside far plane returns false', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Entire box is at z > 1.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.5,
            minY: -0.5,
            minZ: 1.1,
            maxX: 0.5,
            maxY: 0.5,
            maxZ: 2
        })).toBe(false);
    });

    await pContext.step('AABB partially intersecting the near plane returns true', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Box straddles z=0 boundary.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.5,
            minY: -0.5,
            minZ: -0.5,
            maxX: 0.5,
            maxY: 0.5,
            maxZ: 0.5
        })).toBe(true);
    });

    await pContext.step('AABB partially intersecting the left plane returns true', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Box straddles x=-1 boundary.
        expect(lFrustum.intersectsBoundingBox({
            minX: -1.5,
            minY: -0.5,
            minZ: 0.1,
            maxX: -0.5,
            maxY: 0.5,
            maxZ: 0.9
        })).toBe(true);
    });

    await pContext.step('AABB touching the boundary plane is considered inside', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Box extends exactly to the frustum boundaries.
        expect(lFrustum.intersectsBoundingBox({
            minX: -1,
            minY: -1,
            minZ: 0,
            maxX: 1,
            maxY: 1,
            maxZ: 1
        })).toBe(true);
    });

    await pContext.step('AABB at the origin is inside the frustum', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Very small box at the origin.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.01,
            minY: -0.01,
            minZ: 0.01,
            maxX: 0.01,
            maxY: 0.01,
            maxZ: 0.01
        })).toBe(true);
    });

    await pContext.step('Large AABB enclosing the entire frustum returns true', () => {
        // Setup.
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lIdentity);

        // Process & Evaluate. Box is much larger than the frustum.
        expect(lFrustum.intersectsBoundingBox({
            minX: -10,
            minY: -10,
            minZ: -10,
            maxX: 10,
            maxY: 10,
            maxZ: 10
        })).toBe(true);
    });
});

Deno.test('Frustum.update()', async (pContext) => {
    await pContext.step('Frustum with scaled view-projection matrix produces smaller frustum', () => {
        // Setup. A uniform scaling by 2 halves the frustum dimensions in world space.
        // clip.x = 2 * world.x → world.x in [-0.5, 0.5]
        // clip.y = 2 * world.y → world.y in [-0.5, 0.5]
        // clip.z = 2 * world.z → world.z in [0, 0.5]
        // Column-major: [2,0,0,0, 0,2,0,0, 0,0,2,0, 0,0,0,1]
        const lScaleMatrix: Matrix = new Matrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1], 4, 4);
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lScaleMatrix);

        // Process & Evaluate. Box inside the scaled frustum.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.4,
            minY: -0.4,
            minZ: 0.05,
            maxX: 0.4,
            maxY: 0.4,
            maxZ: 0.45
        })).toBe(true);

        // Box outside the scaled frustum on the right (x > 0.5).
        expect(lFrustum.intersectsBoundingBox({
            minX: 0.6,
            minY: -0.4,
            minZ: 0.05,
            maxX: 0.8,
            maxY: 0.4,
            maxZ: 0.45
        })).toBe(false);

        // Box outside the scaled frustum beyond far (z > 0.5).
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.4,
            minY: -0.4,
            minZ: 0.6,
            maxX: 0.4,
            maxY: 0.4,
            maxZ: 0.8
        })).toBe(false);
    });

    await pContext.step('Frustum with translated view-projection matrix shifts the frustum', () => {
        // Setup. A translation by (2, 0, 0) in the VP matrix shifts the frustum.
        // clip.x = world.x + 2 → -1 <= world.x + 2 <= 1 → world.x in [-3, -1]
        // clip.y = world.y → world.y in [-1, 1]
        // clip.z = world.z → world.z in [0, 1]
        // Row-major: [[1,0,0,2],[0,1,0,0],[0,0,1,0],[0,0,0,1]]
        // Column-major: [1,0,0,0, 0,1,0,0, 0,0,1,0, 2,0,0,1]
        const lTranslationMatrix: Matrix = new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 0, 0, 1], 4, 4);
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(lTranslationMatrix);

        // Process & Evaluate. Box inside the translated frustum (x in [-3, -1]).
        expect(lFrustum.intersectsBoundingBox({
            minX: -2.5,
            minY: -0.5,
            minZ: 0.1,
            maxX: -1.5,
            maxY: 0.5,
            maxZ: 0.9
        })).toBe(true);

        // Box at the origin is outside the translated frustum (x=0 is outside [-3, -1]).
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.5,
            minY: -0.5,
            minZ: 0.1,
            maxX: 0.5,
            maxY: 0.5,
            maxZ: 0.9
        })).toBe(false);
    });

    await pContext.step('Updating the frustum with a new matrix replaces the old planes', () => {
        // Setup. First update with identity (frustum: x[-1,1], y[-1,1], z[0,1]).
        const lFrustum: Frustum = new Frustum();
        lFrustum.update(Matrix.identity(4));

        // Verify AABB at origin is inside.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.5,
            minY: -0.5,
            minZ: 0.1,
            maxX: 0.5,
            maxY: 0.5,
            maxZ: 0.9
        })).toBe(true);

        // Process. Update with a translation that moves the frustum far away.
        // Translation by (100, 0, 0): frustum x in [-101, -99].
        const lFarMatrix: Matrix = new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 100, 0, 0, 1], 4, 4);
        lFrustum.update(lFarMatrix);

        // Evaluate. AABB at origin should now be outside.
        expect(lFrustum.intersectsBoundingBox({
            minX: -0.5,
            minY: -0.5,
            minZ: 0.1,
            maxX: 0.5,
            maxY: 0.5,
            maxZ: 0.9
        })).toBe(false);

        // AABB at the new frustum location should be inside.
        expect(lFrustum.intersectsBoundingBox({
            minX: -100.5,
            minY: -0.5,
            minZ: 0.1,
            maxX: -99.5,
            maxY: 0.5,
            maxZ: 0.9
        })).toBe(true);
    });
});

Deno.test('Frustum constructor', async (pContext) => {
    await pContext.step('Newly constructed frustum without update considers all AABBs inside', () => {
        // Setup. All plane coefficients are zero, so each plane equation evaluates to 0 >= 0 (always true).
        const lFrustum: Frustum = new Frustum();

        // Process & Evaluate.
        expect(lFrustum.intersectsBoundingBox({
            minX: -100,
            minY: -100,
            minZ: -100,
            maxX: 100,
            maxY: 100,
            maxZ: 100
        })).toBe(true);
        
        expect(lFrustum.intersectsBoundingBox({
            minX: 50,
            minY: 50,
            minZ: 50,
            maxX: 60,
            maxY: 60,
            maxZ: 60
        })).toBe(true);
    });
});
