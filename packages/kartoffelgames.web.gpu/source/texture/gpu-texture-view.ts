import { TextureUsage } from '../constant/texture-usage.enum';
import { TextureViewDimension } from '../constant/texture-view-dimension.enum';
import { GpuDevice } from '../device/gpu-device';
import { GpuResourceObject, GpuResourceObjectInvalidationType } from '../gpu_object/gpu-resource-object';
import { IGpuObjectNative } from '../gpu_object/interface/i-gpu-object-native';
import { GpuTexture } from './gpu-texture';
import { TextureViewMemoryLayout } from './memory_layout/texture-view-memory-layout';

/**
 * View to a gpu texture.
 */
export class GpuTextureView extends GpuResourceObject<TextureUsage, GPUTextureView> implements IGpuObjectNative<GPUTextureView> {
    private mArrayLayerEnd: number;
    private mArrayLayerStart: number;
    private readonly mLayout: TextureViewMemoryLayout;
    private mMipLevelEnd: number;
    private mMipLevelStart: number;
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
     * Texture layout.
     */
    public get layout(): TextureViewMemoryLayout {
        return this.mLayout;
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
     */
    public constructor(pDevice: GpuDevice, pTexture: GpuTexture, pLayout: TextureViewMemoryLayout) {
        super(pDevice);

        // Set statics.
        this.mTexture = pTexture;
        this.mLayout = pLayout;

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
            switch (this.mLayout.dimension) {
                case TextureViewDimension.OneDimension:
                case TextureViewDimension.TwoDimension: {
                    return 1;
                }
                case TextureViewDimension.Cube: {
                    return 6;
                }
                case TextureViewDimension.CubeArray: {
                    return Math.floor(((lArrayLayerEnd - this.mArrayLayerStart) + 1) / 6) * 6;
                }
                case TextureViewDimension.TwoDimensionArray:
                case TextureViewDimension.ThreeDimension: {
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
            format: this.mLayout.format as GPUTextureFormat,
            dimension: this.mLayout.dimension,

            // Mip start and end.
            baseMipLevel: this.mMipLevelStart,
            mipLevelCount: (lMipLevelEnd - this.mMipLevelStart) + 1,

            // Array layer start and end.
            baseArrayLayer: this.mArrayLayerStart,
            arrayLayerCount: lDimensionViewDepthCount
        });
    }
}