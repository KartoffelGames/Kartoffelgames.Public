import { Exception } from '@kartoffelgames/core';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../base/native_generator/base-native-generator';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuPipelineDataLayoutGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'pipelineDataLayout'> {
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generate(): GPUPipelineLayout  {
        const lBindGoupIndices: Array<number> = this.gpuObject.groups;

        // Generate pipeline layout from bind group layouts.
        const lPipelineLayoutDescriptor = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const lIndex of lBindGoupIndices) {
            const lBindGroupLayout = this.gpuObject.getGroupLayout(lIndex);

            lPipelineLayoutDescriptor.bindGroupLayouts[lIndex] = this.factory.request<'bindDataGroupLayout'>(lBindGroupLayout).create();
        }

        // Validate continunity.
        if (lBindGoupIndices.length !== lPipelineLayoutDescriptor.bindGroupLayouts.length) {
            throw new Exception(`Bind group gap detected. Group not set.`, this);
        }

        // Generate pipeline layout from descriptor.
        return this.factory.gpu.createPipelineLayout(lPipelineLayoutDescriptor) ;
    }
}