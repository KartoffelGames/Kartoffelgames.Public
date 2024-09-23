import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, NativeObjectLifeTime } from '../gpu/object/gpu-object';

export class GpuExecution extends GpuObject {
    private mEncoder: GPUCommandEncoder | null;
    private readonly mExecutionFunction: ExecutionFunction;
    
    /**
     * GPU command encoder.
     */
    public get encoder(): GPUCommandEncoder {
        if (!this.mEncoder) {
            throw new Exception('Execution is not started', this);
        }

        return this.mEncoder;
    }

    public constructor(pDevice: GpuDevice, pExecution: ExecutionFunction) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        this.mExecutionFunction = pExecution;
        this.mEncoder = null;
    }

    public execute(): void {
        this.mEncoder = this.device.gpu.createCommandEncoder({
            label: 'Execution'
        });

        this.mExecutionFunction(this);

        // TODO: Execution is async.
        // Submit commands to queue and clear command encoder.
        this.device.gpu.queue.submit([this.mEncoder.finish()]);
        this.mEncoder = null;
    }
}

type ExecutionFunction = (pExecutor: GpuExecution) => void;