import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';
import { GpuTexture } from './gpu-texture';

// TODO: Does not need layout. Is allways 2d with preferred format and can only be rendered and copied into.
// TODO: Invalidates every frame
// Exposes a static useAs(): TextureView without any parameters.

export class CanvasTexture extends GpuTexture<CanvasTextureInvalidationType> implements IGpuObjectNative<GPUTextureView> {
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
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mCanvas.width;
    } set width(pValue: number) {
        this.mCanvas.width = pValue;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture layout.
     * @param pCanvas - Canvas of texture.
     */
    public constructor(pDevice: GpuDevice, pCanvas: HTMLCanvasElement) {
        super(pDevice, pLayout);

        // Set canvas reference.
        this.mCanvas = pCanvas;
        this.mContext = null;

        // Set defaults.
        this.height = 1;
        this.width = 1;

        // TODO: Remove it on deconstruct.
        // Rebuild view on every frame.
        this.device.addFrameChangeListener(() => {
            this.invalidate(CanvasTextureInvalidationType.NativeRebuild);
        });
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroyNative(_pNativeObject: GPUTextureView, pReasons: GpuObjectInvalidationReasons<CanvasTextureInvalidationType>): void {
        // Context is only invalid on deconstruct or layout has changes.
        const lContextInvalid: boolean = pReasons.deconstruct || pReasons.has(CanvasTextureInvalidationType.ContextRebuild);

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
        this.invalidate(CanvasTextureInvalidationType.NativeRebuild);

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
    protected override onSettingChange(): void {
        this.invalidate(CanvasTextureInvalidationType.ContextRebuild);
    }

    /**
     * Do nothing when view and context does not need to be updated.
     * 
     * @param _pNative - Native 
     * @param pReasons - Invalidation reason.
     * 
     * @returns false when a rebuild must be done. 
     */
    protected override updateNative(_pNative: GPUTextureView, pReasons: GpuObjectInvalidationReasons<CanvasTextureInvalidationType>): boolean {
        // Cant update on native rebuild.
        if (pReasons.has(CanvasTextureInvalidationType.NativeRebuild)) {
            return false;
        }

        // Cant update on context rebuild.
        if (pReasons.has(CanvasTextureInvalidationType.ContextRebuild)) {
            return false;
        }

        return true;
    }

}

export enum CanvasTextureInvalidationType {
    ContextRebuild = 'ContextRebuild',
    NativeRebuild = 'NativeRebuild'
}