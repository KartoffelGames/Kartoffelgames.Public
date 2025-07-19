import { GpuObjectChildSetup } from '../../gpu_object/gpu-object-child-setup.ts';
import { PipelineDataSetupData } from './pipeline-data-setup.ts';

/**
 * Child setup for a single pipeline data group binding buffer.
 */
export class PipelineDataGroupSetup extends GpuObjectChildSetup<PipelineDataSetupData, PipelineDataGroupSetupDataCallback> {
    /**
     * Apply offset to bind group.
     * 
     * @param pBindingName - Name of one of binding sof group. 
     * @param pOffsetIndex - Offset index.
     * 
     * @returns this.
     */
    public withOffset(pBindingName: string, pOffsetIndex: number): this {
        this.sendData({
            bindingName: pBindingName,
            offsetIndex: pOffsetIndex
        });

        return this;
    }
}

export type PipelineDataGroupSetupData = {
    bindingName: string;
    offsetIndex: number;
};
type PipelineDataGroupSetupDataCallback = (pBindOffset: PipelineDataGroupSetupData) => void;