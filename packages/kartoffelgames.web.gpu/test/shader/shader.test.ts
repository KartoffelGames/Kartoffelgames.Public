import { expect } from '@kartoffelgames/core-test';
import { BufferItemFormat } from '../../source/constant/buffer-item-format.enum.ts';
import { BufferItemMultiplier } from '../../source/constant/buffer-item-multiplier.enum.ts';
import { ComputeStage } from '../../source/constant/compute-stage.enum.ts';
import { SamplerType } from '../../source/constant/sampler-type.enum.ts';
import { VertexParameterStepMode } from '../../source/constant/vertex-parameter-step-mode.enum.ts';
import { GpuDevice } from '../../source/device/gpu-device.ts';
import { BindGroupLayout } from '../../source/pipeline/bind_group_layout/bind-group-layout.ts';
import { RenderTargetsLayout } from "../../source/pipeline/render_targets/render-targets-layout.ts";
import { VertexParameterLayout } from '../../source/pipeline/vertex_parameter/vertex-parameter-layout.ts';
import type { ShaderComputeModule } from '../../source/shader/shader-compute-module.ts';
import type { ShaderRenderModule } from '../../source/shader/shader-render-module.ts';
import { Shader } from '../../source/shader/shader.ts';

/**
 * Helper to request a GPU device for tests.
 * Tests will fail in environments without WebGPU support - that is expected.
 */
async function gRequestDevice(): Promise<GpuDevice> {
    return GpuDevice.request('high-performance');
}

/**
 * Minimal WGSL vertex + fragment shader source.
 */
const gBasicRenderShaderSource: string = `
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
 * Minimal WGSL compute shader source.
 */
const gBasicComputeShaderSource: string = `
@compute @workgroup_size(64)
fn compute_main(@builtin(global_invocation_id) id: vec3u) {
    // No-op compute shader.
}
`;

/**
 * Shader source with bind groups.
 */
const gBindGroupShaderSource: string = `
struct TransformData {
    matrix: mat4x4f,
}

@group(0) @binding(0) var<uniform> transform: TransformData;

@vertex
fn vertex_main(@location(0) position: vec4f) -> @builtin(position) vec4f {
    return transform.matrix * position;
}

