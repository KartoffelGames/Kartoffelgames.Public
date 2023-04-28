import { GpuNativeObject } from '../../gpu-native-object';
import { TextureUsage } from './texture-usage.enum';
import { TextureView } from './texture-view';

export interface ITexture extends GpuNativeObject<GPUTexture> {
    /**
     * Texture dimension.
     */
    readonly dimension: GPUTextureDimension;

    /**
     * Texture format.
     */
    readonly format: GPUTextureFormat;

    /**
     * Texture height.
     */
    height: number;

    /**
     * Texture depth.
     */
    readonly layer: number;


    /**
     * Texture multi sample level.
     */
    readonly multiSampleLevel: number;

    /**
     * Texture usage.
     */
    readonly usage: TextureUsage;

    /**
     * Texture width.
     */
    width: number;

    /**
     * Get texture view.
     */
    view(pBaseLayer?: number, pLayerCount?: number): TextureView;
}