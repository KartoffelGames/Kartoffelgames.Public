import type { IAnyParameterConstructor } from '../../../../kartoffelgames.core/source/interface/i-constructor.ts';
import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

/**
 * Abstract base class for all PGSL types.
 * Provides common functionality for type comparison, casting, and property management.
 */
export abstract class PgslType extends AbstractSyntaxTree<TypeCst, PgslTypeProperties> {
    /**
     * Constructor.
     * Initializes a new PGSL type instance with default properties.
     */
    public constructor() {
        super({
            type: 'Type',
            range: [0, 0, 0, 0]
        });
    }

    /**
     * Checks if this type is equal to the target type.
     * 
     * @param pTarget - The target type to compare against.
     * 
     * @returns True when both types describe the same type, false otherwise.
     */
    public abstract equals(pTarget: PgslType): boolean;

    /**
     * Checks if this type is explicitly castable into the target type.
     * Explicit casting requires an explicit cast operation in the source code.
     * 
     * @param pTarget - The target type to check castability to.
     * 
     * @returns True when this type is explicitly castable into the target type, false otherwise.
     */
    public abstract isExplicitCastableInto(pTarget: PgslType): boolean;

    /**
     * Checks if this type is implicitly castable into the target type.
     * Implicit casting happens automatically without explicit cast operations.
     * 
     * @param pTarget - The target type to check castability to.
     * 
     * @returns True when this type is implicitly castable into the target type, false otherwise.
     */
    public abstract isImplicitCastableInto(pTarget: PgslType): boolean;
}

/**
 * Properties that define the characteristics and capabilities of a PGSL type.
 * These properties determine how the type can be used within the PGSL language.
 */
export type PgslTypeProperties = {
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
 * Constructor type for PGSL types.
 */
export type PgslTypeConstructor = IAnyParameterConstructor<PgslType>;