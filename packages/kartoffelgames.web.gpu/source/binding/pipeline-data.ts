import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences } from '../gpu/object/gpu-object';
import { IGpuObjectSetup } from '../gpu/object/interface/i-gpu-object-setup';
import { BindGroup, BindGroupInvalidationType } from './bind-group';
import { PipelineDataSetup, PipelineDataSetupData, PipelineDataSetupDataGroup } from './pipeline-data-setup';
import { PipelineLayout } from './pipeline-layout';
import { BindLayout } from './bind-group-layout';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { StorageBindingType } from '../constant/storage-binding-type.enum';
import { GpuLimit } from '../gpu/capabilities/gpu-limit.enum';

export class PipelineData extends GpuObject<null, PipelineDataInvalidationType, PipelineDataSetup> implements IGpuObjectSetup<PipelineDataSetup> {
    private readonly mBindData: Dictionary<string, PipelineDataGroup>;
    private readonly mInvalidationListener: () => void;
    private readonly mLayout: PipelineLayout;
    private readonly mOrderedBindData: Array<PipelineDataGroup>;

    /**
     * Orderes pipeline data.
     */
    public get data(): Array<PipelineDataGroup> {
        // Setup needed.
        this.ensureSetup();

        return this.mOrderedBindData;
    }

    /**
     * Pipline layout of data.
     */
    public get layout(): PipelineLayout {
        return this.mLayout;
    }

    /**
     * Constructor.
     * 
     * @param pPipelineLayout - Pipeline data. 
     * @param pBindData - Every bind data of pipeline layout.
     */
    public constructor(pDevice: GpuDevice, pPipelineLayout: PipelineLayout) {
        super(pDevice);

        // Set pipeline layout.
        this.mLayout = pPipelineLayout;

        // Easy access dictionary.
        this.mBindData = new Dictionary<string, PipelineDataGroup>();

        // Invalidate pipeline data when any data has changed.
        this.mInvalidationListener = () => {
            this.invalidate(PipelineDataInvalidationType.Data);
        };

        this.mOrderedBindData = new Array<PipelineDataGroup>();
    }

    /**
     * Deconstruct native object.
     */
    public override deconstruct(): void {
        super.deconstruct();

        // Remove all invalidation listener from bind groups.
        for (const lBindGroup of this.mOrderedBindData) {
            lBindGroup.bindGroup.removeInvalidationListener(this.mInvalidationListener);
        }
    }

    /**
     * Get bind group by name.
     * 
     * @param pBindGroupName  - Bind group name.
     * 
     * @returns bind group. 
     */
    public group(pBindGroupName: string): PipelineDataGroup {
        if (!this.mBindData.has(pBindGroupName)) {
            throw new Exception(`Bind group "${pBindGroupName}" does not exists in pipeline data.`, this);
        }

        return this.mBindData.get(pBindGroupName)!;
    }

    /**
     * Call setup.
     * 
     * @param pSetupCallback - Setup callback.
     *
     * @returns — this. 
     */
    public override setup(pSetupCallback?: ((pSetup: PipelineDataSetup) => void) | undefined): this {
        return super.setup(pSetupCallback);
    }

