import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseMemoryLayout } from '../base-memory-layout';

/**
 * Memory layout for textures.
 */
export class TextureMemoryLayout extends BaseMemoryLayout<TextureMemoryLayoutInvalidationType> {
    private mDimension: TextureDimension;
    private mFormat: TextureFormat;
    private mMultisampled: boolean;

    /**
     * Texture dimension.
     */
    public get dimension(): TextureDimension {
        return this.mDimension;
    } set dimension(pDimension: TextureDimension) {
        this.mDimension = pDimension;

        // Invalidate layout.
        this.invalidate(TextureMemoryLayoutInvalidationType.Dimension);
    }

    /**
     * Texture format.
     */
    public get format(): TextureFormat {
        return this.mFormat;
    } set format(pFormat: TextureFormat) {
        this.mFormat = pFormat;

        // Invalidate layout.
        this.invalidate(TextureMemoryLayoutInvalidationType.Format);
    }

    /**
     * Texture uses multisample.
     */
    public get multisampled(): boolean {
        return this.mMultisampled;
    } set multisampled(pValue: boolean) {
        this.mMultisampled = pValue;

        // Invalidate layout.
        this.invalidate(TextureMemoryLayoutInvalidationType.Multisampled);
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        // Set defauls.
        this.mDimension = TextureDimension.TwoDimension;
        this.mFormat = TextureFormat.Bgra8unorm;
        this.mMultisampled = false;
    }
}

export enum TextureMemoryLayoutInvalidationType {
    Format = 'FormatChange',
    Dimension = 'DimensionChange',
    Multisampled = 'MultisampledChange'
}