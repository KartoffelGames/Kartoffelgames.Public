import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuExecution } from '../execution/gpu-execution';
import { RenderTargets } from '../pipeline/target/render-targets';
import { Shader } from '../shader/shader';
import { TextureFormatCapabilities } from '../texture/texture-format-capabilities';
import { GpuCapabilities } from './capabilities/gpu-capabilities';

export class GpuDevice {
    private static readonly mAdapters: Dictionary<GPUPowerPreference, GPUAdapter> = new Dictionary<GPUPowerPreference, GPUAdapter>();
    private static readonly mDevices: Dictionary<GPUAdapter, GPUDevice> = new Dictionary<GPUAdapter, GPUDevice>();

    /**
     * Request new gpu device.
     * @param pGenerator - Native object generator.
     */
    public static async request(pPerformance: GPUPowerPreference): Promise<GpuDevice> {
        // TODO: Required and optional requirements. Load available features and limits from adapter and request in device.

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

        return new GpuDevice(lDevice);
    }

    private readonly mCapabilities: GpuCapabilities;
    private readonly mFormatValidator: TextureFormatCapabilities;
    private mFrameCounter: number;
    private readonly mGpuDevice: GPUDevice;

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
     * Constructor.
     * @param pGenerator - Native GPU-Object Generator.
     */
    private constructor(pDevice: GPUDevice) {
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
    public executor(): GpuExecution {
        return new GpuExecution(this, () => { /* TODO */ });
    }

    /**
     * Create render target object.
     * 
     * @returns render target object. 
     */
    public renderTargets(): RenderTargets {
        return new RenderTargets(this);
    }

    /**
     * Create shader.
     * 
     * @param pSource - Shader source as wgsl.
     */
    public shader(pSource: string): Shader {
        return new Shader(this, pSource);
    }

    /**
     * Start new frame.
     */
    public startNewFrame(): void {
        this.mFrameCounter++;
    }
}