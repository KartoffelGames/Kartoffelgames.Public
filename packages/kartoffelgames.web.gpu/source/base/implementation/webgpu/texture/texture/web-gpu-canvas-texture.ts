import { Exception } from '@kartoffelgames/core.data';
import { FrameBufferTexture } from '../../../../base/texture/frame-buffer-texture';
import { MemoryType } from '../../../../constant/memory-type.enum';
import { TextureFormat } from '../../../../constant/texture-format.enum';
import { TextureUsage } from '../../../../constant/texture-usage.enum';
import { WebGpuTextureMemoryLayout } from '../../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuCanvasTexture extends FrameBufferTexture<WebGpuTypes, GPUTexture> {
    private readonly mCanvas: HTMLCanvasElement;
    private readonly mContext: GPUCanvasContext;

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pCanvas - Canvas of texture.
     * @param pLayout - Texture layout.
     * @param pDepth - Depth of texture. Can only be set to one.
     */
    public constructor(pDevice: WebGpuDevice, pCanvas: HTMLCanvasElement, pLayout: WebGpuTextureMemoryLayout, pDepth: number) {
        super(pDevice, pLayout, pDepth);

        // Restrict canvas to single layer.
        if (pDepth !== 1) {
            throw new Exception('Canvas texture cant have multiple depth layer.', this);
        }

        this.mCanvas = pCanvas;

        // Get and configure context.
        this.mContext = <GPUCanvasContext><any>pCanvas.getContext('webgpu')!;
        this.mContext.configure({
            device: this.device.device,
            format: this.formatFromLayout(pLayout),
            usage: this.usageFromLayout(pLayout),
            alphaMode: 'opaque'
        });
    }

    /**
     * Destory texture object.
     * @param pNativeObject - Native canvas texture.
     */
    protected override destroyNative(pNativeObject: GPUTexture): void {
        pNativeObject.destroy();
    }

    /**
     * Generate native web gpu canvas texture.
     */
    protected override generate(): GPUTexture {
        // Update size.
        if (this.mCanvas.width !== this.width || this.mCanvas.height !== this.height) {
            this.mCanvas.width = this.width;
            this.mCanvas.height = this.height;
        }

        return this.mContext.getCurrentTexture();
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