    /**
     * Setup pipeline data.
     * 
     * @param pReferences - Setup data references. 
     */
    protected override onSetup(pReferences: PipelineDataSetupData): void {
        // All bind groups must be set.
        if (this.mLayout.groups.length !== pReferences.groups.length) {
            // Generate a better error message.
            for (const lGroupName of this.mLayout.groups) {
                // Get and validate existence of set bind group.
                const lBindGroupSetupData: PipelineDataSetupDataGroup | undefined = pReferences.groups.find((pBindGroup) => { return pBindGroup.bindGroup.layout.name === lGroupName; });
                if (!lBindGroupSetupData) {
                    throw new Exception(`Required bind group "${lGroupName}" not set.`, this);
                }
            }
        }

        // Validate and order bind data.
        for (const lBindGroupSetupData of pReferences.groups) {
            const lBindGroupName: string = lBindGroupSetupData.bindGroup.layout.name;
            const lBindGroupIndex: number = this.mLayout.groupIndex(lBindGroupName);
            const lBindGroup: BindGroup = lBindGroupSetupData.bindGroup;

            // Only distinct bind group names.
            if (this.mOrderedBindData[lBindGroupIndex]) {
                throw new Exception(`Bind group "${lBindGroupName}" was added multiple times to render pass step.`, this);
            }

            // Validate same layout bind layout.
            const lBindGroupLayout = this.mLayout.getGroupLayout(lBindGroupName);
            if (lBindGroup.layout !== lBindGroupLayout) {
                throw new Exception(`Source bind group layout for "${lBindGroupName}" does not match target layout.`, this);
            }

            // Restrict double names.
            if (this.mBindData.has(lBindGroupName)) {
                throw new Exception(`Bind group "${lBindGroupName}" name already exists in pipeline data.`, this);
            }

            // When the bind group has dynamic offsets, build a array of it.
            const lPipelineDataGroup: PipelineDataGroup = {
                offsetId: '',
                bindGroup: lBindGroup,
                offsets: new Array<number>()
            };
            if (lBindGroupLayout.hasDynamicOffset) {
                for (const lBindingName of lBindGroupLayout.orderedBindingNames) {
                    // Skip any binding not having a dynamic offset.
                    const lBindingLayout: Readonly<BindLayout> = lBindGroupLayout.getBind(lBindingName);
                    if (!lBindGroupLayout.hasDynamicOffset) {
                        continue;
                    }

                    // Dynamic bindings need a offset.
                    if (!lBindGroupSetupData.offsets.has(lBindingName)) {
                        throw new Exception(`Binding "${lBindingName}" of group "${lBindGroupName} requires a offset."`, this);
                    }

                    // Read and validate assigned offset index of binding.
                    const lBindingDynamicOffsetIndex: number = lBindGroupSetupData.offsets.get(lBindingName)!;
                    if (lBindingDynamicOffsetIndex >= lBindingLayout.dynamicOffsets) {
                        throw new Exception(`Binding "${lBindingName}" of group "${lBindGroupName} exceedes dynamic offset limits."`, this);
                    }

                    // Read correct alignment limitations for storage type.
                    const lOffsetAlignment: number = (() => {
                        if (lBindingLayout.storageType === StorageBindingType.None) {
                            return this.device.capabilities.getLimit(GpuLimit.MinUniformBufferOffsetAlignment);
                        } else {
                            return this.device.capabilities.getLimit(GpuLimit.MinStorageBufferOffsetAlignment);
                        }
                    })();

                    // Get offset byte count.
                    const lBufferMemoryLayout: BaseBufferMemoryLayout = lBindingLayout.layout as BaseBufferMemoryLayout;
                    const lDynamicOffsetByteCount: number = (Math.ceil(lBufferMemoryLayout.fixedSize / lOffsetAlignment) * lOffsetAlignment) * lBindingDynamicOffsetIndex;

                    // Save offset byte count in order.
                    lPipelineDataGroup.offsets.push(lDynamicOffsetByteCount);
                }

                // Rebuild offset "id".
                lPipelineDataGroup.offsetId = lPipelineDataGroup.offsets.join('-');
            }

            // Set name to bind group mapping.
            this.mBindData.set(lBindGroupName, lPipelineDataGroup);

            // Set bind group.
            this.mOrderedBindData[lBindGroupIndex] = lPipelineDataGroup;

            // Invalidate native data when bind group has changed.
            lBindGroup.addInvalidationListener(this.mInvalidationListener, BindGroupInvalidationType.NativeRebuild);
        }
    }

    /**
     * Create setup object. Return null to skip any setups.
     * 
     * @param pReferences - Setup references.
     * 
     * @returns setup.
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<PipelineDataSetupData>): PipelineDataSetup {
        return new PipelineDataSetup(pReferences);
    }
}

export type PipelineDataGroup = {
    offsetId: string;
    bindGroup: BindGroup;
    offsets: Array<number>;
};

export enum PipelineDataInvalidationType {
    Data = 'DataChange',
}