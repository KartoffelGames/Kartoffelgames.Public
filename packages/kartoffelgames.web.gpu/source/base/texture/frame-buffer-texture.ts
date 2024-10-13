import { Exception } from '@kartoffelgames/core';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';
import { BaseTexture } from './base-texture';

export class FrameBufferTexture extends BaseTexture<FrameBufferTextureInvalidationType> {
    private mDepth: number;
    private mHeight: number;
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
        this.invalidate(FrameBufferTextureInvalidationType.NativeRebuild);
    }

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mHeight;
    } set height(pValue: number) {
        this.mHeight = pValue;

        // Invalidate native.
        this.invalidate(FrameBufferTextureInvalidationType.NativeRebuild);
    }

    /**
     * Texture multi sample level.
     */
    public get multiSampleLevel(): number {
        return (this.layout.multisampled) ? 4 : 1;
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mWidth;
    } set width(pValue: number) {
        this.mWidth = pValue;

        // Invalidate native.
        this.invalidate(FrameBufferTextureInvalidationType.NativeRebuild);
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

        // Trigger Texture rebuild on dimension for format changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(FrameBufferTextureInvalidationType.LayoutChange, FrameBufferTextureInvalidationType.NativeRebuild);
        });
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
        // Invalidate texture and view.
        this.invalidate(FrameBufferTextureInvalidationType.NativeRebuild);

        // TODO: Validate format based on layout. Maybe replace used format.

        // Validate two dimensional texture.
        if (this.layout.dimension !== TextureDimension.TwoDimension) {
            throw new Exception('Frame buffers must be two dimensional.', this);
        }

        // Any change triggers a texture rebuild.
        this.mTexture?.destroy();

        // Create and configure canvas context.
        this.mTexture = this.device.gpu.createTexture({
            label: 'Frame-Buffer-Texture',
            size: [this.mWidth, this.mHeight, 1], // Force 2d texture.
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
        this.invalidate(FrameBufferTextureInvalidationType.NativeRebuild);
    }
}

export enum FrameBufferTextureInvalidationType {
    NativeRebuild = 'NativeRebuild',
    LayoutChange = 'LayoutChange'
}