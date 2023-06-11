import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryType } from '../../constant/memory-type.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { ITextureMemoryLayout } from '../../interface/memory_layout/i-texture-memory-layout.interface';
import { MemoryLayout } from './memory-layout';

export class TextureMemoryLayout extends MemoryLayout implements ITextureMemoryLayout {
    private readonly mDimension: TextureDimension;
    private readonly mFormat: TextureFormat;

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
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: TextureMemoryLayoutParameter) {
        super(pParameter);

        this.mDimension = pParameter.dimension;
        this.mFormat = pParameter.format;
    }

}

export type TextureMemoryLayoutParameter = {
    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;

    // New 
    dimension: TextureDimension;
    format: TextureFormat;
};