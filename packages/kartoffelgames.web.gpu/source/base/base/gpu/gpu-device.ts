import { TypedArray } from '@kartoffelgames/core.data';
import { Buffer } from '../buffer/buffer';
import { ArrayBufferMemoryLayout, ArrayBufferMemoryLayoutParameter } from '../memory_layout/buffer/array-buffer-memory-layout';
import { LinearBufferMemoryLayout, LinearBufferMemoryLayoutParameter } from '../memory_layout/buffer/linear-buffer-memory-layout';
import { StructBufferMemoryLayout, StructBufferMemoryLayoutParameter } from '../memory_layout/buffer/struct-buffer-memory-layout';
import { SamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../memory_layout/sampler-memory-layout';
import { TextureMemoryLayout, TextureMemoryLayoutParameter } from '../memory_layout/texture-memory-layout';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';
import { BindGroupLayout } from '../binding/bind-group-layout';
import { PipelineLayout } from '../binding/pipeline-layout';
import { BindGroup } from '../binding/bind-group';

export abstract class GpuDevice<TGpuTypes extends GpuTypes = GpuTypes> {
    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract arrayMemoryLayout(pParameter: ArrayBufferMemoryLayoutParameter<TGpuTypes>): TGpuTypes['arrayBufferMemoryLayout'];

    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract linearMemoryLayout(pParameter: LinearBufferMemoryLayoutParameter<TGpuTypes>): TGpuTypes['linearBufferMemoryLayout'];

    /**
     * Create sampler memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract samplerMemoryLayout(pParameter: SamplerMemoryLayoutParameter): TGpuTypes['samplerMemoryLayout'];

    /**
     * Create struct buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract structMemoryLayout(pParameter: StructBufferMemoryLayoutParameter<TGpuTypes>): TGpuTypes['structBufferMemoryLayout'];

    /**
     * Create texture memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract textureMemoryLayout(pParameter: TextureMemoryLayoutParameter): TGpuTypes['textureMemoryLayout'];
}

export interface GpuTypes {
    // Core.
    gpuDevice: GpuDevice;
    memoryLayout: this['bufferMemoryLayout'] | this['textureMemoryLayout'] | this['samplerMemoryLayout'];

    // Texture Layouts. 
    textureMemoryLayout: TextureMemoryLayout;
    samplerMemoryLayout: SamplerMemoryLayout;

    // Buffer Layouts.
    bufferMemoryLayout: this['arrayBufferMemoryLayout'] | this['linearBufferMemoryLayout'] | this['structBufferMemoryLayout'];
    arrayBufferMemoryLayout: ArrayBufferMemoryLayout;
    linearBufferMemoryLayout: LinearBufferMemoryLayout;
    structBufferMemoryLayout: StructBufferMemoryLayout;

    // Textures.
    textureSampler: TextureSampler;
    imageTexture: ImageTexture;
    frameBufferTexture: FrameBufferTexture;
    videoTexture: VideoTexture;

    // Things with generics. :(
    buffer: Buffer<TypedArray>;

    // Bind data.
    bindData: this['buffer'] | this['textureSampler'] | this['imageTexture'] | this['frameBufferTexture'] | this['videoTexture'];

    // Pipeline layouting.
    bindGroupLayout: BindGroupLayout;
    pipelineLayout: PipelineLayout;
    bindGroup: BindGroup;
}