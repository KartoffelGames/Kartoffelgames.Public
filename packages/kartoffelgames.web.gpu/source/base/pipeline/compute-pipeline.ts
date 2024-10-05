import { Dictionary } from '@kartoffelgames/core';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { ShaderComputeModule } from '../shader/shader-compute-module';

export class ComputePipeline extends GpuObject<GPUComputePipeline, ComputePipelineInvalidationType> implements IGpuObjectNative<GPUComputePipeline> {
    private readonly mParameter: Dictionary<ComputeStage, Record<string, number>>;
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
        super(pDevice);
        this.mShaderModule = pShader;

        // Pipeline constants.
        this.mParameter = new Dictionary<ComputeStage, Record<string, number>>();

        // Listen for shader changes.
        this.mShaderModule.shader.addInvalidationListener(() => {
            this.invalidate(ComputePipelineInvalidationType.Shader);
        });
        this.mShaderModule.shader.layout.addInvalidationListener(() => {
            this.invalidate(ComputePipelineInvalidationType.Shader);
        });
    }

    /**
     * Set optional parameter of pipeline.
     * 
     * @param pParameterName - name of parameter.
     * @param pValue - Value.
     * 
     * @returns this. 
     */
    public setParameter(pParameterName: string, pValue: number): this {
        const lParameterUsage: Set<ComputeStage> | undefined = this.mShaderModule.shader.parameter(pParameterName);

        // Set parameter for each assigned compute stage.
        for (const lUsage of lParameterUsage) {
            // Init parameters for computestage when not set.
            if (!this.mParameter.has(lUsage)) {
                this.mParameter.set(lUsage, {});
            }

            // Set value for compute stage.
            this.mParameter.get(lUsage)![pParameterName] = pValue;
        }

        // Generate pipeline anew.
        this.invalidate(ComputePipelineInvalidationType.Parameter);

        return this;
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
                constants: this.mParameter.get(ComputeStage.Compute) ?? {}
            }
        };

        // Async is none GPU stalling. // TODO: Async create compute pipeline somehow.
        return this.device.gpu.createComputePipeline(lPipelineDescriptor);
    }
}

export enum ComputePipelineInvalidationType {
    Shader = 'ShaderChange',
    Config = 'ConfigChange',
    Parameter = 'ParameterChange'
}