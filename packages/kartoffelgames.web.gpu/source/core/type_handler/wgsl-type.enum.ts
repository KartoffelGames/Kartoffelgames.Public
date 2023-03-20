export enum WgslType {
    Any = '*',

    // Scalar types.
    Boolean = 'bool',
    Integer32 = 'i32',
    UnsignedInteger32 = 'u32',
    Float32 = 'f32',
    Float16 = 'f16',

    // Vector types.
    Vector2 = 'vec2',
    Vector3 = 'vec3',
    Vector4 = 'vec4',

    // Matrix types.
    Matrix22 = 'mat2x2',
    Matrix23 = 'mat2x3',
    Matrix24 = 'mat2x4',
    Matrix32 = 'mat3x2',
    Matrix33 = 'mat3x3',
    Matrix34 = 'mat3x4',
    Matrix42 = 'mat4x2',
    Matrix43 = 'mat4x3',
    Matrix44 = 'mat4x4',

    //Special.
    Atomic = 'atomic',
    Array = 'array',
    Pointer = 'ptr',
    Reference = 'ref',

    // Textures.
    Texture1d = 'texture_1d',
    Texture2d = 'texture_2d',
    Texture2dArray = 'texture_2d_array',
    Texture3d = 'texture_3d',
    TextureCube = 'texture_cube',
    TextureCubeArray = 'texture_cube_array',
    TextureMultisampled2d = 'texture_multisampled_2d',
    TextureExternal = 'texture_external',

    // Depth texture.
    TextureDepth2d = 'texture_depth_2d',
    TextureDepth2dArray = 'texture_depth_2d_array',
    TextureDepthCube = 'texture_depth_cube',
    TextureDepthCubeArray = 'texture_depth_cube_array',
    TextureDepthMultisampled2d = 'texture_depth_multisampled_2d',

    // Storage textures.
    TextureStorage1d = 'texture_storage_1d',
    TextureStorage2d = 'texture_storage_2d',
    TextureStorage2dArray = 'texture_storage_2d_array',
    TextureStorage3d = 'texture_storage_3d',

    // Sampler.
    Sampler = 'sampler',
    SamplerComparison = 'sampler_comparison',

    // Enum.
    AccessModeRead = 'read',
    AccessModeWrite = 'write',
    AccessModeReadWrite = 'read_write',

    AddressSpaceFunction = 'function',
    AddressSpacePrivate = 'private',
    AddressSpaceWorkgroup = 'workgroup',
    AddressSpaceUniform = 'uniform',
    AddressSpaceStorage = 'storage',

    InterpolationTypePerspective = 'perspective',
    InterpolationTypeLinear = 'linear',
    InterpolationTypeFlat = 'flat',

    InterpolationSamplingCenter = 'center',
    InterpolationSamplingCentroid = 'centroid',
    InterpolationSamplingSample = 'sample',

    BuiltInValueVertexIndex = 'vertex_index',
    BuiltInValueInstanceIndex = 'instance_index',
    BuiltInValuePosition = 'position',
    BuiltInValueFrontFacing = 'front_facing',
    BuiltInValueFragmentDepth = 'frag_depth',
    BuiltInValueLocalInvocationId = 'local_invocation_id',
    BuiltInValueLocalInvocationIndex = 'local_invocation_index',
    BuiltInValueGlobalInvovationId = 'global_invocation_id',
    BuiltInValueWorkgroupId = 'workgroup_id',
    BuiltInValueNumverWorkgroups = 'num_workgroups',
    BuiltInValueSampleIndex = 'sample_index',
    BuiltInValueSampleMask = 'sample_mask',

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