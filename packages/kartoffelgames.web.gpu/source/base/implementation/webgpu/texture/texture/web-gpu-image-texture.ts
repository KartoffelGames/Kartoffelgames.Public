import { ImageTexture } from '../../../../base/texture/image-texture';
import { WebGpuTextureMemoryLayout } from '../../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuImageTexture extends ImageTexture<WebGpuTypes, GPUTexture> {
    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture layout.
     */
    public constructor(pDevice: WebGpuDevice, pLayout: WebGpuTextureMemoryLayout) {
        super(pDevice, pLayout);
    }

    /**
     * Destroy native image texture.
     * @param pNativeObject - Native image texture.
     */
    protected override destroyNative(pNativeObject: GPUTexture): void {
        pNativeObject.destroy();
    }

    /**
     * Generate native gpu object.
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
            dimension: lDimension
        });

        // Load images into texture.
        for (let lImageIndex: number = 0; lImageIndex < this.images.length; lImageIndex++) {
            const lBitmap: ImageBitmap = this.images[lImageIndex];

            // Copy image into depth layer.
            this.device.gpuDeviceReference.queue.copyExternalImageToTexture(
                { source: lBitmap },
                { texture: this.native, origin: [0, 0, lImageIndex] },
                [lBitmap.width, lBitmap.height]
            );
        }

        return lTexture;
    }
}