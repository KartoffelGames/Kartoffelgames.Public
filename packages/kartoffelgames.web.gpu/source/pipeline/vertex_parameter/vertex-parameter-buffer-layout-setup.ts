import type { BufferItemFormat } from '../../constant/buffer-item-format.enum.ts';
import type { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum.ts';
import { GpuObjectChildSetup } from '../../gpu_object/gpu-object-child-setup.ts';
import type { VertexParameterLayoutSetupData } from './vertex-parameter-layout-setup.ts';

/**
 * Child setup object to divide and add new names parameters to a vertex parameter buffer layout.
 */
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
    public withParameter(pName: string, pLocation: number, pFormat: BufferItemFormat, pMultiplier: BufferItemMultiplier, pAlignment: number | null = null): this {
        // Send layout data.
        this.sendData({
            name: pName,
            location: pLocation,
            format: pFormat,
            multiplier: pMultiplier,
            alignment: pAlignment
        });

        return this;
    }
}

type VertexParameterBufferLayoutCallback = (pLayout: VertexParameterBufferLayoutData) => void;

export type VertexParameterBufferLayoutData = {
    name: string;
    location: number;
    format: BufferItemFormat;
    multiplier: BufferItemMultiplier;
    alignment: number | null;
};