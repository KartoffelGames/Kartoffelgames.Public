import { SamplerType } from '../../constant/sampler-type.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseMemoryLayout } from '../base-memory-layout';

export class SamplerMemoryLayout extends BaseMemoryLayout<SamplerMemoryLayoutInvalidationType> {
    private mSamplerType: SamplerType;

    /**
     * Sampler type.
     */
    public get samplerType(): SamplerType {
        return this.mSamplerType;
    } set samplerType(pType: SamplerType) {
        this.mSamplerType = pType;

        this.invalidate(SamplerMemoryLayoutInvalidationType.SamplerType);
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pParameter: SamplerMemoryLayoutParameter) {
        super(pDevice);

        this.mSamplerType = pParameter.samplerType;
    }
}

export interface SamplerMemoryLayoutParameter {
    samplerType: SamplerType;
}

export enum SamplerMemoryLayoutInvalidationType {
    SamplerType = 'SamplerTypeChange'
}