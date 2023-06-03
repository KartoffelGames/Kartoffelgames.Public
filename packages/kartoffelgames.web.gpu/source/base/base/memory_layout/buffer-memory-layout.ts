import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryType } from '../../constant/memory-type.enum';
import { IBufferLayout } from '../../interface/memory_layout/i-buffer-memory-layout.interface';
import { MemoryLayout } from './memory-layout';

export abstract class BufferMemoryLayout extends MemoryLayout implements IBufferLayout {
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
    public abstract locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

type BufferMemoryLayoutParameter = {
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