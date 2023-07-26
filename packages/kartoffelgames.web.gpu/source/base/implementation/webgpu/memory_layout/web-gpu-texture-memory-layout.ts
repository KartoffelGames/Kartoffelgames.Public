import { TextureMemoryLayout, TextureMemoryLayoutParameter } from '../../../base/memory_layout/texture-memory-layout';
import { WebGpuCanvasTexture } from '../texture/texture/web-gpu-canvas-texture';
import { WebGpuFrameBufferTexture } from '../texture/texture/web-gpu-frame-buffer-texture';
import { WebGpuImageTexture } from '../texture/texture/web-gpu-image-texture';
import { WebGpuVideoTexture } from '../texture/texture/web-gpu-video-texture';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';

export class WebGpuTextureMemoryLayout extends TextureMemoryLayout<WebGpuTypes> {
    /**
     * Constructor.
     * @param pDevice - Device reference..
     * @param pParameter - Creation parameter.
     */
    public constructor(pDevice: WebGpuDevice, pParameter: TextureMemoryLayoutParameter) {
        super(pDevice, pParameter);
    }

    /**
     * Create canvas frame buffer.
     * @param pCanvas - Canvas element.
     */
    protected override createCanvasFrameBuffer(pCanvas: HTMLCanvasElement): WebGpuCanvasTexture {
        return new WebGpuCanvasTexture(this.device, pCanvas, this, 1);
    }

    /**
     * Create image texture from sources.
     * Sources need to have the same dimensions to be loaded into one texture.
     * Every source gets loaded into own layer.
     * @param pSourceList - Image source list.
     */
    protected override async createImageFromSource(...pSourceList: Array<string>): Promise<WebGpuImageTexture> {
        const lTexture: WebGpuImageTexture = new WebGpuImageTexture(this.device, this);
        await lTexture.load(...pSourceList);

        return lTexture;
    }

    /**
     * Create sized frame buffer from this layout.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height
     * @param pDepth - Texture depth.
     */
    protected override createSizedFrameBuffer(pWidth: number, pHeight: number, pDepth: number): WebGpuFrameBufferTexture {
        const lTexture: WebGpuFrameBufferTexture = new WebGpuFrameBufferTexture(this.device, this, pDepth);
        lTexture.height = pHeight;
        lTexture.width = pWidth;

        return lTexture;
    }

    /**
     * Create texture from video source.
     * @param pSource - Video source.
     */
    protected override async createVideoTexture(pSource: string): Promise<WebGpuVideoTexture> {
        const lTexture: WebGpuVideoTexture = new WebGpuVideoTexture(this.device, this);
        lTexture.source = pSource;

        return lTexture;
    }
}