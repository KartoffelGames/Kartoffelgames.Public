import { WebGpuDevice } from '../web-gpu-device';
import { GpuNativeObject } from '../gpu-native-object';

export class WebGpuTextureSampler extends GpuNativeObject<GPUSampler>{
    private readonly mCompare: GPUCompareFunction | null;
    private readonly mFitMode: GPUAddressMode;
    private readonly mLodMaxClamp: number;
    private readonly mLodMinClamp: number;
    private readonly mMagFilter: GPUFilterMode;
    private readonly mMaxAnisotropy: number;
    private readonly mMinFilter: GPUFilterMode;
    private readonly mMipmapFilter: GPUMipmapFilterMode;

    /**
     * When provided the sampler will be a comparison sampler with the specified compare function.
     */
    public get compareFunction(): GPUCompareFunction | null {
        return this.mCompare;
    }

    /**
     * Texture sampler edge fit mode.
     */
    public get fitMode(): GPUAddressMode {
        return this.mFitMode;
    }

    /**
     * Specifies the maximum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMaxClamp(): number {
        return this.mLodMaxClamp;
    }

    /**
     * Specifies the minimum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMinClamp(): number {
        return this.mLodMinClamp;
    }

    /**
     * How the texture is sampled when a texel covers more than one pixel.
     */
    public get magFilter(): GPUFilterMode {
        return this.mMagFilter;
    }

    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     */
    public get maxAnisotropy(): number {
        return this.mMaxAnisotropy;
    }

    /**
     * How the texture is sampled when a texel covers less than one pixel.
     */
    public get minFilter(): GPUFilterMode {
        return this.mMinFilter;
    }

    /**
     * Specifies behavior for sampling between mipmap levels.
     */
    public get mipmapFilter(): GPUMipmapFilterMode {
        return this.mMipmapFilter;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: WebGpuDevice, pSettings: WebGpuTextureSamplerSettings) {
        super(pGpu, 'TEXTURE_SAMPLER');

        // Set defaults.
        this.mCompare = pSettings.compare ?? null;
        this.mFitMode = pSettings.fitMode ?? 'clamp-to-edge';
        this.mMagFilter = pSettings.magFilter ?? 'nearest';
        this.mMinFilter = pSettings.minFilter ?? 'nearest';
        this.mMipmapFilter = pSettings.mipmapFilter ?? 'nearest';
        this.mLodMinClamp = pSettings.lodMinClamp ?? 0;
        this.mLodMaxClamp = pSettings.lodMaxClamp ?? 32;
        this.mMaxAnisotropy = pSettings.maxAnisotropy ?? 1;
    }

    /**
     * Generate txture sampler.
     */
    protected generate(): GPUSampler {
        const lSamplerOptions: GPUSamplerDescriptor = {
            label: this.label,
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

        if (this.compareFunction) {
            lSamplerOptions.compare = this.compareFunction;
        }

        return this.gpu.device.createSampler(lSamplerOptions);
    }
}

type WebGpuTextureSamplerSettings = {
    compare?: GPUCompareFunction | undefined;
    fitMode?: GPUAddressMode;
    magFilter?: GPUFilterMode;
    minFilter?: GPUFilterMode;
    mipmapFilter?: GPUMipmapFilterMode;
    lodMinClamp?: number;
    lodMaxClamp?: number;
    maxAnisotropy?: number;
};