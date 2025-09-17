import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslVectorTypeName } from "./enum/pgsl-vector-type-name.enum.ts";

/**
 * Vector type definition.
 */
export class PgslVectorTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    private readonly mInnerType: BasePgslTypeDefinitionSyntaxTree;
    private readonly mVectorType: PgslVectorTypeName;

    /**
     * Inner type of vector.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Vector dimension.
     */
    public get vectorDimension(): PgslVectorTypeName {
        return this.mVectorType;
    }

    /**
     * Constructor.
     * 
     * @param pVectorType - Concreate vector dimension.
     * @param pInnerType - Inner type of vector.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pVectorType: PgslVectorTypeName, pInnerType: BasePgslTypeDefinitionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mInnerType = pInnerType;
        this.mVectorType = pVectorType;

        // Append inner type to child list.
        this.appendChild(this.mInnerType);
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
     */
    protected override equals(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // Inner type must be equal.
        if (!PgslVectorTypeDefinitionSyntaxTree.equals(pValidationTrace, this.mInnerType, pTarget.innerType)) {
            return false;
        }

        // Vector dimensions must be equal.
        return this.mVectorType === pTarget.vectorDimension;
    }

    /**
     * Transpile the syntax tree into wgsl.
     * 
     * @returns Transpiled wgsl code.
     */
    protected override onTranspile(): string {
        // Transpile vector type dimenstion.
        const lVectorDimensionName: string = (() => {
            switch (this.mVectorType) {
                case PgslVectorTypeName.Vector2:
                    return 'vec2';
                case PgslVectorTypeName.Vector3:
                    return 'vec3';
                case PgslVectorTypeName.Vector4:
                    return 'vec4';
            }
        })();

        // Insert inner type as template parameter.
        return `${lVectorDimensionName}<${this.mInnerType.transpile()}>`;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    protected override isExplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // If vector dimensions are not equal, it is not castable.
        if (this.mVectorType !== pTarget.vectorDimension) {
            return false;
        }

        // It is when inner types are.
        return PgslVectorTypeDefinitionSyntaxTree.explicitCastable(pValidationTrace, this.mInnerType, pTarget.innerType);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    protected override isImplicitCastableInto(pValidationTrace: PgslSyntaxTreeValidationTrace, pTarget: this): boolean {
        // If vector dimensions are not equal, it is not castable.
        if (this.mVectorType !== pTarget.vectorDimension) {
            return false;
        }

        // It is when inner types are.
        return PgslVectorTypeDefinitionSyntaxTree.implicitCastable(pValidationTrace, this.mInnerType, pTarget.innerType);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // Validate inner type.
        this.mInnerType.validate(pValidationTrace);

        // Read attachments from inner type.
        const lInnerTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mInnerType);

        // Must be scalar.
        if (lInnerTypeAttachment.baseType !== PgslBaseTypeName.Numeric && lInnerTypeAttachment.baseType !== PgslBaseTypeName.Boolean) {
            pValidationTrace.pushError('Vector type must be a scalar value', this.meta, this);
        }

        return {
            additional: undefined,
            baseType: PgslBaseTypeName.Vector,

            // Always accessible as composite (swizzle) or index.
            composite: true,
            indexable: true,

            // Copy of inner type attachment.
            storable: lInnerTypeAttachment.storable,
            hostShareable: lInnerTypeAttachment.hostShareable,
            constructible: lInnerTypeAttachment.constructible,
            fixedFootprint: lInnerTypeAttachment.fixedFootprint,
        };
    }
}

export type PgslVectorTypeDefinitionSyntaxTreeStructureData = {
    typeName: PgslVectorTypeName;
    innerType: BasePgslTypeDefinitionSyntaxTree;
};