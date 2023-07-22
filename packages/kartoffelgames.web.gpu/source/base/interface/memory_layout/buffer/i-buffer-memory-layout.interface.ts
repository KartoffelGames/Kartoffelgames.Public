import { TypedArray } from '@kartoffelgames/core.data';
import { IMemoryLayout } from '../i-memory-layout.interface';
import { IBuffer } from '../../buffer/i-buffer.interface';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';

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
     * Create buffer from layout.
     * @param pInitialData - Inital buffer data.
     */
    create<TType extends TypedArray>(pInitialData: TType): IBuffer<TypedArray>

    /**
     * Get location of path.
     * @param pPathName - Path name.
     */
    locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

export type BufferMemoryLayoutParameter = {
    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;

    // New 
    parent: IBufferMemoryLayout;
};

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};