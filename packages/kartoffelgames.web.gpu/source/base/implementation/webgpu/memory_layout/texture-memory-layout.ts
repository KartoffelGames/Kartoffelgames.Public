import { TextureMemoryLayout, TextureMemoryLayoutParameter } from '../../../base/memory_layout/texture-memory-layout';
import { FrameBufferTexture } from '../../../base/texture/frame-buffer-texture';
import { ImageTexture } from '../../../base/texture/image-texture';
import { WebGpuDevice } from '../web-gpu-device';

export class WebGpuTextureMemoryLayout extends TextureMemoryLayout<WebGpuDevice> {
    /**
     * Constructor.
     * @param pParameter - Texture memory layout.
     */
    public constructor(pGpu: WebGpuDevice, pParameter: TextureMemoryLayoutParameter) {
        super(pGpu, pParameter);
    }

    protected override createCanvasFrameBuffer(pCanvas: HTMLCanvasElement): FrameBufferTexture<WebGpuDevice> {
        throw new Error('Method not implemented.');
    }

    protected override createImageFromSource(...pSourceList: string[]): Promise<ImageTexture<WebGpuDevice>> {
        throw new Error('Method not implemented.');
    }

    protected override createSizedFrameBuffer(pWidth: number, pHeight: number, pDepth: number): FrameBufferTexture<WebGpuDevice> {
        throw new Error('Method not implemented.');
    }
}