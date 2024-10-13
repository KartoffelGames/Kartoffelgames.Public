import { Exception } from '@kartoffelgames/core';
import { CompareFunction } from '../../constant/compare-function.enum';
import { FilterMode } from '../../constant/filter-mode.enum';
import { SamplerType } from '../../constant/sampler-type.enum';
import { WrappingMode } from '../../constant/wrapping-mode.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { SamplerMemoryLayout } from '../memory_layout/texture/sampler-memory-layout';

export class TextureSampler extends GpuObject<GPUSampler, TextureSamplerInvalidationType> implements IGpuObjectNative<GPUSampler> {
    private mCompare: CompareFunction | null;
    private mLodMaxClamp: number;
    private mLodMinClamp: number;
    private mMagFilter: FilterMode;
    private mMaxAnisotropy: number;
    private readonly mMemoryLayout: SamplerMemoryLayout;
    private mMinFilter: FilterMode;
    private mMipmapFilter: FilterMode;
    private mWrapMode: WrappingMode;

    /**
     * When provided the sampler will be a comparison sampler with the specified compare function.
     */
    public get compare(): CompareFunction | null {
        return this.mCompare;
    } set compare(pValue: CompareFunction | null) {
        this.mCompare = pValue;

        // Invalidate native object.
        this.invalidate(TextureSamplerInvalidationType.NativeRebuild);
    }

    /**
     * Specifies the maximum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMaxClamp(): number {
        return this.mLodMaxClamp;
    } set lodMaxClamp(pValue: number) {
        this.mLodMaxClamp = pValue;

        // Invalidate native object.
        this.invalidate(TextureSamplerInvalidationType.NativeRebuild);
    }

    /**
     * Specifies the minimum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMinClamp(): number {
        return this.mLodMinClamp;
    } set lodMinClamp(pValue: number) {
        this.mLodMinClamp = pValue;

        // Invalidate native object.
        this.invalidate(TextureSamplerInvalidationType.NativeRebuild);
    }

    /**
     * How the texture is sampled when a texel covers more than one pixel.
     */
    public get magFilter(): FilterMode {
        return this.mMagFilter;
    } set magFilter(pValue: FilterMode) {
        this.mMagFilter = pValue;

        // Invalidate native object.
        this.invalidate(TextureSamplerInvalidationType.NativeRebuild);
    }

    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     */
    public get maxAnisotropy(): number {
        return this.mMaxAnisotropy;
    } set maxAnisotropy(pValue: number) {
        this.mMaxAnisotropy = pValue;

        // Invalidate native object.
        this.invalidate(TextureSamplerInvalidationType.NativeRebuild);
    }

    /**
     * Sampler memory layout.
     */
    public get memoryLayout(): SamplerMemoryLayout {
        return this.mMemoryLayout;
    }

    /**
     * How the texture is sampled when a texel covers less than one pixel.
     */
    public get minFilter(): FilterMode {
        return this.mMinFilter;
    } set minFilter(pValue: FilterMode) {
        this.mMinFilter = pValue;

        // Invalidate native object.
        this.invalidate(TextureSamplerInvalidationType.NativeRebuild);
    }

    /**
     * Specifies behavior for sampling between mipmap levels.
     */
    public get mipmapFilter(): FilterMode {
        return this.mMipmapFilter;
    } set mipmapFilter(pValue: FilterMode) {
        this.mMipmapFilter = pValue;

        // Invalidate native object.
        this.invalidate(TextureSamplerInvalidationType.NativeRebuild);
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUSampler {
        return super.native;
    }

    /**
     * Texture sampler edge wrap mode.
     */
    public get wrapMode(): WrappingMode {
        return this.mWrapMode;
    } set wrapMode(pValue: WrappingMode) {
        this.mWrapMode = pValue;

        // Invalidate native object.
        this.invalidate(TextureSamplerInvalidationType.NativeRebuild);
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Sampler memory layout.
     */
    public constructor(pDevice: GpuDevice, pLayout: SamplerMemoryLayout) {
        super(pDevice);

        this.mMemoryLayout = pLayout;

        // Set defaults.
        this.mCompare = null;
        this.mWrapMode = WrappingMode.ClampToEdge;
        this.mMagFilter = FilterMode.Linear;
        this.mMinFilter = FilterMode.Linear;
        this.mMipmapFilter = FilterMode.Linear;
        this.mLodMinClamp = 0;
        this.mLodMaxClamp = 32;
        this.mMaxAnisotropy = 16;

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(TextureSamplerInvalidationType.LayoutChange, TextureSamplerInvalidationType.NativeRebuild);
        });
    }

    /**
     * Generate native bind data group layout object.
     */
    protected override generateNative(): GPUSampler {
        // Create sampler descriptor.
        const lSamplerOptions: GPUSamplerDescriptor = {
            label: 'Texture-Sampler',
            addressModeU: this.wrapMode,
            addressModeV: this.wrapMode,
            addressModeW: this.wrapMode,
            magFilter: this.magFilter,
            minFilter: this.minFilter,
            mipmapFilter: this.mipmapFilter,
            lodMaxClamp: this.lodMaxClamp,
            lodMinClamp: this.lodMinClamp,
            maxAnisotropy: this.maxAnisotropy
        };

        // Add compare function when sampler is a compare sampler.
        if (this.memoryLayout.samplerType === SamplerType.Comparison) {
            if (!this.compare) {
                throw new Exception(`No compare function is set for a comparison sampler.`, this);
            }
            lSamplerOptions.compare = this.compare;
        }

        return this.device.gpu.createSampler(lSamplerOptions);
    }
}

export enum TextureSamplerInvalidationType {
    LayoutChange = 'LayoutChange',
    NativeRebuild = 'NativeRebuild'
}