import { BaseMemoryLayout } from '../../base-memory-layout.ts';
import { SamplerType } from '../../constant/sampler-type.enum.ts';
import { GpuDevice } from '../../device/gpu-device.ts';

/**
 * Memory layouts for texture samplers.
 */
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
     * 
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice, pType: SamplerType) {
        super(pDevice);

        this.mSamplerType = pType;
    }
}
