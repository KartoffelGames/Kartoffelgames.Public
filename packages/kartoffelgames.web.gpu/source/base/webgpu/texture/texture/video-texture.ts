import { WebGpuExternalTexture } from '../../../../abstraction_layer/webgpu/texture_resource/web-gpu-external-texture';
import { Base } from '../../../base/export.';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { GpuDevice } from '../../gpu-device';

export class VideoTexture extends Base.VideoTexture<GpuDevice, WebGpuExternalTexture> {
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
     * @param pFormat - Texture format.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: GpuDevice, pFormat: TextureFormat, pSource: string, pLoop: boolean = false) {
        super(pDevice, pFormat, pSource, pLoop);

        // Create video.
        const lVideo = new HTMLVideoElement();
        lVideo.loop = pLoop;
        lVideo.muted = true; // Allways looped.
        lVideo.src = pSource;

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
     * @param pNativeObject - Native video texture.
     */
    protected override destroyNative(pNativeObject: WebGpuExternalTexture): void {
        pNativeObject.destroy();
    }

    /**
     * Generate native element.
     */
    protected override generate(): WebGpuExternalTexture {
        return new WebGpuExternalTexture(this.device.native, this.mVideo);
    }
}