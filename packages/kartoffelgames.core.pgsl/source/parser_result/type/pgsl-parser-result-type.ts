/**
 * Abstract base class for representing parsed PGSL types with size and alignment calculations.
 * Handles caching of computed size and alignment values for performance optimization.
 */
export abstract class PgslParserResultType {
    private readonly mType: PgslParserResultTypeType;
    private mSize: number | null;
    private mAlignment: number | null;
    private readonly mAlignmentType: PgslParserResultTypeAlignmentType;

    /**
     * Gets the type category of this PGSL type.
     * @returns The type category (numeric, struct, array-like, or texture).
     */
    public get type(): PgslParserResultTypeType {
        return this.mType;
    }

    /**
     * Gets the calculated size in bytes of this type.
     * The size is calculated once and cached for subsequent calls.
     * @returns The size in bytes.
     */
    public get size(): number {
        if (this.mSize === null) {
            this.mSize = this.calculateSize();
        }
        return this.mSize;
    }

    /**
     * Gets the calculated alignment in bytes for this type.
     * The alignment is calculated once and cached for subsequent calls based on the alignment type.
     * @returns The alignment in bytes.
     */
    public get alignment(): number {
        if (this.mAlignment === null) {
            this.mAlignment = this.calculateAlignment(this.mAlignmentType);
        }
        return this.mAlignment;
    }

    /**
     * Creates a new PGSL parser result type with the specified type and alignment configuration.
     * @param pType - The category of the type (numeric, struct, array-like, or texture).
     * @param pAligmentType - The alignment type determining how the type should be aligned in memory.
     */
    public constructor(pType: PgslParserResultTypeType, pAligmentType: PgslParserResultTypeAlignmentType) {
        this.mType = pType;
        this.mAlignmentType = pAligmentType;

        // Initialize cached values to null
        this.mSize = null;
        this.mAlignment = null;
    }

    /**
     * Calculates the alignment in bytes for this type based on the specified alignment type.
     * Must be implemented by concrete subclasses to provide type-specific alignment logic.
     * @param pAlignmentType - The alignment type (uniform, storage, or packed).
     * @returns The calculated alignment in bytes.
     */
    protected abstract calculateAlignment(pAlignmentType: PgslParserResultTypeAlignmentType): number;

    /**
     * Calculates the size in bytes for this type.
     * Must be implemented by concrete subclasses to provide type-specific size calculation logic.
     * @returns The calculated size in bytes.
     */
    public abstract calculateSize(): number;
}

/**
 * Type category enumeration for PGSL parser result types.
 * - 'numeric': Basic numeric types like integers and floats
 * - 'struct': Structured types with multiple fields
 * - 'array-like': Array, matrix and vector types
 * - 'texture': Texture and sampler types
 */
export type PgslParserResultTypeType = 'numeric' | 'struct' | 'array-like' | 'texture';

/**
 * Alignment type enumeration defining how types should be aligned in memory.
 * - 'uniform': Alignment for uniform buffer usage
 * - 'storage': Alignment for storage buffer usage
 * - 'packed': Tightly packed alignment with minimal padding used in vertex buffers
 */
export type PgslParserResultTypeAlignmentType = 'uniform' | 'storage' | 'packed';