import { expect } from '@kartoffelgames/core-test';
import { ComputeStage } from '../../source/constant/compute-stage.enum.ts';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import type { GpuExecutionContext } from '../../source/execution/gpu-execution-context.ts';
import { GpuExecution } from '../../source/execution/gpu-execution.ts';
import { BindGroupLayout } from '../../source/pipeline/bind_group_layout/bind-group-layout.ts';
import type { ComputePipeline } from '../../source/pipeline/compute-pipeline.ts';
import { RenderTargetsLayout } from '../../source/pipeline/render_targets/render-targets-layout.ts';
import type { RenderTargets } from '../../source/pipeline/render_targets/render-targets.ts';
import { Shader } from '../../source/shader/shader.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

Deno.test('GpuExecution.execute()', async (pContext) => {
    await pContext.step('Calls the execution function with a context', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lExecution: GpuExecution = new GpuExecution(lDevice);
        let lContextReceived: boolean = false;

        // Process.
        lExecution.execute((pContext: GpuExecutionContext) => {
            lContextReceived = pContext !== null && pContext !== undefined;
        });

        // Evaluation.
        expect(lContextReceived).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Context has a command encoder', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lExecution: GpuExecution = new GpuExecution(lDevice);
        let lHasCommandEncoder: boolean = false;

        // Process.
        lExecution.execute((pContext: GpuExecutionContext) => {
            lHasCommandEncoder = pContext.commandEncoder !== null && pContext.commandEncoder !== undefined;
        });

        // Evaluation.
        expect(lHasCommandEncoder).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuDevice.execute()', async (pContext) => {
    await pContext.step('Can execute via device shorthand', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        let lExecutionCalled: boolean = false;

        // Process.
        lDevice.execute(() => {
            lExecutionCalled = true;
        });

        // Evaluation.
        expect(lExecutionCalled).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuExecutionContext.computePass()', async (pContext) => {
    await pContext.step('Calls compute pass execution function', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        let lComputePassCalled: boolean = false;

        // Process.
        lDevice.execute((pExecutor) => {
            pExecutor.computePass(() => {
                lComputePassCalled = true;
            });
        });

        // Evaluation.
        expect(lComputePassCalled).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('GpuExecutionContext.renderPass()', async (pContext) => {
    await pContext.step('Calls render pass execution function', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lRenderTargetsLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false).setup((pSetup) => {
            pSetup.addColor('color0', 0, 'rgba8unorm');
        });
        const lRenderTargets: RenderTargets = lRenderTargetsLayout.create();
        let lRenderPassCalled: boolean = false;

        // Process.
        lDevice.execute((pExecutor) => {
            pExecutor.renderPass(lRenderTargets, () => {
                lRenderPassCalled = true;
            });
        });

        // Evaluation.
        expect(lRenderPassCalled).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('Full compute execution flow', async (pContext) => {
    await pContext.step('Can create compute pipeline with bind groups and pipeline data', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShaderSource: string = `
            @group(0) @binding(0) var<storage, read_write> output: array<f32>;

            @compute @workgroup_size(1)
            fn compute_main(@builtin(global_invocation_id) id: vec3u) {
                output[id.x] = f32(id.x) * 2.0;
            }
        `;
        const lShader: Shader = new Shader(lDevice, lShaderSource).setup((pSetup) => {
            pSetup.computeEntryPoint('compute_main').size(1);
            pSetup.group(0, new BindGroupLayout(lDevice, 'data').setup((pGroupSetup) => {
                pGroupSetup.binding(0, 'output', ComputeStage.Compute).asBuffer(0, 4);
            }));
        });

        // Create compute module and pipeline.
        const lComputeModule = lShader.createComputeModule('compute_main');
        const lComputePipeline: ComputePipeline = lComputeModule.create();

        // Create bind group with data.
        const lBindGroup = lShader.layout.getGroupLayout('data').create();
        lBindGroup.data('output').createBuffer(4);

        // Create pipeline data.
        const lPipelineData = lComputePipeline.layout.withData((pSetup) => {
            pSetup.addGroup(lBindGroup);
        });

        let lComputeExecuted: boolean = false;

        // Process. Execute compute pass.
        lDevice.execute((pExecutor) => {
            pExecutor.computePass((pContext) => {
                pContext.computeDirect(lComputePipeline, lPipelineData, 1, 1, 1);
                lComputeExecuted = true;
            });
        });

        // Evaluation.
        expect(lComputeExecuted).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('Full render execution flow', async (pContext) => {
    await pContext.step('Can execute a render pass with render targets', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lRenderTargetsLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false).setup((pSetup) => {
            pSetup.addColor('color', 0, 'rgba8unorm');
        });
        const lRenderTargets: RenderTargets = lRenderTargetsLayout.create();
        lRenderTargets.resize(128, 128);

        // Process. Execute a render pass (no draw calls but the render pass itself executes).
        let lRenderPassExecuted: boolean = false;
        lDevice.execute((pExecutor) => {
            pExecutor.renderPass(lRenderTargets, () => {
                lRenderPassExecuted = true;
            });
        });

        // Evaluation.
        expect(lRenderPassExecuted).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });
});
