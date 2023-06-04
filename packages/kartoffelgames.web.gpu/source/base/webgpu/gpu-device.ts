import { TypedArray } from '@kartoffelgames/core.data';
import { BufferLayout } from './memory_layout/buffer-memory-layout';
import { Base } from '../base/export.';
import { MemoryType } from '../constant/memory-type.enum';
import { IBuffer } from '../interface/buffer/i-buffer.interface';
import { Buffer } from './buffer/buffer';
import { WebGpuDevice } from '../../abstraction_layer/webgpu/web-gpu-device';
import { TextureSampler } from './texture/texture-sampler';
import { ITextureSampler } from '../interface/texture/i-texture-sampler.interface';
import { TextureFormat } from '../constant/texture-format.enum';
import { TextureUsage } from '../constant/texture-usage.enum';
import { IFrameBufferTexture } from '../interface/texture/i-frame-buffer-texture.interface';
import { IImageTexture } from '../interface/texture/i-image-texture.interface';
import { IVideoTexture } from '../interface/texture/i-video-texture.interface';
import { VideoTexture } from './texture/texture/video-texture';
import { ImageTexture } from './texture/texture/image-texture';
import { CanvasTexture } from './texture/texture/canvas-texture';
import { FrameBufferTexture } from './texture/texture/frame-buffer-texture';

export class GpuDevice extends Base.GpuDevice {
    private readonly mNative: WebGpuDevice;

    /**
     * Native web gpu device.
     */
    public get native(): WebGpuDevice {
        return this.mNative;
    }

    /**
     * //TODO: Something.
     * @param pDevice ---
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
    public createBuffer<T extends TypedArray>(pLayout: BufferLayout, pUsage: MemoryType, pInitialData: T): IBuffer<T> {
        return new Buffer<T>(this, pLayout, pUsage, pInitialData);
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
    public override createFrameBufferTexture(pCanvas: HTMLCanvasElement, pUsage: TextureUsage): IFrameBufferTexture;
    public override createFrameBufferTexture(pFormat: TextureFormat, pUsage: TextureUsage, pWidth: number, pHeight: number, pDepth: number): IFrameBufferTexture;
    public override createFrameBufferTexture(pFormatOrCanvas: HTMLCanvasElement | TextureFormat, pUsage: TextureUsage, pWidth?: number, pHeight?: number, pDepth?: number): IFrameBufferTexture {
        if (pFormatOrCanvas instanceof HTMLCanvasElement) {
            return new CanvasTexture(this, pFormatOrCanvas, pUsage);
        } else {
            const lFormat: TextureFormat = pFormatOrCanvas;
            const lTexture: FrameBufferTexture = new FrameBufferTexture(this, lFormat, pUsage, pDepth);
            lTexture.height = pHeight!;
            lTexture.width = pWidth!;

            return lTexture;
        }
    }

    /**
     * Create texture from images.
     * @param pSourceList - Image source list.
     * @param pFormat - Texture texel format.
     * @param pUsage - Texture usage.
     */
    public override async createImageTexture(pFormat: TextureFormat, pUsage: TextureUsage, ...pSourceList: Array<string>): Promise<IImageTexture> {
        const lTexture: ImageTexture = new ImageTexture(this, pFormat, pUsage);
        await lTexture.load(...pSourceList);

        return lTexture;
    }

    /**
     * Create texture sampler.
     */
    public createTextureSampler(): ITextureSampler {
        return new TextureSampler(this);
    }

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     * @param pFormat - Texture texel format.
     * @param pLoop - Loop video.
     */
    public override async createVideoTexture(pSource: string, pFormat: TextureFormat, pLoop: boolean): Promise<IVideoTexture> {
        return new VideoTexture(this, pFormat, pSource, pLoop);
    }
}
