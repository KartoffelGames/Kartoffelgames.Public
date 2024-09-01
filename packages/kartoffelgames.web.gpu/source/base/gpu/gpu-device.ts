import { Dictionary, Exception } from '@kartoffelgames/core';
import { InstructionExecuter } from '../execution/instruction-executor';
import { TextureGroup } from '../pipeline/target/texture-group';
import { VertexFragmentShader } from '../shader/vertex-fragment-shader';

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

        // Try to load cached device. When not cached, request new one.
        const lDevice: GPUDevice | null = GpuDevice.mDevices.get(lAdapter) ?? await lAdapter.requestDevice();
        if (!lDevice) {
            throw new Exception('Error requesting GPU device', GpuDevice);
        }

        GpuDevice.mDevices.set(lAdapter, lDevice);

        return new GpuDevice(lAdapter, lDevice);
    }

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
    private constructor(pAdapter: GPUAdapter, pDevice: GPUDevice) {
        this.mGpuAdapter = pAdapter;
        this.mGpuDevice = pDevice;

        this.mFrameCounter = 0;
    }

    /**
     * Create instruction executor.
     */
    public instructionExecutor(): InstructionExecuter {
        return new InstructionExecuter(this);
    }

    /**
     * Create shader.
     * @param pSource - Shader source.
     * @param pVertexEntry - Vertex entry name.
     * @param pFragmentEntry - Optional fragment entry.
     */
    public renderShader(pSource: string, pVertexEntry: string, pFragmentEntry?: string): VertexFragmentShader {
        return new VertexFragmentShader(this, pSource, pVertexEntry, pFragmentEntry);
    }

    /**
     * Start new frame.
     */
    public startNewFrame(): void {
        this.mFrameCounter++;
    }

    /**
     * Create texture group that shares the same dimensions.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pMultisampleLevel - Multisample level of textures.
     */
    public textureGroup(pWidth: number, pHeight: number, pMultisampleLevel: number = 1): TextureGroup {
        return new TextureGroup(this, pWidth, pHeight, pMultisampleLevel);
    }
}