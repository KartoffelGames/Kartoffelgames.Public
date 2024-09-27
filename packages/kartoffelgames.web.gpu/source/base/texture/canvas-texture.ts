import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectLifeTime } from '../gpu/object/gpu-object';
import { GpuObjectInvalidationReasons, GpuObjectInvalidationReason } from '../gpu/object/gpu-object-invalidation-reasons';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';

export class CanvasTexture extends GpuObject<GPUTextureView> implements IGpuObjectNative<GPUTextureView> {
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
        this.triggerAutoUpdate(GpuObjectInvalidationReason.Setting);
    }

    /**
     * Textures memory layout.
     */
    public get memoryLayout(): TextureMemoryLayout {
        return this.mMemoryLayout;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUTextureView {
        return super.native;
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mCanvas.width;
    } set width(pValue: number) {
        this.mCanvas.width = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(GpuObjectInvalidationReason.Setting);
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture layout.
     * @param pCanvas - Canvas of texture.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout, pCanvas: HTMLCanvasElement) {
        super(pDevice, GpuObjectLifeTime.Frame);

        // Set canvas reference.
        this.mCanvas = pCanvas;
        this.mMemoryLayout = pLayout;
        this.mContext = null;

        // Set defaults.
        this.height = 1;
        this.width = 1;

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.triggerAutoUpdate(GpuObjectInvalidationReason.ChildData);
        });
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroyNative(_pNativeObject: GPUTextureView, pReasons: GpuObjectInvalidationReasons): void {
        // Only destroy context when child data/layout has changes.
        if (pReasons.has(GpuObjectInvalidationReason.ChildData)) {
            // Destory context.
            this.mContext?.unconfigure();
            this.mContext = null;
        }

        // Nothing else to destroy.
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generateNative(): GPUTextureView {
        // TODO: Add invalidation context to generate to better understand new generating.
        const lFormat: GPUTextureFormat = this.memoryLayout.format as GPUTextureFormat;

        // Configure context.
        if (!this.mContext) {
            // Create and configure canvas context.
            this.mContext = <GPUCanvasContext><any>this.canvas.getContext('webgpu');
            this.mContext.configure({
                device: this.device.gpu,
                format: lFormat,
                usage: this.memoryLayout.usage,
                alphaMode: 'opaque'
            });
        }

        // Create texture and save it for destorying later.
        const lTexture: GPUTexture = this.mContext.getCurrentTexture();

        // force a two dimensional view.
        return lTexture.createView({
            format: lFormat,
            dimension: '2d'
        });
    }
}