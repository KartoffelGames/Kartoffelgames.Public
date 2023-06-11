import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { ILinearBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-linear-buffer-memory-layout.interface';
import { BufferMemoryLayout } from './buffer-memory-layout';

export class LinearBufferMemoryLayout extends BufferMemoryLayout implements ILinearBufferMemoryLayout {
    private readonly mAlignment: number;
    private readonly mSize: number;

    /**
     * Type byte alignment.
     */
    public get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Buffer size in bytes.
     */
    public get size(): number {
        return this.mSize;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: LinearBufferMemoryLayoutParameter) {
        super(pParameter);

        // Static properties.
        this.mAlignment = pParameter.alignment;
        this.mSize = pParameter.size;
    }
}

export type LinearBufferMemoryLayoutParameter = {
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: BufferMemoryLayout;
    size: number;
    alignment: number;
};