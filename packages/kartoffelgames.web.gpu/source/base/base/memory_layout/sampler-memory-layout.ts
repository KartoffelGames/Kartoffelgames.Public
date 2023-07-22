import { SamplerType } from '../../constant/sampler-type.enum';
import { ISamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../../interface/memory_layout/i-sampler-memory-layout.interface';
import { GpuTypes } from '../gpu/gpu-device';
import { MemoryLayout } from './memory-layout';

export abstract class SamplerMemoryLayout<TGpuTypes extends GpuTypes> extends MemoryLayout<TGpuTypes> implements ISamplerMemoryLayout {
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
    public constructor(pGpu: TGpuTypes['gpuDevice'], pParameter: SamplerMemoryLayoutParameter) {
        super(pGpu, pParameter);

        this.mSamplerType = pParameter.samplerType;
    }

    /**
     * Create texture sampler.
     */
    public create(): TGpuTypes['textureSampler'] {
        return this.createTextureSampler();
    }

    /**
     * Create texture sampler.
     */
    public abstract createTextureSampler(): TGpuTypes['textureSampler'];
}