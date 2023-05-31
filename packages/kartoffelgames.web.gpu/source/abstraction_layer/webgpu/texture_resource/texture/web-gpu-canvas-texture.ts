import { WebGpuTextureUsage } from './web-gpu-texture-usage.enum';
import { WebGpuDevice } from '../../web-gpu-device';
import { GpuNativeObject } from '../../gpu-native-object';
import { IWebGpuTexture } from './i-web-gpu-texture.interface';
import { WebGpuTextureView } from './web-gpu-texture-view';

export class WebGpuCanvasTexture extends GpuNativeObject<GPUTexture> implements IWebGpuTexture {
    private readonly mCanvas: HTMLCanvasElement;
    private readonly mContext: GPUCanvasContext;
    private readonly mFormat: GPUTextureFormat;
    private readonly mUsage: WebGpuTextureUsage;

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
    public get usage(): WebGpuTextureUsage {
        return this.mUsage;
    }

    /**
     * Texture and canvas height.
     */
    public get width(): number {
        return this.mCanvas.width;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pCanvas - HTML Canvas.
     * @param pFormat - Texture color format.
     * @param pUsage - Texture usage.
     */
    public constructor(pGpu: WebGpuDevice, pCanvas: HTMLCanvasElement, pFormat: GPUTextureFormat, pUsage: WebGpuTextureUsage) {
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
    }

    /**
     * Create view of this texture.
     */
    public view(pBaseLayer?: number, pLayerCount?: number): WebGpuTextureView {
        const lView = new WebGpuTextureView(this.gpu, this, pBaseLayer, pLayerCount);
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
}