import type { TextureFormat } from '../../constant/texture-format.enum.ts';
import { GpuObjectSetup } from '../../gpu_object/gpu-object-setup.ts';
import type { GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';

/**
 * Render target layout setup.
 * Configures format metadata for render targets without actual textures.
 */
export class RenderTargetsLayoutSetup extends GpuObjectSetup<RenderTargetsLayoutSetupData> {
    /**
     * Constructor.
     *
     * @param pSetupReference - Setup references.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<RenderTargetsLayoutSetupData>) {
        super(pSetupReference);
    }

    /**
     * Add color target format configuration.
     *
     * @param pName - Color target name.
     * @param pLocationIndex - Target location index.
     * @param pFormat - Texture format.
     * @param pKeepOnEnd - Keep information after render pass end.
     * @param pClearValue - Clear value on render pass start. Omit to never clear.
     */
    public addColor(pName: string, pLocationIndex: number, pFormat: TextureFormat, pKeepOnEnd: boolean = true, pClearValue?: { r: number; g: number; b: number; a: number; }): void {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Add color target configuration.
        this.setupData.colorTargets.push({
            name: pName,
            index: pLocationIndex,
            format: pFormat,
            keepOnEnd: pKeepOnEnd,
            clearValue: pClearValue ?? { r: 0, g: 0, b: 0, a: 0 }
        });
    }

    /**
     * Add depth and stencil target format configuration.
     * Actual usage of depth and stencil is determined by the parameters provided.
     *
     * @param pFormat - Texture format.
     * @param pDepthKeepOnEnd - Keep depth information after render pass end. Null to not use depth.
     * @param pDepthClearValue - Depth clear value on render pass start. Null to not clear.
     * @param pStencilKeepOnEnd - Keep stencil information after render pass end. Null to not use stencil.
     * @param pStencilClearValue - Stencil clear value on render pass start. Null to not clear.
     */
    public addDepthStencil(pFormat: TextureFormat, pDepthKeepOnEnd: boolean | null = null, pDepthClearValue: number | null = null, pStencilKeepOnEnd: boolean | null = null, pStencilClearValue: number | null = null): void {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Set depth stencil configuration.
        this.setupData.depthStencil = {
            format: pFormat
        };

        // Setup depth when values where set.
        if (pDepthKeepOnEnd !== null || pDepthClearValue !== null) {
            this.setupData.depthStencil.depth = {
                keepOnEnd: pDepthKeepOnEnd ?? false,
                clearValue: pDepthClearValue ?? 0
            };
        }

        // Setup stencil when values where set.
        if (pStencilKeepOnEnd !== null || pStencilClearValue !== null) {
            this.setupData.depthStencil.stencil = {
                keepOnEnd: pStencilKeepOnEnd ?? false,
                clearValue: pStencilClearValue ?? 0
            };
        }
    }

    /**
     * Fill in default data before the setup starts.
     *
     * @param pDataReference - Setup data reference.
     */
    protected override fillDefaultData(pDataReference: Partial<RenderTargetsLayoutSetupData>): void {
        pDataReference.colorTargets = new Array<RenderTargetsLayoutColorTargetData>();
        pDataReference.depthStencil = null;
    }
}

type RenderTargetsLayoutColorTargetData = {
    name: string;
    index: number;
    format: TextureFormat;
    keepOnEnd: boolean;
    clearValue: { r: number; g: number; b: number; a: number; };
};

export type RenderTargetsLayoutSetupData = {
    colorTargets: Array<RenderTargetsLayoutColorTargetData>;
    depthStencil: {
        format: TextureFormat;
        depth?: {
            keepOnEnd: boolean;
            clearValue: number;
        };
        stencil?: {
            keepOnEnd: boolean;
            clearValue: number;
        };
    } | null;
};
