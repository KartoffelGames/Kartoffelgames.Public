import { TextureFormat } from '../../constant/texture-format.enum';

export interface IVideoTexture {
    /**
     * Texture height.
     */
    readonly height: number;

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