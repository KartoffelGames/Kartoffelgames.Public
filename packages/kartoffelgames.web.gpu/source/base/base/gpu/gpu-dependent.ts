import { GpuTypes } from './gpu-device';

export class GpuDependent<TGpuTypes extends GpuTypes> {
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