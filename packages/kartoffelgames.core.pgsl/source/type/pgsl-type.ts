import { PgslTrace } from "../trace/pgsl-trace.ts";

/**
 * Abstract base class for all PGSL types.
 * Provides common functionality for type comparison, casting, and property management.
 */
export abstract class PgslType {
    private readonly mTrace: PgslTrace;
    private mTypeProperties: PgslTypeProperties | null;

    /**
     * Gets whether this type value is storable in a variable.
     * 
     * @returns True if the value can be stored in a variable, false otherwise.
     */
    public get storable(): boolean {
        return this.getTypeProperties().storable;
    }

    /**
     * Gets whether this type is sharable with the host environment.
     * 
     * @returns True if the type can be shared with the host, false otherwise.
     */
    public get hostShareable(): boolean {
        return this.getTypeProperties().hostShareable;
    }

    /**
     * Gets whether this declaration is a composite type.
     * 
     * @returns True if this is a composite type, false otherwise.
     */
    public get composite(): boolean {
        return this.getTypeProperties().composite;
    }

    /**
     * Gets whether this type is constructible.
     * A constructible type can be created, loaded, stored, passed into functions, and returned from functions.
     * 
     * @returns True if the type is constructible, false otherwise.
     */
    public get constructible(): boolean {
        return this.getTypeProperties().constructible;
    }

    /**
     * Gets whether this type has a fixed byte length.
     * 
     * @returns True if the type has a fixed footprint, false otherwise.
     */
    public get fixedFootprint(): boolean {
        return this.getTypeProperties().fixedFootprint;
    }

    /**
     * Gets whether this is a composite value with properties that can be accessed by index.
     * 
     * @returns True if the type is indexable, false otherwise.
     */
    public get indexable(): boolean {
        return this.getTypeProperties().indexable;
    }

    /**
     * Gets whether this type is concrete.
     * A concrete type is not abstract and does not contain any abstract types.
     * 
     * @returns True if the type is concrete, false otherwise.
     */
    public get concrete(): boolean {
        return this.getTypeProperties().concrete;
    }

    /**
     * Gets whether this type is scalar.
     * A scalar type is a type that has a single value.
     * 
     * @returns True if the type is scalar, false otherwise.
     */
    public get scalar(): boolean {
        return this.getTypeProperties().scalar;
    }

    /**
     * Gets whether this type is plain.
     * A plain type is either a scalar type, an atomic type, or a composite type.
     * 
     * @returns True if the type is plain, false otherwise.
     */
    public get plain(): boolean {
        return this.getTypeProperties().plain;
    }

    /**
     * Creates a new PGSL type instance.
     * 
     * @param pTrace - The trace context for type analysis and validation.
     */
    public constructor(pTrace: PgslTrace) {
        this.mTrace = pTrace;
        this.mTypeProperties = null;
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

    /**
     * Collects and returns the type properties for this type.
     * This method is called by derived classes to define the characteristics of their type.
     * 
     * @param pValidationTrace - The validation trace context for property collection.
     * 
     * @returns The type properties that define this type's characteristics.
     */
    protected abstract onTypePropertyCollection(pValidationTrace: PgslTrace): PgslTypeProperties;

    /**
     * Gets the type properties, initializing them if necessary.
     * This method ensures type properties are collected only once and cached for subsequent access.
     * 
     * @returns The type properties for this type.
     */
    private getTypeProperties(): PgslTypeProperties {
        if (this.mTypeProperties === null) {
            this.mTypeProperties = this.onTypePropertyCollection(this.mTrace);
        }
        return this.mTypeProperties;
    }
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