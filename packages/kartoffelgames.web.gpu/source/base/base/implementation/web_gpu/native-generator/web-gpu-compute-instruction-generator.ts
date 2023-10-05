import { InstructionExecuter } from '../../../execution/instruction-executor';
import { NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { BaseNativeInstructionGenerator } from '../../../generator/base-native-instruction-generator';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuComputeInstructionGenerator extends BaseNativeInstructionGenerator<NativeWebGpuMap, 'computeInstruction'>{
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Execute steps in a row.
     * @param pExecutor - Executor context.
     */
    public override execute(pExecutor: InstructionExecuter): void {
        throw new Error('Method not implemented.');
    }

    /**
     * Generate native instruction.
     */
    protected override generate(): null {
        // Literaly nothing to cache or compute.
        return null;
    }
}