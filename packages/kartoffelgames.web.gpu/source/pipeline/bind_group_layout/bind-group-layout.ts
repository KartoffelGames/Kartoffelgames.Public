import { Dictionary, Exception } from '@kartoffelgames/core';
import type { ComputeStage } from '../../constant/compute-stage.enum.ts';
import { GpuLimit } from '../../constant/gpu-limit.enum.ts';
import type { SamplerType } from '../../constant/sampler-type.enum.ts';
import { StorageBindingType } from '../../constant/storage-binding-type.enum.ts';
import type { TextureFormat } from '../../constant/texture-format.enum.ts';
import type { TextureViewDimension } from '../../constant/texture-view-dimension.enum.ts';
import type { TextureFormatCapability } from '../../device/capabilities/gpu-texture-format-capabilities.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject, type GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import type { IGpuObjectNative } from '../../gpu_object/interface/i-gpu-object-native.ts';
import type { IGpuObjectSetup } from '../../gpu_object/interface/i-gpu-object-setup.ts';
import { BindGroup } from '../bind_group/bind-group.ts';
import { BindGroupLayoutSetup, type BindGroupLayoutSetupData } from './bind-group-layout-setup.ts';

/**
 * Bind group layout. Fixed at creation. 
 */
export class BindGroupLayout extends GpuObject<GPUBindGroupLayout, '', BindGroupLayoutSetup> implements IGpuObjectNative<GPUBindGroupLayout>, IGpuObjectSetup<BindGroupLayoutSetup> {
    private readonly mBindings: Dictionary<string, BindGroupBindLayout>;
    private mHasDynamicOffset: boolean;
    private readonly mName: string;
    private readonly mOrderedBindingNames: Array<string>;
    private readonly mResourceCounter: BindGroupLayoutResourceCounter;

    /**
     * Bindgroup has a dynamic offset binding.
     */
    public get hasDynamicOffset(): boolean {
        return this.mHasDynamicOffset;
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
     * Get binding names ordered by index.
     */
    public get orderedBindingNames(): Array<string> {
        // Ensure setup.
        this.ensureSetup();

        return this.mOrderedBindingNames;
    }

    /**
     * Resource counter.
     */
    public get resourceCounter(): Readonly<BindGroupLayoutResourceCounter> {
        return this.mResourceCounter;
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
        this.mHasDynamicOffset = false;
        this.mResourceCounter = {
            storageDynamicOffset: 0,
            uniformDynamicOffset: 0,
            sampler: 0,
            sampledTextures: 0,
            storageTextures: 0,
            storageBuffers: 0,
            uniformBuffers: 0
        };

        // Init bindings.
        this.mBindings = new Dictionary<string, BindGroupBindLayout>();
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
    public getBind(pName: string): Readonly<BindGroupBindLayout> {
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

            // Different binding for different resource types.
            switch (lEntry.resource.type) {
                // Buffer layouts.
                case 'buffer': {
                    // Convert bind type info buffer binding type.
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
                        hasDynamicOffset: lEntry.hasDynamicOffset
                    } satisfies Required<GPUBufferBindingLayout>;

                    break;
                }

                // Sampler layouts.
                case 'sampler': {
                    // Create sampler layout with all optional values.
                    lLayoutEntry.sampler = {
                        type: lEntry.resource.samplerType
                    } satisfies Required<GPUSamplerBindingLayout>;

                    break;
                }

                // Texture layouts.
                case 'texture': {
                    // Uniform bind when without storage binding.
                    if (lEntry.storageType === StorageBindingType.None) {
                        // Read texture capabilities.
                        const lTextureFormatCapabilities: TextureFormatCapability = this.device.formatValidator.capabilityOf(lEntry.resource.format);

                        // Create image texture bind information.
                        lLayoutEntry.texture = {
                            sampleType: lTextureFormatCapabilities.sampleTypes.primary,
                            multisampled: lEntry.resource.multisampled,
                            viewDimension: lEntry.resource.dimension
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
                        format: lEntry.resource.format as GPUTextureFormat,
                        viewDimension: lEntry.resource.dimension,
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
            if (!lBinding.resource) {
                throw new Exception(`Bind group binding "${lBinding.name}" has no setup layout.`, this);
            }

            // Only buffers can have a dynamic offset.
            if (lBinding.hasDynamicOffset && lBinding.resource.type !== 'buffer') {
                throw new Exception(`Bind group binding "${lBinding.name}" must be a buffer binding to have dynamic offsets.`, this);
            }

            // Buffers with dynamic offsets must be fixed in size.
            if (lBinding.hasDynamicOffset && lBinding.resource.type === 'buffer' && lBinding.resource.variableSize > 0) {
                throw new Exception(`Bind group binding "${lBinding.name}" must have a fixed buffer layout to have dynamic offsets.`, this);
            }

            // Layout validation for 32bit formats are in setup.

            // Shallow copy binding.
            this.mBindings.set(lBinding.name, {
                name: lBinding.name,
                index: lBinding.index,
                resource: lBinding.resource,
                visibility: lBinding.visibility,
                storageType: lBinding.storageType,
                hasDynamicOffset: lBinding.hasDynamicOffset
            });

            // Set dynamic offset flag when any is active.
            if (lBinding.hasDynamicOffset) {
                this.mHasDynamicOffset = true;

                // Count dynamic resources
                if (lBinding.storageType === StorageBindingType.None) {
                    this.mResourceCounter.uniformDynamicOffset++;
                } else {
                    this.mResourceCounter.storageDynamicOffset++;
                }
            }

            // Validate dublicate indices.
            if (lBindingIndices.has(lBinding.index) || lBindingName.has(lBinding.name)) {
                throw new Exception(`Binding "${lBinding.name}" with index "${lBinding.index}" added twice.`, this);
            }

            // Add binding index to already binded indices. 
            lBindingIndices.add(lBinding.index);
            lBindingName.add(lBinding.name);

            // Add binding ordered by index.
            this.mOrderedBindingNames[lBinding.index] = lBinding.name;

            // Count resources.
            switch (lBinding.resource.type) {
                case 'sampler': {
                    this.mResourceCounter.sampler++;
                    break;
                }
                case 'texture': {
                    if (lBinding.storageType === StorageBindingType.None) {
                        this.mResourceCounter.sampledTextures++;
                    } else {
                        this.mResourceCounter.storageTextures++;
                    }

                    break;
                }
                case 'buffer': {
                    if (lBinding.storageType === StorageBindingType.None) {
                        this.mResourceCounter.uniformBuffers++;
                    } else {
                        this.mResourceCounter.storageBuffers++;
                    }

                    break;
                }
            }
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

export type BindLayoutBufferBinding = { type: 'buffer'; fixedSize: number; variableSize: number; };
export type BindLayoutSamplerBinding = { type: 'sampler'; samplerType: SamplerType; };
export type BindLayoutTextureBinding = { type: 'texture'; dimension: TextureViewDimension; format: TextureFormat; multisampled: boolean; };
export type BindLayoutBinding = BindLayoutBufferBinding | BindLayoutSamplerBinding | BindLayoutTextureBinding;

export type BindGroupBindLayout = {
    name: string,
    index: number,
    resource: BindLayoutBinding;
    visibility: ComputeStage;
    storageType: StorageBindingType;
    hasDynamicOffset: boolean;
};

type BindGroupLayoutResourceCounter = {
    // Dynamic resources.
    storageDynamicOffset: number;
    uniformDynamicOffset: number;

    // Texture resource.
    sampler: number;
    sampledTextures: number;
    storageTextures: number;

    // Buffers.
    storageBuffers: number;
    uniformBuffers: number;
};