import { TextureBindType } from '../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { GpuTypes } from '../gpu/gpu-device';
import { MemoryLayout, MemoryLayoutParameter } from './memory-layout';

export abstract class TextureMemoryLayout<TGpuTypes extends GpuTypes = GpuTypes> extends MemoryLayout<TGpuTypes> {
    private readonly mBindType: TextureBindType;
    private readonly mDimension: TextureDimension;
    private readonly mFormat: TextureFormat;
    private readonly mUsage: TextureUsage;

    /**
     * Texture dimension.
     */
    public get bindType(): TextureBindType {
        return this.mBindType;
    }

    /**
     * Texture dimension.
     */
    public get dimension(): TextureDimension {
        return this.mDimension;
    }

    /**
     * Texture format.
     */
    public get format(): TextureFormat {
        return this.mFormat;
    }

    /**
     * Texture usage.
     */
    public get usage(): TextureUsage {
        return this.mUsage;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pGpu: TGpuTypes['gpuDevice'], pParameter: TextureMemoryLayoutParameter) {
        super(pGpu, pParameter);

        this.mBindType = pParameter.bindType;
        this.mDimension = pParameter.dimension;
        this.mFormat = pParameter.format;
        this.mUsage = pParameter.usage;
    }

    /**
     * Create frame buffer texture.
     * @param pCanvas - Canvas html element.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pDepth - Texture depth.
     */
    public create(pWidth: number, pHeight: number, pDepth: number): TGpuTypes['frameBufferTexture'];
    public create(pCanvas: HTMLCanvasElement): TGpuTypes['frameBufferTexture'];
    public create(pWidthOrCanvas: number | HTMLCanvasElement, pHeight?: number, pDepth?: number): TGpuTypes['frameBufferTexture'] {
        if (typeof pWidthOrCanvas === 'number') {
            if (typeof pHeight !== 'number' || typeof pDepth !== 'number') {
                throw new Error('Height and depth must be specified for sized frame buffer textures.');
            }

            return this.createSizedFrameBuffer(pWidthOrCanvas, pHeight, pDepth);
        }

        return this.createCanvasFrameBuffer(pWidthOrCanvas);
    }

    /**
     * Create texture from images.
     * @param pSourceList - Image source list.
     */
    public async createFromImage(...pSourceList: Array<string>): Promise<TGpuTypes['imageTexture']> {
        return this.createImageFromSource(...pSourceList);
    }

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     * @param pLoop - Loop video.
     */
    public async createFromVideo(pSource: string): Promise<TGpuTypes['videoTexture']> {
        return this.createVideoTexture(pSource);
    }

    /**
     * Create frame buffer texture from canvas element.
     * @param pCanvas - Canvas html element.
     */
    protected abstract createCanvasFrameBuffer(pCanvas: HTMLCanvasElement): TGpuTypes['frameBufferTexture'];

    /**
     * Create texture from images.
     * @param pSourceList - Image source list.
     */
    protected abstract createImageFromSource(...pSourceList: Array<string>): Promise<TGpuTypes['imageTexture']>;

    /**
     * Create frame buffer element.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pDepth - Texture depth.
     */
    protected abstract createSizedFrameBuffer(pWidth: number, pHeight: number, pDepth: number): TGpuTypes['frameBufferTexture'];

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     */
    protected abstract createVideoTexture(pSource: string): Promise<TGpuTypes['videoTexture']>;
}

export interface TextureMemoryLayoutParameter extends MemoryLayoutParameter {
    dimension: TextureDimension;
    format: TextureFormat;
    usage: TextureUsage;
    bindType: TextureBindType;
}