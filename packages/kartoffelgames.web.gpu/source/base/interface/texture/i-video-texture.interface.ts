import { TextureFormat } from '../../constant/texture-format.enum';

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