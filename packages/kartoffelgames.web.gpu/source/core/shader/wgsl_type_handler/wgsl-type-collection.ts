import { Dictionary } from '@kartoffelgames/core.data';
import { WgslEnum } from './wgsl-enum.enum';
import { WgslType } from './wgsl-type.enum';

// Type collection.
export const WgslTypeFloatNumbers: Array<WgslTypeFloatNumber> = [WgslType.Float16, WgslType.Float32];
export const WgslTypeIntegerNumbers: Array<WgslTypeIntegerNumber> = [WgslType.Integer32, WgslType.UnsignedInteger32];
export const WgslTypeNumbers: Array<WgslTypeNumber> = [...WgslTypeFloatNumbers, ...WgslTypeIntegerNumbers];
export const WgslTypeVectors: Array<WgslTypeVector> = [WgslType.Vector2, WgslType.Vector3, WgslType.Vector4];
export const WgslTypeMatrices: Array<WgslTypeMatrix> = [WgslType.Matrix22, WgslType.Matrix23, WgslType.Matrix24, WgslType.Matrix32, WgslType.Matrix33, WgslType.Matrix34, WgslType.Matrix42, WgslType.Matrix43, WgslType.Matrix44];
export const WgslTypeStorageTextures: Array<WgslTypeStorageTexture> = [WgslType.TextureStorage1d, WgslType.TextureStorage2d, WgslType.TextureStorage2dArray, WgslType.TextureStorage3d];
export const WgslTypeTextures: Array<WgslTypeTexture> = [WgslType.Texture1d, WgslType.Texture2d, WgslType.Texture2dArray, WgslType.Texture3d, WgslType.TextureCube, WgslType.TextureCubeArray, WgslType.TextureMultisampled2d];
export const WgslTypeDepthTextures: Array<WgslTypeDepthTexture> = [WgslType.TextureDepth2d, WgslType.TextureDepth2dArray, WgslType.TextureDepthCube, WgslType.TextureDepthCube, WgslType.TextureDepthMultisampled2d];

// Enum collections.
export const WgslTypeAccessModes: Array<WgslTypeAccessMode> = [WgslEnum.AccessModeRead, WgslEnum.AccessModeWrite, WgslEnum.AccessModeReadWrite];
export const WgslTypeAddressSpaces: Array<WgslTypeAddressSpace> = [WgslEnum.AddressSpaceFunction, WgslEnum.AddressSpacePrivate, WgslEnum.AddressSpaceStorage, WgslEnum.AddressSpaceUniform, WgslEnum.AddressSpaceWorkgroup];
export const WgslTypeTexelFormats: Array<WgslTypeTexelFormat> = [
    WgslEnum.TexelFormatRgba8unorm, WgslEnum.TexelFormatRgba8snorm, WgslEnum.TexelFormatRgba8uint, WgslEnum.TexelFormatRgba8sint,
    WgslEnum.TexelFormatRgba16uint, WgslEnum.TexelFormatRgba16sint, WgslEnum.TexelFormatRgba16float, WgslEnum.TexelFormatR32uint,
    WgslEnum.TexelFormatR32sint, WgslEnum.TexelFormatR32float, WgslEnum.TexelFormatRg32uint, WgslEnum.TexelFormatRg32sint,
    WgslEnum.TexelFormatRg32float, WgslEnum.TexelFormatRgba32uint, WgslEnum.TexelFormatRgba32sint, WgslEnum.TexelFormatRgba32float, WgslEnum.TexelFormatBgra8unorm
];

