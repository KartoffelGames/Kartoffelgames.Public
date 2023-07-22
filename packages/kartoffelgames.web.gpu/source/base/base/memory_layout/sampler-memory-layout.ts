import { SamplerType } from '../../constant/sampler-type.enum';
import { ISamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../../interface/memory_layout/i-sampler-memory-layout.interface';
import { ITextureSampler } from '../../interface/texture/i-texture-sampler.interface';
import { GpuDevice } from '../gpu/gpu-device';
import { MemoryLayout } from './memory-layout';

export abstract class SamplerMemoryLayout<TGpu extends GpuDevice> extends MemoryLayout<TGpu> implements ISamplerMemoryLayout{
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
    public constructor(pGpu: TGpu, pParameter: SamplerMemoryLayoutParameter) {
        super(pGpu, pParameter);

        this.mSamplerType = pParameter.samplerType;
    }

    /**
     * Create texture sampler.
     */
    public create(): ITextureSampler {
        return this.createTextureSampler();
    }

    /**
     * Create texture sampler.
     */
    public abstract createTextureSampler(): ITextureSampler;
}