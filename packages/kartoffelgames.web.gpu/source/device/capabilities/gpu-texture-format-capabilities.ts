import { Exception } from '@kartoffelgames/core';
import { GpuFeature } from '../../constant/gpu-feature.enum.ts';
import { TextureAspect } from '../../constant/texture-aspect.enum.ts';
import type { TextureDimension } from '../../constant/texture-dimension.ts';
import type { TextureFormat } from '../../constant/texture-format.type.ts';
import { TextureSampleType } from '../../constant/texture-sample-type.enum.ts';
import { TextureUsage } from '../../constant/texture-usage.enum.ts';
import type { GpuDevice } from '../gpu-device.ts';

export class GpuTextureFormatCapabilities {
    private readonly mDevice: GpuDevice;
    private readonly mFormatCapabilitys: Map<TextureFormat, TextureFormatCapabilityDefinition>;

    /**
     * Get prefered canvas format.
     */
    public get preferredCanvasFormat(): TextureFormat {
        return globalThis.navigator.gpu.getPreferredCanvasFormat() as TextureFormat;
    }

    /**
     * Constructor. Inits capabilities.
     * 
     * @param pDevice - Device.
     */
    public constructor(pDevice: GpuDevice) {
        this.mDevice = pDevice;

        // Setup any format with its capabilities.
        this.mFormatCapabilitys = this.constructFormatCapability();
    }

    /**
     * Get all texture format capabilities of format.
     * 
     * @param pFormat - Format.
     * 
     * @returns capabilities of format. 
     */
    public capabilityOf(pFormat: TextureFormat): TextureFormatCapability {
        const lCapabilityDefinition: TextureFormatCapabilityDefinition | undefined = this.mFormatCapabilitys.get(pFormat);
        if (!lCapabilityDefinition) {
            throw new Exception(`Format "${pFormat}" not defined.`, this);
        }

        // Gather all texture usages.
        const lTextureUsages: Set<TextureUsage> = new Set<TextureUsage>();
        if (lCapabilityDefinition.usage.copy) {
            // Can be copied.
            if (lCapabilityDefinition.usage.copy.imageSource || lCapabilityDefinition.usage.copy.textureSource) {
                lTextureUsages.add(TextureUsage.CopySource);
            }
            // Can be copied into.
            if (lCapabilityDefinition.usage.copy.imageDestination || lCapabilityDefinition.usage.copy.textureDestination) {
                lTextureUsages.add(TextureUsage.CopyDestination);
            }
        }
        if (lCapabilityDefinition.usage.textureBinding) {
            lTextureUsages.add(TextureUsage.TextureBinding);
        }
        if (lCapabilityDefinition.usage.storage) {
            lTextureUsages.add(TextureUsage.Storage);
        }
        if (lCapabilityDefinition.usage.renderAttachment) {
            lTextureUsages.add(TextureUsage.RenderAttachment);
        }

        return {
            format: lCapabilityDefinition.format,
            copyCompatible: new Set<TextureFormat>((lCapabilityDefinition.usage.copy) ? lCapabilityDefinition.usage.copy.compatible : []),
            textureUsages: lTextureUsages,
            dimensions: new Set<TextureDimension>(lCapabilityDefinition.dimensions),
            aspects: new Set<TextureAspect>(lCapabilityDefinition.aspect.types),
            sampleTypes: new Set<TextureSampleType>(lCapabilityDefinition.type),
            renderAttachment: {
                resolveTarget: (lCapabilityDefinition.usage.renderAttachment) ? lCapabilityDefinition.usage.renderAttachment.resolveTarget : false,
                multisample: (lCapabilityDefinition.usage.renderAttachment) ? lCapabilityDefinition.usage.renderAttachment.multisample : false,
                blendable: (lCapabilityDefinition.usage.renderAttachment) ? lCapabilityDefinition.usage.renderAttachment.blendable : false,
            },
            storage: {
                readonly: (lCapabilityDefinition.usage.storage) ? lCapabilityDefinition.usage.storage.readonly : false,
                writeonly: (lCapabilityDefinition.usage.storage) ? lCapabilityDefinition.usage.storage.writeonly : false,
                readwrite: (lCapabilityDefinition.usage.storage) ? lCapabilityDefinition.usage.storage.readwrite : false,
            },
            copy: {
                textureSource: (lCapabilityDefinition.usage.copy) ? lCapabilityDefinition.usage.copy.textureSource : false,
                textureTarget: (lCapabilityDefinition.usage.copy) ? lCapabilityDefinition.usage.copy.textureDestination : false,
                imageSource: (lCapabilityDefinition.usage.copy) ? lCapabilityDefinition.usage.copy.imageSource : false,
                imageTarget: (lCapabilityDefinition.usage.copy) ? lCapabilityDefinition.usage.copy.imageDestination : false,
            }
        };
    }

