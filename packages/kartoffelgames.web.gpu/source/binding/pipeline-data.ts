import { Dictionary, Exception } from '@kartoffelgames/core';
import { BindGroup, BindGroupInvalidationType } from './bind-group';
import { PipelineLayout } from './pipeline-layout';
import { GpuObject } from '../gpu/object/gpu-object';
import { GpuDevice } from '../gpu/gpu-device';

export class PipelineData extends GpuObject<null, PipelineDataInvalidationType> {
    private readonly mBindData: Dictionary<string, BindGroup>;
    private readonly mInvalidationListener: () => void;
    private readonly mLayout: PipelineLayout;
    private readonly mOrderedBindData: Array<BindGroup>;

    /**
     * Orderes pipeline data.
     */
    public get data(): Array<BindGroup> {
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
    public constructor(pDevice: GpuDevice, pPipelineLayout: PipelineLayout, pBindData: Array<BindGroup>) { // TODO: Setup? Add bind data with BindGroup and dynamic-offset-index.
        super(pDevice);

        // Set pipeline layout.
        this.mLayout = pPipelineLayout;

        // Easy access dictionary.
        this.mBindData = new Dictionary<string, BindGroup>();

        // Invalidate pipeline data when any data has changed.
        this.mInvalidationListener = () => {
            this.invalidate(PipelineDataInvalidationType.Data);
        };

        // All bind groups must be set.
        if (pPipelineLayout.groups.length !== pBindData.length) {
            // Generate a better error message.
            for (const lGroupName of pPipelineLayout.groups) {
                // Get and validate existence of set bind group.
                const lBindDataGroup: BindGroup | undefined = pBindData.find((pBindGroup) => { return pBindGroup.layout.name === lGroupName; });
                if (!lBindDataGroup) {
                    throw new Exception(`Required bind group "${lGroupName}" not set.`, this);
                }
            }
        }

        // Validate and order bind data.
        const lBindData: Array<BindGroup> = new Array<BindGroup>();
        for (const lBindGroup of pBindData) {
            const lBindGroupName: string = lBindGroup.layout.name;
            const lBindGroupIndex: number = pPipelineLayout.groupIndex(lBindGroupName);

            // Only distinct bind group names.
            if (lBindData[lBindGroupIndex]) {
                throw new Exception(`Bind group "${lBindGroupName}" was added multiple times to render pass step.`, this);
            }

            // Validate same layout bind layout.
            const lBindGroupLayout = pPipelineLayout.getGroupLayout(lBindGroupName);
            if (lBindGroup.layout !== lBindGroupLayout) {
                throw new Exception(`Source bind group layout for "${lBindGroupName}" does not match target layout.`, this);
            }

            // Restrict double names.
            if(this.mBindData.has(lBindGroupName)){
                throw new Exception(`Bind group "${lBindGroupName}" name already exists in pipeline data.`, this);
            }

            // Set name to bind group mapping.
            this.mBindData.set(lBindGroupName, lBindGroup);

            // Set bind group.
            lBindData[lBindGroupIndex] = lBindGroup;
            

            // Invalidate native data when bind group has changed.
            lBindGroup.addInvalidationListener(this.mInvalidationListener, BindGroupInvalidationType.NativeRebuild);
        }

        this.mOrderedBindData = lBindData;
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
        if(!this.mBindData.has(pBindGroupName)){
            throw new Exception(`Bind group "${pBindGroupName}" does not exists in pipeline data.`, this);
        }

        return this.mBindData.get(pBindGroupName)!; 
    }
}


export enum PipelineDataInvalidationType {
    Data = 'DataChange',
}