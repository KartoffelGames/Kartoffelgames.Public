import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';

export class FrameBufferTexture extends GpuNativeObject<GPUTextureView> {
    private mDepth: number;
    private mHeight: number;
    private readonly mMemoryLayout: TextureMemoryLayout;
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

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mHeight;
    } set height(pValue: number) {
        this.mHeight = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
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
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mWidth;
    } set width(pValue: number) {
        this.mWidth = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.Setting);
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pLayout - Texture memory layout.
     * @param pDepth - Texture depth.
     */
    public constructor(pDevice: GpuDevice, pLayout: TextureMemoryLayout) {
        super(pDevice, NativeObjectLifeTime.Frame);

        this.mTexture = null;

        // Fixed values.
        this.mMemoryLayout = pLayout;

        // Set defaults.
        this.mDepth = 1;
        this.mHeight = 1;
        this.mWidth = 1;
        this.mMultiSampleLevel = 1;

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }

    /**
     * Destory texture object.
     * @param _pNativeObject - Native canvas texture.
     */
    protected override destroy(_pNativeObject: GPUTextureView): void {
        this.mTexture?.destroy();
        this.mTexture = null;
    }

    /**
     * Generate native canvas texture view.
     */
    protected override generate(): GPUTextureView {
        // Configure context.
        if (!this.mTexture) {
            // Create and configure canvas context.
            this.mTexture = this.device.device.createTexture({
                label: 'Frame-Buffer-Texture',
                size: [this.width, this.height, this.depth],
                format: this.factory.formatFromLayout(this.memoryLayout),
                usage: this.factory.usageFromLayout(this.memoryLayout),
                dimension: this.factory.dimensionFromLayout(this.memoryLayout),
                sampleCount: this.gpuObject.multiSampleLevel
            });
        }

        // TODO: View descriptor.
        return this.mTexture.createView();
    }
}