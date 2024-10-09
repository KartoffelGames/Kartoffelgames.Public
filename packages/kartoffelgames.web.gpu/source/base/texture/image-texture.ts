import { Exception } from '@kartoffelgames/core';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { TextureMemoryLayout, TextureMemoryLayoutInvalidationType } from '../memory_layout/texture/texture-memory-layout';
import { BaseTexture } from './base-texture';
import { TextureMipGenerator } from './texture-mip-generator';

export class ImageTexture extends BaseTexture<ImageTextureInvalidationType> {
    private mDepth: number;
    private mEnableMips: boolean;
    private mHeight: number;
    private mImageList: Array<ImageBitmap>;
    private readonly mMipGenerator: TextureMipGenerator;
    private mTexture: GPUTexture | null;
    private mWidth: number;

    /**
     * Texture depth.
     */
    public get depth(): number {
        return this.mDepth;
    }

    /**
     * Enable mip maps.
     */
    public get enableMips(): boolean {
        return this.mEnableMips;
    } set enableMips(pEnable: boolean) {
        this.mEnableMips = pEnable;
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
        super(pDevice, pLayout);

        this.mMipGenerator = new TextureMipGenerator(pDevice);
        this.mTexture = null;

        // Set defaults.
        this.mEnableMips = true;
        this.mDepth = 1;
        this.mHeight = 1;
        this.mWidth = 1;
        this.mImageList = new Array<ImageBitmap>();

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(ImageTextureInvalidationType.Layout);
        }, [TextureMemoryLayoutInvalidationType.Dimension, TextureMemoryLayoutInvalidationType.Format]);

        // Allways a copy destination.
        this.extendUsage(TextureUsage.CopyDestination);
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

        // TODO: Enforce limits.
        // maxTextureDimension1D
        // maxTextureDimension2D
        // maxTextureDimension3D
        // maxTextureArrayLayers

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
    protected override generateNative(_pCurrentNative: GPUTextureView | null, pInvalidationReasons: GpuObjectInvalidationReasons<ImageTextureInvalidationType>): GPUTextureView {
        // TODO: Validate format based on layout. Maybe replace used format.

        // Generate gpu dimension from memory layout dimension.
        const lTextureDimensions: { textureDimension: GPUTextureDimension, clampedDimensions: [number, number, number]; } = (() => {
            switch (this.layout.dimension) {
                case TextureDimension.OneDimension: {
                    return {
                        textureDimension: '1d',
                        clampedDimensions: [this.mWidth, 1, 1]
                    };
                }
                case TextureDimension.TwoDimension: {
                    return {
                        textureDimension: '2d',
                        clampedDimensions: [this.mWidth, this.mHeight, 1]
                    };
                }
                case TextureDimension.TwoDimensionArray: {
                    return {
                        textureDimension: '2d',
                        clampedDimensions: [this.mWidth, this.mHeight, this.mDepth]
                    };
                }
                case TextureDimension.Cube: {
                    return {
                        textureDimension: '2d',
                        clampedDimensions: [this.mWidth, this.mHeight, 6]
                    };
                }
                case TextureDimension.CubeArray: {
                    return {
                        textureDimension: '2d',
                        clampedDimensions: [this.mWidth, this.mHeight, Math.ceil(this.mDepth / 6) * 6]
                    };
                }
                case TextureDimension.ThreeDimension: {
                    return {
                        textureDimension: '3d',
                        clampedDimensions: [this.mWidth, this.mHeight, this.mDepth]
                    };
                }
            }
        })();

        // To copy images, the texture needs to be a render attachment and copy destination.
        // Extend usage before texture creation.
        // TextureUsage.CopyDestination set in constructor.
        if (this.images.length > 0) {
            this.extendUsage(TextureUsage.RenderAttachment);

            // Usages needed for mip generation.
            if (this.mEnableMips) {
                this.extendUsage(TextureUsage.TextureBinding);
                this.extendUsage(TextureUsage.Storage);
            }
        }

        // Calculate mip count on 3D images the depth affects mips.
        let lMipCount = 1;
        if (this.mEnableMips) {
            if (lTextureDimensions.textureDimension === '3d') {
                lMipCount = 1 + Math.floor(Math.log2(Math.max(this.mWidth, this.mHeight, this.mDepth)));
            } else {
                lMipCount = 1 + Math.floor(Math.log2(Math.max(this.mWidth, this.mHeight)));
            }
        }

        // Save last used texture.
        const lLastTexture: GPUTexture | null = this.mTexture;

        // Create texture with set size, format and usage. Save it for destorying later.
        this.mTexture = this.device.gpu.createTexture({
            label: 'Frame-Buffer-Texture',
            size: lTextureDimensions.clampedDimensions,
            format: this.layout.format as GPUTextureFormat,
            usage: this.usage,
            dimension: lTextureDimensions.textureDimension,
            mipLevelCount: (this.enableMips) ? lMipCount : 1
        });

        // Copy current native data into new texture.
        if (lLastTexture !== null && !pInvalidationReasons.has(ImageTextureInvalidationType.ImageBinary)) {
            // Create target copy texture.
            const lDestination: GPUImageCopyTexture = {
                texture: this.mTexture,
                mipLevel: 0
            };

            // Create source copy texture.
            const lSource: GPUImageCopyTexture = {
                texture: lLastTexture,
                mipLevel: 0
            };

            // Clamp copy sizes to lowest.
            const lLevelOneCopySize: GPUExtent3DStrict = {
                width: Math.min(lLastTexture.width, this.mTexture.width),
                height: Math.min(lLastTexture.height, this.mTexture.height),
                depthOrArrayLayers: Math.min(lLastTexture.depthOrArrayLayers, this.mTexture.depthOrArrayLayers)
            };

            // Create copy command encoder to store copy actions.
            const lCommandDecoder: GPUCommandEncoder = this.device.gpu.createCommandEncoder();

            // Copy each mipmap.
            const lCopyMipCount: number = Math.min(lLastTexture.mipLevelCount, this.mTexture.mipLevelCount);
            for (let lMipLevel: number = 0; lMipLevel < lCopyMipCount; lMipLevel++) {
                // Calculate mip level copy sizes.
                const lMipCopySize: GPUExtent3DStrict = {
                    width: Math.floor(lLevelOneCopySize.width / Math.pow(2, lMipLevel)),
                    height: Math.floor(lLevelOneCopySize.height! / Math.pow(2, lMipLevel)),
                    depthOrArrayLayers: 0
                };

                // On 3D images the depth count to the mip.
                if (this.mTexture.dimension === '3d') {
                    lMipCopySize.depthOrArrayLayers = Math.floor(lLevelOneCopySize.depthOrArrayLayers! / Math.pow(2, lMipLevel));
                } else {
                    lMipCopySize.depthOrArrayLayers = lLevelOneCopySize.depthOrArrayLayers!;
                }

                // Add copy action to command queue.
                lCommandDecoder.copyTextureToTexture(lSource, lDestination, lMipCopySize);
            }

            // Submit copy actions.
            this.device.gpu.queue.submit([lCommandDecoder.finish()]);
        }

        // Only reload when binary data has changed.
        if (pInvalidationReasons.has(ImageTextureInvalidationType.ImageBinary)) {
            // Load images into texture.
            for (let lImageIndex: number = 0; lImageIndex < this.images.length; lImageIndex++) {
                const lBitmap: ImageBitmap = this.images[lImageIndex];

                // Copy image into depth layer.
                this.device.gpu.queue.copyExternalImageToTexture(
                    { source: lBitmap },
                    { texture: this.mTexture, origin: [0, 0, lImageIndex] },
                    [lBitmap.width, lBitmap.height]
                );
            }

            // Generate mips for texture.
            this.mMipGenerator.generateMips(this.mTexture);
        }

        // View descriptor.
        return this.mTexture.createView({
            format: this.layout.format as GPUTextureFormat,
            dimension: this.layout.dimension,
        });
    }

    /**
     * On usage extened. Triggers a texture rebuild.
     */
    protected override onUsageExtend(): void {
        this.invalidate(ImageTextureInvalidationType.Usage);
    }
}

export enum ImageTextureInvalidationType {
    Layout = 'LayoutChange',
    ImageBinary = 'ImageBinaryChange',
    Usage = 'UsageChange'
}