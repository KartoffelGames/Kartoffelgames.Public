import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { TextureMemoryLayout } from '../memory_layout/texture-memory-layout';

export class VideoTexture extends GpuObject {
    private readonly mMemoryLayout: TextureMemoryLayout;
    private readonly mVideo: HTMLVideoElement;

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mVideo.videoHeight;
    }

    /**
     * If video should be looped.
     */
    public get loop(): boolean {
        return this.mVideo.loop;
    } set loop(pValue: boolean) {
        this.mVideo.loop = pValue;
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
        return this.mVideo.src;
    } set source(pValue: string) {
        this.mVideo.src = pValue;
    }

    /**
     * Video width.
     */
    public get width(): number {
        return this.mVideo.videoWidth;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture memory layout.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout) {
        super(pDevice);

        // Fixed values.
        this.mMemoryLayout = pLayout;

        // Create video.
        this.mVideo = new HTMLVideoElement();
        this.mVideo.loop = false;
        this.mVideo.muted = true; // Allways muted.

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate();
        });
    }

    /**
     * Pause video.
     */
    public pause(): void {
        this.mVideo.pause();
    }

    /**
     * Play video.
     */
    public play(): void {
        this.mVideo.play();
    }
}