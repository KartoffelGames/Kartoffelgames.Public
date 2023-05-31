import { WebGpuCanvasTexture } from '../../../../abstraction_layer/webgpu/texture_resource/texture/web-gpu-canvas-texture';
import { WebGpuTextureUsage } from '../../../../abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture-usage.enum';
import { Base } from '../../../base/export.';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { GpuDevice } from '../../gpu-device';

export class CanvasTexture extends Base.Texture<GpuDevice, WebGpuCanvasTexture> {
    private readonly mCanvas: HTMLCanvasElement;

    public constructor(pDevice: GpuDevice, pCanvas: HTMLCanvasElement, pUsage: TextureUsage) {
        // Find preffered texture format.
        let lPreferedFormat: TextureFormat;
        switch (pDevice.native.preferredFormat) {
            case 'rgba8unorm': {
                lPreferedFormat = TextureFormat.RedGreenBlueAlpha;
                break;
            }
            case 'bgra8unorm': {
                lPreferedFormat = TextureFormat.BlueRedGreenAlpha;
                break;
            }
            default: {
                lPreferedFormat = TextureFormat.RedGreenBlueAlpha;
            }
        }

        super(pDevice, lPreferedFormat, pUsage, 1);
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

        // Parse base to web gpu usage.
        let lUsage: WebGpuTextureUsage = 0;
        if ((this.usage & TextureUsage.CopyDestination) !== 0) {
            lUsage |= WebGpuTextureUsage.CopyDestination;
        }
        if ((this.usage & TextureUsage.CopySource) !== 0) {
            lUsage |= WebGpuTextureUsage.CopySource;
        }
        if ((this.usage & TextureUsage.RenderAttachment) !== 0) {
            lUsage |= WebGpuTextureUsage.RenderAttachment;
        }
        if ((this.usage & TextureUsage.StorageBinding) !== 0) {
            lUsage |= WebGpuTextureUsage.StorageBinding;
        }
        if ((this.usage & TextureUsage.TextureBinding) !== 0) {
            lUsage |= WebGpuTextureUsage.TextureBinding;
        }


        return new WebGpuCanvasTexture(this.device.native, this.mCanvas, lFormat, lUsage);
    }
}