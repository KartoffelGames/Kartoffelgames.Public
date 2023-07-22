import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class VideoTexture<TGpuTypes extends GpuTypes, TNative> extends GpuObject<TGpuTypes, TNative> {
    private readonly mLoop: boolean;
    private readonly mMemoryLayout: TGpuTypes['textureMemoryLayout'];
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
    public get memoryLayout(): TGpuTypes['textureMemoryLayout'] {
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
    public constructor(pDevice: TGpuTypes['gpuDevice'], pLayout: TGpuTypes['textureMemoryLayout'], pSource: string, pLoop: boolean = false) {
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
    public async create(pSource: string, pLoop: boolean): Promise<TGpuTypes['videoTexture']> {
        return this.createVideoTexture(pSource, pLoop);
    }

    /**
     * Create texture from a video source.
     * @param pSource - Video source.
     * @param pLoop - Loop video.
     */
    public abstract createVideoTexture(pSource: string, pLoop: boolean): Promise<TGpuTypes['videoTexture']>;

    /**
     * Pause video.
     */
    public abstract pause(): void;

    /**
     * Play video.
     */
    public abstract play(): void;
}