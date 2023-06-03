import { TextureFormat } from '../../constant/texture-format.enum';
import { ITextureMemoryLayout } from '../memory_layout/i-texture-memory-layout.interface';

export interface IVideoTexture {
    /**
     * Texture height.
     */
    readonly height: number;

    /**
     * If video should be looped.
     */
    readonly loop: boolean;

    /**
     * Memory layout.
     */
    readonly memoryLayout: ITextureMemoryLayout;

    /**
     * Texture width.
     */
    readonly width: number;

    /**
     * Texture format.
     */
    readonly format: TextureFormat;

    /**
     * Video source.
     */
    readonly source: string;
}