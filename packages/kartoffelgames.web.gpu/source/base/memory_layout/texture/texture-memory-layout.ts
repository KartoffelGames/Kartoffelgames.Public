import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseMemoryLayout } from '../base-memory-layout';

export class TextureMemoryLayout extends BaseMemoryLayout<TextureMemoryLayoutInvalidationType> {
    private readonly mDimension: TextureDimension;
    private readonly mFormat: TextureFormat;
    private readonly mMultisampled: boolean;

    /**
     * Texture dimension.
     */
    public get dimension(): TextureDimension {
        return this.mDimension;
    }

    /**
     * Texture format.
     */
    public get format(): TextureFormat {
        return this.mFormat;
    } // TODO: Format-Change

    /**
     * Texture uses multisample.
     */
    public get multisampled(): boolean {
        return this.mMultisampled;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pParameter: TextureMemoryLayoutParameter) {
        super(pDevice);

        this.mDimension = pParameter.dimension;
        this.mFormat = pParameter.format;
        this.mMultisampled = pParameter.multisampled;
    }
}

export interface TextureMemoryLayoutParameter {
    dimension: TextureDimension;
    format: TextureFormat;
    multisampled: boolean;
}

export enum TextureMemoryLayoutInvalidationType {
    Format = 'FormatChange',
    Dimension = 'DimensionChange'
}