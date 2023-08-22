import { Exception } from '@kartoffelgames/core.data';
import { BindDataGroup } from '../../../binding/bind-data-group';
import { BaseNativeGenerator } from '../../../generator/base-native-generator';
import { NativeWebGpuObjects, WebGpuGeneratorFactory } from '../web-gpu-generator-factory';
import { GpuBuffer } from '../../../buffer/gpu-buffer';
import { CanvasTexture } from '../../../texture/canvas-texture';
import { FrameBufferTexture } from '../../../texture/frame-buffer-texture';
import { ImageTexture } from '../../../texture/image-texture';
import { TextureSampler } from '../../../texture/texture-sampler';
import { VideoTexture } from '../../../texture/video-texture';

export class WebGpuBindDataGroupGenerator extends BaseNativeGenerator<WebGpuGeneratorFactory, NativeWebGpuObjects, 'bindDataGroup'> {
    /**
     * Generate native gpu bind data group.
     * @param pBaseObject - Base bind data group.
     */
    public override generate(pBaseObject: BindDataGroup): GPUBindGroup {
        const lEntryList: Array<GPUBindGroupEntry> = new Array<GPUBindGroupEntry>();

        for (const lBindname of pBaseObject.layout.bindingNames) {
            const lBindLayout = pBaseObject.layout.getBind(lBindname);
            const lBindData = pBaseObject.getData(lBindname);

            // Set resource to group entry for each 
            const lGroupEntry: GPUBindGroupEntry = { binding: lBindLayout.index, resource: <any>null };

            // Buffer bind.
            if (lBindData instanceof GpuBuffer) {
                lGroupEntry.resource = { buffer: this.factory.generate('buffer', lBindData) };

                lEntryList.push(lGroupEntry);
                continue;
            }

            // External/Video texture bind
            if (lBindData instanceof VideoTexture) {
                lGroupEntry.resource = this.factory.generate('videoTexture', lBindData);

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Sampler bind
            if (lBindData instanceof TextureSampler) {
                lGroupEntry.resource = this.factory.generate('textureSampler', lBindData);
                lEntryList.push(lGroupEntry);
                continue;
            }

            // Frame buffer bind.
            if (lBindData instanceof FrameBufferTexture) {
                lGroupEntry.resource = this.factory.generate('frameBufferTexture', lBindData);

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Image texture bind.
            if (lBindData instanceof ImageTexture) {
                lGroupEntry.resource = this.factory.generate('imageTexture', lBindData);

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Canvas texture bind.
            if (lBindData instanceof CanvasTexture) {
                lGroupEntry.resource = this.factory.generate('canvasTexture', lBindData);

                lEntryList.push(lGroupEntry);
                continue;
            }

            throw new Exception(`Bind type for "${lBindData}" not supported`, this);
        }

        return this.factory.gpu.createBindGroup({
            label: 'Bind-Group',
            layout: this.factory.generate('bindDataGroupLayout', pBaseObject.layout),
            entries: lEntryList
        });
    }

}