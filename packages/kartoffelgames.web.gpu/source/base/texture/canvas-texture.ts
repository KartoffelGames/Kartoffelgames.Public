import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { GpuObjectUpdateReason, UpdateReason } from '../gpu/gpu-object-update-reason';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';

export class CanvasTexture extends GpuNativeObject<GPUTextureView> {
    private readonly mCanvas: HTMLCanvasElement;
    private mContext: GPUCanvasContext | null;
    private readonly mMemoryLayout: TextureMemoryLayout;

    /**
     * HTML canvas element.
     */
    public get canvas(): HTMLCanvasElement {
        return this.mCanvas;
    }

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mCanvas.height;
    } set height(pValue: number) {
        this.mCanvas.height = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Textures memory layout.
     */
    public get memoryLayout(): TextureMemoryLayout {
        return this.mMemoryLayout;
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mCanvas.width;
    } set width(pValue: number) {
        this.mCanvas.width = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pCanvas - Canvas of texture.
     * @param pLayout - Texture layout.
     * @param pDepth - Depth of texture. Can only be set to one.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout) {
        super(pDevice, NativeObjectLifeTime.Frame);

        // Set canvas reference.
        this.mCanvas = document.createElement('canvas');
        this.mMemoryLayout = pLayout;
        this.mContext = null;

        // Set defaults.
        this.height = 1;
        this.width = 1;

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroy(_pNativeObject: GPUTextureView, pReasons: GpuObjectUpdateReason): void {
        // Only destroy context when child data/layout has changes.
        if (pReasons.has(UpdateReason.ChildData)) {
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
            this.mContext = <GPUCanvasContext><any>this.canvas.getContext('webgpu');
            this.mContext.configure({
                device: this.device.gpu,
                format: this.factory.formatFromLayout(this.memoryLayout),
                usage: this.factory.usageFromLayout(this.memoryLayout),
                alphaMode: 'opaque'
            });
        }

        // Create texture and save it for destorying later.
        const lTexture: GPUTexture = this.mContext.getCurrentTexture();

        // TODO: View descriptor.
        return lTexture.createView();
    }
}