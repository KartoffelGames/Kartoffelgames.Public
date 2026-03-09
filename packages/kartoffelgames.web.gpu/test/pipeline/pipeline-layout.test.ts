import { Dictionary } from '@kartoffelgames/core';
import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { PipelineLayout } from '../../source/pipeline/pipeline-layout.ts';
import { BindGroupLayout } from '../../source/pipeline/bind_group_layout/bind-group-layout.ts';
import { BindGroup } from '../../source/pipeline/bind_group/bind-group.ts';
import { PipelineData } from '../../source/pipeline/pipeline_data/pipeline-data.ts';
import { ComputeStage } from '../../source/constant/compute-stage.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

/**
 * Helper to create a simple bind group layout.
 */
function gCreateSimpleLayout(pDevice: GpuDevice, pName: string): BindGroupLayout {
    return new BindGroupLayout(pDevice, pName).setup((pSetup) => {
        pSetup.binding(0, 'buffer', ComputeStage.Vertex).asBuffer(64);
    });
}

Deno.test('PipelineLayout.groups', async (pContext) => {
    await pContext.step('Returns group names', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lGroup0: BindGroupLayout = gCreateSimpleLayout(lDevice, 'group0');
        const lGroups: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        lGroups.set(0, lGroup0);

        // Process.
        const lPipelineLayout: PipelineLayout = new PipelineLayout(lDevice, lGroups);

        // Evaluation.
        expect(lPipelineLayout.groups.length).toBe(1);
        expect(lPipelineLayout.groups[0]).toBe('group0');

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Returns multiple group names', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lGroup0: BindGroupLayout = gCreateSimpleLayout(lDevice, 'object');
        const lGroup1: BindGroupLayout = gCreateSimpleLayout(lDevice, 'scene');
        const lGroups: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        lGroups.set(0, lGroup0);
        lGroups.set(1, lGroup1);

        // Process.
        const lPipelineLayout: PipelineLayout = new PipelineLayout(lDevice, lGroups);

        // Evaluation.
        expect(lPipelineLayout.groups.length).toBe(2);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('PipelineLayout.getGroupLayout()', async (pContext) => {
    await pContext.step('Returns layout for existing group name', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lGroup0: BindGroupLayout = gCreateSimpleLayout(lDevice, 'myGroup');
        const lGroups: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        lGroups.set(0, lGroup0);
        const lPipelineLayout: PipelineLayout = new PipelineLayout(lDevice, lGroups);

        // Process.
        const lRetrievedLayout: BindGroupLayout = lPipelineLayout.getGroupLayout('myGroup');

        // Evaluation.
        expect(lRetrievedLayout).toBe(lGroup0);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws for non-existing group name', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lGroup0: BindGroupLayout = gCreateSimpleLayout(lDevice, 'myGroup');
        const lGroups: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        lGroups.set(0, lGroup0);
        const lPipelineLayout: PipelineLayout = new PipelineLayout(lDevice, lGroups);

        // Evaluation.
        const lThrowFunction = () => {
            lPipelineLayout.getGroupLayout('nonExistent');
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('PipelineLayout.groupIndex()', async (pContext) => {
    await pContext.step('Returns correct index for group name', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lGroup0: BindGroupLayout = gCreateSimpleLayout(lDevice, 'first');
        const lGroup1: BindGroupLayout = gCreateSimpleLayout(lDevice, 'second');
        const lGroups: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        lGroups.set(0, lGroup0);
        lGroups.set(1, lGroup1);
        const lPipelineLayout: PipelineLayout = new PipelineLayout(lDevice, lGroups);

        // Evaluation.
        expect(lPipelineLayout.groupIndex('first')).toBe(0);
        expect(lPipelineLayout.groupIndex('second')).toBe(1);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws for non-existing group name', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lGroup0: BindGroupLayout = gCreateSimpleLayout(lDevice, 'first');
        const lGroups: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        lGroups.set(0, lGroup0);
        const lPipelineLayout: PipelineLayout = new PipelineLayout(lDevice, lGroups);

        // Evaluation.
        const lThrowFunction = () => {
            lPipelineLayout.groupIndex('nonExistent');
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('PipelineLayout.native', async (pContext) => {
    await pContext.step('Returns a GPUPipelineLayout', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lGroup0: BindGroupLayout = gCreateSimpleLayout(lDevice, 'myGroup');
        const lGroups: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        lGroups.set(0, lGroup0);
        const lPipelineLayout: PipelineLayout = new PipelineLayout(lDevice, lGroups);

        // Process.
        const lNative: GPUPipelineLayout = lPipelineLayout.native;

        // Evaluation.
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('PipelineLayout -- validation', async (pContext) => {
    await pContext.step('Throws for duplicate group names', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lGroup0: BindGroupLayout = gCreateSimpleLayout(lDevice, 'duplicate');
        const lGroup1: BindGroupLayout = gCreateSimpleLayout(lDevice, 'duplicate');
        const lGroups: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        lGroups.set(0, lGroup0);
        lGroups.set(1, lGroup1);

        // Evaluation.
        const lThrowFunction = () => {
            new PipelineLayout(lDevice, lGroups);
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('PipelineLayout.withData()', async (pContext) => {
    await pContext.step('Creates a PipelineData object', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lGroup0: BindGroupLayout = gCreateSimpleLayout(lDevice, 'myGroup');
        const lGroups: Dictionary<number, BindGroupLayout> = new Dictionary<number, BindGroupLayout>();
        lGroups.set(0, lGroup0);
        const lPipelineLayout: PipelineLayout = new PipelineLayout(lDevice, lGroups);

        // Create a bind group with data.
        const lBindGroup: BindGroup = lGroup0.create();
        lBindGroup.data('buffer').createBuffer();

        // Process.
        const lPipelineData: PipelineData = lPipelineLayout.withData((pSetup) => {
            pSetup.addGroup(lBindGroup);
        });

        // Evaluation.
        expect(lPipelineData).toBeTruthy();
        expect(lPipelineData.layout).toBe(lPipelineLayout);

        // Cleanup.
        lDevice.deconstruct();
    });
});
