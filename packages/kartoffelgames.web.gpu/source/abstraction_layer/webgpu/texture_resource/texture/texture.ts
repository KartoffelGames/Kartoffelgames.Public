import { TextureUsage } from './texture-usage.enum';
import { WebGpuDevice } from '../../web-gpu-device';
import { GpuNativeObject } from '../../gpu-native-object';
import { ITexture } from './i-texture.interface';
import { TextureView } from './texture-view';
import { Exception } from '@kartoffelgames/core.data';

export class Texture extends GpuNativeObject<GPUTexture> implements ITexture {
    private readonly mDimension: GPUTextureDimension;
    private readonly mFormat: GPUTextureFormat;
    private readonly mHeight: number;
    private readonly mLayerCount: number;
    private readonly mMultiSampleLevel: number;
    private readonly mUsage: TextureUsage;
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
    public get usage(): TextureUsage {
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
    public constructor(pGpu: WebGpuDevice, pFormat: GPUTextureFormat, pUsage: TextureUsage, pDimension: GPUTextureDimension = '2d', pMultiSampleLevel: number = 1, pLayerCount: number = 1) {
        super(pGpu, 'TEXTURE');

        this.mFormat = pFormat;
        this.mUsage = pUsage;
        this.mDimension = pDimension;
        this.mLayerCount = pLayerCount;

        // Set and validate multisample level.
        this.mMultiSampleLevel = pMultiSampleLevel;
        if (pMultiSampleLevel < 1) {
            throw new Exception('Multi sample level must be greater than zero.', this);
        }

        // Set defaults.
        this.mHeight = 1;
        this.mWidth = 1;
        this.mLayerCount = 1;
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