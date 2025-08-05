import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Boolean type definition.
 */
export class PgslStringTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    /**
     * Check if type is equal to target type.
     * 
     * @param _pValidationTrace - Validation trace to use.
     * @param _pTarget - Target type.
     * 
     * @returns true when both types describes the same type.
     */
    protected override equals(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: this): boolean {
        // String type is always equal to itself.
        return true;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace to use.
     * @param _pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    protected override isExplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: this): boolean {
        // A string is never explicit nor implicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace to use.
     * @param _pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    protected override isImplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: this): boolean {
        // A string is never explicit nor implicit castable.
        return false;
    }

    /**
     * Transpile type definition.
     * 
     * @returns transpiled code.
     */
    protected override onTranspile(): string {
        // String type is not transpiled.
        return 'string';
    }

    /**
     * Validate syntax tree integrity.
     * 
     * @param _pScope - Validation scope.
     * 
     * @returns validation attachment.
     */
    protected override onValidateIntegrity(_pScope: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<undefined> {
        return {
            additional: undefined,
            baseType: PgslBaseTypeName.String,
            storable: false,
            hostSharable: false,
            composite: false,
            constructible: false,
            fixedFootprint: false,
            indexable: false,
        };
    }
}