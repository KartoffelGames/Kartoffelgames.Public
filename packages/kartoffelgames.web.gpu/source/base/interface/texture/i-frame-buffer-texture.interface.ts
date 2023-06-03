import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { ITextureMemoryLayout } from '../memory_layout/i-texture-memory-layout.interface';

export interface IFrameBufferTexture {
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
     * Memory layout.
     */
    readonly memoryLayout: ITextureMemoryLayout;

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