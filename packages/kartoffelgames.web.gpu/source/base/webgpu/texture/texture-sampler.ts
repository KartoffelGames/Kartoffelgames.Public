import { NoOptional } from '@kartoffelgames/core.data';
import { CompareFunction } from '../../constant/compare-function.enum';
import { FilterMode } from '../../constant/filter-mode.enum';
import { WrappingMode } from '../../constant/wrapping-mode.enum';
import { ITextureSampler } from '../../interface/texture/i-texture-sampler.interface';
import { WebGpuTextureSampler } from '../../../abstraction_layer/webgpu/texture_resource/web-gpu-texture-sampler';
import { WebGpuDevice } from '../../../abstraction_layer/webgpu/web-gpu-device';


export class TextureSampler implements ITextureSampler {
    private readonly mNativeSampler: WebGpuTextureSampler;
    private readonly mSettings: Required<TextureSamplerSettings>;

    /**
     * When provided the sampler will be a comparison sampler with the specified compare function.
     */
    public get compareFunction(): CompareFunction | null {
        return this.mSettings.compare;
    }

    /**
     * Texture sampler edge fit mode.
     */
    public get fitMode(): WrappingMode {
        return this.mSettings.fitMode;
    }

    /**
     * Specifies the maximum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMaxClamp(): number {
        return this.mSettings.lodMaxClamp;
    }

    /**
     * Specifies the minimum levels of detail, respectively, used internally when sampling a texture.
     */
    public get lodMinClamp(): number {
        return this.mSettings.lodMinClamp;
    }

    /**
     * How the texture is sampled when a texel covers more than one pixel.
     */
    public get magFilter(): FilterMode {
        return this.mSettings.magFilter;
    }

    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     */
    public get maxAnisotropy(): number {
        return this.mSettings.maxAnisotropy;
    }

    /**
     * How the texture is sampled when a texel covers less than one pixel.
     */
    public get minFilter(): FilterMode {
        return this.mSettings.minFilter;
    }

    /**
     * Specifies behavior for sampling between mipmap levels.
     */
    public get mipmapFilter(): FilterMode {
        return this.mSettings.mipmapFilter;
    }

    public constructor(pDevice: WebGpuDevice, pSettings: TextureSamplerSettings) {
        // Set defaults.
        this.mSettings = {
            compare: pSettings.compare ?? null,
            fitMode: pSettings.fitMode ?? WrappingMode.ClampToEdge,
            magFilter: pSettings.magFilter ?? FilterMode.Nearest,
            minFilter: pSettings.minFilter ?? FilterMode.Nearest,
            mipmapFilter: pSettings.mipmapFilter ?? FilterMode.Nearest,
            lodMinClamp: pSettings.lodMinClamp ?? 0,
            lodMaxClamp: pSettings.lodMaxClamp ?? 32,
            maxAnisotropy: pSettings.maxAnisotropy ?? 1
        };
    }
}


type TextureSamplerSettings = {
    compare?: CompareFunction | null;
    fitMode?: WrappingMode;
    magFilter?: FilterMode;
    minFilter?: FilterMode;
    mipmapFilter?: FilterMode;
    lodMinClamp?: number;
    lodMaxClamp?: number;
    maxAnisotropy?: number;
};