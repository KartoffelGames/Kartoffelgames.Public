import { Dictionary, Exception, TypedArray } from '@kartoffelgames/core';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { StorageBindingType } from '../../constant/storage-binding-type.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { GpuBuffer } from '../buffer/gpu-buffer';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { SamplerMemoryLayout } from '../memory_layout/texture/sampler-memory-layout';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';
import { BaseTexture } from '../texture/base-texture';
import { TextureSampler } from '../texture/texture-sampler';
import { BindGroupDataSetup } from './bind-group-data-setup';
import { BindGroupLayout, BindLayout } from './bind-group-layout';

export class BindGroup extends GpuObject<GPUBindGroup, BindGroupInvalidationType> implements IGpuObjectNative<GPUBindGroup> {
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
        super(pDevice);

        this.mLayout = pBindGroupLayout;
        this.mBindData = new Dictionary<string, BindData>();

        // Register change listener for layout changes.
        pBindGroupLayout.addInvalidationListener(() => {
            this.invalidate(BindGroupInvalidationType.NativeRebuild);
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
        const lBindLayout: Readonly<BindLayout> = this.mLayout.getBind(pBindName);
        const lData: BindData | null = this.mBindData.get(pBindName) ?? null;

        // Construct setup data to data.
        const lDataSetupReferences: GpuObjectSetupReferences<null> = {
            device: this.device,
            inSetup: true, // No need to defuse setup.
            data: null
        };

        return new BindGroupDataSetup(lBindLayout, lData, lDataSetupReferences, (pData: BindData) => {
            // Validate if layout fits bind data and dynamicly extend usage type of bind data.
            switch (true) {
                // Textures must use a buffer memory layout.
                case pData instanceof GpuBuffer: {
                    if (!(lBindLayout.layout instanceof BaseBufferMemoryLayout)) {
                        throw new Exception(`Buffer added to bind data "${pBindName}" but binding does not expect a buffer.`, this);
                    }

                    // Extend buffer usage based on if it is a storage or not.
                    if (lBindLayout.storageType !== StorageBindingType.None) {
                        pData.extendUsage(BufferUsage.Storage);
                    } else {
                        pData.extendUsage(BufferUsage.Uniform);
                    }

                    break;
                }

                // Samplers must use a texture sampler memory layout.
                case pData instanceof TextureSampler: {
                    if (!(lBindLayout.layout instanceof SamplerMemoryLayout)) {
                        throw new Exception(`Texture sampler added to bind data "${pBindName}" but binding does not expect a texture sampler.`, this);
                    }

                    break;
                }

                // Textures must use a texture memory layout.
                case pData instanceof BaseTexture: {
                    if (!(lBindLayout.layout instanceof TextureMemoryLayout)) {
                        throw new Exception(`Texture added to bind data "${pBindName}" but binding does not expect a texture.`, this);
                    }

                    // Extend buffer usage based on if it is a storage or not.
                    if (lBindLayout.storageType !== StorageBindingType.None) {
                        pData.extendUsage(TextureUsage.Storage);
                    } else {
                        pData.extendUsage(TextureUsage.TextureBinding);
                    }

                    break;
                }

                default: {
                    throw new Exception(`Unsupported resource added to bind data "${pBindName}".`, this);
                }
            }

            // Set data.
            this.mBindData.set(pBindName, pData);

            // Trigger update data is invalid.
            pData.addInvalidationListener(() => {
                this.invalidate(BindGroupInvalidationType.NativeRebuild);
            }); // TODO: Distinct and only update when necessary.

            // Trigger update on data change. 
            this.invalidate(BindGroupInvalidationType.NativeRebuild);
        });
    }

    /**
     * Generate native gpu bind data group.
     */
    protected override generateNative(): GPUBindGroup {
        // Invalidate group.
        this.invalidate(BindGroupInvalidationType.NativeRebuild);

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

            // Sampler bind
            if (lBindData instanceof TextureSampler) {
                lGroupEntry.resource = lBindData.native;
                lEntryList.push(lGroupEntry);
                continue;
            }

            // Texture bind.
            if (lBindData instanceof BaseTexture) {
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

export type BindData = GpuBuffer<TypedArray> | TextureSampler | BaseTexture;

export enum BindGroupInvalidationType {
    NativeRebuild = 'NativeRebuild',
}