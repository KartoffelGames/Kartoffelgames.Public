import { Dictionary, Exception } from '@kartoffelgames/core';
import { ShaderLayout } from '../shader/shader-layout';
import { Shader } from '../shader/shader';
import { TextureFormatCapabilities } from '../texture/texture-format-capabilities';
import { GpuCapabilities } from './capabilities/gpu-capabilities';
import { GpuExecution } from '../execution/gpu-execution';

export class GpuDevice {
    private static readonly mAdapters: Dictionary<GPUPowerPreference, GPUAdapter> = new Dictionary<GPUPowerPreference, GPUAdapter>();
    private static readonly mDevices: Dictionary<GPUAdapter, GPUDevice> = new Dictionary<GPUAdapter, GPUDevice>();

    /**
     * Request new gpu device.
     * @param pGenerator - Native object generator.
     */
    public static async request(pPerformance: GPUPowerPreference): Promise<GpuDevice> {
        // Try to load cached adapter. When not cached, request new one.
        const lAdapter: GPUAdapter | null = GpuDevice.mAdapters.get(pPerformance) ?? await window.navigator.gpu.requestAdapter({ powerPreference: pPerformance });
        if (!lAdapter) {
            throw new Exception('Error requesting GPU adapter', GpuDevice);
        }

        GpuDevice.mAdapters.set(pPerformance, lAdapter);

        // Try to load cached device. When not cached, request new one. // TODO: Required features.
        const lDevice: GPUDevice | null = GpuDevice.mDevices.get(lAdapter) ?? await lAdapter.requestDevice();
        if (!lDevice) {
            throw new Exception('Error requesting GPU device', GpuDevice);
        }

        GpuDevice.mDevices.set(lAdapter, lDevice);

        return new GpuDevice(lAdapter, lDevice);
    }

    private readonly mCapabilities: GpuCapabilities;
    private readonly mFormatValidator: TextureFormatCapabilities;
    private mFrameCounter: number;
    private readonly mGpuAdapter: GPUAdapter;
    private readonly mGpuDevice: GPUDevice;
    
    /**
     * Gpu adapter.
     */
    public get adapter(): GPUAdapter {
        return this.mGpuAdapter;
    }

    /**
     * Gpu capabilities.
     */
    public get capabilities(): GpuCapabilities {
        return this.mCapabilities;
    }

    /**
     * Texture format validator.
     */
    public get formatValidator(): TextureFormatCapabilities {
        return this.mFormatValidator;
    }

    /**
     * Get frame count.
     */
    public get frameCount(): number {
        return this.mFrameCounter;
    }

    /**
     * Gpu device.
     */
    public get gpu(): GPUDevice {
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
     * @param pGenerator - Native GPU-Object Generator.
     */
    private constructor(pAdapter: GPUAdapter, pDevice: GPUDevice) {
        this.mGpuAdapter = pAdapter;
        this.mGpuDevice = pDevice;

        // Setup capabilities.
        this.mCapabilities = new GpuCapabilities(pDevice);

        // Set default for frame counter.
        this.mFrameCounter = 0;

        // Init form validator.
        this.mFormatValidator = new TextureFormatCapabilities(this);
    }

    /**
     * Create pass executor.
     */
    public executor(pExecution: ExecutionFunction): GpuExecution {
        return new GpuExecution(this, pExecution);
    }

    /**
     * Create shader.
     * 
     * @param pSource - Shader source as wgsl.
     * @param pLayout - Shader layout.
     */
    public shader(pSource: string, pLayout: ShaderLayout): Shader {
        return new Shader(this, pSource, pLayout);
    }

    /**
     * Start new frame.
     */
    public startNewFrame(): void {
        this.mFrameCounter++;
    }
}