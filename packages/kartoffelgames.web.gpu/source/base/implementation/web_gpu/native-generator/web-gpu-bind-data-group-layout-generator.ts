import { Exception } from '@kartoffelgames/core.data';
import { AccessMode } from '../../../../constant/access-mode.enum';
import { BufferBindType } from '../../../../constant/buffer-bind-type.enum';
import { SamplerType } from '../../../../constant/sampler-type.enum';
import { TextureBindType } from '../../../../constant/texture-bind-type.enum';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { BaseBufferMemoryLayout } from '../../../memory_layout/buffer/base-buffer-memory-layout';
import { SamplerMemoryLayout } from '../../../memory_layout/sampler-memory-layout';
import { TextureMemoryLayout } from '../../../memory_layout/texture-memory-layout';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuBindDataGroupLayoutGenerator extends BaseNativeGenerator<NativeWebGpuMap,'bindDataGroupLayout'>  {
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
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
                    case BufferBindType.Uniform: {
                        lBufferBindingType = 'uniform';
                        break;
                    }
                    case BufferBindType.Storage: {
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