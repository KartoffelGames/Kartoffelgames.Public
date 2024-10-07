import { Dictionary, Exception } from '@kartoffelgames/core';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureSampleType } from '../../constant/texture-sample-type.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { TextureMemoryLayout, TextureMemoryLayoutInvalidationType } from '../memory_layout/texture/texture-memory-layout';
import { BaseTexture } from './base-texture';
import { TextureFormatCapability } from './texture-format-capabilities';

export class ImageTexture extends BaseTexture<ImageTextureInvalidationType> {
    /**
     * Create mips for texture with compute shader.
     * 
     * @param pTexture - Target texture.
     */
    private static readonly mGenerateMipsWithCompute = (() => {
        // Global storages for 2d generation.
        const lFormatPipelines2d: Dictionary<GPUTextureFormat, GPUComputePipeline> = new Dictionary<GPUTextureFormat, GPUComputePipeline>();
        const lFormatBindGroupsLayouts2d: Dictionary<GPUTextureFormat, GPUBindGroupLayout> = new Dictionary<GPUTextureFormat, GPUBindGroupLayout>();

        // Static config values.
        const lWorkgroupSizePerDimension = 8;

        return (pGpuDevice: GPUDevice, pTexture: GPUTexture, pFormat: TextureFormatCapability): void => {
            // Different Dimensions need different pipelines.
            if (pTexture.dimension === '2d') {
                // Generate cache when missed.
                if (!lFormatPipelines2d.has(pTexture.format)) {
                    const lSampleTypeName: 'f32' | 'u32' | 'i32' = (() => {
                        switch (pFormat.sampleTypes.primary) {
                            case TextureSampleType.Float: return 'f32';
                            case TextureSampleType.UnsignedInteger: return 'u32';
                            case TextureSampleType.SignedInteger: return 'i32';
                            default: {
                                throw new Exception(`Can't generate mip for textures that cant be filtered.`, this);
                            }
                        }
                    })();

                    // Shader code. Insert format.
                    const lShader: GPUShaderModule = pGpuDevice.createShaderModule({
                        code: `
                            @group(0) @binding(0) var previousMipLevel: texture_2d<${lSampleTypeName}>;
                            @group(0) @binding(1) var nextMipLevel: texture_storage_2d<${pFormat.format}, write>;

                            @compute @workgroup_size(${lWorkgroupSizePerDimension}, ${lWorkgroupSizePerDimension})
                            fn computeMipMap(@builtin(global_invocation_id) id: vec3<u32>) {
                                let lOffset = vec2<u32>(0u, 1u);
                                let lColor = (
                                    textureLoad(previousMipLevel, 2u * id.xy + lOffset.xx, 0) +
                                    textureLoad(previousMipLevel, 2u * id.xy + lOffset.xy, 0) +
                                    textureLoad(previousMipLevel, 2u * id.xy + lOffset.yx, 0) +
                                    textureLoad(previousMipLevel, 2u * id.xy + lOffset.yy, 0)
                                ) * 0.25;
                                textureStore(nextMipLevel, id.xy, lColor);
                            }
                        `
                    });

                    // Generate bind group layout.
                    const lBindGroupLayout = pGpuDevice.createBindGroupLayout({
                        entries: [
                            {
                                binding: 0,
                                visibility: GPUShaderStage.COMPUTE,
                                texture: {
                                    sampleType: pFormat.sampleTypes.primary,
                                    viewDimension: '2d'
                                }
                            },
                            {
                                binding: 1,
                                visibility: GPUShaderStage.COMPUTE,
                                storageTexture: {
                                    access: 'write-only',
                                    format: pFormat.format as GPUTextureFormat,
                                    viewDimension: '2d'
                                }
                            }
                        ]
                    });

                    // Create pipeline.
                    const lPipeline: GPUComputePipeline = pGpuDevice.createComputePipeline({
                        layout: pGpuDevice.createPipelineLayout({
                            bindGroupLayouts: [lBindGroupLayout]
                        }),
                        compute: {
                            module: lShader,
                            entryPoint: 'computeMipMap'
                        }
                    });

                    // Safe pipeline and bind group layout.
                    lFormatPipelines2d.set(pFormat.format as GPUTextureFormat, lPipeline);
                    lFormatBindGroupsLayouts2d.set(pFormat.format as GPUTextureFormat, lBindGroupLayout);
                }

                // Calulate mip count.
                const lMipCount = 1 + Math.floor(Math.log2(Math.max(pTexture.width, pTexture.height)));

                // Read cached pipeline and layout.
                const lPipeline: GPUComputePipeline = lFormatPipelines2d.get(pFormat.format as GPUTextureFormat)!;
                const lBindGroupLayout: GPUBindGroupLayout = lFormatBindGroupsLayouts2d.get(pFormat.format as GPUTextureFormat)!;


                // Create command encoder.
                const lCommandEncoder: GPUCommandEncoder = pGpuDevice.createCommandEncoder();

                const lComputePass: GPUComputePassEncoder = lCommandEncoder.beginComputePass();
                lComputePass.setPipeline(lPipeline);

                for (let lMipLevel: number = 1; lMipLevel < lMipCount; lMipLevel++) {
                    // Create and add bind group with needed texture resources.
                    lComputePass.setBindGroup(0, pGpuDevice.createBindGroup({
                        layout: lBindGroupLayout,
                        entries: [
                            {
                                binding: 0,
                                resource: pTexture.createView({
                                    format: pFormat.format as GPUTextureFormat,
                                    dimension: '2d',
                                    baseMipLevel: lMipLevel - 1,
                                    mipLevelCount: 1,
                                })
                            },
                            {
                                binding: 1,
                                resource: pTexture.createView({
                                    format: pFormat.format as GPUTextureFormat,
                                    dimension: '2d',
                                    baseMipLevel: lMipLevel,
                                    mipLevelCount: 1
                                })
                            }
                        ]
                    }));

                    // Calculate needed single pixel invocations to cover complete mipmap level texture.
                    const lNeededInvocationCountForX: number = Math.floor(pTexture.width / Math.pow(2, lMipLevel));
                    const lNeededInvocationCountForY: number = Math.floor(pTexture.height / Math.pow(2, lMipLevel));

                    // Calculate needed compute workgroup invocations to cover complete mipmap level texture.
                    const lWorkgroupCountForX = Math.ceil((lNeededInvocationCountForX + lWorkgroupSizePerDimension - 1) / lWorkgroupSizePerDimension);
                    const lWorkgroupCountForY = Math.ceil((lNeededInvocationCountForY + lWorkgroupSizePerDimension - 1) / lWorkgroupSizePerDimension);

                    lComputePass.dispatchWorkgroups(lWorkgroupCountForX, lWorkgroupCountForY, 1);
                }

                // End computepass after all mips are generated.
                lComputePass.end();

                // Push all commands to gpu queue.
                pGpuDevice.queue.submit([lCommandEncoder.finish()]);
            }

            // TODO: 3D
            // lMipCount = 1 + Math.floor(Math.log2(Math.max(this.width, this.height, this.depth)));
        };
    })();

    private static generateMips(pDevice: GpuDevice, pTexture: GPUTexture) {
        const lTextureCapability: TextureFormatCapability = pDevice.formatValidator.capabilityOf(pTexture.format as TextureFormat);

        // Use compute shader or fallback to cpu generation of mips.
        if (lTextureCapability.storage.writeonly && lTextureCapability.textureUsages.has(TextureUsage.TextureBinding)) {
            ImageTexture.mGenerateMipsWithCompute(pDevice.gpu, pTexture, lTextureCapability);
        } else {
            // Fallback CPU generation.
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
                this.extendUsage(TextureUsage.TextureBinding);
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
            ImageTexture.generateMips(this.device, this.mTexture);
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