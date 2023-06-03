import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { IMemoryLayout } from './i-memory-layout.interface';

export interface ITextureMemoryLayout extends IMemoryLayout {
    /**
     * Texture dimension.
     */
    readonly dimension: TextureDimension;

    /**
     * Texture format.
     */
    readonly format: TextureFormat;
}