import { Dictionary, Exception } from '@kartoffelgames/core';
import { AccessMode } from '../../constant/access-mode.enum';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { TextureBindType } from '../../constant/texture-bind-type.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences, NativeObjectLifeTime } from '../gpu/object/gpu-object';
import { UpdateReason } from '../gpu/object/gpu-object-update-reason';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { IGpuObjectSetup } from '../gpu/object/interface/i-gpu-object-setup';
import { BaseMemoryLayout } from '../memory_layout/base-memory-layout';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { SamplerMemoryLayout } from '../memory_layout/texture/sampler-memory-layout';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';
import { TextureFormatCapability } from '../texture/texture-format-capabilities';
import { BindGroupLayoutSetup, BindGroupLayoutSetupData } from './setup/bind-group-layout-setup';
import { BindGroup } from './bind-group';

// TODO: Find a good way to create new binding groups.

/**
 * Bind group layout. Fixed at creation. 
 */
export class BindGroupLayout extends GpuObject<GPUBindGroupLayout, BindGroupLayoutSetup> implements IGpuObjectNative<GPUBindGroupLayout>, IGpuObjectSetup<BindGroupLayoutSetup> {
    private readonly mBindings: Dictionary<string, BindLayout>;
    private readonly mName: string;

    /**
     * Get binding names.
     */
    public get bindingNames(): Array<string> {
        // Ensure setup.
        this.ensureSetup();

        return [...this.mBindings.keys()];
    }

    /**
     * Get bindings of group in binding order.
     */
    public get bindings(): Array<Readonly<BindLayout>> {
        // Ensure setup.
        this.ensureSetup();

        const lBindingList: Array<BindLayout> = new Array<BindLayout>();
        for (const lBinding of this.mBindings.values()) {
            lBindingList[lBinding.index] = lBinding;
        }

        return lBindingList;
    }

    /**
     * Bind group name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPUBindGroupLayout {
        return super.native;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Gpu Device reference.
     * @param pName - Name of binding group.
     */
    public constructor(pDevice: GpuDevice, pName: string) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Set binding group name.
        this.mName = pName;

