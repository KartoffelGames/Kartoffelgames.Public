import { PgslTypeName } from './pgsl-type-name.enum';

export enum PgslTextureTypeName {
    // Textures.
    Texture1d = PgslTypeName.Texture1d,
    Texture2d = PgslTypeName.Texture2d,
    Texture2dArray = PgslTypeName.Texture2dArray,
    Texture3d = PgslTypeName.Texture3d,
    TextureCube = PgslTypeName.TextureCube,
    TextureCubeArray = PgslTypeName.TextureCubeArray,
    TextureMultisampled2d = PgslTypeName.TextureMultisampled2d,
    TextureExternal = PgslTypeName.TextureExternal,

    // Depth texture.
    TextureDepth2d = PgslTypeName.TextureDepth2d,
    TextureDepth2dArray = PgslTypeName.TextureDepth2dArray,
    TextureDepthCube = PgslTypeName.TextureDepthCube,
    TextureDepthCubeArray = PgslTypeName.TextureDepthCubeArray,
    TextureDepthMultisampled2d = PgslTypeName.TextureDepthMultisampled2d,

    // Storage textures.
    TextureStorage1d = PgslTypeName.TextureStorage1d,
    TextureStorage2d = PgslTypeName.TextureStorage2d,
    TextureStorage2dArray = PgslTypeName.TextureStorage2dArray,
    TextureStorage3d = PgslTypeName.TextureStorage3d
}