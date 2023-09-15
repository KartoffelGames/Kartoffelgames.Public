import { Exception } from '@kartoffelgames/core.data';
import { GpuBuffer } from '../../../buffer/gpu-buffer';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { CanvasTexture } from '../../../texture/canvas-texture';
import { FrameBufferTexture } from '../../../texture/frame-buffer-texture';
import { ImageTexture } from '../../../texture/image-texture';
import { TextureSampler } from '../../../texture/texture-sampler';
import { VideoTexture } from '../../../texture/video-texture';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuBindDataGroupGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'bindDataGroup'> {
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

        for (const lBindname of this.gpuObject.layout.bindingNames) {
            const lBindLayout = this.gpuObject.layout.getBind(lBindname);
            const lBindData = this.gpuObject.getData(lBindname);

            // Set resource to group entry for each 
            const lGroupEntry: GPUBindGroupEntry = { binding: lBindLayout.index, resource: <any>null };

            // Buffer bind.
            if (lBindData instanceof GpuBuffer) {
                lGroupEntry.resource = { buffer: this.factory.request<'gpuBuffer'>(lBindData).create() };

                lEntryList.push(lGroupEntry);
                continue;
            }

            // External/Video texture bind
            if (lBindData instanceof VideoTexture) {
                lGroupEntry.resource = this.factory.request<'videoTexture'>(lBindData).create();

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Sampler bind
            if (lBindData instanceof TextureSampler) {
                lGroupEntry.resource = this.factory.request<'textureSampler'>(lBindData).create();
                lEntryList.push(lGroupEntry);
                continue;
            }

            // Frame buffer bind.
            if (lBindData instanceof FrameBufferTexture) {
                lGroupEntry.resource = this.factory.request<'frameBufferTexture'>(lBindData).create();

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Image texture bind.
            if (lBindData instanceof ImageTexture) {
                lGroupEntry.resource = this.factory.request<'imageTexture'>(lBindData).create();

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Canvas texture bind.
            if (lBindData instanceof CanvasTexture) {
                lGroupEntry.resource = this.factory.request<'canvasTexture'>(lBindData).create();

                lEntryList.push(lGroupEntry);
                continue;
            }

            throw new Exception(`Bind type for "${lBindData}" not supported`, this);
        }

        return this.factory.gpu.createBindGroup({
            label: 'Bind-Group',
            layout: this.factory.request<'bindDataGroupLayout'>(this.gpuObject.layout).create(),
            entries: lEntryList
        });
    }
}