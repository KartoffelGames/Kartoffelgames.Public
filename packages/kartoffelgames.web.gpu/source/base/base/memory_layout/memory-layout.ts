import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryType } from '../../constant/memory-type.enum';
import { IMemoryLayout } from '../../interface/memory_layout/i-memory-layout.interface';

export abstract class MemoryLayout implements IMemoryLayout {
    private readonly mAccessMode: AccessMode;
    private readonly mBindType: BindType;
    private readonly mLocation: number | null;
    private readonly mName: string;
    private readonly mVisibility: ComputeStage;
    private readonly mMemoryType: MemoryType;

    /**
     * Buffer type access mode.
     */
    public get accessMode(): AccessMode {
        return this.mAccessMode;
    }

    /**
     * Buffer bind type.
     */
    public get bindType(): BindType {
        return this.mBindType;
    }

    /**
     * Get buffer location index as parameter.
     */
    public get location(): number | null {
        return this.mLocation;
    }

    /**
     * Memory type.
     */
    public get memoryType(): MemoryType {
        return this.mMemoryType;
    }

    /**
     * Variable name of buffer.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Memory visibility on compute state.
     */
    public get visibility(): ComputeStage {
        return this.mVisibility;
    }

    /**
     * Constuctor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: MemoryLayoutParameter) {
        this.mAccessMode = pParameter.access;
        this.mBindType = pParameter.bindType;
        this.mLocation = pParameter.location;
        this.mName = pParameter.name;
        this.mVisibility = pParameter.visibility;
        this.mMemoryType = pParameter.memoryType;
    }
}

type MemoryLayoutParameter = {
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
};