@fragment
fn fragment_main() -> @location(0) vec4f {
    return vec4f(1.0);
}
`;

Deno.test('Shader.setup()', async (pContext) => {
    await pContext.step('Can be setup with vertex and fragment entry points', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
        });

        // Evaluation.
        expect(lShader.layout).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Can be setup with compute entry point', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lShader: Shader = new Shader(lDevice, gBasicComputeShaderSource).setup((pSetup) => {
            pSetup.computeEntryPoint('compute_main', 64);
        });

        // Evaluation.
        expect(lShader.layout).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws when setup is called twice', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicComputeShaderSource).setup((pSetup) => {
            pSetup.computeEntryPoint('compute_main', 64);
        });

        // Evaluation.
        const lThrowFunction = () => {
            lShader.setup((pSetup) => {
                pSetup.computeEntryPoint('compute_main', 64);
            });
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('Shader.layout', async (pContext) => {
    await pContext.step('Returns a PipelineLayout after setup', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
        });

        // Evaluation.
        expect(lShader.layout).toBeTruthy();
        expect(lShader.layout.groups).toBeInstanceOf(Array);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws when accessed before setup', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource);

        // Evaluation.
        const lThrowFunction = () => {
            return lShader.layout;
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('Shader.setup() -- with bind groups', async (pContext) => {
    await pContext.step('Layout contains the defined bind group', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();

        // Process.
        const lShader: Shader = new Shader(lDevice, gBindGroupShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
            pSetup.group(0, new BindGroupLayout(lDevice, 'transform').setup((pGroupSetup) => {
                pGroupSetup.binding(0, 'transform', ComputeStage.Vertex).asBuffer(64); // mat4x4f = 64 bytes
            }));
        });

        // Evaluation.
        const lGroups: Array<string> = lShader.layout.groups;
        expect(lGroups.length).toBe(1);
        expect(lGroups[0]).toBe('transform');

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Can access bind group layout by name', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBindGroupShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
            pSetup.group(0, new BindGroupLayout(lDevice, 'transform').setup((pGroupSetup) => {
                pGroupSetup.binding(0, 'transform', ComputeStage.Vertex).asBuffer(64);
            }));
        });

        // Process.
        const lGroupLayout: BindGroupLayout = lShader.layout.getGroupLayout('transform');

        // Evaluation.
        expect(lGroupLayout).toBeTruthy();
        expect(lGroupLayout.name).toBe('transform');

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('Shader.parameter()', async (pContext) => {
    await pContext.step('Returns parameter usage stages', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource).setup((pSetup) => {
            pSetup.parameter('animationSeconds', ComputeStage.Vertex);
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
        });

        // Process.
        const lUsage: Set<ComputeStage> = lShader.parameter('animationSeconds');

        // Evaluation.
        expect(lUsage.has(ComputeStage.Vertex)).toBe(true);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws for non-existing parameter', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
        });

        // Evaluation.
        const lThrowFunction = () => {
            lShader.parameter('nonExistent');
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('Shader.createRenderModule()', async (pContext) => {
    await pContext.step('Creates a ShaderRenderModule from vertex entry point', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
        });

        // Process.
        const lModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Evaluation.
        expect(lModule).toBeTruthy();
        expect(lModule.vertexEntryPoint).toBe('vertex_main');
        expect(lModule.fragmentEntryPoint).toBe('fragment_main');

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Creates a ShaderRenderModule with vertex and fragment entry', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
        });

        // Process.
        const lModule: ShaderRenderModule = lShader.createRenderModule('vertex_main', 'fragment_main');

        // Evaluation.
        expect(lModule).toBeTruthy();
        expect(lModule.vertexEntryPoint).toBe('vertex_main');
        expect(lModule.fragmentEntryPoint).toBe('fragment_main');

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws for non-existing vertex entry point', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
        });

        // Evaluation.
        const lThrowFunction = () => {
            lShader.createRenderModule('nonExistent', 'fragment_main');
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws for non-existing fragment entry point', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
        });

        // Evaluation.
        const lThrowFunction = () => {
            lShader.createRenderModule('vertex_main', 'nonExistent');
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('Shader.createComputeModule()', async (pContext) => {
    await pContext.step('Creates a ShaderComputeModule', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicComputeShaderSource).setup((pSetup) => {
            pSetup.computeEntryPoint('compute_main', 64);
        });

        // Process.
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Evaluation.
        expect(lModule).toBeTruthy();
        expect(lModule.entryPoint).toBe('compute_main');

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Compute module has correct workgroup sizes', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicComputeShaderSource).setup((pSetup) => {
            pSetup.computeEntryPoint('compute_main', 64);
        });

        // Process.
        const lModule: ShaderComputeModule = lShader.createComputeModule('compute_main');

        // Evaluation.
        expect(lModule.workGroupSizeX).toBe(64);
        expect(lModule.workGroupSizeY).toBe(1);
        expect(lModule.workGroupSizeZ).toBe(1);

        // Cleanup.
        lDevice.deconstruct();
    });

    await pContext.step('Throws for non-existing compute entry point', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicComputeShaderSource).setup((pSetup) => {
            pSetup.computeEntryPoint('compute_main', 64);
        });

        // Evaluation.
        const lThrowFunction = () => {
            lShader.createComputeModule('nonExistent');
        };
        expect(lThrowFunction).toThrow();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('Shader.native', async (pContext) => {
    await pContext.step('Returns a GPUShaderModule after setup', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShader: Shader = new Shader(lDevice, gBasicRenderShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm');
            }));
        });

        // Process.
        const lNative: GPUShaderModule = lShader.native;

        // Evaluation.
        expect(lNative).toBeTruthy();

        // Cleanup.
        lDevice.deconstruct();
    });
});

Deno.test('Shader.setup() -- multiple bind groups', async (pContext) => {
    await pContext.step('Shader with multiple bind groups has correct group names', async () => {
        // Setup.
        const lDevice: GpuDevice = await gRequestDevice();
        const lShaderSource: string = `
            struct ObjectData {
                matrix: mat4x4f,
            }
            @group(0) @binding(0) var<uniform> object_data: ObjectData;
            @group(1) @binding(0) var tex_sampler: sampler;
            @group(1) @binding(1) var tex: texture_2d<f32>;

            @vertex
            fn vertex_main(@location(0) position: vec4f) -> @builtin(position) vec4f {
                return object_data.matrix * position;
            }

            @fragment
            fn fragment_main() -> @location(0) vec4f {
                return vec4f(1.0);
            }
        `;

        // Process.
        const lShader: Shader = new Shader(lDevice, lShaderSource).setup((pSetup) => {
            pSetup.vertexEntryPoint('vertex_main', new VertexParameterLayout(lDevice).setup((pVertexSetup) => {
                pVertexSetup.buffer('position', VertexParameterStepMode.Vertex)
                    .withParameter('position', 0, BufferItemFormat.Float32, BufferItemMultiplier.Vector4);
            }));
            pSetup.fragmentEntryPoint('fragment_main', new RenderTargetsLayout(lDevice, false).setup((pFragmentSetup) => {
                pFragmentSetup.addColor('main', 0, 'rgba8unorm', true);
            }));
            pSetup.group(0, new BindGroupLayout(lDevice, 'object').setup((pGroupSetup) => {
                pGroupSetup.binding(0, 'object_data', ComputeStage.Vertex).asBuffer(64);
            }));
            pSetup.group(1, new BindGroupLayout(lDevice, 'texture').setup((pGroupSetup) => {
                pGroupSetup.binding(0, 'tex_sampler', ComputeStage.Fragment).asSampler(SamplerType.Filter);
                pGroupSetup.binding(1, 'tex', ComputeStage.Fragment).asTexture('2d', 'rgba8unorm');
            }));
        });

        // Evaluation.
        const lGroups: Array<string> = lShader.layout.groups;
        expect(lGroups.length).toBe(2);
        expect(lGroups).toContain('object');
        expect(lGroups).toContain('texture');

        // Cleanup.
        lDevice.deconstruct();
    });
});
