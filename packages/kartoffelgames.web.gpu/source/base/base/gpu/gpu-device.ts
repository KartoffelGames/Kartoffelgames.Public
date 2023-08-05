import { TypedArray } from '@kartoffelgames/core.data';
import { BindGroup } from '../binding/bind-group';
import { BindGroupLayout } from '../binding/bind-group-layout';
import { PipelineLayout } from '../binding/pipeline-layout';
import { Buffer } from '../buffer/buffer';
import { ArrayBufferMemoryLayout } from '../memory_layout/buffer/array-buffer-memory-layout';
import { LinearBufferMemoryLayout } from '../memory_layout/buffer/linear-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../memory_layout/buffer/struct-buffer-memory-layout';
import { SamplerMemoryLayout } from '../memory_layout/sampler-memory-layout';
import { TextureMemoryLayout } from '../memory_layout/texture-memory-layout';
import { Shader } from '../shader/shader';
import { ShaderInformation } from '../shader/shader-information';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';

export abstract class GpuDevice<TGpuTypes extends GpuTypes = GpuTypes> {
    /**
     * Generate empty bind group layout.
     */
    public abstract bindGroupLayout(): TGpuTypes['bindGroupLayout'];

    /**
     * Init gpu device.
     */
    public abstract init(): Promise<this>;

    /**
     * Generate empty pipeline layout.
     */
    public abstract pipelineLayout(): TGpuTypes['pipelineLayout'];

    /**
     * Create shader.
     * @param pSource - Shader source.
     */
    public abstract shader(pSource: string): TGpuTypes['shader'];
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

    // Shader.
    shader: Shader;
    shaderInformation: ShaderInformation;
}