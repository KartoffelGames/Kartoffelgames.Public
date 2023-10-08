import { BaseNativeGenerator, NativeObjectLifeTime } from '../../base/native_generator/base-native-generator';
import { UpdateReason } from '../../base/gpu/gpu-object-update-reason';
import { CanvasTexture } from '../../base/texture/canvas-texture';
import { NativeWebGpuMap, WebGpuGeneratorFactory } from '../web-gpu-generator-factory';

export class WebGpuCanvasTextureGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'canvasTexture'> {
    private mContext: GPUCanvasContext | null;

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
    public constructor(pFactory: WebGpuGeneratorFactory, pBaseObject: CanvasTexture) {
        super(pFactory, pBaseObject);

        this.mContext = null;
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroy(_pNativeObject: GPUTextureView): void {
        // Only destroy context when child data/layout has changes.
        if (this.updateReasons.has(UpdateReason.ChildData)) {
            // Destory context.
            this.mContext?.unconfigure();
            this.mContext = null;
        }

        // Nothing else to destroy.
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generate(): GPUTextureView {
        // Configure context.
        if (!this.mContext) {
            // Create and configure canvas context.
            this.mContext = <GPUCanvasContext><any>this.gpuObject.canvas.getContext('webgpu');
            this.mContext.configure({
                device: this.factory.gpu,
                format: this.factory.formatFromLayout(this.gpuObject.memoryLayout),
                usage: this.factory.usageFromLayout(this.gpuObject.memoryLayout),
                alphaMode: 'opaque'
            });
        }

        // Create texture and save it for destorying later.
        const lTexture: GPUTexture = this.mContext.getCurrentTexture();

        // TODO: View descriptor.
        return lTexture.createView();
    }
}