import { FrameBufferTexture } from '../../../../base/texture/frame-buffer-texture';
import { WebGpuTextureMemoryLayout } from '../../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuFrameBufferTexture extends FrameBufferTexture<WebGpuTypes, GPUTextureView> {
    private mInternalTexture: GPUTexture | null;

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pFormat - Texture format.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: WebGpuDevice, pLayout: WebGpuTextureMemoryLayout, pDepth: number = 1) {
        super(pDevice, pLayout, pDepth);

        this.mInternalTexture = null;
    }

    /**
     * Destory web gpu native gpu object.
     * @param _pNativeObject - Native object. 
     */
    protected override destroyNative(_pNativeObject: GPUTextureView): void {
        this.mInternalTexture?.destroy();
    }

    /**
     * Generate native texture.
     */
    protected override generate(): GPUTextureView {
        // Create texture with set size, format and usage. Save it for destorying later.
        this.mInternalTexture = this.device.gpuDeviceReference.createTexture({
            label: 'Frame-Buffer-Texture',
            size: [this.width, this.height, this.depth],
            format: this.memoryLayout.formatFromLayout(),
            usage: this.memoryLayout.usageFromLayout(),
            dimension: this.memoryLayout.dimensionFromLayout(),
            sampleCount: this.multiSampleLevel
        });

        // TODO: View descriptor.
        return this.mInternalTexture.createView();
    }
}