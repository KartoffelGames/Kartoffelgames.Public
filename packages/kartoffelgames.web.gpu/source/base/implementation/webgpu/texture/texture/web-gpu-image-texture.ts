import { ImageTexture } from '../../../../base/texture/image-texture';
import { WebGpuTextureMemoryLayout } from '../../memory_layout/web-gpu-texture-memory-layout';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuImageTexture extends ImageTexture<WebGpuTypes, GPUTextureView> {
    private mInternalTexture: GPUTexture | null;

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture layout.
     */
    public constructor(pDevice: WebGpuDevice, pLayout: WebGpuTextureMemoryLayout) {
        super(pDevice, pLayout);

        this.mInternalTexture = null;
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroyNative(_pNativeObject: GPUTextureView): void {
        this.mInternalTexture?.destroy();
    }

    /**
     * Generate native gpu object.
     */
    protected override generate(): GPUTextureView {
        // Create texture with set size, format and usage. Save it for destorying later.
        this.mInternalTexture = this.device.gpuDeviceReference.createTexture({
            label: 'Frame-Buffer-Texture',
            size: [this.width, this.height, this.depth],
            format: this.memoryLayout.formatFromLayout(),
            usage: this.memoryLayout.usageFromLayout(),
            dimension: this.memoryLayout.dimensionFromLayout()
        });

        // Load images into texture.
        for (let lImageIndex: number = 0; lImageIndex < this.images.length; lImageIndex++) {
            const lBitmap: ImageBitmap = this.images[lImageIndex];

            // Copy image into depth layer.
            this.device.gpuDeviceReference.queue.copyExternalImageToTexture(
                { source: lBitmap },
                { texture: this.mInternalTexture, origin: [0, 0, lImageIndex] },
                [lBitmap.width, lBitmap.height]
            );
        }

        // TODO: View descriptor.
        return this.mInternalTexture.createView();
    }
}