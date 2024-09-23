import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { TextureMemoryLayout } from '../../memory_layout/texture/texture-memory-layout';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { RenderTargetSetupReferenceData } from './render-targets-setup';

export class RenderTargetTextureSetup extends GpuObjectSetup<RenderTargetSetupReferenceData> {
    private readonly mTextureCallback: RenderTargetTextureCallback;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     * @param pTarget - Render target configuration object.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<RenderTargetSetupReferenceData>, pTextureCallback: RenderTargetTextureCallback) {
        super(pSetupReference);

        this.mTextureCallback = pTextureCallback;
    }

    /**
     * Create new color render target.
     */
    public new(pFormat: TextureFormat): void {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        const lMemoryLayout: TextureMemoryLayout = new TextureMemoryLayout({
            name: this.mTextureCallback.name,
            usage: TextureUsage.RenderAttachment,
            dimension: TextureDimension.TwoDimension,
            format: pFormat, // TODO: Validate with format validator. // TODO: Add format preferences/restrictions to texture setup.
            bindType: TextureBindType.RenderTarget,
            multisampled: false // Should be set in render target generation.
        });

        // Callback texture.
        this.mTextureCallback(new FrameBufferTexture(this.device, lMemoryLayout));
    }

    /**
     * Use a existing texture.
     * 
     * @param pTexture - Existing texture.
     */
    public use(pTexture: FrameBufferTexture): void {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Callback texture.
        this.mTextureCallback(pTexture);
    }
}

type RenderTargetTextureCallback = (pTexture: FrameBufferTexture) => void;