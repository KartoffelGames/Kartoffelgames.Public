import { Exception } from '@kartoffelgames/core';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { TextureMemoryLayout, TextureMemoryLayoutInvalidationType } from '../memory_layout/texture/texture-memory-layout';
import { BaseTexture } from './base-texture';
import mipMap2dGenerate from './2d-mip-map-compute.wgsl';

export class ImageTexture extends BaseTexture<ImageTextureInvalidationType> {
    /**
     * Create mips for texture.
     * 
     * @param pTexture - Target texture.
     */
    private static generateMips(pGpuDevice: GPUDevice, pTexture: GPUTexture, pMipCount: number): void {



        if (pTexture.dimension === '2d') {
            const lShader: GPUShaderModule = pGpuDevice.createShaderModule({
                code: mipMap2dGenerate
            });

            const lBindGroupLayout = pGpuDevice.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.COMPUTE,
                        texture: {
                            sampleType: 'float',
                            viewDimension: '2d'
                        }
                    },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.COMPUTE,
                        storageTexture: {
                            access: 'write-only',
                            format: 'rgba8unorm',
                            viewDimension: '2d'
                        }
                    }
                ]
            });

            const lPipelineLayout: GPUPipelineLayout = pGpuDevice.createPipelineLayout({
                bindGroupLayouts: [lBindGroupLayout]
            });

            const lPipeline: GPUComputePipeline = pGpuDevice.createComputePipeline({
                layout: lPipelineLayout,
                compute: {
                    module: lShader,
                    entryPoint: 'computeMipMap'
                }
            });



            const lCommandEncoder: GPUCommandEncoder = pGpuDevice.createCommandEncoder();

            const lComputePass: GPUComputePassEncoder = lCommandEncoder.beginComputePass();
            lComputePass.setPipeline(lPipeline);

            for (let lMipLevel: number = 1; lMipLevel < pMipCount; lMipLevel++) {
                const lBindGroup: GPUBindGroup = pGpuDevice.createBindGroup({
                    layout: lBindGroupLayout,
                    entries: [
                        {
                            binding: 0,
                            resource: pTexture.createView({
                                format: 'rgba8unorm',
                                dimension: '2d',
                                baseMipLevel: lMipLevel - 1,
                                mipLevelCount: 1
                            })
                        },
                        {
                            binding: 1,
                            resource: pTexture.createView({
                                format: 'rgba8unorm',
                                dimension: '2d',
                                baseMipLevel: lMipLevel,
                                mipLevelCount: 1
                            })
                        }
                    ]
                });

                lComputePass.setBindGroup(0, lBindGroup);


                const invocationCountX: number = Math.floor(pTexture.width / Math.pow(2, lMipLevel))
                const invocationCountY: number = Math.floor(pTexture.height / Math.pow(2, lMipLevel))

                const workgroupSizePerDim = 8;

                // This ceils invocationCountX / workgroupSizePerDim
                const workgroupCountX = Math.ceil((invocationCountX + workgroupSizePerDim - 1) / workgroupSizePerDim);
                const workgroupCountY = Math.ceil((invocationCountY + workgroupSizePerDim - 1) / workgroupSizePerDim);

                console.log(workgroupCountX, workgroupCountY);

                lComputePass.dispatchWorkgroups(workgroupCountX, workgroupCountY, 1);
            }

            lComputePass.end();

            pGpuDevice.queue.submit([lCommandEncoder.finish()]);

            
        }
    }

    private mDepth: number;
    private mEnableMips: boolean;
    private mHeight: number;
    private mImageList: Array<ImageBitmap>;
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
        const lGpuDimension: GPUTextureDimension = (() => {
            switch (this.layout.dimension) {
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

        // To copy images, the texture needs to be a render attachment and copy destination.
        // Extend usage before texture creation.
        // TextureUsage.CopyDestination set in constructor.
        if (this.images.length > 0) {
            this.extendUsage(TextureUsage.RenderAttachment);

            // Usages needed for mip generation.
            if (this.mEnableMips) {
                this.extendUsage(TextureUsage.Texture);
                this.extendUsage(TextureUsage.Storage);
            }
        }

        // Calculate mip count on 3D images the depth affects mips.
        let lMipCount = 1;
        if (this.mEnableMips) {
            if (lGpuDimension === '3d') {
                lMipCount = 1 + Math.floor(Math.log2(Math.max(this.width, this.height, this.depth)));
            } else {
                lMipCount = 1 + Math.floor(Math.log2(Math.max(this.width, this.height)));
            }
        }

        // Save last used texture.
        const lLastTexture: GPUTexture | null = this.mTexture;

        // Create texture with set size, format and usage. Save it for destorying later.
        this.mTexture = this.device.gpu.createTexture({
            label: 'Frame-Buffer-Texture',
            size: [this.width, this.height, this.depth],
            format: this.layout.format as GPUTextureFormat,
            usage: this.usage,
            dimension: lGpuDimension,
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
                if (lGpuDimension === '3d') {
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
            ImageTexture.generateMips(this.device.gpu, this.mTexture, lMipCount);
        }

        // TODO: ArrayLayer based on dimension.

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