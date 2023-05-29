import { IGpuDevice } from './i-gpu-device.interface';

export interface IGpuObject {
    /**
     * Enable or disable auto update.
     */
    autoUpdate: boolean;

    /**
     * Gpu Device.
     */
    device: IGpuDevice;

    /**
     * Add update listener.
     * @param pListener - Listener.
     */
    addUpdateListener(pListener: GpuObjectUpdateListener): void;

    /**
     * Destroy object.
     */
    destroy(): void;

    /**
     * Add update listener.
     * @param pListener - Listener.
     */
    removeUpdateListener(pListener: GpuObjectUpdateListener): void;

    /**
     * Update gpu object.
     */
    update(): void;
}

export type GpuObjectUpdateListener = () => void;