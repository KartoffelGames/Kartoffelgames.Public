import type { GpuDevice } from '../device/gpu-device.ts';
import { GpuObject } from '../gpu_object/gpu-object.ts';
import type { RenderTargets } from '../pipeline/render_targets/render-targets.ts';
import { ComputePass, type ComputePassExecutionFunction } from './pass/compute-pass.ts';
import { RenderPass, type RenderPassExecutionFunction } from './pass/render-pass.ts';

/**
 * Context for gpu execution. Used to execute render and compute passes.
 */
export class GpuExecutionContext extends GpuObject {
    private readonly mCommandEncoder: GPUCommandEncoder;

    /**
     * Command encoder to execute commands on.
     */
    public get commandEncoder(): GPUCommandEncoder {
        return this.mCommandEncoder;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pCommandEncoder - Command encoder to execute commands on.
     */
    constructor(pDevice: GpuDevice, pCommandEncoder: GPUCommandEncoder) {
        super(pDevice);
        this.mCommandEncoder = pCommandEncoder;
    }

    /**
     * Execute a new compute pass.
     */
    public computePass(pExecution: ComputePassExecutionFunction): void {
        new ComputePass(this.device, this).execute(pExecution);
    }

    /**
     * Execute a new render pass.
     * 
     * @param pRenderTargets - Render targets of pass.
     * @param pExecution - Execution function for the render pass.
     */
    public renderPass(pRenderTargets: RenderTargets, pExecution: RenderPassExecutionFunction): void {
        new RenderPass(this.device, pRenderTargets, this).execute(pExecution);
    }
}