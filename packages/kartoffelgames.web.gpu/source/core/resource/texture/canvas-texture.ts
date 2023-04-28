import { TextureUsage } from './texture-usage.enum';
import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { ITexture } from './i-texture.interface';
import { TextureView } from './texture-view';

export class CanvasTexture extends GpuNativeObject<GPUTexture> implements ITexture {
    private readonly mCanvas: HTMLCanvasElement;
    private readonly mContext: GPUCanvasContext;
    private readonly mFormat: GPUTextureFormat;
    private readonly mUsage: TextureUsage;

    /**
     * Texture dimension.
     * Fixed to 2D.
     */
    public get dimension(): GPUTextureDimension {
        return '2d';
    }

    /**
     * Texture format.
     */
    public get format(): GPUTextureFormat {
        return this.mFormat;
    }

    /**
     * Texture and canvas height.
     */
    public get height(): number {
        return this.mCanvas.height;
    } set height(pHeight: number) {
        this.mCanvas.height = pHeight;
    }

    /**
     * Texture layers.
     * Fixed to one.
     */
    public get layer(): number {
        return 1;
    }

    /**
     * Texture multi sample level.
     * Fixed to one.
     */
    public get multiSampleLevel(): number {
        return 1;
    }

    /**
     * Texture usage.
     */
    public get usage(): TextureUsage {
        return this.mUsage;
    }

    /**
     * Texture and canvas height.
     */
    public get width(): number {
        return this.mCanvas.width;
    } set width(pWidth: number) {
        this.mCanvas.width = pWidth;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pCanvas - HTML Canvas.
     * @param pFormat - Texture color format.
     * @param pUsage - Texture usage.
     */
    public constructor(pGpu: Gpu, pCanvas: HTMLCanvasElement, pFormat: GPUTextureFormat, pUsage: TextureUsage) {
        super(pGpu, 'CANVAS_TEXTURE');

        this.mCanvas = pCanvas;
        this.mFormat = pFormat;
        this.mUsage = pUsage;

        // Get and configure context.
        this.mContext = <GPUCanvasContext><any>pCanvas.getContext('webgpu')!;
        this.mContext.configure({
            device: this.gpu.device,
            format: pFormat,
            usage: pUsage,
            alphaMode: 'opaque'
        });

        (<any>window).aaa = this.mContext;
    }

    /**
     * Create view of this texture.
     */
    public view(pBaseLayer?: number, pLayerCount?: number): TextureView {
        const lView = new TextureView(this.gpu, this, pBaseLayer, pLayerCount);
        lView.label = this.label;

        return lView;
    }

    /**
     * Get current canvas texture.
     */
    protected generate(): GPUTexture {
        const lTexture = this.mContext.getCurrentTexture();
        lTexture.label = this.label;

        return lTexture;
    }

    /**
     * Allways invalidate current texture to generate latest texture.
     */
    protected override validate(pNativeObject: GPUTexture): boolean {
        return this.mContext.getCurrentTexture() === pNativeObject;
    }
}