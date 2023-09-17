import { AccessMode } from '../../constant/access-mode.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryCopyType } from '../../constant/memory-copy-type.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';

export abstract class BaseMemoryLayout extends GpuObject {
    private readonly mAccessMode: AccessMode;
    private readonly mBindingIndex: number | null;
    private readonly mLocationIndex: number | null;
    private mMemoryType: MemoryCopyType;
    private readonly mName: string;
    private readonly mVisibility: ComputeStage;

    /**
     * Buffer type access mode.
     */
    public get accessMode(): AccessMode {
        return this.mAccessMode;
    }

    /**
     * Get binding index.
     */
    public get bindingIndex(): number | null {
        return this.mBindingIndex;
    }

    /**
     * Get parameter index.
     */
    public get locationIndex(): number | null {
        return this.mLocationIndex;
    }

    /**
     * Memory type.
     */
    public get memoryType(): MemoryCopyType {
        return this.mMemoryType;
    } set memoryType(pValue: MemoryCopyType) {
        this.mMemoryType = pValue;

        // Request update.
        this.triggerAutoUpdate(UpdateReason.Setting);
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
    public constructor(pGpu: GpuDevice, pParameter: MemoryLayoutParameter) {
        super(pGpu);

        this.mAccessMode = pParameter.access;
        this.mName = pParameter.name;
        this.mVisibility = pParameter.visibility;
        this.mMemoryType = MemoryCopyType.None;

        // Set optional memory indices.
        this.mBindingIndex = pParameter.memoryIndex?.binding ?? null;
        this.mLocationIndex = pParameter.memoryIndex?.location ?? null;
    }
}

export interface MemoryLayoutParameter {
    access: AccessMode;
    memoryIndex: null | {
        binding: number | null;
        location: number | null;
    };
    name: string;
    visibility: ComputeStage;
}