import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuFeature } from '../../constant/gpu-feature.enum.ts';
import { TextureAspect } from '../../constant/texture-aspect.enum.ts';
import { TextureDimension } from '../../constant/texture-dimension.enum.ts';
import { TextureFormat } from '../../constant/texture-format.enum.ts';
import { TextureSampleType } from '../../constant/texture-sample-type.enum.ts';
import { TextureUsage } from '../../constant/texture-usage.enum.ts';
import { GpuDevice } from '../gpu-device.ts';

export class GpuTextureFormatCapabilities {
    private readonly mDevice: GpuDevice;
    private readonly mFormatCapabilitys: Dictionary<TextureFormat, TextureFormatCapabilityDefinition>;

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

        // Construct sample type for float32 texture types.
        const lFloat32Filterable: Array<TextureSampleType> = [TextureSampleType.UnfilterableFloat];
        if (this.mDevice.capabilities.hasFeature(GpuFeature.Float32Filterable)) {
            lFloat32Filterable.push(TextureSampleType.Float);
        }

        // Setup any format with its capabilities.
        this.mFormatCapabilitys = new Dictionary<TextureFormat, TextureFormatCapabilityDefinition>();

        // 8-bit formats
        this.mFormatCapabilitys.set(TextureFormat.R8unorm, {
            format: TextureFormat.R8unorm,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.R8unorm],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false,
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R8snorm, {
            format: TextureFormat.R8snorm,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    compatible: [TextureFormat.R8snorm],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R8uint, {
            format: TextureFormat.R8uint,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.R8uint],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R8sint, {
            format: TextureFormat.R8sint,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.R8sint],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });

        // 16-bit formats
        this.mFormatCapabilitys.set(TextureFormat.R16uint, {
            format: TextureFormat.R16uint,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.R16uint],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R16sint, {
            format: TextureFormat.R16sint,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.R16sint],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R16float, {
            format: TextureFormat.R16float,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.R16float],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg8unorm, {
            format: TextureFormat.Rg8unorm,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rg8unorm],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg8snorm, {
            format: TextureFormat.Rg8snorm,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    compatible: [TextureFormat.Rg8snorm],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg8uint, {
            format: TextureFormat.Rg8uint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rg8uint],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg8sint, {
            format: TextureFormat.Rg8sint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rg8sint],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });

