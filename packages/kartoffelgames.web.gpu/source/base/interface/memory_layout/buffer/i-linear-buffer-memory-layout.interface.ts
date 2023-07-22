import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { IMemoryLayout } from '../i-memory-layout.interface';
import { IBufferMemoryLayout } from './i-buffer-memory-layout.interface';

export interface ILinearBufferMemoryLayout extends IMemoryLayout {
}

export type LinearBufferMemoryLayoutParameter = {
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: IBufferMemoryLayout;
    size: number;
    alignment: number;
};