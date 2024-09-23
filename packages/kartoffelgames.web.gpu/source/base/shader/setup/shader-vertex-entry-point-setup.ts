import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { ShaderSetupReferenceData } from './shader-setup';

export class ShaderVertexEntryPointSetup extends GpuObjectChildSetup<ShaderSetupReferenceData, VertexParameterCallback> {
    /**
     * Setup vertex parameter.
     */
    public addParameter(pName: string, pLocationIndex: number, pDataFormat: PrimitiveBufferFormat, pDataMultiplier: PrimitiveBufferMultiplier): this {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        const lVertexParameter: VertexEntryPointParameterSetupData = {
            name: pName,
            location: pLocationIndex,
            format: pDataFormat,
            multiplier: pDataMultiplier
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
}

type VertexParameterCallback = (pVertexParameter: VertexEntryPointParameterSetupData) => void;