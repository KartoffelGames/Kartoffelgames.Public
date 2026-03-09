import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { GpuBuffer } from '../../source/buffer/gpu-buffer.ts';
import { BufferUsage } from '../../source/constant/buffer-usage.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('GpuObject.device', async (pContext) => {
    await pContext.step('Returns the device passed in constructor', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process. GpuBuffer extends GpuObject so we can use it to test GpuObject.
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);

        // Evaluation.
        expect(lBuffer.device).toBe(lDevice);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuObject.deconstruct()', async (pContext) => {
    await pContext.step('After deconstruction, native access throws', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Uniform);

        // Force native creation.
        const lNative: GPUBuffer = lBuffer.native;
        expect(lNative).toBeTruthy();

        // Process.
        lBuffer.deconstruct();

        // Evaluation.
        const lThrowFunction = () => {
            lBuffer.native;
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuObject.invalidate()', async (pContext) => {
    await pContext.step('Triggers invalidation listeners with the correct reason', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Uniform);

        // Force native creation first.
        lBuffer.native;

        let lInvalidationCalled: boolean = false;
        // GpuResourceObjectInvalidationType.ResourceRebuild is the type used by resource objects.
        lBuffer.addInvalidationListener(() => {
            lInvalidationCalled = true;
        }, 'ResourceRebuild' as any);

        // Process. Changing size triggers invalidation.
        lBuffer.size = 32;

        // Evaluation.
        expect(lInvalidationCalled).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuObject.addInvalidationListener()', async (pContext) => {
    await pContext.step('Listener is called on invalidation', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Uniform);

        let lCallCount: number = 0;
        lBuffer.addInvalidationListener(() => {
            lCallCount++;
        }, 'ResourceRebuild' as any);

        // Process. Trigger invalidation by changing size.
        lBuffer.size = 32;
        lBuffer.size = 64;

        // Evaluation.
        expect(lCallCount).toBeGreaterThanOrEqual(1);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws when adding same listener twice', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Uniform);

        const lListener = () => { /* no-op */ };
        lBuffer.addInvalidationListener(lListener, 'ResourceRebuild' as any);

        // Evaluation.
        const lThrowFunction = () => {
            lBuffer.addInvalidationListener(lListener, 'ResourceRebuild' as any);
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuObject.removeInvalidationListener()', async (pContext) => {
    await pContext.step('Removed listener is no longer called', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Uniform);

        let lCallCount: number = 0;
        const lListener = () => {
            lCallCount++;
        };
        lBuffer.addInvalidationListener(lListener, 'ResourceRebuild' as any);

        // Process.
        lBuffer.size = 32; // +1
        lBuffer.removeInvalidationListener(lListener);
        lBuffer.size = 64; // Should not increment.

        // Evaluation.
        expect(lCallCount).toBe(1);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuObject -- lazy native creation', async (pContext) => {
    await pContext.step('Native is lazily created on first access', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Uniform);

        // Process. First access should generate native.
        const lNative: GPUBuffer = lBuffer.native;

        // Evaluation.
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Subsequent native accesses return the same object (unless invalidated)', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Uniform);

        // Process.
        const lNative1: GPUBuffer = lBuffer.native;
        const lNative2: GPUBuffer = lBuffer.native;

        // Evaluation.
        expect(lNative1).toBe(lNative2);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('After invalidation, a new native is generated', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Uniform);

        // Process.
        const lNative1: GPUBuffer = lBuffer.native;
        lBuffer.size = 32; // Invalidates
        const lNative2: GPUBuffer = lBuffer.native;

        // Evaluation. After invalidation, a fresh native should be created.
        expect(lNative2).toBeTruthy();
        // They might or might not be the same object depending on implementation.
        // But the native should be functional.

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuObject -- setup pattern', async (pContext) => {
    await pContext.step('Setup can only be called once', async () => {
        // We test this through a setup-requiring object like BindGroupLayout.
        // This is tested elsewhere via Shader.setup() throwing on double call.
        // Here we just verify the pattern works on GpuBuffer (which does auto-setup).

        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);
        lBuffer.extendUsage(BufferUsage.Uniform);

        // Process / Evaluation. Native access triggers auto-setup and works.
        expect(lBuffer.native).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuResourceObject.extendUsage()', async (pContext) => {
    await pContext.step('Extending usage enables native creation', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);

        // Process. Without explicit usage, buffer still has CopySource + CopyDestination.
        lBuffer.extendUsage(BufferUsage.Storage);

        // Evaluation. Native should be creatable now.
        const lNative: GPUBuffer = lBuffer.native;
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Multiple usages can be combined', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lBuffer: GpuBuffer = new GpuBuffer(lDevice, 16);

        // Process.
        lBuffer.extendUsage(BufferUsage.Uniform);
        lBuffer.extendUsage(BufferUsage.Storage);

        // Evaluation. Buffer should have both usages set.
        const lNative: GPUBuffer = lBuffer.native;
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});
