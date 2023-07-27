import { TextureMemoryLayout, TextureMemoryLayoutParameter } from '../../../base/memory_layout/texture-memory-layout';
import { MemoryCopyType } from '../../../constant/memory-copy-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
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
     * GPU Dimension from layout texture dimension.
     */
    public dimensionFromLayout(): GPUTextureDimension {
        // "Calculate" texture dimension from texture size.
        switch (this.dimension) {
            case TextureDimension.OneDimension: {
                return '1d';
            }

            case TextureDimension.TwoDimension: {
                return '2d';
            }

            case TextureDimension.Cube:
            case TextureDimension.CubeArray:
            case TextureDimension.ThreeDimension:
            case TextureDimension.TwoDimensionArray: {
                return '3d';
            }
        }
    }

    /**
     * Format from layout.
     */
    public formatFromLayout(): GPUTextureFormat {
        // Convert base to web gpu texture format.
        switch (this.format) {
            case TextureFormat.BlueRedGreenAlpha: {
                return 'bgra8unorm';
            }
            case TextureFormat.Depth: {
                return 'depth24plus';
            }
            case TextureFormat.DepthStencil: {
                return 'depth24plus-stencil8';
            }
            case TextureFormat.Red: {
                return 'r8unorm';
            }
            case TextureFormat.RedGreen: {
                return 'rg8unorm';
            }
            case TextureFormat.RedGreenBlueAlpha: {
                return 'rgba8unorm';
            }
            case TextureFormat.RedGreenBlueAlphaInteger: {
                return 'rgba8uint';
            }
            case TextureFormat.RedGreenInteger: {
                return 'rg8uint';
            }
            case TextureFormat.RedInteger: {
                return 'r8uint';
            }
            case TextureFormat.Stencil: {
                return 'stencil8';
            }
        }
    }

    public sampleTypeFromLayout(): GPUTextureSampleType {
        // Convert texture format to sampler values.
        switch (this.format) {
            case TextureFormat.Depth:
            case TextureFormat.DepthStencil: {
                return 'depth';
            }

            case TextureFormat.Stencil:
            case TextureFormat.BlueRedGreenAlpha:
            case TextureFormat.Red:
            case TextureFormat.RedGreen:
            case TextureFormat.RedGreenBlueAlpha: {
                return 'float';
            }

            case TextureFormat.RedGreenBlueAlphaInteger:
            case TextureFormat.RedGreenInteger:
            case TextureFormat.RedInteger: {
                return 'uint';
            }
        }
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