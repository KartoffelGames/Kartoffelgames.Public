import { Exception } from '@kartoffelgames/core.data';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
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
    protected override generate(): GPUPipelineLayoutDescriptor {
        const lBindGoupIndices: Array<number> = this.gpuObject.groups;

        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const lIndex of lBindGoupIndices) {
            const lBindGroupLayout = this.gpuObject.getGroupLayout(lIndex);

            lPipelineLayout.bindGroupLayouts[lIndex] = this.factory.request<'bindDataGroupLayout'>(lBindGroupLayout).create();
        }

        // Validate continunity.
        if (lBindGoupIndices.length !== lPipelineLayout.bindGroupLayouts.length) {
            throw new Exception(`Bind group gap detected. Group not set.`, this);
        }

        return lPipelineLayout;
    }
}