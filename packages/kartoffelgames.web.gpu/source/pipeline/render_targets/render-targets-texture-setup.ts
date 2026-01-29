import { TextureDimension } from '../../constant/texture-dimension.enum.ts';
import type { TextureFormat } from '../../constant/texture-format.enum.ts';
import { TextureViewDimension } from '../../constant/texture-view-dimension.enum.ts';
import type { GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import { GpuObjectChildSetup } from '../../gpu_object/gpu-object-child-setup.ts';
import type { CanvasTexture } from '../../texture/canvas-texture.ts';
import { GpuTexture } from '../../texture/gpu-texture.ts';
import type { GpuTextureView } from '../../texture/gpu-texture-view.ts';
import type { RenderTargetSetupData } from './render-targets-setup.ts';

/**
 * Child setup to add or create textures to render target bundles.
 */
export class RenderTargetTextureSetup extends GpuObjectChildSetup<RenderTargetSetupData, RenderTargetTextureCallback> {
    private readonly mMultisampled: boolean;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     * @param pMultisampled - Multisample state.
     * @param pDataCallback - Setup data callback.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<RenderTargetSetupData>, pMultisampled: boolean, pDataCallback: RenderTargetTextureCallback) {
        super(pSetupReference, pDataCallback);

        // Set static multisampled state.
        this.mMultisampled = pMultisampled;
    }

    /**
     * Create new color render target.
     * 
     * @param pFormat - Texture format.
     * @param pResolve - Optional resolve target.
     * 
     * @returns created texture view.
     */
    public new(pFormat: TextureFormat, pResolve: CanvasTexture | null = null): GpuTextureView {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Create new texture.
        const lTexture: GpuTexture = new GpuTexture(this.device, {
            format: pFormat,
            dimension: TextureDimension.TwoDimension,
            multisampled: this.mMultisampled
        });

        // Create view from texture.
        const lTextureView: GpuTextureView = lTexture.useAs(TextureViewDimension.TwoDimension);

        // Callback texture.
        this.sendData({
            view: lTextureView,
            resolveCanvas: pResolve
        });

        return lTextureView;
    }

    /**
     * Use a existing texture.
     * 
     * @param pTexture - Existing texture.
     */
    public use(pTextureView: GpuTextureView, pResolve: CanvasTexture | null = null): GpuTextureView {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Callback texture.
        this.sendData({
            view: pTextureView,
            resolveCanvas: pResolve
        });

        // Return same data.
        return pTextureView;
    }
}

export type RenderTargetSetupTextures = {
    view: GpuTextureView,
    resolveCanvas: CanvasTexture | null;
};

type RenderTargetTextureCallback = (pTexture: RenderTargetSetupTextures) => void;