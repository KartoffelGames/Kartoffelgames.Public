import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta, SyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslNumericTypeName } from "./enum/pgsl-numeric-type-name.enum.ts";

/**
 * Numeric type definition.
 */
export class PgslNumericTypeDefinition extends BasePgslTypeDefinition<PgslNumberTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
    /**
     * Create a numeric type definition syntax tree.
     * 
     * @param pNumericType - Contrete numeric type.
     * @param pMeta - Optional existing meta data.
     * 
     * @returns Numeric type definition syntax tree. 
     */
    public static type(pNumericType: PgslNumericTypeName, pMeta?: SyntaxTreeMeta): PgslNumericTypeDefinition {
        // Create or convert existing metadata.
        const lTreeMetaData: BasePgslSyntaxTreeMeta = pMeta ? BasePgslSyntaxTree.convertMeta(pMeta) : BasePgslSyntaxTree.emptyMeta();
        return new PgslNumericTypeDefinition(pNumericType, lTreeMetaData);
    }

    /**
     * Check if type is castable into another numeric type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pMode - Cast mode.
     * @param pFromType - Source type.
     * @param pToType - Target numeric type.
     * 
     * @returns true when type is castable.
     */
    public static IsCastable(pValidationTrace: PgslValidationTrace, pMode: "implicit" | "explicit", pFromType: BasePgslTypeDefinition, pToType: PgslNumericTypeName): boolean {
        // Create and validate temporary numeric type.
        const lToNumberType: PgslNumericTypeDefinition = PgslNumericTypeDefinition.type(pToType).validate(pValidationTrace);

        // Check castability.
        switch (pMode) {
            case "implicit": {
                return pFromType.isImplicitCastableInto(pValidationTrace, lToNumberType);
            }
            case "explicit": {
                return pFromType.isExplicitCastableInto(pValidationTrace, lToNumberType);
            }
        }
    }

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
    public override equals(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);
        const lThisAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this);

        // Must both the same numeric type.
        if (lTargetAttachment.baseType !== lThisAttachment.baseType) {
            return false;
        }

        // Cast to numeric attachment as we now know it is one.
        const lNumericTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslNumberTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // Must have the same numeric type.
        return this.mNumericType === lNumericTargetAttachment.numericType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    public override isExplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);

        // Target type must be a numeric type.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Float && lTargetAttachment.baseType !== PgslBaseTypeName.Integer) {
            return false;
        }

        // All numberic values are explicit castable into another numeric type.
        return true;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     */
    public override isImplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);

        // Target type must be a numeric type.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Float && lTargetAttachment.baseType !== PgslBaseTypeName.Integer) {
            return false;
        }

        // Cast to numeric attachment as we now know it is one.
        const lNumericTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslNumberTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        switch (this.mNumericType) {
            // An abstract float is castable into all all types.
            case PgslNumericTypeName.AbstractFloat: {
                return true;
            }

            // An abstract int is only castable into all integer types.
            case PgslNumericTypeName.AbstractInteger: {
                // List of all integer types.
                const lIntegerTypes: Array<PgslNumericTypeName> = [
                    PgslNumericTypeName.AbstractInteger,
                    PgslNumericTypeName.Integer,
                    PgslNumericTypeName.UnsignedInteger
                ];

                // To be more readable the target type of checking if it is an integer type, is done in a separate if block.
                if (lIntegerTypes.includes(lNumericTargetAttachment.numericType)) {
                    return true;
                }
            }
        }

        // Any other non abstract numeric type is only castable when they are the same type.
        return this.equals(pValidationTrace, pTarget);
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
     * @param _pTrace - Validation trace.
     * 
     * @returns validation attachment.
     */
    protected override onValidateIntegrity(_pTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslNumberTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
        // Determine base type.
        const lBaseType: PgslBaseTypeName = (() => {
            switch (this.mNumericType) {
                case PgslNumericTypeName.Float:
                case PgslNumericTypeName.AbstractFloat:
                case PgslNumericTypeName.Float16:
                    return PgslBaseTypeName.Float;

                case PgslNumericTypeName.Integer:
                case PgslNumericTypeName.UnsignedInteger:
                case PgslNumericTypeName.AbstractInteger:
                    return PgslBaseTypeName.Integer;
            }
        })();

        // A concrete numeric type is any type that is not abstract.
        const lIsConcrete: boolean = this.mNumericType !== PgslNumericTypeName.AbstractFloat && this.mNumericType !== PgslNumericTypeName.AbstractInteger;

        return {
            // Dynamic properties.
            baseType: lBaseType,
            concrete: lIsConcrete,

            storable: true,
            hostShareable: true,
            composite: false,
            constructible: true,
            fixedFootprint: true,
            indexable: false,
            scalar: true,
            plain: true,

            // Additional attachment data.
            numericType: this.mNumericType
        };
    }
}

export type PgslNumberTypeDefinitionSyntaxTreeAdditionalAttachmentData = {
    numericType: PgslNumericTypeName;
};