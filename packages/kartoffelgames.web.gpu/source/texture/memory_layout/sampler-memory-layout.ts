import { BaseMemoryLayout } from '../../base-memory-layout.ts';
import type { SamplerType } from '../../constant/sampler-type.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';

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
