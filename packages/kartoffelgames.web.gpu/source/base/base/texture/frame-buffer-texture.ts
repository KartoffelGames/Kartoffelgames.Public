import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { TextureMemoryLayout } from '../memory_layout/texture-memory-layout';

export class FrameBufferTexture extends GpuObject<'frameBufferTexture'> {
    private mDepth: number;
    private mHeight: number;
    private readonly mMemoryLayout: TextureMemoryLayout;
    private mMultiSampleLevel: number;
    private mWidth: number;

    /**
     * Texture depth.
     */
    public get depth(): number {
        return this.mDepth;
    } set depth(pValue: number) {
        this.mDepth = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate();
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
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout) {
        super(pDevice);

        // Fixed values.

        this.mMemoryLayout = pLayout;

        // Set defaults.
        this.mDepth = 1;
        this.mHeight = 1;
        this.mWidth = 1;
        this.mMultiSampleLevel = 1;

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate();
        });
    }
}