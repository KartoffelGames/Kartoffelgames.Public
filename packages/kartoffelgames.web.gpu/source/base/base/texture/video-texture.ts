import { ITextureMemoryLayout } from '../../interface/memory_layout/i-texture-memory-layout.interface';
import { IVideoTexture } from '../../interface/texture/i-video-texture.interface';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class VideoTexture<TGpu extends GpuDevice, TNative> extends GpuObject<TGpu, TNative> {
    private readonly mLoop: boolean;
    private readonly mMemoryLayout: ITextureMemoryLayout;
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
     * If video should be looped.
     */
    public get loop(): boolean {
        return this.mLoop;
    }

    /**
     * Textures memory layout.
     */
    public get memoryLayout(): ITextureMemoryLayout {
        return this.mMemoryLayout;
    }

    /**
     * Video source.
     */
    public get source(): string {
        return this.mSource;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture memory layout.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: TGpu, pLayout: ITextureMemoryLayout, pSource: string, pLoop: boolean = false) {
        super(pDevice);

        // Fixed values.
        this.mMemoryLayout = pLayout;
        this.mSource = pSource;
        this.mLoop = pLoop;
    }

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     * @param pLoop - Loop video.
     */
    public async create(pSource: string, pLoop: boolean): Promise<IVideoTexture> {
        return this.createVideoTexture(pSource, pLoop);
    }

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     * @param pLoop - Loop video.
     */
    public abstract createVideoTexture(pSource: string, pLoop: boolean): Promise<IVideoTexture>;

    /**
     * Pause video.
     */
    public abstract pause(): void;

    /**
     * Play video.
     */
    public abstract play(): void;
}