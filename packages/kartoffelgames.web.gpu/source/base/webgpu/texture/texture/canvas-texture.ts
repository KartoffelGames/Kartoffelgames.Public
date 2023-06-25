import { Exception } from '@kartoffelgames/core.data';
import { WebGpuCanvasTexture } from '../../../../abstraction_layer/webgpu/texture_resource/texture/web-gpu-canvas-texture';
import { WebGpuTextureUsage } from '../../../../abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture-usage.enum';
import { Base } from '../../../base/export.';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { GpuDevice } from '../../gpu-device';
import { TextureMemoryLayout } from '../../memory_layout/texture-memory-layout';
import { MemoryLayout } from '../../../base/memory_layout/memory-layout';
import { MemoryType } from '../../../constant/memory-type.enum';

export class CanvasTexture extends Base.FrameBufferTexture<GpuDevice, WebGpuCanvasTexture> {
    private readonly mCanvas: HTMLCanvasElement;

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pCanvas - Canvas of texture.
     * @param pLayout - Texture layout.
     * @param pDepth - Depth of texture. Can only be set to one.
     */
    public constructor(pDevice: GpuDevice, pCanvas: HTMLCanvasElement, pLayout: TextureMemoryLayout, pDepth: number) {
        super(pDevice, pLayout, pDepth);

        // Restrict canvas to single layer.
        if (pDepth !== 1) {
            throw new Exception('Canvas texture cant have multiple depth layer.', this);
        }

        this.mCanvas = pCanvas;
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
    protected override generate(): WebGpuCanvasTexture {
        // Update size.
        if (this.mCanvas.width !== this.width || this.mCanvas.height !== this.height) {
            this.mCanvas.width = this.width;
            this.mCanvas.height = this.height;
        }

        // Convert base to web gpu texture format.
        let lFormat: GPUTextureFormat;
        switch (this.memoryLayout.format) {
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

        // Parse base to web gpu usage.
        let lUsage: WebGpuTextureUsage = 0;
        if ((this.memoryLayout.memoryType & MemoryType.CopyDestination) !== 0) {
            lUsage |= WebGpuTextureUsage.CopyDestination;
        }
        if ((this.memoryLayout.memoryType & MemoryType.CopySource) !== 0) {
            lUsage |= WebGpuTextureUsage.CopySource;
        }
        if ((this.memoryLayout.usage & TextureUsage.RenderAttachment) !== 0) {
            lUsage |= WebGpuTextureUsage.RenderAttachment;
        }
        if ((this.memoryLayout.usage & TextureUsage.StorageBinding) !== 0) {
            lUsage |= WebGpuTextureUsage.StorageBinding;
        }
        if ((this.memoryLayout.usage & TextureUsage.TextureBinding) !== 0) {
            lUsage |= WebGpuTextureUsage.TextureBinding;
        }

        return new WebGpuCanvasTexture(this.device.native, this.mCanvas, lFormat, lUsage);
    }
}