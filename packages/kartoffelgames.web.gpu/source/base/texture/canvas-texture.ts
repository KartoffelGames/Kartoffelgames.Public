import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
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
        this.mCanvas.height = pValue;

        // Invalidate size.
        this.invalidate(CanvasTextureInvalidationType.Resize);
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mCanvas.width;
    } set width(pValue: number) {
        this.mCanvas.width = pValue;

        // Invalidate size.
        this.invalidate(CanvasTextureInvalidationType.Resize);
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture layout.
     * @param pCanvas - Canvas of texture.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout, pCanvas: HTMLCanvasElement) {
        super(pDevice, pLayout);

        // Set canvas reference.
        this.mCanvas = pCanvas;
        this.mContext = null;

        // Set defaults.
        this.height = 1;
        this.width = 1;

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(CanvasTextureInvalidationType.FormatChange);
        }, [TextureMemoryLayoutInvalidationType.Format]);

        // TODO: Remove it on deconstruct.
        // Rebuild view on every frame.
        this.device.addFrameChangeListener(() => {
            this.invalidate(CanvasTextureInvalidationType.ViewRebuild);
        });
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroyNative(_pNativeObject: GPUTextureView, pReasons: GpuObjectInvalidationReasons<CanvasTextureInvalidationType>): void {
        // Context is only invalid on deconstruct or layout has changes.
        const lContextInvalid: boolean = pReasons.deconstruct || pReasons.has(CanvasTextureInvalidationType.FormatChange) || pReasons.has(CanvasTextureInvalidationType.UsageExtended);

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
    protected override generateNative(): GPUTextureView {
        // Invalidate for frame change.
        this.invalidate(CanvasTextureInvalidationType.ViewRebuild);

        // Read canvas format.
        const lFormat: GPUTextureFormat = this.layout.format as GPUTextureFormat;

        // Configure new context when not alread configured or destroyed.
        if (!this.mContext) {
            // Invalidate bc. context neeeded to rebuild.
            this.invalidate(CanvasTextureInvalidationType.ContextRebuild);

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
        this.invalidate(CanvasTextureInvalidationType.UsageExtended);
    }

    /**
     * Do nothing when view and context does not need to be updated.
     * 
     * @param _pNative - Native 
     * @param pReasons - Invalidation reason.
     * 
     * @returns true when nothing was done. 
     */
    protected override updateNative(_pNative: GPUTextureView, pReasons: GpuObjectInvalidationReasons<CanvasTextureInvalidationType>): boolean {
        // Literally only "update" on resize.
        return pReasons.has(CanvasTextureInvalidationType.Resize) &&
            !pReasons.has(CanvasTextureInvalidationType.ViewRebuild) &&
            !pReasons.has(CanvasTextureInvalidationType.UsageExtended) &&
            !pReasons.has(CanvasTextureInvalidationType.FormatChange) &&
            !pReasons.deconstruct;
    }

}

export enum CanvasTextureInvalidationType {
    ContextRebuild = 'ContextRebuild',
    ViewRebuild = 'ViewRebuild',
    Resize = 'Resize',
    UsageExtended = 'UsageChange',
    FormatChange = 'FormatChange'
}