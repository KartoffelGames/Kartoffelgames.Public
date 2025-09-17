import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

// TODO: There are types that should not be transpiled, how do we handle them?

/**
 * PGSL base type definition.
 */
export abstract class BasePgslTypeDefinitionSyntaxTree<TAdditional extends object | undefined = undefined> extends BasePgslSyntaxTree<BasePgslTypeDefinitionSyntaxTreeValidationAttachment<TAdditional>> {
    /**
     * Check if set structure is equal to this structure.
     * 
     * @param pTarget - Target structure.
     * 
     * @returns if both structures are equal.
     */
    public static equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree, pSource: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Read attachments.
        const lSourceAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment<any> = pValidationTrace.getAttachment(pSource);
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment<any> = pValidationTrace.getAttachment(pTarget);

        // Same type.
        if (pTarget.constructor !== pSource.constructor) {
            return false;
        }

        // Same storable definition.
        if (lSourceAttachment.storable !== lTargetAttachment.storable) {
            return false;
        }

        // Same hostSharable definition.
        if (lSourceAttachment.hostShareable !== lTargetAttachment.hostShareable) {
            return false;
        }

        // Same composite definition.
        if (lSourceAttachment.composite !== lTargetAttachment.composite) {
            return false;
        }

        // Same constructable definition.
        if (lSourceAttachment.constructible !== lTargetAttachment.constructible) {
            return false;
        }

        // Same fixed footprintdefinition.
        if (lSourceAttachment.fixedFootprint !== lTargetAttachment.fixedFootprint) {
            return false;
        }

        // Same indexable definition.
        if (lSourceAttachment.indexable !== lTargetAttachment.indexable) {
            return false;
        }

        return true;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pFrom - Target type.
     */
    public static explicitCastable(pValidationTrace: PgslSyntaxTreeValidationTrace, pFrom: BasePgslTypeDefinitionSyntaxTree, pTo: BasePgslTypeDefinitionSyntaxTree): boolean {
        // When they are the same, they are castable.
        if (BasePgslTypeDefinitionSyntaxTree.equals(pValidationTrace, pFrom, pTo)) {
            return true;
        }

        // Should at least has the same base type.
        if (pFrom.constructor !== pTo.constructor) { // TODO: Thats fucked up. Remove same constructor check.
            return false;
        }

        return pFrom.isExplicitCastableInto(pValidationTrace, pTo);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    public static implicitCastable(pValidationTrace: PgslSyntaxTreeValidationTrace, pFrom: BasePgslTypeDefinitionSyntaxTree, pTo: BasePgslTypeDefinitionSyntaxTree): boolean {
        // When they are the same, they are castable.
        if (BasePgslTypeDefinitionSyntaxTree.equals(pValidationTrace, pFrom, pTo)) {
            return true;
        }

        // When they are not explicit castable, they never be able to implicit cast.
        if (!BasePgslTypeDefinitionSyntaxTree.explicitCastable(pValidationTrace, pFrom, pTo)) {  // TODO: Thats fucked up. Remove same constructor check.
            return false;
        }

        return pFrom.isImplicitCastableInto(pValidationTrace, pTo);
    }

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
    protected abstract equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean;

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace to use.
     * @param pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    protected abstract isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean;

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace to use.
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    protected abstract isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean;
}

export type BasePgslTypeDefinitionSyntaxTreeValidationAttachment<TAdditional extends object | undefined = undefined> = {
    /**
     * Types additional data.
     */
    additional: TAdditional;

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

    // TODO: Maybe a flag enum?
    // TODO: plain type or concrete type
};