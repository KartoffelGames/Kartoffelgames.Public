export enum PgslBuildInTypeName {
    // Scalar types.
    Boolean = 'Boolean',
    Integer = 'Integer',
    UnsignedInteger = 'UInteger',
    Float = 'Float',
    String = '*STRING*', // Should never be named

    // Vector types.
    Vector2 = 'Vector2',
    Vector3 = 'Vector3',
    Vector4 = 'Vector4',

    // Matrix types.
    Matrix22 = 'Matrix22',
    Matrix23 = 'Matrix23',
    Matrix24 = 'Matrix24',
    Matrix32 = 'Matrix32',
    Matrix33 = 'Matrix33',
    Matrix34 = 'Matrix34',
    Matrix42 = 'Matrix42',
    Matrix43 = 'Matrix43',
    Matrix44 = 'Matrix44',

    // Container.
    Array = 'Array',
    Struct = '*STRUCT*', // Should never be named.

    // Textures.
    Texture1d = 'Texture1d',
    Texture2d = 'Texture2d',
    Texture2dArray = 'Texture2dArray',
    Texture3d = 'Texture3d',
    TextureCube = 'TextureCube',
    TextureCubeArray = 'TextureCubeArray',
    TextureMultisampled2d = 'TextureMultisampled2d',
    TextureExternal = 'TextureExternal',

    // Depth texture.
    TextureDepth2d = 'TextureDepth2d',
    TextureDepth2dArray = 'TextureDepth2dArray',
    TextureDepthCube = 'TextureDepthCube',
    TextureDepthCubeArray = 'TextureDepthCubeArray',
    TextureDepthMultisampled2d = 'TextureDepthMultisampled2d',

    // Storage textures.
    TextureStorage1d = 'TextureStorage1d',
    TextureStorage2d = 'TextureStorage2d',
    TextureStorage2dArray = 'TextureStorage2dArray',
    TextureStorage3d = 'TextureStorage3d',

    // Sampler.
    Sampler = 'Sampler',
    SamplerComparison = 'SamplerComparison',

    // Build in types.
    VertexIndex = 'VertexIndex',
    InstanceIndex = 'InstanceIndex',
    Position = 'Position',
    FrontFacing = 'FrontFacing',
    FragDepth = 'FragDepth',
    SampleIndex = 'SampleIndex',
    SampleMask = 'SampleMask',
    LocalInvocationId = 'LocalInvocationId',
    LocalInvocationIndex = 'LocalInvocationIndex',
    GlobalInvocationId = 'GlobalInvocationId',
    WorkgroupId = 'WorkgroupId',
    NumWorkgroups = 'NumWorkgroups',
    ClipDistances = 'ClipDistances'
}