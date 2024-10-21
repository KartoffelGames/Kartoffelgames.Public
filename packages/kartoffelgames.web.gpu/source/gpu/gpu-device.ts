import { Dictionary, Exception, List } from '@kartoffelgames/core';
import { GpuExecution, GpuExecutionFunction } from '../execution/gpu-execution';
import { ComputePass } from '../execution/pass/compute-pass';
import { RenderPass, RenderPassExecutionFunction } from '../execution/pass/render-pass';
import { RenderTargets } from '../pipeline/target/render-targets';
import { Shader } from '../shader/shader';
import { CanvasTexture } from '../texture/canvas-texture';
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
        const lDevice: GPUDevice | null = GpuDevice.mDevices.get(lAdapter) ?? await lAdapter.requestDevice({
            requiredFeatures: ['timestamp-query']
        });
        if (!lDevice) {
            throw new Exception('Error requesting GPU device', GpuDevice);
        }

        GpuDevice.mDevices.set(lAdapter, lDevice);

        return new GpuDevice(lDevice);
    }

    private readonly mCapabilities: GpuCapabilities;
    private readonly mFormatValidator: TextureFormatCapabilities;
    private readonly mFrameChangeListener: List<GpuDeviceFrameChangeListener>;
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

        // Frame change listener.
        this.mFrameChangeListener = new List<GpuDeviceFrameChangeListener>();
    }

    /**
     * Add listener called on frame change.
     * 
     * @param pListener - Listener.
     */
    public addFrameChangeListener(pListener: GpuDeviceFrameChangeListener): void {
        this.mFrameChangeListener.push(pListener);
    }

    /**
     * Create or use a html canvas to create a canvas texture.
     * 
     * @param pCanvas - Created canvas element.
     * 
     * @returns canvas texture. 
     */
    public canvas(pCanvas?: HTMLCanvasElement): CanvasTexture {
        // Create or use canvas.
        const lCanvas: HTMLCanvasElement = pCanvas ?? document.createElement('canvas');

        return new CanvasTexture(this, lCanvas);
    }

    /**
     * Create new compute pass.
     *
     * @returns new compute pass. 
     */
    public computePass(): ComputePass {
        return new ComputePass(this);
    }

    /**
     * Create pass executor.
     * 
     * @param pOnExecute - On executor execute.
     */
    public executor(pOnExecute: GpuExecutionFunction): GpuExecution {
        return new GpuExecution(this, pOnExecute);
    }

    /**
     * Remove listener called on frame change.
     * 
     * @param pListener - Listener.
     */
    public removeFrameChangeListener(pListener: GpuDeviceFrameChangeListener): void {
        this.mFrameChangeListener.remove(pListener);
    }

    /**
     * Create new render pass.
     * 
     * @param pRenderTargets - Render targets of pass.
     * @param pStaticBundle - Bundle is static and does not update very often.
     * 
     * @returns new render pass. 
     */
    public renderPass(pRenderTargets: RenderTargets, pExecution: RenderPassExecutionFunction, pStaticBundle: boolean = true): RenderPass {
        return new RenderPass(this, pRenderTargets, pStaticBundle, pExecution);
    }

    /**
     * Create render target object.
     * 
     * @param pMultisampled - Render targets are multisampled.
     * 
     * @returns render target object. 
     */
    public renderTargets(pMultisampled: boolean = false): RenderTargets {
        return new RenderTargets(this, pMultisampled);
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

        // Call all frame change listener.
        for (const lListener of this.mFrameChangeListener) {
            lListener();
        }
    }
}

export type GpuDeviceFrameChangeListener = () => void;