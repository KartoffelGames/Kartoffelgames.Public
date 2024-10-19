import { TextureDimension } from '../constant/texture-dimension.enum';
import { TextureFormat } from '../constant/texture-format.enum';
import { TextureUsage } from '../constant/texture-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';

/**
 * Canvas texture. Can only be used as render attachment or to be copied into.
 * Allways 2D with preferred format.
 */
export class CanvasTexture extends GpuObject<GPUTexture, CanvasTextureInvalidationType> implements IGpuObjectNative<GPUTexture> {
    private readonly mCanvas: HTMLCanvasElement;
    private mContext: GPUCanvasContext | null;

    /**
     * HTML canvas element.
     */
    public get canvas(): HTMLCanvasElement {
        return this.mCanvas;
    }

    /**
     * Texture depth.
     */
    public get depth(): number {
        return 1;
    }

    /**
     * Texture dimension.
     */
    public get dimension(): TextureDimension {
        return TextureDimension.ThreeDimension;
    }

    /**
     * Canvas format.
     */
    public get format(): TextureFormat {
        return this.device.formatValidator.preferredCanvasFormat;
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
     * Texture mip level count.
     */
    public get mipCount(): number {
        return 1;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUTexture {
        return super.native;
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
        super(pDevice);

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
    protected override destroyNative(_pNativeObject: GPUTexture, pReasons: GpuObjectInvalidationReasons<CanvasTextureInvalidationType>): void {
        // Context is only invalid on deconstruct or layout has changes.
        const lContextInvalid: boolean = pReasons.deconstruct || pReasons.has(CanvasTextureInvalidationType.ContextRebuild);

        // Only destroy context when child data/layout has changes.
        if (lContextInvalid) {
            // Destory context.
            this.mContext!.unconfigure();
            this.mContext = null;
        }
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generateNative(): GPUTexture {
        // Configure new context when not alread configured or destroyed.
        if (!this.mContext) {
            // Create and configure canvas context.
            this.mContext = <GPUCanvasContext><any>this.canvas.getContext('webgpu');
            this.mContext.configure({
                device: this.device.gpu,
                format: this.device.formatValidator.preferredCanvasFormat as GPUTextureFormat,
                usage: TextureUsage.CopyDestination | TextureUsage.RenderAttachment,
                alphaMode: 'opaque'
            });
        }

        // Read current texture of canvas. Needs to be retrieved for each frame.
        const lTexture = this.mContext.getCurrentTexture();
        lTexture.label = 'Canvas-Texture';

        return lTexture;
    }
}


export enum CanvasTextureInvalidationType {
    ContextRebuild = 'ContextRebuild',
    NativeRebuild = 'NativeRebuild'
}