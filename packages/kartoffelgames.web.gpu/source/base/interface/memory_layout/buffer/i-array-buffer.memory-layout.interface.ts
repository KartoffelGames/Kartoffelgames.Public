import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { IBufferMemoryLayout } from './i-buffer-memory-layout.interface';

export interface IArrayBufferMemoryLayout extends IBufferMemoryLayout {
    /**
     * Array size.
     */
    readonly arraySize: number;

    /**
     * Array item layout.
     */
    readonly innerType: IBufferMemoryLayout;
}

export type ArrayBufferMemoryLayoutParameter = {
    // "Interited" from BufferMemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: IBufferMemoryLayout;

    // New.
    arraySize: number;
    innerType: IBufferMemoryLayout;
};