import { PipelineLayout } from '../binding/pipeline-layout';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { ComputePipeline } from '../pipeline/compute-pipeline';
import { Shader } from './shader';

export class ShaderComputeModule extends GpuObject<null, ShaderComputeModuleInvalidationType> {
    private readonly mEntryPoint: string;
    private readonly mShader: Shader;
    private readonly mSize: [number, number, number];

    /**
     * Compute entry point.
     */
    public get entryPoint(): string {
        return this.mEntryPoint;
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
     * Workgroup size x.
     */
    public get workGroupSizeX(): number {
        return this.mSize[0];
    }

    /**
     * Workgroup size y.
     */
    public get workGroupSizeY(): number {
        return this.mSize[1];
    }

    /**
     * Workgroup size z.
     */
    public get workGroupSizeZ(): number {
        return this.mSize[2];
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pShader - Shader.
     * @param pEntryPointName - Compute entry point.
     * @param pSize - Workgroup size.
     */
    public constructor(pDevice: GpuDevice, pShader: Shader, pEntryPointName: string, pSize?: [number, number, number]) {
        super(pDevice);

        this.mEntryPoint = pEntryPointName;
        this.mShader = pShader;
        this.mSize = pSize ?? [-1, -1, -1];

        // Update on shader update.
        pShader.addInvalidationListener(() => {
            this.invalidate(ShaderComputeModuleInvalidationType.Shader);
        });
    }

    /**
     * Create a new compute pipeline.
     * 
     * @returns new compute pipeline. 
     */
    public create(): ComputePipeline {
        return new ComputePipeline(this.device, this);
    }
}

export enum ShaderComputeModuleInvalidationType {
    Shader = 'ShaderChange',
}