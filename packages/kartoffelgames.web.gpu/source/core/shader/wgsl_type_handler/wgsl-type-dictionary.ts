import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core.data';
import { WgslEnum } from './wgsl-enum.enum';
import { WgslTypeDepthTexture, WgslTypeDepthTextures, WgslTypeInformation, WgslTypeRestrictions, WgslTypeStorageTexture, WgslTypeTexture, WgslTypeTextures } from './wgsl-type-collection';
import { WgslType } from '../enum/wgsl-type.enum';

export class WgslTypeDictionary {
    private static readonly mTypeStorage: Dictionary<WgslType, WgslTypeInformation> = WgslTypeRestrictions;

    /**
     * Enum by name.
     * @param pTypeName - Type name. Name must be specified without generic information. Regex: /^\w+$/
     */
    public static enumByName(pTypeName: string): WgslEnum {
        const lType: WgslEnum | undefined = EnumUtil.enumKeyByValue(WgslEnum, pTypeName);
        if (lType) {
            return lType;
        }

        // It can be anything.
        return WgslEnum.Unknown;
    }

    /**
     * Get sample type from type definition.
     * Uses type and generics for getting texture sample type.
     * @param pType - Type definition.
     */
    public static textureSampleTypeFromGeneric(pType: WgslType, pTextureType?: WgslType): GPUTextureSampleType {
        if (![...WgslTypeTextures, ...WgslTypeDepthTextures].includes(<WgslTypeDepthTexture | WgslTypeTexture>pType)) {
            throw new Exception(`Type "${pType}" not suported for GPUTextureSampleType`, WgslTypeDictionary);
        }

        // Color textures. Based on generic type.
        if (WgslTypeTextures.includes(<WgslTypeTexture>pType)) {
            switch (pTextureType) {
                case WgslType.Float32: {
                    return 'float';
                }
                case WgslType.Integer32: {
                    return 'sint';
                }
                case WgslType.UnsignedInteger32: {
                    return 'uint';
                }
                default: {
                    // Ignored "unfiltered float"
                    return 'unfilterable-float';
                }
            }
        } else {
            // Musst be and depth type.
            return 'depth';
        }
    }

    /**
     * Get view dimension based on WGSL texture type.
     * @param pTextureType - Texture type.
     */
    public static texureDimensionFromType(pTextureType: WgslTypeDepthTexture | WgslTypeTexture | WgslTypeStorageTexture): GPUTextureViewDimension {
        // Map every texture type for view dimension.
        switch (pTextureType) {
            case WgslType.Texture1d:
            case WgslType.TextureStorage1d: {
                return '1d';
            }
            case WgslType.TextureDepth2d:
            case WgslType.Texture2d:
            case WgslType.TextureStorage2d:
            case WgslType.TextureDepthMultisampled2d:
            case WgslType.TextureMultisampled2d: {
                return '2d';
            }
            case WgslType.TextureDepth2dArray:
            case WgslType.Texture2dArray:
            case WgslType.TextureStorage2dArray: {
                return '2d-array';
            }
            case WgslType.Texture3d:
            case WgslType.TextureStorage3d: {
                return '3d';
            }
            case WgslType.TextureCube:
            case WgslType.TextureDepthCube: {
                return 'cube';
            }
            case WgslType.TextureCubeArray: {
                return 'cube-array';
            }
        }
    }

    /**
     * Type by name.
     * @param pTypeName - Type name. Name must be specified without generic information. Regex: /^\w+$/
     */
    public static typeByName(pTypeName: string): WgslType {
        const lType: WgslType | undefined = EnumUtil.enumKeyByValue(WgslType, pTypeName);
        if (lType) {
            return lType;
        }

        // It can be anything.
        return WgslType.Any;
    }

    /**
     * Get type information for WGSL type.
     * @param pType - WGSL type.
     * @returns 
     */
    public static typeInformation(pType: WgslType): WgslTypeInformation | undefined {
        return WgslTypeDictionary.mTypeStorage.get(pType);
    }
}