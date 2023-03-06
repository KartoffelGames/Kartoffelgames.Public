import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';

export class TextureSampler extends GpuNativeObject<GPUSampler>{
    private mCompare: GPUCompareFunction | null;
    private mFitMode: GPUAddressMode;
    private mLodMaxClamp: number;
    private mLodMinClamp: number;
    private mMagFilter: GPUFilterMode;
    private mMaxAnisotropy: number;
    private mMinFilter: GPUFilterMode;
    private mMipmapFilter: GPUMipmapFilterMode;
    private mUpdateRequested: boolean;

    /**
     * When provided the sampler will be a comparison sampler with the specified compare function.
     */
    public get compare(): GPUCompareFunction | null {
        return this.mCompare;
    } set compare(pValue: GPUCompareFunction | null) {
        this.mCompare = pValue;

        // Request native rebuild.
        this.mUpdateRequested = true;
    }

    /**
     * Texture sampler edge fit mode.
     */
    public get fitMode(): GPUAddressMode {
        return this.mFitMode;
    } set fitMode(pValue: GPUAddressMode) {
        this.mFitMode = pValue;

        // Request native rebuild.
        this.mUpdateRequested = true;
    }

    /**
     * Specifies the maximum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMaxClamp(): number {
        return this.mLodMaxClamp;
    } set lodMaxClamp(pValue: number) {
        this.mLodMaxClamp = pValue;
        
        // Request native rebuild.
        this.mUpdateRequested = true;
    }

    /**
     * Specifies the minimum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMinClamp(): number {
        return this.mLodMinClamp;
    } set lodMinClamp(pValue: number) {
        this.mLodMinClamp = pValue;
        
        // Request native rebuild.
        this.mUpdateRequested = true;
    }

    /**
     * How the texture is sampled when a texel covers more than one pixel.
     */
    public get magFilter(): GPUFilterMode {
        return this.mMagFilter;
    } set magFilter(pValue: GPUFilterMode) {
        this.mMagFilter = pValue;
        
        // Request native rebuild.
        this.mUpdateRequested = true;
    }

    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     */
    public get maxAnisotropy(): number {
        return this.mMaxAnisotropy;
    } set maxAnisotropy(pValue: number) {
        this.mMaxAnisotropy = pValue;
        
        // Request native rebuild.
        this.mUpdateRequested = true;
    }

    /**
     * How the texture is sampled when a texel covers less than one pixel.
     */
    public get minFilter(): GPUFilterMode {
        return this.mMinFilter;
    } set minFilter(pValue: GPUFilterMode) {
        this.mMinFilter = pValue;
        
        // Request native rebuild.
        this.mUpdateRequested = true;
    }

    /**
     * Specifies behavior for sampling between mipmap levels.
     */
    public get mipmapFilter(): GPUMipmapFilterMode {
        return this.mMipmapFilter;
    } set mipmapFilter(pValue: GPUMipmapFilterMode) {
        this.mMipmapFilter = pValue;
        
        // Request native rebuild.
        this.mUpdateRequested = true;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu) {
        super(pGpu);

        this.mUpdateRequested = false;

        // Set defaults.
        this.mCompare = null;
        this.mFitMode = 'clamp-to-edge';
        this.mMagFilter = 'nearest';
        this.mMinFilter = 'nearest';
        this.mMipmapFilter = 'nearest';
        this.mLodMinClamp = 0;
        this.mLodMaxClamp = 32;
        this.mMaxAnisotropy = 1;
    }

    /**
     * Destroy texture sampler.
     * @param _pNativeObject - Native object. 
     */
    protected async destroyNative(_pNativeObject: GPUSampler): Promise<void> {
        // No action needed.
    }

    /**
     * Generate txture sampler.
     */
    protected async generate(): Promise<GPUSampler> {
        const lSamplerOptions: GPUSamplerDescriptor = {
            addressModeU: this.mFitMode,
            addressModeV: this.mFitMode,
            addressModeW: this.mFitMode,
            magFilter: this.magFilter,
            minFilter: this.minFilter,
            mipmapFilter: this.mipmapFilter,
            lodMaxClamp: this.lodMaxClamp,
            lodMinClamp: this.lodMinClamp,
            maxAnisotropy: this.mMaxAnisotropy
        };

        if (this.compare) {
            lSamplerOptions.compare = this.compare;
        }

        return this.gpu.device.createSampler(lSamplerOptions);
    }

    /**
     * Invalidate generated object when proeprties has changed.
     */
    protected override async validateState(): Promise<boolean> {
        return !this.mUpdateRequested;
    }
}