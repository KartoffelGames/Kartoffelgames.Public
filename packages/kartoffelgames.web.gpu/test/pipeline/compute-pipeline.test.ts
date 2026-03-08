import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { Shader } from '../../source/shader/shader.ts';
import { ComputePipeline } from '../../source/pipeline/compute-pipeline.ts';
import { ShaderComputeModule } from '../../source/shader/shader-compute-module.ts';
import { ComputeStage } from '../../source/constant/compute-stage.enum.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

const gComputeShaderSource: string = `
@compute @workgroup_size(64)
fn compute_main(@builtin(global_invocation_id) id: vec3u) {
    // No-op compute shader.
}
`;

/**
 * Helper to create a shader with compute entry point.
 */
async function gCreateComputeShader(): Promise<{ device: GpuDevice; shader: Shader; }> {
    const lDevice: GpuDevice = await gRequestDevice();
    const lShader: Shader = new Shader(lDevice, gComputeShaderSource);
    lShader.setup((pSetup) => {
        pSetup.computeEntryPoint('compute_main', (pComputeSetup) => {
            pComputeSetup.size(64);
        });
    });
    return { device: lDevice, shader: lShader };
}

Deno.test('ComputePipeline.module', async (pContext) => {
    await pContext.step('Returns the shader compute module', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateComputeShader();
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Process.
        const lPipeline: ComputePipeline = lModule.create();

        // Evaluation.
        expect(lPipeline.module).toBe(lModule);

        // Cleanup.
        lPipeline.deconstruct();
        lModule.deconstruct();
        lShader.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('ComputePipeline.layout', async (pContext) => {
    await pContext.step('Returns the pipeline layout', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateComputeShader();
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Process.
        const lPipeline: ComputePipeline = lModule.create();

        // Evaluation.
        expect(lPipeline.layout).toBeTruthy();
        expect(lPipeline.layout).toBe(lShader.layout);

        // Cleanup.
        lPipeline.deconstruct();
        lModule.deconstruct();
        lShader.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('ComputePipeline -- creation', async (pContext) => {
    await pContext.step('Pipeline can be created from compute module', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateComputeShader();
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Process.
        const lPipeline: ComputePipeline = lModule.create();

        // Evaluation. Pipeline is created (native is loaded asynchronously).
        expect(lPipeline).toBeTruthy();

        // Cleanup.
        lPipeline.deconstruct();
        lModule.deconstruct();
        lShader.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('ComputePipeline.setParameter()', async (pContext) => {
    await pContext.step('Can set compute parameter on a pipeline with defined parameters', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShaderSource: string = `
            override workSize: u32 = 64;

            @compute @workgroup_size(64)
            fn compute_main(@builtin(global_invocation_id) id: vec3u) {
                // Use override.
                let x = workSize;
            }
        `;
        const lShader: Shader = new Shader(lDevice, lShaderSource);
        lShader.setup((pSetup) => {
            pSetup.parameter('workSize', ComputeStage.Compute);
            pSetup.computeEntryPoint('compute_main', (pComputeSetup) => {
                pComputeSetup.size(64);
            });
        });

        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');
        const lPipeline: ComputePipeline = lModule.create();

        // Process / Evaluation. Should not throw.
        lPipeline.setParameter('workSize', 128);

        // Cleanup.
        lPipeline.deconstruct();
        lModule.deconstruct();
        lShader.deconstruct();
        lDevice.deconstruct();
    });
});

Deno.test('ShaderComputeModule', async (pContext) => {
    await pContext.step('entryPoint returns the compute entry name', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateComputeShader();

        // Process.
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Evaluation.
        expect(lModule.entryPoint).toBe('compute_main');

        // Cleanup.
        lModule.deconstruct();
        lShader.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('shader returns the parent shader', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateComputeShader();

        // Process.
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Evaluation.
        expect(lModule.shader).toBe(lShader);

        // Cleanup.
        lModule.deconstruct();
        lShader.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('layout returns the pipeline layout', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateComputeShader();

        // Process.
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Evaluation.
        expect(lModule.layout).toBe(lShader.layout);

        // Cleanup.
        lModule.deconstruct();
        lShader.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('workGroupSizeX/Y/Z return correct sizes', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateComputeShader();

        // Process.
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Evaluation.
        expect(lModule.workGroupSizeX).toBe(64);
        expect(lModule.workGroupSizeY).toBe(1);
        expect(lModule.workGroupSizeZ).toBe(1);

        // Cleanup.
        lModule.deconstruct();
        lShader.deconstruct();
        lDevice.deconstruct();
    });

    await pContext.step('create() returns a ComputePipeline', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateComputeShader();
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Process.
        const lPipeline: ComputePipeline = lModule.create();

        // Evaluation.
        expect(lPipeline).toBeInstanceOf(ComputePipeline);

        // Cleanup.
        lPipeline.deconstruct();
        lModule.deconstruct();
        lShader.deconstruct();
        lDevice.deconstruct();
    });
});
