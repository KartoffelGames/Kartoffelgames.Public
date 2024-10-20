import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';

export class GpuExecution extends GpuObject {
    private readonly mExecutionFunction: GpuExecutionFunction;

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference. 
     * @param pExecution - Main execution function.
     */
    public constructor(pDevice: GpuDevice, pExecution: GpuExecutionFunction) {
        super(pDevice);

        this.mExecutionFunction = pExecution;
    }

    /**
     * Execute with context.
     */
    public execute(): void {
        // Create command encoder.
        const lCommandEncoder: GPUCommandEncoder = this.device.gpu.createCommandEncoder({
            label: 'Execution'
        });

        // Call execution with encoder context.
        this.mExecutionFunction({
            commandEncoder: lCommandEncoder
        });

        // Submit commands to queue and clear command encoder.
        this.device.gpu.queue.submit([lCommandEncoder.finish()]);
    }
}

export type GpuExecutionFunction = (pExecutor: GpuExecutionContext) => void;

export type GpuExecutionContext = {
    commandEncoder: GPUCommandEncoder;
};