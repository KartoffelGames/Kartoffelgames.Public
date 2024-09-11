import { Dictionary } from '@kartoffelgames/core';
import { TextureAspect } from '../../constant/texture-aspect.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureSampleType } from '../../constant/texture-sample-type.enum';
import { GpuFeature } from '../gpu/capabilities/gpu-feature.enum';
import { GpuDevice } from '../gpu/gpu-device';

export class TextureFormatValidator {
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
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
        this.mFormatCapabilitys.set(TextureFormat.R8snorm, {
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
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
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
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
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
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
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
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
            aspects: [TextureAspect.Red],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: lFloat32Filterable,
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: lFloat32Filterable,
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.Float, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: [TextureSampleType.SignedInteger],
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
            aspects: [TextureAspect.Red, TextureAspect.Green, TextureAspect.Blue, TextureAspect.Alpha],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray, TextureDimension.ThreeDimension],
            type: lFloat32Filterable,
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
            aspects: [TextureAspect.Stencil],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Depth],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Depth],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat],
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
            aspects: [TextureAspect.Depth, TextureAspect.Stencil],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat, TextureSampleType.UnsignedInteger],
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
            aspects: [TextureAspect.Depth],
            dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
            type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat],
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
        if(pDevice.capabilities.hasFeature(GpuFeature.Depth32floatStencil8)) {
            this.mFormatCapabilitys.set(TextureFormat.Depth32floatStencil8, {
                aspects: [TextureAspect.Depth, TextureAspect.Stencil],
                dimensions: [TextureDimension.OneDimension, TextureDimension.TwoDimension, TextureDimension.TwoDimensionArray, TextureDimension.Cube, TextureDimension.CubeArray],
                type: [TextureSampleType.Depth, TextureSampleType.UnfilterableFloat, TextureSampleType.UnsignedInteger],
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

        // TODO: Define anything.
    }

    /**
     * Find right format for used capability.
     */
    public formatSuggestion(pCapability: Partial<TextureFormatCapability>): TextureFormat {
        // TODO: Find right suggestion for parameters.
    }
}

type TextureFormatCapability = {
    // Aspects of texture. Only really relevant for depth and stencil textures.
    aspects: Array<TextureAspect>;

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