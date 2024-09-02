import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { BaseMemoryLayout } from '../memory_layout/base-memory-layout';
import { BindDataGroup } from './bind-data-group';

export class BindGroupLayout extends GpuNativeObject<GPUBindGroupLayout> {
    private readonly mBindings: Dictionary<string, BindLayout>;
    private mIdentifier: string;

    /**
     * Get binding names.
     */
    public get bindingNames(): Array<string> {
        return [...this.mBindings.keys()];
    }

    /**
    * Get bindings of group.
    */
    public get bindings(): Array<BindLayout> {
        const lBindingList: Array<BindLayout> = new Array<BindLayout>();
        for (const lBinding of this.mBindings.values()) {
            lBindingList[lBinding.index] = lBinding;
        }

        return lBindingList;
    }

    /**
     * Get bind group identifier.
     * Same configured groups has the same identifier.
     */
    public get identifier(): string {
        return this.mIdentifier;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Init storage.
        this.mBindings = new Dictionary<string, BindLayout>();

        // Update identifier.
        this.mIdentifier = '';
        this.addInvalidationListener(() => {
            let lIdentifier: string = '';
            for (const lBind of this.mBindings.values()) {
                // Simple chain of values.
                lIdentifier += lBind.index;
                lIdentifier += '-' + lBind.name;
                lIdentifier += '-' + lBind.layout.accessMode;
                lIdentifier += '-' + lBind.layout.bindingIndex;
                lIdentifier += '-' + lBind.layout.memoryType;
                lIdentifier += '-' + lBind.layout.name;
                lIdentifier += '-' + lBind.layout.visibility;
                lIdentifier += ';';
            }

            this.mIdentifier = lIdentifier;
        });
    }

    /**
     * Add layout to binding group.
     * @param pLayout - Memory layout.
     * @param pName - Binding name. For easy access only.
     * @param pIndex - Index of bind inside group.
     */
    public addBinding(pLayout: BaseMemoryLayout, pName: string): void {
        if (pLayout.bindingIndex === null) {
            throw new Exception(`Layout "${pLayout.name}" binding needs a binding index.`, this);
        }

        // Set layout.
        this.mBindings.set(pName, {
            name: pName,
            index: pLayout.bindingIndex,
            layout: pLayout
        });

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });

        // Trigger next auto update.
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }

    /**
     * Create bind group from layout.
     */
    public createGroup(): BindDataGroup {
        return new BindDataGroup(this.device, this);
    }

    /**
     * Get full bind information.
     * @param pName - Bind name.
     */
    public getBind(pName: string): Readonly<BindLayout> {
        if (!this.mBindings.has(pName)) {
            throw new Exception(`Bind ${pName} does not exist.`, this);
        }

        return this.mBindings.get(pName)!;
    }

    /**
     * Destroy nothing.
     */
    protected override destroy(): void {
        // Yeah nothing is here to destroy.
    }

    /**
     * Generate native bind data group layout object.
     */
    protected override generate(): GPUBindGroupLayout {
        const lEntryList: Array<GPUBindGroupLayoutEntry> = new Array<GPUBindGroupLayoutEntry>();

        // Generate layout entry for each binding.
        for (const lEntry of this.gpuObject.bindings) {
            // Generate default properties.
            const lLayoutEntry: GPUBindGroupLayoutEntry = {
                visibility: lEntry.layout.visibility,
                binding: lEntry.index
            };

            // Buffer layouts.
            if (lEntry.layout instanceof BaseBufferMemoryLayout) {
                let lBufferBindingType: GPUBufferBindingType;
                switch (lEntry.layout.bindType) {
                    case BufferUsage.Uniform: {
                        lBufferBindingType = 'uniform';
                        break;
                    }
                    case BufferUsage.Storage: {
                        // Read only access. No bit compare.
                        if (lEntry.layout.accessMode === AccessMode.Read) {
                            lBufferBindingType = 'read-only-storage';
                        } else {
                            lBufferBindingType = 'storage';
                        }
                        break;
                    }
                    default: {
                        throw new Exception('Can only bind buffers of bind type storage or uniform.', this);
                    }
                }

                // Create buffer layout with all optional values.
                const lBufferLayout: Required<GPUBufferBindingLayout> = {
                    type: lBufferBindingType,
                    minBindingSize: 0,
                    hasDynamicOffset: false
                };
                lLayoutEntry.buffer = lBufferLayout;

                // Add buffer layout entry to bindings.
                lEntryList.push(lLayoutEntry);

                continue;
            }

            // Sampler layouts.
            if (lEntry.layout instanceof SamplerMemoryLayout) {
                let lSamplerBindingType: GPUSamplerBindingType;
                switch (lEntry.layout.samplerType) {
                    case SamplerType.Comparison: {
                        lSamplerBindingType = 'comparison';
                        break;
                    }
                    case SamplerType.Filter: {
                        lSamplerBindingType = 'filtering';
                        break;
                    }
                }

                // Create sampler layout with all optional values.
                const lSamplerLayout: Required<GPUSamplerBindingLayout> = {
                    type: lSamplerBindingType
                };
                lLayoutEntry.sampler = lSamplerLayout;

                // Add sampler layout entry to bindings.
                lEntryList.push(lLayoutEntry);

                continue;
            }

            // Texture layouts.
            if (lEntry.layout instanceof TextureMemoryLayout) {
                switch (lEntry.layout.bindType) {
                    case TextureBindType.External: {
                        if (lEntry.layout.accessMode !== AccessMode.Read) {
                            throw new Exception('External textures must have access mode read.', this);
                        }

                        const lExternalTextureLayout: Required<GPUExternalTextureBindingLayout> = {};
                        lLayoutEntry.externalTexture = lExternalTextureLayout;
                        break;
                    }
                    case TextureBindType.Images: {
                        if (lEntry.layout.accessMode !== AccessMode.Read) {
                            throw new Exception('Image textures must have access mode read.', this);
                        }

                        const lTextureLayout: Required<GPUTextureBindingLayout> = {
                            sampleType: this.factory.sampleTypeFromLayout(lEntry.layout),
                            multisampled: lEntry.layout.multisampled,
                            viewDimension: lEntry.layout.dimension
                        };
                        lLayoutEntry.texture = lTextureLayout;
                        break;
                    }
                    case TextureBindType.Storage: {
                        if (lEntry.layout.accessMode !== AccessMode.Write) {
                            throw new Exception('Storage textures must have access mode write.', this);
                        }

                        const lStorageTextureLayout: Required<GPUStorageTextureBindingLayout> = {
                            access: 'write-only',
                            format: this.factory.formatFromLayout(lEntry.layout),
                            viewDimension: lEntry.layout.dimension
                        };
                        lLayoutEntry.storageTexture = lStorageTextureLayout;
                        break;
                    }
                    default: {
                        throw new Exception('Cant bind attachment textures.', this);
                    }
                }

                lEntryList.push(lLayoutEntry);
            }

            lEntryList.push(lLayoutEntry);
        }

        // Create binding group layout.
        return this.factory.gpu.createBindGroupLayout({
            label: 'Bind-Group-Layout',
            entries: lEntryList
        });
    }
}

type BindLayout = {
    name: string,
    index: number,
    layout: BaseMemoryLayout;
};