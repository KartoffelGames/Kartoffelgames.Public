import { Dictionary, Exception } from '@kartoffelgames/core.data';

export class Gpu {
    private static readonly mAdapters: Dictionary<string, GPUAdapter> = new Dictionary<string, GPUAdapter>();
    private static readonly mDevices: Dictionary<GPUAdapter, GPUDevice> = new Dictionary<GPUAdapter, GPUDevice>();

    /**
     * Create GPU device.
     * @param pMode - Prefered device mode.
     */
    public static async create(pMode: GPUPowerPreference): Promise<Gpu> {
        // Try to load cached adapter. When not cached, request new one.
        const lAdapter: GPUAdapter | null = Gpu.mAdapters.get(pMode) ?? await window.navigator.gpu.requestAdapter({ powerPreference: pMode });
        if (lAdapter) {
            Gpu.mAdapters.set(pMode, lAdapter);
        } else {
            throw new Exception('Error requesting GPU adapter', Gpu);
        }

        // Try to load cached device. When not cached, request new one.
        const lDevice: GPUDevice | null = Gpu.mDevices.get(lAdapter) ?? await lAdapter.requestDevice();
        if (lAdapter) {
            Gpu.mDevices.set(lAdapter, lDevice);
        } else {
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
     * Preferred texture format.
     */
    public get preferredFormat(): GPUTextureFormat {
        return window.navigator.gpu.getPreferredCanvasFormat();
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