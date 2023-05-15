import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { ITexture } from './i-texture.interface';

export class TextureView extends GpuNativeObject<GPUTextureView>{
    private mAspect: GPUTextureAspect;
    private readonly mBaseLayer: GPUIntegerCoordinate;
    private mBaseMipLevel: GPUIntegerCoordinate;
    private mDimension: GPUTextureViewDimension;
    private readonly mLayerCount: GPUIntegerCoordinate;
    private mMipLevelCount: GPUIntegerCoordinate;
    private readonly mTexture: ITexture;

    /**
     * Which aspecs of the texture are accessible to the texture view.
     */
    public get aspect(): GPUTextureAspect {
        return this.mAspect;
    } set aspect(pAspect: GPUTextureAspect) {
        // Do nothing on assigning old an value.
        if(this.mAspect === pAspect){
            return;
        }

        this.mAspect = pAspect;
        
        // Trigger update.
        this.triggerChange();
    }

    /**
     * The index of the first array layer accessible to the texture view.
     */
    public get baseLayer(): GPUIntegerCoordinate {
        return this.mBaseLayer;
    }

    /**
     * The first (most detailed) mipmap level accessible to the texture view.
     */
    public get baseMipLevel(): GPUIntegerCoordinate {
        return this.mBaseMipLevel;
    } set baseMipLevel(pLevel: GPUIntegerCoordinate) {
        // Do nothing on assigning old an value.
        if(this.mBaseMipLevel === pLevel){
            return;
        }

        this.mBaseMipLevel = pLevel;
        
        // Trigger update.
        this.triggerChange();
    }

    /**
     * The dimension to view the texture as.
     */
    public get dimension(): GPUTextureViewDimension {
        return this.mDimension;
    } set dimension(pDimension: GPUTextureViewDimension) {
        // Do nothing on assigning old an value.
        if(this.mDimension === pDimension){
            return;
        }

        this.mDimension = pDimension;
        
        // Trigger update.
        this.triggerChange();
    }

    /**
     * How many array layers, starting with {@link TextureView#baseLayer}, are accessible
     * to the texture view.
     */
    public get layerCount(): GPUIntegerCoordinate {
        return this.mBaseLayer;
    }

    /**
     * How many mipmap levels, starting with {@link TextureView#baseMipLevel}, are accessible to
     * the texture view.
     */
    public get mipLevelCount(): GPUIntegerCoordinate {
        return this.mMipLevelCount;
    } set mipLevelCount(pLevel: GPUIntegerCoordinate) {
        // Do nothing on assigning old an value.
        if(this.mMipLevelCount === pLevel){
            return;
        }

        this.mMipLevelCount = pLevel;
        
        // Trigger update.
        this.triggerChange();
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pTexture - Texture of view.
     * @param pBaseLayer - Base layer of view.
     * @param pLayerCount - Depth of view.
     */
    public constructor(pGpu: Gpu, pTexture: ITexture, pBaseLayer?: number, pLayerCount?: number) {
        super(pGpu, 'TEXTURE_VIEW');

        this.mTexture = pTexture;
        this.mBaseLayer = pBaseLayer ?? 0;
        this.mLayerCount = pLayerCount ?? this.mTexture.layer;

        // Set default values.
        this.mDimension = '2d';
        this.mAspect = 'all';
        this.mBaseMipLevel = 0;
        this.mMipLevelCount = 1;

        // Register texture as internal.
        this.registerInternalNative(pTexture);
    }

    /**
     * Generate new texture view.
     */
    protected generate(): GPUTextureView {
        const lTexture: GPUTexture = this.mTexture.native();
        return lTexture.createView({
            label: this.label,
            format: this.mTexture.format,
            dimension: this.mDimension,
            aspect: this.mAspect,
            baseMipLevel: this.mBaseMipLevel,
            mipLevelCount: this.mMipLevelCount,
            baseArrayLayer: this.mBaseLayer,
            arrayLayerCount: this.mLayerCount
        });
    }
}
