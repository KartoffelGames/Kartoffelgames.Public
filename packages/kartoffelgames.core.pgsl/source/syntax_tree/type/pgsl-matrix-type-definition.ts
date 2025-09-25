import { Dictionary, Exception } from '@kartoffelgames/core';
import { BasePgslTypeDefinition, BasePgslTypeDefinitionSyntaxTreeValidationAttachment } from './base-pgsl-type-definition.ts';
import { PgslVectorTypeDefinition } from './pgsl-vector-type-definition.ts';
import { PgslMatrixTypeName } from "./enum/pgsl-matrix-type-name.enum.ts";
import { PgslVectorTypeName } from "./enum/pgsl-vector-type-name.enum.ts";
import { BasePgslSyntaxTreeMeta } from "../base-pgsl-syntax-tree.ts";
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { PgslBaseTypeName } from "./enum/pgsl-base-type-name.enum.ts";
import { PgslNumericTypeDefinition } from "./pgsl-numeric-type-definition.ts";
import { PgslNumericTypeName } from "./enum/pgsl-numeric-type-name.enum.ts";
import { PgslFileMetaInformation } from "../pgsl-file-meta-information.ts";

/**
 * Matrix type definition.
 */
export class PgslMatrixTypeDefinition extends BasePgslTypeDefinition<PgslMatrixTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
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

    private readonly mInnerType: BasePgslTypeDefinition;
    private readonly mMatrixType: PgslMatrixTypeName;
    private readonly mVectorTypeDefinition: PgslVectorTypeDefinition;

    /**
     * Inner type of matrix.
     */
    public get innerType(): BasePgslTypeDefinition {
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
    public get vectorType(): PgslVectorTypeDefinition {
        return this.mVectorTypeDefinition;
    }

    /**
     * Constructor.
     * 
     * @param pMatixType - Matrix dimension type.
     * @param pInnerType - Inner type of matrix.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMatixType: PgslMatrixTypeName, pInnerType: BasePgslTypeDefinition, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mInnerType = pInnerType;
        this.mMatrixType = pMatixType;

        // Append inner type to child list.
        this.appendChild(this.mInnerType);

        // Create underlying vector type.
        this.mVectorTypeDefinition = new PgslVectorTypeDefinition(PgslMatrixTypeDefinition.mVectorTypeMapping.get(this.mMatrixType)!, this.mInnerType, pMeta);

        // Set vector type as child syntax.
        this.appendChild(this.mVectorTypeDefinition);
    }

    /**
     * Transpile the syntax tree into wgsl.
     * 
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled wgsl code.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
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
        return `${lMatrixDimensionName}<${this.mInnerType.transpile(pTrace)}>`;
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);
        
        // Must both be a matrix.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Matrix) {
            return false;
        }

        // Cast to matrix attachment as we now know it is one.
        const lMatrixTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslMatrixTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // Inner type must be equal.
        if (!this.mInnerType.equals(pValidationTrace, lMatrixTargetAttachment.innerType)) {
            return false;
        }

        // Vector dimensions must be equal.
        return this.mMatrixType === lMatrixTargetAttachment.dimension;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public override isExplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);
        
        // Must both be a matrix.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Matrix) {
            return false;
        }

        // Cast to matrix attachment as we now know it is one.
        const lMatrixTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslMatrixTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // If matrix dimensions are not equal, it is not castable.
        if (this.mMatrixType !== lMatrixTargetAttachment.dimension) {
            return false;
        }

        // It is when inner types are.
        return this.mInnerType.isExplicitCastableInto(pValidationTrace, lMatrixTargetAttachment.innerType);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pValidationTrace - Validation trace.
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    public override isImplicitCastableInto(pValidationTrace: PgslValidationTrace, pTarget: BasePgslTypeDefinition): boolean {
        // Read attachments from target type.
        const lTargetAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(pTarget);
        
        // Must both be a matrix.
        if (lTargetAttachment.baseType !== PgslBaseTypeName.Matrix) {
            return false;
        }

        // Cast to matrix attachment as we now know it is one.
        const lMatrixTargetAttachment = lTargetAttachment as BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslMatrixTypeDefinitionSyntaxTreeAdditionalAttachmentData>;

        // If matrix dimensions are not equal, it is not castable.
        if (this.mMatrixType !== lMatrixTargetAttachment.dimension) {
            return false;
        }

        // It is when inner types are.
        return this.mInnerType.isImplicitCastableInto(pValidationTrace, lMatrixTargetAttachment.innerType);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslValidationTrace): BasePgslTypeDefinitionSyntaxTreeValidationAttachment<PgslMatrixTypeDefinitionSyntaxTreeAdditionalAttachmentData> {
        // Validate inner and vector type.
        this.mInnerType.validate(pValidationTrace);
        this.mVectorTypeDefinition.validate(pValidationTrace);

        // Read attachments from inner type.
        const lInnerTypeAttachment: BasePgslTypeDefinitionSyntaxTreeValidationAttachment = pValidationTrace.getAttachment(this.mInnerType);

        // Must be scalar.
        if (PgslNumericTypeDefinition.IsCastable(pValidationTrace, "implicit", this.mInnerType, PgslNumericTypeName.Float)) {
            pValidationTrace.pushError('Matrix type must be a Float', this.meta, this);
        }

        return {
            baseType: PgslBaseTypeName.Matrix,
            concrete: true,
            scalar: false,
            plain: true,

            // Always accessible as composite (swizzle) or index.
            composite: true,
            indexable: true,
            
            // Copy of inner type attachment.
            storable: lInnerTypeAttachment.storable,
            hostShareable: lInnerTypeAttachment.hostShareable,
            constructible: lInnerTypeAttachment.constructible,
            fixedFootprint: lInnerTypeAttachment.fixedFootprint,

            // Additional data.
            innerType: this.mInnerType,
            dimension: this.mMatrixType,
        };
    }
}

export type PgslMatrixTypeDefinitionSyntaxTreeAdditionalAttachmentData = {
    innerType: BasePgslTypeDefinition;
    dimension: PgslMatrixTypeName;
};