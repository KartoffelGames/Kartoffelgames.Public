import { IGpuDependent } from '../../interface/gpu/i-gpu-dependent.interface';
import { GpuDevice } from './gpu-device';

export class GpuDependent<TGpu extends GpuDevice> implements IGpuDependent {
    private readonly mDevice: TGpu;

    /**
     * Gpu Device.
     */
    public get device(): TGpu {
        return this.mDevice;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu device.
     */
    public constructor(pDevice: TGpu) {
        this.mDevice = pDevice;
    }
}