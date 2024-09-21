import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { UpdateReason } from '../gpu/object/gpu-object-update-reason';
import { VertexParameterLayout } from '../pipeline/parameter/vertex-parameter-layout';
import { Shader } from './shader';

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

        // Update on shader update.
        pShader.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });

        // Update on vertex parameter.
        pVertexParameter.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }
}