import type { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

/**
 * Provides common functionality for type comparison, casting, and property management.
 */
export interface IType extends AbstractSyntaxTree {
    /**
     * The type that is being shadowed.
     * If it does not shadow another type, it is itself.
     */
    readonly shadowedType: IType;

    /**
     * Declaration data.
     */
    readonly data: TypeProperties;

    /**
     * Checks if this type is equal to the target type.
     * 
     * @param pTarget - The target type to compare against.
     * 
     * @returns True when both types describe the same type, false otherwise.
     */
    equals(pTarget: IType): boolean;

    /**
     * Checks if this type is implicitly castable into the target type.
     * Implicit casting happens automatically without explicit cast operations.
     * 
     * @param pTarget - The target type to check castability to.
     * 
     * @returns True when this type is implicitly castable into the target type, false otherwise.
     */
    isCastableInto(pTarget: IType): boolean;
}

/**
 * Properties that define the characteristics and capabilities of a PGSL type.
 * These properties determine how the type can be used within the PGSL language.
 */
export type TypeProperties = {
    /**
     * List of type names associated with this type.
     * On float32 that would be ['float32', 'float', 'number'].
     * On vector3<float32> that would be ['vector3-float32', 'vector3-float', 'vector3-number', 'vector3', 'vector'].
     */
    metaTypes: Array<string>;

    /**
     * Value is storable in a variable.
     */
    storable: boolean;

    /**
     * Sharable with the host
     */
    hostShareable: boolean;

    /**
     * Declaration is a composite type.
     */
    composite: boolean;

    /**
     * Type is a constructable.
     * Meaning can be created, loaded, stored, passed into functions, and returned from functions.
     */
    constructible: boolean;

    /**
     * Type has a fixed byte length.
     */
    fixedFootprint: boolean;

    /**
     * composite value with properties that can be access by index
     */
    indexable: boolean;

    /**
     * Type is concrete, meaning it is not abstract or does not contain an abstract type.
     */
    concrete: boolean;

    /**
     * Type is scalar.
     * A scalar type is a type that has a single value.
     */
    scalar: boolean;

    /**
     * Type is plain.
     * A plain type is either a scalar type, an atomic type, or a composite type.
     */
    plain: boolean;
};

/**
 * Every classification a PGSL type can carry, as one bitmask.
 */
export const BaseTypeKind = (() => {
    // Type capabilities.
    const Scalar = 1 << 20;
    const Composite = 1 << 21;
    const Indexable = 1 << 22;
    const Plain = 1 << 23;

    // Actual types.
    const Numeric = 1 << 0 | Scalar | Plain;
    const Boolean = 1 << 1 | Scalar | Plain;
    const String = 1 << 2;
    const Void = 1 << 3;
    const Invalid = 1 << 4;
    const Vector = 1 << 5 | Composite | Indexable | Plain;
    const Matrix = 1 << 6 | Composite | Indexable | Plain;
    const Array = 1 << 7 | Indexable | Plain;
    const Pointer = 1 << 8;
    const Struct = 1 << 9 | Composite | Plain;
    const Enum = 1 << 10 | Composite;
    const Texture = 1 << 11;
    const Sampler = 1 << 12;

    // Marker
    const BuildIn = 1 << 13;

    // Implicit numerics.
    const Integer = 1 << 14 | Numeric;
    const Float = 1 << 15 | Numeric;
    const SignedInteger = 1 << 16 | Integer;
    const UnsignedInteger = 1 << 17 | Integer;
    const Float16 = 1 << 18 | Float;
    const Abstract = 1 << 19;

    return {
        Scalar, Composite, Indexable, Plain,
        Numeric, Boolean, String, Void, Invalid, Vector, Matrix, Array, Pointer, Struct, Enum, Texture, Sampler,
        BuildIn,
        Integer, Float, SignedInteger, UnsignedInteger, Float16, Abstract
    } as const;
})();

export type BaseTypeKind = typeof BaseTypeKind[keyof typeof BaseTypeKind];