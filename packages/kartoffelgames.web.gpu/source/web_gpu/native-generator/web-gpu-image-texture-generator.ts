import { BaseNativeGenerator, NativeObjectLifeTime } from '../../base/native_generator/base-native-generator';
import { ImageTexture } from '../../base/texture/image-texture';
import { NativeWebGpuMap, WebGpuGeneratorFactory } from '../web-gpu-generator-factory';

export class WebGpuImageTextureGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'imageTexture'> {
    private mTexture: GPUTexture | null;

    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Constructor.
     * @param pBaseObject - Base object containing all values.
     * @param pGeneratorFactory - Generator factory.
     */
    public constructor(pFactory: WebGpuGeneratorFactory, pBaseObject: ImageTexture) {
        super(pFactory, pBaseObject);

        this.mTexture = null;
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroy(_pNativeObject: GPUTextureView): void {
        this.mTexture?.destroy();
        this.mTexture = null;
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generate(): GPUTextureView {
        // Create texture with set size, format and usage. Save it for destorying later.
        this.mTexture = this.factory.gpu.createTexture({
            label: 'Frame-Buffer-Texture',
            size: [this.gpuObject.width, this.gpuObject.height, this.gpuObject.depth],
            format: this.factory.formatFromLayout(this.gpuObject.memoryLayout),
            usage: this.factory.usageFromLayout(this.gpuObject.memoryLayout),
            dimension: this.factory.dimensionFromLayout(this.gpuObject.memoryLayout),
        });

        // Load images into texture.
        for (let lImageIndex: number = 0; lImageIndex < this.gpuObject.images.length; lImageIndex++) {
            const lBitmap: ImageBitmap = this.gpuObject.images[lImageIndex];

            // Copy image into depth layer.
            this.factory.gpu.queue.copyExternalImageToTexture(
                { source: lBitmap },
                { texture: this.mTexture, origin: [0, 0, lImageIndex] },
                [lBitmap.width, lBitmap.height]
            );
        }

        // TODO: View descriptor.
        return this.mTexture.createView();
    }
}