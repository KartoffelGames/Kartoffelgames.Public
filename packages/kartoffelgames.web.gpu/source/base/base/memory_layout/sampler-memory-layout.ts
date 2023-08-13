import { SamplerType } from '../../constant/sampler-type.enum';
import { GpuTypes } from '../gpu/gpu-device';
import { MemoryLayout, MemoryLayoutParameter } from './memory-layout';

export abstract class SamplerMemoryLayout<TGpuTypes extends GpuTypes = GpuTypes> extends MemoryLayout<TGpuTypes> {
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
    protected abstract createTextureSampler(): TGpuTypes['textureSampler'];
}

export interface SamplerMemoryLayoutParameter extends MemoryLayoutParameter {
    samplerType: SamplerType;
}