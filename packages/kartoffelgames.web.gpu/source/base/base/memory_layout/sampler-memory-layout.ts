import { SamplerType } from '../../constant/sampler-type.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { TextureSampler } from '../texture/texture-sampler';
import { BaseMemoryLayout, MemoryLayoutParameter } from './base-memory-layout';

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
    public constructor(pGpu: GpuDevice, pParameter: SamplerMemoryLayoutParameter) {
        super(pGpu, pParameter);

        this.mSamplerType = pParameter.samplerType;
    }

    /**
     * Create texture sampler.
     */
    public create(): TextureSampler {
        return new TextureSampler(this.device, this);
    }
}

export interface SamplerMemoryLayoutParameter extends MemoryLayoutParameter {
    samplerType: SamplerType;
}