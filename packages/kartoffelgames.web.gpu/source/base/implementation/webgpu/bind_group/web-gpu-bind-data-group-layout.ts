import { Exception } from '@kartoffelgames/core.data';
import { BindDataGroupLayout } from '../../../base/binding/bind-data-group-layout';
import { BaseBufferMemoryLayout } from '../../../base/memory_layout/buffer/base-buffer-memory-layout';
import { SamplerMemoryLayout } from '../../../base/memory_layout/sampler-memory-layout';
import { TextureMemoryLayout } from '../../../base/memory_layout/texture-memory-layout';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BufferBindType } from '../../../constant/buffer-bind-type.enum';
import { SamplerType } from '../../../constant/sampler-type.enum';
import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { WebGpuTypes } from '../web-gpu-device';
import { WebGpuBindDataGroup } from './web-gpu-bind-data-group';

export class WebGpuBindDataGroupLayout extends BindDataGroupLayout<WebGpuTypes, GPUBindGroupLayout> {
    /**
    * Create bind group from layout.
    */
    public createGroup(): WebGpuBindDataGroup {
        return new WebGpuBindDataGroup(this.device, this);
    }

    /**
     * Destory texture object.
     * @param pNativeObject - Native canvas texture.
     */
    protected override destroyNative(_pNativeObject: GPUBindGroupLayout): void {
        // Nothing to destroy here. Better luck next time.
    }

    /**
     * Generate native layout object.
     */
    protected override generate(): GPUBindGroupLayout {
        const lEntryList: Array<GPUBindGroupLayoutEntry> = new Array<GPUBindGroupLayoutEntry>();

        // Generate layout entry for each binding.
        for (const lEntry of this.bindings) {
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
                            sampleType: lEntry.layout.sampleTypeFromLayout(),
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
                            format: lEntry.layout.formatFromLayout(),
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
        return this.device.reference.createBindGroupLayout({
            label: 'Bind-Group-Layout',
            entries: lEntryList
        });
    }
}