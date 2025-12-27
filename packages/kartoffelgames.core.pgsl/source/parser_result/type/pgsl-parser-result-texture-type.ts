import type { PgslTexelFormat } from '../../buildin/enum/pgsl-texel-format-enum.ts';
import type { PgslParserResultNumericType } from './pgsl-parser-result-numeric-type.ts';
import { PgslParserResultType } from './pgsl-parser-result-type.ts';

/**
 * Represents a texture type in PGSL parser results with dimension, data type, and format information.
 * Textures are opaque types in WGSL and do not have meaningful size/alignment for buffer layout.
 */
export class PgslParserResultTextureType extends PgslParserResultType {
    private readonly mDimension: PgslParserResultTextureDimensionType;
    private readonly mSampledType: PgslParserResultNumericType;
    private readonly mTextureFormat: PgslTexelFormat;

    /**
     * Gets the texture dimension (1D, 2D, 3D, etc.).
     *
     * @returns The texture dimension type.
     */
    public get dimension(): PgslParserResultTextureDimensionType {
        return this.mDimension;
    }

    /**
     * Gets the texture sampled data type (float, integer, unsigned integer).
     *
     * @returns The texture sampled data type.
     */
    public get sampledType(): PgslParserResultNumericType {
        return this.mSampledType;
    }

    /**
     * Gets the texture format specification.
     *
     * @returns The texture format string.
     */
    public get textureFormat(): PgslTexelFormat {
        return this.mTextureFormat;
    }

    /**
     * Creates a new PGSL parser result texture type.
     *
     * @param pDimension - The texture dimension.
     * @param pSampledType - The texture data type.
     * @param pTextureFormat - The texture format specification.
     */
    public constructor(pDimension: PgslParserResultTextureDimensionType, pSampledType: PgslParserResultNumericType, pTextureFormat: PgslTexelFormat) {
        // Textures are always packed alignment.
        super('texture', 'packed');

        this.mDimension = pDimension;
        this.mSampledType = pSampledType;
        this.mTextureFormat = pTextureFormat;
    }
}

/**
 * Texture dimension types supported in WGSL.
 */
export type PgslParserResultTextureDimensionType = '1d' | '2d' | '2d-array' | '3d' | 'cube' | 'cube-array';

/**
 * Texture data types indicating the format of data stored in the texture.
 */
export type PgslParserResultTextureDataType = 'float' | 'integer' | 'unsigned-integer';