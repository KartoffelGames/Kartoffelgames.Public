import { IVideoTexture } from '../../interface/texture/i-video-texture.interface';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { TextureMemoryLayout } from '../memory_layout/texture-memory-layout';

export abstract class VideoTexture<TGpu extends GpuDevice, TNative extends object> extends GpuObject<TGpu, TNative> implements IVideoTexture {
    private readonly mLoop: boolean;
    private readonly mMemoryLayout: TextureMemoryLayout;
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
    public get memoryLayout(): TextureMemoryLayout {
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
    public constructor(pDevice: TGpu, pLayout: TextureMemoryLayout, pSource: string, pLoop: boolean = false) {
        super(pDevice);

        // Fixed values.
        this.mMemoryLayout = pLayout;
        this.mSource = pSource;
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