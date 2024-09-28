import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { GpuObjectLifeTime } from '../gpu/object/gpu-object-life-time.enum';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { ShaderComputeModule } from '../shader/shader-compute-module';

export class ComputePipeline extends GpuObject<GPUComputePipeline, ComputePipelineInvalidationType> implements IGpuObjectNative<GPUComputePipeline> {
    private readonly mShaderModule: ShaderComputeModule;

    /**
     * Pipeline shader.
     */
    public get module(): ShaderComputeModule {
        return this.mShaderModule;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUComputePipeline {
        return super.native;
    }

    /**
     * Constructor.
     * Set default data.
     * @param pDevice - Device.
     * @param pShader - Pipeline shader.
     */
    public constructor(pDevice: GpuDevice, pShader: ShaderComputeModule) {
        super(pDevice, GpuObjectLifeTime.Persistent);
        this.mShaderModule = pShader;

        // Listen for shader changes.
        this.mShaderModule.shader.addInvalidationListener(() => {
            this.invalidate(ComputePipelineInvalidationType.Shader);
        });
        this.mShaderModule.shader.layout.addInvalidationListener(() => {
            this.invalidate(ComputePipelineInvalidationType.Shader);
        });
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generateNative(): GPUComputePipeline {
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

export enum ComputePipelineInvalidationType {
    Shader = 'ShaderChange',
    Config = 'ConfigChange'
}