import { TextureUsage } from './texture-usage.enum';
import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';

export class Texture extends GpuNativeObject<GPUTexture> {
    private mDepth: number;
    private readonly mDimension: GPUTextureViewDimension;
    private readonly mFormat: GPUTextureFormat;
    private mHeight: number;
    private mImageBitmapList: Array<ImageBitmap>;
    private readonly mUsage: TextureUsage;
    private mWidth: number;

    /**
     * Texture depth.
     */
    public get depth(): number {
        return this.mDepth;
    } set depth(pDepth: number) {
        this.mDepth = pDepth;
    }

    /**
     * Texture dimension.
     */
    public get dimension(): GPUTextureViewDimension {
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
    }

    /**
     * Constructor.
     * @param pGpu - Gpu.
     * @param pFormat - Texture format.
     * @param pDimension - Texture dimension.
     */
    public constructor(pGpu: Gpu, pFormat: GPUTextureFormat, pUsage: TextureUsage, pDimension: GPUTextureViewDimension = '2d') {
        super(pGpu);

        this.mFormat = pFormat;
        this.mUsage = pUsage;
        this.mImageBitmapList = new Array<ImageBitmap>();
        this.mDimension = pDimension;

        // Set defaults.
        this.mHeight = 1;
        this.mWidth = 1;
        this.mDepth = 1;
    }

    /**
     * Load images into texture.
     * Each image get loaded into seperate depth layer.
     * @param pSourceList - Image source list.
     */
    public async load(pSourceList: Array<string>): Promise<void> {
        // Parallel load images.
        const lBitmapResolvePromiseList: Array<Promise<ImageBitmap>> = pSourceList.map(async (pSource) => {
            // Load image with html image element.
            const lImage: HTMLImageElement = new Image();
            lImage.src = pSource;
            await lImage.decode();

            // Resolve image into bitmap.
            return createImageBitmap(lImage);
        });

        // Resolve all bitmaps.
        this.mImageBitmapList = await Promise.all(lBitmapResolvePromiseList);
    }

    /**
     * Generate texture based on parameters.
     */
    protected async generate(): Promise<GPUTexture> {
        // Extend usage by CopyDestination when a bitmap should be copied into the texture.
        let lUsage: TextureUsage = this.mUsage;
        if (this.mImageBitmapList.length > 0) {
            lUsage |= TextureUsage.CopyDestination;
        }

        // Create texture with set size, format and usage.
        const lTexture: GPUTexture = this.gpu.device.createTexture({
            size: [this.mWidth, this.mHeight, this.mDepth],
            format: this.mFormat,
            usage: lUsage
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

    /**
     * Validate native object state for a refresh.
     */
    protected override async validateState(): Promise<boolean> {
        // Validate changed size.
        if (this.mHeight !== this.generatedNative?.height || this.mWidth !== this.generatedNative?.width || this.mDepth !== this.generatedNative?.depthOrArrayLayers) {
            return false;
        }

        // Validate data to copy.
        if (this.mImageBitmapList.length > 0) {
            return false;
        }

        return true;
    }
}