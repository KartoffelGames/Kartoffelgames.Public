import { TypedArray } from '@kartoffelgames/core.data';
import { IBuffer } from '../../interface/buffer/i-buffer.interface';
import { IGpuDevice } from '../../interface/gpu/i-gpu-device.interface';
import { ArrayBufferMemoryLayoutParameter, IArrayBufferMemoryLayout } from '../../interface/memory_layout/buffer/i-array-buffer.memory-layout.interface';
import { IBufferMemoryLayout } from '../../interface/memory_layout/buffer/i-buffer-memory-layout.interface';
import { ILinearBufferMemoryLayout, LinearBufferMemoryLayoutParameter } from '../../interface/memory_layout/buffer/i-linear-buffer-memory-layout.interface';
import { IStructBufferMemoryLayout, StructBufferMemoryLayoutParameter } from '../../interface/memory_layout/buffer/i-struct-buffer.memory-layout.interface';
import { IMemoryLayout } from '../../interface/memory_layout/i-memory-layout.interface';
import { ISamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../../interface/memory_layout/i-sampler-memory-layout.interface';
import { ITextureMemoryLayout, TextureMemoryLayoutParameter } from '../../interface/memory_layout/i-texture-memory-layout.interface';
import { IFrameBufferTexture } from '../../interface/texture/i-frame-buffer-texture.interface';
import { IImageTexture } from '../../interface/texture/i-image-texture.interface';
import { ITextureSampler } from '../../interface/texture/i-texture-sampler.interface';
import { IVideoTexture } from '../../interface/texture/i-video-texture.interface';

export abstract class GpuDevice<TGpuTypes extends GpuTypes> implements IGpuDevice {
    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract arrayMemoryLayout(pParameter: ArrayBufferMemoryLayoutParameter): TGpuTypes['arrayBufferMemoryLayout'];

    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract linearMemoryLayout(pParameter: LinearBufferMemoryLayoutParameter): TGpuTypes['linearBufferMemoryLayout'];

    /**
     * Create sampler memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract samplerMemoryLayout(pParameter: SamplerMemoryLayoutParameter): TGpuTypes['samplerMemoryLayout'];

    /**
     * Create struct buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract structMemoryLayout(pParameter: StructBufferMemoryLayoutParameter): TGpuTypes['structBufferMemoryLayout'];

    /**
     * Create texture memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract textureMemoryLayout(pParameter: TextureMemoryLayoutParameter): TGpuTypes['textureMemoryLayout'];
}

export interface GpuTypes {
    // Core
    gpuDevice: GpuDevice<this>;

    // Layouts.
    memoryLayout: IMemoryLayout;
    textureMemoryLayout: ITextureMemoryLayout;
    samplerMemoryLayout: ISamplerMemoryLayout;
    bufferMemoryLayout: IBufferMemoryLayout;
    arrayBufferMemoryLayout: IArrayBufferMemoryLayout;
    linearBufferMemoryLayout: ILinearBufferMemoryLayout;
    structBufferMemoryLayout: IStructBufferMemoryLayout;

    // Texture
    textureSampler: ITextureSampler;
    imageTexture: IImageTexture;
    frameBufferTexture: IFrameBufferTexture;
    videoTexture: IVideoTexture;

    // Things with generics. :(
    buffer: IBuffer<TypedArray>;
}