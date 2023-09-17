import { TextureBindType } from '../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectReason } from '../gpu/gpu-object-reason';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { VideoTexture } from '../texture/video-texture';
import { BaseMemoryLayout, MemoryLayoutParameter } from './base-memory-layout';

export class TextureMemoryLayout extends BaseMemoryLayout {
    private readonly mBindType: TextureBindType;
    private readonly mDimension: TextureDimension;
    private readonly mFormat: TextureFormat;
    private readonly mMultisampled: boolean;
    private mUsage: TextureUsage;

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
     * Texture uses multisample.
     */
    public get multisampled(): boolean {
        return this.mMultisampled;
    }

    /**
     * Texture usage. // TODO: Move into creation.
     */
    public get usage(): TextureUsage {
        return this.mUsage;
    } set usage(pValue: TextureUsage) {
        this.mUsage = pValue;

        // Request update.
        this.triggerAutoUpdate(GpuObjectReason.Setting);
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pGpu: GpuDevice, pParameter: TextureMemoryLayoutParameter) {
        super(pGpu, pParameter);

        this.mBindType = pParameter.bindType;
        this.mDimension = pParameter.dimension;
        this.mFormat = pParameter.format;
        this.mUsage = TextureUsage.None;
        this.mMultisampled = pParameter.multisampled;
    }

    /**
     * Create canvas texture.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     */
    public createCanvasTexture(pWidth: number, pHeight: number): CanvasTexture {
        // Create and set canvas sizes.
        const lCanvasTexture: CanvasTexture = new CanvasTexture(this.device, this);
        lCanvasTexture.width = pWidth;
        lCanvasTexture.height = pHeight;

        return lCanvasTexture;
    }

    /**
     * Create frame buffer texture.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pDepth - Texture depth.
     */
    public createFrameBufferTexture(pWidth: number, pHeight: number, pDepth: number): FrameBufferTexture {
        // Create and set frame buffer sizes.
        const lFrameBufferTexture: FrameBufferTexture = new FrameBufferTexture(this.device, this);
        lFrameBufferTexture.width = pWidth;
        lFrameBufferTexture.height = pHeight;
        lFrameBufferTexture.depth = pDepth;

        return lFrameBufferTexture;
    }

    /**
     * Create texture from images.
     * @param pSourceList - Image source list.
     */
    public async createImageTexture(...pSourceList: Array<string>): Promise<ImageTexture> {
        // Create and load images async.
        const lImageTexture: ImageTexture = new ImageTexture(this.device, this);
        await lImageTexture.load(...pSourceList);

        return lImageTexture;
    }

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     */
    public createVideoTexture(pSource: string): VideoTexture {
        // Create and set video source.
        const lVideoTexture: VideoTexture = new VideoTexture(this.device, this);
        lVideoTexture.source = pSource;

        return lVideoTexture;
    }
}

export interface TextureMemoryLayoutParameter extends MemoryLayoutParameter {
    dimension: TextureDimension;
    format: TextureFormat;
    bindType: TextureBindType;
    multisampled: boolean;
}