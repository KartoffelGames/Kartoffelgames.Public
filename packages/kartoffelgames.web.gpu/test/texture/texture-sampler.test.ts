import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { TextureSampler } from '../../source/texture/texture-sampler.ts';
import { SamplerType } from '../../source/constant/sampler-type.enum.ts';
import { FilterMode } from '../../source/constant/filter-mode.enum.ts';
import { WrappingMode } from '../../source/constant/wrapping-mode.enum.ts';
import { CompareFunction } from '../../source/constant/compare-function.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('TextureSampler -- constructor defaults', async (pContext) => {
    await pContext.step('Default filter modes are Linear', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Evaluation.
        expect(lSampler.magFilter).toBe(FilterMode.Linear);
        expect(lSampler.minFilter).toBe(FilterMode.Linear);
        expect(lSampler.mipmapFilter).toBe(FilterMode.Linear);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Default wrap mode is ClampToEdge', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Evaluation.
        expect(lSampler.wrapMode).toBe(WrappingMode.ClampToEdge);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Default LOD clamps are 0 and 32', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Evaluation.
        expect(lSampler.lodMinClamp).toBe(0);
        expect(lSampler.lodMaxClamp).toBe(32);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Default maxAnisotropy is 16', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Evaluation.
        expect(lSampler.maxAnisotropy).toBe(16);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Default compare is null', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Evaluation.
        expect(lSampler.compare).toBeNull();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('SamplerType is stored correctly', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Comparison);

        // Evaluation.
        expect(lSampler.samplerType).toBe(SamplerType.Comparison);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('TextureSampler -- property setters', async (pContext) => {
    await pContext.step('MagFilter setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Process.
        lSampler.magFilter = FilterMode.Nearest;

        // Evaluation.
        expect(lSampler.magFilter).toBe(FilterMode.Nearest);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('MinFilter setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Process.
        lSampler.minFilter = FilterMode.Nearest;

        // Evaluation.
        expect(lSampler.minFilter).toBe(FilterMode.Nearest);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('MipmapFilter setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Process.
        lSampler.mipmapFilter = FilterMode.Nearest;

        // Evaluation.
        expect(lSampler.mipmapFilter).toBe(FilterMode.Nearest);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('WrapMode setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Process.
        lSampler.wrapMode = WrappingMode.Repeat;

        // Evaluation.
        expect(lSampler.wrapMode).toBe(WrappingMode.Repeat);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('LodMinClamp setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Process.
        lSampler.lodMinClamp = 2;

        // Evaluation.
        expect(lSampler.lodMinClamp).toBe(2);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('LodMaxClamp setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Process.
        lSampler.lodMaxClamp = 16;

        // Evaluation.
        expect(lSampler.lodMaxClamp).toBe(16);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('MaxAnisotropy setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Process.
        lSampler.maxAnisotropy = 8;

        // Evaluation.
        expect(lSampler.maxAnisotropy).toBe(8);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Compare setter works', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Comparison);

        // Process.
        lSampler.compare = CompareFunction.Less;

        // Evaluation.
        expect(lSampler.compare).toBe(CompareFunction.Less);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('TextureSampler.native', async (pContext) => {
    await pContext.step('Filtering sampler creates a valid GPUSampler', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Filter);

        // Process.
        const lNative: GPUSampler = lSampler.native;

        // Evaluation.
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Comparison sampler with compare function creates a valid GPUSampler', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Comparison);
        lSampler.compare = CompareFunction.Less;

        // Process.
        const lNative: GPUSampler = lSampler.native;

        // Evaluation.
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Comparison sampler without compare function throws', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.Comparison);

        // Evaluation.
        const lThrowFunction = () => {
            return lSampler.native;
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Non-filtering sampler creates a valid GPUSampler', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lSampler: TextureSampler = new TextureSampler(lDevice, SamplerType.NoneFiltering);

        // Process.
        const lNative: GPUSampler = lSampler.native;

        // Evaluation.
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});
