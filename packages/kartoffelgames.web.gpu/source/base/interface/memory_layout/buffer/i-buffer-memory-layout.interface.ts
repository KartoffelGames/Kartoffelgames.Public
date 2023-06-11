import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { IMemoryLayout } from '../i-memory-layout.interface';

export interface IBufferMemoryLayout extends IMemoryLayout {
    /**
     * Layout byte alignment.
     */
    readonly alignment: number;

    /**
     * Layout size in bytes.
     */
    readonly size: number;

    /**
     * Get location of path.
     * @param pPathName - Path name.
     */
    locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};

export type BufferMemoryLayoutParameter = {
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: IBufferMemoryLayout;
};