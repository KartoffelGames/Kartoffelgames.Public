import { TypedArray } from '@kartoffelgames/core.data';
import { MemoryType } from '../../constant/memory-type.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { BufferMemoryLayoutParameter, IBufferMemoryLayout } from '../memory_layout/buffer/i-buffer-memory-layout.interface';
import { IBuffer } from '../buffer/i-buffer.interface';
import { IFrameBufferTexture } from '../texture/i-frame-buffer-texture.interface';
import { IImageTexture } from '../texture/i-image-texture.interface';
import { ITextureSampler } from '../texture/i-texture-sampler.interface';
import { IVideoTexture } from '../texture/i-video-texture.interface';
import { ISamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../memory_layout/i-sampler-memory-layout.interface';
import { ITextureMemoryLayout, TextureMemoryLayoutParameter } from '../memory_layout/i-texture-memory-layout.interface';
import { ArrayBufferMemoryLayoutParameter, IArrayBufferMemoryLayout } from '../memory_layout/buffer/i-array-buffer.memory-layout.interface';
import { IStructBufferMemoryLayout, StructBufferMemoryLayoutParameter } from '../memory_layout/buffer/i-struct-buffer.memory-layout.interface';

export interface IGpuDevice {
    /**
     * Create buffer.
     * @param pLayout - Memory layout.
     * @param pInitialData - Initial data. Defines buffer length.
     */
    buffer<T extends TypedArray>(pLayout: IBufferMemoryLayout, pInitialData: T): IBuffer<T>;

    /**
     * Create texture sampler.
     * @param pLayout - Memory layout.
     */
    textureSampler(pLayout: ISamplerMemoryLayout): ITextureSampler;

    /**
     * Create frame buffer texture from canvas element.
     * @param pLayout - Memory layout.
     * @param pCanvas - Canvas html element.
     */
    frameBufferTexture(pLayout: ITextureMemoryLayout, pCanvas: HTMLCanvasElement): IFrameBufferTexture;

    /**
     * Create frame buffer element.
     * @param pLayout - Memory layout.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pDepth - Texture depth.
     */
    frameBufferTexture(pLayout: ITextureMemoryLayout, pWidth: number, pHeight: number, pDepth: number): IFrameBufferTexture;

    /**
     * Create texture from images.
     * @param pLayout - Memory layout.
     * @param pSourceList - Image source list.
     * @param pUsage - Texture usage.
     */
    imageTexture(pLayout: ITextureMemoryLayout, ...pSourceList: Array<string>): Promise<IImageTexture>;

    /**
     * Create texture from a video source.
     * @param pLayout - Memory layout.
     * @param pSource - Video source.
     * @param pLoop - Loop video.
     */
    videoTexture(pLayout: ITextureMemoryLayout, pSource: string, pLoop: boolean): Promise<IVideoTexture>;

    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    memoryLayout(pParameter: ArrayBufferMemoryLayoutParameter): IArrayBufferMemoryLayout;

    /**
     * Create struct buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    memoryLayout(pParameter: StructBufferMemoryLayoutParameter): IStructBufferMemoryLayout;

    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     * @param pSize - Buffer size.
     * @param pAlignment - Buffer memory alignment.
     */
    memoryLayout(pParameter: BufferMemoryLayoutParameter, pSize: number, pAlignment: string): IBufferMemoryLayout;

    /**
     * Create sampler memory layout.
     * @param pParameter - Memory layout parameter.
     */
    memoryLayout(pParameter: SamplerMemoryLayoutParameter): ISamplerMemoryLayout;

    /**
     * Create texture memory layout.
     * @param pParameter - Memory layout parameter.
     */
    memoryLayout(pParameter: TextureMemoryLayoutParameter): ITextureMemoryLayout;
}