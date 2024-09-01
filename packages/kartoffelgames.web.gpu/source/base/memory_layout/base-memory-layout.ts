import { AccessMode } from '../../constant/access-mode.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';

export abstract class BaseMemoryLayout {
    private readonly mName: string;

    /**
     * Variable name of buffer.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constuctor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: MemoryLayoutParameter) {
        this.mName = pParameter.name;
    }
}

export interface MemoryLayoutParameter {
    access: AccessMode;
    bindingIndex: number | null;
    name: string;
    visibility: ComputeStage;
}