/**
 * Abstract base class for representing parsed PGSL types.
 */
export abstract class PgslParserResultType {
    private mAlignmentType: PgslParserResultTypeAlignmentType;
    private mByteAlignment: number;
    private mByteSize: number;
    private readonly mType: PgslParserResultTypeType;
    private mVariableByteSize: number;
    
    /**
     * Gets the alignment type of this type.
     *
     * @returns The alignment type (uniform, storage, or packed).
     */
    public get alignmentType(): PgslParserResultTypeAlignmentType {
        return this.mAlignmentType;
    } set alignmentType(pValue: PgslParserResultTypeAlignmentType) {
        this.mAlignmentType = pValue;

        // Reset size and alignment caches.
        this.resetType();
    }

    /**
     * Gets the byte alignment of this type, calculated lazily and cached for performance.
     *
     * @returns The byte alignment of the type.
     */
    public get byteAlignment(): number {
        if (this.mByteAlignment < 0) {
            this.mByteAlignment = this.onCalculateByteAlignment();
        }
        return this.mByteAlignment;
    }

    /**
     * Gets the byte size of this type, calculated lazily and cached for performance.
     *
     * @returns The byte size of the type.
     */
    public get byteSize(): number {
        if (this.mByteSize < 0) {
            this.mByteSize = this.onCalculateByteSize();
        }
        return this.mByteSize;
    }

    /**
     * Gets the type category of this PGSL type.
     *
     * @returns The type category (numeric, struct, array-like, or texture).
     */
    public get type(): PgslParserResultTypeType {
        return this.mType;
    }

    /**
     * Gets the variable byte size of this type.
     * This is useful for types with runtime-sized components (e.g., runtime-sized arrays in structs).
     * Calculated lazily and cached for performance.
     *
     * @returns The variable byte size of the type.
     */
    public get variableByteSize(): number {
        if (this.mVariableByteSize < 0) {
            this.mVariableByteSize = this.onCalculateVariableByteSize();
        }
        return this.mVariableByteSize;
    }

    /**
     * Creates a new PGSL parser result type with the specified type category.
     *
     * @param pType - The category of the type (numeric, struct, array-like, or texture).
     */
    public constructor(pType: PgslParserResultTypeType) {
        this.mType = pType;
        this.mAlignmentType = 'packed';

        // Set initial size and alignment to negative; they will be calculated lazily when requested.
        this.mByteSize = -1;
        this.mByteAlignment = -1;
        this.mVariableByteSize = -1;
    }

    /**
     * Reset the cached byte size, alignment, and variable byte size values.
     * This should be called whenever the type's properties change in a way that would affect its size or alignment calculations.
     */
    protected resetType(): void {
        this.mByteSize = -1;
        this.mByteAlignment = -1;
        this.mVariableByteSize = -1;
    }

    /**
     * Method to calculate the byte alignment of this type.
     *
     * @returns The byte alignment of the type.
     */
    protected abstract onCalculateByteAlignment(): number;

    /**
     * Method to calculate the byte size of this type.
     *
     * @returns The byte size of the type.
     */
    protected abstract onCalculateByteSize(): number;

    /**
     * Method to calculate the variable byte size of this type.
     *
     * @returns The variable byte size of the type.
     */
    protected abstract onCalculateVariableByteSize(): number;
}

/**
 * Type category enumeration for PGSL parser result types.
 * - 'numeric': Basic numeric types like integers and floats
 * - 'boolean': Boolean types
 * - 'struct': Structured types with multiple fields
 * - 'array': Array-like types including arrays, vectors, and matrices
 * - 'texture': Texture types for sampling in shaders
 * - 'sampler': Sampler types for texture sampling
 * - 'vector': Vector types representing multiple components (e.g., vec3)
 * - 'matrix': Matrix types representing 2D arrays of components (e.g., mat4)
 */
export type PgslParserResultTypeType = 'numeric' | 'boolean' | 'struct' | 'array' | 'texture' | 'sampler' | 'vector' | 'matrix';

/**
 * Alignment type enumeration defining how types should be aligned in memory.
 * - 'uniform': Alignment for uniform buffer usage
 * - 'storage': Alignment for storage buffer usage
 * - 'packed': Tightly packed alignment with minimal padding used in vertex buffers
 */
export type PgslParserResultTypeAlignmentType = 'uniform' | 'storage' | 'packed';
