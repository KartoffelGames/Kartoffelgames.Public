import type { TextureFormat } from '../constant/texture-format.type.ts';
import type { TextureUsage } from '../constant/texture-usage.enum.ts';
import type { TextureViewDimension } from '../constant/texture-view-dimension.ts';
import type { GpuDevice } from '../device/gpu-device.ts';
import { GpuResourceObject, GpuResourceObjectInvalidationType } from '../gpu_object/gpu-resource-object.ts';
import type { IGpuObjectNative } from '../gpu_object/interface/i-gpu-object-native.ts';
import type { GpuTexture } from './gpu-texture.ts';

/**
 * View to a gpu texture.
 */
export class GpuTextureView extends GpuResourceObject<TextureUsage, GPUTextureView> implements IGpuObjectNative<GPUTextureView> {
    private mArrayLayerEnd: number;
    private mArrayLayerStart: number;
    private readonly mDimension: TextureViewDimension;
    private readonly mFormat: TextureFormat;
    private mMipLevelEnd: number;
    private mMipLevelStart: number;
    private readonly mMultisampled: boolean;
    private readonly mTexture: GpuTexture;

    /**
     * End index of depth or array level.
     */
    public get arrayLayerEnd(): number {
        return this.mArrayLayerEnd;
    } set arrayLayerEnd(pArrayLayer: number) {
        this.mArrayLayerEnd = pArrayLayer;

        // Invalidate view.
        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    /**
     * Staring index of depth or array level.
     */
    public get arrayLayerStart(): number {
        return this.mArrayLayerStart;
    } set arrayLayerStart(pArrayLayerIndex: number) {
        this.mArrayLayerStart = pArrayLayerIndex;

        // Invalidate view.
        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    /**
     * Texture view dimension.
     */
    public get dimension(): TextureViewDimension {
        return this.mDimension;
    }

    /**
     * Texture format.
     */
    public get format(): TextureFormat {
        return this.mFormat;
    }

    /**
     * End index of mip level.
     */
    public get mipLevelEnd(): number {
        return this.mMipLevelEnd;
    } set mipLevelEnd(pMipLevel: number) {
        this.mMipLevelEnd = pMipLevel;

        // Invalidate view.
        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    /**
     * Staring index of mip level.
     */
    public get mipLevelStart(): number {
        return this.mMipLevelStart;
    } set mipLevelStart(pMipLevel: number) {
        this.mMipLevelStart = pMipLevel;

        // Invalidate view.
        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    /**
     * Texture multi sampled.
     */
    public get multisampled(): boolean {
        return this.mMultisampled;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUTextureView {
        return super.native;
    }

    /**
     * Views texture.
     */
    public get texture(): GpuTexture {
        return this.mTexture;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pTexture - Texture of view.
     * @param pDimension - Texture view dimension.
     * @param pFormat - Texture format.
     * @param pMultisampled - Whether the texture is multisampled.
     */
    public constructor(pDevice: GpuDevice, pTexture: GpuTexture, pDimension: TextureViewDimension, pFormat: TextureFormat, pMultisampled: boolean) {
        super(pDevice);

        // Set statics.
        this.mTexture = pTexture;
        this.mDimension = pDimension;
        this.mFormat = pFormat;
        this.mMultisampled = pMultisampled;

        // Set defaults.
        this.mMipLevelStart = 0;
        this.mMipLevelEnd = -1;
        this.mArrayLayerStart = 0;
        this.mArrayLayerEnd = -1;

        // Trigger View rebuild on texture rebuilds.
        pTexture.addInvalidationListener(() => {
            this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
        }, GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generateNative(): GPUTextureView {
        // Read native texture.
        const lNativeTexture: GPUTexture = this.mTexture.native;

        // When mip end level or array end layer is not set, use textures max. 
        const lMipLevelEnd: number = this.mMipLevelEnd < 0 ? (lNativeTexture.mipLevelCount - 1) : this.mMipLevelEnd;
        const lArrayLayerEnd: number = this.mArrayLayerEnd < 0 ? (lNativeTexture.depthOrArrayLayers - 1) : this.mArrayLayerEnd;

        // Validate dimension based on 
        const lDimensionViewDepthCount: number = (() => {
            switch (this.mDimension) {
                case '1d':
                case '2d': {
                    return 1;
                }
                case 'cube': {
                    return 6;
                }
                case 'cube-array': {
                    return Math.floor(((lArrayLayerEnd - this.mArrayLayerStart) + 1) / 6) * 6;
                }
                case '2d-array':
                case '3d': {
                    return (lArrayLayerEnd - this.mArrayLayerStart) + 1;
                }
                default: {
                    return 1;
                }
            }
        })();

        // Create and configure canvas context.
        return lNativeTexture.createView({
            aspect: 'all',
            format: this.mFormat as GPUTextureFormat,
            dimension: this.mDimension,

            // Mip start and end.
            baseMipLevel: this.mMipLevelStart,
            mipLevelCount: (lMipLevelEnd - this.mMipLevelStart) + 1,

            // Array layer start and end.
            baseArrayLayer: this.mArrayLayerStart,
            arrayLayerCount: lDimensionViewDepthCount
        });
    }
}