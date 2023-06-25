import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryType } from '../../constant/memory-type.enum';
import { SamplerType } from '../../constant/sampler-type.enum';
import { IMemoryLayout } from './i-memory-layout.interface';

export interface ISamplerMemoryLayout extends IMemoryLayout {
    /**
     * Sampler type.
     */
    readonly samplerType: SamplerType;
}

export type SamplerMemoryLayoutParameter = {
    type: 'Sampler';

    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;

    // New 
    samplerType: SamplerType;
};