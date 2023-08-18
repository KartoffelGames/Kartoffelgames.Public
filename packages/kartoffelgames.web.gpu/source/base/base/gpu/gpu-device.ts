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
import { RenderParameterLayout } from '../pipeline/parameter/render-parameter-layout';
import { RenderTargets } from '../pipeline/render-targets';
import { RenderShader } from '../shader/render-shader';
import { ShaderInformation } from '../shader/shader-information';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';

export abstract class GpuDevice<TGpuTypes extends GpuTypes = GpuTypes> {
    /**
     * Init gpu device.
     */
    public abstract init(): Promise<this>;

    /**
     * Create shader.
     * @param pSource - Shader source.
     * @param pVertexEntry - Vertex entry name.
     * @param pFragmentEntry - Optional fragment entry.
     */
    public abstract renderShader(pSource: string, pVertexEntry: string, pFragmentEntry?: string): TGpuTypes['renderShader'];

    /**
     * Create render target group.
     * @param pWidth - Render target width.
     * @param pHeight - Render target height.
     * @param pMultisampleLevel - Multisample level of targets.
     */
    public abstract renderTargets(pWidth: number, pHeight: number, pMultisampleLevel?: number): TGpuTypes['renderTargets'];
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
    rdnerParameterLayout: RenderParameterLayout;

    // Shader.
    renderShader: RenderShader;
    shaderInformation: ShaderInformation;

    // Pipeline resources.
    renderTargets: RenderTargets;

}