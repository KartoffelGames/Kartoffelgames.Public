import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryType } from '../../constant/memory-type.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { IMemoryLayout } from './i-memory-layout.interface';

export interface ITextureMemoryLayout extends IMemoryLayout {
    /**
     * Texture dimension.
     */
    readonly dimension: TextureDimension;

    /**
     * Texture format.
     */
    readonly format: TextureFormat;
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