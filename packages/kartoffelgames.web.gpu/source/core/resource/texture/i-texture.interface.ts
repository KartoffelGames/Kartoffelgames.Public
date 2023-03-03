import { GpuNativeObject } from '../../gpu-native-object';
import { TextureUsage } from './texture-usage.enum';

export interface ITexture extends GpuNativeObject<GPUTexture> {
    /**
     * Texture dimension.
     */
    readonly dimension: GPUTextureViewDimension;

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
     * Texture usage.
     */
    readonly usage: TextureUsage;

    /**
     * Texture width.
     */
    width: number;
}