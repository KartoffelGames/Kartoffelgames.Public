import { Dictionary } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu/gpu-device';
import { TextureFormat } from '../../constant/texture-format.enum';

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

type TextureFormatCapability = { // TODO:
    renderAttachable: boolean;
    blendable: boolean;
    multisampleable: boolean;
    resolveTarget: boolean;
};