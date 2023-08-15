import { Exception } from '@kartoffelgames/core.data';
import { PipelineDataLayout } from '../../../base/binding/pipeline-data-layout';
import { WebGpuTypes } from '../web-gpu-device';

export class WebGpuPipelineDataLayout extends PipelineDataLayout<WebGpuTypes, GPUPipelineLayoutDescriptor>{
    /**
     * Destroy native pipeline layout object.
     * @param _pNativeObject - Native bind group object.
     */
    protected override destroyNative(_pNativeObject: GPUPipelineLayoutDescriptor): void {
        // Nothing to destroy. No cap fr fr.
    }

    /**
     * Generate native object.
     */
    protected override generate(): GPUPipelineLayoutDescriptor {
        const lBindGoupIndices: Array<number> = this.groups;

        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const lIndex of lBindGoupIndices) {
            const lBindGroupLayout = this.getGroupLayout(lIndex);

            lPipelineLayout.bindGroupLayouts[lIndex] = lBindGroupLayout.native;
        }

        // Validate continunity.
        if (lBindGoupIndices.length !== lPipelineLayout.bindGroupLayouts.length) {
            throw new Exception(`Bind group gap detected. Group not set.`, this);
        }

        return lPipelineLayout;
    }
}