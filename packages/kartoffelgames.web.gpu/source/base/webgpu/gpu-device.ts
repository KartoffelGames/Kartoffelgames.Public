import { TypedArray } from '@kartoffelgames/core.data';
import { WebGpuDevice } from '../../abstraction_layer/webgpu/web-gpu-device';
import { Base } from '../base/export.';
import { IBuffer } from '../interface/buffer/i-buffer.interface';
import { IArrayBufferMemoryLayout } from '../interface/memory_layout/buffer/i-array-buffer.memory-layout.interface';
import { ILinearBufferMemoryLayout } from '../interface/memory_layout/buffer/i-linear-buffer-memory-layout.interface';
import { IStructBufferMemoryLayout } from '../interface/memory_layout/buffer/i-struct-buffer.memory-layout.interface';
import { ISamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../interface/memory_layout/i-sampler-memory-layout.interface';
import { ITextureMemoryLayout, TextureMemoryLayoutParameter } from '../interface/memory_layout/i-texture-memory-layout.interface';
import { IFrameBufferTexture } from '../interface/texture/i-frame-buffer-texture.interface';
import { IImageTexture } from '../interface/texture/i-image-texture.interface';
import { ITextureSampler } from '../interface/texture/i-texture-sampler.interface';
import { IVideoTexture } from '../interface/texture/i-video-texture.interface';
import { Buffer, BufferMemoryLayout } from './buffer/buffer';
import { SamplerMemoryLayout } from './memory_layout/sampler-memory-layout';
import { TextureMemoryLayout } from './memory_layout/texture-memory-layout';
import { TextureSampler } from './texture/texture-sampler';
import { CanvasTexture } from './texture/texture/canvas-texture';
import { FrameBufferTexture } from './texture/texture/frame-buffer-texture';
import { ImageTexture } from './texture/texture/image-texture';
import { VideoTexture } from './texture/texture/video-texture';
import { ArrayBufferMemoryLayout } from './memory_layout/buffer/array-buffer-memory-layout';
import { ArrayBufferMemoryLayoutParameter } from '../base/memory_layout/buffer/array-buffer-memory-layout';
import { StructBufferMemoryLayoutParameter } from '../base/memory_layout/buffer/struct-buffer-memory-layout';
import { LinearBufferMemoryLayoutParameter } from '../base/memory_layout/buffer/linear-buffer-memory-layout';
import { LinearBufferMemoryLayout } from './memory_layout/buffer/linear-buffer-memory-layout';
import { StructBufferMemoryLayout } from './memory_layout/buffer/struct-buffer-memory-layout';

export class GpuDevice extends Base.GpuDevice {
    private readonly mNative: WebGpuDevice;

    /**
     * Native web gpu device.
     */
    public get native(): WebGpuDevice {
        return this.mNative;
    }

    /**
     * Constructor.
     * @param pDevice - Native device.
     */
    public constructor(pDevice: WebGpuDevice) {
        super();

        this.mNative = pDevice;
    }

    /**
     * Create buffer.
     * @param pLayout - Buffer layout.
     * @param pUsage - Buffer usage.
     * @param pInitialData - Initial data. Defines buffer length.
     */
    public buffer<T extends TypedArray>(pLayout: BufferMemoryLayout, pInitialData: T): IBuffer<T> {
        return new Buffer<T>(this, pLayout, pInitialData);
    }

    /**
     * Create frame buffer element.
     * @param pCanvas - Canvas element.
     * @param pFormat - Texture texel format.
     * @param pUsage - Texture usage.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pDepth - Texture depth.
     */
    public override frameBufferTexture(pLayout: TextureMemoryLayout, pCanvas: HTMLCanvasElement): IFrameBufferTexture;
    public override frameBufferTexture(pLayout: TextureMemoryLayout, pWidth: number, pHeight: number, pDepth: number): IFrameBufferTexture;
    public override frameBufferTexture(pLayout: TextureMemoryLayout, pWidthOrCanvas: unknown, pHeight?: number, pDepth?: number): IFrameBufferTexture {
        if (pWidthOrCanvas instanceof HTMLCanvasElement) {
            return new CanvasTexture(this, pWidthOrCanvas, pLayout, 1);
        } else {
            const lTexture: FrameBufferTexture = new FrameBufferTexture(this, pLayout, pDepth);
            lTexture.height = <number>pHeight!;
            lTexture.width = <number>pWidthOrCanvas!;

            return lTexture;
        }
    }

    /**
     * Create texture from images.
     * @param pLayout - Texture memory layout.
     * @param pSourceList - Image source list.
     */
    public override async imageTexture(pLayout: TextureMemoryLayout, ...pSourceList: Array<string>): Promise<IImageTexture> {
        const lTexture: ImageTexture = new ImageTexture(this, pLayout);
        await lTexture.load(...pSourceList);

        return lTexture;
    }

    /**
     * Create memory layout parameter.
     * @param pParameter - Memory layout parameter.
     */
    public override memoryLayout(pParameter: ArrayBufferMemoryLayoutParameter): IArrayBufferMemoryLayout;
    public override memoryLayout(pParameter: StructBufferMemoryLayoutParameter): IStructBufferMemoryLayout;
    public override memoryLayout(pParameter: LinearBufferMemoryLayoutParameter): ILinearBufferMemoryLayout;
    public override memoryLayout(pParameter: SamplerMemoryLayoutParameter): ISamplerMemoryLayout;
    public override memoryLayout(pParameter: TextureMemoryLayoutParameter): ITextureMemoryLayout;
    public override memoryLayout(pParameter: MemoryLayoutParameter): ILinearBufferMemoryLayout | IArrayBufferMemoryLayout | IStructBufferMemoryLayout | ITextureMemoryLayout | ISamplerMemoryLayout {
        switch (pParameter.type) {
            case 'ArrayBuffer': return new ArrayBufferMemoryLayout(pParameter);
            case 'LinearBuffer': return new LinearBufferMemoryLayout(pParameter);
            case 'Sampler': return new SamplerMemoryLayout(pParameter);
            case 'StructBuffer': return new StructBufferMemoryLayout(pParameter);
            case 'Texture': return new TextureMemoryLayout(pParameter);
        }
    }

    /**
     * Create texture sampler.
     * @param pLayout - Sampler memory layout.
     */
    public textureSampler(pLayout: SamplerMemoryLayout): ITextureSampler {
        return new TextureSampler(this, pLayout);
    }

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     * @param pFormat - Texture texel format.
     * @param pLoop - Loop video.
     */
    public override async videoTexture(pLayout: TextureMemoryLayout, pSource: string, pLoop: boolean): Promise<IVideoTexture> {
        return new VideoTexture(this, pLayout, pSource, pLoop);
    }
}

type MemoryLayoutParameter = ArrayBufferMemoryLayoutParameter | StructBufferMemoryLayoutParameter | LinearBufferMemoryLayoutParameter | SamplerMemoryLayoutParameter | TextureMemoryLayoutParameter;