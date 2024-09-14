import { DeepPartial, Dictionary } from '@kartoffelgames/core';
import { TextureAspect } from '../../constant/texture-aspect.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureSampleType } from '../../constant/texture-sample-type.enum';
import { GpuFeature } from '../gpu/capabilities/gpu-feature.enum';
import { GpuDevice } from '../gpu/gpu-device';

export class TextureFormatCapabilities {
    private readonly mDevice: GpuDevice;
    private readonly mFormatCapabilitys: Dictionary<TextureFormat, TextureFormatCapability>;

    // TODO: https://www.w3.org/TR/webgpu/#texture-format-caps

    public constructor(pDevice: GpuDevice) {
        this.mDevice = pDevice;

        // Construct sample type for float32 texture types.
        const lFloat32Filterable: Array<TextureSampleType> = [TextureSampleType.UnfilterableFloat];
        if (this.mDevice.capabilities.hasFeature(GpuFeature.Float32Filterable)) {
            lFloat32Filterable.push(TextureSampleType.Float);
        }

        // Setup any format with its capabilities.
        this.mFormatCapabilitys = new Dictionary<TextureFormat, TextureFormatCapability>();

        // 8-bit formats
        this.mFormatCapabilitys.set(TextureFormat.R8unorm, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false,
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R8snorm, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R8uint, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R8sint, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });

