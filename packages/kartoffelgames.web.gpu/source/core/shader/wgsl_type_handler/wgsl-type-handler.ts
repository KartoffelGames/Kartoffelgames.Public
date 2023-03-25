import { Dictionary, EnumUtil, Exception } from '@kartoffelgames/core.data';
import { WgslTypeDepthTexture, WgslTypeDepthTextures, WgslTypeInformation, WgslTypeRestrictions, WgslTypeStorageTexture, WgslTypeTexture, WgslTypeTextures } from './wgsl-type-collection';
import { WgslEnum } from './wgsl-enum.enum';
import { WgslType } from './wgsl-type.enum';

export class WgslTypeHandler {
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
     * @param pTypeDefinition - Type definition.
     */
    public static getTextureSampleTypeFromGeneric(pTypeDefinition: WgslTypeDefinition): GPUTextureSampleType {
        if (![...WgslTypeTextures, ...WgslTypeDepthTextures].includes(<WgslTypeDepthTexture | WgslTypeTexture>pTypeDefinition.type)) {
            throw new Exception(`Type "${pTypeDefinition.type}" not suported for GPUTextureSampleType`, WgslTypeHandler);
        }

        // Color textures. Based on generic type.
        if (WgslTypeTextures.includes(<WgslTypeTexture>pTypeDefinition.type)) {
            const lGenericType: WgslType = (<WgslTypeDefinition>pTypeDefinition.generics[0]).type;
            switch (lGenericType) {
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
    public static getTexureDimensionFromType(pTextureType: WgslTypeDepthTexture | WgslTypeTexture | WgslTypeStorageTexture): GPUTextureViewDimension {
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
     * Get nested type definition from string.
     * Does validate allowed generic types of all depths.
     * @param pTypeString - Type string with optional nested generics.
     */
    public static typeInformationByString(pTypeString: string): WgslTypeDefinition {
        const lTypeRegex: RegExp = /^(?<typename>\w+)(?:<(?<generics>.+)>)?$/;
        const lGenericRegex: RegExp = /(?<generictype>(?:\w+(?:<.+>)?))[,\s]*/g;

        // Match type information.
        const lMatch: RegExpMatchArray | null = pTypeString.match(lTypeRegex);
        if (!lMatch) {
            throw new Exception(`Type "${pTypeString}" can't be parsed.`, WgslTypeHandler);
        }

        // Scrape generic information of the string.
        const lGenericList: Array<WgslTypeDefinition | WgslEnum> = new Array<WgslTypeDefinition | WgslEnum>();
        if (lMatch.groups!['generics']) {
            const lGenerics: string = lMatch.groups!['generics'];

            // Execute recursion for all found generic types.
            let lGenericMatch: RegExpMatchArray | null;
            while ((lGenericMatch = lGenericRegex.exec(lGenerics)) !== null) {
                const lGenericName: string = lGenericMatch.groups!['generictype'];

                // Check if generic is a enum type.
                const lGenericEnum: WgslEnum = WgslTypeHandler.enumByName(lGenericName);
                if (lGenericEnum !== WgslEnum.Unknown) {
                    lGenericList.push(lGenericEnum);
                    continue;
                }

                // Recursive resolve for wgsl types.
                const lGenericTypeInformation: WgslTypeDefinition = WgslTypeHandler.typeInformationByString(lGenericName);
                lGenericList.push(lGenericTypeInformation);

            }
        }

        // Validate type.
        const lType: WgslType = WgslTypeHandler.typeByName(lMatch.groups!['typename']);
        const lTypeInformation: WgslTypeInformation | undefined = WgslTypeHandler.mTypeStorage.get(lType);
        if (!lTypeInformation) {
            throw new Exception(`Type "${lMatch.groups!['typename']}" has no definition.`, WgslTypeHandler);
        }

        // Skip generic validation for any types.
        if (lTypeInformation.type !== WgslType.Any) {
            // Validate generic count.
            if (lTypeInformation.genericTypes.length !== lGenericList.length) {
                throw new Exception(`Generic count does not match definition (${lTypeInformation.genericTypes.length} => ${lGenericList.length})`, WgslTypeHandler);
            }

            // Validate generics.
            for (let lGenericIndex: number = 0; lGenericIndex < lTypeInformation.genericTypes.length; lGenericIndex++) {
                // Target generic.
                const lTargetGeneric: WgslTypeDefinition | WgslEnum = lGenericList[lGenericIndex];
                const lTargetGenericType: WgslType | WgslEnum = (typeof lTargetGeneric === 'string') ? lTargetGeneric : lTargetGeneric.type;

                // Valid generic types or enums.
                const lValidGenerics: Array<WgslType | WgslEnum> = lTypeInformation.genericTypes[lGenericIndex];

                // Compare valid list with set target generic.
                if (!lValidGenerics.includes(lTargetGenericType)) {
                    throw new Exception(`Generic type to definition missmatch. (Type "${lTypeInformation.type}" generic index ${lGenericIndex})`, WgslTypeHandler);
                }
            }
        }

        return {
            type: lType,
            generics: lGenericList
        };
    }
}

export type WgslTypeDefinition = {
    type: WgslType;
    generics: Array<WgslTypeDefinition | WgslEnum>;
};