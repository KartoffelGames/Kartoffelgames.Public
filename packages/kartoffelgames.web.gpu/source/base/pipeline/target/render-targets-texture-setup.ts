import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { GpuObjectChildSetup } from '../../gpu/object/gpu-object-child-setup';
import { TextureMemoryLayout } from '../../memory_layout/texture/texture-memory-layout';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { RenderTargetSetupReferenceData } from './render-targets-setup';

export class RenderTargetTextureSetup extends GpuObjectChildSetup<RenderTargetSetupReferenceData, RenderTargetTextureCallback> {
    /**
     * Create new color render target.
     */
    public new(pFormat: TextureFormat): void {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        const lMemoryLayout: TextureMemoryLayout = new TextureMemoryLayout({
            name: 'RenderTarget', // TODO: 
            usage: TextureUsage.RenderAttachment,
            dimension: TextureDimension.TwoDimension,
            format: pFormat, // TODO: Validate with format validator. // TODO: Add format preferences/restrictions to texture setup.
            bindType: TextureBindType.RenderTarget,
            multisampled: false // Should be set in render target generation.
        });

        // Callback texture.
        this.sendData(new FrameBufferTexture(this.device, lMemoryLayout));
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
        this.sendData(pTexture);
    }
}

type RenderTargetTextureCallback = (pTexture: FrameBufferTexture) => void;