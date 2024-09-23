import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { ShaderSetupReferenceData } from './shader-setup';

export class ShaderFragmentEntryPointSetup extends GpuObjectChildSetup<ShaderSetupReferenceData, RenderTargetCallback> {
    /**
     * Setup fragment render target.
     */
    public addRenderTarget(pName: string, pLocationIndex: number, pDataFormat: PrimitiveBufferFormat, pDataMultiplier: PrimitiveBufferMultiplier): this {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        const lRenderTarget: ShaderFragmentEntryPointRenderTargetSetupData = {
            name: pName,
            location: pLocationIndex,
            format: pDataFormat,
            multiplier: pDataMultiplier
        };

        // Callback size.
        this.sendData(lRenderTarget);

        return this;
    }
}

export type ShaderFragmentEntryPointRenderTargetSetupData = {
    name: string;
    location: number;
    format: PrimitiveBufferFormat;
    multiplier: PrimitiveBufferMultiplier;
};

type RenderTargetCallback = (pRenderTarget: ShaderFragmentEntryPointRenderTargetSetupData) => void;