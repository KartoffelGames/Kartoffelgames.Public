import { CompareFunction } from '../../constant/compare-function.enum';
import { FilterMode } from '../../constant/filter-mode.enum';
import { WrappingMode } from '../../constant/wrapping-mode.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { SamplerMemoryLayout } from '../memory_layout/sampler-memory-layout';

export class TextureSampler extends GpuObject<'textureSampler'> {
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

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Specifies the maximum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMaxClamp(): number {
        return this.mLodMaxClamp;
    } set lodMaxClamp(pValue: number) {
        this.mLodMaxClamp = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Specifies the minimum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMinClamp(): number {
        return this.mLodMinClamp;
    } set lodMinClamp(pValue: number) {
        this.mLodMinClamp = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * How the texture is sampled when a texel covers more than one pixel.
     */
    public get magFilter(): FilterMode {
        return this.mMagFilter;
    } set magFilter(pValue: FilterMode) {
        this.mMagFilter = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     */
    public get maxAnisotropy(): number {
        return this.mMaxAnisotropy;
    } set maxAnisotropy(pValue: number) {
        this.mMaxAnisotropy = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
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

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Specifies behavior for sampling between mipmap levels.
     */
    public get mipmapFilter(): FilterMode {
        return this.mMipmapFilter;
    } set mipmapFilter(pValue: FilterMode) {
        this.mMipmapFilter = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Texture sampler edge wrap mode.
     */
    public get wrapMode(): WrappingMode {
        return this.mWrapMode;
    } set wrapMode(pValue: WrappingMode) {
        this.mWrapMode = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
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
        this.mMagFilter = FilterMode.Nearest;
        this.mMinFilter = FilterMode.Nearest;
        this.mMipmapFilter = FilterMode.Nearest;
        this.mLodMinClamp = 0;
        this.mLodMaxClamp = 32;
        this.mMaxAnisotropy = 1;

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }
}