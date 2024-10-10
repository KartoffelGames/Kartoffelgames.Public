import { Exception } from '@kartoffelgames/core';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { TextureMemoryLayout, TextureMemoryLayoutInvalidationType } from '../memory_layout/texture/texture-memory-layout';
import { BaseTexture } from './base-texture';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';

export class FrameBufferTexture extends BaseTexture<FrameBufferTextureInvalidationType> {
    private mDepth: number;
    private mHeight: number;
    private mMultiSampleLevel: number;
    private mTexture: GPUTexture | null;
    private mWidth: number;

    /**
     * Texture depth.
     */
    public get depth(): number {
        return this.mDepth;
    } set depth(pValue: number) {
        this.mDepth = pValue;

        // Invalidate native.
        this.invalidate(FrameBufferTextureInvalidationType.Resize, FrameBufferTextureInvalidationType.TextureRebuild);
    }

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mHeight;
    } set height(pValue: number) {
        this.mHeight = pValue;

        // Invalidate native.
        this.invalidate(FrameBufferTextureInvalidationType.Resize, FrameBufferTextureInvalidationType.TextureRebuild);
    }

    /**
     * Texture multi sample level. // TODO: Move into layout. Maybe. Or not. As a layout can only hold true or false.
     */
    public get multiSampleLevel(): number {
        return this.mMultiSampleLevel;
    } set multiSampleLevel(pValue: number) {
        this.mMultiSampleLevel = pValue;

        // Invalidate native.
        this.invalidate(FrameBufferTextureInvalidationType.MultisampleChange, FrameBufferTextureInvalidationType.TextureRebuild);
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mWidth;
    } set width(pValue: number) {
        this.mWidth = pValue;

        // Invalidate native.
        this.invalidate(FrameBufferTextureInvalidationType.Resize, FrameBufferTextureInvalidationType.TextureRebuild);
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
        this.mDepth = 1;
        this.mHeight = 1;
        this.mWidth = 1;
        this.mMultiSampleLevel = 1;

        // Trigger Texture rebuild on dimension for format changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(FrameBufferTextureInvalidationType.TextureRebuild);
        }, [TextureMemoryLayoutInvalidationType.Dimension, TextureMemoryLayoutInvalidationType.Format]);

        // Trigger format change on formats.
        pLayout.addInvalidationListener(() => {
            this.invalidate(FrameBufferTextureInvalidationType.FormatChange);
        }, [TextureMemoryLayoutInvalidationType.Format]);
    }

    /**
     * Destory texture object.
     * 
     * @param _pNativeObject - Native canvas texture.
     * @param pInvalidationReason - Invalidation reasons.
     */
    protected override destroyNative(_pNativeObject: GPUTextureView, pInvalidationReason: GpuObjectInvalidationReasons<FrameBufferTextureInvalidationType>): void {
        // Desconstruct current texture only on deconstruction calls.
        if (pInvalidationReason.deconstruct) {
            this.mTexture?.destroy();
            this.mTexture = null;
        }
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generateNative(): GPUTextureView {
        // TODO: Validate format based on layout. Maybe replace used format.

        // Validate two dimensional texture.
        if (this.layout.dimension !== TextureDimension.TwoDimension) {
            throw new Exception('Frame buffers must be two dimensional.', this);
        }

        // Any change triggers a texture rebuild.
        this.mTexture?.destroy();
        this.mTexture = null;

        // Invalidate texture and view.
        this.invalidate(FrameBufferTextureInvalidationType.TextureRebuild, FrameBufferTextureInvalidationType.ViewRebuild);

        // Create and configure canvas context.
        this.mTexture = this.device.gpu.createTexture({
            label: 'Frame-Buffer-Texture',
            size: [this.width, this.height, 1], // Force 2d texture.
            format: this.layout.format as GPUTextureFormat,
            usage: this.usage,
            dimension: '2d',
            sampleCount: this.multiSampleLevel
        });

        // Force a 2d view.
        return this.mTexture.createView({
            format: this.layout.format as GPUTextureFormat,
            dimension: '2d'
        });
    }

    /**
     * On usage extened. Triggers a texture rebuild.
     */
    protected override onUsageExtend(): void {
        this.invalidate(FrameBufferTextureInvalidationType.UsageExtended);
    }
}

export enum FrameBufferTextureInvalidationType {
    TextureRebuild = 'TextureRebuild',
    ViewRebuild = 'ViewRebuild',
    Resize = 'Resize',
    MultisampleChange = 'MultisampleChange',
    UsageExtended = 'UsageChange',
    FormatChange = 'FormatChange'
}