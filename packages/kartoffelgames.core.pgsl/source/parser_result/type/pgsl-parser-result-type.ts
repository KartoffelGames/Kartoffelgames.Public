/**
 * Abstract base class for representing parsed PGSL types.
 */
export abstract class PgslParserResultType {
    private readonly mType: PgslParserResultTypeType;
    private mAlignmentType: PgslParserResultTypeAlignmentType;

    /**
     * Gets the type category of this PGSL type.
     *
     * @returns The type category (numeric, struct, array-like, or texture).
     */
    public get type(): PgslParserResultTypeType {
        return this.mType;
    }

    /**
     * Gets the alignment type of this type.
     *
     * @returns The alignment type (uniform, storage, or packed).
     */
    public get alignmentType(): PgslParserResultTypeAlignmentType {
        return this.mAlignmentType;
    }

    /**
     * Creates a new PGSL parser result type with the specified type category.
     *
     * @param pType - The category of the type (numeric, struct, array-like, or texture).
     * @param pAlignmentType - The alignment type (uniform, storage, or packed).
     */
    public constructor(pType: PgslParserResultTypeType, pAlignmentType: PgslParserResultTypeAlignmentType) {
        this.mType = pType;
        this.mAlignmentType = pAlignmentType;
    }
}

/**
 * Type category enumeration for PGSL parser result types.
 * - 'numeric': Basic numeric types like integers and floats
 * - 'struct': Structured types with multiple fields
 * - 'array-like': Array, matrix and vector types
 * - 'texture': Texture and sampler types
 */
export type PgslParserResultTypeType = 'numeric' | 'boolean' | 'struct' | 'array' | 'texture' | 'sampler' | 'vector' | 'matrix';

/**
 * Alignment type enumeration defining how types should be aligned in memory.
 * - 'uniform': Alignment for uniform buffer usage
 * - 'storage': Alignment for storage buffer usage
 * - 'packed': Tightly packed alignment with minimal padding used in vertex buffers
 */
export type PgslParserResultTypeAlignmentType = 'uniform' | 'storage' | 'packed';