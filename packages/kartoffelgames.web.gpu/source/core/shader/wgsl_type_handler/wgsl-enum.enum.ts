export enum WgslTextelFormat {
    TexelFormatRgba8unorm = 'rgba8unorm',
    TexelFormatRgba8snorm = 'rgba8snorm',
    TexelFormatRgba8uint = 'rgba8uint',
    TexelFormatRgba8sint = 'rgba8sint',
    TexelFormatRgba16uint = 'rgba16uint',
    TexelFormatRgba16sint = 'rgba16sint',
    TexelFormatRgba16float = 'rgba16float',
    TexelFormatR32uint = 'r32uint',
    TexelFormatR32sint = 'r32sint',
    TexelFormatR32float = 'r32float',
    TexelFormatRg32uint = 'rg32uint',
    TexelFormatRg32sint = 'rg32sint',
    TexelFormatRg32float = 'rg32float',
    TexelFormatRgba32uint = 'rgba32uint',
    TexelFormatRgba32sint = 'rgba32sint',
    TexelFormatRgba32float = 'rgba32float',
    TexelFormatBgra8unorm = 'bgra8unorm',
}

export enum WgslBindingType {
    Uniform = 'uniform',
    Storage = 'storage',
    ReadonlyStorage = 'read-only-storage'
}


export enum WgslShaderStage {
    Fragment = GPUShaderStage.FRAGMENT,
    Vertex = GPUShaderStage.VERTEX,
    Compute = GPUShaderStage.COMPUTE,
}


export enum WgslAccessMode {
    AccessModeRead = 'read',
    AccessModeWrite = 'write',
    AccessModeReadWrite = 'read_write',
}