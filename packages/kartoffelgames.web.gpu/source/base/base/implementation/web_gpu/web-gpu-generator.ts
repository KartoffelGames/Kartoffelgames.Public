import { BaseShaderInterpreter } from '../../shader/interpreter/base-shader-interpreter';
import { BaseGenerator } from '../../generator/base-generator';
import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { WebGpuShaderInformation } from './web-gpu-shader-information';

export class WebGpuGenerator extends BaseGenerator {
    private static readonly mAdapters: Dictionary<GPUPowerPreference, GPUAdapter> = new Dictionary<GPUPowerPreference, GPUAdapter>();
    private static readonly mDevices: Dictionary<GPUAdapter, GPUDevice> = new Dictionary<GPUAdapter, GPUDevice>();

    private mGpuAdapter: GPUAdapter | null;
    private mGpuDevice: GPUDevice | null;
    private readonly mPerformance: GPUPowerPreference;

    /**
     * Constructor.
     */
    public constructor(pMode: GPUPowerPreference) {
        super();

        this.mPerformance = pMode;
        this.mGpuAdapter = null;
        this.mGpuDevice = null;
    }

    /**
     * Init devices.
     */
    public override async init(): Promise<this> {
        // Try to load cached adapter. When not cached, request new one.
        const lAdapter: GPUAdapter | null = WebGpuGenerator.mAdapters.get(this.mPerformance) ?? await window.navigator.gpu.requestAdapter({ powerPreference: this.mPerformance });
        if (!lAdapter) {
            throw new Exception('Error requesting GPU adapter', WebGpuGenerator);
        }

        WebGpuGenerator.mAdapters.set(this.mPerformance, lAdapter);

        // Try to load cached device. When not cached, request new one.
        const lDevice: GPUDevice | null = WebGpuGenerator.mDevices.get(lAdapter) ?? await lAdapter.requestDevice();
        if (!lDevice) {
            throw new Exception('Error requesting GPU device', WebGpuGenerator);
        }

        WebGpuGenerator.mDevices.set(lAdapter, lDevice);

        this.mGpuAdapter = lAdapter;
        this.mGpuDevice = lDevice;

        return this;
    }

    /**
     * Create web gpu "wgsl" shader interpreter.
     */
    protected override createShaderInterpreter(): BaseShaderInterpreter {
        return new WebGpuShaderInformation();
    }
}