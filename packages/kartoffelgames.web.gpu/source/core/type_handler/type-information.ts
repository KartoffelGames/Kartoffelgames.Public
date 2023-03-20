import { Dictionary } from '@kartoffelgames/core.data';
import { WgslType } from './wgsl-type.enum';


export const TypeToWgsl: Dictionary<WgslType, WgslTypeInformation> = (() => {
    const lTypeList: Dictionary<WgslType, WgslTypeInformation> = new Dictionary<WgslType, WgslTypeInformation>();
    const lAddType = (pType: WgslTypeInformation) => {
        lTypeList.set(pType.type, pType);
    };

    const lNumberTypeList: Array<WgslType> = [WgslType.Integer32, WgslType.UnsignedInteger32, WgslType.Float16, WgslType.Float32];
    const lFloatTypeList: Array<WgslType> = [WgslType.Float16, WgslType.Float32];
    const lIntegerTypeList: Array<WgslType> = [WgslType.Integer32, WgslType.UnsignedInteger32];
    const lNumeric32TypeList: Array<WgslType> = [WgslType.Integer32, WgslType.UnsignedInteger32, WgslType.Float32];
    const lAnyType: Array<WgslType> = [WgslType.Any];
    const lAccessModeTypeList: Array<WgslType> = [WgslType.AccessModeRead, WgslType.AccessModeWrite, WgslType.AccessModeReadWrite];
    const lAddressSpaceTypeList: Array<WgslType> = [WgslType.AddressSpaceFunction, WgslType.AddressSpacePrivate, WgslType.AddressSpaceStorage, WgslType.AddressSpaceUniform, WgslType.AddressSpaceWorkgroup];
    const lTexelFormatTypeList: Array<WgslType> = [
        WgslType.TexelFormatRgba8unorm, WgslType.TexelFormatRgba8snorm, WgslType.TexelFormatRgba8uint, WgslType.TexelFormatRgba8sint,
        WgslType.TexelFormatRgba16uint, WgslType.TexelFormatRgba16sint, WgslType.TexelFormatRgba16float, WgslType.TexelFormatR32uint,
        WgslType.TexelFormatR32sint, WgslType.TexelFormatR32float, WgslType.TexelFormatRg32uint, WgslType.TexelFormatRg32sint,
        WgslType.TexelFormatRg32float, WgslType.TexelFormatRgba32uint, WgslType.TexelFormatRgba32sint, WgslType.TexelFormatRgba32float, WgslType.TexelFormatBgra8unorm
    ];

    lAddType({ type: WgslType.Any, generic: true, genericTypes: [] });

    // Scalar types.
    lAddType({ type: WgslType.Boolean, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.Integer32, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.UnsignedInteger32, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.Float32, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.Float16, generic: false, genericTypes: [] });

    // Vector type.
    lAddType({ type: WgslType.Vector2, generic: true, genericTypes: [lNumberTypeList] });
    lAddType({ type: WgslType.Vector3, generic: true, genericTypes: [lNumberTypeList] });
    lAddType({ type: WgslType.Vector4, generic: true, genericTypes: [lNumberTypeList] });

    // Matrix types.
    lAddType({ type: WgslType.Matrix22, generic: true, genericTypes: [lFloatTypeList] });
    lAddType({ type: WgslType.Matrix23, generic: true, genericTypes: [lFloatTypeList] });
    lAddType({ type: WgslType.Matrix24, generic: true, genericTypes: [lFloatTypeList] });
    lAddType({ type: WgslType.Matrix32, generic: true, genericTypes: [lFloatTypeList] });
    lAddType({ type: WgslType.Matrix33, generic: true, genericTypes: [lFloatTypeList] });
    lAddType({ type: WgslType.Matrix34, generic: true, genericTypes: [lFloatTypeList] });
    lAddType({ type: WgslType.Matrix42, generic: true, genericTypes: [lFloatTypeList] });
    lAddType({ type: WgslType.Matrix43, generic: true, genericTypes: [lFloatTypeList] });
    lAddType({ type: WgslType.Matrix44, generic: true, genericTypes: [lFloatTypeList] });

    // Special
    lAddType({ type: WgslType.Atomic, generic: true, genericTypes: [lIntegerTypeList] });
    lAddType({ type: WgslType.Array, generic: true, genericTypes: [lAnyType, lAnyType] });
    lAddType({ type: WgslType.Pointer, generic: true, genericTypes: [lAddressSpaceTypeList, lAnyType, lAccessModeTypeList] });
    lAddType({ type: WgslType.Reference, generic: true, genericTypes: [lAddressSpaceTypeList, lAnyType, lAccessModeTypeList] });

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
    lAddType({ type: WgslType.TextureStorage1d, generic: true, genericTypes: [lTexelFormatTypeList, lAccessModeTypeList] });
    lAddType({ type: WgslType.TextureStorage2d, generic: true, genericTypes: [lTexelFormatTypeList, lAccessModeTypeList] });
    lAddType({ type: WgslType.TextureStorage2dArray, generic: true, genericTypes: [lTexelFormatTypeList, lAccessModeTypeList] });
    lAddType({ type: WgslType.TextureStorage3d, generic: true, genericTypes: [lTexelFormatTypeList, lAccessModeTypeList] });

    // Sampler.
    lAddType({ type: WgslType.Sampler, generic: false, genericTypes: [] });
    lAddType({ type: WgslType.SamplerComparison, generic: false, genericTypes: [] });

    return lTypeList;
})();

export type WgslTypeInformation = {
    type: WgslType,
    generic: boolean,
    genericTypes: Array<Array<WgslType>>;
};