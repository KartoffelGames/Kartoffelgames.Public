import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { TextureMemoryLayout } from '../../memory_layout/texture/texture-memory-layout';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { RenderTargetsDepthStencilTexture } from './render-targets';

export class RenderTargetDepthStencilSetup {
    private readonly mChangeCallback: () => void;
    private readonly mDepthStencilTarget: RenderTargetsDepthStencilTexture;
    private readonly mDevice: GpuDevice;

    /**
     * Constructor.
     * 
     * @param pDevice - Device of render target.
     * @param pTarget - Render target configuration object.
     * @param pChangeCallback - Change callback.
     */
    public constructor(pDevice: GpuDevice, pTarget: RenderTargetsDepthStencilTexture, pChangeCallback: (() => void)) {
        this.mDevice = pDevice;
        this.mChangeCallback = pChangeCallback;
        this.mDepthStencilTarget = pTarget;
    }

    /**
     * Create new depth and or stencil render target.
     */
    public new(pUsage: TextureUsage, pFormat: TextureFormat): void {
        const lMemoryLayout: TextureMemoryLayout = new TextureMemoryLayout({
            name: 'DepthStencil-Target',
            usage: TextureUsage.RenderAttachment | pUsage,
            dimension: TextureDimension.TwoDimension,
            format: pFormat, // TODO: Validate with format validator. Allow only depth or and stencil formats.
            bindType: TextureBindType.RenderTarget,
            multisampled: false // Should be set in render target generation.
        });

        this.mDepthStencilTarget.target = new FrameBufferTexture(this.mDevice, lMemoryLayout);

        // Callback changes.
        this.mChangeCallback();
    }

    /**
     * Use a existing texture.
     * 
     * @param pTexture - Existing texture.
     */
    public use(pTexture: FrameBufferTexture): void {
        this.mDepthStencilTarget.target = pTexture;

        // Callback changes.
        this.mChangeCallback();
    }
}