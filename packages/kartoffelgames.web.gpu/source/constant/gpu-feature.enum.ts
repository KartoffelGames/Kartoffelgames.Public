/**
 * Gpu feature names.
 */
export enum GpuFeature {
    DepthClipControl = 'depth-clip-control',
    Depth32floatStencil8 = 'depth32float-stencil8',
    TextureCompressionBc = 'texture-compression-bc',
    TextureCompressionBcSliced3d = 'texture-compression-bc-sliced-3d',
    TextureCompressionEtc2 = 'texture-compression-etc2',
    TextureCompressionAstc = 'texture-compression-astc',
    TimestampQuery = 'timestamp-query',
    IndirectFirstInstance = 'indirect-first-instance',
    ShaderF16 = 'shader-f16',
    Rg11b10ufloatRenderable = 'rg11b10ufloat-renderable',
    Bgra8unormStorage = 'bgra8unorm-storage',
    Float32Filterable = 'float32-filterable',
    ClipDistances = 'clip-distances',
    DualSourceBlendin = 'dual-source-blending'
}