import { VertexParameterStepMode } from '../../../constant/vertex-parameter-step-mode.enum';
import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { VertexParameterBufferLayoutData, VertexParameterBufferLayoutSetup } from './vertex-parameter-buffer-layout-setup';

export class VertexParameterLayoutSetup extends GpuObjectSetup<VertexParameterLayoutSetupData> {
    /**
     * Add a new buffer layout to vertex parameter layout.
     * 
     * @param pStepMode - Buffer step mode.
     * 
     * @returns vertex buffer layout setup 
     */
    public buffer(pStepMode: VertexParameterStepMode): VertexParameterBufferLayoutSetup {
        // Create buffer.
        const lBuffer: VertexParameterLayoutSetupBufferData = {
            stepMode: pStepMode,
            locations: new Array<VertexParameterBufferLayoutData>()
        };

        // Add buffer to result.
        this.setupData.buffer.push(lBuffer);

        // Create and return buffer setup.
        return new VertexParameterBufferLayoutSetup(this.setupReferences, (pLayout: VertexParameterBufferLayoutData) => {
            lBuffer.locations.push(pLayout);
        });
    }

    /**
     * Fill in default data before the setup starts.
     * 
     * @param pDataReference - Setup data.
     */
    protected override fillDefaultData(pDataReference: Partial<VertexParameterLayoutSetupData>): void {
        pDataReference.buffer = new Array<VertexParameterLayoutSetupBufferData>();
    }
}

type VertexParameterLayoutSetupBufferData = {
    stepMode: VertexParameterStepMode;
    locations: Array<VertexParameterBufferLayoutData>;
};

export type VertexParameterLayoutSetupData = {
    buffer: Array<VertexParameterLayoutSetupBufferData>;
};