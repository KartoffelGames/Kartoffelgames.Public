import { Exception } from '@kartoffelgames/core.data';
import { WebGpuDevice } from '../../web-gpu-device';
import { FrameBufferTexture } from '../../../../base/texture/frame-buffer-texture';
import { TextureMemoryLayout } from '../../../../base/memory_layout/texture-memory-layout';
import { WebGpuTextureUsage } from '../../../../../abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture-usage.enum';
import { MemoryType } from '../../../../constant/memory-type.enum';
import { TextureFormat } from '../../../../constant/texture-format.enum';
import { TextureUsage } from '../../../../constant/texture-usage.enum';

export class WebGpuCanvasTexture extends FrameBufferTexture<WebGpuDevice> {
    private readonly mCanvas: HTMLCanvasElement;
    private readonly mContext: GPUCanvasContext;

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pCanvas - Canvas of texture.
     * @param pLayout - Texture layout.
     * @param pDepth - Depth of texture. Can only be set to one.
     */
    public constructor(pDevice: WebGpuDevice, pCanvas: HTMLCanvasElement, pLayout: TextureMemoryLayout<WebGpuDevice>, pDepth: number) {
        super(pDevice, pLayout, pDepth);

        // Restrict canvas to single layer.
        if (pDepth !== 1) {
            throw new Exception('Canvas texture cant have multiple depth layer.', this);
        }

        this.mCanvas = pCanvas;

        // Get and configure context.
        this.mContext = <GPUCanvasContext><any>pCanvas.getContext('webgpu')!;
        this.mContext.configure({
            device: this.gpu.device,
            format: this.formatFromLayout(pLayout),
            usage: this.usageFromLayout(pLayout),
            alphaMode: 'opaque'
        });
    }

    /**
     * Destory texture object.
     * @param pNativeObject - Native canvas texture.
     */
    protected override destroyNative(pNativeObject: WebGpuCanvasTexture): void {
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
    private formatFromLayout(pLayout: TextureMemoryLayout<WebGpuDevice>): GPUTextureFormat {
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
    private usageFromLayout(pLayout: TextureMemoryLayout<WebGpuDevice>): WebGpuTextureUsage {
        // Parse base to web gpu usage.
        let lUsage: WebGpuTextureUsage = 0;
        if ((pLayout.memoryType & MemoryType.CopyDestination) !== 0) {
            lUsage |= WebGpuTextureUsage.CopyDestination;
        }
        if ((pLayout.memoryType & MemoryType.CopySource) !== 0) {
            lUsage |= WebGpuTextureUsage.CopySource;
        }
        if ((pLayout.usage & TextureUsage.RenderAttachment) !== 0) {
            lUsage |= WebGpuTextureUsage.RenderAttachment;
        }
        if ((pLayout.usage & TextureUsage.StorageBinding) !== 0) {
            lUsage |= WebGpuTextureUsage.StorageBinding;
        }
        if ((pLayout.usage & TextureUsage.TextureBinding) !== 0) {
            lUsage |= WebGpuTextureUsage.TextureBinding;
        }

        return lUsage;
    }
}