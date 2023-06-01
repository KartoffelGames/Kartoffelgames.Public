import { TextureFormat } from '../../constant/texture-format.enum';
import { IVideoTexture } from '../../interface/texture/i-video-texture.interface';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class VideoTexture<TGpu extends GpuDevice, TNative extends object> extends GpuObject<TGpu, TNative> implements IVideoTexture {
    private readonly mFormat: TextureFormat;
    private readonly mSource: string;

    /**
     * Texture height.
     */
    public abstract readonly height: number;

    /**
     * Texture width.
     */
    public abstract readonly width: number;

    /**
     * Texture format.
     */
    public get format(): TextureFormat {
        return this.mFormat;
    }

    /**
     * Video source.
     */
    public get source(): string {
        return this.mSource;
    }

    /**
     * Constructor.
     * @param pGpu - Device.
     * @param pFormat - Texture format.
     * @param pDepth - Texture depth.
     */
    public constructor(pGpu: TGpu, pFormat: TextureFormat, pSource: string) {
        super(pGpu);

        // Fixed values.
        this.mSource = pSource;
        this.mFormat = pFormat;
    }

    /**
     * Pause video.
     */
    public abstract pause(): void;

    /**
     * Play video.
     */
    public abstract play(): void;
}