import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { ITexture } from './i-texture.interface';

export class TextureView extends GpuNativeObject<GPUTextureView>{
    private mAspect: GPUTextureAspect;
    private readonly mBaseLayer: GPUIntegerCoordinate;
    private mBaseMipLevel: GPUIntegerCoordinate;
    private mDimension: GPUTextureViewDimension;
    private mLastTexture: GPUTexture | null;
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
        this.mBaseMipLevel = pLevel;
        this.mUpdateRequested = true;
    }

    /**
     * The dimension to view the texture as.
     */
    public get dimension(): GPUTextureViewDimension {
        return this.mDimension;
    } set dimension(pDimension: GPUTextureViewDimension) {
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
        super(pGpu);
        this.mLastTexture = null;
        this.mUpdateRequested = false;

        this.mTexture = pTexture;
        this.mBaseLayer = pBaseLayer ?? 0;
        this.mLayerCount = pLayerCount ?? this.mTexture.layer;

        // Set default values.
        this.mDimension = '2d';
        this.mAspect = 'all';
        this.mBaseMipLevel = 0;
        this.mMipLevelCount = 0;
    }

    /**
     * Destroy native view object.
     * @param _pNativeObject - Native view object.
     */
    protected async destroyNative(_pNativeObject: GPUTextureView): Promise<void> {
        // No action needed.
    }

    /**
     * Generate new texture view.
     */
    protected async generate(): Promise<GPUTextureView> {
        const lTexture: GPUTexture = await this.mTexture.native();

        // Update flags.
        this.mLastTexture = lTexture;
        this.mUpdateRequested = false;

        return lTexture.createView({
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
        // Invalidate on Texture change.
        if (this.mLastTexture !== await this.mTexture.native()) {
            return false;
        }

        return !this.mUpdateRequested;
    }
}
