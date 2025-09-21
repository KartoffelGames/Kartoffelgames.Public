import { BasePgslSyntaxTree, BasePgslSyntaxTreeMeta, SyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslNumericTypeName } from "./enum/pgsl-numeric-type-name.enum.ts";
import { PgslMatrixTypeDefinitionSyntaxTreeAdditionalAttachmentData } from "./pgsl-matrix-type-definition-syntax-tree.ts";

/**
 * Numeric type definition.
 */
export class PgslNumericTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslNumberTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
    /**
     * Create a numeric type definition syntax tree.
     * 
     * @param pNumericType - Contrete numeric type.
     * @param pMeta - Optional existing meta data.
     * 
     * @returns Numeric type definition syntax tree. 
     */
    public static type(pNumericType: PgslNumericTypeName, pMeta?: SyntaxTreeMeta): PgslNumericTypeDefinitionSyntaxTree {
        // Create or convert existing metadata.
        let lTreeMetaData: BasePgslSyntaxTreeMeta = BasePgslSyntaxTree.emptyMeta();
        if (pMeta) {
            lTreeMetaData = {
                range: [pMeta.position.start.line, pMeta.position.start.column, pMeta.position.end.line, pMeta.position.end.column],
                buildIn: false
            };
        }

        return new PgslNumericTypeDefinitionSyntaxTree(pNumericType, lTreeMetaData);
    }

    /**
     * Check if type is castable into another numeric type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pMode - Cast mode.
     * @param pType - Source type.
     * @param pTargetType - Target numeric type.
     * 
     * @returns true when type is castable.
     */
    public static IsCastable(pValidationTrace: PgslSyntaxTreeValidationTrace, pMode: "implicit" | "explicit", pType: BasePgslTypeDefinitionSyntaxTree, pTargetType: PgslNumericTypeName): boolean {
        // Create and validate temporary numeric type.
        const lNumberType: PgslNumericTypeDefinitionSyntaxTree = PgslNumericTypeDefinitionSyntaxTree.type(pTargetType).validate(pValidationTrace);

        // Check castability.
        switch (pMode) {
            case "implicit": {
                return BasePgslTypeDefinitionSyntaxTree.implicitCastable(pValidationTrace, pType, lNumberType);
            }
            case "explicit": {
                return BasePgslTypeDefinitionSyntaxTree.explicitCastable(pValidationTrace, pType, lNumberType);
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
    protected override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);
        const lThisAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this);
        
        // Must both the same numeric type.
        if (lTargetAttachment.baseType !== lThisAttachment.baseType) {
            return false;
        }

        // Cast to numeric attachment as we now know it is one.
        const lNumericTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslNumberTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        return this.mNumericType !== lNumericTargetAttachment.numericType;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    protected override isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
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
    protected override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // An abstract float is castable into all all types.
        if (this.mNumericType === PgslNumericTypeName.AbstractFloat) {
            return true;
        }

        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);

        // Target type must be a numeric type.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Float && lTargetAttachment.baseType !== PgslBaseTypeName.Integer) {
            return false;
        }

        // Cast to numeric attachment as we now know it is one.
        const lNumericTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslNumberTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // An abstract int is only castable into all integer types.
        if (this.mNumericType === PgslNumericTypeName.AbstractInteger) {
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
    protected override onValidateIntegrity(_pScope: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslNumberTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
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