    /**
     * Filter and return the first matching texture format based on the provided filter criteria.
     * Only set properties in the filter are used for matching. Returns the first format that satisfies all filter criteria.
     *
     * @param pFilter - Filter criteria with optional properties. Unset properties are ignored.
     *
     * @returns First matching TextureFormat or undefined if no format matches.
     */
    public filterFormatFor(pFilter: GpuTextureFormatCapabilitiesFormatFilter): TextureFormat | null {
        // Iterate through all available formats and return the first one that matches all filter criteria.
        for (const lFormatDefinition of this.mFormatCapabilitys.values()) {
            // Check TextureSampleType filter: if set, format must support this sample type.
            if (pFilter.sampleType && !lFormatDefinition.type.includes(pFilter.sampleType)) {
                continue;
            }

            // Check bytePerAspect filter: if set, must match exactly.
            if (lFormatDefinition.aspect.byteCost !== pFilter.bytePerAspect) {
                continue;
            }

            // Check TextureAspect filter: if set, format must have exactly these aspects.
            if (pFilter.aspects) {
                if (lFormatDefinition.aspect.types.length !== pFilter.aspects.length || !lFormatDefinition.aspect.types.every((pType) => pFilter.aspects!.includes(pType))) {
                    continue;
                }
            }

            // Check TextureDimension filter: if set, format must support this dimension.
            if (pFilter.dimension && !lFormatDefinition.dimensions.includes(pFilter.dimension)) {
                continue;
            }

            // Check renderAttachment filter: if set, format must support at least the specified properties.
            if (pFilter.renderAttachment) {
                // If renderAttachment filter is set but format doesn't support rendering, skip.
                if (!lFormatDefinition.usage.renderAttachment) {
                    continue;
                }

                // Check each optional property in the filter. Typechecks for boolean so a undefined whould never pass.
                if (lFormatDefinition.usage.renderAttachment.blendable !== pFilter.renderAttachment.blendable) {
                    continue;
                }
                if (lFormatDefinition.usage.renderAttachment.multisample !== pFilter.renderAttachment.multisample) {
                    continue;
                }
                if (lFormatDefinition.usage.renderAttachment.resolveTarget !== pFilter.renderAttachment.resolveTarget) {
                    continue;
                }
            }

            // All filter criteria matched, return this format.
            return lFormatDefinition.format;
        }

        // No matching format found.
        return null;
    }

