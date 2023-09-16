import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuRenderShaderGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'renderShader'> {
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generate(): GPUShaderModule {
        return this.factory.gpu.createShaderModule({ code: this.gpuObject.information.source });
    }
}