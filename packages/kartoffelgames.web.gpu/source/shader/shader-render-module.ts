import { GpuDevice } from '../device/gpu-device';
import { GpuObject } from '../gpu_object/gpu-object';
import { PipelineLayout } from '../pipeline/pipeline-layout';
import { RenderTargets } from '../pipeline/render_targets/render-targets';
import { VertexFragmentPipeline } from '../pipeline/vertex_fragment_pipeline/vertex-fragment-pipeline';
import { VertexParameterLayout } from '../pipeline/vertex_parameter/vertex-parameter-layout';
import { Shader } from './shader';

/**
 * Render parts of a shader programm.
 * Uses vertex and fragment shader.
 */
export class ShaderRenderModule extends GpuObject {
    private readonly mFragmentEntryPoint: string | null;
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
    public constructor(pDevice: GpuDevice, pShader: Shader, pVertexEntryPointName: string, pVertexParameter: VertexParameterLayout, pFragmentEntryPointName?: string) {
        super(pDevice);

        this.mVertexEntryPoint = pVertexEntryPointName;
        this.mVertexParameter = pVertexParameter;
        this.mFragmentEntryPoint = pFragmentEntryPointName ?? null;
        this.mShader = pShader;
    }

    /**
     * Create a new render pipeline for set render targets.
     * 
     * @param pRenderTargets - Render targets of pipeline.
     * 
     * @returns new render pipeline. 
     */
    public create(pRenderTargets: RenderTargets): VertexFragmentPipeline {
        return new VertexFragmentPipeline(this.device, this, pRenderTargets);
    }
}