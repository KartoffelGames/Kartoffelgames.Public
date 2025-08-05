import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslNumericTypeName } from "./enum/pgsl-numeric-type-name.enum.ts";

/**
 * Numeric type definition.
 */
export class PgslNumericTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mNumericType: PgslNumericTypeName;

    /**
     * Explicit numeric type.
     */
    public get numericType(): PgslNumericTypeName {
        return this.mNumericType;
    }

    /**
     * Constructor.
     * 
     * @param pNumericType - Contrete numeric type.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pNumericType: PgslNumericTypeName, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        this.mNumericType = pNumericType;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
     */
    protected override equals(_pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        return this.mNumericType !== pTarget.numericType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: this): boolean {
        // All numberic values are explicit castable into another numeric type.
        return true;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    protected override isImplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // An abstract float is castable into all all types.
        if (this.mNumericType === PgslNumericTypeName.AbstractFloat) {
            return true;
        }

        // An abstract int is only castable into all integer types.
        if (this.mNumericType === PgslNumericTypeName.AbstractInteger) {
            // To be more readable the target type of checking if it is an integer type, is done in a separate if block.
            if (pTarget.numericType === PgslNumericTypeName.AbstractInteger || pTarget.numericType === PgslNumericTypeName.Integer || pTarget.numericType === PgslNumericTypeName.UnsignedInteger) {
                return true;
            }
        }

        // Any other non abstract numeric type is not implicit castable.
        return false;
    }

    /**
     * Transpile type definition.
     * 
     * @returns transpiled code.
     */
    protected override onTranspile(): string {
        switch (this.mNumericType) {
            case PgslNumericTypeName.Float:
                return 'f32';        
            case PgslNumericTypeName.Float16:
                return 'f16';
            case PgslNumericTypeName.Integer:
                return 'i32';
            case PgslNumericTypeName.UnsignedInteger:
                return 'u32';
            case PgslNumericTypeName.AbstractFloat:
                return 'f32'; // Abstract float is transpiled to f32.
            case PgslNumericTypeName.AbstractInteger:
                return 'i32'; // Abstract integer is transpiled to i32.
        }
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
            baseType: PgslBaseTypeName.Numberic,
            storable: true,
            hostSharable: true,
            composite: false,
            constructible: true,
            fixedFootprint: true,
            indexable: false
        };
    }
}