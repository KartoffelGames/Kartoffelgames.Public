import { TypedArray } from '@kartoffelgames/core.data';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { IBuffer } from '../../interface/buffer/i-buffer.interface';
import { BufferLayout } from '../buffer/buffer-layout';
import { IGpuDevice } from '../../interface/gpu/i-gpu-device.interface';
import { ITextureSampler } from '../../interface/texture/i-texture-sampler.interface';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { IFrameBufferTexture } from '../../interface/texture/i-frame-buffer-texture.interface';
import { IImageTexture } from '../../interface/texture/i-image-texture.interface';
import { IVideoTexture } from '../../interface/texture/i-video-texture.interface';

export abstract class GpuDevice implements IGpuDevice {
    /**
     * Create buffer.
     * @param pLayout - Buffer layout.
     * @param pUsage - Buffer usage.
     * @param pInitialData - Initial data. Defines buffer length.
     */
    public abstract createBuffer<T extends TypedArray>(pLayout: BufferLayout, pUsage: BufferUsage, pInitialData: T): IBuffer<T>;

    /**
     * Create frame buffer texture from canvas element.
     * @param pCanvas - Canvas html element.
     */
    public abstract createFrameBufferTexture(pCanvas: HTMLCanvasElement): IFrameBufferTexture;

    /**
     * Create frame buffer element.
     * @param pFormat - Texture texel format.
     * @param pUsage - Texture usage.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pDepth - Texture depth.
     */
    public abstract createFrameBufferTexture(pFormat: TextureFormat, pUsage: TextureUsage, pWidth: number, pHeight: number, pDepth: number): IFrameBufferTexture;

    /**
     * Create texture from images.
     * @param pSourceList - Image source list.
     */
    public abstract createImageTexture(...pSourceList: Array<string>): Promise<IImageTexture>;

    /**
     * Create texture sampler.
     */
    public abstract createTextureSampler(): ITextureSampler;

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     */
    public abstract createVideoTexture(pSource: string): Promise<IVideoTexture>;
}
