import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

// TODO: There are types that should not be transpiled, how do we handle them?

/**
 * PGSL base type definition.
 */
export abstract class BasePgslTypeDefinitionSyntaxTree<TAdditional extends object = {}> extends BasePgslSyntaxTree<BasePgslTypeDefinitionSyntaxTreeValidationAttachment<TAdditional>> {
    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);
    }

    /**
     * Check if type is equal to target type.
     * 
     * @param pValidationTrace - Validation trace to use.
     * @param pTarget - Target type.
     * 
     * @returns true when both types describes the same type.
     */
    public abstract equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean;

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace to use.
     * @param pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public abstract isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean;

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace to use.
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    public abstract isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean;
}

export type BasePgslTypeDefinitionSyntaxTreeValidationAttachment<TAdditional extends object = {}> = TAdditional &{
    /**
     * Base type of the type definition.
     */
    baseType: PgslBaseTypeName;

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