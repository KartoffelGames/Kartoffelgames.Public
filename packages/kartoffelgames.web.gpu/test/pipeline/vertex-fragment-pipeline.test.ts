import { expect } from '@kartoffelgames/core-test';
import { BufferItemFormat } from '../../source/constant/buffer-item-format.enum.ts';
import { BufferItemMultiplier } from '../../source/constant/buffer-item-multiplier.enum.ts';
import { CompareFunction } from '../../source/constant/compare-function.enum.ts';
import { PrimitiveCullMode } from '../../source/constant/primitive-cullmode.enum.ts';
import { PrimitiveFrontFace } from '../../source/constant/primitive-front-face.enum.ts';
import { PrimitiveTopology } from '../../source/constant/primitive-topology.enum.ts';
import { TextureBlendFactor } from '../../source/constant/texture-blend-factor.enum.ts';
import { TextureBlendOperation } from '../../source/constant/texture-blend-operation.enum.ts';
import { VertexParameterStepMode } from '../../source/constant/vertex-parameter-step-mode.enum.ts';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { RenderTargetsLayout } from '../../source/pipeline/render_targets/render-targets-layout.ts';
import type { VertexFragmentPipeline } from '../../source/pipeline/vertex_fragment_pipeline/vertex-fragment-pipeline.ts';
import { VertexParameterLayout } from '../../source/pipeline/vertex_parameter/vertex-parameter-layout.ts';
import type { ShaderRenderModule } from '../../source/shader/shader-render-module.ts';
import { Shader } from '../../source/shader/shader.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

const gRenderShaderSource: string = `
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
 * Helper to create a shader + render targets layout for pipeline creation.
 */
async function gCreateRenderPipelineComponents(): Promise<{ device: GpuDevice; shader: Shader; renderTargetsLayout: RenderTargetsLayout; }> {
    const lDevice: GpuDevice = await gRequestDevice();

    const lRenderTargetsLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false).setup((pSetup) => {
        pSetup.addColor('color', 0, 'rgba8unorm');
    });

    const lShader: Shader = new Shader(lDevice, gRenderShaderSource).setup((pSetup) => {
        pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
            pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
        }));
        pSetup.fragmentEntryPoint('fragment_main', lRenderTargetsLayout);
    });

    return { device: lDevice, shader: lShader, renderTargetsLayout: lRenderTargetsLayout };
}

Deno.test('VertexFragmentPipeline -- creation', async (pContext) => {
    await pContext.step('Can be created from render module and render targets layout', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Process.
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Evaluation.
        expect(lPipeline).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexFragmentPipeline.module', async (pContext) => {
    await pContext.step('Returns the shader render module', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Process.
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Evaluation.
        expect(lPipeline.module).toBe(lRenderModule);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexFragmentPipeline.layout', async (pContext) => {
    await pContext.step('Returns the pipeline layout from shader', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Process.
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Evaluation.
        expect(lPipeline.layout).toBe(lShader.layout);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexFragmentPipeline.renderTargets', async (pContext) => {
    await pContext.step('Returns the render targets layout', async () => {
        // Setup.
        const { device: lDevice, shader: lShader, renderTargetsLayout: lRenderTargetsLayout } = await gCreateRenderPipelineComponents();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Process.
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Evaluation.
        expect(lPipeline.renderTargets).toBe(lRenderTargetsLayout);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexFragmentPipeline -- primitive properties', async (pContext) => {
    await pContext.step('Default primitive cull mode can be overridden', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Process.
        lPipeline.primitiveCullMode = PrimitiveCullMode.Front;

        // Evaluation.
        expect(lPipeline.primitiveCullMode).toBe(PrimitiveCullMode.Front);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Default primitive front face can be overridden', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Process.
        lPipeline.primitiveFrontFace = PrimitiveFrontFace.ClockWise;

        // Evaluation.
        expect(lPipeline.primitiveFrontFace).toBe(PrimitiveFrontFace.ClockWise);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Default primitive topology can be overridden', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Process.
        lPipeline.primitiveTopology = PrimitiveTopology.LineList;

        // Evaluation.
        expect(lPipeline.primitiveTopology).toBe(PrimitiveTopology.LineList);

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexFragmentPipeline.depthConfig()', async (pContext) => {
    await pContext.step('Returns a depth configuration object', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        const lRenderTargetLayout: RenderTargetsLayout = new RenderTargetsLayout(lDevice, false).setup((pSetup) => {
            pSetup.addColor('color', 0, 'rgba8unorm');
            pSetup.addDepthStencil('depth24plus', true, 1.0);
        });

        const lShader: Shader = new Shader(lDevice, gRenderShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', lRenderTargetLayout);
        });
        
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Process. Chain depth configuration.
        const lDepthConfig = lPipeline.depthConfig()
            .enableWrite(true)
            .compareWith(CompareFunction.Less);

        // Evaluation.
        expect(lDepthConfig).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexFragmentPipeline.targetConfig()', async (pContext) => {
    await pContext.step('Returns a target configuration object', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Process. Chain target configuration for blending.
        const lTargetConfig = lPipeline.targetConfig('color')
            .alphaBlend(TextureBlendOperation.Add, TextureBlendFactor.One, TextureBlendFactor.OneMinusSrcAlpha)
            .colorBlend(TextureBlendOperation.Add, TextureBlendFactor.SrcAlpha, TextureBlendFactor.OneMinusSrcAlpha);

        // Evaluation.
        expect(lTargetConfig).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('VertexFragmentPipeline -- pipeline creation', async (pContext) => {
    await pContext.step('Pipeline can be created from render module', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();
        const lRenderModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Process.
        const lPipeline: VertexFragmentPipeline = lRenderModule.create();

        // Evaluation. Pipeline is created (native is loaded asynchronously).
        expect(lPipeline).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('ShaderRenderModule', async (pContext) => {
    await pContext.step('vertexEntryPoint returns vertex entry name', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();

        // Process.
        const lModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Evaluation.
        expect(lModule.vertexEntryPoint).toBe('vertex_main');

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('fragmentEntryPoint returns fragment entry name', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();

        // Process.
        const lModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Evaluation.
        expect(lModule.fragmentEntryPoint).toBe('fragment_main');

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('shader returns the parent Shader', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();

        // Process.
        const lModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Evaluation.
        expect(lModule.shader).toBe(lShader);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('layout returns the PipelineLayout', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();

        // Process.
        const lModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Evaluation.
        expect(lModule.layout).toBe(lShader.layout);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('vertexParameter returns the VertexParameterLayout', async () => {
        // Setup.
        const { device: lDevice, shader: lShader } = await gCreateRenderPipelineComponents();

        // Process.
        const lModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Evaluation.
        expect(lModule.vertexParameter).toBeTruthy();
        expect(lModule.vertexParameter.bufferNames.length).toBe(1);

        // Cleanup.
        lDevice.deconstruct();
    });
});
