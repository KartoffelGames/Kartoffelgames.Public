import { Exception } from '@kartoffelgames/core';
import { BindGroup, BindGroupInvalidationType } from './bind-group';
import { PipelineLayout } from './pipeline-layout';
import { GpuObject } from '../gpu/object/gpu-object';
import { GpuDevice } from '../gpu/gpu-device';

export class PipelineData extends GpuObject<null, PipelineDataInvalidationType> {
    private readonly mBindData: Array<BindGroup>;
    private readonly mInvalidationListener: () => void;

    /**
     * Orderes pipeline data.
     */
    public get data(): Array<BindGroup> {
        return this.mBindData;
    }

    /**
     * Constructor.
     * 
     * @param pPipelineLayout - Pipeline data. 
     * @param pBindData - Every bind data of pipeline layout.
     */
    public constructor(pDevice: GpuDevice, pPipelineLayout: PipelineLayout, pBindData: Array<BindGroup>) {
        super(pDevice);

        // Invalidate pipeline data when any data has changed.
        this.mInvalidationListener = () => {
            this.invalidate(PipelineDataInvalidationType.Data);
        };

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

            // Set bind group.
            lBindData[lBindGroupIndex] = lBindGroup;

            // Invalidate native data when bind group has changed.
            lBindGroup.addInvalidationListener(this.mInvalidationListener, BindGroupInvalidationType.NativeRebuild);
        }

        // All bind groups must be set.
        if (pPipelineLayout.groups.length !== lBindData.length) {
            // Generate a better error message.
            for (const lGroupName of pPipelineLayout.groups) {
                // Get and validate existence of set bind group.
                const lBindDataGroup: BindGroup | undefined = pBindData.find((pBindGroup) => { return pBindGroup.layout.name === lGroupName; });
                if (!lBindDataGroup) {
                    throw new Exception(`Required bind group "${lGroupName}" not set.`, this);
                }
            }
        }

        this.mBindData = lBindData;
    }

    /**
     * Deconstruct native object.
     */
    public override deconstruct(): void {
        super.deconstruct();

        // Remove all invalidation listener from bind groups.
        for (const lBindGroup of this.mBindData) {
            lBindGroup.removeInvalidationListener(this.mInvalidationListener);
        }
    }
}


export enum PipelineDataInvalidationType {
    Data = 'DataChange',
}