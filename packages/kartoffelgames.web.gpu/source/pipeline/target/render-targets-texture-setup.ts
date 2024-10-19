import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureViewDimension } from '../../constant/texture-view-dimension.enum';
import { GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { CanvasTexture } from '../../texture/canvas-texture';
import { GpuTexture } from '../../texture/gpu-texture';
import { GpuTextureView } from '../../texture/gpu-texture-view';
import { RenderTargetSetupData } from './render-targets-setup';

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