import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { BasePgslExpression, PgslExpressionSyntaxTreeValidationAttachment } from "../expression/base-pgsl-expression.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslNumericTypeName } from "./enum/pgsl-numeric-type-name.enum.ts";
import { PgslNumericTypeDefinition } from "./pgsl-numeric-type-definition.ts";

/**
 * Array type definition.
 */
export class PgslArrayTypeDefinition extends BasePgslTypeDefinition<PgslArrayTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
    private readonly mInnerType: BasePgslTypeDefinition;
    private readonly mLengthExpression: BasePgslExpression | null;

    /**
     * Inner type of array.
     */
    public get innerType(): BasePgslTypeDefinition {
        return this.mInnerType;
    }

    /**
     * Length expression of array.
     */
    public get length(): BasePgslExpression | null {
        return this.mLengthExpression;
    }

    /**
     * Constructor.
     * 
     * @param pType - Inner array type.
     * @param pLengthExpression - Length expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pType: BasePgslTypeDefinition, pLengthExpression: BasePgslExpression | null) {
        super(pMeta);

        this.mLengthExpression = pLengthExpression ?? null;
        this.mInnerType = pType;

        // Append inner type to child list.
        this.appendChild(this.mInnerType);
        if (this.mLengthExpression) {
            this.appendChild(this.mLengthExpression);
        }
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same comparison type.
     */
    public override equals(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);

        // Must both be arrays.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Array) {
            return false;
        }

        // Cast to array attachment as we now know it is one.
        const lArrayTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslArrayTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // Must have the same inner type.
        if (!this.mInnerType.equals(pValidationTrace, lArrayTargetAttachment.innerType)) {
            return false;
        }

        // Runtime sized arrays are always equal.
        if (!this.mLengthExpression && !lArrayTargetAttachment.lengthExpression) {
            return true;
        }

        // Must both be fixed or runtime sized.
        if (!this.mLengthExpression || !lArrayTargetAttachment.lengthExpression) {
            return false;
        }

        // TODO: How to compare expressions?
        // TODO: They are both fixed-sized with element counts specified as identifiers resolving to the same declaration of a pipeline-overridable constant.

        return true;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isExplicitCastableInto(_pValidationTrace: PgslValidationTrace, _pTarget: BasePgslTypeDefinition): boolean {
        // A array is never explicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isImplicitCastableInto(_pValidationTrace: PgslValidationTrace, _pTarget: BasePgslTypeDefinition): boolean {
        // A array is never implicit castable.
        return false;
    }

    /**
     * Transpile current type definition into a string.
     * 
     * @returns Transpiled string.
     */
    public override onTranspile(): string {
        // Transpile array type with fixed length.
        if (this.mLengthExpression) {
            return `array<${this.mInnerType.toString()}, ${this.mLengthExpression.transpile()}>`;
        }

        // Transpile array type without fixed length.
        return `array<${this.mInnerType.toString()}>`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslArrayTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
        // TODO: Fixed length from const expressions are only valid on workgroup variables. ??? How.
        //       Do we need to split expressions into isConstant and isCompileConstant or so????

        // Validate inner type.
        this.mInnerType.validate(pValidationTrace);

        // Validate length expression when set.
        if (this.mLengthExpression) {
            this.mLengthExpression.validate(pValidationTrace);

            // Read expressions attachments.
            const lLengthExpressionAttachment: PgslExpressionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mLengthExpression);

            // Length expression must be an unsigned integer scalar.
            if (!PgslNumericTypeDefinition.IsCastable(pValidationTrace, "implicit", lLengthExpressionAttachment.resolveType, PgslNumericTypeName.AbstractInteger)) {
                pValidationTrace.pushError(`Array length expression must be of unsigned integer type.`, this.mLengthExpression.meta, this.mLengthExpression);
            }
        }

        // Read inner type attachment.
        const lInnerTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mInnerType);

        // Inner type must be plain.
        if (!lInnerTypeAttachment.plain) {
            pValidationTrace.pushError(`Array type must be a plain type.`, this.mInnerType.meta, this.mInnerType);
        }

        // Is fixed when length expression is set and inner type is fixed.
        const lIsFixed: boolean = (!this.mLengthExpression) ? false : lInnerTypeAttachment.fixedFootprint;

        // Is constructible when inner type is constructible and array is fixed.
        const lIsConstructible: boolean = (!lIsFixed) ? false : lInnerTypeAttachment.constructible;

        return {
            baseType: PgslBaseTypeName.Array,
            composite: false,
            indexable: true,
            plain: true,
            concrete: true,
            scalar: false,

            // Copy of inner type attachment.
            fixedFootprint: lIsFixed,
            constructible: lIsConstructible,
            storable: lInnerTypeAttachment.storable,
            hostShareable: lInnerTypeAttachment.hostShareable,

            // Inner type of array.
            innerType: this.mInnerType,
            lengthExpression: this.mLengthExpression,
        };
    }
}

export type PgslArrayTypeDefinitionSyntaxTreeAdditionalAttachmentData = {
    innerType: BasePgslTypeDefinition;
    lengthExpression: BasePgslExpression | null;
};