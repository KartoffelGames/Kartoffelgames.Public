import type { PgslAccessMode } from '../../../buildin/enum/pgsl-access-mode-enum.ts';
import type { PgslTexelFormat } from '../../../buildin/enum/pgsl-texel-format-enum.ts';
import { BasePgslType, BasePgslTypeKind, type BasePgslTypeMeta } from './base-pgsl-type.ts';

/**
 * Texture type definition.
 * Only storage textures have a texel format and an access mode.
 */
export class PgslTextureType extends BasePgslType {
    /**
     * Type names for different texture variants.
     * Maps texture type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            // Regular textures.
            texture1d: 'Texture1d',
            texture2d: 'Texture2d',
            texture2dArray: 'Texture2dArray',
            texture3d: 'Texture3d',
            textureCube: 'TextureCube',
            textureCubeArray: 'TextureCubeArray',
            textureMultisampled2d: 'TextureMultisampled2d',
            textureExternal: 'TextureExternal',

            // Depth textures.
            textureDepth2d: 'TextureDepth2d',
            textureDepth2dArray: 'TextureDepth2dArray',
            textureDepthCube: 'TextureDepthCube',
            textureDepthCubeArray: 'TextureDepthCubeArray',
            textureDepthMultisampled2d: 'TextureDepthMultisampled2d',

            // Storage textures.
            textureStorage1d: 'TextureStorage1d',
            textureStorage2d: 'TextureStorage2d',
            textureStorage2dArray: 'TextureStorage2dArray',
            textureStorage3d: 'TextureStorage3d'
        } as const;
    }

    /**
     * Get a string identification for the type.
     *
     * @param pTextureType - The specific texture type variant.
     * @param pSampledType - The type the texture samples.
     * @param pStorage - Texel format and access mode of storage textures.
     *
     * @returns The type identification.
     */
    public static identifierOf(pTextureType: PgslTextureTypeName, pSampledType: BasePgslType, pStorage: PgslTextureTypeStorage | null): string {
        // Storage textures are identified by their format and access mode.
        if (pStorage !== null) {
            return pTextureType + '[' + pStorage.format + ',' + pStorage.access + ']';
        }

        // Sampled textures are identified by their sampled type.
        if (PgslTextureType.isSampledTextureType(pTextureType)) {
            return pTextureType + '[' + pSampledType.meta.typeName + ']';
        }

        // Depth and external textures have no template values.
        return pTextureType;
    }

    /**
     * Checks if a texture type is a depth texture.
     *
     * @param pTextureType - Texture type.
     *
     * @returns True if the texture type is a depth texture, false otherwise.
     */
    public static isDepthTextureType(pTextureType: PgslTextureTypeName): boolean {
        return pTextureType === PgslTextureType.typeName.textureDepth2d ||
            pTextureType === PgslTextureType.typeName.textureDepth2dArray ||
            pTextureType === PgslTextureType.typeName.textureDepthCube ||
            pTextureType === PgslTextureType.typeName.textureDepthCubeArray ||
            pTextureType === PgslTextureType.typeName.textureDepthMultisampled2d;
    }

    /**
     * Checks if a texture type is a sampled texture, which is declared with the type it samples.
     *
     * @param pTextureType - Texture type.
     *
     * @returns True if the texture type is a sampled texture, false otherwise.
     */
    public static isSampledTextureType(pTextureType: PgslTextureTypeName): boolean {
        return pTextureType === PgslTextureType.typeName.texture1d ||
            pTextureType === PgslTextureType.typeName.texture2d ||
            pTextureType === PgslTextureType.typeName.texture2dArray ||
            pTextureType === PgslTextureType.typeName.texture3d ||
            pTextureType === PgslTextureType.typeName.textureCube ||
            pTextureType === PgslTextureType.typeName.textureCubeArray ||
            pTextureType === PgslTextureType.typeName.textureMultisampled2d;
    }

    /**
     * Checks if a texture type is a storage texture.
     *
     * @param pTextureType - Texture type.
     *
     * @returns True if the texture type is a storage texture, false otherwise.
     */
    public static isStorageTextureType(pTextureType: PgslTextureTypeName): boolean {
        return pTextureType === PgslTextureType.typeName.textureStorage1d ||
            pTextureType === PgslTextureType.typeName.textureStorage2d ||
            pTextureType === PgslTextureType.typeName.textureStorage2dArray ||
            pTextureType === PgslTextureType.typeName.textureStorage3d;
    }

