/**
 * Provides common functionality for type comparison, casting, and property management.
 */
export abstract class BasePgslType {
    private readonly mTypeKind: BasePgslTypeKind;
    private readonly mTypeMeta: BasePgslTypeMeta;

    /**
     * Fast compareable type compatibility.
     */
    public get kind(): BasePgslTypeKind {
        return this.mTypeKind;
    }

    /**
     * Inner meta data of type, specified generic handling and fast compare type names.
     */
    public get meta(): BasePgslTypeMeta {
        return this.mTypeMeta;
    }

    /**
     * Constructor.
     * Create a new distinct type.
     * 
     * @param pTypeKind - Type functionality specification used for a fast compare.
     * @param pTypeMeta
     */
    public constructor(pTypeKind: BasePgslTypeKind, pTypeMeta: BasePgslTypeMeta) {
        this.mTypeKind = pTypeKind;
        this.mTypeMeta = pTypeMeta;
    }

    /**
     * Wether this type accept the specifed types value.
     * 
     * @param pType - Source type.
     * 
     * @returns true when this type can be assinged 
     */
    public accepts(pType: BasePgslType): boolean {
        // Fast check reference. A type allways accepts itself.
        if (pType === this) {
            return true;
        }

        return pType.conversionRankTo(this) !== Number.POSITIVE_INFINITY;
    }

    /**
     * Whether this type is of kind.
     * 
     * @param pKind - Kind flag.
     * 
     * @returns true if its meats the kind requirements or false otherwise. 
     */
    public isKind(pKind: BasePgslTypeKind): boolean {
        return (this.mTypeKind & pKind) === pKind;
    }

    /**
     * Both types share the same type kind and must be the same class.
     * 
     * @param pType - Type object.
     * 
     * @returns true if both types share the same type kind. 
     */
    protected isSameTypeClass(pType: BasePgslType): pType is this {
        return (this.mTypeKind & BasePgslTypeKind.AllType) === (pType.kind & BasePgslTypeKind.AllType);
    }

    /**
     * Get this types convertion rank to another type.
     * Implicit casting should happen automatically without explicit cast operations.
     * A convertion rank of zero means they the same type, a conversion rank of infinity means there is no valid conversation.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns the conversation rank from this type to the specified.
     */
    public abstract conversionRankTo(pTarget: BasePgslType): number;

    /**
     * Checks if this type is equal to the target type.
     * 
     * @param pTarget - The target type to compare against.
     * 
     * @returns True when both types describe the same type, false otherwise.
     */
    public abstract equals(pTarget: BasePgslType): pTarget is this;
}

/**
 * Inner types characterisitcs including an exact type name and possible strict or loose generic requirements. 
 */
export type BasePgslTypeMeta = {
    typeName: string;
    generics?: Array<BasePgslType>;
};

/**
 * Every classification a PGSL type can carry, as one bitmask.
 */
export const BasePgslTypeKind = {
    None: 0,

    // Actual types.
    Numeric: 1 << 0,
    Boolean: 1 << 1,
    String: 1 << 2,
    Void: 1 << 3,
    Invalid: 1 << 4,
    Vector: 1 << 5,
    Matrix: 1 << 6,
    Array: 1 << 7,
    Pointer: 1 << 8,
    Struct: 1 << 9,
    Enum: 1 << 10,
    Texture: 1 << 11,
    Sampler: 1 << 12,

    // All type.
    AllType: 0b1111111111111,

    // Implicit numerics.
    Integer: 1 << 14,
    Float: 1 << 15,
    SignedInteger: 1 << 16,
    UnsignedInteger: 1 << 17,
    Float16: 1 << 18,
    Float32: 1 << 19,
    Abstract: 1 << 20,

    // Type capabilities.
    Scalar: 1 << 21,
    Composite: 1 << 22,
    Indexable: 1 << 23,
    Plain: 1 << 24,
    Concrete: 1 << 25,
    FixedFootprint: 1 << 26,
    Constructible: 1 << 27,
    HostShareable: 1 << 28,
    Storable: 1 << 29,
};

export type BasePgslTypeKind = typeof BasePgslTypeKind[keyof typeof BasePgslTypeKind];