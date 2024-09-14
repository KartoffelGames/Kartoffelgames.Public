import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { ShaderComputeModule } from '../shader/shader-compute-module';

export class ComputePipeline extends GpuNativeObject<GPUComputePipeline> {
    private readonly mShaderModule: ShaderComputeModule;

    /**
     * Pipeline shader.
     */
    public get shader(): ShaderComputeModule {
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
     * Destroys nothing.
     */
    protected override destroy(): void {
        // Nothing to destroy.
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generate(): GPUComputePipeline {
        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPUComputePipelineDescriptor = {
            layout: this.shader.shader.layout.native,
            compute: {
                module: this.shader.shader.native,
                entryPoint: this.shader.entryPoint,
                // TODO: Constants. Yes.
            }
        };

        // Async is none GPU stalling. // TODO: Async create compute pipeline somehow.
        return this.device.gpu.createComputePipeline(lPipelineDescriptor); 
    }
}