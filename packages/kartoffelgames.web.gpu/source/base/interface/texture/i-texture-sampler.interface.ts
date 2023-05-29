import { CompareFunction } from '../../constant/compare-function.enum';
import { FilterMode } from '../../constant/filter-mode.enum';
import { WrappingMode } from '../../constant/wrapping-mode.enum';
import { IGpuObject } from '../gpu/i-gpu-object.interface';

export interface ITextureSampler extends IGpuObject {
    /**
     * Compare function used for compare sampler.
     * Used only for compare sampler.
     */
    compare: CompareFunction | null;

    /**
     * Repeat behaviour outside of texture edges.
     */
    wrapMode: WrappingMode;

    /**
     * Specifies the maximum LOD when sampling a a texture.
     */
    lodMaxClamp: number;

    /**
     * Specifies the minimum LOD when sampling a a texture.
     */
    lodMinClamp: number;

    /**
     * How the texture is sampled when a texel covers more than one pixel.
     */
    magFilter: FilterMode;

    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     */
    maxAnisotropy: number;

    /**
     * How the texture is sampled when a texel covers less than one pixel.
     */
    minFilter: FilterMode;

    /**
     * Behavior for sampling between mipmap levels.
     */
    mipmapFilter: FilterMode;
}