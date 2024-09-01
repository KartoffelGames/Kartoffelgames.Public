import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureUsage } from '../../../constant/texture-usage.enum';
import { BaseMemoryLayout, MemoryLayoutParameter } from '../base-memory-layout';

export class TextureMemoryLayout extends BaseMemoryLayout {
    private readonly mBindType: TextureBindType;
    private readonly mDimension: TextureDimension;
    private readonly mFormat: TextureFormat;
    private readonly mMultisampled: boolean;
    private mUsage: TextureUsage;

    /**
     * Texture dimension.
     */
    public get bindType(): TextureBindType {
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
    }

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
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: TextureMemoryLayoutParameter) {
        super(pParameter);

        this.mBindType = pParameter.bindType;
        this.mDimension = pParameter.dimension;
        this.mFormat = pParameter.format;
        this.mUsage = pParameter.usage;
        this.mMultisampled = pParameter.multisampled;
    }
}

export interface TextureMemoryLayoutParameter extends MemoryLayoutParameter {
    usage: TextureUsage;
    dimension: TextureDimension;
    format: TextureFormat;
    bindType: TextureBindType;
    multisampled: boolean;
}