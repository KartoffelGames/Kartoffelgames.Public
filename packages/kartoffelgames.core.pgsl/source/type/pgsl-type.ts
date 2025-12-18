import { IAnyParameterConstructor } from "../../../kartoffelgames.core/source/interface/i-constructor.ts";
import { AbstractSyntaxTreeContext } from "../abstract_syntax_tree/abstract-syntax-tree-context.ts";

/**
 * Abstract base class for all PGSL types.
 * Provides common functionality for type comparison, casting, and property management.
 */
export abstract class PgslType {
    private mTypeProperties: PgslTypeProperties | null;

    /**
     * Gets whether this type value is storable in a variable.
     * 
     * @returns True if the value can be stored in a variable, false otherwise.
     */
    public get storable(): boolean {
        if (this.mTypeProperties === null) {
            throw new Error("Type properties not initialized.");
        }

        return this.mTypeProperties.storable;
    }

    /**
     * Gets whether this type is sharable with the host environment.
     * 
     * @returns True if the type can be shared with the host, false otherwise.
     */
    public get hostShareable(): boolean {
        if (this.mTypeProperties === null) {
            throw new Error("Type properties not initialized.");
        }

        return this.mTypeProperties.hostShareable;
    }

    /**
     * Gets whether this declaration is a composite type.
     * 
     * @returns True if this is a composite type, false otherwise.
     */
    public get composite(): boolean {
        if (this.mTypeProperties === null) {
            throw new Error("Type properties not initialized.");
        }

        return this.mTypeProperties.composite;
    }

    /**
     * Gets whether this type is constructible.
     * A constructible type can be created, loaded, stored, passed into functions, and returned from functions.
     * 
     * @returns True if the type is constructible, false otherwise.
     */
    public get constructible(): boolean {
        if (this.mTypeProperties === null) {
            throw new Error("Type properties not initialized.");
        }

        return this.mTypeProperties.constructible;
    }

    /**
     * Gets whether this type has a fixed byte length.
     * 
     * @returns True if the type has a fixed footprint, false otherwise.
     */
    public get fixedFootprint(): boolean {
        if (this.mTypeProperties === null) {
            throw new Error("Type properties not initialized.");
        }

        return this.mTypeProperties.fixedFootprint;
    }

    /**
     * Gets whether this is a composite value with properties that can be accessed by index.
     * 
     * @returns True if the type is indexable, false otherwise.
     */
    public get indexable(): boolean {
        if (this.mTypeProperties === null) {
            throw new Error("Type properties not initialized.");
        }

        return this.mTypeProperties.indexable;
    }

    /**
     * Gets whether this type is concrete.
     * A concrete type is not abstract and does not contain any abstract types.
     * 
     * @returns True if the type is concrete, false otherwise.
     */
    public get concrete(): boolean {
        if (this.mTypeProperties === null) {
            throw new Error("Type properties not initialized.");
        }

        return this.mTypeProperties.concrete;
    }

    /**
     * Gets whether this type is scalar.
     * A scalar type is a type that has a single value.
     * 
     * @returns True if the type is scalar, false otherwise.
     */
    public get scalar(): boolean {
        if (this.mTypeProperties === null) {
            throw new Error("Type properties not initialized.");
        }

        return this.mTypeProperties.scalar;
    }

    /**
     * Gets whether this type is plain.
     * A plain type is either a scalar type, an atomic type, or a composite type.
     * 
     * @returns True if the type is plain, false otherwise.
     */
    public get plain(): boolean {
        if (this.mTypeProperties === null) {
            throw new Error("Type properties not initialized.");
        }

        return this.mTypeProperties.plain;
    }

    /**
     * Creates a new PGSL type instance.
     * 
     * @param _pContext - The context of the type definition. Just to force the derived classes to use it.
     */
    public constructor(_pContext: AbstractSyntaxTreeContext) {
        this.mTypeProperties = null;
    }

    /**
     * Initializes the type properties by processing the provided context.
     * Must be called by derived classes during their construction.
     * 
     * @param pContext - The context of the type definition.
     */
    protected initType(pContext: AbstractSyntaxTreeContext): void {
        this.mTypeProperties = this.process(pContext);
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
     * @param pContext - The context of the type definition.
     * 
     * @returns The type properties that define this type's characteristics.
     */
    protected abstract process(pContext: AbstractSyntaxTreeContext): PgslTypeProperties;
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