        // Init bindings.
        this.mBindings = new Dictionary<string, BindLayout>();
    }

    /**
     * Create new bind group from layout.
     * 
     * @returns new bind group.
     */
    public create(): BindGroup {
        // Ensure setup.
        this.ensureSetup();

        return new BindGroup(this.device, this);
    }

    /**
     * Get full bind information.
     * @param pName - Bind name.
     */
    public getBind(pName: string): Readonly<BindLayout> {
        // Ensure setup.
        this.ensureSetup();

        if (!this.mBindings.has(pName)) {
            throw new Exception(`Bind ${pName} does not exist.`, this);
        }

        return this.mBindings.get(pName)!;
    }

    /**
     * Call setup.
     * 
     * @param pSetupCallback - Setup callback.
     *
     * @returns — this. 
     */
    public override setup(pSetupCallback?: ((pSetup: BindGroupLayoutSetup) => void) | undefined): this {
        return super.setup(pSetupCallback);
    }

    /**
     * Generate native bind data group layout object.
     */
    protected override generate(): GPUBindGroupLayout {
        const lEntryList: Array<GPUBindGroupLayoutEntry> = new Array<GPUBindGroupLayoutEntry>();

        // Generate layout entry for each binding.
        for (const lEntry of this.bindings) {
            // Generate default properties.
            const lLayoutEntry: GPUBindGroupLayoutEntry = {
                visibility: lEntry.visibility,
                binding: lEntry.index
            };

            // Different binding for different
            switch (true) {
                // Buffer layouts.
                case lEntry.layout instanceof BaseBufferMemoryLayout: {
                    // Convert bind type info bufer binding type.
                    const lBufferBindingType: GPUBufferBindingType = (() => {
                        switch (lEntry.layout.usage) {
                            case BufferUsage.Uniform: {
                                return 'uniform';
                            }
                            case BufferUsage.Storage: {
                                // Read only access. No bit compare.
                                if (lEntry.accessMode === AccessMode.Read) {
                                    return 'read-only-storage';
                                }

                                return 'storage';
                            }
                            default: {
                                throw new Exception('Can only bind buffers of bind type storage or uniform.', this);
                            }
                        }
                    })();

                    // Create buffer layout with all optional values.
                    lLayoutEntry.buffer = {
                        type: lBufferBindingType,
                        minBindingSize: 0,
                        hasDynamicOffset: false
                    } satisfies Required<GPUBufferBindingLayout>;

                    break;
                }

                // Sampler layouts.
                case lEntry.layout instanceof SamplerMemoryLayout: {
                    // Create sampler layout with all optional values.
                    lLayoutEntry.sampler = {
                        type: lEntry.layout.samplerType
                    } satisfies Required<GPUSamplerBindingLayout>;

                    break;
                }

                // Texture layouts.
                case lEntry.layout instanceof TextureMemoryLayout: {
                    switch (lEntry.layout.bindType) {
                        case TextureBindType.Image: {
                            // Image textures need to be read only.
                            if (lEntry.accessMode !== AccessMode.Read) {
                                throw new Exception('Image textures must have access mode read.', this);
                            }

                            // Read texture capabilities.
                            const lTextureFormatCapabilities: TextureFormatCapability = this.device.formatValidator.capabilityOf(lEntry.layout.format);

                            // Create image texture bind information.
                            lLayoutEntry.texture = {
                                sampleType: lTextureFormatCapabilities.type[0],
                                multisampled: lEntry.layout.multisampled,
                                viewDimension: lEntry.layout.dimension
                            } satisfies Required<GPUTextureBindingLayout>;

                            break;
                        }
                        case TextureBindType.External: {
                            // External textures need to be read only.
                            if (lEntry.accessMode !== AccessMode.Read) {
                                throw new Exception('External textures must have access mode read.', this);
                            }

                            // Create external texture bind information.
                            lLayoutEntry.externalTexture = {} satisfies Required<GPUExternalTextureBindingLayout>;

                            break;
                        }
                        case TextureBindType.Storage: {
                            // Storage textures need to be write only.
                            let lStorageAccess: GPUStorageTextureAccess;
                            switch (lEntry.accessMode) {
                                case AccessMode.Write & AccessMode.Read: {
                                    lStorageAccess = 'read-write';
                                    break;
                                }
                                case AccessMode.Write: {
                                    lStorageAccess = 'write-only';
                                    break;
                                }
                                case AccessMode.Read: {
                                    lStorageAccess = 'read-only';
                                    break;
                                }
                            }

                            // Create storage texture bind information.
                            lLayoutEntry.storageTexture = {
                                access: lStorageAccess!,
                                format: lEntry.layout.format as GPUTextureFormat,
                                viewDimension: lEntry.layout.dimension
                            } satisfies Required<GPUStorageTextureBindingLayout>;

                            break;
                        }
                        default: {
                            throw new Exception('Cant bind attachment textures.', this);
                        }
                    }

                    break;
                }
            }

            // Add binding entry to bindings.
            lEntryList.push(lLayoutEntry);
        }

        // Create binding group layout.
        return this.device.gpu.createBindGroupLayout({
            label: 'Bind-Group-Layout',
            entries: lEntryList
        });
    }

    /**
     * Setup bind group.
     * 
     * @param pReferences - Setup data references. 
     */
    protected override onSetup(pReferences: BindGroupLayoutSetupData): void {
        // Validation set.
        const lBindingIndices: Set<number> = new Set<number>();
        const lBindingName: Set<string> = new Set<string>();

        // Add each binding.
        for (const lBinding of pReferences.bindings) {
            // Validate layout.
            if (!lBinding.layout) {
                throw new Exception(`Bind group binding "${lBinding.name}" has no setup layout.`, this);
            }

            // Shallow copy binding.
            this.mBindings.set(lBinding.name, {
                name: lBinding.name,
                index: lBinding.index,
                layout: lBinding.layout,
                visibility: lBinding.visibility,
                accessMode: lBinding.accessMode
            });

            // Register change listener for layout changes.
            lBinding.layout.addInvalidationListener(() => {
                this.triggerAutoUpdate(UpdateReason.ChildData);
            });

            // Validate dublicate indices.
            if (lBindingIndices.has(lBinding.index) || lBindingName.has(lBinding.name)) {
                throw new Exception(`Binding "${lBinding.name}" with index "${lBinding.index}" added twice.`, this);
            }

            // Add binding index to already binded indices. 
            lBindingIndices.add(lBinding.index);
            lBindingName.add(lBinding.name);
        }
    }

    /**
     * Create setup object. Return null to skip any setups.
     * 
     * @param pReferences - Setup references.
     * 
     * @returns setup.
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<never>): BindGroupLayoutSetup {
        return new BindGroupLayoutSetup(pReferences);
    }
}

export type BindLayout = {
    name: string,
    index: number,
    layout: BaseMemoryLayout;
    visibility: ComputeStage;
    accessMode: AccessMode;
};