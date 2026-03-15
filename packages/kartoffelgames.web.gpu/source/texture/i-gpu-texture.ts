import type { TextureDimension } from '../constant/texture-dimension.ts';
import type { TextureFormat } from '../constant/texture-format.type.ts';
import type { TextureUsage } from '../constant/texture-usage.enum.ts';
import type { GpuResourceObject } from '../gpu_object/gpu-resource-object.ts';
import type { GpuTextureView, TextureViewDimension } from '@kartoffelgames/web-gpu';

/**
 * GPU texture interface. Represents a GPU texture resource with common properties and methods.
 */
export interface IGpuTexture extends GpuResourceObject<TextureUsage, GPUTexture, any> {
    /**
     * Texture depth.
     */
    readonly depth: number;

    /**
     * Texture dimension.
     */
    readonly dimension: TextureDimension;

    /**
     * Canvas format.
     */
    readonly format: TextureFormat;

    /**
     * Texture height.
     */
    height: number;

    /**
     * Texture mip level count.
     */
    readonly mipCount: number;

    /**
     * If texture is multisampled.
     */
    readonly multiSampled: boolean;

    /**
     * Texture width.
     */
    width: number;

    /**
     * Use texture as view. 
     * 
     * @param pDimension - Texture views dimension.
     * 
     * @returns Texture view.
     */
    useAs(pDimension?: TextureViewDimension): GpuTextureView;
}