    /**
     * Gets the texture dimension from the texture type name.
     *
     * @param pTextureType - Texture type.
     *
     * @returns The texture dimension as a string.
     */
    public static textureDimensionFromTypeName(pTextureType: PgslTextureTypeName): PgslTextureTypeNameDimension {
        switch (pTextureType) {
            // 1D textures
            case PgslTextureType.typeName.texture1d:
            case PgslTextureType.typeName.textureStorage1d: {
                return '1d';
            }

            // 2D textures
            case PgslTextureType.typeName.texture2d:
            case PgslTextureType.typeName.textureMultisampled2d:
            case PgslTextureType.typeName.textureExternal:
            case PgslTextureType.typeName.textureDepth2d:
            case PgslTextureType.typeName.textureDepthMultisampled2d:
            case PgslTextureType.typeName.textureStorage2d: {
                return '2d';
            }

            // 2D array textures
            case PgslTextureType.typeName.texture2dArray:
            case PgslTextureType.typeName.textureDepth2dArray:
            case PgslTextureType.typeName.textureStorage2dArray: {
                return '2d-array';
            }

            // 3D textures
            case PgslTextureType.typeName.texture3d:
            case PgslTextureType.typeName.textureStorage3d: {
                return '3d';
            }

            // Cube textures
            case PgslTextureType.typeName.textureCube:
            case PgslTextureType.typeName.textureDepthCube: {
                return 'cube';
            }

            // Cube array textures
            case PgslTextureType.typeName.textureCubeArray:
            case PgslTextureType.typeName.textureDepthCubeArray: {
                return 'cube-array';
            }
        }
    }

    private readonly mSampledType: BasePgslType;
    private readonly mStorage: PgslTextureTypeStorage | null;
    private readonly mTextureType: PgslTextureTypeName;

    /**
     * Gets the sampled type of this texture.
     *
     * @returns The sampled type.
     */
    public get sampledType(): BasePgslType {
        return this.mSampledType;
    }

    /**
     * Gets the texel format and access mode of storage textures.
     *
     * @returns The storage information, or null for any texture that is not a storage texture.
     */
    public get storage(): PgslTextureTypeStorage | null {
        return this.mStorage;
    }

    /**
     * Gets the texture type variant.
     *
     * @returns The texture type name.
     */
    public get textureType(): PgslTextureTypeName {
        return this.mTextureType;
    }

    /**
     * Constructor for texture type.
     *
     * @param pTextureType - The specific texture type variant.
     * @param pSampledType - The type the texture samples.
     * @param pStorage - Texel format and access mode of storage textures, null for any other texture.
     */
    public constructor(pTextureType: PgslTextureTypeName, pSampledType: BasePgslType, pStorage: PgslTextureTypeStorage | null) {
        // Anything a texture is.
        const lTypeKind: BasePgslTypeKind = BasePgslTypeKind.Texture | BasePgslTypeKind.Concrete | BasePgslTypeKind.Storable;

        // Create meta. Only sampled textures declare their sampled type as a template type.
        const lTypeMeta: BasePgslTypeMeta = {
            typeName: PgslTextureType.identifierOf(pTextureType, pSampledType, pStorage)
        };

        // Add generics on storage textures.
        if (PgslTextureType.isSampledTextureType(pTextureType)) {
            lTypeMeta.generics = [pSampledType];
        }

        super(lTypeKind, lTypeMeta);

        this.mTextureType = pTextureType;
        this.mSampledType = pSampledType;
        this.mStorage = pStorage;
    }

    /**
     * Get this types convertion rank to another type.
     * A texture only converts into the same texture.
     *
     * @param pTarget - Conversion target type.
     *
     * @returns Zero for the same texture, infinity for anything else.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        if (this.equals(pTarget)) {
            return 0;
        }

        return Number.POSITIVE_INFINITY;
    }

    /**
     * Compare this texture type with a target type for equality.
     * Two texture types are equal if they have the same texture variant and the same template values.
     *
     * @param pTarget - Target comparison type.
     *
     * @returns True when both types describe the same texture type.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        // Must both be a texture.
        if (!this.isSameTypeClass(pTarget)) {
            return false;
        }

        // The typename contains the texture generic information.
        return this.meta.typeName === pTarget.meta.typeName;
    }
}

/**
 * Texel format and access mode of a storage texture.
 */
export type PgslTextureTypeStorage = {
    format: PgslTexelFormat;
    access: PgslAccessMode;
};

/**
 * Texture dimension types supported in WGSL.
 */
export type PgslTextureTypeNameDimension = '1d' | '2d' | '2d-array' | '3d' | 'cube' | 'cube-array';

/**
 * Type representing all available texture type names.
 * Derived from the static typeName getter for type safety.
 */
export type PgslTextureTypeName = (typeof PgslTextureType.typeName)[keyof typeof PgslTextureType.typeName];
