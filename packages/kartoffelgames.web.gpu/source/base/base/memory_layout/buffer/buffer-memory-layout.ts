import { Exception } from '@kartoffelgames/core.data';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { IBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-buffer-memory-layout.interface';
import { MemoryLayout } from '../memory-layout';

export abstract class BufferMemoryLayout extends MemoryLayout implements IBufferMemoryLayout {
    private readonly mParent: BufferMemoryLayout | null;

    /**
     * Type byte alignment.
     */
    public abstract readonly alignment: number;

    /**
     * Buffer size in bytes.
     */
    public abstract readonly size: number;

    /**
     * Parent type. Stuct or Array.
     */
    public get parent(): BufferMemoryLayout | null {
        return this.mParent;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: BufferMemoryLayoutParameter) {
        super(pParameter);

        // Static properties.
        this.mParent = pParameter.parent;
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public locationOf(pPathName: Array<string>): BufferLayoutLocation {
        // Only validate name.
        if (pPathName.length !== 0) {
            throw new Exception(`Simple buffer layout has no properties.`, this);
        }

        return { size: this.size, offset: 0 };
    }
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
    parent: BufferMemoryLayout;
};

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};