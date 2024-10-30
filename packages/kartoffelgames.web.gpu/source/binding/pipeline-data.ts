import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences } from '../gpu/object/gpu-object';
import { IGpuObjectSetup } from '../gpu/object/interface/i-gpu-object-setup';
import { BindGroup, BindGroupInvalidationType } from './bind-group';
import { PipelineDataSetup, PipelineDataSetupData, PipelineDataSetupDataGroup } from './pipeline-data-setup';
import { PipelineLayout } from './pipeline-layout';

export class PipelineData extends GpuObject<null, PipelineDataInvalidationType, PipelineDataSetup> implements IGpuObjectSetup<PipelineDataSetup> {
    private readonly mBindData: Dictionary<string, BindGroup>;
    private readonly mInvalidationListener: () => void;
    private readonly mLayout: PipelineLayout;
    private readonly mOrderedBindData: Array<BindGroup>;

    /**
     * Orderes pipeline data.
     */
    public get data(): Array<BindGroup> {
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
        this.mBindData = new Dictionary<string, BindGroup>();

        // Invalidate pipeline data when any data has changed.
        this.mInvalidationListener = () => {
            this.invalidate(PipelineDataInvalidationType.Data);
        };

        this.mOrderedBindData = new Array<BindGroup>();
    }

    /**
     * Deconstruct native object.
     */
    public override deconstruct(): void {
        super.deconstruct();

        // Remove all invalidation listener from bind groups.
        for (const lBindGroup of this.mOrderedBindData) {
            lBindGroup.removeInvalidationListener(this.mInvalidationListener);
        }
    }

    /**
     * Get bind group by name.
     * 
     * @param pBindGroupName  - Bind group name.
     * 
     * @returns bind group. 
     */
    public group(pBindGroupName: string): BindGroup {
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
    protected override onSetup(pReferences: PipelineDataSetupData): void {  // TODO: Setup? Add bind data with BindGroup and dynamic-offset-index.
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

            // Set name to bind group mapping.
            this.mBindData.set(lBindGroupName, lBindGroup);

            // Set bind group.
            this.mOrderedBindData[lBindGroupIndex] = lBindGroup;

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


export enum PipelineDataInvalidationType {
    Data = 'DataChange',
}