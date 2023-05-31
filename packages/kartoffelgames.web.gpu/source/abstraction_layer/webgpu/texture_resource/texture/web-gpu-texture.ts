import { WebGpuTextureUsage } from './web-gpu-texture-usage.enum';
import { WebGpuDevice } from '../../web-gpu-device';
import { GpuNativeObject } from '../../gpu-native-object';
import { IWebGpuTexture } from './i-web-gpu-texture.interface';
import { WebGpuTextureView } from './web-gpu-texture-view';
import { Exception } from '@kartoffelgames/core.data';

export class WebGpuTexture extends GpuNativeObject<GPUTexture> implements IWebGpuTexture {
    private readonly mDimension: GPUTextureDimension;
    private readonly mFormat: GPUTextureFormat;
    private readonly mHeight: number;
    private readonly mLayerCount: number;
    private readonly mMultiSampleLevel: number;
    private readonly mUsage: WebGpuTextureUsage;
    private readonly mWidth: number;

    /**
     * Texture dimension.
     */
    public get dimension(): GPUTextureDimension {
        return this.mDimension;
    }

    /**
     * Texture format.
     */
    public get format(): GPUTextureFormat {
        return this.mFormat;
    }

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mHeight;
    }

    /**
     * Texture depth.
     */
    public get layer(): number {
        return this.mLayerCount;
    }

    /**
     * Texture multi sample level.
     */
    public get multiSampleLevel(): number {
        return this.mMultiSampleLevel;
    }

    /**
     * Texture usage.
     */
    public get usage(): WebGpuTextureUsage {
        return this.mUsage;
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mWidth;
    }

    /**
     * Constructor.
     * @param pGpu - Gpu.
     * @param pFormat - Texture format.
     * @param pDimension - Texture dimension.
     */
    public constructor(pGpu: WebGpuDevice, pSettings: WebGpuTextureParameter) {
        super(pGpu, 'TEXTURE');

        this.mFormat = pSettings.format;
        this.mUsage = pSettings.usage;
        this.mDimension = pSettings.dimension;
        this.mHeight = pSettings.height;
        this.mWidth = pSettings.width;
        this.mLayerCount = pSettings.layerCount;

        // Set and validate multisample level.
        this.mMultiSampleLevel = pSettings.multiSampleLevel;
        if (this.mMultiSampleLevel < 1) {
            throw new Exception('Multi sample level must be greater than zero.', this);
        }
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
     * Destroy native object.
     * @param pNativeObject - Native object.
     */
    protected override destroyNative(pNativeObject: GPUTexture): void {
        pNativeObject.destroy();
    }

    /**
     * Generate texture based on parameters.
     */
    protected generate(): GPUTexture {
        // Create texture with set size, format and usage.
        const lTexture: GPUTexture = this.gpu.device.createTexture({
            label: this.label,
            size: [this.mWidth, this.mHeight, this.mLayerCount],
            format: this.mFormat,
            usage: this.mUsage,
            dimension: this.mDimension,
            sampleCount: this.mMultiSampleLevel
        });

        return lTexture;
    }
}

type WebGpuTextureParameter = {
    format: GPUTextureFormat;
    usage: WebGpuTextureUsage;
    dimension: GPUTextureDimension;
    multiSampleLevel: number;
    layerCount: number;
    height: number;
    width: number;
};