import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, NativeObjectLifeTime } from '../gpu/object/gpu-object';
import { UpdateReason } from '../gpu/object/gpu-object-update-reason';
import { ShaderComputeModule } from '../shader/shader-compute-module';

export class ComputePipeline extends GpuObject<GPUComputePipeline> {
    private readonly mShaderModule: ShaderComputeModule;

    /**
     * Pipeline shader.
     */
    public get module(): ShaderComputeModule {
        return this.mShaderModule;
    }

    /**
     * Constructor.
     * Set default data.
     * @param pDevice - Device.
     * @param pShader - Pipeline shader.
     */
    public constructor(pDevice: GpuDevice, pShader: ShaderComputeModule) {
        super(pDevice, NativeObjectLifeTime.Persistent);
        this.mShaderModule = pShader;

        // Listen for shader changes.
        pShader.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generate(): GPUComputePipeline {
        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPUComputePipelineDescriptor = {
            layout: this.mShaderModule.shader.layout.native,
            compute: {
                module: this.mShaderModule.shader.native,
                entryPoint: this.mShaderModule.entryPoint,
                // TODO: Constants. Yes.
            }
        };

        // Async is none GPU stalling. // TODO: Async create compute pipeline somehow.
        return this.device.gpu.createComputePipeline(lPipelineDescriptor); 
    }
}