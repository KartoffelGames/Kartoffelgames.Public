import { TextureUsage } from '../constant/texture-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';

export abstract class BaseTexture<TInvalidationType extends string = any> extends GpuObject<GPUTextureView, TInvalidationType> implements IGpuObjectNative<GPUTextureView> {
    private readonly mMemoryLayout: TextureMemoryLayout;
    private mTextureUsage: TextureUsage;

    /**
     * Texture memory layout.
     */
    public get layout(): TextureMemoryLayout {
        return this.mMemoryLayout;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUTextureView {
        return super.native;
    }

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
        this.mTextureUsage = TextureUsage.None;
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
            this.onUsageExtend();
        }

        return this;
    }

    /**
     * Called when usage was changed.
     */
    protected abstract onUsageExtend(): void;

    // TODO: Create SubTextures that uses a existing baseTexture but allow changes to the output view. Like aspect, dimension, layers or miplevels.
}