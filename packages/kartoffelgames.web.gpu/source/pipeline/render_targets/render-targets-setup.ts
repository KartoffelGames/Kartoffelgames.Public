import { Exception } from '@kartoffelgames/core';
import { TextureOperation } from '../../constant/texture-operation.enum.ts';
import { GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import { GpuObjectSetup } from '../../gpu_object/gpu-object-setup.ts';
import { CanvasTexture } from '../../texture/canvas-texture.ts';
import { GpuTextureView } from '../../texture/gpu-texture-view.ts';
import { RenderTargetSetupTextures, RenderTargetTextureSetup } from './render-targets-texture-setup.ts';

/**
 * Render target setup.
 */
export class RenderTargetsSetup extends GpuObjectSetup<RenderTargetSetupData> {
    private readonly mMultisampled: boolean;

    /**
     * Constructor
     * 
     * @param pSetupReference -Setup references.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<RenderTargetSetupData>, pMultisampled: boolean) {
        super(pSetupReference);

        // Set static multisampled state.
        this.mMultisampled = pMultisampled;
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
        this.ensureThatInSetup();

        // Convert render attachment to a location mapping. 
        const lTarget: RenderTargetsColorTargetSetupData = {
            name: pName,
            index: pLocationIndex,
            clearValue: pClearValue ?? null,
            storeOperation: (pKeepOnEnd) ? TextureOperation.Keep : TextureOperation.Clear,
            textureView: null,
            resolveCanvas: null
        };

        // Add to color attachment list.
        this.setupData.colorTargets.push(lTarget);

        // Return texture setup. Set texture on texture resolve.
        return new RenderTargetTextureSetup(this.setupReferences, this.mMultisampled, (pTexture: RenderTargetSetupTextures) => {
            lTarget.textureView = pTexture.view;
            lTarget.resolveCanvas = pTexture.resolveCanvas;
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
    public addDepthStencil(pDepthKeepOnEnd: boolean | null = null, pDepthClearValue: number | null = null, pStencilKeepOnEnd: boolean | null = null, pStencilClearValue: number | null = null): RenderTargetTextureSetup {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        this.setupData.depthStencil = {
            textureView: null
        };

        // Setup depth when values where set.
        if (pDepthKeepOnEnd !== null || pDepthClearValue !== null) {
            this.setupData.depthStencil.depth = {
                clearValue: pDepthClearValue ?? null,
                storeOperation: (pDepthKeepOnEnd) ? TextureOperation.Keep : TextureOperation.Clear,
            };
        }

        // Setup stencil when values where set.
        if (pStencilKeepOnEnd !== null || pStencilClearValue !== null) {
            this.setupData.depthStencil.stencil = {
                clearValue: pStencilClearValue ?? null,
                storeOperation: (pStencilKeepOnEnd) ? TextureOperation.Keep : TextureOperation.Clear,
            };
        }

        // Return texture setup. Set texture on texture resolve.
        return new RenderTargetTextureSetup(this.setupReferences, this.mMultisampled, (pTexture: RenderTargetSetupTextures) => {
            // Restrict used texture type to a frame buffer.
            if (pTexture.resolveCanvas) {
                throw new Exception(`Can't use a canvas texture as depth or stencil texture.`, this);
            }

            this.setupData.depthStencil!.textureView = pTexture.view;
        });
    }

    /**
     * Fill in default data before the setup starts.
     * 
     * @param pDataReference - Setup data reference.
     */
    protected override fillDefaultData(pDataReference: RenderTargetSetupData): void {
        pDataReference.colorTargets = new Array<RenderTargetsColorTargetSetupData>();
    }
}

type RenderTargetsDepthStencilTextureSetupData = {
    textureView: GpuTextureView | null;
    depth?: {
        clearValue: number | null;
        storeOperation: TextureOperation;
    };
    stencil?: {
        clearValue: number | null;
        storeOperation: TextureOperation;
    };
};

type RenderTargetsColorTargetSetupData = {
    name: string;
    index: number;
    clearValue: { r: number; g: number; b: number; a: number; } | null;
    storeOperation: TextureOperation;
    textureView: GpuTextureView | null;
    resolveCanvas: CanvasTexture | null;
};

export interface RenderTargetSetupData {
    colorTargets: Array<RenderTargetsColorTargetSetupData>;
    depthStencil?: RenderTargetsDepthStencilTextureSetupData;
}