export const WgslTypeRestrictions: Dictionary<WgslType, WgslTypeInformation> = (() => {
    const lTypeList: Dictionary<WgslType, WgslTypeInformation> = new Dictionary<WgslType, WgslTypeInformation>();
    const lAddType = (pType: WgslTypeInformation) => {
        lTypeList.set(pType.type, pType);
    };

    const lNumeric32TypeList: Array<WgslType> = [WgslType.Integer32, WgslType.UnsignedInteger32, WgslType.Float32];
    const lAnyType: Array<WgslType> = [WgslType.Any];


    lAddType({ type: WgslType.Any, generic: true, genericTypes: [] });

    // Scalar types.
    lAddType({ type: WgslType.Boolean, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.Integer32, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.UnsignedInteger32, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.Float32, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.Float16, generic: false, genericTypes: [] });

    // Vector type.
    lAddType({ type: WgslType.Vector2, generic: true, genericTypes: [WgslTypeNumbers] });
    lAddType({ type: WgslType.Vector3, generic: true, genericTypes: [WgslTypeNumbers] });
    lAddType({ type: WgslType.Vector4, generic: true, genericTypes: [WgslTypeNumbers] });

    // Matrix types.
    lAddType({ type: WgslType.Matrix22, generic: true, genericTypes: [WgslTypeFloatNumbers] });
    lAddType({ type: WgslType.Matrix23, generic: true, genericTypes: [WgslTypeFloatNumbers] });
    lAddType({ type: WgslType.Matrix24, generic: true, genericTypes: [WgslTypeFloatNumbers] });
    lAddType({ type: WgslType.Matrix32, generic: true, genericTypes: [WgslTypeFloatNumbers] });
    lAddType({ type: WgslType.Matrix33, generic: true, genericTypes: [WgslTypeFloatNumbers] });
    lAddType({ type: WgslType.Matrix34, generic: true, genericTypes: [WgslTypeFloatNumbers] });
    lAddType({ type: WgslType.Matrix42, generic: true, genericTypes: [WgslTypeFloatNumbers] });
    lAddType({ type: WgslType.Matrix43, generic: true, genericTypes: [WgslTypeFloatNumbers] });
    lAddType({ type: WgslType.Matrix44, generic: true, genericTypes: [WgslTypeFloatNumbers] });

    // Special
    lAddType({ type: WgslType.Atomic, generic: true, genericTypes: [WgslTypeIntegerNumbers] });
    lAddType({ type: WgslType.Array, generic: true, genericTypes: [lAnyType, [WgslType.Any, WgslType.Optional]] });
    lAddType({ type: WgslType.Pointer, generic: true, genericTypes: [WgslTypeAddressSpaces, lAnyType, WgslTypeAccessModes] });
    lAddType({ type: WgslType.Reference, generic: true, genericTypes: [WgslTypeAddressSpaces, lAnyType, WgslTypeAccessModes] });

    // Textures.
    lAddType({ type: WgslType.Texture1d, generic: true, genericTypes: [lNumeric32TypeList] });
    lAddType({ type: WgslType.Texture2d, generic: true, genericTypes: [lNumeric32TypeList] });
    lAddType({ type: WgslType.Texture2dArray, generic: true, genericTypes: [lNumeric32TypeList] });
    lAddType({ type: WgslType.Texture3d, generic: true, genericTypes: [lNumeric32TypeList] });
    lAddType({ type: WgslType.TextureCube, generic: true, genericTypes: [lNumeric32TypeList] });
    lAddType({ type: WgslType.TextureCubeArray, generic: true, genericTypes: [lNumeric32TypeList] });
    lAddType({ type: WgslType.TextureMultisampled2d, generic: true, genericTypes: [lNumeric32TypeList] });
    lAddType({ type: WgslType.TextureExternal, generic: false, genericTypes: [] });

    // Depth textures.
    lAddType({ type: WgslType.TextureDepth2d, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.TextureDepth2dArray, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.TextureDepthCube, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.TextureDepthCubeArray, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.TextureDepthMultisampled2d, generic: false, genericTypes: [] });

    // Storage textures.
    lAddType({ type: WgslType.TextureStorage1d, generic: true, genericTypes: [WgslTypeTexelFormats, WgslTypeAccessModes] });
    lAddType({ type: WgslType.TextureStorage2d, generic: true, genericTypes: [WgslTypeTexelFormats, WgslTypeAccessModes] });
    lAddType({ type: WgslType.TextureStorage2dArray, generic: true, genericTypes: [WgslTypeTexelFormats, WgslTypeAccessModes] });
    lAddType({ type: WgslType.TextureStorage3d, generic: true, genericTypes: [WgslTypeTexelFormats, WgslTypeAccessModes] });

    // Sampler.
    lAddType({ type: WgslType.Sampler, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.SamplerComparison, generic: false, genericTypes: [] });

    return lTypeList;
})();

