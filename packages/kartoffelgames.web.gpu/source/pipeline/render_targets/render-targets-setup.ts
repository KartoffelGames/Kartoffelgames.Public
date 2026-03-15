import { Exception } from '@kartoffelgames/core';
import { GpuObjectSetup } from '../../gpu_object/gpu-object-setup.ts';
import type { GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import type { IGpuTexture } from '../../texture/i-gpu-texture.ts';
import type { RenderTargetsLayout, RenderTargetsLayoutColorTarget } from './render-targets-layout.ts';

/**
 * Render target setup.
 * Configures setup data for render targets, which are GPU objects representing render pass attachments
 */
export class RenderTargetsSetup extends GpuObjectSetup<RenderTargetsSetupData> {
    private readonly mLayout: RenderTargetsLayout;

    /**
     * Constructor.
     *
     * @param pSetupReference - Setup references.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<RenderTargetsSetupData>, pRenderTargetLayout: RenderTargetsLayout) {
        super(pSetupReference);

        this.mLayout = pRenderTargetLayout;
    }

    /**
     * Manually sets a color target texture.
     * 
     * @param pName - Color target name.
     * @param pTexture - Color target texture.
     */
    public setOwnColorTarget(pName: string, pTexture: IGpuTexture): void {
        // Get target layout.
        const lColorTargetLayout: RenderTargetsLayoutColorTarget = this.mLayout.colorTarget(pName);

        // Validate setup texture format and dimensions.
        if (pTexture.format !== lColorTargetLayout.format) {
            throw new Exception(`Setup texture format for target "${pName}" does not match layout format.`, this);
        }

        this.setupData.colorTargets.set(pName, pTexture);
    }

    /**
     * Manually sets a depth stencil texture.
     * 
     * @param pTexture - Depth stencil texture.
     */
    public setOwnDepthStencilTarget(pTexture: IGpuTexture): void {
        // When targets are multisampled but the provided texture is not, throw.
        if (this.mLayout.multisampled && !pTexture.multiSampled) {
            throw new Exception(`Depth stencil target must be multisampled when layout is multisampled.`, this);
        }

        this.setupData.depthStencil = pTexture;
    }

    /**
     * Fill in default data before the setup starts.
     *
     * @param pDataReference - Setup data reference.
     */
    protected override fillDefaultData(pDataReference: Partial<RenderTargetsSetupData>): void {
        pDataReference.colorTargets = new Map<string, IGpuTexture>();
        pDataReference.depthStencil = null;
    }
}

export type RenderTargetsSetupData = {
    colorTargets: Map<string, IGpuTexture>;
    depthStencil: IGpuTexture | null;
};
