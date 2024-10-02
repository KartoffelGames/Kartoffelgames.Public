import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameterLayoutSetupData } from './vertex-parameter-layout-setup';

export class VertexParameterBufferLayoutSetup extends GpuObjectChildSetup<VertexParameterLayoutSetupData, VertexParameterBufferLayoutCallback> {
    /**
     * Add new parameter to vertex layout.
     * 
     * @param pName - Parameter name.
     * @param pLocation - Parameter location.
     * @param pFormat - Parameter data format.
     * @param pMultiplier - Data multiplication.
     * @param pAdditionalOffset - Additional offset. Offset 0 aligns right after the last parameter.
     * @returns 
     */
    public withParameter(pName: string, pLocation: number, pFormat: PrimitiveBufferFormat, pMultiplier: PrimitiveBufferMultiplier, pAdditionalOffset: number = 0): this {
        // Send layout data.
        this.sendData({
            name: pName,
            location: pLocation,
            format: pFormat,
            multiplier: pMultiplier,
            pOffset: pAdditionalOffset
        });

        return this;
    }
}

type VertexParameterBufferLayoutCallback = (pLayout: VertexParameterBufferLayoutData) => void;

export type VertexParameterBufferLayoutData = {
    name: string;
    location: number;
    format: PrimitiveBufferFormat;
    multiplier: PrimitiveBufferMultiplier;
    pOffset: number;
};