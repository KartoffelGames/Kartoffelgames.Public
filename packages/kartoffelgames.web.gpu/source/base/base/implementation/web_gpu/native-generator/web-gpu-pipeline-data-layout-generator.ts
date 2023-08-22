import { Exception } from '@kartoffelgames/core.data';
import { PipelineDataLayout } from '../../../binding/pipeline-data-layout';
import { BaseNativeGenerator } from '../../../generator/base-native-generator';
import { NativeWebGpuObjects, WebGpuGeneratorFactory } from '../web-gpu-generator-factory';

export class WebGpuPipelineDataLayoutGenerator extends BaseNativeGenerator<WebGpuGeneratorFactory, NativeWebGpuObjects, 'pipelineDataLayout'> {
    /**
     * Generate native gpu pipeline data layout.
     * @param pBaseObject - Base pipeline data layout.
     */
    public override generate(pBaseObject: PipelineDataLayout): GPUPipelineLayoutDescriptor {
        const lBindGoupIndices: Array<number> = pBaseObject.groups;

        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const lIndex of lBindGoupIndices) {
            const lBindGroupLayout = pBaseObject.getGroupLayout(lIndex);

            lPipelineLayout.bindGroupLayouts[lIndex] = this.factory.generate('bindDataGroupLayout', lBindGroupLayout);
        }

        // Validate continunity.
        if (lBindGoupIndices.length !== lPipelineLayout.bindGroupLayouts.length) {
            throw new Exception(`Bind group gap detected. Group not set.`, this);
        }

        return lPipelineLayout;
    }
}