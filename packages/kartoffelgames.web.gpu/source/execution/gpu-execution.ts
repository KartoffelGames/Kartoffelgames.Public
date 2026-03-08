import type { GpuDevice } from '../device/gpu-device.ts';
import { GpuObject } from '../gpu_object/gpu-object.ts';
import { GpuExecutionContext } from './gpu-execution-context.ts';

/**
 * Bundles execute calls to execute them bunched.
 */
export class GpuExecution extends GpuObject {
    /**
     * Constructor.
     * 
     * @param pDevice - Device reference. 
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);
    }

    /**
     * Execute with context.
     * 
     * @param pExecution - Main execution function.
     */
    public execute(pExecution: GpuExecutionFunction): void {
        // Create command encoder.
        const lCommandEncoder: GPUCommandEncoder = this.device.gpu.createCommandEncoder({
            label: 'Execution'
        });

        // Call execution with encoder context.
        pExecution(new GpuExecutionContext(this.device, lCommandEncoder));

        // Submit commands to queue and clear command encoder.
        this.device.gpu.queue.submit([lCommandEncoder.finish()]);
    }
}

export type GpuExecutionFunction = (pContext: GpuExecutionContext) => void;