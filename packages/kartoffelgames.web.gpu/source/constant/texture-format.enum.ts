export enum TextureFormat {
    // 8-bit formats
    R8unorm = 'r8unorm',
    R8snorm = 'r8snorm',
    R8uint = 'r8uint',
    R8sint = 'r8sint',

    // 16-bit formats
    R16uint = 'r16uint',
    R16sint = 'r16sint',
    R16float = 'r16float',
    Rg8unorm = 'rg8unorm',
    Rg8snorm = 'rg8snorm',
    Rg8uint = 'rg8uint',
    Rg8sint = 'rg8sint',

    // 32-bit formats
    R32uint = 'r32uint',
    R32sint = 'r32sint',
    R32float = 'r32float',
    Rg16uint = 'rg16uint',
    Rg16sint = 'rg16sint',
    Rg16float = 'rg16float',
    Rgba8unorm = 'rgba8unorm',
    Rgba8unormSrgb = 'rgba8unorm-srgb',
    Rgba8snorm = 'rgba8snorm',
    Rgba8uint = 'rgba8uint',
    Rgba8sint = 'rgba8sint',
    Bgra8unorm = 'bgra8unorm',
    Bgra8unormSrgb = 'bgra8unorm-srgb',

    // Packed 32-bit formats
    Rgb9e5ufloat = 'rgb9e5ufloat',
    Rgb10a2uint = 'rgb10a2uint',
    Rgb10a2unorm = 'rgb10a2unorm',
    Rg11b10ufloat = 'rg11b10ufloat',

    // 64-bit formats
    Rg32uint = 'rg32uint',
    Rg32sint = 'rg32sint',
    Rg32float = 'rg32float',
    Rgba16uint = 'rgba16uint',
    Rgba16sint = 'rgba16sint',
    Rgba16float = 'rgba16float',

    // 128-bit formats
    Rgba32uint = 'rgba32uint',
    Rgba32sint = 'rgba32sint',
    Rgba32float = 'rgba32float',

    // Depth/stencil formats
    Stencil8 = 'stencil8',
    Depth16unorm = 'depth16unorm',
    Depth24plus = 'depth24plus',
    Depth24plusStencil8 = 'depth24plusStencil8',
    Depth32float = 'depth32float',

    // "depth32float-stencil8" feature
    Depth32floatStencil8 = 'depth32floatStencil8',

    // BC compressed formats usable if "texture-compression-bc" is both
    // supported by the device/user agent and enabled in requestDevice.
    Bc1RgbaUnorm = 'bc1-rgba-unorm',
    Bc1RgbaUnormSrgb = 'bc1-rgba-unorm-srgb',
    Bc2RgbaUnorm = 'bc2-rgba-unorm',
    Bc2RgbaUnormSrgb = 'bc2-rgba-unorm-srgb',
    Bc3RgbaUnorm = 'bc3-rgba-unorm',
    Bc3RgbaUnormSrgb = 'bc3-rgba-unorm-srgb',
    Bc4Runorm = 'bc4-r-unorm',
    Bc4Rsnorm = 'bc4-r-snorm',
    Bc5RgUnorm = 'bc5-rg-unorm',
    Bc5RgSnorm = 'bc5-rg-snorm',
    Bc6hRgbUfloat = 'bc6h-rgb-ufloat',
    Bc6hRgbFloat = 'bc6h-rgb-float',
    Bc7RgbaUnorm = 'bc7-rgba-unorm',
    Bc7RgbaUnormSrgb = 'bc7-rgba-unorm-srgb',

    // ETC2 compressed formats usable if "texture-compression-etc2" is both
    // supported by the device/user agent and enabled in requestDevice.
    Etc2Rgb8unorm = 'etc2-rgb8unorm',
    Etc2Rgb8unormSrgb = 'etc2-rgb8unorm-srgb',
    Etc2Rgb8a1unorm = 'etc2-rgb8a1unorm',
    Etc2Rgb8a1unormSrgb = 'etc2-rgb8a1unorm-srgb',
    Etc2Rgba8unorm = 'etc2-rgba8unorm',
    Etc2Rgba8unormSrgb = 'etc2-rgba8unorm-srgb',
    EacR11unorm = 'eac-r11unorm',
    EacR11snorm = 'eac-r11snorm',
    EacRg11unorm = 'eac-rg11unorm',
    EacRg11snorm = 'eac-rg11snorm',

    // ASTC compressed formats usable if "texture-compression-astc" is both
    // supported by the device/user agent and enabled in requestDevice.
    Astc4x4unorm = 'astc-4x4-unorm',
    Astc4x4unormSrgb = 'astc-4x4-unorm-srgb',
    Astc5x4unorm = 'astc-5x4-unorm',
    Astc5x4unormSrgb = 'astc-5x4-unorm-srgb',
    Astc5x5unorm = 'astc-5x5-unorm',
    Astc5x5unormSrgb = 'astc-5x5-unorm-srgb',
    Astc6x5unorm = 'astc-6x5-unorm',
    Astc6x5unormSrgb = 'astc-6x5-unorm-srgb',
    Astc6x6unorm = 'astc-6x6-unorm',
    Astc6x6unormSrgb = 'astc-6x6-unorm-srgb',
    Astc8x5unorm = 'astc-8x5-unorm',
    Astc8x5unormSrgb = 'astc-8x5-unorm-srgb',
    Astc8x6unorm = 'astc-8x6-unorm',
    Astc8x6unormSrgb = 'astc-8x6-unorm-srgb',
    Astc8x8unorm = 'astc-8x8-unorm',
    Astc8x8unormSrgb = 'astc-8x8-unorm-srgb',
    Astc10x5unorm = 'astc-10x5-unorm',
    Astc10x5unormSrgb = 'astc-10x5-unorm-srgb',
    Astc10x6unorm = 'astc-10x6-unorm',
    Astc10x6unormSrgb = 'astc-10x6-unorm-srgb',
    Astc10x8unorm = 'astc-10x8-unorm',
    Astc10x8unormSrgb = 'astc-10x8-unorm-srgb',
    Astc10x10unorm = 'astc-10x10-unorm',
    Astc10x10unormSrgb = 'astc-10x10-unorm-srgb',
    Astc12x10unorm = 'astc-12x10-unorm',
    Astc12x10unormSrgb = 'astc-12x10-unorm-srgb',
    Astc12x12unorm = 'astc-12x12-unorm',
    Astc12x12unormSrgb = 'astc-12x12-unorm-srgb',
}