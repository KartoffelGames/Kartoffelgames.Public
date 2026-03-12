import type { GpuDevice } from '../device/gpu-device.ts';
import { GpuObject } from '../gpu_object/gpu-object.ts';
import type { PipelineLayout } from '../pipeline/pipeline-layout.ts';
import type { RenderTargetsLayout } from '../pipeline/render_targets/render-targets-layout.ts';
import { VertexFragmentPipeline } from '../pipeline/vertex_fragment_pipeline/vertex-fragment-pipeline.ts';
import type { VertexParameterLayout } from '../pipeline/vertex_parameter/vertex-parameter-layout.ts';
import type { Shader } from './shader.ts';

/**
 * Render parts of a shader programm.
 * Uses vertex and fragment shader.
 */
export class ShaderRenderModule extends GpuObject {
    private readonly mFragmentEntryPoint: string | null;
    private readonly mFragmentRenderTargetsLayout: RenderTargetsLayout;
    private readonly mShader: Shader;
    private readonly mVertexEntryPoint: string;
    private readonly mVertexParameter: VertexParameterLayout;

    /**
     * Fragment entry point.
     */
    public get fragmentEntryPoint(): string | null {
        return this.mFragmentEntryPoint;
    }

    /**
     * Shader pipeline layout.
     */
    public get layout(): PipelineLayout {
        return this.mShader.layout;
    }

    /**
     * Module shader.
     */
    public get shader(): Shader {
        return this.mShader;
    }

    /**
     * Compute entry point.
     */
    public get vertexEntryPoint(): string {
        return this.mVertexEntryPoint;
    }

    /**
     * Vertex parameter.
     */
    public get vertexParameter(): VertexParameterLayout {
        return this.mVertexParameter;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pShader - Shader.
     * @param pEntryPointName - Compute entry point.
     * @param pSize - Workgroup size.
     */
    public constructor(pDevice: GpuDevice, pShader: Shader, pVertexEntryPointName: string, pVertexParameter: VertexParameterLayout, pFragmentEntryPointName: string, pFragmentRenderTargetsLayout: RenderTargetsLayout) {
        super(pDevice);

        this.mVertexEntryPoint = pVertexEntryPointName;
        this.mVertexParameter = pVertexParameter;
        this.mFragmentEntryPoint = pFragmentEntryPointName;
        this.mFragmentRenderTargetsLayout = pFragmentRenderTargetsLayout;
        this.mShader = pShader;
    }

    /**
     * Create a new render pipeline for set render targets layout.
     *
     * @returns new render pipeline.
     */
    public create(): VertexFragmentPipeline {
        return new VertexFragmentPipeline(this.device, this, this.mFragmentRenderTargetsLayout);
    }
}