        // 32-bit formats
        this.mFormatCapabilitys.set(TextureFormat.R32uint, {
            format: TextureFormat.R32uint,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.R32uint],
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
        this.mFormatCapabilitys.set(TextureFormat.R32sint, {
            format: TextureFormat.R32sint,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.R32sint],
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
        this.mFormatCapabilitys.set(TextureFormat.R32float, {
            format: TextureFormat.R32float,
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.R32float],
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
        this.mFormatCapabilitys.set(TextureFormat.Rg16uint, {
            format: TextureFormat.Rg16uint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rg16uint],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg16sint, {
            format: TextureFormat.Rg16sint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rg16sint],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg16float, {
            format: TextureFormat.Rg16float,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rg16float],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba8unorm, {
            format: TextureFormat.Rgba8unorm,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba8unorm, TextureFormat.Rgba8unormSrgb],
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
        this.mFormatCapabilitys.set(TextureFormat.Rgba8unormSrgb, {
            format: TextureFormat.Rgba8unormSrgb,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba8unormSrgb, TextureFormat.Rgba8unorm],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba8snorm, {
            format: TextureFormat.Rgba8snorm,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    compatible: [TextureFormat.Rgba8snorm],
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
        this.mFormatCapabilitys.set(TextureFormat.Rgba8uint, {
            format: TextureFormat.Rgba8uint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba8uint],
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
        this.mFormatCapabilitys.set(TextureFormat.Rgba8sint, {
            format: TextureFormat.Rgba8sint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba8sint],
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
        this.mFormatCapabilitys.set(TextureFormat.Bgra8unorm, {
            format: TextureFormat.Bgra8unorm,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Bgra8unorm, TextureFormat.Bgra8unormSrgb],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: {
                    readonly: pDevice.capabilities.hasFeature(GpuFeature.Bgra8unormStorage),
                    writeonly: false,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Bgra8unormSrgb, {
            format: TextureFormat.Bgra8unormSrgb,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Bgra8unormSrgb, TextureFormat.Bgra8unorm],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });

        // Packed 32-bit formats
        this.mFormatCapabilitys.set(TextureFormat.Rgb9e5ufloat, {
            format: TextureFormat.Rgb9e5ufloat,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    compatible: [TextureFormat.Rgb9e5ufloat],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgb10a2uint, {
            format: TextureFormat.Rgb10a2uint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgb10a2uint],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgb10a2unorm, {
            format: TextureFormat.Rgb10a2unorm,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgb10a2unorm],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg11b10ufloat, {
            format: TextureFormat.Rg11b10ufloat,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionBlock: { width: 1, height: 1 },
            usage: {
                textureBinding: true,
                renderAttachment: pDevice.capabilities.hasFeature(GpuFeature.Rg11b10ufloatRenderable) ? {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                } : false,
                copy: {
                    compatible: [TextureFormat.Rg11b10ufloat],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });

        // 64-bit formats
        this.mFormatCapabilitys.set(TextureFormat.Rg32uint, {
            format: TextureFormat.Rg32uint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rg32uint],
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
        this.mFormatCapabilitys.set(TextureFormat.Rg32sint, {
            format: TextureFormat.Rg32sint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rg32sint],
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
        this.mFormatCapabilitys.set(TextureFormat.Rg32float, {
            format: TextureFormat.Rg32float,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rg32float],
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
        this.mFormatCapabilitys.set(TextureFormat.Rgba16uint, {
            format: TextureFormat.Rgba16uint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba16uint],
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
        this.mFormatCapabilitys.set(TextureFormat.Rgba16sint, {
            format: TextureFormat.Rgba16sint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba16sint],
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
        this.mFormatCapabilitys.set(TextureFormat.Rgba16float, {
            format: TextureFormat.Rgba16float,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba16float],
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
        this.mFormatCapabilitys.set(TextureFormat.Rgba32uint, {
            format: TextureFormat.Rgba32uint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba32uint],
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
        this.mFormatCapabilitys.set(TextureFormat.Rgba32sint, {
            format: TextureFormat.Rgba32sint,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba32sint],
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
        this.mFormatCapabilitys.set(TextureFormat.Rgba32float, {
            format: TextureFormat.Rgba32float,
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.ThreeDimension],
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
                    compatible: [TextureFormat.Rgba32float],
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
        this.mFormatCapabilitys.set(TextureFormat.Stencil8, {
            format: TextureFormat.Stencil8,
            aspect: {
                types: [TextureAspect.Stencil],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension],
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
                    compatible: [TextureFormat.Stencil8],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Depth16unorm, {
            format: TextureFormat.Depth16unorm,
            aspect: {
                types: [TextureAspect.Depth],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension],
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
                    compatible: [TextureFormat.Depth16unorm],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Depth24plus, {
            format: TextureFormat.Depth24plus,
            aspect: {
                types: [TextureAspect.Depth],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension],
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
                    compatible: [TextureFormat.Depth24plus],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: false,
                    imageDestination: false
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Depth24plusStencil8, {
            format: TextureFormat.Depth24plusStencil8,
            aspect: {
                types: [TextureAspect.Depth, TextureAspect.Stencil],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension],
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
                    compatible: [TextureFormat.Depth24plusStencil8],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: false, // Stencil supports image copy but depth does not.
                    imageDestination: false // Stencil supports image copy but depth does not.
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Depth32float, {
            format: TextureFormat.Depth32float,
            aspect: {
                types: [TextureAspect.Depth],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension],
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
                    compatible: [TextureFormat.Depth32float],
                    textureSource: true,
                    textureDestination: true,
                    imageSource: true,
                    imageDestination: false
                },
                storage: false
            }
        });

        // "depth32float-stencil8" feature
        if (pDevice.capabilities.hasFeature(GpuFeature.Depth32floatStencil8)) {
            this.mFormatCapabilitys.set(TextureFormat.Depth32floatStencil8, {
                format: TextureFormat.Depth32floatStencil8,
                aspect: {
                    types: [TextureAspect.Depth, TextureAspect.Stencil],
                    byteCost: 4
                },
                dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension],
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
                        compatible: [TextureFormat.Depth32floatStencil8],
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
        if (pDevice.capabilities.hasFeature(GpuFeature.TextureCompressionBc)) {
            const lBcTextureFormatCapability = (pFormat: TextureFormat, pAspects: Array<TextureAspect>, pByteOfAspect: number, pCompatible: Array<TextureFormat>) => {
                const lFormat: TextureFormatCapabilityDefinition = {
                    format: pFormat,
                    aspect: {
                        types: pAspects,
                        byteCost: pByteOfAspect
                    },
                    dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension],
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

                if (pDevice.capabilities.hasFeature(GpuFeature.TextureCompressionBcSliced3d)) {
                    lFormat.dimensions.push(TextureDimension.ThreeDimension);
                }

                return lFormat;
            };

            this.mFormatCapabilitys.set(TextureFormat.Bc1RgbaUnorm, lBcTextureFormatCapability(TextureFormat.Bc1RgbaUnorm, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2, [TextureFormat.Bc1RgbaUnormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Bc1RgbaUnormSrgb, lBcTextureFormatCapability(TextureFormat.Bc1RgbaUnormSrgb, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2, [TextureFormat.Bc1RgbaUnorm]));
            this.mFormatCapabilitys.set(TextureFormat.Bc2RgbaUnorm, lBcTextureFormatCapability(TextureFormat.Bc2RgbaUnorm, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, [TextureFormat.Bc2RgbaUnormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Bc2RgbaUnormSrgb, lBcTextureFormatCapability(TextureFormat.Bc2RgbaUnormSrgb, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, [TextureFormat.Bc2RgbaUnorm]));
            this.mFormatCapabilitys.set(TextureFormat.Bc3RgbaUnorm, lBcTextureFormatCapability(TextureFormat.Bc3RgbaUnorm, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, [TextureFormat.Bc3RgbaUnormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Bc3RgbaUnormSrgb, lBcTextureFormatCapability(TextureFormat.Bc3RgbaUnormSrgb, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, [TextureFormat.Bc3RgbaUnorm]));
            this.mFormatCapabilitys.set(TextureFormat.Bc4Runorm, lBcTextureFormatCapability(TextureFormat.Bc4Runorm, [TextureAspect.Red], 8, []));
            this.mFormatCapabilitys.set(TextureFormat.Bc4Rsnorm, lBcTextureFormatCapability(TextureFormat.Bc4Rsnorm, [TextureAspect.Red], 8, []));
            this.mFormatCapabilitys.set(TextureFormat.Bc5RgUnorm, lBcTextureFormatCapability(TextureFormat.Bc5RgUnorm, [TextureAspect.Red, TextureAspect.Green], 8, []));
            this.mFormatCapabilitys.set(TextureFormat.Bc5RgSnorm, lBcTextureFormatCapability(TextureFormat.Bc5RgSnorm, [TextureAspect.Red, TextureAspect.Green], 8, []));
            this.mFormatCapabilitys.set(TextureFormat.Bc6hRgbUfloat, lBcTextureFormatCapability(TextureFormat.Bc6hRgbUfloat, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 4, []));
            this.mFormatCapabilitys.set(TextureFormat.Bc6hRgbFloat, lBcTextureFormatCapability(TextureFormat.Bc6hRgbFloat, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 4, []));
            this.mFormatCapabilitys.set(TextureFormat.Bc7RgbaUnorm, lBcTextureFormatCapability(TextureFormat.Bc7RgbaUnorm, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, [TextureFormat.Bc7RgbaUnormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Bc7RgbaUnormSrgb, lBcTextureFormatCapability(TextureFormat.Bc7RgbaUnormSrgb, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, [TextureFormat.Bc7RgbaUnorm]));
        }

        // ETC2 compressed formats
        if (pDevice.capabilities.hasFeature(GpuFeature.TextureCompressionEtc2)) {
            const lEtc2TextureFormatCapability = (pFormat: TextureFormat, pAspects: Array<TextureAspect>, pByteOfAspect: number, pCompatible: Array<TextureFormat>) => {
                const lFormat: TextureFormatCapabilityDefinition = {
                    format: pFormat,
                    aspect: {
                        types: pAspects,
                        byteCost: pByteOfAspect
                    },
                    dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension],
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

            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgb8unorm, lEtc2TextureFormatCapability(TextureFormat.Etc2Rgb8unorm, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 2, [TextureFormat.Etc2Rgb8unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgb8unormSrgb, lEtc2TextureFormatCapability(TextureFormat.Etc2Rgb8unormSrgb, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 2, [TextureFormat.Etc2Rgb8unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgb8a1unorm, lEtc2TextureFormatCapability(TextureFormat.Etc2Rgb8a1unorm, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2, [TextureFormat.Etc2Rgb8a1unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgb8a1unormSrgb, lEtc2TextureFormatCapability(TextureFormat.Etc2Rgb8a1unormSrgb, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2, [TextureFormat.Etc2Rgb8a1unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgba8unorm, lEtc2TextureFormatCapability(TextureFormat.Etc2Rgba8unorm, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, [TextureFormat.Etc2Rgba8unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgba8unormSrgb, lEtc2TextureFormatCapability(TextureFormat.Etc2Rgba8unormSrgb, [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4, [TextureFormat.Etc2Rgba8unorm]));
            this.mFormatCapabilitys.set(TextureFormat.EacR11unorm, lEtc2TextureFormatCapability(TextureFormat.EacR11unorm, [TextureAspect.Red], 8, []));
            this.mFormatCapabilitys.set(TextureFormat.EacR11snorm, lEtc2TextureFormatCapability(TextureFormat.EacR11snorm, [TextureAspect.Red], 8, []));
            this.mFormatCapabilitys.set(TextureFormat.EacRg11unorm, lEtc2TextureFormatCapability(TextureFormat.EacRg11unorm, [TextureAspect.Red, TextureAspect.Green], 8, []));
            this.mFormatCapabilitys.set(TextureFormat.EacRg11snorm, lEtc2TextureFormatCapability(TextureFormat.EacRg11snorm, [TextureAspect.Red, TextureAspect.Green], 8, []));
        }

        // ASTC compressed formats
        if (pDevice.capabilities.hasFeature(GpuFeature.TextureCompressionAstc)) {
            const lAstcTextureFormatCapability = (pFormat: TextureFormat, pCompressionLevel: [number, number], pCompatible: Array<TextureFormat>) => {
                const lFormat: TextureFormatCapabilityDefinition = {
                    format: pFormat,
                    aspect: {
                        types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                        byteCost: 4
                    },
                    dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension],
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

            this.mFormatCapabilitys.set(TextureFormat.Astc4x4unorm, lAstcTextureFormatCapability(TextureFormat.Astc4x4unorm, [4, 4], [TextureFormat.Astc4x4unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc4x4unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc4x4unormSrgb, [4, 4], [TextureFormat.Astc4x4unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc5x4unorm, lAstcTextureFormatCapability(TextureFormat.Astc5x4unorm, [5, 4], [TextureFormat.Astc5x4unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc5x4unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc5x4unormSrgb, [5, 4], [TextureFormat.Astc5x4unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc5x5unorm, lAstcTextureFormatCapability(TextureFormat.Astc5x5unorm, [5, 5], [TextureFormat.Astc5x5unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc5x5unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc5x5unormSrgb, [5, 5], [TextureFormat.Astc5x5unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc6x5unorm, lAstcTextureFormatCapability(TextureFormat.Astc6x5unorm, [6, 5], [TextureFormat.Astc6x5unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc6x5unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc6x5unormSrgb, [6, 5], [TextureFormat.Astc6x5unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc6x6unorm, lAstcTextureFormatCapability(TextureFormat.Astc6x6unorm, [6, 6], [TextureFormat.Astc6x6unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc6x6unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc6x6unormSrgb, [6, 6], [TextureFormat.Astc6x6unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x5unorm, lAstcTextureFormatCapability(TextureFormat.Astc8x5unorm, [8, 5], [TextureFormat.Astc8x5unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x5unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc8x5unormSrgb, [8, 5], [TextureFormat.Astc8x5unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x6unorm, lAstcTextureFormatCapability(TextureFormat.Astc8x6unorm, [8, 6], [TextureFormat.Astc8x6unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x6unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc8x6unormSrgb, [8, 6], [TextureFormat.Astc8x6unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x8unorm, lAstcTextureFormatCapability(TextureFormat.Astc8x8unorm, [8, 8], [TextureFormat.Astc8x8unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x8unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc8x8unormSrgb, [8, 8], [TextureFormat.Astc8x8unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x5unorm, lAstcTextureFormatCapability(TextureFormat.Astc10x5unorm, [10, 5], [TextureFormat.Astc10x5unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x5unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc10x5unormSrgb, [10, 5], [TextureFormat.Astc10x5unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x6unorm, lAstcTextureFormatCapability(TextureFormat.Astc10x6unorm, [10, 6], [TextureFormat.Astc10x6unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x6unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc10x6unormSrgb, [10, 6], [TextureFormat.Astc10x6unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x8unorm, lAstcTextureFormatCapability(TextureFormat.Astc10x8unorm, [10, 8], [TextureFormat.Astc10x8unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x8unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc10x8unormSrgb, [10, 8], [TextureFormat.Astc10x8unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x10unorm, lAstcTextureFormatCapability(TextureFormat.Astc10x10unorm, [10, 10], [TextureFormat.Astc10x10unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x10unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc10x10unormSrgb, [10, 10], [TextureFormat.Astc10x10unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc12x10unorm, lAstcTextureFormatCapability(TextureFormat.Astc12x10unorm, [12, 10], [TextureFormat.Astc12x10unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc12x10unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc12x10unormSrgb, [12, 10], [TextureFormat.Astc12x10unorm]));
            this.mFormatCapabilitys.set(TextureFormat.Astc12x12unorm, lAstcTextureFormatCapability(TextureFormat.Astc12x12unorm, [12, 12], [TextureFormat.Astc12x12unormSrgb]));
            this.mFormatCapabilitys.set(TextureFormat.Astc12x12unormSrgb, lAstcTextureFormatCapability(TextureFormat.Astc12x12unormSrgb, [12, 12], [TextureFormat.Astc12x12unorm]));
        }

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
            throw new Exception(`Format "${pFormat}" has no capabilities.`, this);
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

        // All sample types and primary filterable.
        const lSampleTypes: [Set<TextureSampleType>, TextureSampleType] = (() => {
            const lAllSampleTypes: Set<TextureSampleType> = new Set<TextureSampleType>(lCapabilityDefinition.type);
            if (lAllSampleTypes.has(TextureSampleType.Float)) {
                return [lAllSampleTypes, TextureSampleType.Float];
            }
            if (lAllSampleTypes.has(TextureSampleType.UnsignedInteger)) {
                return [lAllSampleTypes, TextureSampleType.UnsignedInteger];
            }
            if (lAllSampleTypes.has(TextureSampleType.SignedInteger)) {
                return [lAllSampleTypes, TextureSampleType.SignedInteger];
            }
            if (lAllSampleTypes.has(TextureSampleType.SignedInteger)) {
                return [lAllSampleTypes, TextureSampleType.SignedInteger];
            }
            if (lAllSampleTypes.has(TextureSampleType.Depth)) {
                return [lAllSampleTypes, TextureSampleType.Depth];
            }

            // Default
            return [lAllSampleTypes, TextureSampleType.UnfilterableFloat];
        })();

        return {
            format: lCapabilityDefinition.format,
            copyCompatible: new Set<TextureFormat>((lCapabilityDefinition.usage.copy) ? lCapabilityDefinition.usage.copy.compatible : []),
            textureUsages: lTextureUsages,
            dimensions: new Set<TextureDimension>(lCapabilityDefinition.dimensions),
            aspects: new Set<TextureAspect>(lCapabilityDefinition.aspect.types),
            sampleTypes: {
                primary: lSampleTypes[1],
                all: lSampleTypes[0]
            },
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
    sampleTypes: {
        primary: TextureSampleType,
        all: Set<TextureSampleType>;
    },

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