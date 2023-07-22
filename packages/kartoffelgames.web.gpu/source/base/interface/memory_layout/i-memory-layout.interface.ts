import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryType } from '../../constant/memory-type.enum';

export interface IMemoryLayout {
    /**
     * Memory access.
     */
    readonly accessMode: AccessMode;

    /**
     * Memory bind type.
     */
    readonly bindType: BindType;

    /**
     * Location of layout.
     * References bind location or attribute location based on layout context.
     */
    readonly location: number | null;

    /**
     * Name of layout used for path tracing.
     */
    readonly name: string;

    /**
     * Memory type.
     */
    readonly memoryType: MemoryType;

    /**
     * Compute state visibility.
     */
    readonly visibility: ComputeStage;
}

export type MemoryLayoutParameter = {
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
};