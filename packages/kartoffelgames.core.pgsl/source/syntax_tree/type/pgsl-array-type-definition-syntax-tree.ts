import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree, PgslExpressionSyntaxTreeValidationAttachment } from "../expression/base-pgsl-expression-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslNumericTypeName } from "./enum/pgsl-numeric-type-name.enum.ts";
import { PgslNumericTypeDefinitionSyntaxTree } from "./pgsl-numeric-type-definition-syntax-tree.ts";

/**
 * Array type definition.
 */
export class PgslArrayTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslArrayTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
    private readonly mInnerType: BasePgslTypeDefinitionSyntaxTree;
    private readonly mLengthExpression: BasePgslExpressionSyntaxTree | null;

    /**
     * Inner type of array.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Length expression of array.
     */
    public get length(): BasePgslExpressionSyntaxTree | null {
        return this.mLengthExpression;
    }

    /**
     * Constructor.
     * 
     * @param pType - Inner array type.
     * @param pLengthExpression - Length expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pType: BasePgslTypeDefinitionSyntaxTree, pLengthExpression: BasePgslExpressionSyntaxTree | null) {
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
    protected override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);
        
        // Must both be arrays.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Array) {
            return false;
        }

        // Cast to array attachment as we now know it is one.
        const lArrayTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslArrayTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // Must have the same inner type.
        if (!BasePgslTypeDefinitionSyntaxTree.equals(pValidationTrace, this.mInnerType, lArrayTargetAttachment.innerType)) {
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
    protected override isExplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // A array is never explicit.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    protected override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: BasePgslTypeDefinitionSyntaxTree): boolean {
        // Must be fixed.
        if (!this.mLengthExpression) {
            return false;
        }

        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);
        
        // Must both be arrays.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Array) {
            return false;
        }

        // Cast to array attachment as we now know it is one.
        const lArrayTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslArrayTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // When inner types are implicit castable.
        return PgslArrayTypeDefinitionSyntaxTree.implicitCastable(pValidationTrace, this.mInnerType, lArrayTargetAttachment.innerType);
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
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslArrayTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
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
            if (!PgslNumericTypeDefinitionSyntaxTree.IsCastable(pValidationTrace, "implicit", lLengthExpressionAttachment.resolveType, PgslNumericTypeName.AbstractInteger)) {
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
    innerType: BasePgslTypeDefinitionSyntaxTree;
    lengthExpression: BasePgslExpressionSyntaxTree | null;
};