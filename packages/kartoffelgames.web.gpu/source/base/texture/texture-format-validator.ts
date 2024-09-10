import { Dictionary } from '@kartoffelgames/core';
import { TextureAspect } from '../../constant/texture-aspect.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureSampleType } from '../../constant/texture-sample-type.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuFeature } from '../gpu/capabilities/gpu-feature.enum';

export class TextureFormatValidator {
    private readonly mDevice: GpuDevice;
    private readonly mFormatCapabilitys: Dictionary<TextureFormat, TextureFormatCapability>;

    // TODO: https://www.w3.org/TR/webgpu/#texture-format-caps

    public constructor(pDevice: GpuDevice) {
        this.mDevice = pDevice;

        // Construct sample type for float32 texture types.
        const lFloat32Filterable: Array<TextureSampleType> = [TextureSampleType.UnfilterableFloat];
        if(this.mDevice.capabilities.hasFeature(GpuFeature.Float32Filterable)) {
            lFloat32Filterable.push(TextureSampleType.Float)
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
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
                    source: true,
                    target: true
                },
                storage: {
                    readonly: true,
                    writeonly: true,
                    readwrite: true
                }
            }
        });
        this.mFormatCapabilitys.set(TextureFormat.Rg16uint, {});
        this.mFormatCapabilitys.set(TextureFormat.Rg16sint, {});
        this.mFormatCapabilitys.set(TextureFormat.Rg16float, {});
        this.mFormatCapabilitys.set(TextureFormat.Rgba8unorm, {});
        this.mFormatCapabilitys.set(TextureFormat.Rgba8unormSrgb, {});
        this.mFormatCapabilitys.set(TextureFormat.Rgba8snorm, {});
        this.mFormatCapabilitys.set(TextureFormat.Rgba8uint, {});
        this.mFormatCapabilitys.set(TextureFormat.Rgba8sint, {});
        this.mFormatCapabilitys.set(TextureFormat.Bgra8unorm, {});
        this.mFormatCapabilitys.set(TextureFormat.Bgra8unormSrgb, {});

        // TODO: Define anything.
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

        // Can be used to copy data.
        copy: {
            source: boolean;
            target: boolean;
        } | false;

        // Can be used as a storage.
        storage: {
            readonly: boolean;
            writeonly: boolean;
            readwrite: boolean;
        } | false;
    };
};