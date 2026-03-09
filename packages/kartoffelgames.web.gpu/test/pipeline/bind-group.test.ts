import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { BindGroupLayout } from '../../source/pipeline/bind_group_layout/bind-group-layout.ts';
import { BindGroup } from '../../source/pipeline/bind_group/bind-group.ts';
import { ComputeStage } from '../../source/constant/compute-stage.enum.ts';
import { SamplerType } from '../../source/constant/sampler-type.enum.ts';
import { TextureViewDimension } from '../../source/constant/texture-view-dimension.enum.ts';
import { TextureFormat } from '../../source/constant/texture-format.enum.ts';
import { StorageBindingType } from '../../source/constant/storage-binding-type.enum.ts';
import { GpuBuffer } from '../../source/buffer/gpu-buffer.ts';
import { TextureSampler } from '../../source/texture/texture-sampler.ts';
import { GpuTextureView } from '../../source/texture/gpu-texture-view.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

/**
 * Helper to create a simple bind group layout with a uniform buffer.
 */
async function gCreateBufferLayout(): Promise<{ device: GpuDevice; layout: BindGroupLayout; }> {
    const lDevice: GpuDevice = await gRequestDevice();
    const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'TestGroup');
    lLayout.setup((pSetup) => {
        pSetup.binding(0, 'buffer', ComputeStage.Vertex).asBuffer(64); // mat4x4f
    });
    return { device: lDevice, layout: lLayout };
}

Deno.test('BindGroup.layout', async (pContext) => {
    await pContext.step('Returns the layout passed in constructor', async () => {
        // Setup.
        const { device: lDevice, layout: lLayout } = await gCreateBufferLayout();

        // Process.
        const lBindGroup: BindGroup = new BindGroup(lDevice, lLayout);

        // Evaluation.
        expect(lBindGroup.layout).toBe(lLayout);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('BindGroup.data() -- buffer', async (pContext) => {
    await pContext.step('createBuffer creates a GpuBuffer for buffer binding', async () => {
        // Setup.
        const { device: lDevice, layout: lLayout } = await gCreateBufferLayout();
        const lBindGroup: BindGroup = new BindGroup(lDevice, lLayout);

        // Process.
        const lBuffer: GpuBuffer = lBindGroup.data('buffer').createBuffer();

        // Evaluation.
        expect(lBuffer).toBeTruthy();
        expect(lBuffer.size).toBeGreaterThanOrEqual(64);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('createBufferWithRawData creates buffer with initial data', async () => {
        // Setup.
        const { device: lDevice, layout: lLayout } = await gCreateBufferLayout();
        const lBindGroup: BindGroup = new BindGroup(lDevice, lLayout);
        const lData: Float32Array = new Float32Array(16); // 64 bytes for mat4x4f
        lData.fill(1.0);

        // Process.
        const lBuffer: GpuBuffer = lBindGroup.data('buffer').createBufferWithRawData(lData.buffer);

        // Evaluation.
        expect(lBuffer).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('BindGroup.data() -- sampler', async (pContext) => {
    await pContext.step('createSampler creates a TextureSampler for sampler binding', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'SamplerGroup');
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'sampler', ComputeStage.Fragment).asSampler(SamplerType.Filter);
        });
        const lBindGroup: BindGroup = new BindGroup(lDevice, lLayout);

        // Process.
        const lSampler: TextureSampler = lBindGroup.data('sampler').createSampler();

        // Evaluation.
        expect(lSampler).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('BindGroup.data() -- texture', async (pContext) => {
    await pContext.step('createTexture creates a GpuTextureView for texture binding', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'TextureGroup');
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'texture', ComputeStage.Fragment).asTexture(TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm);
        });
        const lBindGroup: BindGroup = new BindGroup(lDevice, lLayout);

        // Process.
        const lTextureView: GpuTextureView = lBindGroup.data('texture').createTexture();

        // Evaluation.
        expect(lTextureView).toBeTruthy();
        expect(lTextureView.texture).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('BindGroup.native', async (pContext) => {
    await pContext.step('Creates GPUBindGroup when all bindings are provided', async () => {
        // Setup.
        const { device: lDevice, layout: lLayout } = await gCreateBufferLayout();
        const lBindGroup: BindGroup = new BindGroup(lDevice, lLayout);
        lBindGroup.data('buffer').createBuffer();

        // Process.
        const lNative: GPUBindGroup = lBindGroup.native;

        // Evaluation.
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws when binding data is missing', async () => {
        // Setup.
        const { device: lDevice, layout: lLayout } = await gCreateBufferLayout();
        const lBindGroup: BindGroup = new BindGroup(lDevice, lLayout);

        // Evaluation. Native access without setting data should throw.
        const lThrowFunction = () => {
            lBindGroup.native;
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('BindGroup -- multiple bindings', async (pContext) => {
    await pContext.step('BindGroup with buffer, sampler, and texture bindings', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'MixedGroup');
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'uniformBuffer', ComputeStage.Vertex).asBuffer(64);
            pSetup.binding(1, 'sampler', ComputeStage.Fragment).asSampler(SamplerType.Filter);
            pSetup.binding(2, 'texture', ComputeStage.Fragment).asTexture(TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm);
        });

        const lBindGroup: BindGroup = new BindGroup(lDevice, lLayout);

        // Process. Set all bindings.
        lBindGroup.data('uniformBuffer').createBuffer();
        lBindGroup.data('sampler').createSampler();
        const lTextureView: GpuTextureView = lBindGroup.data('texture').createTexture();
        lTextureView.texture.width = 64;
        lTextureView.texture.height = 64;

        // Evaluation.
        const lNative: GPUBindGroup = lBindGroup.native;
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('BindGroup -- storage buffer binding', async (pContext) => {
    await pContext.step('Storage buffer with read access', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'StorageGroup');
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'storageBuffer', ComputeStage.Compute, StorageBindingType.Read).asBuffer(16);
        });

        const lBindGroup: BindGroup = new BindGroup(lDevice, lLayout);

        // Process.
        lBindGroup.data('storageBuffer').createBuffer();

        // Evaluation.
        const lNative: GPUBindGroup = lBindGroup.native;
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});
