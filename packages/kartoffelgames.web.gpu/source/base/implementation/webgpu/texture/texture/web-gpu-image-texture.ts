import { ImageTexture } from '../../../../base/texture/image-texture';
import { MemoryType } from '../../../../constant/memory-type.enum';
import { TextureFormat } from '../../../../constant/texture-format.enum';
import { TextureUsage } from '../../../../constant/texture-usage.enum';
import { WebGpuTextureMemoryLayout } from '../../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuImageTexture extends ImageTexture<WebGpuTypes, GPUTexture> {
    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture layout.
     */
    public constructor(pDevice: WebGpuDevice, pLayout: WebGpuTextureMemoryLayout) {
        super(pDevice, pLayout);
    }

    /**
     * Destroy native image texture.
     * @param pNativeObject - Native image texture.
     */
    protected override destroyNative(pNativeObject: GPUTexture): void {
        pNativeObject.destroy();
    }

    /**
     * Generate native gpu object.
     */
    protected override generate(): GPUTexture {
        // "Calculate" texture dimension from texture size. 
        let lDimension: GPUTextureDimension;
        if (this.width === 1 || this.height === 1) {
            lDimension = '1d';
        } else if (this.depth > 1) {
            lDimension = '3d';
        } else {
            lDimension = '2d';
        }

        // Create texture with set size, format and usage.
        const lTexture: GPUTexture = this.device.device.createTexture({
            label: 'Frame-Buffer-Texture',
            size: [this.width, this.height, this.depth],
            format: this.formatFromLayout(this.memoryLayout),
            usage: this.usageFromLayout(this.memoryLayout),
            dimension: lDimension
        });

        // Load images into texture.
        for (let lImageIndex: number = 0; lImageIndex < this.images.length; lImageIndex++) {
            const lBitmap: ImageBitmap = this.images[lImageIndex];

            // Copy image into depth layer.
            this.device.device.queue.copyExternalImageToTexture(
                { source: lBitmap },
                { texture: this.native, origin: [0, 0, lImageIndex] },
                [lBitmap.width, lBitmap.height]
            );
        }

        return lTexture;
    }

    /**
     * Format from layout.
     * @param pLayout - Texture layout.
     */
    private formatFromLayout(pLayout: WebGpuTextureMemoryLayout): GPUTextureFormat {
        // Convert base to web gpu texture format.
        let lFormat: GPUTextureFormat;
        switch (pLayout.format) {
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

    /**
     * Usage from layout.
     * @param pLayout - Texture layout.
     */
    private usageFromLayout(pLayout: WebGpuTextureMemoryLayout): number {
        // Parse base to web gpu usage.
        let lUsage: number = 0;
        if ((pLayout.memoryType & MemoryType.CopyDestination) !== 0) {
            lUsage |= GPUTextureUsage.COPY_DST;
        }
        if ((pLayout.memoryType & MemoryType.CopySource) !== 0) {
            lUsage |= GPUTextureUsage.COPY_SRC;
        }
        if ((pLayout.usage & TextureUsage.RenderAttachment) !== 0) {
            lUsage |= GPUTextureUsage.RENDER_ATTACHMENT;
        }
        if ((pLayout.usage & TextureUsage.StorageBinding) !== 0) {
            lUsage |= GPUTextureUsage.STORAGE_BINDING;
        }
        if ((pLayout.usage & TextureUsage.TextureBinding) !== 0) {
            lUsage |= GPUTextureUsage.TEXTURE_BINDING;
        }

        return lUsage;
    }

}