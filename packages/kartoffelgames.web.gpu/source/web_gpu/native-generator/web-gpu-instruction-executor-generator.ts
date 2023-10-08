import { Exception } from '@kartoffelgames/core.data';
import { InstructionExecuter } from '../../base/execution/instruction-executor';
import { NativeObjectLifeTime } from '../../base/native_generator/base-native-generator';
import { BaseNativeInstructionExecutorGenerator } from '../../base/native_generator/base-native-instruction-executor-generator';
import { NativeWebGpuMap, WebGpuGeneratorFactory } from '../web-gpu-generator-factory';

export class WebGpuInstructionExecutorGenerator extends BaseNativeInstructionExecutorGenerator<NativeWebGpuMap, 'instructionExecutor'>{
    private mCommandEncoder: GPUCommandEncoder | null;

    /**
     * Get gpu command encoder.
     */
    public get commandEncoder(): GPUCommandEncoder {
        if(!this.mCommandEncoder) {
            throw new Exception('Execution not started.', this);
        }

        return this.mCommandEncoder;
    }

    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Constructor.
     * @param pFactory - Generator factory.
     * @param pBaseObject - Base object of generator.
     */
    public constructor(pFactory: WebGpuGeneratorFactory, pBaseObject: InstructionExecuter) {
        super(pFactory, pBaseObject);

        this.mCommandEncoder = null;
    }

    /**
     * End execution.
     */
    public override endExecution(): void {
        //Checks for null.
        if(!this.mCommandEncoder) {
            throw new Exception('Execution not started.', this);
        }

        // Finish and delete command encoder.
        this.factory.gpu.queue.submit([this.mCommandEncoder.finish()]);
        this.mCommandEncoder = null;
    }

    /**
     * Start/Init execution.
     */
    public override startExecution(): void {
        // Create internal command encoder.
        this.mCommandEncoder = this.factory.gpu.createCommandEncoder();
    }

    /**
     * Generate native instruction.
     */
    protected override generate(): null {
        // Literaly nothing to cache or compute.
        return null;
    }
}