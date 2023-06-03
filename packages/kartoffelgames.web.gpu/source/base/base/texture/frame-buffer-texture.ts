import { IFrameBufferTexture } from '../../interface/texture/i-frame-buffer-texture.interface';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { TextureMemoryLayout } from '../memory_layout/texture-memory-layout';

export abstract class FrameBufferTexture<TGpu extends GpuDevice, TNative extends object> extends GpuObject<TGpu, TNative> implements IFrameBufferTexture {
    private readonly mDepth: number;
    private mHeight: number;
    private readonly mMemoryLayout: TextureMemoryLayout;
    private mMultiSampleLevel: number;
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
    } set height(pValue: number) {
        this.mHeight = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate();
    }

    /**
     * Textures memory layout.
     */
    public get memoryLayout(): TextureMemoryLayout {
        return this.mMemoryLayout;
    }

    /**
     * Texture multi sample level.
     */
    public get multiSampleLevel(): number {
        return this.mMultiSampleLevel;
    } set multiSampleLevel(pValue: number) {
        this.mMultiSampleLevel = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate();
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mWidth;
    } set width(pValue: number) {
        this.mWidth = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate();
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture memory layout.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: TGpu, pLayout: TextureMemoryLayout, pDepth: number = 1) {
        super(pDevice);

        // Fixed values.
        this.mDepth = pDepth;
        this.mMemoryLayout = pLayout;

        // Set defaults.
        this.mHeight = 1;
        this.mWidth = 1;
        this.mMultiSampleLevel = 1;
    }
}