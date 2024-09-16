import { Exception } from '@kartoffelgames/core';
import { TextureOperation } from '../../../constant/texture-operation.enum';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { RenderTargetsColorTarget, RenderTargetSetupReference } from './render-targets';
import { RenderTargetTextureSetup } from './render-targets-texture-setup';

export class RenderTargetsSetup {
    private readonly mSetupReference: RenderTargetSetupReference;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     */
    public constructor(pSetupReference: RenderTargetSetupReference) {
        this.mSetupReference = pSetupReference;
    }

    /**
     * Add color target.
     * 
     * @param pName - Color target name.
     * @param pLocationIndex - Target location index. 
     * @param pKeepOnEnd - Keep information after render pass end.
     * @param pClearValue - Clear value on render pass start. Omit to never clear.
     */
    public addColor(pName: string, pLocationIndex: number, pKeepOnEnd: boolean = true, pClearValue?: { r: number; g: number; b: number; a: number; }): RenderTargetTextureSetup {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup render targets in a setup call.', this);
        }

        // Convert render attachment to a location mapping. 
        const lTarget: RenderTargetsColorTarget = {
            name: pName,
            index: pLocationIndex,
            clearValue: pClearValue ?? null,
            storeOperation: (pKeepOnEnd) ? TextureOperation.Keep : TextureOperation.Clear,
            texture: null
        };

        // Add to color attachment list.
        this.mSetupReference.colorTargetReference.set(pName, lTarget);

        // Return texture setup. Set texture on texture resolve.
        return new RenderTargetTextureSetup(this.mSetupReference, (pTexture: FrameBufferTexture) => {
            lTarget.texture = {
                target: pTexture
            };
        });
    }

    /**
     * Add depth and stencil target. Actual usage of depth and stencil is the used texture format.
     * 
     * @param pDepthKeepOnEnd - Keep information after render pass end.
     * @param pDepthClearValue - Clear value on render pass start. Omit to never clear.
     * @param pStencilKeepOnEnd - Keep information after render pass end.
     * @param pStencilClearValue - Clear value on render pass start. Omit to never clear.
     */
    public addDepthStencil(pDepthKeepOnEnd: boolean = false, pDepthClearValue?: number, pStencilKeepOnEnd: boolean = false, pStencilClearValue?: number): RenderTargetTextureSetup {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup render targets in a setup call.', this);
        }

        // Setup depth.
        this.mSetupReference.depthStencilTargetReference.depth = {
            clearValue: pDepthClearValue ?? null,
            storeOperation: (pDepthKeepOnEnd) ? TextureOperation.Keep : TextureOperation.Clear,
        };

        // Setup stencil.
        this.mSetupReference.depthStencilTargetReference.stencil = {
            clearValue: pStencilClearValue ?? null,
            storeOperation: (pStencilKeepOnEnd) ? TextureOperation.Keep : TextureOperation.Clear,
        };

        // Return texture setup. Set texture on texture resolve.
        return new RenderTargetTextureSetup(this.mSetupReference, (pTexture: FrameBufferTexture) => {
            this.mSetupReference.depthStencilTargetReference.target = pTexture;
        });
    }
}