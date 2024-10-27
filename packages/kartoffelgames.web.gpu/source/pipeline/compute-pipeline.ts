import { Dictionary } from '@kartoffelgames/core';
import { PipelineLayout } from '../binding/pipeline-layout';
import { ComputeStage } from '../constant/compute-stage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { ShaderComputeModule } from '../shader/shader-compute-module';

export class ComputePipeline extends GpuObject<GPUComputePipeline | null, ComputePipelineInvalidationType> implements IGpuObjectNative<GPUComputePipeline | null> {
    private mLoadedPipeline: GPUComputePipeline | null;
    private readonly mParameter: Dictionary<ComputeStage, Record<string, number>>;
    private readonly mShaderModule: ShaderComputeModule;

    /**
     * Pipeline layout.
     */
    public get layout(): PipelineLayout {
        return this.mShaderModule.shader.layout;
    }

    /**
     * Pipeline shader.
     */
    public get module(): ShaderComputeModule {
        return this.mShaderModule;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUComputePipeline | null {
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

        // Loaded pipeline for async creation.
        this.mLoadedPipeline = null;

        // Pipeline constants.
        this.mParameter = new Dictionary<ComputeStage, Record<string, number>>();
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
        this.invalidate(ComputePipelineInvalidationType.NativeRebuild);

        return this;
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generateNative(_pLastNative: GPUComputePipeline | null, pInvalidationReason: GpuObjectInvalidationReasons<ComputePipelineInvalidationType>): GPUComputePipeline | null {
        // When a pipeline was loaded, return the loaded instead of creating a new pipeline.
        if (this.mLoadedPipeline !== null && !pInvalidationReason.has(ComputePipelineInvalidationType.NativeRebuild)) {
            const lLoadedPipeline: GPUComputePipeline = this.mLoadedPipeline;
            this.mLoadedPipeline = null;

            return lLoadedPipeline;
        }

        // Construct basic GPUComputePipelineDescriptor.
        const lPipelineDescriptor: GPUComputePipelineDescriptor = {
            layout: this.mShaderModule.shader.layout.native,
            compute: {
                module: this.mShaderModule.shader.native,
                entryPoint: this.mShaderModule.entryPoint,
                constants: this.mParameter.get(ComputeStage.Compute) ?? {}
            }
        };

        // Load pipeline asyncron and update native after promise resolve.
        this.device.gpu.createComputePipelineAsync(lPipelineDescriptor).then((pPipeline: GPUComputePipeline) => {
            this.mLoadedPipeline = pPipeline;
            this.invalidate(ComputePipelineInvalidationType.NativeLoaded);
        });

        // Null as long as pipeline is loading.
        return null;
    }
}

export enum ComputePipelineInvalidationType {
    NativeRebuild = 'NativeRebuild',
    NativeLoaded = 'NativeLoaded',
}