import { GpuNativeObject } from '../gpu-native-object';
import { WebGpuDevice } from '../web-gpu-device';

export class WebGpuExternalTexture extends GpuNativeObject<GPUExternalTexture> {
    private readonly mVideoElement: HTMLVideoElement;

    /**
     * Loaded video element.
     */
    public get video(): HTMLVideoElement {
        return this.mVideoElement;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: WebGpuDevice, pVideo: HTMLVideoElement) {
        super(pGpu, 'EXTERNAL_TEXTURE');

        this.mVideoElement = pVideo;
    }
    
    /**
     * Generate new external texture.
     */
    protected generate(): GPUExternalTexture {
        return this.gpu.device.importExternalTexture({
            label: this.label,
            source: this.mVideoElement,
            colorSpace: 'srgb'
        });
    }
}