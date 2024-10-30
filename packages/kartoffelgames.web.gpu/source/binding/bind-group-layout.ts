import { Dictionary, Exception } from '@kartoffelgames/core';
import { ComputeStage } from '../constant/compute-stage.enum';
import { StorageBindingType } from '../constant/storage-binding-type.enum';
import { GpuLimit } from '../gpu/capabilities/gpu-limit.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences } from '../gpu/object/gpu-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { IGpuObjectSetup } from '../gpu/object/interface/i-gpu-object-setup';
import { BaseMemoryLayout } from '../memory_layout/base-memory-layout';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { SamplerMemoryLayout } from '../memory_layout/texture/sampler-memory-layout';
import { TextureViewMemoryLayout } from '../memory_layout/texture/texture-view-memory-layout';
import { TextureFormatCapability } from '../texture/texture-format-capabilities';
import { BindGroup } from './bind-group';
import { BindGroupLayoutSetup, BindGroupLayoutSetupData } from './setup/bind-group-layout-setup';

/**
 * Bind group layout. Fixed at creation. 
 */
export class BindGroupLayout extends GpuObject<GPUBindGroupLayout, '', BindGroupLayoutSetup> implements IGpuObjectNative<GPUBindGroupLayout>, IGpuObjectSetup<BindGroupLayoutSetup> {
    private readonly mBindings: Dictionary<string, BindLayout>;
    private readonly mName: string;
    private readonly mOrderedBindingNames: Array<string>;

    /**
     * Get binding names.
     */
    public get bindingNames(): Array<string> {
        // Ensure setup.
        this.ensureSetup();

        return this.mOrderedBindingNames;
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
        super(pDevice);

        // Set binding group name.
        this.mName = pName;

        // Init bindings.
        this.mBindings = new Dictionary<string, BindLayout>();
        this.mOrderedBindingNames = new Array<string>();
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
    protected override generateNative(): GPUBindGroupLayout {
        const lEntryList: Array<GPUBindGroupLayoutEntry> = new Array<GPUBindGroupLayoutEntry>();

        // Generate layout entry for each binding.
        for (const lEntry of this.mBindings.values()) {
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
                        switch (lEntry.storageType) {
                            case StorageBindingType.None: {
                                return 'uniform';
                            }
                            case StorageBindingType.Read: {
                                return 'read-only-storage';
                            }
                            default: {
                                return 'storage';
                            }
                        }
                    })();

                    // Create buffer layout with all optional values.
                    lLayoutEntry.buffer = {
                        type: lBufferBindingType,
                        minBindingSize: 0,
                        hasDynamicOffset: lEntry.dynamicOffsets > 1
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
                case lEntry.layout instanceof TextureViewMemoryLayout: {
                    // Uniform bind when without storage binding.
                    if (lEntry.storageType === StorageBindingType.None) {
                        // Read texture capabilities.
                        const lTextureFormatCapabilities: TextureFormatCapability = this.device.formatValidator.capabilityOf(lEntry.layout.format);

                        // Create image texture bind information.
                        lLayoutEntry.texture = {
                            sampleType: lTextureFormatCapabilities.sampleTypes.primary,
                            multisampled: lEntry.layout.multisampled,
                            viewDimension: lEntry.layout.dimension
                        } satisfies Required<GPUTextureBindingLayout>;

                        break;
                    }

                    // Storage textures need to be write only.
                    let lStorageAccess: GPUStorageTextureAccess;
                    switch (lEntry.storageType) {
                        case StorageBindingType.ReadWrite: {
                            lStorageAccess = 'read-write';
                            break;
                        }
                        case StorageBindingType.Write: {
                            lStorageAccess = 'write-only';
                            break;
                        }
                        case StorageBindingType.Read: {
                            lStorageAccess = 'read-only';
                            break;
                        }
                    }

                    // Create storage texture bind information.
                    lLayoutEntry.storageTexture = {
                        access: lStorageAccess!,
                        format: lEntry.layout.format as GPUTextureFormat,
                        viewDimension: lEntry.layout.dimension,
                    } satisfies Required<GPUStorageTextureBindingLayout>;
                }
            }

            // Add binding entry to bindings.
            lEntryList.push(lLayoutEntry);
        }

        // Create binding group layout.
        return this.device.gpu.createBindGroupLayout({
            label: `BindGroupLayout-${this.mName}`,
            entries: lEntryList
        });
    }

    /**
     * Setup bind group.
     * 
     * @param pReferences - Setup data references. 
     */
    protected override onSetup(pReferences: BindGroupLayoutSetupData): void {
        // Check capabilities.
        const lMaxBindGroupCount: number = this.device.capabilities.getLimit(GpuLimit.MaxBindingsPerBindGroup);
        if (pReferences.bindings.length > (lMaxBindGroupCount - 1)) {
            throw new Exception(`Bind group "${this.mName}" exceeds max binding count.`, this);
        }

        // Validation set.
        const lBindingIndices: Set<number> = new Set<number>();
        const lBindingName: Set<string> = new Set<string>();

        // Add each binding.
        for (const lBinding of pReferences.bindings) {
            // Validate layout.
            if (!lBinding.layout) {
                throw new Exception(`Bind group binding "${lBinding.name}" has no setup layout.`, this);
            }

            // Only buffers can have a dynamic offset.
            if (lBinding.dynamicOffsetCount > 1 && !(lBinding.layout instanceof BaseBufferMemoryLayout)) {
                throw new Exception(`Bind group binding "${lBinding.name}" must be a buffer binding to have dynamic offsets.`, this);
            }

            // Buffers with dynamic offsets must be fixed in size.
            if(lBinding.dynamicOffsetCount > 1 && (<BaseBufferMemoryLayout>lBinding.layout).variableSize > 0) {
                throw new Exception(`Bind group binding "${lBinding.name}" must have a fixed buffer layout to have dynamic offsets.`, this);
            }

            // Layout validation for 32bit formats are in setup.

            // Shallow copy binding.
            this.mBindings.set(lBinding.name, {
                name: lBinding.name,
                index: lBinding.index,
                layout: lBinding.layout,
                visibility: lBinding.visibility,
                storageType: lBinding.storageType,
                dynamicOffsets: lBinding.dynamicOffsetCount
            });

            // Validate dublicate indices.
            if (lBindingIndices.has(lBinding.index) || lBindingName.has(lBinding.name)) {
                throw new Exception(`Binding "${lBinding.name}" with index "${lBinding.index}" added twice.`, this);
            }

            // Add binding index to already binded indices. 
            lBindingIndices.add(lBinding.index);
            lBindingName.add(lBinding.name);

            // Add binding ordered by index.
            this.mOrderedBindingNames[lBinding.index] = lBinding.name;
        }
    }

    /**
     * Create setup object. Return null to skip any setups.
     * 
     * @param pReferences - Setup references.
     * 
     * @returns setup.
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<BindGroupLayoutSetupData>): BindGroupLayoutSetup {
        return new BindGroupLayoutSetup(pReferences);
    }
}

export type BindLayout = {
    name: string,
    index: number,
    layout: BaseMemoryLayout;
    visibility: ComputeStage;
    storageType: StorageBindingType;
    dynamicOffsets: number;
};