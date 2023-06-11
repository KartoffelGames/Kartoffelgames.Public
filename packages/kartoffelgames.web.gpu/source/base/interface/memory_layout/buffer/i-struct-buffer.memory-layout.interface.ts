import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { IBufferMemoryLayout } from './i-buffer-memory-layout.interface';

export interface IStructBufferMemoryLayout extends IBufferMemoryLayout {
    /**
     * Struct name.
     */
    readonly structName: string;

    /**
     * Add property to struct.
     * @param pName - Property name.
     * @param pOrder - Index of property.
     * @param pLayout - Property type.
     */
    addProperty(pOrder: number, pLayout: IBufferMemoryLayout): void;

    /**
     * Get types of properties with set location.
     */
    locations(): Array<IBufferMemoryLayout>;
}

export type StructBufferMemoryLayoutParameter = {
    // "Interited" from BufferMemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: IBufferMemoryLayout;

    // New.
    structName: string;
};