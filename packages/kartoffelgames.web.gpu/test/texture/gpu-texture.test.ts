import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { GpuTexture } from '../../source/texture/gpu-texture.ts';
import { GpuTextureView } from '../../source/texture/gpu-texture-view.ts';
import { TextureDimension } from '../../source/constant/texture-dimension.enum.ts';
import { TextureFormat } from '../../source/constant/texture-format.enum.ts';
import { TextureUsage } from '../../source/constant/texture-usage.enum.ts';
import { TextureViewDimension } from '../../source/constant/texture-view-dimension.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

// --- GpuTexture Tests ---

Deno.test('GpuTexture -- constructor defaults', async (pContext) => {
    await pContext.step('Default dimensions are 1x1x1', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });

        // Evaluation.
        expect(lTexture.width).toBe(1);
        expect(lTexture.height).toBe(1);
        expect(lTexture.depth).toBe(1);

        // Cleanup.
        lTexture.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Default mipCount is 1', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });

        // Evaluation.
        expect(lTexture.mipCount).toBe(1);

        // Cleanup.
        lTexture.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Constructor sets format and dimension correctly', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba16float,
            dimension: TextureDimension.ThreeDimension,
            multisampled: false
        });

        // Evaluation.
        expect(lTexture.format).toBe(TextureFormat.Rgba16float);
        expect(lTexture.dimension).toBe(TextureDimension.ThreeDimension);
        expect(lTexture.multiSampled).toBe(false);

        // Cleanup.
        lTexture.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Multisampled texture is created correctly', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: true
        });

        // Evaluation.
        expect(lTexture.multiSampled).toBe(true);

        // Cleanup.
        lTexture.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuTexture -- property setters', async (pContext) => {
    await pContext.step('Width setter updates width', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });

        // Process.
        lTexture.width = 256;

        // Evaluation.
        expect(lTexture.width).toBe(256);

        // Cleanup.
        lTexture.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Height setter updates height', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });

        // Process.
        lTexture.height = 512;

        // Evaluation.
        expect(lTexture.height).toBe(512);

        // Cleanup.
        lTexture.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Depth setter updates depth', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });

        // Process.
        lTexture.depth = 6;

        // Evaluation.
        expect(lTexture.depth).toBe(6);

        // Cleanup.
        lTexture.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('MipCount setter updates mipCount', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });

        // Process.
        lTexture.mipCount = 4;

        // Evaluation.
        expect(lTexture.mipCount).toBe(4);

        // Cleanup.
        lTexture.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuTexture.native', async (pContext) => {
    await pContext.step('Returns a GPUTexture after extending usage', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });
        lTexture.width = 64;
        lTexture.height = 64;
        lTexture.extendUsage(TextureUsage.TextureBinding);

        // Process.
        const lNative: GPUTexture = lTexture.native;

        // Evaluation.
        expect(lNative).toBeTruthy();

        // Cleanup.
        lTexture.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuTexture.useAs()', async (pContext) => {
    await pContext.step('Creates a GpuTextureView with default dimension', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });
        lTexture.width = 64;
        lTexture.height = 64;
        lTexture.extendUsage(TextureUsage.TextureBinding);

        // Process.
        const lView: GpuTextureView = lTexture.useAs();

        // Evaluation.
        expect(lView).toBeTruthy();
        expect(lView.dimension).toBe(TextureViewDimension.TwoDimension);
        expect(lView.format).toBe(TextureFormat.Rgba8unorm);
        expect(lView.texture).toBe(lTexture);

        // Cleanup.
        lView.deconstruct();
        lTexture.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Creates a GpuTextureView with custom dimension', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });
        lTexture.width = 64;
        lTexture.height = 64;
        lTexture.depth = 6;
        lTexture.extendUsage(TextureUsage.TextureBinding);

        // Process.
        const lView: GpuTextureView = lTexture.useAs(TextureViewDimension.Cube);

        // Evaluation.
        expect(lView.dimension).toBe(TextureViewDimension.Cube);

        // Cleanup.
        lView.deconstruct();
        lTexture.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuTexture.copyFrom()', async (pContext) => {
    await pContext.step('Can copy from one texture to another', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSourceTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });
        lSourceTexture.width = 32;
        lSourceTexture.height = 32;
        lSourceTexture.extendUsage(TextureUsage.TextureBinding);

        const lDestTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });
        lDestTexture.width = 32;
        lDestTexture.height = 32;
        lDestTexture.extendUsage(TextureUsage.TextureBinding);

        // Process / Evaluation. Should not throw.
        lDestTexture.copyFrom(lSourceTexture);

        // Cleanup.
        lDestTexture.deconstruct();
        lSourceTexture.deconstruct();
        lDevice.deconstruct();
    });
});

// --- GpuTextureView Tests ---

Deno.test('GpuTextureView -- constructor defaults', async (pContext) => {
    await pContext.step('Default mip level start is 0', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });

        // Process.
        const lView: GpuTextureView = new GpuTextureView(lDevice, lTexture, TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm, false);

        // Evaluation.
        expect(lView.mipLevelStart).toBe(0);
        expect(lView.mipLevelEnd).toBe(-1);
        expect(lView.arrayLayerStart).toBe(0);
        expect(lView.arrayLayerEnd).toBe(-1);

        // Cleanup.
        lView.deconstruct();
        lTexture.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuTextureView -- property access', async (pContext) => {
    await pContext.step('Dimension, format, and multisampled are accessible', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });

        // Process.
        const lView: GpuTextureView = new GpuTextureView(lDevice, lTexture, TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm, false);

        // Evaluation.
        expect(lView.dimension).toBe(TextureViewDimension.TwoDimension);
        expect(lView.format).toBe(TextureFormat.Rgba8unorm);
        expect(lView.multisampled).toBe(false);
        expect(lView.texture).toBe(lTexture);

        // Cleanup.
        lView.deconstruct();
        lTexture.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuTextureView -- property setters', async (pContext) => {
    await pContext.step('MipLevelStart setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });
        const lView: GpuTextureView = new GpuTextureView(lDevice, lTexture, TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm, false);

        // Process.
        lView.mipLevelStart = 1;

        // Evaluation.
        expect(lView.mipLevelStart).toBe(1);

        // Cleanup.
        lView.deconstruct();
        lTexture.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('ArrayLayerStart setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });
        const lView: GpuTextureView = new GpuTextureView(lDevice, lTexture, TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm, false);

        // Process.
        lView.arrayLayerStart = 2;

        // Evaluation.
        expect(lView.arrayLayerStart).toBe(2);

        // Cleanup.
        lView.deconstruct();
        lTexture.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('GpuTextureView.native', async (pContext) => {
    await pContext.step('Returns a GPUTextureView after native generation', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lTexture: GpuTexture = new GpuTexture(lDevice, {
            format: TextureFormat.Rgba8unorm,
            dimension: TextureDimension.TwoDimension,
            multisampled: false
        });
        lTexture.width = 64;
        lTexture.height = 64;
        lTexture.extendUsage(TextureUsage.TextureBinding);

        // Process.
        const lView: GpuTextureView = lTexture.useAs();
        const lNative: GPUTextureView = lView.native;

        // Evaluation.
        expect(lNative).toBeTruthy();

        // Cleanup.
        lView.deconstruct();
        lTexture.deconstruct();
        lDevice.deconstruct();
    });
});
