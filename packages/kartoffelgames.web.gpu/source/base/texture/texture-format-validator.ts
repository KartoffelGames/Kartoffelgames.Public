import { Dictionary } from '@kartoffelgames/core';
import { TextureAspect } from '../../constant/texture-aspect.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';

export class TextureFormatValidator {
    private readonly mDevice: GpuDevice;
    private readonly mFormatCapabilitys: Dictionary<TextureFormat, TextureFormatCapability>;

    // TODO: https://www.w3.org/TR/webgpu/#texture-format-caps

    public constructor(pDevice: GpuDevice) {
        this.mDevice = pDevice;

        // Setup any format with its capabilities.
        this.mFormatCapabilitys = new Dictionary<TextureFormat, TextureFormatCapability>();
        // TODO: Define anything.
    }
}

type TextureFormatCapability = {
    // Aspects of texture. Only really relevant for depth and stencil textures.
    aspects: Array<TextureAspect>;

    // Usable dimensions. When multisample is used only 2d is allowed. 
    dimensions: Array<TextureDimension>;

    // Can be used to blend in a render pipeline.
    blendable: boolean;

    // Texture format can be multisampled.
    multisample: boolean;

    // Usages
    usage: {
        textureBinding: boolean;
        renderAttachment: {
            resolveTarget: boolean;
        } | null;
        copy: {
            source: boolean;
            target: boolean;
        } | null;
        storage: {
            readonly: boolean;
            writeonly: boolean;
            readwrite: boolean;
        } | null;
    };

    // Primitive type that can be used in shaders.
    primitive: {
        format: PrimitiveBufferFormat;
        multiplier: PrimitiveBufferMultiplier;
    };

    // Any replacement that hold the same primitive and usability.
    replacements: Array<TextureFormat>; // TODO: do we need this? Why not find it on the fly.
};