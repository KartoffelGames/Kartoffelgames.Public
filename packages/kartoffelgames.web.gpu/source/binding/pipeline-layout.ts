import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuLimit } from '../gpu/capabilities/gpu-limit.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { BindGroupLayout } from './bind-group-layout';
import { PipelineData } from './pipeline-data';
import { PipelineDataSetup } from './pipeline-data-setup';

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

        // TODO: Check gpu restriction.
        // maxSampledTexturesPerShaderStage;
        // maxSamplersPerShaderStage;
        // maxStorageBuffersPerShaderStage;
        // maxStorageTexturesPerShaderStage;
        // maxUniformBuffersPerShaderStage;

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