import { Base } from '../../../base/export.';
import { BufferMemoryLayout } from '../../../base/memory_layout/buffer/buffer-memory-layout';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { ILinearBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-linear-buffer-memory-layout.interface';

export class LinearBufferMemoryLayout extends Base.LinearBufferMemoryLayout implements ILinearBufferMemoryLayout {
    /**
     * Constructor.
     * @param pType - Simple type. Scalar, Atomic, Vector and Matrix types.
     * @param pGenerics - Generics of type.
     */
    public constructor(pParameter: LinearBufferMemoryLayoutParameter) {
        super(pParameter);
    }
}

type LinearBufferMemoryLayoutParameter = {
    type: 'LinearBuffer';

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