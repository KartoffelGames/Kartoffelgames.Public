import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { GpuObjectLifeTime } from '../gpu/object/gpu-object-life-time.enum';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { TextureMemoryLayout, TextureMemoryLayoutInvalidationType } from '../memory_layout/texture/texture-memory-layout';
import { BaseTexture } from './base-texture';

export class CanvasTexture extends BaseTexture<CanvasTextureInvalidationType> implements IGpuObjectNative<GPUTextureView> {
    private readonly mCanvas: HTMLCanvasElement;
    private mContext: GPUCanvasContext | null;

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
        // Height autoapplies. No need to trigger invalidation.
        this.mCanvas.height = pValue;
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mCanvas.width;
    } set width(pValue: number) {
        // Width autoapplies. No need to trigger invalidation.
        this.mCanvas.width = pValue;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture layout.
     * @param pCanvas - Canvas of texture.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout, pCanvas: HTMLCanvasElement) {
        super(pDevice, pLayout, GpuObjectLifeTime.Frame);

        // Set canvas reference.
        this.mCanvas = pCanvas;
        this.mContext = null;

        // Set defaults.
        this.height = 1;
        this.width = 1;

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(CanvasTextureInvalidationType.Layout);
        }, [TextureMemoryLayoutInvalidationType.Format]);
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroyNative(_pNativeObject: GPUTextureView, pReasons: GpuObjectInvalidationReasons<CanvasTextureInvalidationType>): void {
        // Context is only invalid on deconstruct or layout has changes.
        const lContextInvalid: boolean = pReasons.deconstruct || pReasons.has(CanvasTextureInvalidationType.Layout) || pReasons.has(CanvasTextureInvalidationType.Usage);

        // Only destroy context when child data/layout has changes.
        if (lContextInvalid) {
            // Destory context.
            this.mContext!.unconfigure();
            this.mContext = null;
        }

        // Native view can not be destroyed.
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generateNative(pReasons: GpuObjectInvalidationReasons<CanvasTextureInvalidationType>): GPUTextureView {
        // Invalidate for frame change.
        if (pReasons.lifeTimeReached) {
            this.invalidate(CanvasTextureInvalidationType.Frame);
        }

        // Read canvas format.
        const lFormat: GPUTextureFormat = this.layout.format as GPUTextureFormat;

        // Configure new context when not alread configured or destroyed.
        if (!this.mContext) {
            // Create and configure canvas context.
            this.mContext = <GPUCanvasContext><any>this.canvas.getContext('webgpu');
            this.mContext.configure({
                device: this.device.gpu,
                format: lFormat,
                usage: this.usage,
                alphaMode: 'opaque'
            });
        }

        // Read current texture of canvas. Needs to be retrieved for each frame.
        const lTexture: GPUTexture = this.mContext.getCurrentTexture();

        // force a two dimensional view.
        return lTexture.createView({
            format: lFormat,
            dimension: '2d'
        });
    }

    /**
     * On usage extened. Triggers a texture rebuild.
     */
    protected override onUsageExtend(): void {
        this.invalidate(CanvasTextureInvalidationType.Usage);
    }
}

export enum CanvasTextureInvalidationType {
    Layout = 'LayoutChange',
    Frame = 'FrameChange',
    Usage = 'UsageChange'
}