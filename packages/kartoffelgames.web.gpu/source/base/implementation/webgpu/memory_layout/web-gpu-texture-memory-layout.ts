import { TextureMemoryLayout, TextureMemoryLayoutParameter } from '../../../base/memory_layout/texture-memory-layout';
import { MemoryCopyType } from '../../../constant/memory-copy-type.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { WebGpuCanvasTexture } from '../texture/texture/web-gpu-canvas-texture';
import { WebGpuFrameBufferTexture } from '../texture/texture/web-gpu-frame-buffer-texture';
import { WebGpuImageTexture } from '../texture/texture/web-gpu-image-texture';
import { WebGpuVideoTexture } from '../texture/texture/web-gpu-video-texture';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';

export class WebGpuTextureMemoryLayout extends TextureMemoryLayout<WebGpuTypes> {
    /**
     * Constructor.
     * @param pDevice - Device reference..
     * @param pParameter - Creation parameter.
     */
    public constructor(pDevice: WebGpuDevice, pParameter: TextureMemoryLayoutParameter) {
        super(pDevice, pParameter);
    }

    /**
     * Format from layout.
     */
    public formatFromLayout(): GPUTextureFormat {
        // Convert base to web gpu texture format.
        let lFormat: GPUTextureFormat;
        switch (this.format) {
            case TextureFormat.BlueRedGreenAlpha: {
                lFormat = 'bgra8unorm';
                break;
            }
            case TextureFormat.Depth: {
                lFormat = 'depth24plus';
                break;
            }
            case TextureFormat.DepthStencil: {
                lFormat = 'depth24plus-stencil8';
                break;
            }
            case TextureFormat.Red: {
                lFormat = 'r8unorm';
                break;
            }
            case TextureFormat.RedGreen: {
                lFormat = 'rg8unorm';
                break;
            }
            case TextureFormat.RedGreenBlueAlpha: {
                lFormat = 'rgba8unorm';
                break;
            }
            case TextureFormat.RedGreenBlueAlphaInteger: {
                lFormat = 'rgba8uint';
                break;
            }
            case TextureFormat.RedGreenInteger: {
                lFormat = 'rg8uint';
                break;
            }
            case TextureFormat.RedInteger: {
                lFormat = 'r8uint';
                break;
            }
            case TextureFormat.Stencil: {
                lFormat = 'stencil8';
                break;
            }
        }

        return lFormat;
    }

    public sampleTypeFromLayout(): GPUTextureSampleType {
        // TODO: Read values from formats...
    }

    /**
     * Usage from layout.
     */
    public usageFromLayout(): number {
        // Parse base to web gpu usage.
        let lUsage: number = 0;
        if ((this.memoryType & MemoryCopyType.CopyDestination) !== 0) {
            lUsage |= GPUTextureUsage.COPY_DST;
        }
        if ((this.memoryType & MemoryCopyType.CopySource) !== 0) {
            lUsage |= GPUTextureUsage.COPY_SRC;
        }
        if ((this.usage & TextureUsage.RenderAttachment) !== 0) {
            lUsage |= GPUTextureUsage.RENDER_ATTACHMENT;
        }
        if ((this.usage & TextureUsage.StorageBinding) !== 0) {
            lUsage |= GPUTextureUsage.STORAGE_BINDING;
        }
        if ((this.usage & TextureUsage.TextureBinding) !== 0) {
            lUsage |= GPUTextureUsage.TEXTURE_BINDING;
        }

        return lUsage;
    }

    /**
     * Create canvas frame buffer.
     * @param pCanvas - Canvas element.
     */
    protected override createCanvasFrameBuffer(pCanvas: HTMLCanvasElement): WebGpuCanvasTexture {
        return new WebGpuCanvasTexture(this.device, pCanvas, this, 1);
    }

    /**
     * Create image texture from sources.
     * Sources need to have the same dimensions to be loaded into one texture.
     * Every source gets loaded into own layer.
     * @param pSourceList - Image source list.
     */
    protected override async createImageFromSource(...pSourceList: Array<string>): Promise<WebGpuImageTexture> {
        const lTexture: WebGpuImageTexture = new WebGpuImageTexture(this.device, this);
        await lTexture.load(...pSourceList);

        return lTexture;
    }

    /**
     * Create sized frame buffer from this layout.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height
     * @param pDepth - Texture depth.
     */
    protected override createSizedFrameBuffer(pWidth: number, pHeight: number, pDepth: number): WebGpuFrameBufferTexture {
        const lTexture: WebGpuFrameBufferTexture = new WebGpuFrameBufferTexture(this.device, this, pDepth);
        lTexture.height = pHeight;
        lTexture.width = pWidth;

        return lTexture;
    }

    /**
     * Create texture from video source.
     * @param pSource - Video source.
     */
    protected override async createVideoTexture(pSource: string): Promise<WebGpuVideoTexture> {
        const lTexture: WebGpuVideoTexture = new WebGpuVideoTexture(this.device, this);
        lTexture.source = pSource;

        return lTexture;
    }
}