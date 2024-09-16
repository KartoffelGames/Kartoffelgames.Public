import { Exception } from '@kartoffelgames/core';
import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { TextureMemoryLayout } from '../../memory_layout/texture/texture-memory-layout';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { RenderTargetSetupReference } from './render-targets';

export class RenderTargetTextureSetup {
    private readonly mSetupReference: RenderTargetSetupReference;
    private readonly mTextureCallback: RenderTargetTextureCallback;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     * @param pTarget - Render target configuration object.
     */
    public constructor(pSetupReference: RenderTargetSetupReference, pTextureCallback: RenderTargetTextureCallback) {
        this.mSetupReference = pSetupReference;
        this.mTextureCallback = pTextureCallback;
    }

    /**
     * Create new color render target.
     */
    public new(pFormat: TextureFormat): void {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup render targets in a setup call.', this);
        }

        const lMemoryLayout: TextureMemoryLayout = new TextureMemoryLayout({
            name: this.mTextureCallback.name,
            usage: TextureUsage.RenderAttachment,
            dimension: TextureDimension.TwoDimension,
            format: pFormat, // TODO: Validate with format validator. // TODO: Add format preferences/restrictions to texture setup.
            bindType: TextureBindType.RenderTarget,
            multisampled: false // Should be set in render target generation.
        });

        // Callback texture.
        this.mTextureCallback(new FrameBufferTexture(this.mSetupReference.device, lMemoryLayout));
    }

    /**
     * Use a existing texture.
     * 
     * @param pTexture - Existing texture.
     */
    public use(pTexture: FrameBufferTexture): void {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup render targets in a setup call.', this);
        }

        // Callback texture.
        this.mTextureCallback(pTexture);
    }
}

type RenderTargetTextureCallback = (pTexture: FrameBufferTexture) => void;