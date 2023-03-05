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
        super(pGpu);

        this.mCanvas = pCanvas;
        this.mFormat = pFormat;
        this.mUsage = pUsage;

        // Get and configure context.
        this.mContext = pCanvas.getContext('webgpu')!;
        this.mContext.configure({
            device: this.gpu.device,
            format: pFormat,
            usage: pUsage,
            alphaMode: 'opaque'
        });
    }

    /**
     * Create view of this texture.
     */
    public async view(pBaseLayer?: number, pLayerCount?: number): Promise<TextureView> {
        return new TextureView(this.gpu, this, pBaseLayer, pLayerCount);
    }

    /**
     * Destory native gpu texture.
     * @param _pNativeObject - Native gpu texture.
     */
    protected async destroyNative(_pNativeObject: GPUTexture): Promise<void> {
        // No Action needed for Canvas generated textures.
    }

    /**
     * Get current canvas texture.
     */
    protected async generate(): Promise<GPUTexture> {
        return this.mContext.getCurrentTexture();
    }

    /**
     * Allways invalidate current texture to generate latest texture.
     */
    protected override async validateState(): Promise<boolean> {
        return false;
    }
}