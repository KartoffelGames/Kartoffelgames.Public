import { TypedArray } from '@kartoffelgames/core.data';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { IBufferLayout } from '../buffer/i-buffer-layout.interface';
import { IBuffer } from '../buffer/i-buffer.interface';
import { IFrameBufferTexture } from '../texture/i-frame-buffer-texture.interface';
import { IImageTexture } from '../texture/i-image-texture.interface';
import { ITextureSampler } from '../texture/i-texture-sampler.interface';
import { IVideoTexture } from '../texture/i-video-texture.interface';

export interface IGpuDevice {
    /**
     * Create buffer.
     * @param pLayout - Buffer layout.
     * @param pUsage - Buffer usage.
     * @param pInitialData - Initial data. Defines buffer length.
     */
    createBuffer<T extends TypedArray>(pLayout: IBufferLayout, pUsage: BufferUsage, pInitialData: T): IBuffer<T>;

    /**
     * Create texture sampler.
     */
    createTextureSampler(): ITextureSampler;

    /**
     * Create frame buffer texture from canvas element.
     * @param pCanvas - Canvas html element.
     */
    createFrameBufferTexture(pCanvas: HTMLCanvasElement): IFrameBufferTexture;

    /**
     * Create frame buffer element.
     * @param pFormat - Texture texel format.
     * @param pUsage - Texture usage.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pDepth - Texture depth.
     */
    createFrameBufferTexture(pFormat: TextureFormat, pUsage: TextureUsage, pWidth: number, pHeight: number, pDepth: number): IFrameBufferTexture;

    /**
     * Create texture from images.
     * @param pSourceList - Image source list.
     */
    createImageTexture(...pSourceList: Array<string>): Promise<IImageTexture>;

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     */
    createVideoTexture(pSource: string): Promise<IVideoTexture>;
}