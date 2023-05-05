export enum WgslType {
    Any = '*',
    Optional = '_',
    
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

    // Container.
    Struct = 'struct',
    Atomic = 'atomic',

    //Special.
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
    SamplerComparison = 'sampler_comparison'
}