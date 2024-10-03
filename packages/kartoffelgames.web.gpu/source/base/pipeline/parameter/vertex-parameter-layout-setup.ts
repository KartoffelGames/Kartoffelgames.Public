import { VertexParameterStepMode } from '../../../constant/vertex-parameter-step-mode.enum';
import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { VertexParameterBufferLayoutData, VertexParameterBufferLayoutSetup } from './vertex-parameter-buffer-layout-setup';

export class VertexParameterLayoutSetup extends GpuObjectSetup<VertexParameterLayoutSetupData> {
    /**
     * Add a new buffer layout to vertex parameter layout.
     * 
     * @param pStepMode - Buffer step mode.
     * 
     * @returns vertex buffer layout setup 
     */
    public buffer(pBufferName: string, pFormat: PrimitiveBufferFormat, pStepMode: VertexParameterStepMode): VertexParameterBufferLayoutSetup {
        // Create buffer.
        const lBuffer: VertexParameterLayoutSetupBufferData = {
            name: pBufferName,
            stepMode: pStepMode,
            format: pFormat,
            parameter: new Array<VertexParameterBufferLayoutData>()
        };

        // Add buffer to result.
        this.setupData.buffer.push(lBuffer);

        // Create and return buffer setup.
        return new VertexParameterBufferLayoutSetup(this.setupReferences, (pLayout: VertexParameterBufferLayoutData) => {
            lBuffer.parameter.push(pLayout);
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
    name: string;
    format: PrimitiveBufferFormat;
    stepMode: VertexParameterStepMode;
    parameter: Array<VertexParameterBufferLayoutData>;
};

export type VertexParameterLayoutSetupData = {
    buffer: Array<VertexParameterLayoutSetupBufferData>;
};