import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { TextureMemoryLayout } from '../../memory_layout/texture/texture-memory-layout';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { RenderTargetsColorTarget } from './render-targets';

export class RenderTargetColorSetup {
    private readonly mChangeCallback: () => void;
    private readonly mColorTarget: RenderTargetsColorTarget;
    private readonly mDevice: GpuDevice;

    /**
     * Constructor.
     * 
     * @param pDevice - Device of render target.
     * @param pTarget - Render target configuration object.
     * @param pChangeCallback - Change callback.
     */
    public constructor(pDevice: GpuDevice, pTarget: RenderTargetsColorTarget, pChangeCallback: (() => void)) {
        this.mDevice = pDevice;
        this.mChangeCallback = pChangeCallback;
        this.mColorTarget = pTarget;
    }

    /**
     * Create new color render target.
     */
    public new(pUsage: TextureUsage, pDimension: TextureDimension, pFormat: TextureFormat): void {
        const lMemoryLayout: TextureMemoryLayout = new TextureMemoryLayout({
            name: this.mColorTarget.name,
            usage: TextureUsage.RenderAttachment | pUsage,
            dimension: pDimension,
            format: pFormat, // TODO: Validate with format validator.
            bindType: TextureBindType.RenderTarget,
            multisampled: false // Should be set in render target generation.
        });

        this.mColorTarget.texture = {
            target: new FrameBufferTexture(this.mDevice, lMemoryLayout)
        };

        // Callback changes.
        this.mChangeCallback();
    }

    /**
     * Use a existing texture.
     * 
     * @param pTexture - Existing texture.
     */
    public use(pTexture: FrameBufferTexture): void {
        this.mColorTarget.texture = {
            target: pTexture
        };

        // Callback changes.
        this.mChangeCallback();
    }
}