import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { RenderTargetsLayout } from '../../source/pipeline/render_targets/render-targets-layout.ts';
import { TextureFormat } from '../../source/constant/texture-format.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function requestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('RenderTargets.layout', async (pContext) => {
    await pContext.step('Returns the layout passed to createRenderTargets', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
        });

        // Process.
        const lRenderTargets = lLayout.create();

        // Evaluation.
        expect(lRenderTargets.layout).toBe(lLayout);
    });
});

Deno.test('RenderTargets.resize()', async (pContext) => {
    await pContext.step('Resize updates width and height', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
        });

        const lRenderTargets = lLayout.create();

        // Process.
        lRenderTargets.resize(600, 800);

        // Evaluation.
        expect(lRenderTargets.width).toBe(800);
        expect(lRenderTargets.height).toBe(600);
    });

    await pContext.step('Default size is 1x1', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
        });

        // Process.
        const lRenderTargets = lLayout.create();

        // Evaluation.
        expect(lRenderTargets.width).toBe(1);
        expect(lRenderTargets.height).toBe(1);
    });
});

Deno.test('RenderTargets.colorTarget()', async (pContext) => {
    await pContext.step('Returns texture view for existing color target', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
        });

        const lRenderTargets = lLayout.create();

        // Process.
        const lTextureView = lRenderTargets.colorTarget('color0');

        // Evaluation.
        expect(lTextureView).toBeTruthy();
    });

    await pContext.step('Throws for non-existing color target name', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
        });

        const lRenderTargets = lLayout.create();

        // Evaluation.
        const lThrowFunction = () => {
            lRenderTargets.colorTarget('nonExistent');
        };
        expect(lThrowFunction).toThrow();
    });
});

Deno.test('RenderTargets.depthStencilTarget()', async (pContext) => {
    await pContext.step('Returns depth stencil texture view when configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
            pSetup.addDepthStencil(TextureFormat.Depth24plus, true, 1.0);
        });

        const lRenderTargets = lLayout.create();

        // Process.
        const lDepthTexture = lRenderTargets.depthStencilTarget();

        // Evaluation.
        expect(lDepthTexture).toBeTruthy();
    });

    await pContext.step('Throws when no depth stencil is configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await requestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, TextureFormat.Rgba8unorm);
        });

        const lRenderTargets = lLayout.create();

        // Evaluation.
        const lThrowFunction = () => {
            lRenderTargets.depthStencilTarget();
        };
        expect(lThrowFunction).toThrow();
    });
});