    /**
     * Construct format capabilitys. This is a hardcoded list of capabilities for each format. The list is based on the WebGPU specification and may be adjusted based on device features.
     */
    private constructFormatCapability(): Map<TextureFormat, TextureFormatCapabilityDefinition> {
        const lFormatCapabilitys: Map<TextureFormat, TextureFormatCapabilityDefinition> = new Map<TextureFormat, TextureFormatCapabilityDefinition>();

        // Construct sample type for float32 texture types.
        const lFloat32Filterable: Array<TextureSampleType> = [TextureSampleType.UnfilterableFloat];
        if (this.mDevice.capabilities.hasFeature(GpuFeature.Float32Filterable)) {
            lFloat32Filterable.push(TextureSampleType.Float);
        }

        // 8-bit formats
        lFormatCapabilitys.set('r8unorm', {
            format: 'r8unorm',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['r8unorm'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false,
            }
        });
        lFormatCapabilitys.set('r8snorm', {
            format: 'r8snorm',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    compatible: ['r8snorm'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('r8uint', {
            format: 'r8uint',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['r8uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('r8sint', {
            format: 'r8sint',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.SignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['r8sint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });

        // 16-bit formats
        lFormatCapabilitys.set('r16uint', {
            format: 'r16uint',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['r16uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('r16sint', {
            format: 'r16sint',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.SignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['r16sint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('r16float', {
            format: 'r16float',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['r16float'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rg8unorm', {
            format: 'rg8unorm',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['rg8unorm'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rg8snorm', {
            format: 'rg8snorm',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    compatible: ['rg8snorm'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rg8uint', {
            format: 'rg8uint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['rg8uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rg8sint', {
            format: 'rg8sint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.SignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['rg8sint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });

        // 32-bit formats
        lFormatCapabilitys.set('r32uint', {
            format: 'r32uint',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 4
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    compatible: ['r32uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: true
                }
            }
        });
        lFormatCapabilitys.set('r32sint', {
            format: 'r32sint',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 4
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.SignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    compatible: ['r32sint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: true
                }
            }
        });
        lFormatCapabilitys.set('r32float', {
            format: 'r32float',
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 4
            },
            dimensions: ['1d', '2d', '3d'],
            type: lFloat32Filterable,
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['r32float'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: true
                }
            }
        });
        lFormatCapabilitys.set('rg16uint', {
            format: 'rg16uint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['rg16uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rg16sint', {
            format: 'rg16sint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.SignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['rg16sint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rg16float', {
            format: 'rg16float',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['rg16float'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rgba8unorm', {
            format: 'rgba8unorm',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['rgba8unorm', 'rgba8unorm-srgb'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rgba8unorm-srgb', {
            format: 'rgba8unorm-srgb',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['rgba8unorm-srgb', 'rgba8unorm'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rgba8snorm', {
            format: 'rgba8snorm',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    compatible: ['rgba8snorm'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rgba8uint', {
            format: 'rgba8uint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['rgba8uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rgba8sint', {
            format: 'rgba8sint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.SignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['rgba8sint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('bgra8unorm', {
            format: 'bgra8unorm',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['bgra8unorm', 'bgra8unorm-srgb'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: this.mDevice.capabilities.hasFeature(GpuFeature.Bgra8unormStorage),
                    writeonly: false,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('bgra8unorm-srgb', {
            format: 'bgra8unorm-srgb',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['bgra8unorm-srgb', 'bgra8unorm'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });

        // Packed 32-bit formats
        lFormatCapabilitys.set('rgb9e5ufloat', {
            format: 'rgb9e5ufloat',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    compatible: ['rgb9e5ufloat'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rgb10a2uint', {
            format: 'rgb10a2uint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['rgb10a2uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rgb10a2unorm', {
            format: 'rgb10a2unorm',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['rgb10a2unorm'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('rg11b10ufloat', {
            format: 'rg11b10ufloat',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: this.mDevice.capabilities.hasFeature(GpuFeature.Rg11b10ufloatRenderable) ? {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                } : false,
                copy: {
                    compatible: ['rg11b10ufloat'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });

        // 64-bit formats
        lFormatCapabilitys.set('rg32uint', {
            format: 'rg32uint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 4
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    compatible: ['rg32uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rg32sint', {
            format: 'rg32sint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 4
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.SignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    compatible: ['rg32sint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rg32float', {
            format: 'rg32float',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 4
            },
            dimensions: ['1d', '2d', '3d'],
            type: lFloat32Filterable,
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    compatible: ['rg32float'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rgba16uint', {
            format: 'rgba16uint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['rgba16uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rgba16sint', {
            format: 'rgba16sint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.SignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['rgba16sint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rgba16float', {
            format: 'rgba16float',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    compatible: ['rgba16float'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });

        // 128-bit formats
        lFormatCapabilitys.set('rgba32uint', {
            format: 'rgba32uint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 4
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    compatible: ['rgba32uint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rgba32sint', {
            format: 'rgba32sint',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 4
            },
            dimensions: ['1d', '2d', '3d'],
            type: [TextureSampleType.SignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    compatible: ['rgba32sint'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        lFormatCapabilitys.set('rgba32float', {
            format: 'rgba32float',
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 4
            },
            dimensions: ['1d', '2d', '3d'],
            type: lFloat32Filterable,
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    compatible: ['rgba32float'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });

        // Depth/stencil formats
        lFormatCapabilitys.set('stencil8', {
            format: 'stencil8',
            aspect: {
                types: [TextureAspect.Stencil],
                byteCost: 1
            },
            dimensions: ['1d', '2d'],
            type: [TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['stencil8'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('depth16unorm', {
            format: 'depth16unorm',
            aspect: {
                types: [TextureAspect.Depth],
                byteCost: 2
            },
            dimensions: ['1d', '2d'],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['depth16unorm'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('depth24plus', {
            format: 'depth24plus',
            aspect: {
                types: [TextureAspect.Depth],
                byteCost: 4
            },
            dimensions: ['1d', '2d'],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['depth24plus'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: false,
                    imageDestination: false
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('depth24plusStencil8', {
            format: 'depth24plusStencil8',
            aspect: {
                types: [TextureAspect.Depth, TextureAspect.Stencil],
                byteCost: 2
            },
            dimensions: ['1d', '2d'],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat, TextureSampleType.UnsignedInteger],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['depth24plusStencil8'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: false, // Stencil supports image copy but depth does not.
                    imageDestination: false // Stencil supports image copy but depth does not.
                },
                storage: false
            }
        });
        lFormatCapabilitys.set('depth32float', {
            format: 'depth32float',
            aspect: {
                types: [TextureAspect.Depth],
                byteCost: 4
            },
            dimensions: ['1d', '2d'],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    compatible: ['depth32float'],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: false
                },
                storage: false
            }
        });

        // "depth32float-stencil8" feature
        if (this.mDevice.capabilities.hasFeature(GpuFeature.Depth32floatStencil8)) {
            lFormatCapabilitys.set('depth32floatStencil8', {
                format: 'depth32floatStencil8',
                aspect: {
                    types: [TextureAspect.Depth, TextureAspect.Stencil],
                    byteCost: 4
                },
                dimensions: ['1d', '2d'],
                type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat, TextureSampleType.UnsignedInteger],
                compressionBlock: { width: 1, height: 1 },
                usage: {
                    textureBinding: true,
                    renderAttachment: {
                        resolveTarget: false,
                        blendable: false,
                        multisample: true,
                    },
                    copy: {
                        compatible: ['depth32floatStencil8'],
                        textureSource: true,
                        textureDestination: true,
                        imageSource: true,
                        imageDestination: false
                    },
                    storage: false
                }
            });
        }

        // BC compressed formats
        if (this.mDevice.capabilities.hasFeature(GpuFeature.TextureCompressionBc)) {
            const lBcTextureFormatCapability = (pFormat: TextureFormat, pAspects: Array<TextureAspect>, pByteOfAspect: number, pCompatible: Array<TextureFormat>) => {
                const lFormat: TextureFormatCapabilityDefinition = {
                    format: pFormat,
                    aspect: {
                        types: pAspects,
                        byteCost: pByteOfAspect
                    },
                    dimensions: ['1d', '2d'],
                    type: [TextureSampleType.UnfilterableFloat, TextureSampleType.Float],
                    compressionBlock: { width: 4, height: 4 },
                    usage: {
                        textureBinding: true,
                        renderAttachment: false,
                        copy: {
                            compatible: [pFormat, ...pCompatible],
                            textureSource: true,
                            textureDestination: true,
                            imageSource: true,
                            imageDestination: true
                        },
                        storage: false
                    }
                };

                if (this.mDevice.capabilities.hasFeature(GpuFeature.TextureCompressionBcSliced3d)) {
                    lFormat.dimensions.push('3d');
                }

                return lFormat;
            };

            lFormatCapabilitys.set('bc1-rgba-unorm', lBcTextureFormatCapability('bc1-rgba-unorm', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2, ['bc1-rgba-unorm-srgb']));
            lFormatCapabilitys.set('bc1-rgba-unorm-srgb', lBcTextureFormatCapability('bc1-rgba-unorm-srgb', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2, ['bc1-rgba-unorm']));
            lFormatCapabilitys.set('bc2-rgba-unorm', lBcTextureFormatCapability('bc2-rgba-unorm', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, ['bc2-rgba-unorm-srgb']));
            lFormatCapabilitys.set('bc2-rgba-unorm-srgb', lBcTextureFormatCapability('bc2-rgba-unorm-srgb', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, ['bc2-rgba-unorm']));
            lFormatCapabilitys.set('bc3-rgba-unorm', lBcTextureFormatCapability('bc3-rgba-unorm', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, ['bc3-rgba-unorm-srgb']));
            lFormatCapabilitys.set('bc3-rgba-unorm-srgb', lBcTextureFormatCapability('bc3-rgba-unorm-srgb', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, ['bc3-rgba-unorm']));
            lFormatCapabilitys.set('bc4-r-unorm', lBcTextureFormatCapability('bc4-r-unorm', [TextureAspect.Red], 8, []));
            lFormatCapabilitys.set('bc4-r-snorm', lBcTextureFormatCapability('bc4-r-snorm', [TextureAspect.Red], 8, []));
            lFormatCapabilitys.set('bc5-rg-unorm', lBcTextureFormatCapability('bc5-rg-unorm', [TextureAspect.Red, TextureAspect.Green], 8, []));
            lFormatCapabilitys.set('bc5-rg-snorm', lBcTextureFormatCapability('bc5-rg-snorm', [TextureAspect.Red, TextureAspect.Green], 8, []));
            lFormatCapabilitys.set('bc6h-rgb-ufloat', lBcTextureFormatCapability('bc6h-rgb-ufloat', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 4, []));
            lFormatCapabilitys.set('bc6h-rgb-float', lBcTextureFormatCapability('bc6h-rgb-float', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 4, []));
            lFormatCapabilitys.set('bc7-rgba-unorm', lBcTextureFormatCapability('bc7-rgba-unorm', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, ['bc7-rgba-unorm-srgb']));
            lFormatCapabilitys.set('bc7-rgba-unorm-srgb', lBcTextureFormatCapability('bc7-rgba-unorm-srgb', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, ['bc7-rgba-unorm']));
        }

        // ETC2 compressed formats
        if (this.mDevice.capabilities.hasFeature(GpuFeature.TextureCompressionEtc2)) {
            const lEtc2TextureFormatCapability = (pFormat: TextureFormat, pAspects: Array<TextureAspect>, pByteOfAspect: number, pCompatible: Array<TextureFormat>) => {
                const lFormat: TextureFormatCapabilityDefinition = {
                    format: pFormat,
                    aspect: {
                        types: pAspects,
                        byteCost: pByteOfAspect
                    },
                    dimensions: ['1d', '2d'],
                    type: [TextureSampleType.UnfilterableFloat, TextureSampleType.Float],
                    compressionBlock: { width: 4, height: 4 },
                    usage: {
                        textureBinding: true,
                        renderAttachment: false,
                        copy: {
                            compatible: [pFormat, ...pCompatible],
                            textureSource: true,
                            textureDestination: true,
                            imageSource: true,
                            imageDestination: true
                        },
                        storage: false
                    }
                };

                return lFormat;
            };

            lFormatCapabilitys.set('etc2-rgb8unorm', lEtc2TextureFormatCapability('etc2-rgb8unorm', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 2, ['etc2-rgb8unorm-srgb']));
            lFormatCapabilitys.set('etc2-rgb8unorm-srgb', lEtc2TextureFormatCapability('etc2-rgb8unorm-srgb', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 2, ['etc2-rgb8unorm']));
            lFormatCapabilitys.set('etc2-rgb8a1unorm', lEtc2TextureFormatCapability('etc2-rgb8a1unorm', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2, ['etc2-rgb8a1unorm-srgb']));
            lFormatCapabilitys.set('etc2-rgb8a1unorm-srgb', lEtc2TextureFormatCapability('etc2-rgb8a1unorm-srgb', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2, ['etc2-rgb8a1unorm']));
            lFormatCapabilitys.set('etc2-rgba8unorm', lEtc2TextureFormatCapability('etc2-rgba8unorm', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, ['etc2-rgba8unorm-srgb']));
            lFormatCapabilitys.set('etc2-rgba8unorm-srgb', lEtc2TextureFormatCapability('etc2-rgba8unorm-srgb', [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, ['etc2-rgba8unorm']));
            lFormatCapabilitys.set('eac-r11unorm', lEtc2TextureFormatCapability('eac-r11unorm', [TextureAspect.Red], 8, []));
            lFormatCapabilitys.set('eac-r11snorm', lEtc2TextureFormatCapability('eac-r11snorm', [TextureAspect.Red], 8, []));
            lFormatCapabilitys.set('eac-rg11unorm', lEtc2TextureFormatCapability('eac-rg11unorm', [TextureAspect.Red, TextureAspect.Green], 8, []));
            lFormatCapabilitys.set('eac-rg11snorm', lEtc2TextureFormatCapability('eac-rg11snorm', [TextureAspect.Red, TextureAspect.Green], 8, []));
        }

        // ASTC compressed formats
        if (this.mDevice.capabilities.hasFeature(GpuFeature.TextureCompressionAstc)) {
            const lAstcTextureFormatCapability = (pFormat: TextureFormat, pCompressionLevel: [number, number], pCompatible: Array<TextureFormat>) => {
                const lFormat: TextureFormatCapabilityDefinition = {
                    format: pFormat,
                    aspect: {
                        types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                        byteCost: 4
                    },
                    dimensions: ['1d', '2d'],
                    type: [TextureSampleType.UnfilterableFloat, TextureSampleType.Float],
                    compressionBlock: {
                        width: pCompressionLevel[0],
                        height: pCompressionLevel[1]
                    },
                    usage: {
                        textureBinding: true,
                        renderAttachment: false,
                        copy: {
                            compatible: [pFormat, ...pCompatible],
                            textureSource: true,
                            textureDestination: true,
                            imageSource: true,
                            imageDestination: true
                        },
                        storage: false
                    }
                };

                return lFormat;
            };

            lFormatCapabilitys.set('astc-4x4-unorm', lAstcTextureFormatCapability('astc-4x4-unorm', [4, 4], ['astc-4x4-unorm-srgb']));
            lFormatCapabilitys.set('astc-4x4-unorm-srgb', lAstcTextureFormatCapability('astc-4x4-unorm-srgb', [4, 4], ['astc-4x4-unorm']));
            lFormatCapabilitys.set('astc-5x4-unorm', lAstcTextureFormatCapability('astc-5x4-unorm', [5, 4], ['astc-5x4-unorm-srgb']));
            lFormatCapabilitys.set('astc-5x4-unorm-srgb', lAstcTextureFormatCapability('astc-5x4-unorm-srgb', [5, 4], ['astc-5x4-unorm']));
            lFormatCapabilitys.set('astc-5x5-unorm', lAstcTextureFormatCapability('astc-5x5-unorm', [5, 5], ['astc-5x5-unorm-srgb']));
            lFormatCapabilitys.set('astc-5x5-unorm-srgb', lAstcTextureFormatCapability('astc-5x5-unorm-srgb', [5, 5], ['astc-5x5-unorm']));
            lFormatCapabilitys.set('astc-6x5-unorm', lAstcTextureFormatCapability('astc-6x5-unorm', [6, 5], ['astc-6x5-unorm-srgb']));
            lFormatCapabilitys.set('astc-6x5-unorm-srgb', lAstcTextureFormatCapability('astc-6x5-unorm-srgb', [6, 5], ['astc-6x5-unorm']));
            lFormatCapabilitys.set('astc-6x6-unorm', lAstcTextureFormatCapability('astc-6x6-unorm', [6, 6], ['astc-6x6-unorm-srgb']));
            lFormatCapabilitys.set('astc-6x6-unorm-srgb', lAstcTextureFormatCapability('astc-6x6-unorm-srgb', [6, 6], ['astc-6x6-unorm']));
            lFormatCapabilitys.set('astc-8x5-unorm', lAstcTextureFormatCapability('astc-8x5-unorm', [8, 5], ['astc-8x5-unorm-srgb']));
            lFormatCapabilitys.set('astc-8x5-unorm-srgb', lAstcTextureFormatCapability('astc-8x5-unorm-srgb', [8, 5], ['astc-8x5-unorm']));
            lFormatCapabilitys.set('astc-8x6-unorm', lAstcTextureFormatCapability('astc-8x6-unorm', [8, 6], ['astc-8x6-unorm-srgb']));
            lFormatCapabilitys.set('astc-8x6-unorm-srgb', lAstcTextureFormatCapability('astc-8x6-unorm-srgb', [8, 6], ['astc-8x6-unorm']));
            lFormatCapabilitys.set('astc-8x8-unorm', lAstcTextureFormatCapability('astc-8x8-unorm', [8, 8], ['astc-8x8-unorm-srgb']));
            lFormatCapabilitys.set('astc-8x8-unorm-srgb', lAstcTextureFormatCapability('astc-8x8-unorm-srgb', [8, 8], ['astc-8x8-unorm']));
            lFormatCapabilitys.set('astc-10x5-unorm', lAstcTextureFormatCapability('astc-10x5-unorm', [10, 5], ['astc-10x5-unorm-srgb']));
            lFormatCapabilitys.set('astc-10x5-unorm-srgb', lAstcTextureFormatCapability('astc-10x5-unorm-srgb', [10, 5], ['astc-10x5-unorm']));
            lFormatCapabilitys.set('astc-10x6-unorm', lAstcTextureFormatCapability('astc-10x6-unorm', [10, 6], ['astc-10x6-unorm-srgb']));
            lFormatCapabilitys.set('astc-10x6-unorm-srgb', lAstcTextureFormatCapability('astc-10x6-unorm-srgb', [10, 6], ['astc-10x6-unorm']));
            lFormatCapabilitys.set('astc-10x8-unorm', lAstcTextureFormatCapability('astc-10x8-unorm', [10, 8], ['astc-10x8-unorm-srgb']));
            lFormatCapabilitys.set('astc-10x8-unorm-srgb', lAstcTextureFormatCapability('astc-10x8-unorm-srgb', [10, 8], ['astc-10x8-unorm']));
            lFormatCapabilitys.set('astc-10x10-unorm', lAstcTextureFormatCapability('astc-10x10-unorm', [10, 10], ['astc-10x10-unorm-srgb']));
            lFormatCapabilitys.set('astc-10x10-unorm-srgb', lAstcTextureFormatCapability('astc-10x10-unorm-srgb', [10, 10], ['astc-10x10-unorm']));
            lFormatCapabilitys.set('astc-12x10-unorm', lAstcTextureFormatCapability('astc-12x10-unorm', [12, 10], ['astc-12x10-unorm-srgb']));
            lFormatCapabilitys.set('astc-12x10-unorm-srgb', lAstcTextureFormatCapability('astc-12x10-unorm-srgb', [12, 10], ['astc-12x10-unorm']));
            lFormatCapabilitys.set('astc-12x12-unorm', lAstcTextureFormatCapability('astc-12x12-unorm', [12, 12], ['astc-12x12-unorm-srgb']));
            lFormatCapabilitys.set('astc-12x12-unorm-srgb', lAstcTextureFormatCapability('astc-12x12-unorm-srgb', [12, 12], ['astc-12x12-unorm']));
        }

        return lFormatCapabilitys;
    }
}

export type TextureFormatCapability = {
    // Format.
    format: TextureFormat;

    // Copy compatible array: Same format or srgb-Prefix.
    copyCompatible: Set<TextureFormat>;

    // Usages.
    textureUsages: Set<TextureUsage>;

    // Usable dimensions. When multisample is used only 2d is allowed. 
    dimensions: Set<TextureDimension>;

    // All aspects for format.
    aspects: Set<TextureAspect>;

    // Usable sample types.
    sampleTypes: Set<TextureSampleType>,

    // Usage as render attachment.
    renderAttachment: {
        resolveTarget: boolean;
        multisample: boolean;
        blendable: boolean;
    };

    // Usages as storage.
    storage: {
        readonly: boolean;
        writeonly: boolean;
        readwrite: boolean;
    };

    // Usages as copy target or destination.
    copy: {
        textureSource: boolean;
        textureTarget: boolean;
        imageSource: boolean;
        imageTarget: boolean;
    };
};

type TextureFormatCapabilityDefinition = {
    // Format.
    format: TextureFormat;

    // Compression level. Higher level means higher compression.
    compressionBlock: {
        width: number;
        height: number;
    };

    // Aspects of texture. Only really relevant for depth and stencil textures.
    aspect: {
        types: Array<TextureAspect>;
        byteCost: number;
    };

    // Usable dimensions. When multisample is used only 2d is allowed. 
    dimensions: Array<TextureDimension>;

    // Primitive type that can be used in shaders.
    type: Array<TextureSampleType>;

    // Usages
    usage: {
        // Texture can be bound.
        textureBinding: boolean;

        // Texture can be renderd into
        renderAttachment: {
            resolveTarget: boolean;
            multisample: boolean;
            blendable: boolean;
        } | false;

        // Can be used to copy textures.
        copy: {
            // Copy compatible array: Same format or srgb-Prefix.
            compatible: Array<TextureFormat>;

            // Copy capabilities.
            textureSource: boolean;
            textureDestination: boolean;
            imageSource: boolean;
            imageDestination: boolean;
        } | false;

        // Can be used as a storage.
        storage: {
            readonly: boolean;
            writeonly: boolean;
            readwrite: boolean;
        } | false;
    };
};

export type GpuTextureFormatCapabilitiesFormatFilter = {
    // Single texture sample type that the format must support. Optional.
    sampleType?: TextureSampleType;

    // Exact byte cost per aspect. Optional.
    bytePerAspect?: number;

    // Exact array of texture aspects that the format must have. Optional.
    aspects?: Array<TextureAspect>;

    // Single texture dimension that the format must support. Optional.
    dimension?: TextureDimension;

    // Render attachment capability requirements. All properties are optional.
    renderAttachment?: {
        // Format must support blending if set.
        blendable?: boolean;

        // Format must support multisampling if set.
        multisample?: boolean;

        // Format must support resolve targets if set.
        resolveTarget?: boolean;
    };
};