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
    private mUpdateRequested: boolean;

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
        this.mUpdateRequested = true;
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
        this.mUpdateRequested = true;
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
        this.mUpdateRequested = true;
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
        this.mUpdateRequested = true;
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
        this.mUpdateRequested = false;

        this.mTexture = pTexture;
        this.mBaseLayer = pBaseLayer ?? 0;
        this.mLayerCount = pLayerCount ?? this.mTexture.layer;

        // Set default values.
        this.mDimension = '2d';
        this.mAspect = 'all';
        this.mBaseMipLevel = 0;
        this.mMipLevelCount = 0;

        // Register texture as internal.
        this.registerInternalNative(pTexture);
    }

    /**
     * Generate new texture view.
     */
    protected async generate(): Promise<GPUTextureView> {
        // Update flags.
        this.mUpdateRequested = false;

        const lTexture: GPUTexture = await this.mTexture.native();
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

    /**
     * Invalidate generated object when proeprties has changed.
     */
    protected override async validateState(): Promise<boolean> {
        return !this.mUpdateRequested;
    }
}
