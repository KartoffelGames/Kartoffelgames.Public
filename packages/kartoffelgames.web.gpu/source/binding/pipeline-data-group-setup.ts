import { GpuObjectChildSetup } from '../gpu/object/gpu-object-child-setup';
import { PipelineDataSetupData } from './pipeline-data-setup';

export class PipelineDataGroupSetup extends GpuObjectChildSetup<PipelineDataSetupData, PipelineDataGroupSetupDataCallback> {
    /**
     * Apply offset to bind group.
     * 
     * @param pBindingName - Name of one of binding sof group. 
     * @param pOffsetIndex - Offset index.
     */
    public withOffset(pBindingName: string, pOffsetIndex: number): void {
        this.sendData({
            bindingName: pBindingName,
            offsetIndex: pOffsetIndex
        });
    }
}

export type PipelineDataGroupSetupData = {
    bindingName: string;
    offsetIndex: number;
};
type PipelineDataGroupSetupDataCallback = (pBindOffset: PipelineDataGroupSetupData) => void;