import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectLifeTime } from '../gpu/object/gpu-object';
import { GpuObjectInvalidationReason } from '../gpu/object/gpu-object-invalidation-reasons';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';

export class VideoTexture extends GpuObject<GPUExternalTexture> implements IGpuObjectNative<GPUExternalTexture> {
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
     * Native gpu object.
     */
    public override get native(): GPUExternalTexture {
        return super.native;
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
     * Video element.
     */
    public get video(): HTMLVideoElement {
        return this.mVideo;
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
        super(pDevice, GpuObjectLifeTime.Persistent);

        // Create video.
        this.mVideo = new HTMLVideoElement();
        this.mVideo.loop = false;
        this.mVideo.muted = true; // Allways muted.

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.triggerAutoUpdate(GpuObjectInvalidationReason.ChildData);
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

    /**
     * Generate native canvas texture view.
     */
    protected override generateNative(): GPUExternalTexture {
        return this.device.gpu.importExternalTexture({
            label: 'External-Texture',
            source: this.video,
            colorSpace: 'srgb'
        });
    }
}