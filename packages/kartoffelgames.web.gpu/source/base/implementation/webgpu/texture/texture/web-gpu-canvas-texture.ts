import { Exception } from '@kartoffelgames/core.data';
import { FrameBufferTexture } from '../../../../base/texture/frame-buffer-texture';
import { WebGpuTextureMemoryLayout } from '../../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuCanvasTexture extends FrameBufferTexture<WebGpuTypes, GPUTexture> {
    private readonly mCanvas: HTMLCanvasElement;
    private readonly mContext: GPUCanvasContext;

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pCanvas - Canvas of texture.
     * @param pLayout - Texture layout.
     * @param pDepth - Depth of texture. Can only be set to one.
     */
    public constructor(pDevice: WebGpuDevice, pCanvas: HTMLCanvasElement, pLayout: WebGpuTextureMemoryLayout, pDepth: number) {
        super(pDevice, pLayout, pDepth);

        // Restrict canvas to single layer.
        if (pDepth !== 1) {
            throw new Exception('Canvas texture cant have multiple depth layer.', this);
        }

        this.mCanvas = pCanvas;

        // Get and configure context.
        this.mContext = <GPUCanvasContext><any>pCanvas.getContext('webgpu')!;
        this.mContext.configure({
            device: this.device.gpuDeviceReference,
            format: pLayout.formatFromLayout(),
            usage: pLayout.usageFromLayout(),
            alphaMode: 'opaque'
        });
    }

    /**
     * Destory texture object.
     * @param pNativeObject - Native canvas texture.
     */
    protected override destroyNative(pNativeObject: GPUTexture): void {
        pNativeObject.destroy();
    }

    /**
     * Generate native web gpu canvas texture.
     */
    protected override generate(): GPUTexture {
        // Update size.
        if (this.mCanvas.width !== this.width || this.mCanvas.height !== this.height) {
            this.mCanvas.width = this.width;
            this.mCanvas.height = this.height;
        }

        return this.mContext.getCurrentTexture();
    }
}