import { Exception } from '@kartoffelgames/core.data';
import { PipelineLayout } from '../../../base/binding/pipeline-layout';
import { WebGpuTypes } from '../web-gpu-device';

export class WebGpuPipelineLayout extends PipelineLayout<WebGpuTypes, GPUPipelineLayoutDescriptor>{
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
            const lBindGroupLayout = this.getGroup(lIndex);

            lPipelineLayout.bindGroupLayouts[lIndex] = lBindGroupLayout.native;
        }

        // Validate continunity.
        if (lBindGoupIndices.length !== lPipelineLayout.bindGroupLayouts.length) {
            throw new Exception(`Bind group gap detected. Group not set.`, this);
        }

        return lPipelineLayout;
    }
}