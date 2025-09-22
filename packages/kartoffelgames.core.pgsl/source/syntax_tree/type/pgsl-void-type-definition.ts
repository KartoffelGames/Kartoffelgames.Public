import { PgslTranspilationTrace } from "../pgsl-tranpilation-trace.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Void type definition.
 */
export class PgslVoidTypeDefinition extends BasePgslTypeDefinition {
    /**
     * Check if type is equal to target type.
     * 
     * @param _pValidationTrace - Validation trace to use.
     * @param _pTarget - Target type.
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(_pValidationTrace: PgslValidationTrace, _pTarget: BasePgslTypeDefinition): boolean {
        // Void type is always equal to itself.
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
    public override isExplicitCastableInto(_pValidationTrace: PgslValidationTrace, _pTarget: BasePgslTypeDefinition): boolean {
        // A void is never explicit nor implicit castable.
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
    public override isImplicitCastableInto(_pValidationTrace: PgslValidationTrace, _pTarget: BasePgslTypeDefinition): boolean {
        // A void is never explicit nor implicit castable.
        return false;
    }

    /**
     * Transpile type definition.
     * 
     * @param _pTrace - Transpilation scope.
     * 
     * @returns transpiled code.
     */
    protected override onTranspile(_pTrace: PgslTranspilationTrace): string {
        // Void type is not transpiled.
        return '';
    }

    /**
     * Validate syntax tree integrity.
     * 
     * @param _pTrace - Validation trace.
     * 
     * @returns validation attachment.
     */
    protected override onValidateIntegrity(_pTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        return {
            baseType: PgslBaseTypeName.Void,
            storable: false,
            hostShareable: false,
            composite: false,
            constructible: false,
            fixedFootprint: false,
            indexable: false,
            concrete: false,
            scalar: false,
            plain: false
        };
    }
}