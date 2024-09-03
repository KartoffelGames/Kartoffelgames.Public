import { Dictionary, Exception } from '@kartoffelgames/core';
import { AccessMode } from '../../constant/access-mode.enum';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { TextureBindType } from '../../constant/texture-bind-type.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { BaseMemoryLayout } from '../memory_layout/base-memory-layout';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { SamplerMemoryLayout } from '../memory_layout/texture/sampler-memory-layout';
import { TextureMemoryLayout } from '../memory_layout/texture/texture-memory-layout';

// TODO: Find a good way to create new binding groups.

/**
 * Bind group layout. Fixed at creation. 
 */
export class BindGroupLayout extends GpuNativeObject<GPUBindGroupLayout> {
    private readonly mBindings: Dictionary<string, BindLayout>;

    /**
     * Get binding names.
     */
    public get bindingNames(): Array<string> {
        return [...this.mBindings.keys()];
    }

    /**
     * Get bindings of group.
     */
    public get bindings(): Array<Readonly<BindLayout>> {
        const lBindingList: Array<BindLayout> = new Array<BindLayout>();
        for (const lBinding of this.mBindings.values()) {
            lBindingList[lBinding.index] = lBinding;
        }

        return lBindingList;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Gpu Device reference.
     * @param pBindingList - Binding list.
     */
    public constructor(pDevice: GpuDevice, pBindingList: Array<BindLayout>) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Validation set.
        const lBindingIndices: Set<number> = new Set<number>();
        const lBindingName: Set<string> = new Set<string>();
        let lHighestBindingIndex: number = -1;

        // Init bindings.
        this.mBindings = new Dictionary<string, BindLayout>();
        for (const lBinding of pBindingList) {
            // Shallow copy binding.
            this.mBindings.set(lBinding.name, {
                name: lBinding.name,
                index: lBinding.index,
                layout: lBinding.layout,
                visibility: lBinding.visibility,
                accessMode: lBinding.accessMode,
                usage: lBinding.usage
            });

            // Register change listener for layout changes.
            lBinding.layout.addInvalidationListener(() => { // TODO: Maybe remove it or create anew.
                this.triggerAutoUpdate(UpdateReason.ChildData);
            });

            // Validate dublicate indices.
            if (lBindingIndices.has(lBinding.index) || lBindingName.has(lBinding.name)) {
                throw new Exception(`Binding "${lBinding.name}" with index "${lBinding.index}" added twice.`, this);
            }

            // Add binding index to already binded indices. 
            lBindingIndices.add(lBinding.index);
            lBindingName.add(lBinding.name);

            // Save max index number.
            if (lHighestBindingIndex < lBinding.index) {
                lHighestBindingIndex = lBinding.index;
            }
        }

        // Validate binding continuity.
        if (lHighestBindingIndex !== (lBindingIndices.size - 1)) {
            throw new Exception(`Binding groups must have continious binding indices.`, this);
        }
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
                        switch (lEntry.usage) { // TODO: Usage is used only in buffers and not in textures. Can we group it only for buffers.
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

                            // Convert texture format to sampler values.
                            const lTextureFormat = (() => {
                                switch (lEntry.layout.format) {
                                    case TextureFormat.Depth:
                                    case TextureFormat.DepthStencil: {
                                        return 'depth';
                                    }

                                    case TextureFormat.Stencil:
                                    case TextureFormat.BlueRedGreenAlpha:
                                    case TextureFormat.Red:
                                    case TextureFormat.RedGreen:
                                    case TextureFormat.RedGreenBlueAlpha: {
                                        return 'float';
                                    }

                                    case TextureFormat.RedGreenBlueAlphaInteger:
                                    case TextureFormat.RedGreenInteger:
                                    case TextureFormat.RedInteger: {
                                        return 'uint';
                                    }
                                }
                            })();

                            // Create image texture bind information.
                            lLayoutEntry.texture = {
                                sampleType: lTextureFormat,
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
                            if (lEntry.accessMode !== AccessMode.Write) {
                                throw new Exception('Storage textures must have access mode write.', this);
                            }

                            // Create storage texture bind information.
                            lLayoutEntry.storageTexture = {
                                access: 'write-only',
                                format: lEntry.layout.format,
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
}

type BindLayout = {
    name: string,
    index: number,
    layout: BaseMemoryLayout;
    visibility: ComputeStage;
    accessMode: AccessMode;
    usage: BufferUsage;
};