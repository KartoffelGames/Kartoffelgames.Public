import { NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { BaseNativeInstructionGenerator } from '../../../generator/base-native-instruction-generator';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuVertexFragmentInstructionGenerator extends BaseNativeInstructionGenerator<NativeWebGpuMap, 'vertexFragmentInstruction'>{
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Generate native instruction.
     */
    protected override generate(): null {
        return null;
    }
}