export type WgslTypeInformation = {
    type: WgslType,
    generic: boolean,
    genericTypes: Array<Array<WgslType | WgslEnum>>;
};








export const WgslTypes: Record<WgslType, Array<WgslTypeSetting>> = (() => {
    const lTypes: Record<WgslType, Array<WgslTypeSetting>> = {};

    // Scalar types.
    lTypes['bool'] = {};
    lTypes['i32'] = {};
    lTypes['u32'] = {};
    lTypes['f32'] = {};
    lTypes['f16'] = {};

    // Vector types.
    lTypes['vec2'] = {};
    lTypes['vec3'] = {};
    lTypes['vec4'] = {};

    // Matrix types.
    lTypes['mat2x2'] = {};
    lTypes['mat2x3'] = {};
    lTypes['mat2x4'] = {};
    lTypes['mat3x2'] = {};
    lTypes['mat3x3'] = {};
    lTypes['mat3x4'] = {};
    lTypes['mat4x2'] = {};
    lTypes['mat4x3'] = {};
    lTypes['mat4x4'] = {};

    lTypes['array'] = {};
    lTypes['struct'] = {};

    lTypes['atomic'] = {};
    // Type alias.
    // TODO:

    // None buffer types.
    //-------------------

    //Special.
    lTypes['ptr'] = [{ size: -1, align: 0 }];
    lTypes['ref'] = [{ size: -1, align: 0 }];

    // Textures.
    lTypes['texture_1d'] = [{ size: -1, align: 0 }];
    lTypes['texture_2d'] = [{ size: -1, align: 0 }];
    lTypes['texture_2d_array'] = [{ size: -1, align: 0 }];
    lTypes['texture_3d'] = [{ size: -1, align: 0 }];
    lTypes['texture_cube'] = [{ size: -1, align: 0 }];
    lTypes['texture_cube_array'] = [{ size: -1, align: 0 }];
    lTypes['texture_multisampled_2d'] = [{ size: -1, align: 0 }];
    lTypes['texture_external'] = [{ size: -1, align: 0 }];

    // Depth texture.
    lTypes['texture_depth_2d'] = [{ size: -1, align: 0 }];
    lTypes['texture_depth_2d_array'] = [{ size: -1, align: 0 }];
    lTypes['texture_depth_cube'] = [{ size: -1, align: 0 }];
    lTypes['texture_depth_cube_array'] = [{ size: -1, align: 0 }];
    lTypes['texture_depth_multisampled_2d'] = [{ size: -1, align: 0 }];

    // Storage textures.
    lTypes['texture_storage_1d'] = [{ size: -1, align: 0, generic: ['*', '*'] }];
    lTypes['texture_storage_2d'] = [{ size: -1, align: 0, generic: ['*', '*'] }];
    lTypes['texture_storage_2d_array'] = [{ size: -1, align: 0, generic: ['*', '*'] }];
    lTypes['texture_storage_3d'] = [{ size: -1, align: 0, generic: ['*', '*'] }];

    // Sampler.
    lTypes['sampler'] = [{ size: -1, align: 0 }];
    lTypes['sampler_comparison'] = [{ size: -1, align: 0 }];
})();

type WgslTypeSetting = { size: number, align: number, generic?: Array<string>; };

