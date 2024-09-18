import { Exception } from '@kartoffelgames/core';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { ShaderModuleEntryPointFragmentRenderTarget, ShaderSetupReference } from '../shader';

export class ShaderFragmentEntryPointSetup {
    private readonly mRenderTargetCallback: RenderTargetCallback;
    private readonly mSetupReference: ShaderSetupReference;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     * @param pRenderTargetCallback - Render target update callback.
     */
    public constructor(pSetupReference: ShaderSetupReference, pRenderTargetCallback: RenderTargetCallback) {
        this.mSetupReference = pSetupReference;
        this.mRenderTargetCallback = pRenderTargetCallback;
    }

    /**
     * Setup fragment render target.
     */
    public addRenderTarget(pName: string, pLocationIndex: number, pDataFormat: PrimitiveBufferFormat, pDataMultiplier: PrimitiveBufferMultiplier): this {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup fragment shader entry point in a setup call.', this);
        }

        const lRenderTarget: ShaderModuleEntryPointFragmentRenderTarget = {
            name: pName,
            location: pLocationIndex,
            format: pDataFormat,
            multiplier: pDataMultiplier
        };

        // Callback size.
        this.mRenderTargetCallback(lRenderTarget);

        return this;
    }
}

type RenderTargetCallback = (pRenderTarget: ShaderModuleEntryPointFragmentRenderTarget) => void;