import { SamplerType } from '../../../constant/sampler-type.enum';
import { BaseMemoryLayout, MemoryLayoutParameter } from '../base-memory-layout';

export class SamplerMemoryLayout extends BaseMemoryLayout {
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

export interface SamplerMemoryLayoutParameter extends MemoryLayoutParameter {
    samplerType: SamplerType;
}