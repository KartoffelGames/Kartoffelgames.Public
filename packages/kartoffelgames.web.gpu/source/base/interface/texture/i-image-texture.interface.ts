import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { ITextureMemoryLayout } from '../memory_layout/i-texture-memory-layout.interface';

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
     * Memory layout.
     */
    readonly memoryLayout: ITextureMemoryLayout;

    /**
     * Texture width.
     */
    readonly width: number;

    /**
     * Texture depth.
     */
    readonly depth: number;

    /**
     * Load image into texture.
     * Images needs to have the same dimensions.
     * @param pSorceList - Source for each depth layer.
     */
    load(...pSorceList: Array<string>): Promise<void>;
}