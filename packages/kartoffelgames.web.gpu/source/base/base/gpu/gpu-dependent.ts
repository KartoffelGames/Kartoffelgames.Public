import { IGpuDependent } from '../../interface/gpu/i-gpu-dependent.interface';
import { GpuTypes } from './gpu-device';

export class GpuDependent<TGpuTypes extends GpuTypes> implements IGpuDependent {
    private readonly mDevice: TGpuTypes['gpuDevice'];

    /**
     * Gpu Device.
     */
    public get device(): TGpuTypes['gpuDevice'] {
        return this.mDevice;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu device.
     */
    public constructor(pDevice: TGpuTypes['gpuDevice']) {
        this.mDevice = pDevice;
    }
}