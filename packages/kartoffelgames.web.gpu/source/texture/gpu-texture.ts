import { TextureUsage } from '../constant/texture-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';

export class GpuTexture extends GpuObject<GPUTexture, GpuTextureInvalidationType> implements IGpuObjectNative<GPUTexture> {
    private readonly mMemoryLayout: TextureMemoryLayout;
    private mMipLevelCount: number;
    private mTextureUsage: TextureUsage;

    private mWidth: number;
    private mHeight: number;
    private mDepth: number;

    /**
     * Texture memory layout.
     */
    public get layout(): TextureMemoryLayout {
        return this.mMemoryLayout;
    }

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
     * Texture mip level count.
     */
    public get mipCount(): number {
        return this.mMipLevelCount;
    } set mipCount(pMipCount: number) {
        this.mMipLevelCount = pMipCount;

        // Callback changes.
        this.onSettingChange();
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
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUTexture {
        return super.native;
    }

    /**
     * Texture usage.
     */
    protected get usage(): TextureUsage {
        return this.mTextureUsage;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture layout.
     * @param pCanvas - Canvas of texture.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout) {
        super(pDevice);

        // Set layout.
        this.mMemoryLayout = pLayout;

        // Set defaults.
        this.mTextureUsage = TextureUsage.None;
        this.mMipLevelCount = 1;
        this.mDepth = 1;
        this.mHeight = 1;
        this.mWidth = 1;

        // Trigger Texture rebuild on dimension for format changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(GpuTextureInvalidationType.LayoutChange, GpuTextureInvalidationType.NativeRebuild);
        });
    }

    /**
     * Extend usage of texture.
     * Might trigger a texture rebuild.
     * 
     * @param pUsage - Texture usage. 
     */
    public extendUsage(pUsage: TextureUsage): this {
        // Update onyl when not already set.
        if ((this.mTextureUsage & pUsage) === 0) {
            this.mTextureUsage |= pUsage;
            this.invalidate(GpuTextureInvalidationType.NativeRebuild);
        }

        return this;
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
    protected override generateNative(): GPUTexture {
        // Invalidate texture and view.
        this.invalidate(GpuTextureInvalidationType.NativeRebuild);

        // Create and configure canvas context.
        return this.device.gpu.createTexture({
            label: 'GPU-Texture',
            size: [this.mWidth, this.mHeight, this.mDepth], // Force 2d texture.
            format: this.layout.format as GPUTextureFormat,
            usage: this.usage,
            dimension: this.layout.dimension,
            sampleCount: this.multiSampleLevel
        });
    }

    // TODO: Create SubTextures that uses a existing baseTexture but allow changes to the output view. Like aspect, dimension, layers or miplevels.
    // Expose inner texture to baseTexture and expose as lTexture.useAs({mip, arrayLevels, depth ...})

    // TODO: Add a copy into method.
}

export enum GpuTextureInvalidationType {
    NativeRebuild = 'NativeRebuild',
    LayoutChange = 'LayoutChange'
}