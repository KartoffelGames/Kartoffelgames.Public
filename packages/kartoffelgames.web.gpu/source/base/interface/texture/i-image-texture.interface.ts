import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';

export interface IImageTexture {
    /**
     * Texture height.
     */
    readonly height: number;

    /**
     * Loaded html image element list.
     */
    readonly images: Array<ImageBitmap>;

    /**
     * Texture width.
     */
    readonly width: number;

    /**
     * Texture depth.
     */
    readonly depth: number;

    /**
     * Texture format.
     */
    readonly format: TextureFormat;

    /**
     * Texture usage.
     */
    readonly usage: TextureUsage

    /**
     * Load image into texture.
     * Images needs to have the same dimensions.
     * @param pSorceList - Source for each depth layer.
     */
    load(...pSorceList: Array<string>): Promise<void>;
}