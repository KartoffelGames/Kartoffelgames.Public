import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core';
import { GpuBuffer } from '../buffer/gpu-buffer';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, NativeObjectLifeTime } from '../gpu/object/gpu-object';
import { UpdateReason } from '../gpu/object/gpu-object-update-reason';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';
import { BindGroupLayout } from './bind-group-layout';

export class BindDataGroup extends GpuObject<GPUBindGroup> {
    private readonly mBindData: Dictionary<string, BindData>;
    private readonly mLayout: BindGroupLayout;

    /**
     * Layout of bind group.
     */
    public get layout(): BindGroupLayout {
        return this.mLayout;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: GpuDevice, pBindGroupLayout: BindGroupLayout) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        this.mLayout = pBindGroupLayout;
        this.mBindData = new Dictionary<string, BindData>();

        // Register change listener for layout changes.
        pBindGroupLayout.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }

    /**
     * Get data of layout binding.
     * @param pBindName - Bind layout entry name.
     */
    public getData(pBindName: string): BindData {
        const lData = this.mBindData.get(pBindName);
        if (!lData) {
            throw new Exception(`Cant get bind data "${pBindName}". No data set.`, this);
        }

        return lData;
    }

    /**
     * Set data to layout binding.
     * @param pBindName - Bind layout entry name.
     * @param pData - Bind data.
     */
    public setData(pBindName: string, pData: BindData): void {
        // TODO: Validate data type with value type.

        // Set bind type to Teture for TS type check shutup.
        this.mBindData.set(pBindName, pData);
    }

    /**
     * Generate native gpu bind data group.
     */
    protected override generate(): GPUBindGroup {
        const lEntryList: Array<GPUBindGroupEntry> = new Array<GPUBindGroupEntry>();

        for (const lBindname of this.layout.bindingNames) {
            const lBindLayout = this.layout.getBind(lBindname);
            const lBindData = this.getData(lBindname);

            // Set resource to group entry for each 
            const lGroupEntry: GPUBindGroupEntry = { binding: lBindLayout.index, resource: <any>null };

            // Buffer bind.
            if (lBindData instanceof GpuBuffer) {
                lGroupEntry.resource = { buffer: lBindData.native };

                lEntryList.push(lGroupEntry);
                continue;
            }

            // External/Video texture bind
            if (lBindData instanceof VideoTexture) {
                lGroupEntry.resource = lBindData.native;

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Sampler bind
            if (lBindData instanceof TextureSampler) {
                lGroupEntry.resource = lBindData.native;
                lEntryList.push(lGroupEntry);
                continue;
            }

            // Frame buffer bind.
            if (lBindData instanceof FrameBufferTexture) {
                lGroupEntry.resource = lBindData.native;

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Image texture bind.
            if (lBindData instanceof ImageTexture) {
                lGroupEntry.resource = lBindData.native;

                lEntryList.push(lGroupEntry);
                continue;
            }

            // Canvas texture bind.
            if (lBindData instanceof CanvasTexture) {
                lGroupEntry.resource = lBindData.native;

                lEntryList.push(lGroupEntry);
                continue;
            }

            throw new Exception(`Bind type for "${lBindData}" not supported`, this);
        }

        return this.device.gpu.createBindGroup({
            label: 'Bind-Group',
            layout: this.layout.native,
            entries: lEntryList
        });
    }
}

type BindData = GpuBuffer<TypedArray> | TextureSampler | ImageTexture | FrameBufferTexture | VideoTexture | CanvasTexture;