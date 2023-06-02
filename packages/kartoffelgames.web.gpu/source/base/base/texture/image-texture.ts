import { Exception } from '@kartoffelgames/core.data';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { IImageTexture } from '../../interface/texture/i-image-texture.interface';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class ImageTexture<TGpu extends GpuDevice, TNative extends object> extends GpuObject<TGpu, TNative> implements IImageTexture {
    private mDepth: number;
    private readonly mFormat: TextureFormat;
    private mHeight: number;
    private mImageList: Array<ImageBitmap>;
    private readonly mUsage: TextureUsage;
    private mWidth: number;

    /**
     * Texture depth.
     */
    public get depth(): number {
        return this.mDepth;
    }

    /**
     * Texture format.
     */
    public get format(): TextureFormat {
        return this.mFormat;
    }

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mHeight;
    }

    /**
     * Loaded html image list.
     */
    public get images(): Array<ImageBitmap> {
        return this.mImageList;
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
     * @param pDevice - Device.
     * @param pFormat - Texture format.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: TGpu, pFormat: TextureFormat, pUsage: TextureUsage) {
        super(pDevice);

        // Fixed values.
        this.mFormat = pFormat;
        this.mUsage = pUsage;

        // Set defaults.
        this.mDepth = 1;
        this.mHeight = 1;
        this.mWidth = 1;
        this.mImageList = new Array<ImageBitmap>();
    }

    /**
     * Load image into texture.
     * Images needs to have the same dimensions.
     * @param pSorceList - Source for each depth layer.
     */
    public async load(...pSourceList: Array<string>): Promise<void> {
        let lHeight: number = 0;
        let lWidth: number = 0;

        // Parallel load images.
        const lImageLoadPromiseList: Array<Promise<ImageBitmap>> = pSourceList.map(async (pSource) => {
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

            return createImageBitmap(lImage);
        });

        // Resolve all bitmaps.
        this.mImageList = await Promise.all(lImageLoadPromiseList);

        // Set new texture size.
        this.mWidth = lWidth;
        this.mHeight = lHeight;
        this.mDepth = pSourceList.length;

        // Trigger change.
        this.triggerAutoUpdate();
    }
}