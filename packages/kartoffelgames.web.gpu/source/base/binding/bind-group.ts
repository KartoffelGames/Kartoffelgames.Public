import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core';
import { GpuBuffer } from '../buffer/gpu-buffer';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences, NativeObjectLifeTime } from '../gpu/object/gpu-object';
import { UpdateReason } from '../gpu/object/gpu-object-update-reason';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { SamplerMemoryLayout } from '../memory_layout/texture/sampler-memory-layout';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { ImageTexture } from '../texture/image-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { VideoTexture } from '../texture/video-texture';
import { BindGroupDataSetup } from './bind-group-data-setup';
import { BindGroupLayout, BindLayout } from './bind-group-layout';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';

export class BindGroup extends GpuObject<GPUBindGroup> implements IGpuObjectNative<GPUBindGroup> {
    private readonly mBindData: Dictionary<string, BindData>;
    private readonly mLayout: BindGroupLayout;

    /**
     * Layout of bind group.
     */
    public get layout(): BindGroupLayout {
        return this.mLayout;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUBindGroup {
        return super.native;
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
     * Read binding data references.
     * 
     * @param pBindName - Binding name.
     * 
     * @returns Data setup object. 
     */
    public data(pBindName: string): BindGroupDataSetup {
        const lDataLayout: Readonly<BindLayout> = this.mLayout.getBind(pBindName);
        const lData: BindData | null = this.mBindData.get(pBindName) ?? null;

        // Construct setup data to data.
        const lDataSetupReferences: GpuObjectSetupReferences<null> = {
            device: this.device,
            inSetup: true, // No need to defuse setup.
            data: null
        };

        return new BindGroupDataSetup(lDataLayout, lData, lDataSetupReferences, (pData: BindData) => {
            // Validate bind data based on layout.
            const lBindDataValid: boolean = (() => {
                switch (true) {
                    // Textures must use a buffer memory layout.
                    case pData instanceof GpuBuffer: {
                        return lDataLayout instanceof BaseBufferMemoryLayout;
                    }

                    // Samplers must use a texture sampler memory layout.
                    case pData instanceof TextureSampler: {
                        return lDataLayout instanceof SamplerMemoryLayout;

                    }
                    // Textures must use a texture memory layout.
                    case pData instanceof ImageTexture:
                    case pData instanceof FrameBufferTexture:
                    case pData instanceof VideoTexture:
                    case pData instanceof CanvasTexture: {
                        return lDataLayout instanceof TextureMemoryLayout;
                    }

                    default: {
                        return false;
                    }
                }
            })();

            // Apply validation.
            if (!lBindDataValid) {
                throw new Exception(`Bind data for "${pBindName}" not valid for its layout.`, this);
            }

            // Set data.
            this.mBindData.set(pBindName, pData);

            // Trigger update on data change. 
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }

    /**
     * Generate native gpu bind data group.
     */
    protected override generate(): GPUBindGroup {
        const lEntryList: Array<GPUBindGroupEntry> = new Array<GPUBindGroupEntry>();

        for (const lBindname of this.layout.bindingNames) {
            // Read bind data.
            const lBindData: BindData | undefined = this.mBindData.get(lBindname);
            if (!lBindData) {
                throw new Exception(`Data for binding "${lBindname}" is not set.`, this);
            }

            // Read bind layout.
            const lBindLayout: Readonly<BindLayout> = this.layout.getBind(lBindname);

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