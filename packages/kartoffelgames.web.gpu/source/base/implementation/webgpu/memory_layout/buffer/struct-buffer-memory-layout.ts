import { Base } from '../../../base/export.';
import { BufferMemoryLayout } from '../../../base/memory_layout/buffer/buffer-memory-layout';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { IStructBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-struct-buffer.memory-layout.interface';

export class StructBufferMemoryLayout extends Base.StructBufferMemoryLayout implements IStructBufferMemoryLayout {
    private mAlignment: number;
    private mSize: number;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        return this.mSize;
    }

    /**
     * Constructor.
     */
    public constructor(pParameter: StructBufferMemoryLayoutParameter) {
        super(pParameter);

        this.mAlignment = 0;
        this.mSize = 0;
    }

    /**
     * Recalculate size and alignment.
     */
    protected override onProperyAdd(): void {
         // Recalculate size.
        let lRawDataSize: number = 0;
        for (const lType of this.properties) {
            // Increase offset to needed alignment.
            lRawDataSize = Math.ceil(lRawDataSize / lType.alignment) * lType.alignment;

            // Increase offset for type.
            lRawDataSize += lType.size;

            if (lType.alignment > this.mAlignment) {
                this.mAlignment = lType.alignment;
            }
        }

        // Apply struct alignment to raw data size.
        this.mSize = Math.ceil(lRawDataSize / this.mAlignment) * this.mAlignment;
    }
}

type StructBufferMemoryLayoutParameter = {
    type: 'StructBuffer';

    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: BufferMemoryLayout;

    // New.
    structName: string;
};