import { BaseNativeGenerator, NativeObjectLifeTime } from '../../base/native_generator/base-native-generator';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuComputePipelineGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'computePipeline'> {
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generate(): GPUComputePipeline {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout: GPUPipelineLayout = this.factory.request<'pipelineDataLayout'>(this.gpuObject.shader.pipelineLayout).create();

        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPUComputePipelineDescriptor = {
            layout: lPipelineLayout,
            compute: {
                module: this.factory.request<'computeShader'>(this.gpuObject.shader).create(),
                entryPoint: this.gpuObject.shader.computeEntry,
                // No constants. Yes.
            }
        };

        // Async is none GPU stalling.
        return this.factory.gpu.createComputePipeline(lPipelineDescriptor); // TODO: Async create compute pipeline somehow.
    }
}