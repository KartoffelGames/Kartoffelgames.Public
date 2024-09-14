import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { Shader } from './shader';

export class ShaderRenderModule extends GpuObject {
    private readonly mShader: Shader;
    private readonly mVertexEntryPoint: string;

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

    public get vertexParameter(): VertexParameterLayout {
        
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pShader - Shader.
     * @param pEntryPointName - Compute entry point.
     * @param pSize - Workgroup size.
     */
    public constructor(pDevice: GpuDevice, pShader: Shader, pVertexEntryPointName: string,) {
        super(pDevice);

        this.mVertexEntryPoint = pVertexEntryPointName;
        this.mShader = pShader;

        // Update on shader update.
        pShader.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }
}