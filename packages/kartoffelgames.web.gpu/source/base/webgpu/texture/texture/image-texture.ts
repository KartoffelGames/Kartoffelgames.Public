import { WebGpuTexture } from '../../../../abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture';
import { WebGpuTextureUsage } from '../../../../abstraction_layer/webgpu/texture_resource/texture/web-gpu-texture-usage.enum';
import { Base } from '../../../base/export.';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { GpuDevice } from '../../gpu-device';

export class ImageTexture extends Base.ImageTexture<GpuDevice, WebGpuTexture> {
    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pFormat - Texture format.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: GpuDevice, pFormat: TextureFormat, pUsage: TextureUsage) {
        super(pDevice, pFormat, pUsage);
    }

    /**
     * Destroy native image texture.
     * @param pNativeObject - Native image texture.
     */
    protected override destroyNative(pNativeObject: WebGpuTexture): void {
        pNativeObject.destroy();
    }

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

        const lNativeTexture: WebGpuTexture = new WebGpuTexture(this.device.native, {
            format: lFormat,
            usage: lUsage,
            dimension: lDimension,
            multiSampleLevel: 1,
            layerCount: this.depth,
            height: this.height,
            width: this.width
        });

        // Load images into texture.
        for (let lImageIndex: number = 0; lImageIndex < this.images.length; lImageIndex++) {
            lNativeTexture.loadImage(this.images[lImageIndex], lImageIndex);
        }

        return lNativeTexture;
    }

}