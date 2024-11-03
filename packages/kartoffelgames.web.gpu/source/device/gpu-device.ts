import { Exception, List } from '@kartoffelgames/core';
import { GpuFeature } from '../constant/gpu-feature.enum';
import { GpuLimit } from '../constant/gpu-limit.enum';
import { GpuExecution, GpuExecutionFunction } from '../execution/gpu-execution';
import { ComputePass, ComputePassExecutionFunction } from '../execution/pass/compute-pass';
import { RenderPass, RenderPassExecutionFunction } from '../execution/pass/render-pass';
import { RenderTargets } from '../pipeline/render_targets/render-targets';
import { Shader } from '../shader/shader';
import { CanvasTexture } from '../texture/canvas-texture';
import { GpuDeviceCapabilities } from './capabilities/gpu-device-capabilities';
import { GpuTextureFormatCapabilities } from './capabilities/gpu-texture-format-capabilities';

export class GpuDevice {
    /**
     * Request new gpu device.
     * 
     * @param pGenerator - Native object generator.
     */
    public static async request(pPerformance: GPUPowerPreference, pOptions?: GpuDeviceLimitConfiguration): Promise<GpuDevice> {
        // Try to load cached adapter. When not cached, request new one.
        const lAdapter: GPUAdapter | null = await window.navigator.gpu.requestAdapter({ powerPreference: pPerformance });
        if (!lAdapter) {
            throw new Exception('Error requesting GPU adapter', GpuDevice);
        }

        // Fill in required features and limits.
        const lFeatures: Array<GpuFeature> = new Array<GpuFeature>();
        const lLimits: Record<string, number> = {};
        if (pOptions) {
            // Setup gpu features.
            if (pOptions.features) {
                // Fill in required features.
                for (const lFeature of pOptions.features) {
                    // Exit when required feature is not available.
                    if (!lAdapter.features.has(lFeature.name)) {
                        // Exit when feature was not optional.
                        if (lFeature.required) {
                            throw new Exception(`No Gpu found with the required feature "${lFeature.name}"`, this);
                        }

                        // Skip optional features.
                        continue;
                    }

                    lFeatures.push(lFeature.name);
                }
            }

            // Setup gpu limits.
            if (pOptions.limits) {
                // Fill in required features.
                for (const lLimit of pOptions.limits) {
                    // Read available limit.
                    const lAdapterLimit: number | undefined = lAdapter.limits[lLimit.name];
                    if (typeof lAdapterLimit === 'undefined') {
                        throw new Exception(`Gpu does not support any "${lLimit.name}" limit.`, this);
                    }

                    // Check for adapter available limit.
                    let lAvailableLimit: number = lLimit.value;
                    if (lAdapterLimit < lLimit.value) {
                        // Exit when required limit is not available.
                        if (lLimit.required) {
                            throw new Exception(`No Gpu found with the required limit "${lLimit.name}" (has: ${lAdapterLimit}, required: ${lLimit.value})`, this);
                        }

                        // When not required, use the highest available limit.
                        lAvailableLimit = lAdapterLimit;
                    }

                    lLimits[lLimit.name] = lAvailableLimit;
                }
            }
        }

        // Try to load cached device. When not cached, request new one.
        const lDevice: GPUDevice | null = await lAdapter.requestDevice({
            requiredFeatures: lFeatures as Array<GPUFeatureName>,
            requiredLimits: lLimits
        });
        if (!lDevice) {
            throw new Exception('Error requesting GPU device', GpuDevice);
        }

        return new GpuDevice(lDevice);
    }

    private readonly mCapabilities: GpuDeviceCapabilities;
    private readonly mFormatValidator: GpuTextureFormatCapabilities;
    private readonly mFrameChangeListener: List<GpuDeviceFrameChangeListener>;
    private mFrameCounter: number;
    private readonly mGpuDevice: GPUDevice;


    /**
     * Gpu capabilities.
     */
    public get capabilities(): GpuDeviceCapabilities {
        return this.mCapabilities;
    }

    /**
     * Texture format validator.
     */
    public get formatValidator(): GpuTextureFormatCapabilities {
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
     * 
     * @param pGenerator - Native GPU-Object Generator.
     */
    private constructor(pDevice: GPUDevice) {
        this.mGpuDevice = pDevice;

        // Setup capabilities.
        this.mCapabilities = new GpuDeviceCapabilities(pDevice);

        // Set default for frame counter.
        this.mFrameCounter = 0;

        // Init form validator.
        this.mFormatValidator = new GpuTextureFormatCapabilities(this);

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
    public computePass(pExecution: ComputePassExecutionFunction): ComputePass {
        return new ComputePass(this, pExecution);
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

type GpuDeviceLimitConfiguration = {
    features?: Array<{
        name: GpuFeature,
        required?: boolean;
    }>;
    limits?: Array<{
        name: GpuLimit,
        value: number,
        required?: boolean;
    }>;
};