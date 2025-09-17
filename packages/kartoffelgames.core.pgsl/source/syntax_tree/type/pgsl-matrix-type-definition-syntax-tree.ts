import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinitionSyntaxTree, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition-syntax-tree.ts';
import { PgslVectorTypeDefinitionSyntaxTree } from './pgsl-vector-type-definition-syntax-tree.ts';
import { PgslMatrixTypeName } from "./enum/pgsl-matrix-type-name.enum.ts";
import { PgslVectorTypeName } from "./enum/pgsl-vector-type-name.enum.ts";
import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";

/**
 * Matrix type definition.
 */
export class PgslMatrixTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree {
    /**
     * Matrix type to underlying vector type mapping.
     */
    private static readonly mVectorTypeMapping: Dictionary<PgslMatrixTypeName, PgslVectorTypeName> = (() => {
        // Create mapping for matrix type to vector type.
        const lMatrixToVectorMapping: Dictionary<PgslMatrixTypeName, PgslVectorTypeName> = new Dictionary<PgslMatrixTypeName, PgslVectorTypeName>();
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix22, PgslVectorTypeName.Vector2);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix23, PgslVectorTypeName.Vector3);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix24, PgslVectorTypeName.Vector4);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix32, PgslVectorTypeName.Vector2);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix33, PgslVectorTypeName.Vector3);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix34, PgslVectorTypeName.Vector4);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix42, PgslVectorTypeName.Vector2);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix43, PgslVectorTypeName.Vector3);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix44, PgslVectorTypeName.Vector4);

        return lMatrixToVectorMapping;
    })();

    private readonly mInnerType: BasePgslTypeDefinitionSyntaxTree;
    private readonly mMatrixType: PgslMatrixTypeName;
    private readonly mVectorTypeDefinition: PgslVectorTypeDefinitionSyntaxTree;

    /**
     * Inner type of matrix.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Matrix dimension type.
     */
    public get matrixDimension(): PgslMatrixTypeName {
        return this.mMatrixType;
    }

    /**
     * Inner vector type.
     */
    public get vectorType(): PgslVectorTypeDefinitionSyntaxTree {
        return this.mVectorTypeDefinition;
    }

    /**
     * Constructor.
     * 
     * @param pMatixType - Matrix dimension type.
     * @param pInnerType - Inner type of matrix.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMatixType: PgslMatrixTypeName, pInnerType: BasePgslTypeDefinitionSyntaxTree, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mInnerType = pInnerType;
        this.mMatrixType = pMatixType;

        // Append inner type to child list.
        this.appendChild(this.mInnerType);

        // Create underlying vector type.
        this.mVectorTypeDefinition = new PgslVectorTypeDefinitionSyntaxTree(PgslMatrixTypeDefinitionSyntaxTree.mVectorTypeMapping.get(this.mMatrixType)!, this.mInnerType, pMeta);

        // Set vector type as child syntax.
        this.appendChild(this.mVectorTypeDefinition);
    }

    /**
     * Transpile the syntax tree into wgsl.
     * 
     * @returns Transpiled wgsl code.
     */
    protected override onTranspile(): string {
        // Transpile matrix type dimension.
        const lMatrixDimensionName: string = (() => {
            switch (this.mMatrixType) {
                case PgslMatrixTypeName.Matrix22:
                    return 'mat2x2';
                case PgslMatrixTypeName.Matrix23:
                    return 'mat2x3';
                case PgslMatrixTypeName.Matrix24:
                    return 'mat2x4';
                case PgslMatrixTypeName.Matrix32:
                    return 'mat3x2';
                case PgslMatrixTypeName.Matrix33:
                    return 'mat3x3';
                case PgslMatrixTypeName.Matrix34:
                    return 'mat3x4';
                case PgslMatrixTypeName.Matrix42:
                    return 'mat4x2';
                case PgslMatrixTypeName.Matrix43:
                    return 'mat4x3';
                case PgslMatrixTypeName.Matrix44:
                    return 'mat4x4';
            }
        })();

        // Insert inner type as template parameter.
        return `${lMatrixDimensionName}<${this.mInnerType.transpile()}>`;
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
        if (!PgslMatrixTypeDefinitionSyntaxTree.equals(pValidationTrace, this.mInnerType, pTarget.innerType)) {
            return false;
        }

        // Vector dimensions must be equal.
        return this.mMatrixType === pTarget.matrixDimension;
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
        // If matrix dimensions are not equal, it is not castable.
        if (this.mMatrixType !== pTarget.matrixDimension) {
            return false;
        }

        // It is when inner types are.
        return PgslMatrixTypeDefinitionSyntaxTree.explicitCastable(pValidationTrace, this.mInnerType, pTarget.innerType);
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
        // If matrix dimensions are not equal, it is not castable.
        if (this.mMatrixType !== pTarget.matrixDimension) {
            return false;
        }

        // It is when inner types are.
        return PgslMatrixTypeDefinitionSyntaxTree.implicitCastable(pValidationTrace, this.mInnerType, pTarget.innerType);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment {
        // Validate inner and vector type.
        this.mInnerType.validate(pValidationTrace);
        this.mVectorTypeDefinition.validate(pValidationTrace);

        // Read attachments from inner type.
        const lInnerTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mInnerType);

        // Must be scalar.
        if (lInnerTypeAttachment.baseType !== PgslBaseTypeName.Numeric && lInnerTypeAttachment.baseType !== PgslBaseTypeName.Boolean) {
            pValidationTrace.pushError('Matrix type must be a scalar value', this.meta, this);
        }

        // TODO: Inner type must be of type float. 

        return {
            additional: undefined,
            baseType: PgslBaseTypeName.Matrix,

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