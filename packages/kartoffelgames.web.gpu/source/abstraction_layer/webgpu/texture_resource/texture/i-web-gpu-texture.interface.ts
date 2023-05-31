import { GpuNativeObject } from '../../gpu-native-object';
import { TextureUsage } from './texture-usage.enum';
import { WebGpuTextureView } from './web-gpu-texture-view';

export interface IWebGpuTexture extends GpuNativeObject<GPUTexture> {
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
    readonly height: number;

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
    readonly width: number;

    /**
     * Get texture view.
     */
    view(pBaseLayer?: number, pLayerCount?: number): WebGpuTextureView;
}