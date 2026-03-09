import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { GpuLimit } from '../../source/constant/gpu-limit.enum.ts';
import { TextureFormat } from '../../source/constant/texture-format.enum.ts';
import type { TextureFormatCapability } from '../../source/device/capabilities/gpu-texture-format-capabilities.ts';
import { Shader } from '../../source/shader/shader.ts';
import { RenderTargetsLayout } from '../../source/pipeline/render_targets/render-targets-layout.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('GpuDevice.request()', async (pContext) => {
    await pContext.step('Returns a GpuDevice instance', async () => {
        // Process.
        const lDevice: GpuDevice = await gRequestDevice();

        // Evaluation.
        expect(lDevice).toBeTruthy();
        expect(lDevice.gpu).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Device has a valid GPUDevice native', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Evaluation.
        expect(lDevice.gpu).toBeInstanceOf(GPUDevice);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuDevice.readDeviceLimits()', async (pContext) => {
    await pContext.step('Returns limits object for high-performance', async () => {
        // Process.
        const lLimits: Record<GpuLimit, number> = await GpuDevice.readDeviceLimits('high-performance');

        // Evaluation.
        expect(lLimits).toBeTruthy();
        expect(typeof lLimits[GpuLimit.MaxBindGroups]).toBe('number');
    });
});

Deno.test('GpuDevice.capabilities', async (pContext) => {
    await pContext.step('Returns GpuDeviceCapabilities instance', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Evaluation.
        expect(lDevice.capabilities).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Can read a limit via capabilities', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lMaxBindGroups: number = lDevice.capabilities.getLimit(GpuLimit.MaxBindGroups);

        // Evaluation.
        expect(typeof lMaxBindGroups).toBe('number');
        expect(lMaxBindGroups).toBeGreaterThan(0);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuDevice.formatValidator', async (pContext) => {
    await pContext.step('Returns GpuTextureFormatCapabilities instance', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Evaluation.
        expect(lDevice.formatValidator).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Can query capability of a texture format', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lCapability: TextureFormatCapability = lDevice.formatValidator.capabilityOf(TextureFormat.Rgba8unorm);

        // Evaluation.
        expect(lCapability).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuDevice.frameCount', async (pContext) => {
    await pContext.step('Initial frame count is 0', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Evaluation.
        expect(lDevice.frameCount).toBe(0);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Frame count increments after startNewFrame', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        lDevice.processTick();
        lDevice.processTick();

        // Evaluation.
        expect(lDevice.frameCount).toBe(2);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuDevice.startNewFrame()', async (pContext) => {
    await pContext.step('Calls frame change listeners', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        let lListenerCalled: boolean = false;
        lDevice.addTickListener(() => {
            lListenerCalled = true;
        });

        // Process.
        lDevice.processTick();

        // Evaluation.
        expect(lListenerCalled).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Listener can be removed and is no longer called', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        let lCallCount: number = 0;
        const lListener = () => {
            lCallCount++;
        };
        lDevice.addTickListener(lListener);

        // Process.
        lDevice.processTick(); // +1
        lDevice.removeTickListener(lListener);
        lDevice.processTick(); // should not call

        // Evaluation.
        expect(lCallCount).toBe(1);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuDevice.shader()', async (pContext) => {
    await pContext.step('Creates a Shader instance', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lShader: Shader = lDevice.shader('@vertex fn vs() -> @builtin(position) vec4f { return vec4f(0.0); }');

        // Evaluation.
        expect(lShader).toBeTruthy();

        // Cleanup.
        lShader.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuDevice.renderTargetsLayout()', async (pContext) => {
    await pContext.step('Creates non-multisampled layout by default', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lLayout: RenderTargetsLayout = lDevice.renderTargetsLayout();

        // Evaluation.
        expect(lLayout.multisampled).toBe(false);

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Creates multisampled layout when specified', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lLayout: RenderTargetsLayout = lDevice.renderTargetsLayout(true);

        // Evaluation.
        expect(lLayout.multisampled).toBe(true);

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });
});
