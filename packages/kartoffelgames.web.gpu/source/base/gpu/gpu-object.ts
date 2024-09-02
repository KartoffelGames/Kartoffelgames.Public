import { GpuDevice } from './gpu-device';
import { InvalidationObject } from './invalidation-object';

export abstract class GpuObject extends InvalidationObject {
    private readonly mDevice: GpuDevice;

    /**
     * Gpu Device.
     */
    protected get device(): GpuDevice {
        return this.mDevice;
    }


    /**
     * Constructor.
     * @param pDevice - Gpu device.
     */
    public constructor(pDevice: GpuDevice) {
        super();

        // Save static settings.
        this.mDevice = pDevice;
    }
}