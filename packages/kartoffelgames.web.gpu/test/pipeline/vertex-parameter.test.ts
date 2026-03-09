import { expect } from '@kartoffelgames/core-test';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { Shader } from '../../source/shader/shader.ts';
import { VertexParameterStepMode } from '../../source/constant/vertex-parameter-step-mode.enum.ts';
import { BufferItemFormat } from '../../source/constant/buffer-item-format.enum.ts';
import { BufferItemMultiplier } from '../../source/constant/buffer-item-multiplier.enum.ts';
import { ComputeStage } from '../../source/constant/compute-stage.enum.ts';
import { ShaderRenderModule } from '../../source/shader/shader-render-module.ts';
import { VertexParameterLayout } from '../../source/pipeline/vertex_parameter/vertex-parameter-layout.ts';
import { VertexParameter } from '../../source/pipeline/vertex_parameter/vertex-parameter.ts';
import { GpuBuffer } from '../../source/buffer/gpu-buffer.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

const gVertexFragmentShaderSource: string = `
@vertex
fn vertex_main(@location(0) position: vec4f) -> @builtin(position) vec4f {
    return position;
}

@fragment
fn fragment_main() -> @location(0) vec4f {
    return vec4f(1.0, 0.0, 0.0, 1.0);
}
`;

/**
 * Helper to create a fully setup shader with vertex and fragment entry points.
 */
async function gCreateSetupShader(): Promise<{ device: GpuDevice; shader: Shader; }> {
    const lDevice: GpuDevice = await gRequestDevice();
    const lShader: Shader = new Shader(lDevice, gVertexFragmentShaderSource).setup((pSetup) => {
        pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
            pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        }));
        pSetup.fragmentEntryPoint('fragment_main', (pFragmentSetup) => {
            pFragmentSetup.addRenderTarget('main', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        });
    });
    return { device: lDevice, shader: lShader };
}

Deno.test('VertexParameter.vertexCount', async (pContext) => {
    await pContext.step('Returns number of indices passed in constructor', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateSetupShader();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Process. Triangle with 3 indices.
        const lVertexParam: VertexParameter = lRenderModule.vertexParameter.create([0, 1, 2]);

        // Evaluation.
        expect(lVertexParam.vertexCount).toBe(3);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexParameter.layout', async (pContext) => {
    await pContext.step('Returns the VertexParameterLayout', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateSetupShader();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lVertexParamLayout: VertexParameterLayout = lRenderModule.vertexParameter;

        // Process.
        const lVertexParam: VertexParameter = lVertexParamLayout.create([0, 1, 2]);

        // Evaluation.
        expect(lVertexParam.layout).toBe(lVertexParamLayout);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexParameter.create()', async (pContext) => {
    await pContext.step('Creates a GpuBuffer for vertex data', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateSetupShader();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lVertexParam: VertexParameter = lRenderModule.vertexParameter.create([0, 1, 2]);

        // Process. 3 vertices * 4 floats (vec4f) = 12 float values.
        const lBuffer: GpuBuffer = lVertexParam.create('position', [
            0.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0
        ]);

        // Evaluation.
        expect(lBuffer).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexParameter.get()', async (pContext) => {
    await pContext.step('Returns the buffer created with create()', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateSetupShader();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lVertexParam: VertexParameter = lRenderModule.vertexParameter.create([0, 1, 2]);
        const lCreatedBuffer: GpuBuffer = lVertexParam.create('position', [
            0.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0
        ]);

        // Process.
        const lRetrievedBuffer: GpuBuffer = lVertexParam.get('position');

        // Evaluation.
        expect(lRetrievedBuffer).toBe(lCreatedBuffer);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws for non-existing buffer name', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateSetupShader();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lVertexParam: VertexParameter = lRenderModule.vertexParameter.create([0, 1, 2]);

        // Evaluation.
        const lThrowFunction = () => {
            lVertexParam.get('nonExistent');
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexParameter.create() -- data alignment', async (pContext) => {
    await pContext.step('Throws when data does not align with layout', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateSetupShader();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lVertexParam: VertexParameter = lRenderModule.vertexParameter.create([0, 1, 2]);

        // Evaluation. 5 floats is not a multiple of vec4f (4 floats).
        const lThrowFunction = () => {
            lVertexParam.create('position', [0.0, 0.0, 0.0, 1.0, 0.5]);
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexParameter.indexBuffer', async (pContext) => {
    await pContext.step('Returns null when layout is not indexable', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateSetupShader();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Process. Vertex step mode is not indexable.
        const lVertexParam: VertexParameter = lRenderModule.vertexParameter.create([0, 1, 2]);

        // Evaluation.
        expect(lVertexParam.indexBuffer).toBeNull();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexParameter -- with parameters', async (pContext) => {
    await pContext.step('Pipeline parameter can be set on shader', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShaderSource: string = `
            override animationSeconds: f32 = 0.0;

            @vertex
            fn vertex_main(@location(0) position: vec4f) -> @builtin(position) vec4f {
                return position * animationSeconds;
            }

            @fragment
            fn fragment_main() -> @location(0) vec4f {
                return vec4f(1.0);
            }
        `;

        const lShader: Shader = new Shader(lDevice, lShaderSource).setup((pSetup) => {
            pSetup.parameter('animationSeconds', ComputeStage.Vertex);
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', (pFragmentSetup) => {
                pFragmentSetup.addRenderTarget('main', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            });
        });

        // Evaluation. Should not throw.
        const lParamUsage: Set<ComputeStage> = lShader.parameter('animationSeconds');
        expect(lParamUsage.has(ComputeStage.Vertex)).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });
});
