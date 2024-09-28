import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseMemoryLayout } from '../base-memory-layout';

export class TextureMemoryLayout extends BaseMemoryLayout<TextureMemoryLayoutInvalidationType> {
    private readonly mBindType: TextureBindType;
    private readonly mDimension: TextureDimension;
    private readonly mFormat: TextureFormat;
    private readonly mMultisampled: boolean;
    private mUsage: TextureUsage;

    /**
     * Texture dimension.
     */
    public get bindType(): TextureBindType { // TODO: Do we need bind type when we have usage.
        return this.mBindType;
    }

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
     * Texture usage.
     */
    public get usage(): TextureUsage {
        return this.mUsage;
    } set usage(pValue: TextureUsage) {
        this.mUsage = pValue;

        // Invalidate layout on setting changes.
        this.invalidate(TextureMemoryLayoutInvalidationType.Usage);
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pParameter: TextureMemoryLayoutParameter) {
        super(pDevice);

        this.mBindType = pParameter.bindType;
        this.mDimension = pParameter.dimension;
        this.mFormat = pParameter.format;
        this.mUsage = pParameter.usage;
        this.mMultisampled = pParameter.multisampled;
    }
}

export interface TextureMemoryLayoutParameter {
    usage: TextureUsage;
    dimension: TextureDimension;
    format: TextureFormat;
    bindType: TextureBindType;
    multisampled: boolean;
}

export enum TextureMemoryLayoutInvalidationType {
    Usage = 'UsageChange',
    Format = 'FormatChange',
    Dimension = 'DimensionChange'
}