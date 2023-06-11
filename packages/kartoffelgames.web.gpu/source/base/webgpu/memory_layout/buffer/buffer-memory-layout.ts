import { Base } from '../../../base/export.';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { WgslType } from '../../shader/wgsl_enum/wgsl-type.enum';


export abstract class BufferMemoryLayout extends Base.BufferMemoryLayout {
    private readonly mType: WgslType;

    /**
     * Wgsl type.
     */
    public get type(): WgslType {
        return this.mType;
    };

    /**
     * Constructor.
     */
    public constructor(pParameter: BufferMemoryLayoutParameter) {
        super(pParameter);

        this.mType = pParameter.type;
    }
}

type BufferMemoryLayoutParameter = {
    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: BufferMemoryLayout;
    type: WgslType;
};