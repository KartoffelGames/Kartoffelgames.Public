import { IGpuDependent } from './i-gpu-dependent.interface';

export interface IGpuObject extends IGpuDependent {
    /**
     * Enable or disable auto update.
     */
    autoUpdate: boolean;

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