import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { BufferItemFormat } from '../../constant/buffer-item-format.enum';
import { BufferItemMultiplier } from '../../constant/buffer-item-multiplier.enum';
import { ShaderSetupReferenceData } from './shader-setup';

export class ShaderFragmentEntryPointSetup extends GpuObjectChildSetup<ShaderSetupReferenceData, RenderTargetCallback> {
    /**
     * Setup fragment render target.
     */
    public addRenderTarget(pName: string, pLocationIndex: number, pDataFormat: BufferItemFormat, pDataMultiplier: BufferItemMultiplier): this {
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
    format: BufferItemFormat;
    multiplier: BufferItemMultiplier;
};

type RenderTargetCallback = (pRenderTarget: ShaderFragmentEntryPointRenderTargetSetupData) => void;