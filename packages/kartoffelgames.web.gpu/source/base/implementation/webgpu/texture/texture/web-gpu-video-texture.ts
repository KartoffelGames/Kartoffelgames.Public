import { VideoTexture } from '../../../../base/texture/video-texture';
import { WebGpuTextureMemoryLayout } from '../../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuVideoTexture extends VideoTexture<WebGpuTypes, GPUExternalTexture> {
    private readonly mVideo: HTMLVideoElement;

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mVideo.videoHeight;
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
     * @param pLayout - Texture layout.
     */
    public constructor(pDevice: WebGpuDevice, pLayout: WebGpuTextureMemoryLayout) {
        super(pDevice, pLayout);

        // Create video.
        const lVideo = new HTMLVideoElement();
        lVideo.loop = false;
        lVideo.muted = true; // Allways muted.

        this.mVideo = lVideo;
    }

    /**
     * Pause video.
     */
    public override pause(): void {
        this.mVideo.pause();
    }

    /**
     * Play video.
     */
    public override play(): void {
        this.mVideo.play();
    }

    /**
     * Destory native video texture element.
     * @param _pNativeObject - Native video texture.
     */
    protected override destroyNative(_pNativeObject: GPUExternalTexture): void {
        // Nothing to destroy. Sad :(
    }

    /**
     * Generate native element.
     */
    protected override generate(): GPUExternalTexture {
        return this.device.device.importExternalTexture({
            label: 'External-Texture',
            source: this.mVideo,
            colorSpace: 'srgb'
        });
    }
}