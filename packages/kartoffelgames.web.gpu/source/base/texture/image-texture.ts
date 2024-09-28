import { Exception } from '@kartoffelgames/core';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { GpuObjectLifeTime } from '../gpu/object/gpu-object-life-time.enum';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { TextureMemoryLayout, TextureMemoryLayoutInvalidationType } from '../memory_layout/texture/texture-memory-layout';

export class ImageTexture extends GpuObject<GPUTextureView, ImageTextureInvalidationType> implements IGpuObjectNative<GPUTextureView> {
    private mDepth: number;
    private mHeight: number;
    private mImageList: Array<ImageBitmap>;
    private readonly mMemoryLayout: TextureMemoryLayout;
    private mTexture: GPUTexture | null;
    private mWidth: number;

    /**
     * Texture depth.
     */
    public get depth(): number {
        return this.mDepth;
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
     * Textures memory layout.
     */
    public get memoryLayout(): TextureMemoryLayout {
        return this.mMemoryLayout;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUTextureView {
        return super.native;
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
     * @param pLayout - Texture memory layout.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout) {
        super(pDevice, GpuObjectLifeTime.Persistent);

        this.mTexture = null;

        // Fixed values.
        this.mMemoryLayout = pLayout;

        // Set defaults.
        this.mDepth = 1;
        this.mHeight = 1;
        this.mWidth = 1;
        this.mImageList = new Array<ImageBitmap>();

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(ImageTextureInvalidationType.Layout);
        }, [TextureMemoryLayoutInvalidationType.Dimension, TextureMemoryLayoutInvalidationType.Format, TextureMemoryLayoutInvalidationType.Usage]);
    }

    /**
     * Load image into texture.
     * Images needs to have the same dimensions.
     * 
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
        this.invalidate(ImageTextureInvalidationType.ImageBinary);
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroyNative(_pNativeObject: GPUTextureView): void {
        this.mTexture?.destroy();
        this.mTexture = null;
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generateNative(): GPUTextureView {
        // TODO: Validate format based on layout. Maybe replace used format.

        // Generate gpu dimension from memory layout dimension.
        const lGpuDimension: GPUTextureDimension = (() => {
            switch (this.memoryLayout.dimension) {
                case TextureDimension.OneDimension: {
                    return '1d';
                }
                case TextureDimension.TwoDimension: {
                    return '2d';
                }
                case TextureDimension.TwoDimensionArray: {
                    return '2d';
                }
                case TextureDimension.Cube: {
                    return '2d';
                }
                case TextureDimension.CubeArray: {
                    return '2d';
                }
                case TextureDimension.ThreeDimension: {
                    return '3d';
                }
            }
        })();

        // Create texture with set size, format and usage. Save it for destorying later.
        this.mTexture = this.device.gpu.createTexture({
            label: 'Frame-Buffer-Texture',
            size: [this.width, this.height, this.depth],
            format: this.memoryLayout.format as GPUTextureFormat,
            usage: this.memoryLayout.usage,
            dimension: lGpuDimension
        });

        // Load images into texture. // TODO: Make it somewhat comnpletly async.
        for (let lImageIndex: number = 0; lImageIndex < this.images.length; lImageIndex++) {
            const lBitmap: ImageBitmap = this.images[lImageIndex];

            // Copy image into depth layer.
            this.device.gpu.queue.copyExternalImageToTexture(
                { source: lBitmap },
                { texture: this.mTexture, origin: [0, 0, lImageIndex] },
                [lBitmap.width, lBitmap.height]
            );
        }

        // TODO: mipLevel??
        // TODO: ArrayLayer based on dimension.

        // TODO: View descriptor.
        return this.mTexture.createView({
            format: this.memoryLayout.format as GPUTextureFormat,
            dimension: this.memoryLayout.dimension
        });
    }
}

export enum ImageTextureInvalidationType {
    Layout = 'LayoutChange',
    ImageBinary = 'ImageBinaryChange'
}