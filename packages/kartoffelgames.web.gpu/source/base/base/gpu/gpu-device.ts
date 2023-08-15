import { TypedArray } from '@kartoffelgames/core.data';
import { BindDataGroup } from '../binding/bind-data-group';
import { BindDataGroupLayout } from '../binding/bind-data-group-layout';
import { PipelineDataLayout } from '../binding/pipeline-data-layout';
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
import { RenderTargets } from '../pipeline/render-targets';
import { ParameterLayout } from '../pipeline/parameter/parameter-layout';

export abstract class GpuDevice<TGpuTypes extends GpuTypes = GpuTypes> {
    /**
     * Generate empty bind group layout.
     */
    public abstract bindGroupLayout(): TGpuTypes['bindDataGroupLayout'];

    /**
     * Init gpu device.
     */
    public abstract init(): Promise<this>;

    /**
     * Generate empty pipeline layout.
     */
    public abstract pipelineLayout(): TGpuTypes['pipelineDataLayout'];

    /**
     * Create render target group.
     * @param pWidth - Render target width.
     * @param pHeight - Render target height.
     * @param pMultisampleLevel - Multisample level of targets.
     */
    public abstract renderTargets(pWidth: number, pHeight: number, pMultisampleLevel?: number): TGpuTypes['renderTargets'];

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
    bindDataGroupLayout: BindDataGroupLayout;
    bindDataGroup: BindDataGroup;
    pipelineDataLayout: PipelineDataLayout;
    parameterLayout: ParameterLayout;

    // Shader.
    shader: Shader;
    shaderInformation: ShaderInformation;

    // Pipeline resources.
    renderTargets: RenderTargets;
    
}