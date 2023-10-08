import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { FrameBufferTexture } from '../../../texture/frame-buffer-texture';
import { NativeWebGpuMap, WebGpuGeneratorFactory } from '../web-gpu-generator-factory';

export class WebGpuFramebufferTextureGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'frameBufferTexture'> {
    private mTexture: GPUTexture | null;

    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Frame;
    }

    /**
     * Constructor.
     * @param pBaseObject - Base object containing all values.
     * @param pGeneratorFactory - Generator factory.
     */
    public constructor(pFactory: WebGpuGeneratorFactory, pBaseObject: FrameBufferTexture) {
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
        // Configure context.
        if (!this.mTexture) {
            // Create and configure canvas context.
            this.mTexture = this.factory.gpu.createTexture({
                label: 'Frame-Buffer-Texture',
                size: [this.gpuObject.width, this.gpuObject.height, this.gpuObject.depth],
                format: this.factory.formatFromLayout(this.gpuObject.memoryLayout),
                usage: this.factory.usageFromLayout(this.gpuObject.memoryLayout),
                dimension: this.factory.dimensionFromLayout(this.gpuObject.memoryLayout),
                sampleCount: this.gpuObject.multiSampleLevel
            });
        }

        // TODO: View descriptor.
        return this.mTexture.createView();
    }
}