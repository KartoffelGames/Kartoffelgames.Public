import { TextureDimension } from '../../constant/texture-dimension.enum';
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
     * Texture multi sample level. // TODO: Move into layout.
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
        pLayout.addInvalidationListener(() => {
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
            // Generate gpu dimension from memory layout dimension.
            const lGpuDimension: GPUTextureDimension = (() => {
                switch (this.memoryLayout.dimension) {
                    case TextureDimension.OneDimension: {
                        return '1d';
                    }
                    case TextureDimension.TwoDimension: {
                        return '2d';
                    }
                    case TextureDimension.TwoDimensionArray: {
                        return '3d';
                    }
                    case TextureDimension.Cube: {
                        return '3d';
                    }
                    case TextureDimension.CubeArray: {
                        return '3d';
                    }
                    case TextureDimension.ThreeDimension: {
                        return '3d';
                    }
                }
            })();

            // Create and configure canvas context.
            this.mTexture = this.device.gpu.createTexture({
                label: 'Frame-Buffer-Texture',
                size: [this.width, this.height, this.depth],
                format: this.memoryLayout.format,
                usage: this.memoryLayout.usage,
                dimension: lGpuDimension,
                sampleCount: this.multiSampleLevel
            });
        }

        // TODO: View descriptor.
        // https://www.w3.org/TR/webgpu/#dom-gputexture-createview
        return this.mTexture.createView();
    }
}