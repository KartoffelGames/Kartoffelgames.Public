import { Base } from '../../../base/export.';
import { BufferMemoryLayout } from '../../../base/memory_layout/buffer/buffer-memory-layout';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { IArrayBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-array-buffer.memory-layout.interface';

export class ArrayBufferMemoryLayout extends Base.ArrayBufferMemoryLayout implements IArrayBufferMemoryLayout {
    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.innerType.alignment;
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        if (this.arraySize === -1) {
            return this.arraySize;
        }

        return this.arraySize * (Math.ceil(this.innerType.size / this.innerType.alignment) * this.innerType.alignment);
    }

    /**
     * Constructor.
     * @param pInnerType - Type of array.
     * @param pSize - Optional array size.
     */
    public constructor(pParameter: ArrayBufferMemoryLayoutParameter) {
        super(pParameter);
    }
}

type ArrayBufferMemoryLayoutParameter = {
    type: 'ArrayBuffer';

    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: BufferMemoryLayout;

    // New
    innerType: BufferMemoryLayout;
    arraySize: number;
};