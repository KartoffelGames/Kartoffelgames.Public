import { SamplerType } from '../../constant/sampler-type.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseMemoryLayout } from '../base-memory-layout';

/**
 * Memory layouts for texture samplers.
 */
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
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        this.mSamplerType = SamplerType.Filter;
    }
}

export enum SamplerMemoryLayoutInvalidationType {
    SamplerType = 'SamplerTypeChange'
}