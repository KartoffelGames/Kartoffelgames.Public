import { FrameBufferTexture } from '../../../../base/texture/frame-buffer-texture';
import { WebGpuTextureMemoryLayout } from '../../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuFrameBufferTexture extends FrameBufferTexture<WebGpuTypes, GPUTexture> {
    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pFormat - Texture format.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: WebGpuDevice, pLayout: WebGpuTextureMemoryLayout, pDepth: number = 1) {
        super(pDevice, pLayout, pDepth);
    }

    /**
     * Destory web gpu native gpu object.
     * @param pNativeObject - Native object. 
     */
    protected override destroyNative(pNativeObject: GPUTexture): void {
        pNativeObject.destroy();
    }

    /**
     * Generate native texture.
     */
    protected override generate(): GPUTexture {
        // "Calculate" texture dimension from texture size. 
        let lDimension: GPUTextureDimension;
        if (this.width === 1 || this.height === 1) {
            lDimension = '1d';
        } else if (this.depth > 1) {
            lDimension = '3d';
        } else {
            lDimension = '2d';
        }

        // Create texture with set size, format and usage.
        const lTexture: GPUTexture = this.device.gpuDeviceReference.createTexture({
            label: 'Frame-Buffer-Texture',
            size: [this.width, this.height, this.depth],
            format: this.memoryLayout.formatFromLayout(),
            usage: this.memoryLayout.usageFromLayout(),
            dimension: lDimension,
            sampleCount: this.multiSampleLevel
        });

        return lTexture;
    }
}