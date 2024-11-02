import { Exception } from '@kartoffelgames/core';
import { GpuLimit } from '../constant/gpu-limit.enum';
import { TextureDimension } from '../constant/texture-dimension.enum';
import { TextureFormat } from '../constant/texture-format.enum';
import { TextureUsage } from '../constant/texture-usage.enum';
import { TextureViewDimension } from '../constant/texture-view-dimension.enum';
import { GpuDevice } from '../device/gpu-device';
import { GpuResourceObject, GpuResourceObjectInvalidationType } from '../gpu_object/gpu-resource-object';
import { IGpuObjectNative } from '../gpu_object/interface/i-gpu-object-native';
import { GpuTextureView } from './gpu-texture-view';
import { TextureViewMemoryLayout } from './memory_layout/texture-view-memory-layout';

/**
 * Gpu texture that is alocated on gpu memory.
 */
export class GpuTexture extends GpuResourceObject<TextureUsage, GPUTexture> implements IGpuObjectNative<GPUTexture> {
    private mDepth: number;
    private readonly mDimension: TextureDimension;
    private readonly mFormat: TextureFormat;
    private mHeight: number;
    private mMipLevelCount: number;
    private readonly mMultisampled: boolean;
    private mWidth: number;

    /**
     * Texture depth.
     */
    public get depth(): number {
        return this.mDepth;
    } set depth(pDepth: number) {
        this.mDepth = pDepth;

        // Invalidate texture.
        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    /**
     * Texture dimension.
     */
    public get dimension(): TextureDimension {
        return this.mDimension;
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
    } set height(pHeight: number) {
        this.mHeight = pHeight;

        // Invalidate texture.
        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    /**
     * Texture mip level count.
     */
    public get mipCount(): number {
        return this.mMipLevelCount;
    } set mipCount(pMipCount: number) {
        this.mMipLevelCount = pMipCount;

        // Invalidate texture.
        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    /**
     * Texture multi sampled.
     */
    public get multiSampled(): boolean {
        return this.mMultisampled;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUTexture {
        return super.native;
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mWidth;
    } set width(pWidth: number) {
        this.mWidth = pWidth;

        // Invalidate texture.
        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture layout.
     * @param pCanvas - Canvas of texture.
     */
    public constructor(pDevice: GpuDevice, pParameter: GpuTextureParameter) {
        super(pDevice);

        // Allways add copy source/destination and copy over information on rebuild. 
        this.extendUsage(TextureUsage.CopyDestination);
        this.extendUsage(TextureUsage.CopySource);

        // Set static config.
        this.mDimension = pParameter.dimension;
        this.mFormat = pParameter.format;
        this.mMultisampled = pParameter.multisampled;

        // Set defaults.
        this.mMipLevelCount = 1;
        this.mDepth = 1;
        this.mHeight = 1;
        this.mWidth = 1;
    }

    public copyFrom(...pTextures: Array<GpuTextureCopyOptions | GpuTextureCopyData>): void {
        // Convert into none optional config.
        const lCopyConfig: Array<GpuTextureCopyDefinition> = new Array<GpuTextureCopyDefinition>();
        for (let lTextureIndex: number = 0; lTextureIndex < pTextures.length; lTextureIndex++) {
            const lCopyTexture: GpuTextureCopyOptions | GpuTextureCopyData = pTextures[lTextureIndex];

            // Create new config from data.
            if (!('data' in lCopyTexture)) {
                // Wild instance checks.
                switch (true) {
                    case lCopyTexture instanceof GpuTexture: {
                        lCopyConfig.push({
                            data: lCopyTexture,
                            mipLevel: 0,
                            external: false,
                            dimension: {
                                width: lCopyTexture.width,
                                height: lCopyTexture.height,
                                depthOrArrayLayers: lCopyTexture.depth
                            },
                            sourceOrigin: { x: 0, y: 0, z: 0 },
                            targetOrigin: { x: 0, y: 0, z: lTextureIndex }
                        });

                        continue;
                    }
                    case lCopyTexture instanceof ImageBitmap: {
                        lCopyConfig.push({
                            data: lCopyTexture,
                            mipLevel: 0,
                            external: true,
                            dimension: {
                                width: lCopyTexture.width,
                                height: lCopyTexture.height,
                                depthOrArrayLayers: 1
                            },
                            sourceOrigin: { x: 0, y: 0, z: 0 },
                            targetOrigin: { x: 0, y: 0, z: lTextureIndex }
                        });

                        continue;
                    }
                }

                // Not hit. But better to read.
                continue;
            }

            // Get data type.
            const lExternal: boolean = !(lCopyTexture instanceof GpuTexture);

            // Fill in missing values with defaults.
            lCopyConfig.push({
                data: lCopyTexture.data as any,
                external: lExternal,
                mipLevel: lCopyTexture.mipLevel ?? 0,
                dimension: {
                    width: lCopyTexture.dimension?.width ?? lCopyTexture.data.width,
                    height: lCopyTexture.dimension?.height ?? lCopyTexture.data.height,
                    depthOrArrayLayers: lCopyTexture.dimension?.depth ?? ('depth' in lCopyTexture.data ? lCopyTexture.data.depth : 1)
                },
                sourceOrigin: lCopyTexture.sourceOrigin ?? { x: 0, y: 0, z: 0 },
                targetOrigin: lCopyTexture.targetOrigin ?? { x: 0, y: 0, z: 0 }
            });
        }

        // Extend usage to be able to copy from external and gpu textures.
        this.extendUsage(TextureUsage.CopyDestination);
        this.extendUsage(TextureUsage.RenderAttachment);

        // Generate native texture.
        const lDestination: GPUImageCopyTexture = {
            texture: this.native,
            aspect: 'all'
        };

        // Create copy command encoder to store copy actions.
        const lCommandDecoder: GPUCommandEncoder = this.device.gpu.createCommandEncoder();

        for (const lSourceTexture of lCopyConfig) {
            // Skip copy of textures outside of targets mip level.
            if (lDestination.texture.mipLevelCount < lSourceTexture.mipLevel) {
                continue;
            }

            // Apply destination config.
            lDestination.origin = lSourceTexture.targetOrigin;
            lDestination.mipLevel = lSourceTexture.mipLevel;

            // Calculate target max size for the specific mip map.
            const lDestinationMaxSize: GpuTextureDimension = {
                width: Math.floor(lDestination.texture.width / Math.pow(2, lDestination.mipLevel)),
                height: Math.floor(lDestination.texture.height / Math.pow(2, lDestination.mipLevel)),
                // On 3D textures the depth count to the mip.
                depthOrArrayLayers: (lDestination.texture.dimension === '3d') ?
                    Math.floor(lDestination.texture.depthOrArrayLayers / Math.pow(2, lDestination.mipLevel)) :
                    lDestination.texture.depthOrArrayLayers,
            };

            // Clamp copy sizes to lowest.
            const lClampedCopySize: GpuTextureDimension = {
                width: Math.min(
                    lDestinationMaxSize.width - lSourceTexture.targetOrigin.x,
                    lSourceTexture.dimension.width - lSourceTexture.sourceOrigin.x
                ),
                height: Math.min(
                    lDestinationMaxSize.height - lSourceTexture.targetOrigin.y,
                    lSourceTexture.dimension.height - lSourceTexture.sourceOrigin.y
                ),
                depthOrArrayLayers: Math.min(
                    lDestinationMaxSize.depthOrArrayLayers - lSourceTexture.targetOrigin.z,
                    lSourceTexture.dimension.depthOrArrayLayers - lSourceTexture.sourceOrigin.z
                )
            };

            // Omit copy when nothing should by copied.
            if (lClampedCopySize.width < 1 || lClampedCopySize.height < 1 || lClampedCopySize.depthOrArrayLayers < 1) {
                continue;
            }

            // Copy external.
            if (lSourceTexture.external) {
                // Create External source.
                const lSource: GPUImageCopyExternalImage = {
                    source: lSourceTexture.data,
                    origin: [lSourceTexture.sourceOrigin.x, lSourceTexture.sourceOrigin.y]
                };

                // Add external copy into queue.
                this.device.gpu.queue.copyExternalImageToTexture(lSource, lDestination, lClampedCopySize);

                continue;
            }

            // Create copy source information.
            const lSource: GPUImageCopyTexture = {
                texture: lSourceTexture.data.native,
                aspect: 'all',
                origin: lSourceTexture.targetOrigin,
                mipLevel: 0
            };

            // Add copy action to command queue.
            lCommandDecoder.copyTextureToTexture(lSource, lDestination, lClampedCopySize);
        }

        // Submit copy actions.
        this.device.gpu.queue.submit([lCommandDecoder.finish()]);
    }

    /**
     * Use texture as view. 
     * @returns Texture view.
     */
    public useAs(pDimension?: TextureViewDimension /* Others Optional, layer, mip ... */): GpuTextureView {
        // Use dimension form parameter or convert texture dimension to view dimension.
        const lViewDimension: TextureViewDimension = pDimension ?? (() => {
            switch (this.mDimension) {
                case TextureDimension.OneDimension: {
                    return TextureViewDimension.OneDimension;
                }
                case TextureDimension.TwoDimension: {
                    return TextureViewDimension.TwoDimension;
                }
                case TextureDimension.ThreeDimension: {
                    return TextureViewDimension.ThreeDimension;
                }
            }
        })();

        const lLayout: TextureViewMemoryLayout = new TextureViewMemoryLayout(this.device, {
            format: this.mFormat,
            dimension: lViewDimension,
            multisampled: this.mMultisampled
        });

        return new GpuTextureView(this.device, this, lLayout);
    }

    /**
     * Destory texture object.
     * 
     * @param _pNativeObject - Native gpu texture.
     */
    protected override destroyNative(pNativeObject: GPUTexture): void {
        pNativeObject.destroy();
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generateNative(pOldTexture: GPUTexture): GPUTexture {
        // Generate gpu dimension from memory layout dimension and enforce limits.
        const lTextureDimensions: { textureDimension: GPUTextureDimension, clampedDimensions: [number, number, number]; } = (() => {
            switch (this.mDimension) {
                case TextureDimension.OneDimension: {
                    // Enforce dimension limits.
                    const lDimensionLimit: number = this.device.capabilities.getLimit(GpuLimit.MaxTextureDimension1D);
                    if (this.mWidth > lDimensionLimit) {
                        throw new Exception(`Texture dimension exeeced for 1D Texture(${this.mWidth}).`, this);
                    }

                    return {
                        textureDimension: '1d',
                        clampedDimensions: [this.mWidth, 1, 1]
                    };
                }
                case TextureDimension.TwoDimension: {
                    // Enforce dimension limits.
                    const lDimensionLimit: number = this.device.capabilities.getLimit(GpuLimit.MaxTextureDimension1D);
                    if (this.mWidth > lDimensionLimit || this.mHeight > lDimensionLimit) {
                        throw new Exception(`Texture dimension exeeced for 2D Texture(${this.mWidth}, ${this.mHeight}).`, this);
                    }

                    // Enforce array layer limits.
                    const lArrayLayerLimit: number = this.device.capabilities.getLimit(GpuLimit.MaxTextureArrayLayers);
                    if (this.mDepth > lArrayLayerLimit) {
                        throw new Exception(`Texture array layer exeeced for 2D Texture(${this.mDepth}).`, this);
                    }

                    return {
                        textureDimension: '2d',
                        clampedDimensions: [this.mWidth, this.mHeight, this.mDepth]
                    };
                }
                case TextureDimension.ThreeDimension: {
                    // Enforce dimension limits.
                    const lDimensionLimit: number = this.device.capabilities.getLimit(GpuLimit.MaxTextureDimension3D);
                    if (this.mWidth > lDimensionLimit || this.mHeight > lDimensionLimit || this.mDepth > lDimensionLimit) {
                        throw new Exception(`Texture dimension exeeced for 3D Texture(${this.mWidth}, ${this.mHeight}, ${this.mDepth}).`, this);
                    }

                    return {
                        textureDimension: '3d',
                        clampedDimensions: [this.mWidth, this.mHeight, this.mDepth]
                    };
                }
            }
        })();

        // Calculate max mip count.
        let lMaxMipCount;
        if (lTextureDimensions.textureDimension === '3d') {
            lMaxMipCount = 1 + Math.floor(Math.log2(Math.max(this.mWidth, this.mHeight, this.mDepth)));
        } else {
            lMaxMipCount = 1 + Math.floor(Math.log2(Math.max(this.mWidth, this.mHeight)));
        }

        // Create and configure canvas context.
        const lNewTexture: GPUTexture = this.device.gpu.createTexture({
            label: 'GPU-Texture',
            size: lTextureDimensions.clampedDimensions,
            format: this.mFormat as GPUTextureFormat,
            usage: this.usage,
            dimension: lTextureDimensions.textureDimension,
            sampleCount: this.mMultisampled ? 4 : 1,
            mipLevelCount: Math.min(this.mMipLevelCount, lMaxMipCount)
        });

        // Copy old texture data into new texture.
        if (pOldTexture !== null && lNewTexture.sampleCount === 1) {
            // Create copy command encoder to store copy actions.
            const lCommandDecoder: GPUCommandEncoder = this.device.gpu.createCommandEncoder();

            // Copy each mip level.
            const lCopyMipCount: number = Math.min(lNewTexture.mipLevelCount, pOldTexture.mipLevelCount);
            for (let lMipLevel: number = 0; lMipLevel < lCopyMipCount; lMipLevel++) {

                // Create copy source settings.
                const lSource: GPUImageCopyTexture = {
                    texture: pOldTexture,
                    aspect: 'all',
                    origin: [0, 0, 0],
                    mipLevel: lMipLevel
                };

                // Create copy destination settings.
                const lDestination: GPUImageCopyTexture = {
                    texture: lNewTexture,
                    aspect: 'all',
                    origin: [0, 0, 0],
                    mipLevel: lMipLevel
                };

                // Destination clamped sizes to mip level.
                const lDestinationMaxSize: GpuTextureDimension = {
                    width: Math.floor(lNewTexture.width / Math.pow(2, lMipLevel)),
                    height: Math.floor(lNewTexture.height / Math.pow(2, lMipLevel)),
                    // On 3D textures the depth count to the mip.
                    depthOrArrayLayers: (lNewTexture.dimension === '3d') ?
                        Math.floor(lNewTexture.depthOrArrayLayers / Math.pow(2, lMipLevel)) :
                        lNewTexture.depthOrArrayLayers,
                };

                // Source clamped sizes to mip level.
                const lSourceMaxSize: GpuTextureDimension = {
                    width: Math.floor(pOldTexture.width / Math.pow(2, lMipLevel)),
                    height: Math.floor(pOldTexture.height / Math.pow(2, lMipLevel)),
                    // On 3D textures the depth count to the mip.
                    depthOrArrayLayers: (pOldTexture.dimension === '3d') ?
                        Math.floor(pOldTexture.depthOrArrayLayers / Math.pow(2, lMipLevel)) :
                        pOldTexture.depthOrArrayLayers,
                };

                // Clamp copy sizes to lowest.
                const lClampedCopySize: GpuTextureDimension = {
                    width: Math.min(lSourceMaxSize.width, lDestinationMaxSize.width),
                    height: Math.min(lSourceMaxSize.height, lDestinationMaxSize.height),
                    depthOrArrayLayers: Math.min(lSourceMaxSize.depthOrArrayLayers, lDestinationMaxSize.depthOrArrayLayers)
                };


                // Add copy action to command queue.
                lCommandDecoder.copyTextureToTexture(lSource, lDestination, lClampedCopySize);
            }

            // Submit copy actions.
            this.device.gpu.queue.submit([lCommandDecoder.finish()]);
        }

        return lNewTexture;
    }
}

type GpuTextureParameter = {
    format: TextureFormat;
    dimension: TextureDimension;
    multisampled: boolean;
};

type GpuTextureDimension = {
    width: number;
    height: number;
    depthOrArrayLayers: number;
};

type GpuTextureOrigin = {
    x: number;
    y: number;
    z: number;
};

type GpuTextureCopyDefinition = ({ data: GpuTexture; external: false; } | { data: ImageBitmap; external: true; }) & {
    mipLevel: number;
    dimension: GpuTextureDimension;
    sourceOrigin: GpuTextureOrigin;
    targetOrigin: GpuTextureOrigin;
};

type GpuTextureCopyData = GpuTexture | ImageBitmap;
export type GpuTextureCopyOptions = {
    data: GpuTextureCopyData;
    mipLevel?: number;
    dimension?: {
        width: number;
        height: number;
        depth: number;
    };
    sourceOrigin?: GpuTextureOrigin;
    targetOrigin?: GpuTextureOrigin;
};