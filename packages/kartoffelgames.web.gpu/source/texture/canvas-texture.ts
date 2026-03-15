import type { TextureDimension } from '../constant/texture-dimension.ts';
import type { TextureFormat } from '../constant/texture-format.type.ts';
import { TextureUsage } from '../constant/texture-usage.enum.ts';
import type { TextureViewDimension } from '../constant/texture-view-dimension.ts';
import type { GpuDevice } from '../device/gpu-device.ts';
import type { GpuObjectInvalidationReasons } from '../gpu_object/gpu-object-invalidation-reasons.ts';
import { GpuResourceObject, GpuResourceObjectInvalidationType } from '../gpu_object/gpu-resource-object.ts';
import type { IGpuObjectNative } from '../gpu_object/interface/i-gpu-object-native.ts';
import { GpuTextureView } from './gpu-texture-view.ts';
import type { IGpuTexture } from './i-gpu-texture.ts';

/**
 * Canvas texture. Can only be used as render attachment or to be copied into.
 * Allways 2D with preferred format.
 */
export class CanvasTexture extends GpuResourceObject<TextureUsage, GPUTexture, CanvasTextureInvalidationType> implements IGpuObjectNative<GPUTexture>, IGpuTexture {
    private readonly mCanvas: HTMLCanvasElement;
    private mContext: GPUCanvasContext | null;
    private readonly mFrameListener: () => void;

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
        return '2d';
    }

    /**
     * Canvas format.
     */
    public get format(): TextureFormat {
        return this.device.textureCapabilities.preferredCanvasFormat as TextureFormat;
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
     * If texture is multisampled.
     */
    public get multiSampled(): boolean {
        return false;
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
        this.height = Math.max(pCanvas.height, 1);
        this.width = Math.max(pCanvas.width, 1);

        // Rebuild view on every frame.
        this.mFrameListener = () => {
            this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
        };
        this.device.addTickListener(this.mFrameListener);
    }

    /**
     * Use texture as view. 
     * 
     * @param pDimension - Texture views dimension.
     * 
     * @returns Texture view.
     */
    public useAs(pDimension?: TextureViewDimension): GpuTextureView {
        // Use dimension form parameter or convert texture dimension to view dimension.
        const lViewDimension: TextureViewDimension = pDimension ?? this.dimension;

        return new GpuTextureView(this.device, this, lViewDimension, this.format, this.multiSampled);
    }

    /**
     * Destory texture object.
     * @param pNativeObject - Native canvas texture.
     * @param pReasons - Invalidation reasons. Contains all reasons that triggered the destroy call. Might be used to optimize destroy process.
     */
    protected override destroyNative(pNativeObject: GPUTexture, pReasons: GpuObjectInvalidationReasons<CanvasTextureInvalidationType>): void {
        // Destroy native texture and remove from freeable resources.
        pNativeObject.destroy();
        this.unregisterFreeableResource(pNativeObject);

        // Only destroy context when child data/layout has changes.
        if (pReasons.deconstruct) {
            // Remove frame listener.
            this.device.removeTickListener(this.mFrameListener);

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
                format: this.device.textureCapabilities.preferredCanvasFormat as GPUTextureFormat,
                usage: TextureUsage.CopyDestination | TextureUsage.RenderAttachment,
                alphaMode: 'opaque'
            });
        }

        // Read current texture of canvas. Needs to be retrieved for each frame.
        const lTexture = this.mContext.getCurrentTexture();
        lTexture.label = 'Canvas-Texture';

        // Register new texture as freeable resource.
        this.registerFreeableResource(lTexture);

        return lTexture;
    }
}


export enum CanvasTextureInvalidationType {
    NativeRebuild = 'NativeRebuild'
}