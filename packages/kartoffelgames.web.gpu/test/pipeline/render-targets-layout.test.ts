import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { RenderTargetsLayout } from '../../source/pipeline/render_targets/render-targets-layout.ts';
import { TextureFormat } from '../../source/constant/texture-format.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('RenderTargetsLayout.setup() -- color targets', async (pContext) => {
    await pContext.step('Setup with a single color target', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        const lNames: Array<string> = lLayout.colorTargetNames;
        expect(lNames.length).toBe(1);
        expect(lNames[0]).toBe('color0');
    });

    await pContext.step('Setup with multiple color targets', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
            pSetup.addColor('color1', 1, TextureFormat.Rgba16float);
        });

        // Evaluation.
        const lNames: Array<string> = lLayout.colorTargetNames;
        expect(lNames.length).toBe(2);
        expect(lNames[0]).toBe('color0');
        expect(lNames[1]).toBe('color1');
    });

    await pContext.step('Color target stores correct format and keepOnEnd', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('myTarget', 0, TextureFormat.Bgra8unorm, false, { r: 0.5, g: 0.5, b: 0.5, a: 1.0 });
        });

        // Evaluation.
        const lTarget = lLayout.colorTarget('myTarget');
        expect(lTarget.format).toBe(TextureFormat.Bgra8unorm);
        expect(lTarget.keepOnEnd).toBe(false);
        expect(lTarget.clearValue.r).toBe(0.5);
        expect(lTarget.clearValue.a).toBe(1.0);
        expect(lTarget.index).toBe(0);
    });

    await pContext.step('Default keepOnEnd is true and clearValue is zero', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process. Use default keepOnEnd and clearValue.
        lLayout.setup((pSetup) => {
            pSetup.addColor('defaultTarget', 0, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        const lTarget = lLayout.colorTarget('defaultTarget');
        expect(lTarget.keepOnEnd).toBe(true);
        expect(lTarget.clearValue.r).toBe(0);
        expect(lTarget.clearValue.g).toBe(0);
        expect(lTarget.clearValue.b).toBe(0);
        expect(lTarget.clearValue.a).toBe(0);
    });
});

Deno.test('RenderTargetsLayout.setup() -- depth and stencil', async (pContext) => {
    await pContext.step('Setup with depth only', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
            pSetup.addDepthStencil(TextureFormat.Depth24plus, true, 1.0);
        });

        // Evaluation.
        expect(lLayout.hasDepth).toBe(true);
        expect(lLayout.hasStencil).toBe(false);
        expect(lLayout.depthStencilFormat).toBe(TextureFormat.Depth24plus);
    });

    await pContext.step('Setup with stencil only', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
            pSetup.addDepthStencil(TextureFormat.Stencil8, null, null, true, 0);
        });

        // Evaluation.
        expect(lLayout.hasDepth).toBe(false);
        expect(lLayout.hasStencil).toBe(true);
        expect(lLayout.depthStencilFormat).toBe(TextureFormat.Stencil8);
    });

    await pContext.step('Setup with both depth and stencil', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
            pSetup.addDepthStencil(TextureFormat.Depth24plusStencil8, true, 1.0, true, 0);
        });

        // Evaluation.
        expect(lLayout.hasDepth).toBe(true);
        expect(lLayout.hasStencil).toBe(true);
        expect(lLayout.depthStencilFormat).toBe(TextureFormat.Depth24plusStencil8);
    });
});

Deno.test('RenderTargetsLayout.hasDepth', async (pContext) => {
    await pContext.step('Returns false when no depth stencil is configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        expect(lLayout.hasDepth).toBe(false);
    });

    await pContext.step('Returns true when depth is configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
            pSetup.addDepthStencil(TextureFormat.Depth32float, true, 1.0);
        });

        // Evaluation.
        expect(lLayout.hasDepth).toBe(true);
    });
});

Deno.test('RenderTargetsLayout.hasStencil', async (pContext) => {
    await pContext.step('Returns false when no stencil is configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
            pSetup.addDepthStencil(TextureFormat.Depth24plus, true, 1.0);
        });

        // Evaluation.
        expect(lLayout.hasStencil).toBe(false);
    });

    await pContext.step('Returns true when stencil is configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
            pSetup.addDepthStencil(TextureFormat.Depth24plusStencil8, null, null, true, 0);
        });

        // Evaluation.
        expect(lLayout.hasStencil).toBe(true);
    });
});

Deno.test('RenderTargetsLayout.multisampled', async (pContext) => {
    await pContext.step('Returns false when constructed without multisampling', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Evaluation.
        expect(lLayout.multisampled).toBe(false);
    });

    await pContext.step('Returns true when constructed with multisampling', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, true);

        // Evaluation.
        expect(lLayout.multisampled).toBe(true);
    });
});

Deno.test('RenderTargetsLayout.hasColorTarget()', async (pContext) => {
    await pContext.step('Returns true for existing color target', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('existingTarget', 0, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        expect(lLayout.hasColorTarget('existingTarget')).toBe(true);
    });

    await pContext.step('Returns false for non-existing color target', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('existingTarget', 0, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        expect(lLayout.hasColorTarget('nonExistingTarget')).toBe(false);
    });
});

Deno.test('RenderTargetsLayout.depthStencilConfig()', async (pContext) => {
    await pContext.step('Returns depth stencil config when configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
            pSetup.addDepthStencil(TextureFormat.Depth24plusStencil8, true, 1.0, true, 0);
        });

        // Evaluation.
        const lConfig = lLayout.depthStencilTarget();
        expect(lConfig.format).toBe(TextureFormat.Depth24plusStencil8);
        expect(lConfig.depth!.keepOnEnd).toBe(true);
        expect(lConfig.depth!.clearValue).toBe(1.0);
        expect(lConfig.stencil!.keepOnEnd).toBe(true);
        expect(lConfig.stencil!.clearValue).toBe(0);
    });

    await pContext.step('Throws when no depth stencil is configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        const lThrowFunction = () => {
            lLayout.depthStencilTarget();
        };
        expect(lThrowFunction).toThrow();
    });
});
