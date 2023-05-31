import { WebGpuTexture } from '../../../abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture';
import { WebGpuTextureUsage } from '../../../abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture-usage.enum';
import { Base } from '../../base/export.';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { GpuDevice } from '../gpu-device';

export class Texture extends Base.Texture<GpuDevice, WebGpuTexture>{
    /**
     * Constructor.
     * @param pGpu - Device.
     * @param pFormat - Texture format.
     * @param pDepth - Texture depth.
     */
    public constructor(pGpu: GpuDevice, pFormat: TextureFormat, pUsage: TextureUsage, pDepth: number = 1) {
        super(pGpu, pFormat, pUsage, pDepth);
    }

    /**
     * Destory web gpu native gpu object.
     * @param pNativeObject - Native object. 
     */
    protected override destroyNative(pNativeObject: WebGpuTexture): void {
        pNativeObject.destroy();
    }

    /**
     * Generate native texture.
     */
    protected override generate(): WebGpuTexture {
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

        // "Calculate" texture dimension from texture size. 
        let lDimension: GPUTextureDimension;
        if (this.width === 1 || this.height === 1) {
            lDimension = '1d';
        } else if (this.depth > 1) {
            lDimension = '3d';
        } else {
            lDimension = '2d';
        }

        return new WebGpuTexture(this.device.native, {
            format: lFormat,
            usage: lUsage,
            dimension: lDimension,
            multiSampleLevel: this.multiSampleLevel,
            layerCount: this.depth,
            height: this.height,
            width: this.width
        });
    }

}