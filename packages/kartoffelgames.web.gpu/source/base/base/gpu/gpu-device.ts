import { TypedArray } from '@kartoffelgames/core.data';
import { IBuffer } from '../../interface/buffer/i-buffer.interface';
import { IGpuDevice } from '../../interface/gpu/i-gpu-device.interface';
import { IBufferLayout } from '../../interface/memory_layout/i-buffer-memory-layout.interface';
import { ISamplerMemoryLayout } from '../../interface/memory_layout/i-sampler-memory-layout.interface';
import { ITextureMemoryLayout } from '../../interface/memory_layout/i-texture-memory-layout.interface';
import { IFrameBufferTexture } from '../../interface/texture/i-frame-buffer-texture.interface';
import { IImageTexture } from '../../interface/texture/i-image-texture.interface';
import { ITextureSampler } from '../../interface/texture/i-texture-sampler.interface';
import { IVideoTexture } from '../../interface/texture/i-video-texture.interface';

export abstract class GpuDevice implements IGpuDevice {
    /**
     * Create buffer.
     * @param pLayout - Memory layout.
     * @param pInitialData - Initial data. Defines buffer length.
     */
    public abstract buffer<T extends TypedArray>(pLayout: IBufferLayout, pInitialData: T): IBuffer<T>;

    /**
     * Create texture sampler.
     * @param pLayout - Memory layout.
     */
    public abstract textureSampler(pLayout: ISamplerMemoryLayout): ITextureSampler;

    /**
     * Create frame buffer texture from canvas element.
     * @param pLayout - Memory layout.
     * @param pCanvas - Canvas html element.
     */
    public abstract frameBufferTexture(pLayout: ITextureMemoryLayout, pCanvas: HTMLCanvasElement): IFrameBufferTexture;

    /**
     * Create frame buffer element.
     * @param pLayout - Memory layout.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pDepth - Texture depth.
     */
    public abstract frameBufferTexture(pLayout: ITextureMemoryLayout, pWidth: number, pHeight: number, pDepth: number): IFrameBufferTexture;

    /**
     * Create texture from images.
     * @param pLayout - Memory layout.
     * @param pSourceList - Image source list.
     * @param pUsage - Texture usage.
     */
    public abstract imageTexture(pLayout: ITextureMemoryLayout, ...pSourceList: Array<string>): Promise<IImageTexture>;

    /**
     * Create texture from a video source.
     * @param pLayout - Memory layout.
     * @param pSource - Video source.
     * @param pLoop - Loop video.
     */
    public abstract videoTexture(pLayout: ITextureMemoryLayout, pSource: string, pLoop: boolean): Promise<IVideoTexture>;
}
