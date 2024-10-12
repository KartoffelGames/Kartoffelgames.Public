import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { TextureMemoryLayout, TextureMemoryLayoutInvalidationType } from '../memory_layout/texture/texture-memory-layout';
import { BaseTexture } from './base-texture';
import { TextureMipGenerator } from './texture-mip-generator';

export class VideoTexture extends BaseTexture<VideoTextureInvalidationType> {
    private mEnableMips: boolean;
    private readonly mMipGenerator: TextureMipGenerator;
    private mTexture: GPUTexture | null;
    private readonly mVideo: HTMLVideoElement;

    /**
     * Set play position in secons.
     */
    public get currentTime(): number {
        return this.mVideo.currentTime;
    } set currentTime(pValue: number) {
        this.mVideo.currentTime = pValue;
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
        return this.mVideo.videoHeight;
    }

    /**
     * If video should be looped.
     */
    public get loop(): boolean {
        return this.mVideo.loop;
    } set loop(pValue: boolean) {
        this.mVideo.loop = pValue;
    }

    /**
     * Video source.
     */
    public get source(): string {
        return this.mVideo.src;
    } set source(pValue: string) {
        this.mVideo.src = pValue;
    }

    /**
     * Video width.
     */
    public get width(): number {
        return this.mVideo.videoWidth;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture memory layout.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout) {
        super(pDevice, pLayout);

        this.mMipGenerator = new TextureMipGenerator(pDevice);
        this.mTexture = null;
        this.mEnableMips = true;

        // Create video.
        this.mVideo = document.createElement('video');
        this.mVideo.preload = 'auto';
        this.mVideo.loop = false;
        this.mVideo.muted = true; // Allways muted.

        // Extend usage to copy external data into texture.
        this.extendUsage(TextureUsage.CopyDestination);
        this.extendUsage(TextureUsage.RenderAttachment);

        // When mips are enabled.
        if (this.mEnableMips) {
            this.extendUsage(TextureUsage.TextureBinding);
            this.extendUsage(TextureUsage.Storage);
        }

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(VideoTextureInvalidationType.Layout);
        }, [TextureMemoryLayoutInvalidationType.Dimension, TextureMemoryLayoutInvalidationType.Format]);

        // When video was resized.
        this.mVideo.addEventListener('resize', () => {
            this.invalidate(VideoTextureInvalidationType.Resize);
        });

        // Update video texture on every frame. // TODO: Remove on destroy. 
        this.device.addFrameChangeListener(() => {
            const lVideoHasDataPlaying = this.mVideo.readyState > 1; // Has at least one frame buffered.

            if (this.mTexture && lVideoHasDataPlaying) {
                // Video element as source.
                const lSource: GPUImageCopyExternalImage = {
                    source: this.mVideo
                };

                // Texture as destination. Only add first mip level.
                const lDestination: GPUImageCopyTextureTagged = {
                    texture: this.mTexture,
                    mipLevel: 0
                };

                // Restrict copy size to current texture size.
                // NOT VIDEO SIZE!!! as video size can change faster than current texture.
                const lCopySize: GPUExtent3DDictStrict = {
                    width: this.mTexture.width,
                    height: this.mTexture.height,
                    depthOrArrayLayers: 1
                };

                // Queue copy.
                this.device.gpu.queue.copyExternalImageToTexture(lSource, lDestination, lCopySize);

                // Generate mip when enabled.
                if (this.mEnableMips) {
                    // Generate mips for texture.
            this.mMipGenerator.generateMips(this.mTexture);
                }
            }
        });
    }

    /**
     * Pause video.
     */
    public pause(): void {
        this.mVideo.pause();
    }

    /**
     * Play video.
     */
    public play(): void {
        this.mVideo.play();
    }

    /**
     * Destory texture object.
     * 
     * @param _pNativeObject - Native canvas texture.
     * @param pInvalidationReason - Invalidation reasons.
     */
    protected override destroyNative(_pNativeObject: GPUTextureView, pInvalidationReason: GpuObjectInvalidationReasons<VideoTextureInvalidationType>): void {
        // Desconstruct current texture only on deconstruction calls.
        if (pInvalidationReason.deconstruct) {
            this.mTexture?.destroy();
            this.mTexture = null;

            // Stop and reset video.
            this.mVideo.pause();
            this.mVideo.src = '';
        }
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generateNative(): GPUTextureView {
        // TODO: Validate format based on layout. Maybe replace used format.

        // Clamp with and height to never fall under 1.
        const lClampedTextureWidth: number = Math.max(this.width, 1);
        const lClampedTextureHeight: number = Math.max(this.height, 1);

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

        // Calculate mip count.
        let lMipCount = 1;
        if (this.mEnableMips) {
            lMipCount = 1 + Math.floor(Math.log2(Math.max(lClampedTextureWidth, lClampedTextureHeight)));
        }

        // Any change triggers a texture rebuild.
        this.mTexture?.destroy();

        // Create texture with set size, format and usage. Save it for destorying later.
        this.mTexture = this.device.gpu.createTexture({
            label: 'Video-Buffer-Texture',
            size: [lClampedTextureWidth, lClampedTextureHeight, 1],
            format: this.layout.format as GPUTextureFormat,
            usage: this.usage,
            dimension: lGpuDimension,
            mipLevelCount: lMipCount
        });

        // TODO: View descriptor.
        return this.mTexture.createView({
            format: this.layout.format as GPUTextureFormat,
            dimension: this.layout.dimension
        });
    }

    /**
     * On usage extened. Triggers a texture rebuild.
     */
    protected override onUsageExtend(): void {
        this.invalidate(VideoTextureInvalidationType.Usage);
    }
}

export enum VideoTextureInvalidationType {
    Layout = 'LayoutChange',
    Usage = 'UsageChange',
    Resize = 'Resize',
}