        // 16-bit formats
        this.mFormatCapabilitys.set(TextureFormat.R16uint, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R16sint, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R16float, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg8unorm, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg8snorm, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg8uint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg8sint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });

        // 32-bit formats
        this.mFormatCapabilitys.set(TextureFormat.R32uint, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: true
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R32sint, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: true
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.R32float, {
            aspect: {
                types: [TextureAspect.Red],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: lFloat32Filterable,
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: true
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg16uint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg16sint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg16float, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba8unorm, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba8unormSrgb, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba8snorm, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba8uint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba8sint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Bgra8unorm, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: pDevice.capabilities.hasFeature(GpuFeature.Bgra8unormStorage),
                    writeonly: false,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Bgra8unormSrgb, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });

        // Packed 32-bit formats
        this.mFormatCapabilitys.set(TextureFormat.Rgb9e5ufloat, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 1,
            usage: {
                textureBinding: true,
                renderAttachment: false,
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgb10a2uint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgb10a2unorm, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg11b10ufloat, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: pDevice.capabilities.hasFeature(GpuFeature.Rg11b10ufloatRenderable) ? {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                } : false,
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });

        // 64-bit formats
        this.mFormatCapabilitys.set(TextureFormat.Rg32uint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg32sint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg32float, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: lFloat32Filterable,
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba16uint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba16sint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba16float, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: true,
                    blendable: true,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
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
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba32sint, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: false
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rgba32float, {
            aspect: {
                types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: lFloat32Filterable,
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: false,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
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
            aspect: {
                types: [TextureAspect.Stencil],
                byteCost: 1
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Depth16unorm, {
            aspect: {
                types: [TextureAspect.Depth],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: true
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Depth24plus, {
            aspect: {
                types: [TextureAspect.Depth],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: false,
                    imageTarget: false
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Depth24plusStencil8, {
            aspect: {
                types: [TextureAspect.Depth, TextureAspect.Stencil],
                byteCost: 2
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat, TextureSampleType.UnsignedInteger],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: false, // Stencil supports image copy but depth does not.
                    imageTarget: false // Stencil supports image copy but depth does not.
                },
                storage: false
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Depth32float, {
            aspect: {
                types: [TextureAspect.Depth],
                byteCost: 4
            },
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat],
            compressionLevel: 0,
            usage: {
                textureBinding: true,
                renderAttachment: {
                    resolveTarget: false,
                    blendable: false,
                    multisample: true,
                },
                copy: {
                    textureSource: true,
                    textureTarget: true,
                    imageSource: true,
                    imageTarget: false
                },
                storage: false
            }
        });

        // "depth32float-stencil8" feature
        if (pDevice.capabilities.hasFeature(GpuFeature.Depth32floatStencil8)) {
            this.mFormatCapabilitys.set(TextureFormat.Depth32floatStencil8, {
                aspect: {
                    types: [TextureAspect.Depth, TextureAspect.Stencil],
                    byteCost: 4
                },
                dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
                type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat, TextureSampleType.UnsignedInteger],
                compressionLevel: 0,
                usage: {
                    textureBinding: true,
                    renderAttachment: {
                        resolveTarget: false,
                        blendable: false,
                        multisample: true,
                    },
                    copy: {
                        textureSource: true,
                        textureTarget: true,
                        imageSource: true,
                        imageTarget: false
                    },
                    storage: false
                }
            });
        }

        // BC compressed formats
        if (pDevice.capabilities.hasFeature(GpuFeature.TextureCompressionBc)) {
            const lBcTextureFormatCapability = (pAspects: Array<TextureAspect>, pByteOfAspect: number) => {
                const lFormat: TextureFormatCapability = {
                    aspect: {
                        types: pAspects,
                        byteCost: pByteOfAspect
                    },
                    dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
                    type: [TextureSampleType.UnfilterableFloat, TextureSampleType.Float],
                    compressionLevel: 16,
                    usage: {
                        textureBinding: true,
                        renderAttachment: false,
                        copy: {
                            textureSource: true,
                            textureTarget: true,
                            imageSource: true,
                            imageTarget: true
                        },
                        storage: false
                    }
                };

                if (pDevice.capabilities.hasFeature(GpuFeature.TextureCompressionBcSliced3d)) {
                    lFormat.dimensions.push(TextureDimension.ThreeDimension);
                }

                return lFormat;
            };

            this.mFormatCapabilitys.set(TextureFormat.Bc1RgbaUnorm, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2));
            this.mFormatCapabilitys.set(TextureFormat.Bc1RgbaUnormSrgb, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2));
            this.mFormatCapabilitys.set(TextureFormat.Bc2RgbaUnorm, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4));
            this.mFormatCapabilitys.set(TextureFormat.Bc2RgbaUnormSrgb, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4));
            this.mFormatCapabilitys.set(TextureFormat.Bc3RgbaUnorm, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4));
            this.mFormatCapabilitys.set(TextureFormat.Bc3RgbaUnormSrgb, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4));
            this.mFormatCapabilitys.set(TextureFormat.Bc4Runorm, lBcTextureFormatCapability([TextureAspect.Red], 8));
            this.mFormatCapabilitys.set(TextureFormat.Bc4Rsnorm, lBcTextureFormatCapability([TextureAspect.Red], 8));
            this.mFormatCapabilitys.set(TextureFormat.Bc5RgUnorm, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green], 8));
            this.mFormatCapabilitys.set(TextureFormat.Bc5RgSnorm, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green], 8));
            this.mFormatCapabilitys.set(TextureFormat.Bc6hRgbUfloat, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 4));
            this.mFormatCapabilitys.set(TextureFormat.Bc6hRgbFloat, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 4));
            this.mFormatCapabilitys.set(TextureFormat.Bc7RgbaUnorm, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4));
            this.mFormatCapabilitys.set(TextureFormat.Bc7RgbaUnormSrgb, lBcTextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4));
        }

        // ETC2 compressed formats
        if (pDevice.capabilities.hasFeature(GpuFeature.TextureCompressionEtc2)) {
            const lEtc2TextureFormatCapability = (pAspects: Array<TextureAspect>, pByteOfAspect: number) => {
                const lFormat: TextureFormatCapability = {
                    aspect: {
                        types: pAspects,
                        byteCost: pByteOfAspect
                    },
                    dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
                    type: [TextureSampleType.UnfilterableFloat, TextureSampleType.Float],
                    compressionLevel: 16,
                    usage: {
                        textureBinding: true,
                        renderAttachment: false,
                        copy: {
                            textureSource: true,
                            textureTarget: true,
                            imageSource: true,
                            imageTarget: true
                        },
                        storage: false
                    }
                };

                return lFormat;
            };

            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgb8unorm, lEtc2TextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 2));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgb8unormSrgb, lEtc2TextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue], 2));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgb8a1unorm, lEtc2TextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgb8a1unormSrgb, lEtc2TextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 2));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgba8unorm, lEtc2TextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4));
            this.mFormatCapabilitys.set(TextureFormat.Etc2Rgba8unormSrgb, lEtc2TextureFormatCapability([TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha], 4));
            this.mFormatCapabilitys.set(TextureFormat.EacR11unorm, lEtc2TextureFormatCapability([TextureAspect.Red], 8));
            this.mFormatCapabilitys.set(TextureFormat.EacR11snorm, lEtc2TextureFormatCapability([TextureAspect.Red], 8));
            this.mFormatCapabilitys.set(TextureFormat.EacRg11unorm, lEtc2TextureFormatCapability([TextureAspect.Red, TextureAspect.Green], 8));
            this.mFormatCapabilitys.set(TextureFormat.EacRg11snorm, lEtc2TextureFormatCapability([TextureAspect.Red, TextureAspect.Green], 8));
        }

        // ASTC compressed formats
        if (pDevice.capabilities.hasFeature(GpuFeature.TextureCompressionAstc)) {
            const lAstcTextureFormatCapability = (pCompressionLevel: number) => {
                const lFormat: TextureFormatCapability = {
                    aspect: {
                        types: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
                        byteCost: 4
                    },
                    dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
                    type: [TextureSampleType.UnfilterableFloat, TextureSampleType.Float],
                    compressionLevel: pCompressionLevel,
                    usage: {
                        textureBinding: true,
                        renderAttachment: false,
                        copy: {
                            textureSource: true,
                            textureTarget: true,
                            imageSource: true,
                            imageTarget: true
                        },
                        storage: false
                    }
                };

                return lFormat;
            };

            this.mFormatCapabilitys.set(TextureFormat.Astc4x4unorm, lAstcTextureFormatCapability(16));
            this.mFormatCapabilitys.set(TextureFormat.Astc4x4unormSrgb, lAstcTextureFormatCapability(16));
            this.mFormatCapabilitys.set(TextureFormat.Astc5x4unorm, lAstcTextureFormatCapability(20));
            this.mFormatCapabilitys.set(TextureFormat.Astc5x4unormSrgb, lAstcTextureFormatCapability(20));
            this.mFormatCapabilitys.set(TextureFormat.Astc5x5unorm, lAstcTextureFormatCapability(25));
            this.mFormatCapabilitys.set(TextureFormat.Astc5x5unormSrgb, lAstcTextureFormatCapability(25));
            this.mFormatCapabilitys.set(TextureFormat.Astc6x5unorm, lAstcTextureFormatCapability(30));
            this.mFormatCapabilitys.set(TextureFormat.Astc6x5unormSrgb, lAstcTextureFormatCapability(330));
            this.mFormatCapabilitys.set(TextureFormat.Astc6x6unorm, lAstcTextureFormatCapability(36));
            this.mFormatCapabilitys.set(TextureFormat.Astc6x6unormSrgb, lAstcTextureFormatCapability(36));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x5unorm, lAstcTextureFormatCapability(40));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x5unormSrgb, lAstcTextureFormatCapability(40));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x6unorm, lAstcTextureFormatCapability(48));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x6unormSrgb, lAstcTextureFormatCapability(48));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x8unorm, lAstcTextureFormatCapability(64));
            this.mFormatCapabilitys.set(TextureFormat.Astc8x8unormSrgb, lAstcTextureFormatCapability(64));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x5unorm, lAstcTextureFormatCapability(50));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x5unormSrgb, lAstcTextureFormatCapability(50));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x6unorm, lAstcTextureFormatCapability(60));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x6unormSrgb, lAstcTextureFormatCapability(60));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x8unorm, lAstcTextureFormatCapability(80));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x8unormSrgb, lAstcTextureFormatCapability(80));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x10unorm, lAstcTextureFormatCapability(100));
            this.mFormatCapabilitys.set(TextureFormat.Astc10x10unormSrgb, lAstcTextureFormatCapability(100));
            this.mFormatCapabilitys.set(TextureFormat.Astc12x10unorm, lAstcTextureFormatCapability(120));
            this.mFormatCapabilitys.set(TextureFormat.Astc12x10unormSrgb, lAstcTextureFormatCapability(120));
            this.mFormatCapabilitys.set(TextureFormat.Astc12x12unorm, lAstcTextureFormatCapability(144));
            this.mFormatCapabilitys.set(TextureFormat.Astc12x12unormSrgb, lAstcTextureFormatCapability(144));
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
        return this.mFormatCapabilitys.get(pFormat)!;
    }

    /**
     * Find right format for used capability.
     */
    public formatSuggestion(pCapability: DeepPartial<TextureFormatCapability>): Array<TextureFormat> {
        // TODO: Find right suggestion for parameters.
    }
}

export type TextureFormatCapability = {
    // Compression level. Higher level means higher compression.
    compressionLevel: number;

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
            textureSource: boolean;
            textureTarget: boolean;
            imageSource: boolean;
            imageTarget: boolean;
        } | false;

        // Can be used as a storage.
        storage: {
            readonly: boolean;
            writeonly: boolean;
            readwrite: boolean;
        } | false;
    };
};