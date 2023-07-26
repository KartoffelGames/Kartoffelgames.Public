import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class VideoTexture<TGpuTypes extends GpuTypes, TNative> extends GpuObject<TGpuTypes, TNative> {
    private mLoop: boolean;
    private readonly mMemoryLayout: TGpuTypes['textureMemoryLayout'];
    private mSource: string;

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
    } set loop(pValue: boolean) {
        this.mLoop = pValue;

        this.triggerAutoUpdate();
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
    } set source(pValue: string) {
        this.mSource = pValue;

        this.triggerAutoUpdate();
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture memory layout.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: TGpuTypes['gpuDevice'], pLayout: TGpuTypes['textureMemoryLayout']) {
        super(pDevice);

        // Fixed values.
        this.mMemoryLayout = pLayout;
        this.mLoop = false;
        this.mSource = '';
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