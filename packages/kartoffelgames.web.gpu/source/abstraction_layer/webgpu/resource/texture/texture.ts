import { TextureUsage } from './texture-usage.enum';
import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { ITexture } from './i-texture.interface';
import { TextureView } from './texture-view';
import { Exception } from '@kartoffelgames/core.data';

export class Texture extends GpuNativeObject<GPUTexture> implements ITexture {
    private readonly mDimension: GPUTextureDimension;
    private readonly mFormat: GPUTextureFormat;
    private mHeight: number;
    private mImageBitmapList: Array<ImageBitmap>;
    private readonly mLayerCount: number;
    private readonly mMultiSampleLevel: number;
    private readonly mUsage: TextureUsage;
    private mWidth: number;

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
    } set height(pHeight: number) {
        this.mHeight = pHeight;

        // Trigger change.
        this.triggerChange();
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
    } set width(pWidth: number) {
        this.mWidth = pWidth;

        // Trigger change.
        this.triggerChange();
    }

    /**
     * Constructor.
     * @param pGpu - Gpu.
     * @param pFormat - Texture format.
     * @param pDimension - Texture dimension.
     */
    public constructor(pGpu: Gpu, pFormat: GPUTextureFormat, pUsage: TextureUsage, pDimension: GPUTextureDimension = '2d', pMultiSampleLevel: number = 1, pLayerCount: number = 1) {
        super(pGpu, 'TEXTURE');

        this.mFormat = pFormat;
        this.mUsage = pUsage;
        this.mImageBitmapList = new Array<ImageBitmap>();
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
     * Load images into texture.
     * Each image get loaded into seperate depth layer.
     * @param pSourceList - Image source list.
     */
    public async load(pSourceList: Array<string>): Promise<void> {
        let lHeight: number = 0;
        let lWidth: number = 0;

        // Parallel load images.
        const lBitmapResolvePromiseList: Array<Promise<ImageBitmap>> = pSourceList.map(async (pSource) => {
            // Load image with html image element.
            const lImage: HTMLImageElement = new Image();
            lImage.src = pSource;
            await lImage.decode();

            // Init size.
            if (lHeight === 0 || lWidth === 0) {
                lWidth = lImage.naturalWidth;
                lHeight = lImage.naturalHeight;
            }

            // Validate same image size for all layers.
            if (lHeight !== lImage.naturalHeight || lWidth !== lImage.naturalWidth) {
                throw new Exception(`Texture image layers are not the same size. (${lImage.naturalWidth}, ${lImage.naturalHeight}) needs (${lWidth}, ${lHeight}).`, this);
            }

            // Resolve image into bitmap.
            return createImageBitmap(lImage);
        });

        // Resolve all bitmaps.
        this.mImageBitmapList = await Promise.all(lBitmapResolvePromiseList);

        // Set new size.
        this.width = lWidth;
        this.height = lHeight;

        // Trigger change.
        this.triggerChange();
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
        // Extend usage by CopyDestination when a bitmap should be copied into the texture.
        let lUsage: TextureUsage = this.mUsage;
        if (this.mImageBitmapList.length > 0) {
            lUsage |= TextureUsage.CopyDestination;
        }

        // Create texture with set size, format and usage.
        const lTexture: GPUTexture = this.gpu.device.createTexture({
            label: this.label,
            size: [this.mWidth, this.mHeight, this.mLayerCount],
            format: this.mFormat,
            usage: lUsage,
            dimension: this.mDimension,
            sampleCount: this.mMultiSampleLevel
        });

        // Copy bitmap into texture.
        if (this.mImageBitmapList.length > 0) {
            // Loop image bitmaps for each layer.
            for (let lBitmapIndex = 0; lBitmapIndex < this.mImageBitmapList.length; lBitmapIndex++) {
                const lBitmap = this.mImageBitmapList[lBitmapIndex];

                // Copy image into depth layer.
                this.gpu.device.queue.copyExternalImageToTexture(
                    { source: lBitmap },
                    { texture: lTexture, origin: [0, 0, lBitmapIndex] },
                    [lBitmap.width, lBitmap.height]
                );

                // Release image data.
                lBitmap.close();
            }
        }

        // Clear closed bitmap list.
        this.mImageBitmapList = new Array<ImageBitmap>();

        return lTexture;
    }
}