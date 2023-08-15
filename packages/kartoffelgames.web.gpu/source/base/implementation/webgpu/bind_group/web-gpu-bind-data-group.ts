import { Exception } from '@kartoffelgames/core.data';
import { BindDataGroup } from '../../../base/binding/bind-data-group';
import { WebGpuBuffer } from '../buffer/web-gpu-buffer';
import { WebGpuCanvasTexture } from '../texture/texture/web-gpu-canvas-texture';
import { WebGpuFrameBufferTexture } from '../texture/texture/web-gpu-frame-buffer-texture';
import { WebGpuImageTexture } from '../texture/texture/web-gpu-image-texture';
import { WebGpuVideoTexture } from '../texture/texture/web-gpu-video-texture';
import { WebGpuTextureSampler } from '../texture/web-gpu-texture-sampler';
import { WebGpuTypes } from '../web-gpu-device';

export class WebGpuBindDataGroup extends BindDataGroup<WebGpuTypes, GPUBindGroup>{
    /**
     * Destroy native bind group object.
     * @param _pNativeObject - Native bind group object.
     */
    protected override destroyNative(_pNativeObject: GPUBindGroup): void {
        // Nothing to dstroy. Your princess in in another cachele.
    }

    /**
     * Generate native bind group.
     */
    protected override generate(): GPUBindGroup {
        const lEntryList: Array<GPUBindGroupEntry> = new Array<GPUBindGroupEntry>();

        for (const lBindname of this.layout.bindingNames) {
            const lBindLayout = this.layout.getBind(lBindname);
            const lBindData = this.getData(lBindname);

            // Set resource to group entry for each 
            const lGroupEntry: GPUBindGroupEntry = { binding: lBindLayout.index, resource: <any>null };

            // Buffer bind.
            if (lBindData instanceof WebGpuBuffer) {
                lGroupEntry.resource = { buffer: lBindData.native };

                lEntryList.push(lGroupEntry);
                continue;
            }

            // External/Video texture bind
            if (lBindData instanceof WebGpuVideoTexture) {
                lGroupEntry.resource = lBindData.native;

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Sampler bind
            if (lBindData instanceof WebGpuTextureSampler) {
                lGroupEntry.resource = lBindData.native;
                lEntryList.push(lGroupEntry);
                continue;
            }

            // Frame buffer bind.
            if (lBindData instanceof WebGpuFrameBufferTexture) {
                lGroupEntry.resource = lBindData.native;

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Image texture bind.
            if (lBindData instanceof WebGpuImageTexture) {
                lGroupEntry.resource = lBindData.native;

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Canvas texture bind.
            if (lBindData instanceof WebGpuCanvasTexture) {
                lGroupEntry.resource = lBindData.native;

                lEntryList.push(lGroupEntry);
                continue;
            }

            throw new Exception(`Bind type for "${lBindData}" not supported`, this);
        }

        return this.device.reference.createBindGroup({
            label: 'Bind-Group',
            layout: this.layout.native,
            entries: lEntryList
        });
    }
}