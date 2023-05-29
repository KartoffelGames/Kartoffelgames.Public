import { CompareFunction } from '../../constant/compare-function.enum';
import { FilterMode } from '../../constant/filter-mode.enum';
import { WrappingMode } from '../../constant/wrapping-mode.enum';

export interface ITextureSampler {
    /**
     * Compare function used for compare sampler.
     */
    readonly compare: CompareFunction | null;

    /**
     * Repeat behaviour outside of texture edges.
     */
    readonly wrapMode: WrappingMode;

    /**
     * Specifies the maximum LOD when sampling a a texture.
     */
    readonly lodMaxClamp: number;

    /**
     * Specifies the minimum LOD when sampling a a texture.
     */
    readonly lodMinClamp: number;

    /**
     * How the texture is sampled when a texel covers more than one pixel.
     */
    readonly magFilter: FilterMode;

    /**
     * Specifies the maximum anisotropy value clamp used by the sampler.
     */
    readonly maxAnisotropy: number;

    /**
     * How the texture is sampled when a texel covers less than one pixel.
     */
    readonly minFilter: FilterMode;

    /**
     * Behavior for sampling between mipmap levels.
     */
    readonly mipmapFilter: FilterMode;
}