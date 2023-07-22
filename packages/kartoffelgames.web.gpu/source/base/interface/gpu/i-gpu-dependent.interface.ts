import { IGpuDevice } from './i-gpu-device.interface';

export interface IGpuDependent {
    /**
     * Gpu Device.
     */
    device: IGpuDevice;
}