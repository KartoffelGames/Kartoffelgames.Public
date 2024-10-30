import { Dictionary } from '@kartoffelgames/core';
import { GpuObjectSetup } from '../gpu/object/gpu-object-setup';
import { BindGroup } from './bind-group';
import { PipelineDataGroupSetup, PipelineDataGroupSetupData } from './pipeline-data-group-setup';

export class PipelineDataSetup extends GpuObjectSetup<PipelineDataSetupData> {

    /**
     * Add bind group to pipeline data.
     * 
     * @param pBindGroup - Bind group.
     * 
     * @returns group setup. 
     */
    public addGroup(pBindGroup: BindGroup): PipelineDataGroupSetup {
        // Create binding group information.
        const lBindGroup: PipelineDataSetupDataGroup = {
            bindGroup: pBindGroup,
            offsets: new Dictionary<string, number>()
        };

        this.setupData.groups.push(lBindGroup);

        // Can be used to add "optional" binding offsets to bind group.
        return new PipelineDataGroupSetup(this.setupReferences, (pBindingOffsets: PipelineDataGroupSetupData) => {
            lBindGroup.offsets.set(pBindingOffsets.bindingName, pBindingOffsets.offsetIndex);
        });
    }

    /**
     * Fill in default data before the setup starts.
     * 
     * @param pDataReference - Setup data reference.
     */
    protected override fillDefaultData(pDataReference: PipelineDataSetupData): void {
        pDataReference.groups = new Array<PipelineDataSetupDataGroup>();
    }
}

export type PipelineDataSetupDataGroup = {
    offsets: Dictionary<string, number>;
    bindGroup: BindGroup;
};

export type PipelineDataSetupData = {
    groups: Array<PipelineDataSetupDataGroup>;
};
