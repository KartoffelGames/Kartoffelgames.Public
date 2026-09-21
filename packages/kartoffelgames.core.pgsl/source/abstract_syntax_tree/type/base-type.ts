import { Cst } from "../../concrete_syntax_tree/general.type.ts";
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

/**
 * Provides common functionality for type comparison, casting, and property management.
 */
export abstract class BaseType {
    private mShadowedType: BaseType;
    private mTypeKind: BaseTypeKind;
    private mTypeMeta: BaseTypeMeta;

    /**
     * The type that is being shadowed.
     * If it does not shadow another type, it is itself.
     * Mostlty used for buildin types with special side functionality.
     */
    public get shadowedType(): BaseType {
        return this.mShadowedType;
    }

    /**
     * Fast compareable type compatibility.
     */
    public get kind(): BaseTypeKind {
        return this.mTypeKind;
    }

    /**
     * Inner meta data of type, specified generic handling and fast compare type names.
     */
    public get meta(): BaseTypeMeta {
        return this.mTypeMeta;
    }

    /**
     * Constructor.
     * Create a new distinct type.
     * 
     * @param pTypeKind - Type functionality specification used for a fast compare.
     * @param pTypeMeta 
     * @param pShadowedType 
     */
    public constructor(pTypeKind: BaseTypeKind, pTypeMeta: BaseTypeMeta, pShadowedType?: BaseType) {
        this.mTypeKind = pTypeKind;
        this.mTypeMeta = pTypeMeta;

        // Either set shadowed type to this instance, or if its set to the specified one.
        this.mShadowedType = this;
        if(pShadowedType) {
            this.mShadowedType = pShadowedType;
        }
    }

    /**
     * Checks if this type is equal to the target type.
     * 
     * @param pTarget - The target type to compare against.
     * 
     * @returns True when both types describe the same type, false otherwise.
     */
    public abstract equals(pTarget: BaseType): boolean;

    /**
     * Checks if this type is implicitly castable into the target type.
     * Implicit casting happens automatically without explicit cast operations.
     * 
     * @param pTarget - The target type to check castability to.
     * 
     * @returns True when this type is implicitly castable into the target type, false otherwise.
     */
    public abstract isCastableInto(pTarget: BaseType): boolean;
}

/**
 * Inner types characterisitcs including an exact type name and possible strict or loose generic requirements. 
 */
export type BaseTypeMeta = {
    typeName: string;
    generics: Array<{
        restriction: {
            kind: BaseTypeKind,
            concreteType: Array<BaseType>;
        };
    }>;
};

/**
 * Every classification a PGSL type can carry, as one bitmask.
 */
export const BaseTypeKind = {
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

    // Implicit numerics.
    Integer: 1 << 14,
    Float: 1 << 15,
    SignedInteger: 1 << 16,
    UnsignedInteger: 1 << 17,
    Float16: 1 << 18,
    Abstract: 1 << 19,

    // Type capabilities.
    Scalar: 1 << 20,
    Composite: 1 << 21,
    Indexable: 1 << 22,
    Plain: 1 << 23,
    Concrete: 1 << 24,
    FixedFootprint: 1 << 25,
    Constructible: 1 << 26,
    HostShareable: 1 << 27,
    Storable: 1 << 28,
};

export type BaseTypeKind = typeof BaseTypeKind[keyof typeof BaseTypeKind];