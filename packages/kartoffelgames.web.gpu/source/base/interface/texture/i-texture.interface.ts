export interface ITexture {
    /**
     * Texture height.
     */
    readonly height: number;

    /**
     * Texture width.
     */
    readonly width: number;

    /**
     * Texture depth.
     */
    readonly depth: number;

    /**
     * Texture multi sample level.
     */
    readonly multiSampleLevel: number;
}