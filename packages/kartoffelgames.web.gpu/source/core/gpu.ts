import { Exception } from '@kartoffelgames/core.data';

export class Gpu {
    /**
     * Create GPU device.
     * @param pMode - Prefered device mode.
     */
    public static async create(pMode: GPUPowerPreference): Promise<Gpu> {
        const lAdapter: GPUAdapter | null = await window.navigator.gpu.requestAdapter({ powerPreference: pMode });
        if (lAdapter === null) {
            throw new Exception('Error requesting GPU adapter', Gpu);
        }

        const lDevice: GPUDevice | null = await lAdapter.requestDevice();
        if (lDevice === null) {
            throw new Exception('Error requesting GPU device', Gpu);
        }

        return new Gpu(lAdapter, lDevice);
    }

    private readonly mGpuAdapter: GPUAdapter;
    private readonly mGpuDevice: GPUDevice;

    /**
     * GPU adapter.
     */
    public get adapter(): GPUAdapter {
        return this.mGpuAdapter;
    }

    /**
     * GPU device.
     */
    public get device(): GPUDevice {
        return this.mGpuDevice;
    }

    /**
     * Constructor.
     * @param pGpuAdapter - Gpu adapter. 
     * @param pGpuDevice - Gpu device.
     */
    private constructor(pGpuAdapter: GPUAdapter, pGpuDevice: GPUDevice) {
        this.mGpuAdapter = pGpuAdapter;
        this.mGpuDevice = pGpuDevice;
    }
}