import { TextureOperation } from '../../../constant/texture-operation.enum';
import { GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { CanvasTexture } from '../../texture/canvas-texture';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { RenderTargetTextureSetup } from './render-targets-texture-setup';

export class RenderTargetsSetup extends GpuObjectSetup<RenderTargetSetupReferenceData> {
    /**
     * Constructor
     * 
     * @param pSetupReference -Setup references.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<RenderTargetSetupReferenceData>) {
        super(pSetupReference);

        // Setup references.
        this.setupData.colorTargets = new Array<RenderTargetsColorTargetSetupData>();
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
            texture: null
        };

        // Add to color attachment list.
        this.setupData.colorTargets.push(lTarget);

        // Return texture setup. Set texture on texture resolve.
        return new RenderTargetTextureSetup(this.setupReferences, (pTexture: FrameBufferTexture) => {
            lTarget.texture = pTexture;
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
        this.ensureThatInSetup();

        this.setupData.depthStencil = {
            texture: null
        };

        // Setup depth.
        this.setupData.depthStencil.depth = {
            clearValue: pDepthClearValue ?? null,
            storeOperation: (pDepthKeepOnEnd) ? TextureOperation.Keep : TextureOperation.Clear,
        };

        // Setup stencil.
        this.setupData.depthStencil.stencil = {
            clearValue: pStencilClearValue ?? null,
            storeOperation: (pStencilKeepOnEnd) ? TextureOperation.Keep : TextureOperation.Clear,
        };

        // Return texture setup. Set texture on texture resolve.
        return new RenderTargetTextureSetup(this.setupReferences, (pTexture: FrameBufferTexture) => {
            this.setupData.depthStencil!.texture = pTexture;
        });
    }
}

type RenderTargetsDepthStencilTextureSetupData = {
    texture: FrameBufferTexture | null;
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
    texture: FrameBufferTexture | CanvasTexture | null;
};

export interface RenderTargetSetupReferenceData {
    colorTargets: Array<RenderTargetsColorTargetSetupData>;
    depthStencil?: RenderTargetsDepthStencilTextureSetupData;
}
