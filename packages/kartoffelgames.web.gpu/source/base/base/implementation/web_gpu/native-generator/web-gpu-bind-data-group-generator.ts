import { Exception } from '@kartoffelgames/core.data';
import { GpuBuffer } from '../../../buffer/gpu-buffer';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { CanvasTexture } from '../../../texture/canvas-texture';
import { FrameBufferTexture } from '../../../texture/frame-buffer-texture';
import { ImageTexture } from '../../../texture/image-texture';
import { TextureSampler } from '../../../texture/texture-sampler';
import { VideoTexture } from '../../../texture/video-texture';
import { NativeWebGpuObjects, WebGpuGeneratorFactory } from '../web-gpu-generator-factory';

export class WebGpuBindDataGroupGenerator extends BaseNativeGenerator<WebGpuGeneratorFactory, NativeWebGpuObjects, 'bindDataGroup'> {
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Generate native gpu bind data group.
     */
    protected override generate(): GPUBindGroup {
        const lEntryList: Array<GPUBindGroupEntry> = new Array<GPUBindGroupEntry>();

        for (const lBindname of this.baseObject.layout.bindingNames) {
            const lBindLayout = this.baseObject.layout.getBind(lBindname);
            const lBindData = this.baseObject.getData(lBindname);

            // Set resource to group entry for each 
            const lGroupEntry: GPUBindGroupEntry = { binding: lBindLayout.index, resource: <any>null };

            // Buffer bind.
            if (lBindData instanceof GpuBuffer) {
                lGroupEntry.resource = { buffer: this.factory.create('buffer', lBindData) };

                lEntryList.push(lGroupEntry);
                continue;
            }

            // External/Video texture bind
            if (lBindData instanceof VideoTexture) {
                lGroupEntry.resource = this.factory.create('videoTexture', lBindData);

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Sampler bind
            if (lBindData instanceof TextureSampler) {
                lGroupEntry.resource = this.factory.create('textureSampler', lBindData);
                lEntryList.push(lGroupEntry);
                continue;
            }

            // Frame buffer bind.
            if (lBindData instanceof FrameBufferTexture) {
                lGroupEntry.resource = this.factory.create('frameBufferTexture', lBindData);

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Image texture bind.
            if (lBindData instanceof ImageTexture) {
                lGroupEntry.resource = this.factory.create('imageTexture', lBindData);

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Canvas texture bind.
            if (lBindData instanceof CanvasTexture) {
                lGroupEntry.resource = this.factory.create('canvasTexture', lBindData);

                lEntryList.push(lGroupEntry);
                continue;
            }

            throw new Exception(`Bind type for "${lBindData}" not supported`, this);
        }

        return this.factory.gpu.createBindGroup({
            label: 'Bind-Group',
            layout: this.factory.create('bindDataGroupLayout', this.baseObject.layout),
            entries: lEntryList
        });
    }
}