import { AccessMode } from '../../constant/access-mode.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryCopyType } from '../../constant/memory-copy-type.enum';
import { GpuDependent } from '../gpu/gpu-dependent';
import { GpuTypes } from '../gpu/gpu-device';

export abstract class MemoryLayout<TGpuTypes extends GpuTypes> extends GpuDependent<TGpuTypes> {
    private readonly mAccessMode: AccessMode;
    private readonly mLocation: number | null;
    private readonly mMemoryType: MemoryCopyType;
    private readonly mName: string;
    private readonly mVisibility: ComputeStage;

    /**
     * Buffer type access mode.
     */
    public get accessMode(): AccessMode {
        return this.mAccessMode;
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
    public get memoryType(): MemoryCopyType {
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
    public constructor(pGpu: TGpuTypes['gpuDevice'], pParameter: MemoryLayoutParameter) {
        super(pGpu);

        this.mAccessMode = pParameter.access;
        this.mLocation = pParameter.location;
        this.mName = pParameter.name;
        this.mVisibility = pParameter.visibility;
        this.mMemoryType = pParameter.memoryType;
    }
}

export interface MemoryLayoutParameter {
    access: AccessMode;
    location: number | null;
    name: string;
    memoryType: MemoryCopyType;
    visibility: ComputeStage;
}