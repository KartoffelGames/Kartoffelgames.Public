import { Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';

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
        super(pGpu);
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
     * Destroy external texture.
     * @param _pNativeObject - Native object. 
     */
    protected async destroyNative(_pNativeObject: GPUExternalTexture): Promise<void> {
        // No action needed.
    }

    /**
     * Generate new external texture.
     */
    protected async generate(): Promise<GPUExternalTexture> {
        if (!this.mVideoElement) {
            throw new Exception('No video element is loaded or old video is expired.', this);
        }

        return this.gpu.device.importExternalTexture({
            source: this.mVideoElement,
            colorSpace: 'srgb'
        });
    }

    /**
     * Invalidate on expired texture.
     */
    protected override async validateState(): Promise<boolean> {
        return !!(this.generatedNative && !this.generatedNative.expired);
    }
}