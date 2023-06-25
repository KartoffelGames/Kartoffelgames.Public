import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryType } from '../../constant/memory-type.enum';
import { SamplerType } from '../../constant/sampler-type.enum';
import { ISamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../../interface/memory_layout/i-sampler-memory-layout.interface';
import { MemoryLayout } from './memory-layout';

export class SamplerMemoryLayout extends MemoryLayout implements ISamplerMemoryLayout {
    private readonly mSamplerType: SamplerType;

    /**
     * Sampler type.
     */
    public get samplerType(): SamplerType {
        return this.mSamplerType;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: SamplerMemoryLayoutParameter) {
        super(pParameter);

        this.mSamplerType = pParameter.samplerType;
    }
}