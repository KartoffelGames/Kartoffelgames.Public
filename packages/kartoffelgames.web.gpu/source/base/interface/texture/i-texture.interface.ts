import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';

export interface ITexture {
    /**
     * Texture height.
     */
    height: number;

    /**
     * Texture width.
     */
    width: number;

    /**
     * Texture depth.
     */
    readonly depth: number;

    /**
     * Texture multi sample level.
     */
    multiSampleLevel: number;

    /**
     * Texture format.
     */
    readonly format: TextureFormat;

    /**
     * Texture usage.
     */
    readonly usage: TextureUsage
}