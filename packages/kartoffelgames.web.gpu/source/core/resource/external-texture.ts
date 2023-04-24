import { Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';

export class ExternalTexture extends GpuNativeObject<GPUExternalTexture> {
    private mVideoElement: HTMLVideoElement | null;

    /**
     * Loaded video element.
     */
    public get video(): HTMLVideoElement {
        if (!this.mVideoElement) {
            throw new Exception('No video element is loaded or old video is expired.', this);
        }

        return this.mVideoElement;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu) {
        super(pGpu, 'EXTERNAL_TEXTURE');
        this.mVideoElement = null;
    }

    /**
     * 
     * @param pSource - Video source.
     * @param pLoop - Loop video.
     * @param pMuted - Mute video.
     */
    public async load(pSource: string, pLoop: boolean = false, pMuted: boolean = false): Promise<void> {
        const lVideo = new HTMLVideoElement();
        lVideo.loop = pLoop;
        lVideo.muted = pMuted;
        lVideo.src = pSource;

        // Wait for resource load and pause right after.
        await lVideo.play();
        lVideo.pause();

        this.mVideoElement = lVideo;
    }

    /**
     * Generate new external texture.
     */
    protected generate(): GPUExternalTexture {
        if (!this.mVideoElement) {
            throw new Exception('No video element is loaded or old video is expired.', this);
        }

        return this.gpu.device.importExternalTexture({
            label: this.label,
            source: this.mVideoElement,
            colorSpace: 'srgb'
        });
    }
}