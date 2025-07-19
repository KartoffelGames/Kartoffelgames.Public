import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuLimit } from '../constant/gpu-limit.enum.ts';
import { GpuDevice } from '../device/gpu-device.ts';
import { GpuObject } from '../gpu_object/gpu-object.ts';
import { IGpuObjectNative } from '../gpu_object/interface/i-gpu-object-native.ts';
import { BindGroupLayout } from './bind_group_layout/bind-group-layout.ts';
import { PipelineData } from './pipeline_data/pipeline-data.ts';
import { PipelineDataSetup } from './pipeline_data/pipeline-data-setup.ts';

/**
 * Gpu pipeline layout.
 */
export class PipelineLayout extends GpuObject<GPUPipelineLayout> implements IGpuObjectNative<GPUPipelineLayout> {
    private readonly mBindGroupNames: Dictionary<string, number>;
    private readonly mBindGroups: Dictionary<number, BindGroupLayout>;

    /**
     * Bind group names.
     */
    public get groups(): Array<string> {
        return [...this.mBindGroupNames.keys()];
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUPipelineLayout {
        return super.native;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Gpu Device reference.
     * @param pInitialGroups - Initial groups.
     */
    public constructor(pDevice: GpuDevice, pInitialGroups: Dictionary<number, BindGroupLayout>) {
        super(pDevice);

        // Init storages.
        this.mBindGroupNames = new Dictionary<string, number>();
        this.mBindGroups = new Dictionary<number, BindGroupLayout>();

        // Pipeline global resource counter.
        const lMaxCounter = {
            dynamicStorageBuffers: 0,
            dynamicUniformBuffers: 0,
            sampler: 0,
            sampledTextures: 0,
            storageTextures: 0,
            uniformBuffers: 0,
            storageBuffers: 0
        };

        // Set initial work groups.
        const lMaxBindGroupCount: number = this.device.capabilities.getLimit(GpuLimit.MaxBindGroups);
        for (const [lGroupIndex, lGroup] of pInitialGroups) {
            if (lGroupIndex > (lMaxBindGroupCount - 1)) {
                throw new Exception(`Bind group limit exceeded with index: ${lGroupIndex} and group "${lGroup.name}"`, this);
            }

            // Restrict dublicate names.
            if (this.mBindGroupNames.has(lGroup.name)) {
                throw new Exception(`Can add group name "${lGroup.name}" only once.`, this);
            }

            // Restrict dublicate locations.
            if (this.mBindGroups.has(lGroupIndex)) {
                throw new Exception(`Can add group location index "${lGroupIndex}" only once.`, this);
            }

            // Set name to index mapping.
            this.mBindGroupNames.set(lGroup.name, lGroupIndex);

            // Set bind groups to bind group.
            this.mBindGroups.set(lGroupIndex, lGroup);

            // Count counters.
            lMaxCounter.dynamicStorageBuffers += lGroup.resourceCounter.storageDynamicOffset;
            lMaxCounter.dynamicUniformBuffers += lGroup.resourceCounter.uniformDynamicOffset;
            lMaxCounter.sampler += lGroup.resourceCounter.sampler;
            lMaxCounter.sampledTextures += lGroup.resourceCounter.sampledTextures;
            lMaxCounter.storageTextures += lGroup.resourceCounter.storageTextures;
            lMaxCounter.uniformBuffers += lGroup.resourceCounter.uniformBuffers;
            lMaxCounter.storageBuffers += lGroup.resourceCounter.storageBuffers;
        }

        // Max dynamic storage buffers.
        if (lMaxCounter.dynamicStorageBuffers > this.device.capabilities.getLimit(GpuLimit.MaxDynamicStorageBuffersPerPipelineLayout)) {
            throw new Exception(`Max dynamic storage buffer reached pipeline. Max allowed "${this.device.capabilities.getLimit(GpuLimit.MaxDynamicStorageBuffersPerPipelineLayout)}" has "${lMaxCounter.dynamicStorageBuffers}"`, this);
        }

        // Max dynamic unform buffers.
        if (lMaxCounter.dynamicUniformBuffers > this.device.capabilities.getLimit(GpuLimit.MaxDynamicUniformBuffersPerPipelineLayout)) {
            throw new Exception(`Max dynamic uniform buffer reached pipeline. Max allowed "${this.device.capabilities.getLimit(GpuLimit.MaxDynamicUniformBuffersPerPipelineLayout)}" has "${lMaxCounter.dynamicUniformBuffers}"`, this);
        }

        // Max sampler. Ignore shader stage limitation. Just apply it to the complete pipeline.
        if (lMaxCounter.sampler > this.device.capabilities.getLimit(GpuLimit.MaxSamplersPerShaderStage)) {
            throw new Exception(`Max sampler reached pipeline. Max allowed "${this.device.capabilities.getLimit(GpuLimit.MaxSamplersPerShaderStage)}" has "${lMaxCounter.sampler}"`, this);
        }

        // Max sampled textures. Ignore shader stage limitation. Just apply it to the complete pipeline.
        if (lMaxCounter.sampledTextures > this.device.capabilities.getLimit(GpuLimit.MaxSampledTexturesPerShaderStage)) {
            throw new Exception(`Max sampled textures reached pipeline. Max allowed "${this.device.capabilities.getLimit(GpuLimit.MaxSampledTexturesPerShaderStage)}" has "${lMaxCounter.sampledTextures}"`, this);
        }

        // Max storage textures. Ignore shader stage limitation. Just apply it to the complete pipeline.
        if (lMaxCounter.storageTextures > this.device.capabilities.getLimit(GpuLimit.MaxStorageTexturesPerShaderStage)) {
            throw new Exception(`Max storage textures reached pipeline. Max allowed "${this.device.capabilities.getLimit(GpuLimit.MaxStorageTexturesPerShaderStage)}" has "${lMaxCounter.storageTextures}"`, this);
        }

        // Max storage buffers. Ignore shader stage limitation. Just apply it to the complete pipeline.
        if (lMaxCounter.storageBuffers > this.device.capabilities.getLimit(GpuLimit.MaxStorageBuffersPerShaderStage)) {
            throw new Exception(`Max storage buffers reached pipeline. Max allowed "${this.device.capabilities.getLimit(GpuLimit.MaxStorageBuffersPerShaderStage)}" has "${lMaxCounter.storageBuffers}"`, this);
        }

        // Max uniform buffers. Ignore shader stage limitation. Just apply it to the complete pipeline.
        if (lMaxCounter.uniformBuffers > this.device.capabilities.getLimit(GpuLimit.MaxUniformBuffersPerShaderStage)) {
            throw new Exception(`Max uniform buffers reached pipeline. Max allowed "${this.device.capabilities.getLimit(GpuLimit.MaxUniformBuffersPerShaderStage)}" has "${lMaxCounter.uniformBuffers}"`, this);
        }
    }

    /**
     * Get bind group layout by name.
     * 
     * @param pGroupName - Group name.
     */
    public getGroupLayout(pGroupName: string): BindGroupLayout {
        const lGroupIndex: number | undefined = this.mBindGroupNames.get(pGroupName);

        // Throw on unaccessable group.
        if (typeof lGroupIndex === 'undefined') {
            throw new Exception(`Bind group layout (${pGroupName}) does not exists.`, this);
        }

        // Bind group should allways exist.
        return this.mBindGroups.get(lGroupIndex)!;
    }

    /**
     * Get group binding index by name.
     * 
     * @param pGroupName - Group name.
     * 
     * @returns group binding index. 
     */
    public groupIndex(pGroupName: string): number {
        const lBindGroupIndex: number | undefined = this.mBindGroupNames.get(pGroupName);
        if (typeof lBindGroupIndex === 'undefined') {
            throw new Exception(`Pipeline does not contain a group with name "${pGroupName}".`, this);
        }

        return lBindGroupIndex;
    }

    /**
     * Create pipeline data.
     * 
     * @param pBindData - Any bind group of pipeline layout.
     * 
     * @returns validated pipeline data. 
     */
    public withData(pSetupCallback: (pSetup: PipelineDataSetup) => void): PipelineData {
        return new PipelineData(this.device, this).setup(pSetupCallback);
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generateNative(): GPUPipelineLayout {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayoutDescriptor = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const [lGroupIndex, lBindGroupLayout] of this.mBindGroups) {
            lPipelineLayoutDescriptor.bindGroupLayouts[lGroupIndex] = lBindGroupLayout.native;
        }

        // Validate continunity.
        if (this.mBindGroups.size !== lPipelineLayoutDescriptor.bindGroupLayouts.length) {
            throw new Exception(`Bind group gap detected. Group not set.`, this);
        }

        // Generate pipeline layout from descriptor.
        return this.device.gpu.createPipelineLayout(lPipelineLayoutDescriptor);
    }
}