import { TextureFormat } from '../../constant/texture-format.enum';
import { IVideoTexture } from '../../interface/texture/i-video-texture.interface';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class VideoTexture<TGpu extends GpuDevice, TNative extends object> extends GpuObject<TGpu, TNative> implements IVideoTexture {
    private readonly mFormat: TextureFormat;
    private readonly mLoop: boolean;
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
     * If video should be looped.
     */
    public get loop(): boolean {
        return this.mLoop;
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
    public constructor(pGpu: TGpu, pFormat: TextureFormat, pSource: string, pLoop: boolean = false) {
        super(pGpu);

        // Fixed values.
        this.mSource = pSource;
        this.mFormat = pFormat;
        this.mLoop = pLoop;
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