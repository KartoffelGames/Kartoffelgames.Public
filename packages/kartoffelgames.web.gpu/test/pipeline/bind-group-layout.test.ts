import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { BindGroupLayout, type BindGroupBindLayout } from '../../source/pipeline/bind_group_layout/bind-group-layout.ts';
import { StorageBindingType } from '../../source/constant/storage-binding-type.enum.ts';
import { ComputeStage } from '../../source/constant/compute-stage.enum.ts';
import { SamplerType } from '../../source/constant/sampler-type.enum.ts';
import { TextureViewDimension } from '../../source/constant/texture-view-dimension.enum.ts';
import { TextureFormat } from '../../source/constant/texture-format.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('BindGroupLayout.setup() -- buffer binding', async (pContext) => {
    await pContext.step('Setup with a uniform buffer binding creates correct bind layout', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'TestGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'myBuffer', ComputeStage.Vertex).asBuffer(16); // vec4<f32> = 16 bytes
        });

        // Evaluation.
        const lBind: Readonly<BindGroupBindLayout> = lLayout.getBind('myBuffer');
        expect(lBind.name).toBe('myBuffer');
        expect(lBind.index).toBe(0);
        expect(lBind.resource.type).toBe('buffer');
        expect(lBind.storageType).toBe(StorageBindingType.None);
        expect(lBind.hasDynamicOffset).toBe(false);

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Setup with a storage buffer binding has correct storage type', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'StorageGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'storageBuffer', ComputeStage.Fragment, StorageBindingType.Read).asBuffer(4); // f32 = 4 bytes
        });

        // Evaluation.
        const lBind: Readonly<BindGroupBindLayout> = lLayout.getBind('storageBuffer');
        expect(lBind.storageType).toBe(StorageBindingType.Read);

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Setup with dynamic offset buffer binding', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'DynamicGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'dynamicBuffer', ComputeStage.Vertex).asBuffer(16, 0, true); // vec4<f32>, dynamic offset
        });

        // Evaluation.
        const lBind: Readonly<BindGroupBindLayout> = lLayout.getBind('dynamicBuffer');
        expect(lBind.hasDynamicOffset).toBe(true);
        expect(lLayout.hasDynamicOffset).toBe(true);

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Resource counter counts uniform buffers', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'CounterGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'buf1', ComputeStage.Vertex).asBuffer(4); // f32
            pSetup.binding(1, 'buf2', ComputeStage.Vertex).asBuffer(4); // u32
        });

        // Evaluation.
        expect(lLayout.resourceCounter.uniformBuffers).toBe(2);

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('BindGroupLayout.setup() -- sampler binding', async (pContext) => {
    await pContext.step('Setup with a filtering sampler binding', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'SamplerGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'mySampler', ComputeStage.Fragment).asSampler(SamplerType.Filter);
        });

        // Evaluation.
        const lBind: Readonly<BindGroupBindLayout> = lLayout.getBind('mySampler');
        expect(lBind.name).toBe('mySampler');
        expect(lBind.resource.type).toBe('sampler');
        if (lBind.resource.type === 'sampler') {
            expect(lBind.resource.samplerType).toBe(SamplerType.Filter);
        }

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Resource counter counts samplers', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'SamplerCountGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'sampler1', ComputeStage.Fragment).asSampler(SamplerType.Filter);
            pSetup.binding(1, 'sampler2', ComputeStage.Fragment).asSampler(SamplerType.Comparison);
        });

        // Evaluation.
        expect(lLayout.resourceCounter.sampler).toBe(2);

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('BindGroupLayout.setup() -- texture binding', async (pContext) => {
    await pContext.step('Setup with a 2D texture binding', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'TextureGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'myTexture', ComputeStage.Fragment).asTexture(TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        const lBind: Readonly<BindGroupBindLayout> = lLayout.getBind('myTexture');
        expect(lBind.name).toBe('myTexture');
        expect(lBind.resource.type).toBe('texture');
        if (lBind.resource.type === 'texture') {
            expect(lBind.resource.dimension).toBe(TextureViewDimension.TwoDimension);
            expect(lBind.resource.format).toBe(TextureFormat.Rgba8unorm);
            expect(lBind.resource.multisampled).toBe(false);
        }

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Resource counter counts sampled textures', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'TexCountGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'tex1', ComputeStage.Fragment).asTexture(TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        expect(lLayout.resourceCounter.sampledTextures).toBe(1);

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Storage texture is counted as storage texture', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'StorageTexGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'storageTex', ComputeStage.Fragment, StorageBindingType.Write).asTexture(TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        expect(lLayout.resourceCounter.storageTextures).toBe(1);

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('BindGroupLayout -- type discriminated union', async (pContext) => {
    await pContext.step('Buffer resource has fixedSize and variableSize properties', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'TypeCheckGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'buf', ComputeStage.Vertex).asBuffer(16); // vec4<f32>
        });

        // Evaluation.
        const lBind: Readonly<BindGroupBindLayout> = lLayout.getBind('buf');
        if (lBind.resource.type === 'buffer') {
            expect(typeof lBind.resource.fixedSize).toBe('number');
            expect(typeof lBind.resource.variableSize).toBe('number');
        }

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Sampler resource has samplerType property', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'SamplerTypeCheck');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'sampler', ComputeStage.Fragment).asSampler(SamplerType.NoneFiltering);
        });

        // Evaluation.
        const lBind: Readonly<BindGroupBindLayout> = lLayout.getBind('sampler');
        if (lBind.resource.type === 'sampler') {
            expect(lBind.resource.samplerType).toBe(SamplerType.NoneFiltering);
        }

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('Texture resource has dimension, format, and multisampled properties', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'TextureTypeCheck');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'tex', ComputeStage.Fragment).asTexture(TextureViewDimension.Cube, TextureFormat.Rgba32float);
        });

        // Evaluation.
        const lBind: Readonly<BindGroupBindLayout> = lLayout.getBind('tex');
        if (lBind.resource.type === 'texture') {
            expect(lBind.resource.dimension).toBe(TextureViewDimension.Cube);
            expect(lBind.resource.format).toBe(TextureFormat.Rgba32float);
            expect(lBind.resource.multisampled).toBe(false);
        }

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('BindGroupLayout.orderedBindingNames', async (pContext) => {
    await pContext.step('Returns binding names ordered by index', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'OrderGroup');

        // Process.
        lLayout.setup((pSetup) => {
            pSetup.binding(0, 'first', ComputeStage.Vertex).asBuffer(4); // f32
            pSetup.binding(1, 'second', ComputeStage.Vertex).asSampler(SamplerType.Filter);
            pSetup.binding(2, 'third', ComputeStage.Fragment).asTexture(TextureViewDimension.TwoDimension, TextureFormat.Rgba8unorm);
        });

        // Evaluation.
        const lNames: Array<string> = lLayout.orderedBindingNames;
        expect(lNames[0]).toBe('first');
        expect(lNames[1]).toBe('second');
        expect(lNames[2]).toBe('third');

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('BindGroupLayout.name', async (pContext) => {
    await pContext.step('Returns the name passed in the constructor', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lLayout: BindGroupLayout = new BindGroupLayout(lDevice, 'MyGroupName');

        // Evaluation.
        expect(lLayout.name).toBe('MyGroupName');

        // Cleanup.
        lLayout.deconstruct();
        lDevice.deconstruct();
    });
});
