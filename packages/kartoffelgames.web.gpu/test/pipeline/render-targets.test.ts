import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { RenderTargetsLayout } from '../../source/pipeline/render_targets/render-targets-layout.ts';
import type { RenderTargets } from '../../source/pipeline/render_targets/render-targets.ts';
import type { GpuTextureView } from '../../source/texture/gpu-texture-view.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('RenderTargets.layout', async (pContext) => {
    await pContext.step('Returns the layout passed to createRenderTargets', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, 'rgba8unorm');
        });

        // Process.
        const lRenderTargets: RenderTargets = lLayout.create();

        // Evaluation.
        expect(lRenderTargets.layout).toBe(lLayout);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('RenderTargets.resize()', async (pContext) => {
    await pContext.step('Resize updates width and height', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, 'rgba8unorm');
        });

        const lRenderTargets: RenderTargets = lLayout.create();

        // Process.
        lRenderTargets.resize(600, 800);

        // Evaluation.
        expect(lRenderTargets.width).toBe(800);
        expect(lRenderTargets.height).toBe(600);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Default size is 1x1', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, 'rgba8unorm');
        });

        // Process.
        const lRenderTargets: RenderTargets = lLayout.create();

        // Evaluation.
        expect(lRenderTargets.width).toBe(1);
        expect(lRenderTargets.height).toBe(1);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('RenderTargets.colorTarget()', async (pContext) => {
    await pContext.step('Returns texture view for existing color target', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, 'rgba8unorm');
        });

        const lRenderTargets: RenderTargets = lLayout.create();

        // Process.
        const lTextureView: GpuTextureView = lRenderTargets.colorTarget('color0').renderView;

        // Evaluation.
        expect(lTextureView).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws for non-existing color target name', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, 'rgba8unorm');
        });

        const lRenderTargets: RenderTargets = lLayout.create();

        // Evaluation.
        const lThrowFunction = () => {
            lRenderTargets.colorTarget('nonExistent');
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('RenderTargets.depthStencilTarget()', async (pContext) => {
    await pContext.step('Returns depth stencil texture view when configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, 'rgba8unorm');
            pSetup.addDepthStencil('depth24plus', true, 1.0);
        });

        const lRenderTargets: RenderTargets = lLayout.create();

        // Process.
        const lDepthTexture: GpuTextureView = lRenderTargets.depthStencilTarget().renderView;

        // Evaluation.
        expect(lDepthTexture).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws when no depth stencil is configured', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false);
        lLayout.setup((pSetup) => {
            pSetup.addColor('color0', 0, 'rgba8unorm');
        });

        const lRenderTargets: RenderTargets = lLayout.create();

        // Evaluation.
        const lThrowFunction = () => {
            lRenderTargets.depthStencilTarget();
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});
