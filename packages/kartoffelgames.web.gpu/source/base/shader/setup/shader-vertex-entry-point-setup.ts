import { VertexParameterStepMode } from '../../../constant/vertex-parameter-step-mode.enum';
import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { ShaderSetupReferenceData } from './shader-setup';

export class ShaderVertexEntryPointSetup extends GpuObjectChildSetup<ShaderSetupReferenceData, VertexParameterCallback> {

    // TODO: something like => addBuffer('i dont know').value(name, index, format...) // Maybe instead of format use a layout.
    
    /**
     * Setup vertex parameter.
     */
    public addParameter(pName: string, pLocationIndex: number, pDataFormat: PrimitiveBufferFormat, pDataMultiplier: PrimitiveBufferMultiplier, pStepMode: VertexParameterStepMode): this {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        const lVertexParameter: VertexEntryPointParameterSetupData = {
            name: pName,
            location: pLocationIndex,
            format: pDataFormat,
            multiplier: pDataMultiplier,
            stepMode: pStepMode
        };

        // Callback size.
        this.sendData(lVertexParameter);

        return this;
    }
}

export type VertexEntryPointParameterSetupData = {
    name: string;
    location: number;
    format: PrimitiveBufferFormat;
    multiplier: PrimitiveBufferMultiplier;
    stepMode: VertexParameterStepMode;
};

type VertexParameterCallback = (pVertexParameter: VertexEntryPointParameterSetupData) => void;