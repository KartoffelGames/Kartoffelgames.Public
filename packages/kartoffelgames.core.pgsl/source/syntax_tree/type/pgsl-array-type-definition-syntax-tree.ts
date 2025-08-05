import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { BasePgslExpressionSyntaxTree } from "../expression/base-pgsl-expression-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Array type definition.
 */
export class PgslArrayTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
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
    protected override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // Must have the same inner type.
        if (!BasePgslTypeDefinitionSyntaxTree.equals(pValidationTrace, this.mInnerType, pTarget.innerType)) {
            return false;
        }

        // Must have the same length expression.
        if (this.mLengthExpression && pTarget.length) {
            // TODO: How to compare expressions?
            return false;
        }

        // TODO: They are both fixed-sized with element counts specified as identifiers resolving to the same declaration of a pipeline-overridable constant.

        return true;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    protected override isExplicitCastableInto(_pValidationTrace: PgslSyntaxTreeValidationTrace, _pTarget: this): boolean {
        // A array is never explicit.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     */
    protected override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // Must be fixed.
        if (!this.mLengthExpression) {
            return false;
        }

        // When inner types are implicit castable.
        return PgslArrayTypeDefinitionSyntaxTree.implicitCastable(pValidationTrace, this.mInnerType, pTarget.innerType);
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
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // TODO: Fixed length from const expressions are only valid on workgroup variables. ??? How.
        //       Do we need to split expressions into isConstant and isCompileConstant or so????

        // Read inner type attachment.
        const lInnerTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mInnerType);

        // Is fixed when length expression is set and inner type is fixed.
        const lIsFixed: boolean = (!this.mLengthExpression) ? false : lInnerTypeAttachment.fixedFootprint;

        // Is constructible when inner type is constructible and array is fixed.
        const lIsConstructible: boolean = (!lIsFixed) ? false : lInnerTypeAttachment.constructible;

        return {
            additional: undefined,
            baseType: PgslBaseTypeName.Array,
            composite: false,
            indexable: true,

            // Copy of inner type attachment.
            fixedFootprint: lIsFixed,
            constructible: lIsConstructible,
            storable: lInnerTypeAttachment.storable,
            hostSharable: lInnerTypeAttachment.hostSharable
        };
    }
}